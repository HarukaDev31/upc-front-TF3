# 🎬 Sistema de Cine - Frontend

Sistema de reserva de asientos en tiempo real para un cine, desarrollado con **Nuxt 3** y **Vue 3**.

## ✨ Características

### 🔐 **Sistema de Autenticación**
- Registro de usuarios con validación
- Login con persistencia de sesión
- Middleware de protección de rutas
- Gestión de estado de autenticación

### 🪑 **Selección de Asientos en Tiem Real**
- WebSocket para sincronización en tiempo real
- Selección/deselección de asientos
- Estados visuales: disponible, seleccionado, ocupado, confirmado
- Persistencia de selecciones en el servidor
- Reconexión automática del WebSocket

### 🎨 **Interfaz Moderna**
- Diseño responsive con Tailwind CSS
- Gradientes y efectos visuales atractivos
- Componentes reutilizables
- Experiencia de usuario optimizada

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend API corriendo en `http://localhost:8000`

### Pasos de instalación

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
cp .env.example .env

# Editar .env con las URLs correctas
API_BASE_URL=http://localhost:8000
WEBSOCKET_URL=ws://localhost:8000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
upc-front-TF3/
├── components/          # Componentes Vue reutilizables
│   └── AppHeader.vue   # Header principal con navegación
├── composables/         # Composables Vue 3
│   ├── useAuth.ts      # Gestión de autenticación
│   ├── useApi.ts       # Cliente HTTP para API
│   └── useWebSocket.ts # Gestión de WebSocket
├── layouts/            # Layouts de la aplicación
│   ├── default.vue     # Layout principal
│   └── auth.vue        # Layout para páginas de auth
├── middleware/         # Middleware de rutas
│   ├── auth.ts         # Protección de rutas autenticadas
│   └── guest.ts        # Protección de rutas para invitados
├── pages/             # Páginas de la aplicación
│   ├── auth/          # Páginas de autenticación
│   │   ├── login.vue  # Página de login
│   │   └── register.vue # Página de registro
│   └── funciones/     # Páginas de funciones
│       └── [id]/
│           └── asientos.vue # Selección de asientos
├── stores/            # Stores de Pinia
└── types/             # Definiciones de tipos TypeScript
```

## 🔧 Configuración

### Variables de Entorno

```env
# API Backend
API_BASE_URL=http://localhost:8000

# WebSocket
WEBSOCKET_URL=ws://localhost:8000
```

### Configuración de Nuxt

El proyecto está configurado para:
- **SSR deshabilitado** (CSR para mejor rendimiento)
- **Tailwind CSS** para estilos
- **Nuxt UI** para componentes
- **Pinia** para gestión de estado
- **VueUse** para utilidades

## 🎯 Uso del Sistema

### 1. **Registro/Login**
- Navegar a `/auth/register` para crear cuenta
- Navegar a `/auth/login` para iniciar sesión
- Los datos se validan contra la API real

### 2. **Selección de Asientos**
- Navegar a `/funciones/[id]/asientos`
- Seleccionar asientos haciendo clic
- Ver estados en tiempo real
- Continuar a la compra cuando esté listo

### 3. **Estados de Asientos**
- **Gris**: Disponible
- **Morado**: Seleccionado por ti
- **Rojo**: Ocupado por otro usuario
- **Verde**: Confirmado

## 🔌 Integración con API

### Endpoints Utilizados

#### Autenticación
- `POST /api/v1/usuarios/registro` - Registro de usuario
- `POST /api/v1/usuarios/login` - Login de usuario

#### Selección de Asientos
- `POST /api/v1/selecciones/` - Crear selección
- `POST /api/v1/selecciones/{id}/cancelar` - Cancelar selección
- `GET /api/v1/selecciones/funcion/{id}` - Obtener selecciones por función

#### WebSocket
- `ws://localhost:8000/ws/funciones/{funcion_id}/asientos`

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint

# Type checking
npm run typecheck
```

### Tecnologías Utilizadas

- **Nuxt 3** - Framework Vue.js
- **Vue 3** - Framework de JavaScript
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS
- **Nuxt UI** - Componentes UI
- **Pinia** - Gestión de estado
- **VueUse** - Utilidades Vue

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Seguridad

- Middleware de autenticación en rutas protegidas
- Validación de formularios en frontend y backend
- Tokens de autenticación
- Protección CSRF

## 🚀 Despliegue

### Producción

```bash
# Build
npm run build

# Servir archivos estáticos
npm run preview
```

### Docker (opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ usando Nuxt 3 y Vue 3**
