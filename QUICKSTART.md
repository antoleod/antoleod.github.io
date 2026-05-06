# ⚡ QUICKSTART — Admin Panel

## 3 Pasos para Empezar

### 1️⃣ Cambiar Contraseña
```bash
Abre: admin/admin.js
Línea 3: const ADMIN_PASSWORD = 'oryxen2024';
Cámbialo a tu contraseña segura
```

### 2️⃣ Acceder al Admin
```
URL: http://localhost:8000/admin/
Login: (tu contraseña nueva)
```

### 3️⃣ Crear tu Primer Proyecto
```
1. Tab "Products" → Click "+ Add Product"
2. Completa:
   - Title: "Mi Proyecto"
   - ID: "mi-proyecto" (minúsculas, sin espacios)
   - Icon: 🚀
   - Description: "Una descripción corta"
   - Status: "Live"
   - Tags: "React", "JavaScript"
   - URL: "https://..."
3. Click "Save Product"
4. ✅ Aparece en homepage automáticamente
```

---

## 📋 Checklist de Uso

- [ ] Cambié la contraseña en `admin/admin.js`
- [ ] Accedí a `/admin/` correctamente
- [ ] Agregué/edité un proyecto
- [ ] Verificar que aparezca en homepage
- [ ] Exporté data (Tools tab)
- [ ] Reemplacé `data/projects.json` (opcional)
- [ ] Hice git commit de cambios

---

## 🎯 Workflows Rápidos

### Agregar Proyecto Nuevo
```
Admin → Products → + Add Product → Completa → Save
✅ Listo (aparece en homepage)
```

### Agregar Repositorio
```
Admin → Repositories → + Add Repository → Completa → Save
✅ Listo (aparece en "Open Source" section)
```

### Exportar & Guardar en Git
```
Admin → Tools → Export All Data → descarga .json
→ Reemplaza data/projects.json
→ git add . && git commit -m "Update projects"
→ git push
```

### Restaurar desde Backup
```
Admin → Tools → Import Data → Sube .json anterior
→ Done (todos tus datos vuelven)
```

---

## 🔑 Contraseñas & Credenciales

**Admin Panel Password**: Cámbiala en `admin/admin.js` línea 3

⚠️ **IMPORTANTE**: 
- No commits contraseña a Git
- En producción, usa vars de entorno
- Para máxima seguridad, usa OAuth/JWT

---

## 🐛 Si Algo No Funciona

### Productos no aparecen en homepage
1. Abre DevTools (F12)
2. Revisa console para errores
3. Verifica que `js/render.js` exista
4. Verifica que `data/projects.json` tenga datos válidos

### Admin no carga datos
1. Verifica que `data/projects.json` exista
2. Abre console (F12) para ver error específico
3. Recarga página (Ctrl+Shift+R)
4. Limpia cache: `localStorage.clear()`

### Cambios desaparecen al recargar
**Normal en development** (data en localStorage)
- Solución: Exporta JSON regularmente
- O: Implementa backend endpoint (próxima fase)

---

## 📚 Documentación Completa

Para más detalles, lee:
- **ADMIN_GUIDE.md** — Guía detallada del admin panel
- **IMPLEMENTATION_SUMMARY.md** — Resumen técnico completo

---

## 💪 Próximas Mejoras

Cuando estés listo:
- [ ] Backend endpoint para persistencia
- [ ] Multi-user authentication
- [ ] Preview en vivo
- [ ] Versioning/historial

Pero por ahora, ¡el admin ya es totalmente funcional! 🚀

---

**Ready?** → Abre `/admin/` y crea tu primer proyecto ✨
