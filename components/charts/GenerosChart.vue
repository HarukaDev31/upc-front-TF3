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
  
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#0ea5e9', '#22c55e', '#fb923c', '#dc2626'
  ]

  const chartData = {
    labels: props.data.map(item => item.genero),
    datasets: [
      {
        data: props.data.map(item => item.total_ventas),
        backgroundColor: colors.slice(0, props.data.length),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3
      }
    ]
  }

  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#64748b',
            font: {
              size: 12
            },
            usePointStyle: true,
            padding: 20
          }
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
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${context.label}: S/ ${new Intl.NumberFormat('es-PE', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(value)} (${percentage}%)`
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