<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-slate-900 mb-4">
            Bienvenido a CINEMAX
          </h1>
          <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Descubre las mejores películas en la cartelera más actualizada. 
            Reserva tus asientos y disfruta de una experiencia cinematográfica única.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/peliculas" 
              class="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Ver Películas
            </NuxtLink>
            <NuxtLink 
              to="/metricas" 
              class="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Ver Métricas
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            ¿Por qué elegir CINEMAX?
          </h2>
          <p class="text-slate-600 max-w-2xl mx-auto">
            Ofrecemos la mejor experiencia cinematográfica con tecnología de vanguardia y el confort que mereces.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-6 rounded-lg border border-slate-200">
            <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">
              Cartelera Actualizada
            </h3>
            <p class="text-slate-600">
              Las últimas películas y estrenos disponibles en nuestra plataforma.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-6 rounded-lg border border-slate-200">
            <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">
              Reserva Fácil
            </h3>
            <p class="text-slate-600">
              Selecciona tus asientos favoritos de manera rápida y sencilla.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-6 rounded-lg border border-slate-200">
            <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">
              Métricas en Tiempo Real
            </h3>
            <p class="text-slate-600">
              Visualiza estadísticas detalladas de ocupación y rendimiento.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            ¿Listo para comenzar?
          </h2>
          <p class="text-slate-600 mb-8 max-w-2xl mx-auto">
            Explora nuestra cartelera y encuentra la película perfecta para tu próxima visita al cine.
          </p>
          <NuxtLink 
            to="/peliculas" 
            class="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Explorar Películas
          </NuxtLink>
        </div>
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