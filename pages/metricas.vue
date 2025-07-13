<template>
  <div>
    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
      <div class="container mx-auto px-4 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Métricas y Analytics</h1>
        <p class="text-xl text-purple-100">Análisis detallado del rendimiento del cine</p>
      </div>
    </section>

    <!-- Estadísticas Generales -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100">Total Ventas</p>
                <p class="text-3xl font-bold">{{ estadisticas.totalVentas }}</p>
              </div>
              <UIcon name="heroicons:currency-dollar" class="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100">Entradas Vendidas</p>
                <p class="text-3xl font-bold">{{ estadisticas.entradasVendidas }}</p>
              </div>
              <UIcon name="heroicons:ticket" class="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100">Ocupación Promedio</p>
                <p class="text-3xl font-bold">{{ estadisticas.ocupacionPromedio }}%</p>
              </div>
              <UIcon name="heroicons:chart-bar" class="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100">Películas Activas</p>
                <p class="text-3xl font-bold">{{ estadisticas.peliculasActivas }}</p>
              </div>
              <UIcon name="heroicons:film" class="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ranking de Películas -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Ranking de Películas</h2>
          <USelect
            v-model="periodoRanking"
            :options="periodos"
            placeholder="Período"
            class="w-40"
            @update:model-value="cargarRanking"
          />
        </div>

        <div v-if="cargandoRanking" class="flex justify-center py-12">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
        </div>

        <div v-else-if="errorRanking" class="text-center py-12">
          <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600">{{ errorRanking }}</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Top 5 Películas -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Top 5 Películas</h3>
            <div class="space-y-4">
              <div 
                v-for="(pelicula, index) in rankingPeliculas.slice(0, 5)" 
                :key="pelicula.pelicula_id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ pelicula.titulo }}</h4>
                  <p class="text-sm text-gray-600">{{ pelicula.ventas_totales }} entradas vendidas</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-purple-600">${{ pelicula.ingresos_totales.toLocaleString() }}</p>
                  <div class="flex items-center space-x-1">
                    <UIcon name="heroicons:star" class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-gray-600">{{ pelicula.rating_promedio }}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de Ventas -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Ventas por Película</h3>
            <div class="space-y-4">
              <div 
                v-for="pelicula in rankingPeliculas.slice(0, 5)" 
                :key="pelicula.pelicula_id"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-medium">{{ pelicula.titulo }}</span>
                  <span class="text-gray-600">{{ pelicula.ventas_totales }} entradas</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(pelicula.ventas_totales / maxVentas) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ocupación de Salas -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Ocupación de Salas</h2>
        
        <div v-if="cargandoOcupacion" class="flex justify-center py-12">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
        </div>

        <div v-else-if="errorOcupacion" class="text-center py-12">
          <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600">{{ errorOcupacion }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="sala in ocupacionSalas" 
            :key="sala.sala_id"
            class="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ sala.nombre }}</h3>
              <span 
                :class="{
                  'text-green-600': sala.porcentaje_ocupacion >= 80,
                  'text-yellow-600': sala.porcentaje_ocupacion >= 50 && sala.porcentaje_ocupacion < 80,
                  'text-red-600': sala.porcentaje_ocupacion < 50
                }"
                class="font-bold"
              >
                {{ sala.porcentaje_ocupacion }}%
              </span>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Asientos ocupados:</span>
                <span class="font-medium">{{ sala.asientos_ocupados }}/{{ sala.asientos_totales }}</span>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  :class="{
                    'bg-green-500': sala.porcentaje_ocupacion >= 80,
                    'bg-yellow-500': sala.porcentaje_ocupacion >= 50 && sala.porcentaje_ocupacion < 80,
                    'bg-red-500': sala.porcentaje_ocupacion < 50
                  }"
                  class="h-3 rounded-full transition-all duration-300"
                  :style="{ width: `${sala.porcentaje_ocupacion}%` }"
                ></div>
              </div>
              
              <div class="text-xs text-gray-500">
                {{ sala.asientos_disponibles.length }} asientos disponibles
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tendencias -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Tendencias</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Géneros Más Populares -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Géneros Más Populares</h3>
            <div class="space-y-4">
              <div 
                v-for="genero in generosPopulares" 
                :key="genero.nombre"
                class="flex items-center justify-between"
              >
                <span class="font-medium">{{ genero.nombre }}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-purple-500 h-2 rounded-full"
                      :style="{ width: `${genero.porcentaje}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ genero.porcentaje }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Horarios Pico -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Horarios Pico</h3>
            <div class="space-y-4">
              <div 
                v-for="horario in horariosPico" 
                :key="horario.hora"
                class="flex items-center justify-between"
              >
                <span class="font-medium">{{ horario.hora }}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-green-500 h-2 rounded-full"
                      :style="{ width: `${horario.ocupacion}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ horario.ocupacion }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const api = useApi()

// Estado
const cargandoRanking = ref(false)
const errorRanking = ref(null)
const cargandoOcupacion = ref(false)
const errorOcupacion = ref(null)
const rankingPeliculas = ref([])
const ocupacionSalas = ref([])

// Filtros
const periodoRanking = ref('mes')

// Opciones
const periodos = [
  { label: 'Esta Semana', value: 'semana' },
  { label: 'Este Mes', value: 'mes' },
  { label: 'Este Año', value: 'año' }
]

// Estadísticas mock
const estadisticas = ref({
  totalVentas: 125000,
  entradasVendidas: 8500,
  ocupacionPromedio: 78,
  peliculasActivas: 12
})

// Datos mock para tendencias
const generosPopulares = ref([
  { nombre: 'Acción', porcentaje: 35 },
  { nombre: 'Comedia', porcentaje: 25 },
  { nombre: 'Drama', porcentaje: 20 },
  { nombre: 'Terror', porcentaje: 15 },
  { nombre: 'Documental', porcentaje: 5 }
])

const horariosPico = ref([
  { hora: '20:00', ocupacion: 95 },
  { hora: '22:00', ocupacion: 85 },
  { hora: '18:00', ocupacion: 75 },
  { hora: '16:00', ocupacion: 60 },
  { hora: '14:00', ocupacion: 45 }
])

// Computed
const maxVentas = computed(() => {
  if (rankingPeliculas.value.length === 0) return 1
  return Math.max(...rankingPeliculas.value.map(p => p.ventas_totales))
})

// Cargar ranking
const cargarRanking = async () => {
  cargandoRanking.value = true
  errorRanking.value = null
  
  try {
    const response = await api.getRankingPeliculas(10)
    if (response.success && response.data) {
      rankingPeliculas.value = response.data
    } else {
      errorRanking.value = response.error || 'Error al cargar el ranking'
    }
  } catch (err) {
    errorRanking.value = 'Error de conexión'
    console.error('Error cargando ranking:', err)
  } finally {
    cargandoRanking.value = false
  }
}

// Cargar ocupación
const cargarOcupacion = async () => {
  cargandoOcupacion.value = true
  errorOcupacion.value = null
  
  try {
    // Simular datos de ocupación
    ocupacionSalas.value = [
      {
        sala_id: 'sala_1',
        nombre: 'Sala 1 - 2D',
        asientos_ocupados: 85,
        asientos_totales: 100,
        porcentaje_ocupacion: 85,
        asientos_disponibles: []
      },
      {
        sala_id: 'sala_2',
        nombre: 'Sala 2 - 3D',
        asientos_ocupados: 120,
        asientos_totales: 150,
        porcentaje_ocupacion: 80,
        asientos_disponibles: []
      },
      {
        sala_id: 'sala_3',
        nombre: 'Sala 3 - IMAX',
        asientos_ocupados: 200,
        asientos_totales: 250,
        porcentaje_ocupacion: 80,
        asientos_disponibles: []
      }
    ]
  } catch (err) {
    errorOcupacion.value = 'Error de conexión'
    console.error('Error cargando ocupación:', err)
  } finally {
    cargandoOcupacion.value = false
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarRanking(),
    cargarOcupacion()
  ])
})
</script> 