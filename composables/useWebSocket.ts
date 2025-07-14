interface WebSocketMessage {
  action?: 'select' | 'deselect' | 'user_connected' | 'user_disconnected' | 'seat_update'
  type?: 'connection_established' | 'selection_confirmed' | 'seat_selected' | 'seat_deselected' | 'seat_released' | 'user_connected' | 'user_disconnected'
  asientos?: string[]
  usuario_id?: string
  user_id?: string
  funcion_id?: string
  room_id?: string
  asiento_id?: string
  seat_id?: string
  estado?: string
  client_id?: string
  user_info?: {
    user_id: string
    nombre?: string
    apellido?: string
    email?: string
  }
  timestamp?: string
  message?: string
}

interface SeatSelection {
  id: string
  funcion_id: string
  usuario_id: string
  asiento_id: string
  estado: 'temporal' | 'confirmada' | 'cancelada' | 'expirada'
  fecha_seleccion: string
  fecha_expiracion?: string
  fecha_confirmacion?: string
  fecha_cancelacion?: string
}

export const useWebSocket = (funcionId: string) => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const lastHeartbeat = ref<Date | null>(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 1000

  // Estado de selecciones
  const selectedSeats = ref<Set<string>>(new Set())
  const otherUsersSeats = ref<Map<string, string>>(new Map()) // asiento_id -> usuario_id
  const seatSelections = ref<SeatSelection[]>([])

  // Estado temporal para acciones pendientes
  const pendingActions = ref<Map<string, 'select' | 'deselect'>>(new Map()) // asiento_id -> acción

  // Mapeo de IDs de sesión WebSocket a IDs reales de usuario
  const sessionUserMap = ref<Map<string, string>>(new Map()) // session_id -> real_user_id

  // Eventos
  const onSeatSelected = ref<((asientoId: string, usuarioId: string) => void) | null>(null)
  const onSeatDeselected = ref<((asientoId: string) => void) | null>(null)
  const onUserConnected = ref<((usuarioId: string) => void) | null>(null)
  const onUserDisconnected = ref<((usuarioId: string) => void) | null>(null)
  const onConnectionStatusChanged = ref<((status: string) => void) | null>(null)

  // Obtener información del usuario autenticado
  const { getCurrentUserId, checkAuth } = useAuth()
  const { createSeleccion, cancelarSeleccion, getSeleccionesByFuncion } = useApi()

  // Conectar al WebSocket
  const connect = async () => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      return
    }

    connectionStatus.value = 'connecting'
    onConnectionStatusChanged.value?.(connectionStatus.value)

    try {
      // Verificar autenticación antes de conectar
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        console.error('Usuario no autenticado')
        connectionStatus.value = 'error'
        return
      }

      const userId = getCurrentUserId()
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario')
        connectionStatus.value = 'error'
        return
      }

      // Obtener el token JWT
      const { getToken } = useAuth()
      const token = getToken()
      if (!token) {
        console.error('No se pudo obtener el token JWT')
        connectionStatus.value = 'error'
        return
      }

      // Conectar al WebSocket específico para la función con token JWT
      const wsUrl = `ws://localhost:8000/ws/funciones/${funcionId}/asientos?token=${encodeURIComponent(token)}`
      console.log('Conectando al WebSocket:', wsUrl)
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('WebSocket conectado')
        isConnected.value = true
        connectionStatus.value = 'connected'
        reconnectAttempts.value = 0
        lastHeartbeat.value = new Date()
        onConnectionStatusChanged.value?.(connectionStatus.value)

        // Cargar selecciones existentes
        loadExistingSelections()
      }

      ws.value.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.value.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason)
        isConnected.value = false
        connectionStatus.value = 'disconnected'
        onConnectionStatusChanged.value?.(connectionStatus.value)

        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.value++
            connect()
          }, reconnectDelay * reconnectAttempts.value)
        }
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
        connectionStatus.value = 'error'
        onConnectionStatusChanged.value?.(connectionStatus.value)
      }

    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      connectionStatus.value = 'error'
      onConnectionStatusChanged.value?.(connectionStatus.value)
    }
  }

  // Desconectar del WebSocket
  const disconnect = () => {
    if (ws.value) {
      ws.value.close(1000, 'User disconnect')
      ws.value = null
    }
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    onConnectionStatusChanged.value?.(connectionStatus.value)
  }

  // Manejar mensajes del WebSocket
  const handleMessage = (message: WebSocketMessage) => {
    console.log('WebSocket message received:', message)

    // Manejar mensajes con formato antiguo (action)
    if (message.action) {
      switch (message.action) {
        case 'select':
          if (message.asientos && message.usuario_id) {
            message.asientos.forEach(asientoId => {
              selectedSeats.value.add(asientoId)
              otherUsersSeats.value.set(asientoId, message.usuario_id!)
            })
          }
          break

        case 'deselect':
          if (message.asientos) {
            message.asientos.forEach(asientoId => {
              selectedSeats.value.delete(asientoId)
              otherUsersSeats.value.delete(asientoId)
            })
          }
          break

        case 'user_connected':
          if (message.usuario_id) {
            onUserConnected.value?.(message.usuario_id)
          }
          break

        case 'user_disconnected':
          if (message.usuario_id) {
            onUserDisconnected.value?.(message.usuario_id)
          }
          break

        case 'seat_update':
          // Actualizar estado de asiento específico
          if (message.asiento_id && message.estado) {
            updateSeatStatus(message.asiento_id, message.estado)
          }
          break
      }
    }

    // Manejar mensajes con formato nuevo (type)
    if (message.type) {
      console.log('=== PROCESANDO MENSAJE TIPO:', message.type, '===')
      
      switch (message.type) {
        case 'connection_established':
          // Cuando se establece la conexión WebSocket con autenticación JWT
          console.log('=== CONEXIÓN ESTABLECIDA ===')
          console.log('User ID del servidor:', message.user_id)
          console.log('User Info:', message.user_info)
          
          // Mapear el ID del servidor al ID real del usuario
          const currentUserId = getCurrentUserId()
          if (message.user_id && currentUserId) {
            mapSessionToRealUser(message.user_id, currentUserId)
            console.log(`✅ Conexión establecida - Mapeado: ${message.user_id} -> ${currentUserId}`)
          }
          break

        case 'selection_confirmed':
          // Cuando se confirma una selección (respuesta del servidor)
          if (message.asientos && message.user_id) {
            const currentUserId = getCurrentUserId()
            console.log('=== CONFIRMACIÓN DE SELECCIÓN ===')
            console.log('User ID del mensaje (session):', message.user_id)
            console.log('Current User ID (real):', currentUserId)
            console.log('Action:', message.action)
            
            // Usar el mapeo para determinar si es mi selección
            const isMySelection = compareUserIds(message.user_id, currentUserId || '')
            console.log('¿Es mi selección?', isMySelection)
            console.log('Asientos:', message.asientos)
            
            message.asientos.forEach(asientoId => {
              // Limpiar acción pendiente
              pendingActions.value.delete(asientoId)
              
              if (message.action === 'deselect') {
                // Es una deselección confirmada - remover de todas las listas
                clearSeat(asientoId, `deselección confirmada por usuario ${message.user_id}`)
                console.log(`🗑️ Asiento ${asientoId} deseleccionado confirmado`)
              } else {
                // Es una selección confirmada
                if (isMySelection) {
                  // Es mi selección
                  selectedSeats.value.add(asientoId)
                  console.log(`✅ Asiento ${asientoId} confirmado como seleccionado por mí`)
                } else {
                  // Es de otro usuario
                  otherUsersSeats.value.set(asientoId, message.user_id!)
                  console.log(`❌ Asiento ${asientoId} confirmado como ocupado por usuario ${message.user_id}`)
                }
              }
            })
          }
          break

        case 'seat_selected':
          // Cuando otro usuario selecciona un asiento
          const seatId = message.seat_id || message.asiento_id
          const sessionUserId = message.user_id || message.client_id || message.usuario_id
          
          console.log('=== ASIENTO SELECCIONADO POR OTRO ===')
          console.log('Seat ID:', seatId)
          console.log('Session User ID:', sessionUserId)
          
          if (seatId && sessionUserId) {
            const currentUserId = getCurrentUserId()
            console.log('Current User ID:', currentUserId)
            
            // Obtener el ID real del usuario desde el mapeo
            const realUserId = getRealUserIdFromSession(sessionUserId)
            console.log('Real User ID from mapping:', realUserId)
            
            // Comparar con el ID real si está disponible, sino usar el de sesión
            const userIdToCompare = realUserId || sessionUserId
            console.log('¿Es mi selección?', compareUserIds(userIdToCompare, currentUserId || ''))
            
            if (!compareUserIds(userIdToCompare, currentUserId || '')) {
              // Es de otro usuario
              otherUsersSeats.value.set(seatId, sessionUserId)
              console.log(`Asiento ${seatId} seleccionado por usuario ${sessionUserId}`)
            } else {
              console.log(`Asiento ${seatId} seleccionado por mí, pero llegó como seat_selected`)
            }
          }
          break

        case 'seat_released':
          // Cuando un asiento se libera (por ejemplo, por un usuario que se desconecta)
          const releasedSeatId = message.seat_id || message.asiento_id
          const releasedUserId = message.user_id || message.client_id || message.usuario_id
          
          console.log('=== ASIENTO LIBERADO ===')
          console.log('Seat ID:', releasedSeatId)
          console.log('User ID:', releasedUserId)
          
          if (releasedSeatId) {
            clearSeat(releasedSeatId, `liberado por usuario ${releasedUserId}`)
          }
          break

        case 'seat_deselected':
          // Cuando se deselecciona un asiento
          const deselectedSeatId = message.seat_id || message.asiento_id
          const deselectedUserId = message.user_id || message.client_id || message.usuario_id
          
          console.log('=== ASIENTO DESELECCIONADO ===')
          console.log('Seat ID:', deselectedSeatId)
          console.log('User ID:', deselectedUserId)
          
          if (deselectedSeatId) {
            clearSeat(deselectedSeatId, `deseleccionado por usuario ${deselectedUserId}`)
          }
          break

        case 'user_connected':
          const connectedUserId = message.user_id || message.client_id || message.usuario_id
          if (connectedUserId) {
            onUserConnected.value?.(connectedUserId)
          }
          break

        case 'user_disconnected':
          const disconnectedUserId = message.user_id || message.client_id || message.usuario_id
          if (disconnectedUserId) {
            onUserDisconnected.value?.(disconnectedUserId)
          }
          break
      }
    }
  }

  // Seleccionar asiento
  const selectSeat = async (asientoId: string) => {
    // Verificar autenticación antes de seleccionar
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      console.error('Usuario no autenticado')
      return false
    }

    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario')
      return false
    }

    console.log('=== SELECCIONANDO ASIENTO ===')
    console.log('Asiento a seleccionar:', asientoId)
    console.log('User ID que se enviará:', userId)

    try {
      // Crear selección en la API
      const selectionData = {
        funcion_id: funcionId,
        usuario_id: userId,
        asiento_id: asientoId,
        estado: 'temporal'
      }
      
      console.log('=== ENVIANDO SELECCIÓN AL SERVIDOR ===')
      console.log('Datos enviados:', selectionData)
      
      const response = await createSeleccion(selectionData)

      if (response.success) {
        // Marcar acción como pendiente
        pendingActions.value.set(asientoId, 'select')
        
        // Enviar mensaje al WebSocket
        if (ws.value?.readyState === WebSocket.OPEN) {
          const message: WebSocketMessage = {
            action: 'select',
            asientos: [asientoId]
          }
          ws.value.send(JSON.stringify(message))
        }

        // NO actualizar estado local aquí - esperar confirmación del servidor
        // El estado se actualizará cuando llegue el mensaje 'selection_confirmed'
        console.log('Solicitud de selección enviada, esperando confirmación del servidor')
        return true
      } else {
        console.error('Error creating seat selection:', response.error)
        return false
      }
    } catch (error) {
      console.error('Error selecting seat:', error)
      return false
    }
  }

  // Deseleccionar asiento
  const deselectSeat = async (asientoId: string) => {
    // Verificar autenticación antes de deseleccionar
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      console.error('Usuario no autenticado')
      return false
    }

    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario')
      return false
    }

    console.log('=== DESELECCIONANDO ASIENTO ===')
    console.log('Asiento a deseleccionar:', asientoId)
    console.log('User ID:', userId)
    console.log('SeatSelections disponibles:', seatSelections.value.map(s => `${s.asiento_id}:${s.usuario_id}:${s.estado}`))
    console.log('SelectedSeats locales:', Array.from(selectedSeats.value))

    try {
      // Buscar la selección existente en seatSelections
      const existingSelection = seatSelections.value.find(
        s => s.asiento_id === asientoId && s.usuario_id === userId && s.estado === 'temporal'
      )

      console.log('Selección encontrada en seatSelections:', existingSelection)

      if (existingSelection) {
        // Cancelar selección en la API
        console.log('Cancelando selección con ID:', existingSelection.id)
        const response = await cancelarSeleccion(existingSelection.id)
        
        if (response.success) {
          // Marcar acción como pendiente
          pendingActions.value.set(asientoId, 'deselect')
          
          // Enviar mensaje al WebSocket
          if (ws.value?.readyState === WebSocket.OPEN) {
            const message: WebSocketMessage = {
              action: 'deselect',
              asientos: [asientoId]
            }
            ws.value.send(JSON.stringify(message))
          }

          // NO actualizar estado local aquí - esperar confirmación del servidor
          console.log('Solicitud de deselección enviada, esperando confirmación del servidor')
          return true
        } else {
          console.error('Error al cancelar selección:', response.error)
          return false
        }
              } else {
          // Si no encuentra la selección en seatSelections, verificar si está en selectedSeats
          if (selectedSeats.value.has(asientoId)) {
            console.log('Asiento encontrado en selectedSeats pero no en seatSelections')
            console.log('Esto puede indicar que la selección aún no se ha sincronizado con el servidor')
            
            // En este caso, actualizar el estado local inmediatamente
            // ya que la selección puede no haberse guardado aún en el servidor
            selectedSeats.value.delete(asientoId)
            pendingActions.value.set(asientoId, 'deselect')
            
            if (ws.value?.readyState === WebSocket.OPEN) {
              const message: WebSocketMessage = {
                action: 'deselect',
                asientos: [asientoId]
              }
              ws.value.send(JSON.stringify(message))
            }
            
            console.log('Estado local actualizado y mensaje de deselección enviado al WebSocket (sin llamada a API)')
            return true
          } else {
            console.log('Asiento no encontrado en ninguna lista')
            return false
          }
        }
    } catch (error) {
      console.error('Error deselecting seat:', error)
      return false
    }
  }

  // Cargar selecciones existentes
  const loadExistingSelections = async () => {
    try {
      const response = await getSeleccionesByFuncion(funcionId)
      
      if (response.success && response.data) {
        console.log('Todas las selecciones del servidor:', response.data)
        
        // Filtrar selecciones activas y confirmadas
        const currentTime = new Date()
        const activeSelections = response.data.filter((selection: SeatSelection) => {
          // Incluir selecciones en estado temporal o confirmada
          if (selection.estado !== 'temporal' && selection.estado !== 'confirmada') {
            console.log(`Excluyendo asiento ${selection.asiento_id} con estado: ${selection.estado}`)
            return false
          }
          
          // Para selecciones temporales, verificar si no está expirada
          if (selection.estado === 'temporal' && selection.fecha_expiracion) {
            const expirationDate = new Date(selection.fecha_expiracion)
            if (expirationDate < currentTime) {
              console.log(`Excluyendo asiento ${selection.asiento_id} por expiración`)
              return false
            }
          }
          
          // Las selecciones confirmadas siempre se incluyen (no expiran)
          console.log(`Incluyendo asiento ${selection.asiento_id} con estado: ${selection.estado}`)
          return true
        })
        
        console.log('Selecciones cargadas del servidor:', response.data.length)
        console.log('Selecciones activas filtradas:', activeSelections.length)
        console.log('Selecciones activas:', activeSelections)
        
        seatSelections.value = activeSelections
        
        // Actualizar estado de asientos seleccionados
        const userId = getCurrentUserId()
        activeSelections.forEach((selection: SeatSelection) => {
          console.log(`Procesando asiento ${selection.asiento_id} - Estado: ${selection.estado} - Usuario: ${selection.usuario_id} vs ${userId}`)
          
          // Usar el ID real del usuario para comparar
          if (selection.usuario_id === userId) {
            // Es mi selección
            if (selection.estado === 'confirmada') {
              console.log(`Asiento ${selection.asiento_id} cargado como CONFIRMADO por mí`)
            } else {
              selectedSeats.value.add(selection.asiento_id)
              console.log(`Asiento ${selection.asiento_id} cargado como seleccionado por mí`)
            }
          } else {
            // Es de otro usuario
            otherUsersSeats.value.set(selection.asiento_id, selection.usuario_id)
            console.log(`Asiento ${selection.asiento_id} cargado como ocupado por usuario ${selection.usuario_id}`)
          }
        })
      }
    } catch (error) {
      console.error('Error loading existing selections:', error)
    }
  }

  // Actualizar estado de asiento
  const updateSeatStatus = (asientoId: string, estado: string) => {
    const index = seatSelections.value.findIndex(s => s.asiento_id === asientoId)
    if (index !== -1) {
      seatSelections.value[index].estado = estado as any
    }
  }

  // Obtener estado de asiento
  const getSeatStatus = (asientoId: string) => {
    const userId = getCurrentUserId()
    
    // Verificar si hay una acción pendiente
    const pendingAction = pendingActions.value.get(asientoId)
    if (pendingAction === 'deselect') {
      // Si hay una deselección pendiente, mostrar como disponible
      return 'available'
    }
    
    // Verificar en las selecciones del servidor primero
    const selection = seatSelections.value.find(s => s.asiento_id === asientoId)
    if (selection) {
      console.log(`Estado de asiento ${asientoId}: ${selection.estado} - Usuario: ${selection.usuario_id} vs ${userId}`)
      
      // Usar el ID real del usuario para comparar
      if (selection.usuario_id === userId) {
        if (selection.estado === 'confirmada') {
          return 'confirmed'
        } else {
          return 'selected'
        }
      } else {
        if (selection.estado === 'confirmada') {
          return 'occupied'
        } else {
          return 'taken'
        }
      }
    }
    
    // Verificar en mis selecciones locales
    if (selectedSeats.value.has(asientoId)) {
      return 'selected'
    }
    
    // Verificar si está en selecciones de otros usuarios
    if (otherUsersSeats.value.has(asientoId)) {
      return 'taken'
    }
    
    return 'available'
  }

  // Verificar si asiento está disponible
  const isSeatAvailable = (asientoId: string) => {
    const status = getSeatStatus(asientoId)
    const available = status === 'available'
    console.log(`isSeatAvailable(${asientoId}) -> status: ${status}, available: ${available}`)
    return available
  }

  // Verificar si asiento está confirmado (no se puede interactuar)
  const isSeatConfirmed = (asientoId: string) => {
    const status = getSeatStatus(asientoId)
    const confirmed = status === 'confirmed' || status === 'occupied'
    console.log(`isSeatConfirmed(${asientoId}) -> status: ${status}, confirmed: ${confirmed}`)
    return confirmed
  }

  // Verificar si asiento está seleccionado por el usuario actual
  const isSeatSelectedByMe = (asientoId: string) => {
    const status = getSeatStatus(asientoId)
    const selected = status === 'selected' || status === 'confirmed'
    console.log(`isSeatSelectedByMe(${asientoId}) -> status: ${status}, selected: ${selected}`)
    return selected
  }

  // Obtener información del usuario que seleccionó un asiento
  const getSeatUser = (asientoId: string) => {
    return otherUsersSeats.value.get(asientoId)
  }

  // Heartbeat para mantener la conexión
  const startHeartbeat = () => {
    setInterval(() => {
      if (ws.value?.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ action: 'heartbeat' }))
        lastHeartbeat.value = new Date()
      }
    }, 30000) // Cada 30 segundos
  }

  // Limpiar selecciones al salir
  const clearSelections = () => {
    selectedSeats.value.clear()
    otherUsersSeats.value.clear()
    seatSelections.value = []
    pendingActions.value.clear()
  }

  // Función para normalizar IDs de usuario
  const normalizeUserId = (userId: string): string => {
    // Si el ID viene con prefijo "user_", lo removemos para comparación
    if (userId.startsWith('user_')) {
      return userId.substring(5) // Remover "user_" del inicio
    }
    return userId
  }

  // Función para comparar IDs de usuario
  const compareUserIds = (sessionId: string, realUserId: string): boolean => {
    // Si uno de los IDs es null o undefined, no son iguales
    if (!sessionId || !realUserId) {
      console.log(`Comparando IDs: "${sessionId}" vs "${realUserId}" -> Uno es null/undefined`)
      return false
    }
    
    // Verificar si el sessionId está mapeado al realUserId
    const mappedRealUserId = sessionUserMap.value.get(sessionId)
    if (mappedRealUserId) {
      const isMatch = mappedRealUserId === realUserId
      console.log(`Comparando IDs mapeados: session "${sessionId}" -> real "${mappedRealUserId}" vs "${realUserId}" -> ${isMatch}`)
      return isMatch
    }
    
    // Si no está mapeado, intentar comparación directa
    const normalized1 = normalizeUserId(sessionId)
    const normalized2 = normalizeUserId(realUserId)
    console.log(`Comparando IDs directos: "${sessionId}" vs "${realUserId}" -> "${normalized1}" vs "${normalized2}" -> ${normalized1 === normalized2}`)
    return normalized1 === normalized2
  }

  // Función para mapear ID de sesión a ID real de usuario
  const mapSessionToRealUser = (sessionId: string, realUserId: string) => {
    sessionUserMap.value.set(sessionId, realUserId)
    console.log(`Mapeado creado: session "${sessionId}" -> real "${realUserId}"`)
  }

  // Función para obtener el ID real de usuario desde el ID de sesión
  const getRealUserIdFromSession = (sessionId: string): string | null => {
    return sessionUserMap.value.get(sessionId) || null
  }

  // Función para limpiar completamente un asiento
  const clearSeat = (asientoId: string, reason: string = 'unknown') => {
    // Remover de todas las listas
    selectedSeats.value.delete(asientoId)
    otherUsersSeats.value.delete(asientoId)
    
    // Limpiar acción pendiente
    pendingActions.value.delete(asientoId)
    
    // También remover de las selecciones del servidor si existe
    const selectionIndex = seatSelections.value.findIndex(s => s.asiento_id === asientoId)
    if (selectionIndex !== -1) {
      seatSelections.value.splice(selectionIndex, 1)
    }
    
    console.log(`🧹 Asiento ${asientoId} limpiado completamente (${reason})`)
  }

  // Inicializar al montar
  onMounted(() => {
    startHeartbeat()
  })

  // Limpiar al desmontar
  onUnmounted(() => {
    disconnect()
    clearSelections()
  })

  return {
    // Estado
    isConnected: readonly(isConnected),
    connectionStatus: readonly(connectionStatus),
    selectedSeats: readonly(selectedSeats),
    otherUsersSeats: readonly(otherUsersSeats),
    seatSelections: readonly(seatSelections),
    pendingActions: readonly(pendingActions),

    // Métodos
    connect,
    disconnect,
    selectSeat,
    deselectSeat,
    getSeatStatus,
    isSeatAvailable,
    isSeatConfirmed,
    isSeatSelectedByMe,
    getSeatUser,
    clearSelections,
    clearSeat,

    // Eventos
    onSeatSelected,
    onSeatDeselected,
    onUserConnected,
    onUserDisconnected,
    onConnectionStatusChanged
  }
} 