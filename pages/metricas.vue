<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Dashboard de Métricas</h1>
        <p class="text-slate-600">Análisis detallado del rendimiento del cine</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span class="text-slate-600">Cargando métricas...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-red-700 font-medium">{{ error }}</span>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Stats Cards -->
        <StatsCards :stats="estadisticas" />

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Ranking de Películas Chart -->
          <div class="bg-white rounded-lg border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-slate-900">Ranking de Películas</h2>
              <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            
            <div v-if="rankingLoading" class="flex justify-center py-8">
              <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
            
            <div v-else-if="rankingError" class="text-red-600 text-center py-4">{{ rankingError }}</div>
            
            <div v-else>
              <RankingChart :data="rankingPeliculas" />
            </div>
          </div>

          <!-- Géneros Populares Chart -->
          <div class="bg-white rounded-lg border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-slate-900">Géneros Más Populares</h2>
              <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
            </div>
            
            <div v-if="generosLoading" class="flex justify-center py-8">
              <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
            
            <div v-else-if="generosError" class="text-red-600 text-center py-4">{{ generosError }}</div>
            
            <div v-else>
              <GenerosChart :data="generosPopulares" />
            </div>
          </div>
        </div>

        <!-- Horarios Pico Chart -->
        <div class="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-slate-900">Horarios Pico</h2>
            <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          
          <div v-if="horariosLoading" class="flex justify-center py-8">
            <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
          
          <div v-else-if="horariosError" class="text-red-600 text-center py-4">{{ horariosError }}</div>
          
          <div v-else>
            <HorariosChart :data="horariosPico" />
          </div>
        </div>

        <!-- Ocupación de Salas -->
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-slate-900">Ocupación de Salas</h2>
            <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          
          <div v-if="ocupacionLoading" class="flex justify-center py-8">
            <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
          
          <div v-else-if="ocupacionError" class="text-red-600 text-center py-4">{{ ocupacionError }}</div>
          
          <div v-else class="space-y-4">
            <div v-if="ocupacionSalas.length === 0" class="text-center py-8">
              <div class="text-slate-500 mb-2">
                <svg class="w-12 h-12 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <p class="text-slate-600">No hay datos de ocupación disponibles</p>
            </div>
            <div 
              v-else
              v-for="sala in ocupacionSalas" 
              :key="sala._id"
              class="p-4 bg-slate-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-medium text-slate-900">{{ sala.nombre_sala }}</h3>
                <span class="text-sm text-slate-600">{{ sala.pelicula }}</span>
              </div>
              
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-600">Ocupación</span>
                <span class="text-sm font-medium text-slate-900">{{ sala.asientos_ocupados }}/{{ sala.asientos_totales }}</span>
              </div>
              
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div 
                  class="bg-slate-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(sala.asientos_ocupados / sala.asientos_totales) * 100}%` }"
                ></div>
              </div>
              
              <div class="flex justify-between mt-2 text-xs text-slate-500">
                <span>{{ sala.asientos_disponibles }} disponibles</span>
                <span>{{ Math.round((sala.asientos_ocupados / sala.asientos_totales) * 100) }}% ocupada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RankingChart from '~/components/charts/RankingChart.vue'
import GenerosChart from '~/components/charts/GenerosChart.vue'
import HorariosChart from '~/components/charts/HorariosChart.vue'
import StatsCards from '~/components/charts/StatsCards.vue'

const api = useApi()

// Estado
const loading = ref(false)
const error = ref(null)
const rankingLoading = ref(false)
const rankingError = ref(null)
const ocupacionLoading = ref(false)
const ocupacionError = ref(null)
const generosLoading = ref(false)
const generosError = ref(null)
const horariosLoading = ref(false)
const horariosError = ref(null)
const rankingPeliculas = ref([])
const ocupacionSalas = ref([])
const generosPopulares = ref([])
const horariosPico = ref([])

// Filtros
const periodoRanking = ref('mes')

// Opciones
const periodos = [
  { label: 'Esta Semana', value: 'semana' },
  { label: 'Este Mes', value: 'mes' },
  { label: 'Este Año', value: 'año' }
]

// Estadísticas calculadas dinámicamente
const estadisticas = computed(() => {
  const totalVentas = rankingPeliculas.value.reduce((sum, pelicula) => sum + pelicula.total_ventas, 0)
  const entradasVendidas = rankingPeliculas.value.reduce((sum, pelicula) => sum + pelicula.total_asientos, 0)
  const peliculasActivas = rankingPeliculas.value.length
  
  // Usar datos reales de ocupación si están disponibles
  const ocupacionPromedio = ocupacionSalas.value.length > 0 ? ocupacionSalas.value.reduce((sum, sala) => sum + sala.asientos_ocupados, 0) / ocupacionSalas.value.length : 78
  
  return {
    totalVentas,
    entradasVendidas,
    ocupacionPromedio,
    peliculasActivas
  }
})



// Computed
const maxVentas = computed(() => {
  if (rankingPeliculas.value.length === 0) return 1
  return Math.max(...rankingPeliculas.value.map(p => p.total_ventas))
})

// Cargar ranking
const cargarRanking = async () => {
  rankingLoading.value = true
  rankingError.value = null
  
  try {
    const response = await api.getRankingPeliculas(10)
    console.log('Respuesta del ranking:', response)
    if (response.success && response.data) {
      // Extraer el array ranking_mongodb del response
      rankingPeliculas.value = response.data.ranking_mongodb || []
      console.log('Ranking de películas cargado:', rankingPeliculas.value)
    } else {
      rankingError.value = response.error || 'Error al cargar el ranking'
    }
  } catch (err) {
    rankingError.value = 'Error de conexión'
    console.error('Error cargando ranking:', err)
  } finally {
    rankingLoading.value = false
  }
}

// Cargar ocupación
const cargarOcupacion = async () => {
  ocupacionLoading.value = true
  ocupacionError.value = null
  
  try {
    const response = await api.getOcupacionSalas()
    if (response.success && response.data) {
      // Guardar el resumen de ocupación
      // No hay resumenOcupacion.value en el nuevo template, asumimos que los datos están directamente en ocupacionSalas.value
      
      // Transformar los datos del response a la estructura esperada por el template
      ocupacionSalas.value = response.data.salas.map(sala => ({
        _id: sala._id, // Assuming _id is available
        nombre_sala: sala.sala.nombre,
        pelicula: sala.pelicula.titulo,
        asientos_ocupados: sala.estadisticas.ocupados,
        asientos_totales: sala.estadisticas.total_asientos,
        asientos_disponibles: sala.estadisticas.disponibles
      }))
    } else {
      ocupacionError.value = response.error || 'Error al cargar la ocupación de salas'
    }
  } catch (err) {
    ocupacionError.value = 'Error de conexión'
    console.error('Error cargando ocupación:', err)
  } finally {
    ocupacionLoading.value = false
  }
}

// Cargar géneros populares
const cargarGenerosPopulares = async () => {
  generosLoading.value = true
  generosError.value = null
  
  try {
    const response = await api.getGenerosPopulares()
    if (response.success && response.data) {
      // Guardar el resumen de géneros
      // No hay resumenGeneros.value en el nuevo template, asumimos que los datos están directamente en generosPopulares.value
      
      // Transformar los datos del response a la estructura esperada por el template
      const totalVentas = response.data.resumen.total_ventas
      generosPopulares.value = response.data.generos.map(genero => ({
        genero: genero.genero.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        porcentaje: totalVentas > 0 ? Math.round((genero.total_ventas / totalVentas) * 100) : 0,
        total_ventas: genero.total_ventas,
        total_transacciones: genero.total_transacciones,
        total_asientos: genero.total_asientos,
        peliculas_count: genero.peliculas_unicas,
        promedio_venta: genero.promedio_venta
      }))
    } else {
      generosError.value = response.error || 'Error al cargar los géneros populares'
    }
  } catch (err) {
    generosError.value = 'Error de conexión'
    console.error('Error cargando géneros:', err)
  } finally {
    generosLoading.value = false
  }
}

// Cargar horarios pico
const cargarHorariosPico = async () => {
  horariosLoading.value = true
  horariosError.value = null
  
  try {
    const response = await api.getHorariosPico()
    if (response.success && response.data) {
      // Guardar el resumen de horarios
      // No hay resumenHorarios.value en el nuevo template, asumimos que los datos están directamente en horariosPico.value
      
      // Transformar los datos del response a la estructura esperada por el template
      const totalVentas = response.data.resumen.total_ventas
      horariosPico.value = response.data.horarios.map(horario => ({
        horario: horario.hora_formateada,
        dia_semana: horario.dia_semana_nombre,
        periodo: horario.periodo,
        porcentaje: totalVentas > 0 ? Math.round((horario.total_ventas / totalVentas) * 100) : 0,
        total_ventas: horario.total_ventas,
        total_transacciones: horario.total_transacciones,
        total_asientos: horario.total_asientos,
        funciones_unicas: horario.funciones_unicas || 0,
        promedio_venta: horario.promedio_venta
      }))
    } else {
      horariosError.value = response.error || 'Error al cargar los horarios pico'
    }
  } catch (err) {
    horariosError.value = 'Error de conexión'
    console.error('Error cargando horarios:', err)
  } finally {
    horariosLoading.value = false
  }
}

// Función para formatear moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarRanking(),
    cargarOcupacion(),
    cargarGenerosPopulares(),
    cargarHorariosPico()
  ])
})
</script> 