<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <AppHeader />

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Cinemax</h3>
            <p class="text-gray-400">
              Tu destino para la mejor experiencia cinematográfica con tecnología de vanguardia.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Enlaces</h3>
            <ul class="space-y-2 text-gray-400">
              <li><NuxtLink to="/peliculas" class="hover:text-white transition-colors">Películas</NuxtLink></li>
              <li><NuxtLink to="/cartelera" class="hover:text-white transition-colors">Cartelera</NuxtLink></li>
              <li><NuxtLink to="/metricas" class="hover:text-white transition-colors">Métricas</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Contacto</h3>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-center space-x-2">
                <Icon name="heroicons:envelope" class="w-4 h-4" />
                <span>info@cinemax.com</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon name="heroicons:phone" class="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Cinemax. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout principal de la aplicación
</script> 