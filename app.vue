<template>
  <div>
    <!-- Spinner de navegación -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl p-8 shadow-2xl">
          <div class="flex flex-col items-center space-y-4">
            <!-- Spinner principal -->
            <div class="relative">
              <div class="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
              <div class="absolute top-0 left-0 w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <!-- Texto de carga -->
            <div class="text-center">
              <p class="text-slate-900 font-medium">Cargando...</p>
              <p class="text-slate-600 text-sm">Por favor espera</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Contenido principal -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Configuración global de la aplicación
useHead({
  title: 'Cinemax - Sistema de Cine',
  meta: [
    { name: 'description', content: 'Sistema de cine moderno con reservas online' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// Composable para manejar la navegación
const { isLoading } = useNavigation()
</script>

<style>
/* Estilos globales */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
}

/* Utilidades personalizadas */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
