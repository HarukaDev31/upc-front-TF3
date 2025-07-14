import { defineStore } from 'pinia'

// Tipos
interface Pelicula {
  id: string
  titulo: string
  rating: number
  [key: string]: any
}

interface Funcion {
  id: string
  estado: string
  [key: string]: any
}

interface Asiento {
  id: string
  fila: string
  numero: string
  codigo: string
  disponible: boolean
  [key: string]: any
}

interface EntradaCarrito {
  id: string
  precio_total: number
  [key: string]: any
}

export const useCineStore = defineStore('cine', () => {
  // Estado
  const peliculas = ref<Pelicula[]>([])
  const funciones = ref<Funcion[]>([])
  const asientosSeleccionados = ref<Asiento[]>([])
  const funcionActual = ref<Funcion | null>(null)
  const totalCompra = ref(0)
  const clienteActual = ref<any>(null)
  const carrito = ref<EntradaCarrito[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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
  const setPeliculas = (nuevasPeliculas: Pelicula[]) => {
    peliculas.value = nuevasPeliculas
  }

  const setFunciones = (nuevasFunciones: Funcion[]) => {
    funciones.value = nuevasFunciones
  }

  const setAsientosSeleccionados = (asientos: Asiento[]) => {
    asientosSeleccionados.value = asientos
  }

  const agregarAsiento = (asiento: Asiento) => {
    if (asiento.disponible) {
      asientosSeleccionados.value.push(asiento)
    }
  }

  const removerAsiento = (asientoCodigo: string) => {
    asientosSeleccionados.value = asientosSeleccionados.value.filter(
      a => a.codigo !== asientoCodigo
    )
  }

  const limpiarAsientosSeleccionados = () => {
    asientosSeleccionados.value = []
  }

  const setFuncionActual = (funcion: Funcion) => {
    funcionActual.value = funcion
  }

  const setTotalCompra = (total: number) => {
    totalCompra.value = total
  }

  const setCliente = (cliente: any) => {
    clienteActual.value = cliente
  }

  const agregarAlCarrito = (entrada: EntradaCarrito) => {
    carrito.value.push(entrada)
  }

  const removerDelCarrito = (entradaId: string) => {
    carrito.value = carrito.value.filter(e => e.id !== entradaId)
  }

  const limpiarCarrito = () => {
    carrito.value = []
  }

  const setLoading = (estado: boolean) => {
    loading.value = estado
  }

  const setError = (mensaje: string | null) => {
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
    asientosSeleccionados,
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