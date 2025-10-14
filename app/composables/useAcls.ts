// composables/useAcls.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'

export const useAcls = () => {
  const apiBase = useApiUrl()  // auto ambil dari env, bisa prod/dev
  const acls = ref<any[]>([])
  const acl = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/acls', {
        baseURL: apiBase,
        credentials: 'include'
      })
      acls.value = res
    } catch (err) {
      error.value = 'Gagal memuat data ACL'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        credentials: 'include'
      })
      acl.value = res
    } catch (err) {
      error.value = 'Gagal memuat data ACL'
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: { name: string }) => {
    try {
      const res = await $fetch('/acls', {
        baseURL: apiBase,
        method: 'POST',
        credentials: 'include',
        body: payload
      })
      return res
    } catch {
      throw new Error('Gagal membuat ACL')
    }
  }

  const update = async (id: number, payload: { name: string }) => {
    try {
      const res = await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        credentials: 'include',
        body: payload
      })
      return res
    } catch {
      throw new Error('Gagal memperbarui ACL')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/acls/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        credentials: 'include'
      })
    } catch {
      throw new Error('Gagal menghapus ACL')
    }
  }

  return { acls, acl, fetchAll, fetchById, create, update, remove, loading, error }
}
