# Sistema WebSocket - Selección de Asientos en Tiempo Real

## 🚀 Inicio Rápido

### 1. Configuración

```bash
# Variables de entorno
WEBSOCKET_URL=ws://localhost:8001
API_BASE_URL=http://localhost:8000
```

### 2. Uso Básico

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

### 3. Composable Directo

```typescript
const {
  isConnected,
  selectedSeats,
  otherSelections,
  selectSeat,
  releaseSeat,
  joinRoom
} = useWebSocket()

// Conectar y unirse a sala
connect('/ws')
joinRoom('funcion_123')

// Seleccionar asiento
selectSeat('A1', { name: 'Usuario', email: 'user@example.com' })
```

## 📋 Características

- ✅ **Selección en tiempo real** - Ve las selecciones de otros usuarios
- ✅ **Reservas temporales** - Las selecciones expiran en 5 minutos
- ✅ **Reconexión automática** - Se reconecta automáticamente si se pierde la conexión
- ✅ **Heartbeat** - Mantiene la conexión activa con pings automáticos
- ✅ **Manejo de errores** - Gestión robusta de errores y desconexiones
- ✅ **TypeScript** - Tipado completo para mejor desarrollo

## 🎯 Página de Prueba

Navega a `/asientos-test` para probar la funcionalidad:

- Configuración dinámica de función y usuario
- Logs en tiempo real de eventos WebSocket
- Simulación de múltiples usuarios
- Visualización del estado de conexión

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# Desarrollo
WEBSOCKET_URL=ws://localhost:8001
API_BASE_URL=http://localhost:8000

# Producción
WEBSOCKET_URL=wss://websocket.tudominio.com
API_BASE_URL=https://api.tudominio.com
```

### Protocolo de Mensajes

#### Cliente → Servidor
```javascript
// Unirse a sala
{ type: "join_room", room_id: "funcion_123" }

// Seleccionar asiento
{ 
  type: "select_seat", 
  room_id: "funcion_123", 
  seat_id: "A1",
  user_info: { name: "Usuario", email: "user@example.com" }
}

// Liberar asiento
{ type: "release_seat", room_id: "funcion_123", seat_id: "A1" }
```

#### Servidor → Cliente
```javascript
// Confirmación de unión
{ type: "room_joined", room_id: "funcion_123", client_id: "user_123" }

// Asiento seleccionado
{ 
  type: "seat_selected", 
  seat_id: "A1", 
  room_id: "funcion_123", 
  client_id: "user_123",
  user_info: { name: "Usuario", email: "user@example.com" }
}

// Selecciones actuales
{ 
  type: "current_selections", 
  selections: [/* array de selecciones */] 
}
```

## 🛠️ API del Composable

### Estados Reactivos

```typescript
const {
  isConnected,        // boolean - Estado de conexión
  isConnecting,       // boolean - Conectando
  error,             // string | null - Error
  currentRoom,       // string | null - Sala actual
  selectedSeats,     // Set<string> - Mis selecciones
  otherSelections,   // Map<string, SeatSelection> - Otros usuarios
  clientId          // string - ID único del cliente
} = useWebSocket()
```

### Métodos Principales

```typescript
const {
  // Conexión
  connect(endpoint),     // Conectar al WebSocket
  disconnect(),          // Desconectar
  
  // Salas
  joinRoom(roomId),      // Unirse a sala
  leaveRoom(),           // Salir de sala
  
  // Asientos
  selectSeat(seatId, userInfo),  // Seleccionar asiento
  releaseSeat(seatId),           // Liberar asiento
  
  // Utilidades
  isSeatAvailable(seatId),       // Verificar disponibilidad
  isSeatSelectedByMe(seatId),    // Verificar si es mío
  isSeatSelectedByOther(seatId), // Verificar si es de otro
  ping()                         // Enviar ping
} = useWebSocket()
```

### Eventos

```typescript
const { on, off } = useWebSocket()

// Suscribirse a eventos
on('seat_selected', (data) => {
  console.log('Asiento seleccionado:', data)
})

on('*', (data) => {
  console.log('Cualquier evento:', data)
})

// Desuscribirse
off('seat_selected', callback)
```

## 🎨 Componente SeatSelection

### Props

```vue
<SeatSelection 
  :funcion-id="funcionId"           // Requerido: ID de la función
  :user-info="{                     // Opcional: Info del usuario
    name: 'Usuario',
    email: 'user@example.com'
  }"
/>
```

### Características del Componente

- **Grid de asientos**: 10 filas (A-J) × 15 columnas
- **Estados visuales**: Disponible, seleccionado por ti, seleccionado por otro
- **Leyenda**: Explicación de colores
- **Lista de selecciones**: Tus asientos seleccionados
- **Información de otros**: Asientos de otros usuarios
- **Estado de conexión**: Indicador visual

## 🔍 Debugging

### Logs en Consola

```typescript
// Habilitar logs detallados
const { on } = useWebSocket()

on('*', (data) => {
  console.log('WebSocket Event:', data)
})
```

### Página de Prueba

1. Ve a `/asientos-test`
2. Abre múltiples pestañas
3. Usa el mismo ID de función
4. Observa la sincronización en tiempo real
5. Revisa los logs de eventos

### Verificar Estado

```typescript
const { getConnectionState } = useWebSocket()

console.log('Estado:', getConnectionState())
// 'connecting' | 'connected' | 'closing' | 'closed' | 'disconnected'
```

## 🚨 Manejo de Errores

### Reconexión Automática

El sistema se reconecta automáticamente cada 3 segundos si la desconexión no fue intencional.

### Heartbeat

Se envía un ping automático cada 30 segundos para mantener la conexión activa.

### Observar Errores

```typescript
const { error, isConnected } = useWebSocket()

watch(error, (newError) => {
  if (newError) {
    console.error('Error WebSocket:', newError)
    // Mostrar notificación al usuario
  }
})

watch(isConnected, (connected) => {
  if (!connected) {
    // Mostrar indicador de desconexión
    // Ofrecer opción de reconectar
  }
})
```

## 🔒 Seguridad

### Autenticación (Producción)

```typescript
// Implementar autenticación
const userToken = getAuthToken()
const wsUrl = `${baseUrl}/ws/${clientId}?token=${userToken}`

// Validar permisos
const canAccessRoom = (roomId) => {
  return userHasPermission(userId, roomId)
}
```

### Validación de Datos

```typescript
// Validar antes de enviar
const selectSeat = (seatId, userInfo) => {
  if (!isValidSeatId(seatId)) {
    throw new Error('ID de asiento inválido')
  }
  
  if (!isValidUserInfo(userInfo)) {
    throw new Error('Información de usuario inválida')
  }
  
  return send({
    type: 'select_seat',
    room_id: currentRoom.value,
    seat_id: seatId,
    user_info: userInfo
  })
}
```

## 📊 Monitoreo

### Métricas Básicas

```typescript
const metrics = {
  connectedAt: null,
  messagesSent: 0,
  messagesReceived: 0,
  errors: 0,
  reconnections: 0
}

// Enviar a sistema de métricas
const sendMetrics = () => {
  // Enviar métricas a sistema de monitoreo
}
```

### Health Check

```bash
# Verificar salud del servicio
curl http://localhost:8001/health

# Ver estadísticas
curl http://localhost:8001/stats
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Conexión rechazada**
   - Verificar que el servidor WebSocket esté corriendo en puerto 8001
   - Verificar configuración de firewall

2. **Mensajes no llegan**
   - Verificar que Redis esté funcionando
   - Revisar logs del servidor WebSocket

3. **Selecciones no persisten**
   - Verificar conexión a Redis
   - Revisar configuración de expiración

### Logs Útiles

```bash
# Ver logs del servidor WebSocket
docker-compose logs -f websocket

# Ver logs de Redis
docker-compose logs -f redis

# Ver estadísticas
curl http://localhost:8001/stats
```

## 📚 Documentación Completa

Para información detallada, consulta:
- [Guía de Uso Completa](./docs/WEBSOCKET_USAGE.md)
- [Protocolo de Mensajes](./docs/WEBSOCKET_USAGE.md#protocolo-de-mensajes)
- [API de Referencia](./docs/WEBSOCKET_USAGE.md#api-de-referencia)

## 🤝 Contribución

1. Sigue las convenciones de TypeScript
2. Agrega tests para nuevas funcionalidades
3. Actualiza la documentación
4. Verifica que funcione en múltiples pestañas

## 📄 Licencia

Este proyecto está bajo la licencia MIT. 