<template>
  <div class="seat-selection">
    <!-- Estado de conexión -->
    <div class="connection-status">
      <div class="status-indicator" :class="connectionStatusClass"></div>
      <span>{{ connectionStatusText }}</span>
      <button 
        v-if="!isConnected" 
        @click="connectWebSocket"
        class="btn btn-primary btn-sm ml-2"
      >
        Reconectar
      </button>
    </div>

    <!-- Información de la sala -->
    <div v-if="currentRoom" class="room-info">
      <h3 class="text-lg font-semibold mb-2">Sala: {{ currentRoom }}</h3>
      <p class="text-sm text-gray-600">
        Selecciona tus asientos. Las reservas expiran en 5 minutos.
      </p>
    </div>

    <!-- Grid de asientos -->
    <div class="seat-grid">
      <div 
        v-for="row in seatRows" 
        :key="row" 
        class="seat-row"
      >
        <div class="row-label">{{ row }}</div>
        <div class="seats-container">
          <button
            v-for="col in seatColumns"
            :key="`${row}${col}`"
            :class="getSeatClass(`${row}${col}`)"
            @click="handleSeatClick(`${row}${col}`)"
            :disabled="!isSeatAvailable(`${row}${col}`) && !isSeatSelectedByMe(`${row}${col}`)"
            class="seat-button"
          >
            {{ col }}
          </button>
        </div>
      </div>
    </div>

    <!-- Leyenda -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color available"></div>
        <span>Disponible</span>
      </div>
      <div class="legend-item">
        <div class="legend-color selected"></div>
        <span>Seleccionado por ti</span>
      </div>
      <div class="legend-item">
        <div class="legend-color other-selected"></div>
        <span>Seleccionado por otro</span>
      </div>
    </div>

    <!-- Asientos seleccionados -->
    <div v-if="selectedSeatsArray.length > 0" class="selected-seats">
      <h4 class="text-md font-semibold mb-2">Mis Selecciones:</h4>
      <div class="selected-seats-list">
        <div 
          v-for="seat in selectedSeatsArray" 
          :key="seat"
          class="selected-seat-item"
        >
          <span>{{ seat }}</span>
          <button 
            @click="releaseSeat(seat)"
            class="btn btn-sm btn-outline btn-error"
          >
            Liberar
          </button>
        </div>
      </div>
    </div>

    <!-- Información de otros usuarios -->
    <div v-if="otherSelectionsArray.length > 0" class="other-selections">
      <h4 class="text-md font-semibold mb-2">Otros usuarios:</h4>
      <div class="other-selections-list">
        <div 
          v-for="selection in otherSelectionsArray" 
          :key="selection.seat_id"
          class="other-selection-item"
        >
          <span>{{ selection.seat_id }}</span>
          <span class="text-sm text-gray-600">
            - {{ selection.user_info.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  funcionId: string
  userInfo?: {
    name: string
    email: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => ({ name: 'Usuario', email: 'usuario@example.com' })
})

// Composable WebSocket
const {
  isConnected,
  isConnecting,
  error,
  currentRoom,
  selectedSeats,
  otherSelections,
  clientId,
  connect,
  disconnect,
  joinRoom,
  leaveRoom,
  selectSeat,
  releaseSeat,
  isSeatAvailable,
  isSeatSelectedByMe,
  isSeatSelectedByOther,
  getOtherSelectionInfo,
  getConnectionState
} = useWebSocket()

// Configuración de asientos
const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const seatColumns = Array.from({ length: 15 }, (_, i) => i + 1)

// Computed properties
const connectionStatusText = computed(() => {
  if (isConnecting.value) return 'Conectando...'
  if (isConnected.value) return 'Conectado'
  return 'Desconectado'
})

const connectionStatusClass = computed(() => {
  if (isConnecting.value) return 'status-connecting'
  if (isConnected.value) return 'status-connected'
  return 'status-disconnected'
})

const selectedSeatsArray = computed(() => Array.from(selectedSeats.value))
const otherSelectionsArray = computed(() => Array.from(otherSelections.value.values()))

// Métodos
const connectWebSocket = () => {
  connect('/ws')
}

const handleSeatClick = (seatId: string) => {
  if (!isConnected.value) {
    console.error('WebSocket no está conectado')
    return
  }

  if (isSeatSelectedByMe(seatId)) {
    // Liberar asiento si ya está seleccionado por el usuario
    releaseSeat(seatId)
  } else if (isSeatAvailable(seatId)) {
    // Seleccionar asiento si está disponible
    selectSeat(seatId, props.userInfo)
  }
}

const getSeatClass = (seatId: string) => {
  const classes = ['seat']
  
  if (isSeatSelectedByMe(seatId)) {
    classes.push('selected')
  } else if (isSeatSelectedByOther(seatId)) {
    classes.push('other-selected')
  } else if (!isSeatAvailable(seatId)) {
    classes.push('unavailable')
  } else {
    classes.push('available')
  }
  
  return classes.join(' ')
}

// Lifecycle
onMounted(() => {
  // Conectar al WebSocket
  connectWebSocket()
})

onUnmounted(() => {
  // Salir de la sala y desconectar
  leaveRoom()
  disconnect()
})

// Watch para unirse a la sala cuando esté conectado
watch([isConnected, () => props.funcionId], ([connected, funcionId]) => {
  if (connected && funcionId) {
    joinRoom(funcionId)
  }
})
</script>

<style scoped>
.seat-selection {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-connected {
  background-color: #10b981;
}

.status-disconnected {
  background-color: #ef4444;
}

.status-connecting {
  background-color: #f59e0b;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.room-info {
  margin-bottom: 1.5rem;
}

.seat-grid {
  margin-bottom: 2rem;
}

.seat-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.row-label {
  width: 2rem;
  text-align: center;
  font-weight: 600;
  color: #6b7280;
}

.seats-container {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.seat-button {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
}

.seat-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.seat-button.available {
  border-color: #d1d5db;
  background-color: #ffffff;
}

.seat-button.selected {
  background-color: #10b981;
  border-color: #059669;
  color: #ffffff;
}

.seat-button.other-selected {
  background-color: #ef4444;
  border-color: #dc2626;
  color: #ffffff;
  cursor: not-allowed;
}

.seat-button.unavailable {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.legend {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.legend-color.available {
  background-color: #ffffff;
}

.legend-color.selected {
  background-color: #10b981;
}

.legend-color.other-selected {
  background-color: #ef4444;
}

.selected-seats,
.other-selections {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.selected-seats-list,
.other-selections-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-seat-item,
.other-selection-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #ffffff;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-outline {
  background-color: transparent;
}

.btn-outline.btn-error {
  color: #ef4444;
  border-color: #ef4444;
}

.btn-outline.btn-error:hover {
  background-color: #ef4444;
  color: #ffffff;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style> 