from dataclasses import dataclass
from decimal import Decimal, ROUND_DOWN

FEE_RATE = Decimal('0.05')
OPEN = 'open'
CLAIMED = 'claimed'
DELIVERED = 'delivered'
COMPLETED = 'completed'
EXPIRED = 'expired'


def micros(value: Decimal) -> int:
    return int((value * Decimal('1000000')).quantize(Decimal('1'), rounding=ROUND_DOWN))


@dataclass
class Wallets:
    poster: int
    worker: int = 0
    escrow: int = 0
    community: int = 0


@dataclass
class Job:
    reward_i64: int
    fee_i64: int
    status: str = OPEN

    @property
    def escrow_i64(self) -> int:
        return self.reward_i64 + self.fee_i64


def post_job(wallets: Wallets, reward_rtc: str) -> Job:
    reward = Decimal(reward_rtc)
    if reward < Decimal('0.01') or reward > Decimal('10000'):
        raise ValueError('reward outside RIP-302 bounds')
    reward_i64 = micros(reward)
    fee_i64 = int(reward_i64 * Decimal('0.05'))
    total = reward_i64 + fee_i64
    if wallets.poster < total:
        raise ValueError('insufficient poster balance')
    wallets.poster -= total
    wallets.escrow += total
    return Job(reward_i64=reward_i64, fee_i64=fee_i64)


def claim(job: Job) -> None:
    if job.status != OPEN:
        raise ValueError('only open jobs can be claimed')
    job.status = CLAIMED


def deliver(job: Job) -> None:
    if job.status != CLAIMED:
        raise ValueError('only claimed jobs can be delivered')
    job.status = DELIVERED


def accept(job: Job, wallets: Wallets) -> None:
    if job.status != DELIVERED:
        raise ValueError('only delivered jobs can be accepted')
    wallets.escrow -= job.escrow_i64
    wallets.worker += job.reward_i64
    wallets.community += job.fee_i64
    job.status = COMPLETED


def expire(job: Job, wallets: Wallets) -> None:
    if job.status not in (OPEN, CLAIMED):
        raise ValueError('only open/claimed jobs are refundable on expiry')
    wallets.escrow -= job.escrow_i64
    wallets.poster += job.escrow_i64
    job.status = EXPIRED


def rtc(i64: int) -> str:
    return f'{i64 / 1_000_000:.6f}'


def scenario_happy_path() -> None:
    wallets = Wallets(poster=micros(Decimal('25')))
    initial = wallets.poster
    job = post_job(wallets, '10')
    assert rtc(wallets.poster) == '14.500000'
    assert rtc(wallets.escrow) == '10.500000'
    claim(job)
    deliver(job)
    accept(job, wallets)
    assert job.status == COMPLETED
    assert rtc(wallets.worker) == '10.000000'
    assert rtc(wallets.community) == '0.500000'
    assert wallets.escrow == 0
    assert initial - wallets.poster == job.escrow_i64
    print('happy_path: PASS')
    print(f'  status={job.status} poster={rtc(wallets.poster)} worker={rtc(wallets.worker)} community={rtc(wallets.community)} escrow={rtc(wallets.escrow)}')


def scenario_expiry_refund() -> None:
    wallets = Wallets(poster=micros(Decimal('25')))
    initial = wallets.poster
    job = post_job(wallets, '4')
    claim(job)
    expire(job, wallets)
    assert job.status == EXPIRED
    assert wallets.poster == initial
    assert wallets.escrow == 0
    print('expiry_refund: PASS')
    print(f'  status={job.status} poster={rtc(wallets.poster)} escrow={rtc(wallets.escrow)}')


def scenario_invalid_transition() -> None:
    wallets = Wallets(poster=micros(Decimal('25')))
    job = post_job(wallets, '2')
    try:
        deliver(job)
    except ValueError as exc:
        assert str(exc) == 'only claimed jobs can be delivered'
        print('invalid_transition: PASS')
        print(f'  rejected={exc}')
        return
    raise AssertionError('invalid transition was not rejected')


if __name__ == '__main__':
    scenario_happy_path()
    scenario_expiry_refund()
    scenario_invalid_transition()
