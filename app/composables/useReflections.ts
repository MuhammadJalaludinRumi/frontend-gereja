import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Reflection {
  id: number
  date_post: string
  title: string
  content: string
  image?: string
  status: number
}

export const useReflections = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()

  const reflections = ref<Reflection[]>([])
  const currentReflection = ref<Reflection | null>(null)
  const meta = ref({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

  const loading = ref(false)
  const saving = shallowRef(false)
  const error = ref<string | null>(null)

  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // Headers generator
  const getHeaders = (publicMode = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }

    if (publicMode) return headers // login page mode

    headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  const fetchAll = async (params?: {
    page?: number
    per_page?: number
    search?: string
  }) => {
    loading.value = true

    try {
      const res: any = await $fetch<Reflection[]>(`${apiBase}/reflections`, {
        headers: getHeaders(false),
        credentials: 'include',
        params
      })

      reflections.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
    } catch (e) {
      console.error('❌ fetchAll:', e)
      error.value = 'Gagal memuat renungan'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async ( id: number ) => {
    loading.value = true

    try {
      currentReflection.value = await $fetch<Reflection>(`${apiBase}/reflections/${id}`, {
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (e) {
      console.error('❌ fetchById:', e)
      error.value = 'Gagal memuat detail renungan'
    } finally {
      loading.value = false
    }
  }

  const create = async ( payload: Reflection ) => {
    saving.value = true
    try {
      await $fetch(`${apiBase}/reflections`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      });
    } catch (e) {
      console.error('Gagal menyimpan renungan', e)
      error.value = 'Gagal menyimpan renungan'
    } finally {
      saving.value = false
    }
  }

  const update = async (id: number, payload: Partial<Reflection>) => {
    saving.value = true
    try {
      await $fetch(`${apiBase}/reflections/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
    } catch (e) {
      console.error('Gagal memperbarui renungan', e)
      error.value = 'Gagal memperbarui renungan'
    } finally {
      saving.value = false
    }
  }

  const remove = async (id: number) => {
    return await $fetch(`${apiBase}/reflections/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return {
    reflections,
    currentReflection,
    meta,

    loading,
    error,
    saving,
    
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  }
}