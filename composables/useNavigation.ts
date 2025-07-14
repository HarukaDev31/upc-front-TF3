export const useNavigation = () => {
  const isLoading = ref(false)
  const router = useRouter()

  // Interceptar navegación
  router.beforeEach((to, from, next) => {
    isLoading.value = true
    next()
  })

  router.afterEach(() => {
    // Pequeño delay para que se vea el spinner
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  })

  return {
    isLoading
  }
} 