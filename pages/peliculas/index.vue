<template>
  <div>
    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
      <div class="container mx-auto px-4 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Nuestras Películas</h1>
        <p class="text-xl text-purple-100">Descubre la mejor selección de películas</p>
      </div>
    </section>

    <!-- Filtros y Búsqueda -->
    <section class="bg-white py-8 border-b">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <!-- Búsqueda -->
          <div class="flex-1 max-w-md">
            <UInput
              v-model="filtros.texto"
              placeholder="Buscar películas..."
              icon="heroicons:magnifying-glass"
              @input="buscarPeliculas"
            />
          </div>

          <!-- Filtros -->
          <div class="flex flex-wrap gap-4">
            <USelect
              v-model="filtros.genero"
              :options="generos"
              placeholder="Género"
              class="w-40"
              @update:model-value="buscarPeliculas"
            />
            
            <UInput
              v-model="filtros.fecha"
              type="date"
              placeholder="Fecha"
              class="w-40"
              @input="buscarPeliculas"
            />
          </div>

          <!-- Ordenar -->
          <USelect
            v-model="orden"
            :options="opcionesOrden"
            placeholder="Ordenar por"
            class="w-40"
            @update:model-value="ordenarPeliculas"
          />
        </div>
      </div>
    </section>

    <!-- Lista de Películas -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600">{{ error }}</p>
          <UButton @click="cargarPeliculas" color="purple" class="mt-4">
            Reintentar
          </UButton>
        </div>

        <!-- Películas -->
        <div v-else>
          <div v-if="peliculas.length === 0" class="text-center py-12">
            <UIcon name="heroicons:film" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No se encontraron películas</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div 
              v-for="pelicula in peliculas" 
              :key="pelicula._id"
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div class="relative">
                <img 
                  :src="pelicula.poster_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Imagen'" 
                  :alt="pelicula.titulo"
                  class="w-full h-80 object-cover"
                />
                <div class="absolute top-4 right-4 bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {{ pelicula.rating }}/10
                </div>
                <div class="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  {{ pelicula.clasificacion }}
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{{ pelicula.titulo }}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">{{ pelicula.descripcion }}</p>
                
                <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <span>{{ pelicula.genero }}</span>
                  <span>{{ pelicula.duracion }} min</span>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-1">
                    <UIcon name="heroicons:star" class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-gray-600">{{ pelicula.rating }}</span>
                  </div>
                  <span class="text-sm text-gray-500">{{ pelicula.director }}</span>
                </div>
                
                <div class="flex gap-2">
                  <UButton 
                    :to="`/peliculas/${pelicula._id}`"
                    color="purple"
                    variant="outline"
                    class="flex-1"
                  >
                    Detalles
                  </UButton>
                  <UButton 
                    :to="`/peliculas/${pelicula._id}/funciones`"
                    color="purple"
                    class="flex-1"
                  >
                    Comprar
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="flex justify-center mt-12">
            <UPagination
              v-model="paginaActual"
              :page-count="totalPaginas"
              :total="totalPeliculas"
              @update:model-value="cambiarPagina"
            />
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
  { label: 'Todos', value: '' },
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
    
    if (response.peliculas) {
      peliculas.value = response.peliculas || []
      totalPeliculas.value = response.peliculas.total || 0
      totalPaginas.value = response.peliculas.total_pages || 0
      setPeliculas(response.peliculas || [])
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
    
    if (response.peliculas) {
      peliculas.value = response.peliculas
      totalPeliculas.value = response.peliculas.length
      totalPaginas.value = 1
      setPeliculas(response.peliculas)
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