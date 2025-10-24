import { ref } from 'vue'
import { useApiUrl, useSanctumUrl } from './useApiUrl'
import { useRuntimeConfig, useCookie } from '#app'

export interface Invoice {
  id?: number
  organization_id: number
  organization?: { name: string }
  date: string
  current_expiry: string
  new_expiry: string
  total: number
}

export const useInvoices = () => {
  const apiBase = useApiUrl()
  const sanctumBase = useSanctumUrl()
  const config = useRuntimeConfig()

  const invoices = ref<Invoice[]>([])
  const invoice = ref<Invoice | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isProd =
    config.public.sessionSecureCookie === true ||
    config.public.sessionSecureCookie === 'true'

  // 🔹 auto setup csrf kalau belum ada cookie
  const ensureCsrfCookie = async () => {
    const xsrfToken = useCookie('XSRF-TOKEN')
    if (!xsrfToken.value) {
      try {
        await $fetch('/sanctum/csrf-cookie', {
          baseURL: sanctumBase,
          credentials: 'include'
        })
        console.info('✅ CSRF cookie initialized')
      } catch (err) {
        console.error('❌ Failed to init Sanctum CSRF cookie:', err)
      }
    }
  }

  // 🔹 dynamic header builder
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    const xsrfToken = useCookie('XSRF-TOKEN')
    const token = useCookie('token')

    if (isProd && xsrfToken.value) {
      headers['X-XSRF-TOKEN'] = xsrfToken.value
    }
    if (!isProd && token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    return headers
  }

  // 🔹 Get all invoices
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      await ensureCsrfCookie()
      const res = await $fetch<Invoice[]>('/invoices', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      invoices.value = res
    } catch (err: any) {
      console.error('FetchAll error:', err)
      error.value = 'Gagal memuat data invoice'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Get invoice by id
  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await ensureCsrfCookie()
      const res = await $fetch<Invoice>(`/invoices/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      invoice.value = res
    } catch (err: any) {
      console.error('FetchById error:', err)
      error.value = 'Gagal memuat data invoice'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create invoice
  const create = async (payload: Invoice) => {
    try {
      await ensureCsrfCookie()
      const res = await $fetch<Invoice>('/invoices', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      invoices.value.push(res)
      return res
    } catch (err: any) {
      console.error('Create error:', err)
      throw new Error('Gagal membuat invoice')
    }
  }

  // 🔹 Update invoice
  const update = async (id: number, payload: Partial<Invoice>) => {
    try {
      await ensureCsrfCookie()
      const res = await $fetch<Invoice>(`/invoices/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) invoices.value[index] = { ...invoices.value[index], ...res }
      return res
    } catch (err: any) {
      console.error('Update error:', err)
      throw new Error('Gagal memperbarui invoice')
    }
  }

  // 🔹 Delete invoice
  const remove = async (id: number) => {
    try {
      await ensureCsrfCookie()
      await $fetch(`/invoices/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
      invoices.value = invoices.value.filter(inv => inv.id !== id)
    } catch (err: any) {
      console.error('Remove error:', err)
      throw new Error('Gagal menghapus invoice')
    }
  }

  return {
    invoices,
    invoice,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
