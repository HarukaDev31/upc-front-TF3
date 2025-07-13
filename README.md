# Cinemax - Sistema de Cine

Un sistema moderno de gestión de cine construido con **Nuxt 3**, **Tailwind CSS** y **Nuxt UI**. El sistema permite a los usuarios explorar películas, reservar asientos y completar compras de entradas de manera intuitiva.

## 🎬 Características

### Para Usuarios
- **Exploración de Películas**: Catálogo completo con filtros por género, fecha y búsqueda
- **Selección de Asientos**: Mapa interactivo de la sala con selección visual de asientos
- **Proceso de Compra**: Formulario completo con múltiples métodos de pago
- **Métricas en Tiempo Real**: Estadísticas de ocupación y rendimiento
- **Diseño Responsivo**: Experiencia optimizada para móviles y desktop

### Para Administradores
- **Dashboard de Métricas**: Análisis detallado de ventas y ocupación
- **Ranking de Películas**: Estadísticas de rendimiento por película
- **Gestión de Salas**: Monitoreo de ocupación en tiempo real
- **Reportes**: Tendencias y análisis de comportamiento

## 🛠️ Tecnologías

- **Frontend**: Nuxt 3 (Vue 3 + TypeScript)
- **UI Framework**: Nuxt UI + Tailwind CSS
- **State Management**: Pinia
- **Icons**: Heroicons
- **Build Tool**: Vite

## 📁 Estructura del Proyecto

```
upc-front-TF3/
├── components/          # Componentes reutilizables
├── composables/         # Composables de Vue (useApi, etc.)
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas de la aplicación
│   ├── index.vue       # Página principal
│   ├── peliculas/      # Gestión de películas
│   ├── funciones/      # Selección de asientos
│   ├── comprar.vue     # Proceso de compra
│   └── metricas.vue    # Dashboard de métricas
├── stores/             # Stores de Pinia
├── types/              # Tipos TypeScript
├── public/             # Archivos estáticos
└── nuxt.config.ts      # Configuración de Nuxt
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd upc-front-TF3
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
echo "API_BASE_URL=http://localhost:8000" > .env
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📋 Endpoints de la API

El sistema está diseñado para trabajar con los siguientes endpoints:

### Endpoints Básicos
- `GET /` - Bienvenida
- `GET /health` - Health check

### Gestión de Películas
- `GET /api/v1/peliculas` - Listar películas
- `GET /api/v1/peliculas/{id}/funciones` - Funciones de película
- `POST /api/v1/buscar-peliculas` - Buscar películas

### Gestión de Funciones
- `GET /api/v1/funciones/{id}/asientos` - Asientos de función

### Compra de Entradas
- `POST /api/v1/comprar-entrada` - Comprar entrada

### Métricas y Analytics
- `GET /api/v1/metricas/ranking-peliculas` - Ranking de películas
- `GET /api/v1/metricas/ocupacion/{id}` - Ocupación de sala

## 🎨 Características del Diseño

### Paleta de Colores
- **Primario**: Purple (500-600)
- **Secundario**: Pink (400-500)
- **Acentos**: Green, Blue, Orange para métricas
- **Neutros**: Gray (50-900)

### Componentes UI
- **Botones**: UButton con variantes y estados
- **Formularios**: UInput, USelect, UFormGroup
- **Modales**: UModal para confirmaciones
- **Iconos**: Heroicons integrados
- **Navegación**: Responsive con menú móvil

### Responsive Design
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: CSS Grid y Flexbox
- **Typography**: Escala tipográfica consistente

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# API Configuration
API_BASE_URL=http://localhost:8000

# Build Configuration
NODE_ENV=development
```

### Configuración de Nuxt
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Client-side rendering
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  // ... más configuración
})
```

## 📱 Páginas Principales

### 1. Página Principal (`/`)
- Hero section con llamadas a la acción
- Películas destacadas
- Estadísticas generales
- Características del cine

### 2. Catálogo de Películas (`/peliculas`)
- Lista paginada de películas
- Filtros por género, fecha
- Búsqueda por texto
- Ordenamiento por rating

### 3. Detalle de Película (`/peliculas/{id}`)
- Información completa de la película
- Funciones disponibles
- Trailer (si está disponible)
- Botones de acción

### 4. Selección de Asientos (`/funciones/{id}/asientos`)
- Mapa interactivo de la sala
- Selección visual de asientos
- Resumen de compra
- Estados de asientos (disponible, ocupado, reservado)

### 5. Proceso de Compra (`/comprar`)
- Formulario de datos del cliente
- Métodos de pago
- Resumen de la compra
- Confirmación de pago

### 6. Métricas (`/metricas`)
- Dashboard de estadísticas
- Ranking de películas
- Ocupación de salas
- Tendencias y análisis

## 🎯 Funcionalidades Clave

### Gestión de Estado
- **Pinia Store**: Estado global para películas, asientos, carrito
- **Composables**: Lógica reutilizable (useApi, etc.)
- **Reactive Data**: Vue 3 Composition API

### Navegación
- **Vue Router**: Navegación programática
- **Active Links**: Indicadores de página activa
- **Breadcrumbs**: Navegación contextual

### Validación
- **Formularios**: Validación en tiempo real
- **Estados**: Loading, error, success
- **Feedback**: Mensajes de confirmación

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
npm run preview
```

### Variables de Producción
```env
API_BASE_URL=https://api.cinemax.com
NODE_ENV=production
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Equipo de Desarrollo** - *Trabajo inicial* - [Cinemax Team]

## 🙏 Agradecimientos

- **Nuxt Team** - Por el excelente framework
- **Tailwind CSS** - Por el sistema de diseño
- **Nuxt UI** - Por los componentes hermosos
- **Heroicons** - Por los iconos increíbles

---

**Cinemax** - Transformando la experiencia cinematográfica 🎬✨
