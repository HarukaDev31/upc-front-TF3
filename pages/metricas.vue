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
                :key="pelicula._id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ pelicula.pelicula.titulo }}</h4>
                  <p class="text-sm text-gray-600">{{ pelicula.total_asientos }} entradas vendidas</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-purple-600">${{ pelicula.total_ventas.toLocaleString() }}</p>
                  <div class="flex items-center space-x-1">
                    <UIcon name="heroicons:star" class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-gray-600">{{ pelicula.total_transacciones }} transacciones</span>
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
                :key="pelicula._id"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-black">{{ pelicula.pelicula.titulo }}</span>
                  <span class="text-gray-600">{{ pelicula.total_asientos }} entradas</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(pelicula.total_asientos / maxVentas) * 100}%` }"
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
        
        <!-- Resumen de Ocupación -->
        <div v-if="resumenOcupacion" class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <p class="text-blue-600 text-sm font-medium">Total Salas</p>
              <p class="text-2xl font-bold text-blue-800">{{ resumenOcupacion.total_salas }}</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <p class="text-green-600 text-sm font-medium">Total Asientos</p>
              <p class="text-2xl font-bold text-green-800">{{ resumenOcupacion.total_asientos }}</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4 text-center">
              <p class="text-purple-600 text-sm font-medium">Asientos Ocupados</p>
              <p class="text-2xl font-bold text-purple-800">{{ resumenOcupacion.total_ocupados }}</p>
            </div>
            <div class="bg-orange-50 rounded-lg p-4 text-center">
              <p class="text-orange-600 text-sm font-medium">Promedio Ocupación</p>
              <p class="text-2xl font-bold text-orange-800">{{ resumenOcupacion.promedio_ocupacion.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
        
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
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ sala.nombre }}</h3>
                <p class="text-sm text-gray-600">{{ sala.pelicula }}</p>
                <p class="text-xs text-gray-500">{{ sala.tipo.toUpperCase() }}</p>
              </div>
              <div class="text-right">
                <span 
                  :class="{
                    'text-green-600': sala.porcentaje_ocupacion >= 80,
                    'text-yellow-600': sala.porcentaje_ocupacion >= 50 && sala.porcentaje_ocupacion < 80,
                    'text-red-600': sala.porcentaje_ocupacion < 50
                  }"
                  class="font-bold text-lg"
                >
                  {{ sala.porcentaje_ocupacion }}%
                </span>
                <div class="text-xs text-gray-500">
                  <span :class="{
                    'text-green-600': sala.estado === 'programada',
                    'text-blue-600': sala.estado === 'en_curso',
                    'text-gray-600': sala.estado === 'finalizada'
                  }">
                    {{ sala.estado.replace('_', ' ').toUpperCase() }}
                  </span>
                </div>
              </div>
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
              
              <div class="text-xs text-gray-500 space-y-1">
                <div>{{ sala.asientos_disponibles }} asientos disponibles</div>
                <div>{{ sala.transacciones_confirmadas }} transacciones confirmadas</div>
                <div class="text-blue-600">{{ new Date(sala.fecha_hora).toLocaleString('es-ES') }}</div>
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
            
            <div v-if="cargandoGeneros" class="flex justify-center py-8">
              <UIcon name="heroicons:arrow-path" class="w-6 h-6 animate-spin text-purple-500" />
            </div>

            <div v-else-if="errorGeneros" class="text-center py-8">
              <UIcon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p class="text-red-600 text-sm">{{ errorGeneros }}</p>
            </div>

            <div v-else-if="generosPopulares.length === 0" class="text-center py-8">
              <p class="text-gray-500">No hay datos de géneros disponibles</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="genero in generosPopulares" 
                :key="genero.nombre"
                class="p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-gray-900">{{ genero.nombre }}</span>
                  <span class="text-sm font-medium text-purple-600">{{ genero.porcentaje }}%</span>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    class="bg-purple-500 h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${genero.porcentaje}%` }"
                  ></div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span class="font-medium">Ventas:</span> ${{ genero.total_ventas.toLocaleString() }}
                  </div>
                  <div>
                    <span class="font-medium">Transacciones:</span> {{ genero.total_transacciones }}
                  </div>
                  <div>
                    <span class="font-medium">Asientos:</span> {{ genero.total_asientos }}
                  </div>
                  <div>
                    <span class="font-medium">Películas:</span> {{ genero.peliculas_unicas }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Horarios Pico -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Horarios Pico</h3>
            
            <div v-if="cargandoHorarios" class="flex justify-center py-8">
              <UIcon name="heroicons:arrow-path" class="w-6 h-6 animate-spin text-green-500" />
            </div>

            <div v-else-if="errorHorarios" class="text-center py-8">
              <UIcon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p class="text-red-600 text-sm">{{ errorHorarios }}</p>
            </div>

            <div v-else-if="horariosPico.length === 0" class="text-center py-8">
              <p class="text-gray-500">No hay datos de horarios disponibles</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="horario in horariosPico" 
                :key="horario.hora"
                class="p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <span class="font-semibold text-gray-900">{{ horario.hora }}</span>
                    <div class="text-xs text-gray-500">
                      {{ horario.dia_semana }} - {{ horario.periodo }}
                    </div>
                  </div>
                  <span class="text-sm font-medium text-green-600">{{ horario.porcentaje }}%</span>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    class="bg-green-500 h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${horario.porcentaje}%` }"
                  ></div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span class="font-medium">Ventas:</span> ${{ horario.total_ventas.toLocaleString() }}
                  </div>
                  <div>
                    <span class="font-medium">Transacciones:</span> {{ horario.total_transacciones }}
                  </div>
                  <div>
                    <span class="font-medium">Asientos:</span> {{ horario.total_asientos }}
                  </div>
                  <div>
                    <span class="font-medium">Funciones:</span> {{ horario.funciones_unicas }}
                  </div>
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
const cargandoGeneros = ref(false)
const errorGeneros = ref(null)
const cargandoHorarios = ref(false)
const errorHorarios = ref(null)
const rankingPeliculas = ref([])
const ocupacionSalas = ref([])
const resumenOcupacion = ref(null)
const generosPopulares = ref([])
const resumenGeneros = ref(null)
const horariosPico = ref([])
const resumenHorarios = ref(null)

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
  const ocupacionPromedio = resumenOcupacion.value ? resumenOcupacion.value.promedio_ocupacion : 78
  
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
  return Math.max(...rankingPeliculas.value.map(p => p.total_asientos))
})

// Cargar ranking
const cargarRanking = async () => {
  cargandoRanking.value = true
  errorRanking.value = null
  
  try {
    const response = await api.getRankingPeliculas(10)
    if (response.success && response.data) {
      // Extraer el array ranking_mongodb del response
      rankingPeliculas.value = response.data.ranking_mongodb || []
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
    const response = await api.getOcupacionSalas()
    if (response.success && response.data) {
      // Guardar el resumen de ocupación
      resumenOcupacion.value = response.data.resumen
      
      // Transformar los datos del response a la estructura esperada por el template
      ocupacionSalas.value = response.data.salas.map(sala => ({
        sala_id: sala.sala.id,
        nombre: sala.sala.nombre,
        tipo: sala.sala.tipo,
        asientos_ocupados: sala.estadisticas.ocupados,
        asientos_totales: sala.estadisticas.total_asientos,
        porcentaje_ocupacion: sala.estadisticas.porcentaje_ocupacion,
        asientos_disponibles: sala.estadisticas.disponibles,
        pelicula: sala.pelicula.titulo,
        funcion_id: sala.funcion_id,
        fecha_hora: sala.fecha_hora_inicio,
        estado: sala.estado,
        transacciones_confirmadas: sala.transacciones_confirmadas
      }))
    } else {
      errorOcupacion.value = response.error || 'Error al cargar la ocupación de salas'
    }
  } catch (err) {
    errorOcupacion.value = 'Error de conexión'
    console.error('Error cargando ocupación:', err)
  } finally {
    cargandoOcupacion.value = false
  }
}

// Cargar géneros populares
const cargarGenerosPopulares = async () => {
  cargandoGeneros.value = true
  errorGeneros.value = null
  
  try {
    const response = await api.getGenerosPopulares()
    if (response.success && response.data) {
      // Guardar el resumen de géneros
      resumenGeneros.value = response.data.resumen
      
      // Transformar los datos del response a la estructura esperada por el template
      const totalVentas = response.data.resumen.total_ventas
      generosPopulares.value = response.data.generos.map(genero => ({
        nombre: genero.genero.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        porcentaje: totalVentas > 0 ? Math.round((genero.total_ventas / totalVentas) * 100) : 0,
        total_ventas: genero.total_ventas,
        total_transacciones: genero.total_transacciones,
        total_asientos: genero.total_asientos,
        peliculas_unicas: genero.peliculas_unicas,
        promedio_venta: genero.promedio_venta
      }))
    } else {
      errorGeneros.value = response.error || 'Error al cargar los géneros populares'
    }
  } catch (err) {
    errorGeneros.value = 'Error de conexión'
    console.error('Error cargando géneros:', err)
  } finally {
    cargandoGeneros.value = false
  }
}

// Cargar horarios pico
const cargarHorariosPico = async () => {
  cargandoHorarios.value = true
  errorHorarios.value = null
  
  try {
    const response = await api.getHorariosPico()
    if (response.success && response.data) {
      // Guardar el resumen de horarios
      resumenHorarios.value = response.data.resumen
      
      // Transformar los datos del response a la estructura esperada por el template
      const totalVentas = response.data.resumen.total_ventas
      horariosPico.value = response.data.horarios.map(horario => ({
        hora: horario.hora_formateada,
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
      errorHorarios.value = response.error || 'Error al cargar los horarios pico'
    }
  } catch (err) {
    errorHorarios.value = 'Error de conexión'
    console.error('Error cargando horarios:', err)
  } finally {
    cargandoHorarios.value = false
  }
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