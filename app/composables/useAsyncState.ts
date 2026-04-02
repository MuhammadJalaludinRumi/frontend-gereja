export const useAsyncState = () => {
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  const startLoading = () => {
    loading.value = true
    error.value = null
  }

  const stopLoading = () => {
    loading.value = false
  }

  const startSaving = () => {
    saving.value = true
    error.value = null
  }

  const stopSaving = () => {
    saving.value = false
  }

  const setError = (err: any, defaultMessage = 'Terjadi kesalahan') => {
    error.value = defaultMessage || err?.data?.message || err?.message 
  }

  const reset = () => {
    loading.value = false
    saving.value = false
    error.value = null
  }

  return {
    loading,
    saving,
    error,
    startLoading,
    stopLoading,
    startSaving,
    stopSaving,
    setError,
    reset
  }
}