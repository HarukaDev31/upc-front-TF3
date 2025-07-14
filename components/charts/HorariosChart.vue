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
    labels: props.data.map(item => item.horario),
    datasets: [
      {
        label: 'Ventas por Horario',
        data: props.data.map(item => item.total_ventas),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  const config = {
    type: 'line',
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
            color: 'rgba(148, 163, 184, 0.1)'
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 12
            }
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