import { defineStore } from 'pinia'

export const useCineStore = defineStore('cine', () => {
  // Estado
  const peliculas = ref([])
  const funciones = ref([])
  const asientosSeleccionados = ref([])
  const funcionActual = ref(null)
  const totalCompra = ref(0)
  const clienteActual = ref(null)
  const carrito = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const peliculasDisponibles = computed(() => 
    peliculas.value.filter(p => p.rating > 0)
  )

  const funcionesDisponibles = computed(() => 
    funciones.value.filter(f => f.estado === 'disponible')
  )

  const totalCarrito = computed(() => 
    carrito.value.reduce((total, entrada) => total + entrada.precio_total, 0)
  )

  const asientosSeleccionadosIds = computed(() => 
    asientosSeleccionados.value.map(a => a.id)
  )

  // Actions
  const setPeliculas = (nuevasPeliculas) => {
    peliculas.value = nuevasPeliculas
  }

  const setFunciones = (nuevasFunciones) => {
    funciones.value = nuevasFunciones
  }

  const setAsientosSeleccionados = (asientos) => {
    asientosSeleccionados.value = asientos
  }

  const agregarAsiento = (asiento) => {
    if (asiento.disponible) {
      asientosSeleccionados.value.push(asiento)
    }
  }

  const removerAsiento = (asientoCodigo) => {
    asientosSeleccionados.value = asientosSeleccionados.value.filter(
      a => a.codigo !== asientoCodigo
    )
  }

  const limpiarAsientosSeleccionados = () => {
    asientosSeleccionados.value = []
  }

  const setFuncionActual = (funcion) => {
    funcionActual.value = funcion
  }

  const setTotalCompra = (total) => {
    totalCompra.value = total
  }

  const setCliente = (cliente) => {
    clienteActual.value = cliente
  }

  const agregarAlCarrito = (entrada) => {
    carrito.value.push(entrada)
  }

  const removerDelCarrito = (entradaId) => {
    carrito.value = carrito.value.filter(e => e.id !== entradaId)
  }

  const limpiarCarrito = () => {
    carrito.value = []
  }

  const setLoading = (estado) => {
    loading.value = estado
  }

  const setError = (mensaje) => {
    error.value = mensaje
  }

  const resetStore = () => {
    peliculas.value = []
    funciones.value = []
    asientosSeleccionados.value = []
    clienteActual.value = null
    carrito.value = []
    loading.value = false
    error.value = null
  }

  return {
    // Estado
    peliculas: readonly(peliculas),
    funciones: readonly(funciones),
    asientosSeleccionados: readonly(asientosSeleccionados),
    funcionActual: readonly(funcionActual),
    totalCompra: readonly(totalCompra),
    clienteActual: readonly(clienteActual),
    carrito: readonly(carrito),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    peliculasDisponibles,
    funcionesDisponibles,
    totalCarrito,
    asientosSeleccionadosIds,

    // Actions
    setPeliculas,
    setFunciones,
    setAsientosSeleccionados,
    agregarAsiento,
    removerAsiento,
    limpiarAsientosSeleccionados,
    setFuncionActual,
    setTotalCompra,
    setCliente,
    agregarAlCarrito,
    removerDelCarrito,
    limpiarCarrito,
    setLoading,
    setError,
    resetStore
  }
}) 