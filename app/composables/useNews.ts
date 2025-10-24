import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface News {
  id?: number
  date_post: string
  title: string
  content: string
  thumbnail?: string
  image?: string
  status: number
}

export const useNews = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()
  const news = ref<News[]>([])
  const currentNews = ref<News | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // cek mode prod buat header handling
  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // header dinamis kayak di useAcls
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  // ambil semua berita
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<News[]>('/news', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      news.value = res
    } catch (err) {
      console.error('❌ fetchAll error:', err)
      error.value = 'Gagal memuat berita'
    } finally {
      loading.value = false
    }
  }

  // ambil satu berita by id
  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<News>(`/news/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      currentNews.value = res
    } catch (err) {
      console.error('❌ fetchById error:', err)
      error.value = 'Gagal memuat detail berita'
    } finally {
      loading.value = false
    }
  }

  // create berita
  const create = async (payload: News) => {
    try {
      const res = await $fetch('/news', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error('❌ create error:', err)
      throw new Error('Gagal membuat berita')
    }
  }

  // update berita
  const update = async (id: number, payload: Partial<News>) => {
    try {
      const res = await $fetch(`/news/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error('❌ update error:', err)
      throw new Error('Gagal memperbarui berita')
    }
  }

  // hapus berita
  const remove = async (id: number) => {
    try {
      await $fetch(`/news/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error('❌ delete error:', err)
      throw new Error('Gagal menghapus berita')
    }
  }

  // ✅ tambahkan alias biar konsisten kayak useInvoices
  return {
    news,
    currentNews,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    // 🔥 alias-friendly biar gak error di komponen
    fetchNews: fetchAll,
    fetchNewsById: fetchById,
    createNews: create,
    updateNews: update,
    deleteNews: remove,
    loading,
    error
  }
}
