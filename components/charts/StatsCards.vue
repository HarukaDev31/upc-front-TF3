<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Total de Ventas -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Total de Ventas</p>
          <p class="text-2xl font-bold text-slate-900">S/ {{ formatCurrency(stats.totalVentas) }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ stats.peliculasActivas }} películas activas</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Entradas Vendidas -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Entradas Vendidas</p>
          <p class="text-2xl font-bold text-slate-900">{{ stats.entradasVendidas }}</p>
          <p class="text-xs text-slate-500 mt-1">Total de asientos ocupados</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Ocupación Promedio -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Ocupación Promedio</p>
          <p class="text-2xl font-bold text-slate-900">{{ Math.round(stats.ocupacionPromedio) }}%</p>
          <p class="text-xs text-slate-500 mt-1">Promedio de salas</p>
        </div>
        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Películas Activas -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Películas Activas</p>
          <p class="text-2xl font-bold text-slate-900">{{ stats.peliculasActivas }}</p>
          <p class="text-xs text-slate-500 mt-1">En cartelera</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
</script> 