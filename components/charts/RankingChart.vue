<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartCanvas = ref(null)
let chart = null

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  
  const chartData = {
    labels: props.data.map(item => item.pelicula.titulo),
    datasets: [
      {
        label: 'Ventas Totales',
        data: props.data.map(item => item.total_ventas),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(220, 38, 127, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(220, 38, 127, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  }

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const value = context.parsed.y
              return `Ventas: S/ ${new Intl.NumberFormat('es-PE', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(value)}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 12
            },
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          grid: {
            color: 'rgba(148, 163, 184, 0.1)'
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 12
            },
            callback: function(value) {
              return 'S/ ' + new Intl.NumberFormat('es-PE').format(value)
            }
          }
        }
      }
    }
  }

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, config)
}

onMounted(() => {
  if (props.data.length > 0) {
    createChart()
  }
})

watch(() => props.data, (newData) => {
  if (newData.length > 0) {
    createChart()
  }
}, { deep: true })

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style> 