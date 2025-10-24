// composables/useRules.ts
import { ref } from 'vue'
import { useRoles } from './useRoles'
import { useAcls } from './useAcls'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useRules = () => {
  const apiBase = useApiUrl()
  const rules = ref<any[]>([])
  const rule = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { roles, fetchAll: fetchRoles } = useRoles()
  const { acls, fetchAll: fetchAcls } = useAcls()

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'
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

  // 🔹 Fetch all rules + join role & acl
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch('/rules', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      rules.value = Array.isArray(res) ? res : []

      // fetch roles & acls
      await fetchRoles()
      await fetchAcls()

      // map supaya rule punya property role & acl
      rules.value = rules.value.map(r => ({
        ...r,
        role: roles.value?.find(role => role.id === r.role_id) ?? { name: '-' },
        acl: acls.value?.find(a => a.id === r.acl_id) ?? { name: '-' }
      }))

      console.log('Mapped rules:', rules.value)
    } catch (err) {
      console.error('Gagal memuat rules:', err)
      error.value = 'Gagal memuat rules'
      rules.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch(`/rules/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      rule.value = res ?? {}

      await fetchRoles()
      await fetchAcls()
      rule.value.role = roles.value?.find(role => role.id === rule.value.role_id) ?? { name: '-' }
      rule.value.acl = acls.value?.find(a => a.id === rule.value.acl_id) ?? { name: '-' }

      return rule.value
    } catch (err) {
      console.error('Gagal memuat rule:', err)
      error.value = 'Gagal memuat rule'
      rule.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: any) => {
    try {
      await $fetch('/rules', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchAll()
    } catch (err) {
      console.error('Gagal membuat rule:', err)
      throw new Error('Gagal membuat rule')
    }
  }

  const update = async (id: number, payload: any) => {
    try {
      await $fetch(`/rules/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      await fetchAll()
    } catch (err) {
      console.error('Gagal memperbarui rule:', err)
      throw new Error('Gagal memperbarui rule')
    }
  }

  const remove = async (id: number) => {
    try {
      await $fetch(`/rules/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
      await fetchAll()
    } catch (err) {
      console.error('Gagal menghapus rule:', err)
      throw new Error('Gagal menghapus rule')
    }
  }

  return {
    rules,
    rule,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
