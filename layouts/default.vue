<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:film" class="w-6 h-6 text-white" />
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cinemax
            </span>
          </NuxtLink>

          <!-- Navegación -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
            >
              Inicio
            </NuxtLink>
            <NuxtLink 
              to="/peliculas" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
            >
              Películas
            </NuxtLink>
            <NuxtLink 
              to="/cartelera" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
            >
              Cartelera
            </NuxtLink>
            <NuxtLink 
              to="/metricas" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
            >
              Métricas
            </NuxtLink>
          </nav>

          <!-- Carrito y Usuario -->
          <div class="flex items-center space-x-4">
            <!-- Carrito -->
            <button 
              @click="toggleCarrito"
              class="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
              <span 
                v-if="totalCarrito > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ carrito.length }}
              </span>
            </button>

            <!-- Menú móvil -->
            <button 
              @click="toggleMenu"
              class="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Icon name="heroicons:bars-3" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Menú móvil -->
        <div 
          v-if="menuAbierto"
          class="md:hidden mt-4 pb-4 border-t border-white/10"
        >
          <nav class="flex flex-col space-y-4 pt-4">
            <NuxtLink 
              to="/" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
              @click="menuAbierto = false"
            >
              Inicio
            </NuxtLink>
            <NuxtLink 
              to="/peliculas" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
              @click="menuAbierto = false"
            >
              Películas
            </NuxtLink>
            <NuxtLink 
              to="/cartelera" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
              @click="menuAbierto = false"
            >
              Cartelera
            </NuxtLink>
            <NuxtLink 
              to="/metricas" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              active-class="text-purple-400"
              @click="menuAbierto = false"
            >
              Métricas
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

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

    <!-- Modal del carrito -->
    <UModal v-model="carritoAbierto" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Carrito de Compras</h3>
            <button @click="carritoAbierto = false" class="text-gray-400 hover:text-gray-600">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
        </template>

        <div v-if="carrito.length === 0" class="text-center py-8">
          <Icon name="heroicons:shopping-cart" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">Tu carrito está vacío</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="entrada in carrito" :key="entrada.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ entrada.id }}</p>
              <p class="text-sm text-gray-500">{{ entrada.asientos.join(', ') }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-semibold">${{ entrada.precio_total }}</span>
              <button 
                @click="removerDelCarrito(entrada.id)"
                class="text-red-500 hover:text-red-700"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <template #footer>
          <div v-if="carrito.length > 0" class="flex items-center justify-between">
            <span class="font-semibold">Total: ${{ totalCarrito }}</span>
            <UButton @click="procederCompra" color="purple">
              Proceder al Pago
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useCineStore } from '~/stores/cine'
import { storeToRefs } from 'pinia'
const cineStore = useCineStore()
const { carrito, totalCarrito } = storeToRefs(cineStore)
const { removerDelCarrito } = cineStore

const menuAbierto = ref(false)
const carritoAbierto = ref(false)

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

const toggleCarrito = () => {
  carritoAbierto.value = !carritoAbierto.value
}

const procederCompra = () => {
  // Implementar lógica de compra
  carritoAbierto.value = false
}
</script> 