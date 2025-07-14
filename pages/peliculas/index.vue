<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-slate-900 mb-4">Nuestras Películas</h1>
          <p class="text-slate-600">Descubre la mejor selección de películas</p>
        </div>
      </div>
    </section>

    <!-- Filtros y Búsqueda -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <!-- Búsqueda -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="filtros.texto"
                type="text"
                placeholder="Buscar películas..."
                class="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                @input="buscarPeliculas"
              />
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Filtros -->
          <div class="flex flex-wrap gap-4">
            <select
              v-model="filtros.genero"
              class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              @change="buscarPeliculas"
            >
              <option value="">Todos los géneros</option>
              <option v-for="genero in generos" :key="genero.value" :value="genero.value">
                {{ genero.label }}
              </option>
            </select>
            
            <input
              v-model="filtros.fecha"
              type="date"
              class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              @input="buscarPeliculas"
            />
          </div>

          <!-- Ordenar -->
          <select
            v-model="orden"
            class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            @change="ordenarPeliculas"
          >
            <option v-for="opcion in opcionesOrden" :key="opcion.value" :value="opcion.value">
              {{ opcion.label }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- Lista de Películas -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            <span class="text-slate-600">Cargando películas...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-red-700 font-medium">{{ error }}</span>
          </div>
          <button 
            @click="cargarPeliculas" 
            class="mt-4 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- Películas -->
        <div v-else>
          <div v-if="peliculas.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
            </svg>
            <p class="text-slate-500">No se encontraron películas</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              v-for="pelicula in peliculas" 
              :key="pelicula._id"
              class="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div class="relative">
                <img 
                  :src="pelicula.poster_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Imagen'" 
                  :alt="pelicula.titulo"
                  class="w-full h-80 object-cover"
                />
                <div class="absolute top-3 right-3 bg-slate-900 text-white px-2 py-1 rounded text-sm font-medium">
                  {{ pelicula.rating }}/10
                </div>
                <div class="absolute top-3 left-3 bg-slate-600 text-white px-2 py-1 rounded text-xs">
                  {{ pelicula.clasificacion }}
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">{{ pelicula.titulo }}</h3>
                <p class="text-slate-600 mb-4 line-clamp-2 text-sm">{{ pelicula.descripcion }}</p>
                
                <div class="flex items-center justify-between mb-3 text-sm text-slate-500">
                  <span>{{ pelicula.genero }}</span>
                  <span>{{ pelicula.duracion }} min</span>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-1">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="text-sm text-slate-600">{{ pelicula.rating }}</span>
                  </div>
                  <span class="text-sm text-slate-500">{{ pelicula.director }}</span>
                </div>
                
                <NuxtLink 
                  :to="`/peliculas/${pelicula._id}`"
                  class="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors block text-center"
                >
                  Comprar
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="flex justify-center mt-8">
            <div class="flex items-center space-x-2">
              <button
                v-for="pagina in totalPaginas"
                :key="pagina"
                @click="cambiarPagina(pagina)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pagina === paginaActual 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                ]"
              >
                {{ pagina }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCineStore } from '~/stores/cine'

const api = useApi()
const cineStore = useCineStore()
const { setPeliculas } = cineStore

// Estado
const loading = ref(false)
const error = ref(null)
const peliculas = ref([])
const paginaActual = ref(1)
const totalPeliculas = ref(0)
const totalPaginas = ref(0)
const limite = 12

// Filtros
const filtros = ref({
  texto: '',
  genero: '',
  fecha: ''
})

const orden = ref('rating')

// Opciones
const generos = [
  { label: 'Acción', value: 'accion' },
  { label: 'Aventura', value: 'aventura' },
  { label: 'Comedia', value: 'comedia' },
  { label: 'Drama', value: 'drama' },
  { label: 'Terror', value: 'terror' },
  { label: 'Ciencia Ficción', value: 'ciencia_ficcion' },
  { label: 'Romance', value: 'romance' },
  { label: 'Documental', value: 'documental' }
]

const opcionesOrden = [
  { label: 'Rating', value: 'rating' },
  { label: 'Título', value: 'titulo' },
  { label: 'Fecha', value: 'fecha' },
  { label: 'Género', value: 'genero' }
]

// Cargar películas
const cargarPeliculas = async () => {
  loading.value = true
  error.value = null
  
  try {
    const offset = (paginaActual.value - 1) * limite
    const response = await api.getPeliculas(limite, offset)
    
    if (response.data.peliculas) {
      peliculas.value = response.data.peliculas || []
      totalPeliculas.value = response.data.peliculas.total || 0
      totalPaginas.value = response.data.peliculas.total_pages || 0
      setPeliculas(response.data.peliculas || [])
    } else {
      error.value = response.error || 'Error al cargar las películas'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando películas:', err)
  } finally {
    loading.value = false
  }
}

// Buscar películas
const buscarPeliculas = async () => {
  if (!filtros.value.texto && !filtros.value.genero && !filtros.value.fecha) {
    await cargarPeliculas()
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const response = await api.buscarPeliculas({
      texto: filtros.value.texto,
      genero: filtros.value.genero,
      fecha: filtros.value.fecha,
      limite: limite
    })
    
    if (response.data.resultados) {
      peliculas.value = response.data.resultados
      totalPeliculas.value = response.data.resultados.length
      totalPaginas.value = 1
      setPeliculas(response.data.resultados)
    } else {
      error.value = response.error || 'Error en la búsqueda'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error buscando películas:', err)
  } finally {
    loading.value = false
  }
}

// Ordenar películas
const ordenarPeliculas = () => {
  if (orden.value === 'rating') {
    peliculas.value.sort((a, b) => b.rating - a.rating)
  } else if (orden.value === 'titulo') {
    peliculas.value.sort((a, b) => a.titulo.localeCompare(b.titulo))
  } else if (orden.value === 'fecha') {
    peliculas.value.sort((a, b) => new Date(b.fecha_estreno) - new Date(a.fecha_estreno))
  } else if (orden.value === 'genero') {
    peliculas.value.sort((a, b) => a.genero.localeCompare(b.genero))
  }
}

// Cambiar página
const cambiarPagina = (nuevaPagina) => {
  paginaActual.value = nuevaPagina
  cargarPeliculas()
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarPeliculas()
})
</script> 