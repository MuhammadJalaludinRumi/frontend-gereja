export interface User {
  id?: number
  username: string
  password?: string
  name: string
  is_active: boolean
  role_id: number
}

export const useUsers = () => {
  const apiBase = useApiUrl()
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const meta = ref<PaginationMeta>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = shallowRef(false)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // ambil token & xsrf
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (isProd && xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) headers['Authorization'] = `Bearer ${token}`

    return headers
  }

  // GET semua user
  const fetchAll = async (params?: {
    page?: number
    per_page?: number
    search?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<PaginatedResponse<User>>('/users', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
        params
      })
      
      users.value = res.data
      meta.value = {
        total: res.total,
        per_page: res.per_page,
        current_page: res.current_page,
        last_page: res.last_page
      }
    } catch (err) {
      console.error('Gagal fetch users:', err)
      error.value = 'Gagal memuat data users'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true

    try {
      currentUser.value = await $fetch(`/users/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
      })
    } catch (e) {
      console.error('Gagal fetch users:', e)
      error.value = 'Gagal memuat data users'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: User) => {
    saving.value = true

    try {
      await $fetch('/users', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
    } catch (err) {
      console.error('Gagal create user:', err)
      error.value = 'Gagal membuat user baru'
    } finally { 
      saving.value = false
    }
  }

  // PUT update user
  const update = async (id: number, payload: Partial<User>) => {
    saving.value = true

    try {
      await $fetch(`/users/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
    } catch (err) {
      console.error('Gagal update user:', err)
      error.value ='Gagal memperbarui user'
    } finally {
      saving.value = false
    }
  }

  // DELETE user
  const remove = async (id: number) => {
    try {
      await $fetch(`/users/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error('Gagal hapus user:', err)
      error.value = 'Gagal menghapus user'
    }
  }

  return { 
    users, 
    currentUser,
    meta, 
    fetchAll,  
    fetchById,
    create, 
    update, 
    remove,
    loading, 
    saving,
    error 
  }
}
