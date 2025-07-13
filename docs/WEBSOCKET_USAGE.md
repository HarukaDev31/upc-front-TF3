# Guía de Uso del Sistema WebSocket

## Descripción

El sistema WebSocket implementado permite la selección de asientos en tiempo real para el sistema de cine. Los usuarios pueden seleccionar asientos temporalmente (por 5 minutos) y ver las selecciones de otros usuarios en tiempo real.

## Arquitectura

- **Puerto**: 8001
- **URL Base**: `ws://localhost:8001/ws/{client_id}`
- **Almacenamiento**: Redis para persistencia y sincronización entre instancias
- **Expiración**: Las selecciones expiran automáticamente después de 5 minutos

## Configuración

### Variables de Entorno

```bash
# URL del servidor WebSocket
WEBSOCKET_URL=ws://localhost:8001

# URL de la API principal
API_BASE_URL=http://localhost:8000
```

### Configuración en nuxt.config.ts

```typescript
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    websocketUrl: process.env.WEBSOCKET_URL || 'ws://localhost:8001'
  }
}
```

## Uso del Composable useWebSocket

### Importación

```typescript
import { useWebSocket } from '~/composables/useWebSocket'
```

### Estado Disponible

```typescript
const {
  // Estado de conexión
  isConnected,        // boolean - Si está conectado
  isConnecting,       // boolean - Si está conectando
  error,             // string | null - Error de conexión
  currentRoom,       // string | null - Sala actual
  selectedSeats,     // Set<string> - Asientos seleccionados por el usuario
  otherSelections,   // Map<string, SeatSelection> - Selecciones de otros usuarios
  clientId,         // string - ID único del cliente
  
  // Métodos principales
  connect,           // Conectar al WebSocket
  disconnect,        // Desconectar WebSocket
  send,             // Enviar mensaje
  on,               // Suscribirse a eventos
  off,              // Desuscribirse de eventos
  
  // Métodos de sala
  joinRoom,         // Unirse a una sala
  leaveRoom,        // Salir de la sala actual
  
  // Métodos de asientos
  selectSeat,       // Seleccionar asiento
  releaseSeat,      // Liberar asiento
  isSeatAvailable,  // Verificar si asiento está disponible
  isSeatSelectedByMe, // Verificar si asiento está seleccionado por el usuario
  isSeatSelectedByOther, // Verificar si asiento está seleccionado por otro
  getOtherSelectionInfo, // Obtener info de selección de otro usuario
  
  // Utilidades
  ping,             // Enviar ping
  getConnectionState // Obtener estado de conexión
} = useWebSocket()
```

### Ejemplo Básico

```vue
<template>
  <div>
    <div>Estado: {{ isConnected ? 'Conectado' : 'Desconectado' }}</div>
    <button @click="connectWebSocket">Conectar</button>
    <button @click="joinRoom('funcion_123')">Unirse a Sala</button>
  </div>
</template>

<script setup>
const {
  isConnected,
  connect,
  joinRoom,
  selectSeat,
  releaseSeat
} = useWebSocket()

const connectWebSocket = () => {
  connect('/ws')
}

const handleSeatClick = (seatId) => {
  if (isConnected.value) {
    selectSeat(seatId, { name: 'Usuario', email: 'user@example.com' })
  }
}
</script>
```

## Protocolo de Mensajes

### Mensajes de Cliente a Servidor

#### 1. Unirse a Sala
```javascript
{
  type: "join_room",
  room_id: "funcion_123"
}
```

#### 2. Salir de Sala
```javascript
{
  type: "leave_room",
  room_id: "funcion_123"
}
```

#### 3. Seleccionar Asiento
```javascript
{
  type: "select_seat",
  room_id: "funcion_123",
  seat_id: "A1",
  user_info: {
    name: "Juan Pérez",
    email: "juan@example.com"
  }
}
```

#### 4. Liberar Asiento
```javascript
{
  type: "release_seat",
  room_id: "funcion_123",
  seat_id: "A1"
}
```

#### 5. Ping
```javascript
{
  type: "ping"
}
```

### Mensajes de Servidor a Cliente

#### 1. Confirmación de Unión a Sala
```javascript
{
  type: "room_joined",
  room_id: "funcion_123",
  client_id: "user_1234567890"
}
```

#### 2. Confirmación de Salida de Sala
```javascript
{
  type: "room_left",
  room_id: "funcion_123",
  client_id: "user_1234567890"
}
```

#### 3. Asiento Seleccionado
```javascript
{
  type: "seat_selected",
  seat_id: "A1",
  room_id: "funcion_123",
  client_id: "user_1234567890",
  user_info: {
    name: "Juan Pérez",
    email: "juan@example.com"
  }
}
```

#### 4. Asiento Liberado
```javascript
{
  type: "seat_released",
  seat_id: "A1",
  room_id: "funcion_123",
  client_id: "user_1234567890"
}
```

#### 5. Selecciones Actuales (al unirse)
```javascript
{
  type: "current_selections",
  selections: [
    {
      client_id: "user_9876543210",
      seat_id: "A3",
      room_id: "funcion_123",
      user_info: {
        name: "María García",
        email: "maria@example.com"
      },
      timestamp: "2024-01-15T10:25:00.000Z",
      expires_at: "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 6. Pong
```javascript
{
  type: "pong",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

## Componente SeatSelection

### Uso Básico

```vue
<template>
  <SeatSelection 
    :funcion-id="funcionId" 
    :user-info="{ name: 'Usuario', email: 'user@example.com' }"
  />
</template>

<script setup>
const funcionId = ref('funcion_123')
</script>
```

### Props

- `funcionId` (string, requerido): ID de la función/sala
- `userInfo` (object, opcional): Información del usuario
  - `name` (string): Nombre del usuario
  - `email` (string): Email del usuario

### Características

- **Grid de asientos**: 10 filas (A-J) x 15 columnas
- **Estados visuales**: Disponible, seleccionado por ti, seleccionado por otro
- **Leyenda**: Explicación de los colores
- **Lista de selecciones**: Muestra tus asientos seleccionados
- **Información de otros usuarios**: Muestra asientos seleccionados por otros
- **Estado de conexión**: Indicador visual del estado de la conexión

## Manejo de Eventos

### Suscribirse a Eventos

```typescript
const { on } = useWebSocket()

// Evento específico
on('seat_selected', (data) => {
  console.log('Asiento seleccionado:', data)
})

// Todos los eventos
on('*', (data) => {
  console.log('Evento recibido:', data)
})
```

### Desuscribirse de Eventos

```typescript
const { off } = useWebSocket()

const handleSeatSelected = (data) => {
  console.log('Asiento seleccionado:', data)
}

// Suscribirse
on('seat_selected', handleSeatSelected)

// Desuscribirse
off('seat_selected', handleSeatSelected)
```

## Manejo de Errores

### Reconexión Automática

El composable maneja automáticamente la reconexión en caso de desconexión inesperada:

```typescript
// Se reconecta automáticamente cada 3 segundos
// Solo si la desconexión no fue intencional (código !== 1000)
```

### Heartbeat

Se envía un ping automático cada 30 segundos para mantener la conexión activa:

```typescript
// Se inicia automáticamente cuando se conecta
// Se detiene cuando se desconecta
```

### Manejo de Errores

```typescript
const { error, isConnected } = useWebSocket()

// Observar errores
watch(error, (newError) => {
  if (newError) {
    console.error('Error de WebSocket:', newError)
    // Mostrar notificación al usuario
  }
})

// Observar estado de conexión
watch(isConnected, (connected) => {
  if (!connected) {
    // Mostrar indicador de desconexión
    // Ofrecer opción de reconectar
  }
})
```

## Página de Prueba

### Acceso

Navega a `/asientos-test` para probar la funcionalidad.

### Características de Prueba

- **Configuración dinámica**: Cambia el ID de función y nombre de usuario
- **Logs en tiempo real**: Ve todos los eventos WebSocket
- **Múltiples pestañas**: Simula diferentes usuarios
- **Información de cliente**: Muestra el ID único del cliente

### Instrucciones de Prueba

1. Abre la página en múltiples pestañas
2. Usa el mismo ID de función en todas las pestañas
3. Selecciona asientos en diferentes pestañas
4. Observa la sincronización en tiempo real
5. Revisa los logs para ver los eventos

## Consideraciones de Producción

### Seguridad

```typescript
// Implementar autenticación
const userToken = getAuthToken()
const wsUrl = `${baseUrl}/ws/${clientId}?token=${userToken}`

// Validar permisos
const canAccessRoom = (roomId) => {
  // Verificar si el usuario puede acceder a esta sala
  return userHasPermission(userId, roomId)
}
```

### Escalabilidad

```typescript
// Usar múltiples instancias
const wsUrl = getWebSocketUrl() // Balanceador de carga

// Implementar reconexión con backoff exponencial
const reconnectWithBackoff = (attempt = 1) => {
  const delay = Math.min(1000 * Math.pow(2, attempt), 30000)
  setTimeout(() => {
    connect()
  }, delay)
}
```

### Monitoreo

```typescript
// Métricas de conexión
const connectionMetrics = {
  connectedAt: null,
  messagesSent: 0,
  messagesReceived: 0,
  errors: 0
}

// Enviar métricas a sistema de monitoreo
const sendMetrics = () => {
  // Enviar a sistema de métricas
}
```

## Troubleshooting

### Problemas Comunes

1. **Conexión rechazada**
   - Verificar que el servidor WebSocket esté corriendo en el puerto 8001
   - Verificar configuración de firewall

2. **Mensajes no llegan**
   - Verificar que Redis esté funcionando
   - Revisar logs del servidor WebSocket

3. **Selecciones no persisten**
   - Verificar conexión a Redis
   - Revisar configuración de expiración

4. **Alto uso de memoria**
   - Verificar limpieza automática de selecciones expiradas
   - Revisar configuración de timeouts

### Logs Útiles

```bash
# Ver logs del servidor WebSocket
docker-compose logs -f websocket

# Ver estadísticas
curl http://localhost:8001/stats

# Ver salud del servicio
curl http://localhost:8001/health
```

## API de Referencia

### Métodos del Composable

| Método | Descripción | Parámetros | Retorno |
|--------|-------------|------------|---------|
| `connect(endpoint)` | Conectar al WebSocket | `endpoint?: string` | `void` |
| `disconnect()` | Desconectar WebSocket | - | `void` |
| `send(message)` | Enviar mensaje | `message: WebSocketMessage \| string` | `boolean` |
| `joinRoom(roomId)` | Unirse a sala | `roomId: string` | `boolean` |
| `leaveRoom()` | Salir de sala actual | - | `boolean` |
| `selectSeat(seatId, userInfo)` | Seleccionar asiento | `seatId: string, userInfo?: UserInfo` | `boolean` |
| `releaseSeat(seatId)` | Liberar asiento | `seatId: string` | `boolean` |
| `ping()` | Enviar ping | - | `boolean` |
| `on(eventType, callback)` | Suscribirse a evento | `eventType: string, callback: Function` | `void` |
| `off(eventType, callback)` | Desuscribirse de evento | `eventType: string, callback: Function` | `void` |

### Estados Reactivos

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `isConnected` | `boolean` | Si está conectado |
| `isConnecting` | `boolean` | Si está conectando |
| `error` | `string \| null` | Error de conexión |
| `currentRoom` | `string \| null` | Sala actual |
| `selectedSeats` | `Set<string>` | Asientos seleccionados por el usuario |
| `otherSelections` | `Map<string, SeatSelection>` | Selecciones de otros usuarios |
| `clientId` | `string` | ID único del cliente | 