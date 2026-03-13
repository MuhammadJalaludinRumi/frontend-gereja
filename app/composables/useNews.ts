export interface News {
  id?: number
  date_post: string
  title: string
  content: string
  thumbnail?: string
  image?: string
  status: number
  show_on_login?: number
}

export const useNews = () => {
  const apiBase = useApiUrl()
  const config = useRuntimeConfig()

  const news = ref<News[]>([])
  const currentNews = ref<News | null>(null)
  const loginNews = ref<News | null>(null)
  const meta = ref({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const error = shallowRef<string | null>(null)

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

  async function fetchLoginNews() {
    try {
      const { data }: any = await useFetch('/api/news/login')
      console.log('LOGIN NEWS:', data.value)
      loginNews.value = data.value
    } catch (err) {
      console.error('Error fetch login news:', err)
    }
  }


  // ============================
  // 🔵 2. PUBLIC NEWS
  // ============================
  const fetchPublicNews = async () => {
    try {
      news.value = await $fetch<News[]>(`${apiBase}/news`, {
        method: 'GET',
        headers: getHeaders(true)
      })
    } catch (err) {
      console.error('❌ fetchPublicNews:', err)
    }
  }

  // ============================
  // 🔵 3. PROTECTED NEWS (ADMIN)
  // ============================

  const fetchAll = async (params?: {
    page?: number
    per_page?: number
    search?: string
  }) => {
    loading.value = true
    try {
      const res: any = await $fetch<News[]>(`${apiBase}/news`, {
        headers: getHeaders(false),
        credentials: 'include',
        params,
      })

      news.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
    } catch (e) {
      console.error('❌ fetchAll:', e)
      error.value = 'Gagal memuat berita'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, publicMode = false) => {
    loading.value = true
    try {
      currentNews.value = await $fetch<News>(`${apiBase}/news/${id}`, {
        headers: getHeaders(publicMode),
        credentials: publicMode ? undefined : 'include'
      })
    } catch (e) {
      console.error('❌ fetchById:', e)
      error.value = 'Gagal memuat detail berita'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: News) => {
    saving.value = true
    try {
      await $fetch(`${apiBase}/news`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
    } catch (e) {
      console.error('Gagal menyimpan berita', e)
      error.value = 'Gagal menyimpan berita'
    } finally {
      saving.value = false
    }
  }

  const update = async (id: number, payload: Partial<News>) => {
    saving.value = true
    try {
      await $fetch(`${apiBase}/news/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
    } catch (e) {
      console.error('Gagal memperbarui berita', e)
      error.value = 'Gagal memperbarui berita'
    } finally {
      saving.value = false
    }
  }

  const remove = async (id: number) => {
    return await $fetch(`${apiBase}/news/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
  }

  return {
    // state
    news,
    currentNews,
    loginNews,
    meta,

    loading,
    saving,
    error,

    // public
    fetchPublicNews,
    fetchLoginNews,

    // protected
    fetchAll,
    fetchById,
    create,
    update,
    remove,

    // alias
    fetchNews: fetchAll,
    fetchNewsById: fetchById,
    createNews: create,
    updateNews: update,
    deleteNews: remove
  }
}
