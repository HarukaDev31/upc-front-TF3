<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="flex items-center space-x-2">
        <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        <span class="text-slate-600">Cargando película...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-red-700 font-medium">{{ error }}</span>
        </div>
        <button 
          @click="cargarDatos" 
          class="mt-4 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Contenido de la película -->
    <div v-else-if="pelicula" class="min-h-screen bg-slate-50">
      <!-- Hero Section -->
      <section class="relative h-[500px] overflow-hidden">
        <div class="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          :src="pelicula.poster_url || 'https://via.placeholder.com/1920x500/1f2937/ffffff?text=Sin+Imagen'" 
          :alt="pelicula.titulo"
          class="absolute inset-0 w-full h-full object-cover"
        />
        
        <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div class="max-w-4xl">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">{{ pelicula.titulo }}</h1>
            <p class="text-xl text-gray-200 mb-6 max-w-2xl">{{ pelicula.sinopsis }}</p>
            
            <div class="flex flex-wrap items-center gap-6 text-white mb-8">
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ pelicula.duracion_minutos }} min</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ formatDate(pelicula.fecha_estreno) }}</span>
              </div>
              <div class="bg-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                {{ pelicula.clasificacion }}
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink 
                to="#funciones"
                class="bg-slate-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center"
              >
                Ver Funciones
              </NuxtLink>
              <button 
                v-if="pelicula.trailer_url"
                @click="reproducirTrailer"
                class="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-slate-900 transition-colors text-center"
              >
                Ver Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Información detallada -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Información principal -->
            <div class="lg:col-span-2">
              <h2 class="text-3xl font-bold text-slate-900 mb-6">Sinopsis</h2>
              <p class="text-lg text-slate-600 leading-relaxed mb-8">{{ pelicula.sinopsis }}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900 mb-4">Detalles</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-slate-600">Géneros:</span>
                      <span class="font-medium text-slate-900">{{ pelicula.generos.join(', ') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Director:</span>
                      <span class="font-medium text-slate-900">{{ pelicula.director }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Duración:</span>
                      <span class="font-medium text-slate-900">{{ pelicula.duracion_minutos }} minutos</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Clasificación:</span>
                      <span class="font-medium text-slate-900">{{ pelicula.clasificacion }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Fecha de estreno:</span>
                      <span class="font-medium text-slate-900">{{ formatDate(pelicula.fecha_estreno) }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-xl font-semibold text-slate-900 mb-4">Reparto Principal</h3>
                  <div class="space-y-2">
                    <div v-for="actor in pelicula.actores_principales" :key="actor" class="text-slate-600">
                      {{ actor }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Poster -->
            <div class="lg:col-span-1">
              <div class="sticky top-8">
                <img 
                  :src="pelicula.poster_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Imagen'" 
                  :alt="pelicula.titulo"
                  class="w-full rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Funciones -->
      <section id="funciones" class="py-16 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-slate-900 mb-8 text-center">Funciones Disponibles</h2>
          
          <div v-if="cargandoFunciones" class="flex justify-center py-12">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              <span class="text-slate-600">Cargando funciones...</span>
            </div>
          </div>

          <div v-else-if="errorFunciones" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-700 font-medium">{{ errorFunciones }}</span>
            </div>
          </div>

          <div v-else-if="funciones.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-slate-500">No hay funciones disponibles para esta película</p>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              v-for="funcion in funciones" 
              :key="funcion._id"
              class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <!-- Información de la función -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-semibold text-slate-900">{{ formatDateTime(funcion.fecha_hora_inicio) }}</h3>
                  <span 
                    :class="{
                      'text-green-600 bg-green-50': funcion.estado === 'programada',
                      'text-red-600 bg-red-50': funcion.estado === 'cancelada',
                      'text-yellow-600 bg-yellow-50': funcion.estado === 'en_curso'
                    }"
                    class="text-sm font-medium capitalize px-3 py-1 rounded-full"
                  >
                    {{ funcion.estado }}
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-slate-600">Horario:</span>
                    <span class="font-medium text-slate-900">{{ formatTime(funcion.fecha_hora_inicio) }} - {{ formatTime(funcion.fecha_hora_fin) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Sala:</span>
                    <span class="font-medium text-slate-900">{{ funcion.sala.nombre }} ({{ funcion.sala.tipo.toUpperCase() }})</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Capacidad:</span>
                    <span class="font-medium text-slate-900">{{ funcion.sala.capacidad_total }} asientos</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Precio base:</span>
                    <span class="font-semibold text-slate-900">${{ formatPrice(funcion.precio_base) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Precio VIP:</span>
                    <span class="font-semibold text-slate-900">${{ formatPrice(funcion.precio_vip) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Idioma:</span>
                    <span class="font-medium text-slate-900">{{ funcion.idioma_audio }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Subtítulos:</span>
                    <span class="font-medium text-slate-900">{{ funcion.subtitulos ? 'Sí' : 'No' }}</span>
                  </div>
                </div>
              </div>

              <!-- Equipamiento de la sala -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-slate-900 mb-3">Equipamiento de la Sala</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="equipo in funcion.sala.equipamiento" 
                    :key="equipo"
                    class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                  >
                    {{ equipo }}
                  </span>
                </div>
              </div>

              <!-- Estadísticas -->
              <div class="mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 class="text-lg font-semibold text-slate-900 mb-3">Estadísticas</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-slate-900">{{ funcion.ventas_totales }}</div>
                    <div class="text-sm text-slate-600">Ventas</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${{ formatPrice(funcion.ingresos_totales) }}</div>
                    <div class="text-sm text-slate-600">Ingresos</div>
                  </div>
                </div>
              </div>

              <NuxtLink 
                :to="`/funciones/${funcion._id}/asientos`"
                :class="[
                  'w-full py-3 px-4 rounded-lg font-medium text-center transition-colors',
                  funcion.estado === 'programada' 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                ]"
              >
                {{ funcion.estado === 'programada' ? 'Seleccionar Asientos' : 'No Disponible' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal del trailer -->
    <div v-if="trailerAbierto" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full">
        <div class="flex justify-between items-center p-4 border-b border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900">Trailer</h3>
          <button @click="trailerAbierto = false" class="text-slate-500 hover:text-slate-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <div class="relative aspect-video">
            <iframe
              v-if="pelicula?.trailer_url"
              :src="pelicula.trailer_url"
              class="w-full h-full rounded-lg"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const api = useApi()

// Estado
const loading = ref(true)
const error = ref(null)
const pelicula = ref(null)
const funciones = ref([])
const cargandoFunciones = ref(false)
const errorFunciones = ref(null)
const trailerAbierto = ref(false)

// Obtener ID de la película
const peliculaId = route.params.id

// Cargar datos de película y funciones
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Cargar película y funciones usando el endpoint correcto
    const response = await api.getPeliculaConFunciones(peliculaId)
    
    if (response.success && response.data.pelicula) {
      pelicula.value = response.data.pelicula
      funciones.value = response.data.funciones || []
    } else {
      error.value = 'No se pudo cargar la información de la película'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando datos:', err)
  } finally {
    loading.value = false
  }
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Formatear fecha y hora
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear hora
const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear precio
const formatPrice = (price) => {
  if (!price) return '0'
  return price.toLocaleString('es-CO')
}

// Reproducir trailer
const reproducirTrailer = () => {
  if (pelicula.value?.trailer_url) {
    trailerAbierto.value = true
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarDatos()
})
</script> 