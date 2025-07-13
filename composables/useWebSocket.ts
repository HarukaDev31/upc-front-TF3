export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl.replace('http', 'ws')
  
  let socket = null
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref(null)
  const listeners = new Map()

  // Conectar al WebSocket
  const connect = (endpoint = '/ws') => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket ya está conectado')
      return
    }

    isConnecting.value = true
    error.value = null

    try {
      const wsUrl = `${baseUrl}${endpoint}`
      console.log('Conectando a WebSocket:', wsUrl)
      
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log('WebSocket conectado')
        isConnected.value = true
        isConnecting.value = false
        error.value = null
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Mensaje recibido:', data)
          
          // Ejecutar listeners registrados
          if (data.type && listeners.has(data.type)) {
            listeners.get(data.type).forEach(callback => callback(data))
          }
          
          // Ejecutar listener general
          if (listeners.has('*')) {
            listeners.get('*').forEach(callback => callback(data))
          }
        } catch (err) {
          console.error('Error procesando mensaje WebSocket:', err)
        }
      }

      socket.onerror = (event) => {
        console.error('Error en WebSocket:', event)
        error.value = 'Error de conexión WebSocket'
        isConnected.value = false
        isConnecting.value = false
      }

      socket.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason)
        isConnected.value = false
        isConnecting.value = false
        
        // Reconectar automáticamente si no fue un cierre intencional
        if (event.code !== 1000) {
          setTimeout(() => {
            console.log('Intentando reconectar...')
            connect(endpoint)
          }, 3000)
        }
      }
    } catch (err) {
      console.error('Error creando WebSocket:', err)
      error.value = 'Error al crear conexión WebSocket'
      isConnecting.value = false
    }
  }

  // Desconectar WebSocket
  const disconnect = () => {
    if (socket) {
      socket.close(1000, 'Desconexión intencional')
      socket = null
      isConnected.value = false
      isConnecting.value = false
    }
  }

  // Enviar mensaje
  const send = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message)
      socket.send(messageStr)
      return true
    } else {
      console.error('WebSocket no está conectado')
      return false
    }
  }

  // Suscribirse a eventos
  const on = (eventType, callback) => {
    if (!listeners.has(eventType)) {
      listeners.set(eventType, [])
    }
    listeners.get(eventType).push(callback)
  }

  // Desuscribirse de eventos
  const off = (eventType, callback) => {
    if (listeners.has(eventType)) {
      const callbacks = listeners.get(eventType)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Suscribirse a actualizaciones de asientos
  const subscribeToAsientos = (funcionId, callback) => {
    const eventType = `asientos_update_${funcionId}`
    on(eventType, callback)
    
    // Enviar mensaje de suscripción
    send({
      type: 'subscribe_asientos',
      funcion_id: funcionId
    })
  }

  // Desuscribirse de actualizaciones de asientos
  const unsubscribeFromAsientos = (funcionId) => {
    const eventType = `asientos_update_${funcionId}`
    listeners.delete(eventType)
    
    // Enviar mensaje de desuscripción
    send({
      type: 'unsubscribe_asientos',
      funcion_id: funcionId
    })
  }

  // Reservar asiento temporalmente
  const reservarAsiento = (funcionId, asientoCodigo, tiempoReserva = 300) => {
    return send({
      type: 'reservar_asiento',
      funcion_id: funcionId,
      asiento_codigo: asientoCodigo,
      tiempo_reserva: tiempoReserva
    })
  }

  // Liberar reserva de asiento
  const liberarAsiento = (funcionId, asientoCodigo) => {
    return send({
      type: 'liberar_asiento',
      funcion_id: funcionId,
      asiento_codigo: asientoCodigo
    })
  }

  // Obtener estado de conexión
  const getConnectionState = () => {
    if (!socket) return 'disconnected'
    
    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'closed'
      default:
        return 'unknown'
    }
  }

  return {
    // Estado
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    
    // Métodos principales
    connect,
    disconnect,
    send,
    on,
    off,
    
    // Métodos específicos para asientos
    subscribeToAsientos,
    unsubscribeFromAsientos,
    reservarAsiento,
    liberarAsiento,
    
    // Utilidades
    getConnectionState
  }
} 