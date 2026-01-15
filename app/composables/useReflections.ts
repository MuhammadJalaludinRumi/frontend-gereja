import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface Reflection {
  id?: number
  date_post: string
  title: string
  content: string
  image: string
  status: number
}

export const useReflections = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()

  const reflections = ref<Reflection[]>([])
  const currentReflection = ref<Reflection | null>(null)

  const loading = ref(false)
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

  const fetchAll = async () => {
    loading.value = true

    try {
      reflections.value = await $fetch<Reflection[]>(`${apiBase}/reflections`, {
        headers: getHeaders(false),
        credentials: 'include'
      })
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
      console.error('❌ fetchAll:', e)
      error.value = 'Gagal memuat detail renungan'
    } finally {
      loading.value = false
    }
  }

  const create = async ( payload: Reflection ) => {
    return await $fetch(`${apiBase}/reflections`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    });
  }

  const update = async (id: number, payload: Partial<Reflection>) => {
    return await $fetch(`${apiBase}/reflections/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: payload
    })
  }

  const remove = async (id: number) => {
    return await $fetch(`${apiBase}/reflections/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return {
    // state
    reflections,
    currentReflection,
    loading,
    error,
    
    // protected
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  }
}