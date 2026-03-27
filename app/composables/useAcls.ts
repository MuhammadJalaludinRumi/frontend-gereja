export interface Acl {
  id: number
  name: string
  create_at: string
}

export const useAcls = () => {
  const apiBase = useApiUrl()  // ambil dari env
  const acls = ref<Acl[]>([])
  const acl = ref<Acl | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = shallowRef(false)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Ambil csrf token & token auth
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    if (isProd && xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken
    }

    if (!isProd && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const fetchAll = async (params?: { search?: string }) => {
    loading.value = true
    error.value = null
    try {
      const res: Acl[] = await $fetch('/acls', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
        params
      })

      acls.value = res
    } catch (err) {
      error.value = 'Gagal memuat data ACL'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res: Acl = await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      acl.value = res
    } catch (err) {
      error.value = 'Gagal memuat data ACL'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: { name: string }) => {
    saving.value = true

    try {
      const res = await $fetch('/acls', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal membuat ACL'
    } finally {
      saving.value = false
    }
  }

  const update = async (id: number, payload: { name: string }) => {
    saving.value = true

    try {
      const res = await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      return res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memperbarui ACL'
    } finally {
      saving.value = false
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      error.value = 'Gagal menghapus ACL'
    }
  }

  return { acls, acl, fetchAll, fetchById, create, update, remove, loading, saving, error }
}
