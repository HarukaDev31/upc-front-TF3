<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-slate-900">CINEMAX</h2>
        <p class="mt-2 text-slate-600">Tu experiencia cinematográfica</p>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
        <slot />
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-sm text-slate-500">
          &copy; 2024 CINEMAX. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Layout específico para páginas de autenticación
</script> 