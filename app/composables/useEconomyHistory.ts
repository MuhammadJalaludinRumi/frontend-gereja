import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie } from '#app'

export function useEconomyHistory() {
  const apiUrl = useApiUrl()
  const token = useCookie('token')
  const error = ref<string | null>(null)
  const history = ref([])

  const fetchHistory = async (id: number) => {
    error.value = null
    try {
      const res: any = await $fetch(`${apiUrl}/economy/${id}/history`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      history.value = res.data || []
    } catch (err) {
      console.error('Gagal mengambil history:', err)
      error.value = 'Gagal mengambil riwayat ekonomi'
    }
  }

  const addHistory = async (payload: any) => {
    try {
      await $fetch(`${apiUrl}/economy/{id}/history`, {
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    } catch (err) {
      console.error('Gagal menambah riwayat:', err)
    }
  }

  return {
    history,
    fetchHistory,
    addHistory,
    error,
  }
}
