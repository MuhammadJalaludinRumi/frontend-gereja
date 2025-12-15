import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AssetLoan {
  id?: number
  asset_id: number | string
  borrower_name: string
  borrower_type: 'jemaat' | 'komisi' | 'internal'
  loan_date: string
  expected_return_date: string
  actual_return_date?: string | null
  status: 'borrowed' | 'returned' | 'late'
  notes?: string | null
}

export const useAssetLoans = () => {
  const apiBase = useApiUrl()

  const loans = ref<AssetLoan[]>([])
  const loan = ref<AssetLoan | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'

  // Cookies
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  // 🔹 Build headers
  const getHeaders = (isFormData = false): Record<string, string> => {
    const h: Record<string, string> = { Accept: 'application/json' }

    if (!isFormData) h['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) h['X-XSRF-TOKEN'] = xsrfToken
    if (!isProd && token) h['Authorization'] = `Bearer ${token}`

    return h
  }

  // 🔹 Fetch All Loans
  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/asset-loans', {
        baseURL: apiBase,
        credentials: 'include',
        headers: getHeaders(),
      })

      loans.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data peminjaman'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Fetch Single
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch(`/asset-loans/${id}`, {
        baseURL: apiBase,
        credentials: 'include',
        headers: getHeaders(),
      })

      loan.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat peminjaman'
      loan.value = null
    } finally {
      loading.value = false
    }
  }

  // 🔹 Create
  const create = async (payload: AssetLoan) => {
    try {
      const res = await $fetch('/asset-loans', {
        baseURL: apiBase,
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
        body: payload,
      })

      const created = res?.data ?? res
      loans.value.push(created)
      return created
    } catch (err: any) {
      console.error('CREATE ERROR:', err)
      throw new Error(err.response?._data?.message || 'Gagal membuat data peminjaman')
    }
  }

  // 🔹 Update
  const update = async (id: number | string, payload: Partial<AssetLoan>) => {
    try {
      const res = await $fetch(`/asset-loans/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
        body: payload,
      })

      const updated = res?.data ?? res
      const idx = loans.value.findIndex(l => l.id === Number(id))
      if (idx !== -1) loans.value[idx] = updated

      return updated
    } catch (err: any) {
      console.error('UPDATE ERROR:', err)
      throw new Error(err.response?._data?.message || 'Gagal memperbarui peminjaman')
    }
  }

  // 🔹 Delete
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/asset-loans/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
      })

      loans.value = loans.value.filter(l => l.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus peminjaman')
    }
  }

  return {
    loans,
    loan,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error,
  }
}
