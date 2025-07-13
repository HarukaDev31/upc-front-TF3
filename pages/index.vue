<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-purple-900/80 z-10"></div>
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
      
      <div class="relative z-20 text-center text-white px-4">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Bienvenido a Cinemax
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
          Descubre las mejores películas en la experiencia cinematográfica más avanzada
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton 
            to="/peliculas" 
            size="lg" 
            color="purple"
            class="text-lg px-8 py-4"
          >
            Ver Películas
          </UButton>
          <UButton 
            to="/cartelera" 
            size="lg" 
            variant="outline"
            class="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
          >
            Ver Cartelera
          </UButton>
        </div>
      </div>
    </section>

    <!-- Películas Destacadas -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Películas Destacadas</h2>
          <p class="text-xl text-gray-600">Las mejores películas que no te puedes perder</p>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
        </div>

        <div v-else-if="error" class="text-center py-12">
          <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600">{{ error }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="pelicula in peliculasDestacadas" 
            :key="pelicula._id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="relative">
              <img 
                :src="pelicula.poster_url || 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Imagen'" 
                :alt="pelicula.titulo"
                class="w-full h-80 object-cover"
              />
              <div class="absolute top-4 right-4 bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                {{ pelicula.rating || '10' }}/10
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ pelicula.titulo }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ pelicula.sinopsis || 'Sin descripción disponible' }}</p>
              
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-gray-500 bg-purple-100 px-2 py-1 rounded-full" v-for="genero in pelicula.generos" :key="genero">{{ genero }}</span>
                <span class="text-sm text-gray-500">{{ pelicula.duracion_minutos || 'N/A' }} min</span>
              </div>
              
              <UButton 
                :to="`/peliculas/${pelicula._id}`"
                color="purple"
                class="w-full"
              >
                Ver Detalles
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Estadísticas -->
    <section class="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div class="text-4xl font-bold mb-2">{{ estadisticas.peliculas }}</div>
            <p class="text-purple-100">Películas Disponibles</p>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">{{ estadisticas.funciones }}</div>
            <p class="text-purple-100">Funciones Hoy</p>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">{{ estadisticas.salas }}</div>
            <p class="text-purple-100">Salas de Cine</p>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">{{ estadisticas.clientes }}</div>
            <p class="text-purple-100">Clientes Satisfechos</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Características -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Cinemax?</h2>
          <p class="text-xl text-gray-600">Descubre lo que nos hace únicos</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="heroicons:film" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Tecnología de Vanguardia</h3>
            <p class="text-gray-600">Salas equipadas con la última tecnología en sonido e imagen para una experiencia inmersiva.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="heroicons:clock" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Reservas Online</h3>
            <p class="text-gray-600">Reserva tus entradas desde cualquier dispositivo, 24/7, sin filas ni esperas.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="heroicons:star" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Mejor Selección</h3>
            <p class="text-gray-600">Las mejores películas nacionales e internacionales, estrenos y clásicos.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-4">¿Listo para tu próxima aventura?</h2>
        <p class="text-xl text-gray-300 mb-8">Explora nuestra cartelera y reserva tus entradas ahora</p>
        <UButton 
          to="/peliculas" 
          size="lg" 
          color="purple"
          class="text-lg px-8 py-4"
        >
          Ver Cartelera Completa
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCineStore } from '~/stores/cine'

const api = useApi()
const cineStore = useCineStore()
const { setPeliculas, setLoading, setError } = cineStore

const loading = ref(false)
const error = ref(null)
const peliculasDestacadas = ref([])

// Estadísticas mock
const estadisticas = ref({
  peliculas: 25,
  funciones: 48,
  salas: 8,
  clientes: 15000
})

// Cargar películas destacadas
const cargarPeliculasDestacadas = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getPeliculas(8, 0)

    console.log('API Response:', response)
    
    if (response.success && response.data.peliculas) {
      // La API devuelve directamente un array de películas
      peliculasDestacadas.value = response.data.peliculas || []
      setPeliculas(response.data.peliculas || [])
    } else {
      error.value = response.error || 'Error al cargar las películas'
      console.error('Error en respuesta API:', response)
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando películas:', err)
  } finally {
    loading.value = false
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarPeliculasDestacadas()
})
</script> 