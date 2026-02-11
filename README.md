# QR Redirect System

Sistema de redirección con códigos QR usando Sanity + Next.js. Permite crear documentos con imágenes, videos, textos y generar QRs automáticamente.

## 🚀 Características

- ✅ Generación automática de QR al publicar documentos en Sanity
- ✅ Soporte para múltiples tipos de contenido: imágenes, videos, textos, galerías
- ✅ Redirect rápido usando Edge Runtime de Vercel
- ✅ Páginas públicas para cada documento
- ✅ Soporte para URLs externas o páginas internas
- ✅ Todo gratis con free tiers de Sanity y Vercel

## 📦 Instalación

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-11
```

**Para obtener tus credenciales:**
1. Ve a [sanity.io](https://sanity.io) y crea una cuenta
2. Crea un nuevo proyecto
3. Copia el **Project ID** y el **Dataset** (normalmente es "production")

### 3. Ejecutar en desarrollo

```bash
pnpm dev
```

Luego abre:
- **Next.js**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

## 📝 Uso

### Crear un documento

1. Abre Sanity Studio en `http://localhost:3000/studio`
2. Click en "Create new" → "Documento"
3. Completa:
   - **Título**: Nombre del documento
   - **Slug**: Se genera automáticamente desde el título
   - **Descripción**: Texto descriptivo
   - **Contenido**: Texto enriquecido con imágenes y videos embebidos
   - **Imagen principal**: Imagen destacada
   - **Galería de imágenes**: Múltiples imágenes
   - **Videos**: URLs de videos (YouTube, Vimeo, etc.)
   - **URL Externa** (opcional): Si quieres que el QR redirija a una URL externa

4. Click en **"Publish"**
5. El QR se generará automáticamente y aparecerá en el campo "Código QR"
6. Descarga el QR usando el botón "Descargar QR"

### Probar el redirect

1. Escanea el QR o visita `http://localhost:3000/r/[document-id]`
2. Serás redirigido a:
   - La página pública del documento (`/documentos/[slug]`), o
   - La URL externa si especificaste una

## 🏗️ Estructura del proyecto

```
qrs/
├── app/
│   ├── r/[id]/route.ts          # Endpoint de redirect (Edge Runtime)
│   ├── documentos/[slug]/       # Página pública del documento
│   └── studio/                  # Sanity Studio embebido
├── sanity/
│   ├── schemaTypes/
│   │   └── document.ts          # Schema del documento
│   └── plugins/
│       ├── qr-code-plugin.tsx   # Plugin que genera QR automáticamente
│       └── qr-code-field.tsx     # Componente que muestra el QR
└── lib/
    └── sanity/
        └── client.ts            # Cliente de Sanity
```

## 🚢 Deploy

### Vercel

1. Conecta tu repositorio a Vercel
2. Agrega estas variables de entorno:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_BASE_URL` (tu dominio de Vercel, ej: `https://tu-proyecto.vercel.app`)
   - `NEXT_PUBLIC_SANITY_API_VERSION`

3. Deploy automático desde Git

**Importante**: Después del deploy, actualiza `NEXT_PUBLIC_BASE_URL` en Sanity Studio para que los QRs apunten a tu dominio de producción.

## 💰 Costos

- **Sanity**: Gratis hasta 10k documentos, 5GB assets
- **Vercel**: Gratis para proyectos personales
- **Total**: $0 para empezar 🎉

## 🛠️ Tecnologías

- **Next.js 16** - Framework React
- **Sanity 4** - CMS headless
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **QRCode** - Generación de códigos QR
- **Portable Text** - Contenido enriquecido

## 📚 Tipos de contenido soportados

- ✅ Texto enriquecido (títulos, párrafos, listas, links)
- ✅ Imágenes individuales
- ✅ Galería de imágenes
- ✅ Videos embebidos (YouTube, Vimeo, etc.)
- ✅ Archivos (PDFs, documentos)
- ✅ URLs externas para redirects personalizados

## 🔧 Troubleshooting

### El QR no se genera automáticamente

- Verifica que `NEXT_PUBLIC_BASE_URL` esté configurado correctamente
- Revisa la consola del navegador en Sanity Studio para ver errores
- Asegúrate de que el documento tenga un `_id` válido

### El redirect no funciona

- Verifica que el documento esté publicado (no en draft)
- Revisa que el `_id` del documento sea correcto
- Verifica las variables de entorno en producción

### Error al cargar imágenes

- Verifica que las credenciales de Sanity sean correctas
- Asegúrate de que el proyecto tenga permisos de lectura pública o configura un token

## 📄 Licencia

MIT
