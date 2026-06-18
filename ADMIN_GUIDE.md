# 🔐 Admin Panel Guide

## Overview

Tu nuevo admin panel permite gestionar todo el contenido de **oryxen.tech** sin tocar código.

## Architecture

```
data/
├── projects.json    ← Productos + repositorios
├── stack.json       ← Tech stack
└── config.json      ← Config general

js/
├── render.js        ← Carga JSON e inyecta en HTML
└── script.js        ← Lógica de UI (existente)

admin/
├── index.html       ← Panel admin
└── admin.js         ← Lógica del admin
```

## 🚀 Getting Started

### 1. Acceder al Admin Panel

```
https://oryxen.tech/admin/
```

**Contraseña**: La primera vez que accedas, ingresa una contraseña nueva (mínimo 12 caracteres) para configurar el panel.

### 2. Agregar un Nuevo Proyecto

1. Click en tab **Products**
2. Click en **+ Add Product**
3. Completa los campos:
   - **Title**: Nombre del proyecto (e.g., "MyAwesomeApp")
   - **ID**: Slug en minúsculas (e.g., "myawesomeapp") — *usado para URLs*
   - **Status**: "Live" o "Coming Soon"
   - **Icon**: Un emoji
   - **Description**: 2-3 líneas cortas
   - **Tags**: Habilidades/tecnologías (click "Add Tag")
   - **URL** (opcional): Link al proyecto
   - **Link Label**: Texto del botón (default: "Visit Project")

4. Click **Save Product**

✅ **El sitio se actualiza automáticamente**

### 3. Editar un Proyecto

1. Tab **Products**
2. Click **Edit** en la tarjeta del proyecto
3. Modifica lo que necesites
4. Click **Save Product**

### 4. Eliminar un Proyecto

1. Tab **Products**
2. Click **Delete** en la tarjeta
3. Confirma

---

## 📚 Agregar Repositorios

**Exactamente igual que productos**, pero en el tab **Repositories**

---

## 🛠️ Tools Tab

### Export Data
Descarga todos tus datos como `oryxen-data-2025-05-07.json`

**Útil para**: backup, migración, compartir con equipo

### Import Data
Sube un JSON para reemplazar todos los datos

**⚠️ WARNING**: Esto sobrescribe TODO. Siempre haz backup primero.

### Reload Data
Recarga los datos desde el servidor (si editaste manualmente)

---

## 💾 Cómo Funciona la Persistencia

### Development (Local)

1. Los datos se guardan en **localStorage** (navegador)
2. Si cierras todo, los datos se pierden
3. **Solución**: Exporta regularmente

### Production (Real)

Para que sea permanente en producción, necesitas:

**Opción A: Simple** (Recomendada para MVP)
- Guarda JSONs en `/data/` manualmente
- El admin solo es para edición local
- Haz commit a Git después de cambios

**Opción B: Backend**
- Crea un endpoint `/api/save` que guarde JSONs
- El admin.js hará POST en vez de localStorage
- Más robusto pero más complejo

**Opción C: Database**
- Supabase / Firebase
- CMS profesional (Sanity, Contentful)
- Para proyectos grandes

---

## 🔒 Seguridad

### ⚠️ NO hagas esto:

- ❌ Dejar contraseña por defecto en producción
- ❌ Hospedar admin públicamente sin auth real
- ❌ Guardar contraseña en código

### ✅ DO:

- ✅ Cambia la contraseña: `admin/admin.js` línea 10
- ✅ En producción, usa Basic Auth + HTTPS
- ✅ Considera limitarlo a IP whitelisted
- ✅ Para sitios públicos: requiere login proper (OAuth/JWT)

---

## 📝 Cambiar Contraseña

1. Abre el panel en `/admin/`
2. Ve a la pestaña **Settings** → **Change Password**
3. Ingresa la contraseña actual y la nueva (mín. 12 caracteres)
4. La nueva contraseña se guarda en localStorage de tu navegador

---

## 🐛 Troubleshooting

### "Data failed to load"
- Verifica que `/data/projects.json` exista
- Revisa la consola (F12) para errores

### "Changes don't appear en el sitio"
- Asegúrate de hacer Click en "Save"
- Abre el sitio en otra pestaña (data está en localStorage)
- O usa "Export" y verifica el JSON manualmente

### Perdí mis cambios
- Si cerraste el navegador sin guardar: usa Export/Import backup
- Siempre haz **Export** después de cambios importantes

---

## 📊 Workflow Típico

```
1. Abre admin → Login
2. Edita proyecto / añade repo
3. Click Save
4. Verifica en otra pestaña (oryxen.tech)
5. Tab Tools → Export Data
6. Commit a Git: git add . && git commit -m "Update projects"
7. Push a main
8. Site deploya automáticamente (si tienes CI/CD)
```

---

## 🚀 Próximos Pasos

### Corto Plazo (Implementación)

- [ ] Cambia la contraseña en `admin/admin.js`
- [ ] Prueba agregar/editar un proyecto
- [ ] Verifica que aparezca en homepage

### Mediano Plazo (Mejoras)

- [ ] Backend endpoint para persistencia
- [ ] Email notifications (proyecto nuevo → te notifica)
- [ ] Preview en vivo en el admin
- [ ] Historial de cambios / versioning

### Largo Plazo (Escalabilidad)

- [ ] Multiidioma en admin
- [ ] Usuarios múltiples (roles)
- [ ] Analytics integrado
- [ ] CMS profesional (Sanity/Contentful)

---

## 💡 Tips & Tricks

### Rápidamente clonar un proyecto
1. Edit existente → Copia descrip
2. + Add Product
3. Pega y modifica

### Ordenar proyectos
Los JSONs mantienen el orden de array. Edita manualmente si necesitas reordenar

### Backup automático
```bash
# En tu máquina local
cp data/projects.json data/projects.backup.json
git add . && git commit -m "Backup projects"
```

---

## 📞 Support

Si algo no funciona:

1. Abre **DevTools** (F12) → Console
2. Busca mensajes de error rojo
3. Verifica que los JSONs existan en `/data/`
4. Haz un export y revisa el contenido

---

**Version**: 1.0  
**Last Updated**: 2025-05-07  
**Built with ❤️ for Oryxen Labs**
