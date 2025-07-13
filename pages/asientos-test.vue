<template>
  <div class="asientos-test-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-center">
        Prueba de Selección de Asientos
      </h1>
      
      <div class="mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold mb-2">Información de Prueba</h2>
          <p class="text-sm text-gray-600 mb-2">
            Esta página permite probar la funcionalidad de selección de asientos en tiempo real.
          </p>
          <p class="text-sm text-gray-600 mb-2">
            <strong>ID de Cliente:</strong> {{ clientId }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Estado de Conexión:</strong> {{ getConnectionState() }}
          </p>
        </div>
      </div>

      <!-- Configuración de prueba -->
      <div class="mb-6">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 class="text-md font-semibold mb-3">Configuración</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">ID de Función:</label>
              <input 
                v-model="funcionId" 
                type="text" 
                placeholder="funcion_123"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nombre de Usuario:</label>
              <input 
                v-model="userName" 
                type="text" 
                placeholder="Tu nombre"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Componente de selección de asientos -->
      <SeatSelection 
        :funcion-id="funcionId" 
        :user-info="{ name: userName, email: 'test@example.com' }"
      />

      <!-- Información adicional -->
      <div class="mt-8">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="text-md font-semibold mb-2">Instrucciones de Prueba</h3>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Abre esta página en múltiples pestañas para simular diferentes usuarios</li>
            <li>• Cada pestaña tendrá un ID de cliente único</li>
            <li>• Las selecciones se sincronizan en tiempo real entre todas las pestañas</li>
            <li>• Las reservas expiran automáticamente después de 5 minutos</li>
            <li>• Usa el mismo ID de función en todas las pestañas para ver las interacciones</li>
          </ul>
        </div>
      </div>

      <!-- Logs de eventos -->
      <div class="mt-8">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 class="text-md font-semibold mb-3">Logs de Eventos</h3>
          <div class="bg-black text-green-400 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            <div v-for="(log, index) in logs" :key="index" class="mb-1">
              <span class="text-gray-400">[{{ log.timestamp }}]</span>
              <span :class="log.type === 'error' ? 'text-red-400' : 'text-green-400'">
                {{ log.message }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'error' | 'success'
}

// Estado de la página
const funcionId = ref('funcion_test_123')
const userName = ref('Usuario de Prueba')
const logs = ref<LogEntry[]>([])

// Composable WebSocket
const {
  isConnected,
  isConnecting,
  error,
  clientId,
  getConnectionState,
  on,
  off
} = useWebSocket()

// Función para agregar logs
const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
  logs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message,
    type
  })
  
  // Mantener solo los últimos 100 logs
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(-100)
  }
}

// Configurar listeners para logs
onMounted(() => {
  // Listener para todos los eventos
  on('*', (data) => {
    addLog(`Evento: ${data.type} - ${JSON.stringify(data)}`, 'info')
  })

  // Listener para errores
  watch(error, (newError) => {
    if (newError) {
      addLog(`Error: ${newError}`, 'error')
    }
  })

  // Listener para cambios de conexión
  watch(isConnected, (connected) => {
    if (connected) {
      addLog('WebSocket conectado', 'success')
    } else {
      addLog('WebSocket desconectado', 'error')
    }
  })

  // Listener para cambios de estado de conexión
  watch(isConnecting, (connecting) => {
    if (connecting) {
      addLog('Conectando al WebSocket...', 'info')
    }
  })
})

// Limpiar listeners al desmontar
onUnmounted(() => {
  off('*', () => {})
})
</script>

<style scoped>
.asientos-test-page {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style> 