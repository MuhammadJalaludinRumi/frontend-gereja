import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export interface AuxiliaryPerson {
  id?: number
  id_local: string
  name: string
  family_relation?: string | null
  member_id?: number | null  // 👈 Tambahkan ini untuk relasi ke member
  [key: string]: any
}

export const useAuxiliaryPersons = () => {
  const apiBase = useApiUrl()
  const persons = ref<AuxiliaryPerson[]>([])
  const person = ref<AuxiliaryPerson | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }
    if (!isFormData) headers['Content-Type'] = 'application/json'

    if (isProd && xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken
    }
    if (!isProd && token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  // GET ALL
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/auxiliary-persons', {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      persons.value = res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data auxiliary persons'
    } finally {
      loading.value = false
    }
  }

  // 🔥 GET BY MEMBER ID (untuk load relasi si member ini)
  const fetchByMember = async (memberId: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/auxiliary-persons/by-member/${memberId}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      persons.value = res?.data ?? res
      return res?.data ?? res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat data auxiliary persons'
      return []
    } finally {
      loading.value = false
    }
  }

  // GET BY ID
  const fetchById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`/auxiliary-persons/${id}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })
      person.value = res
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat detail auxiliary person'
      person.value = null
    } finally {
      loading.value = false
    }
  }

  // CREATE
  const create = async (payload: Record<string, any>) => {
    try {
      const res = await $fetch('/auxiliary-persons', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      const newData = res?.data ?? res
      persons.value.push(newData)
      return newData
    } catch (err: any) {
      console.error('CREATE AUX ERROR:', err)
      throw err
    }
  }

  // UPDATE
  const update = async (id: number | string, payload: any) => {
    try {
      const res = await $fetch(`/auxiliary-persons/${id}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: payload
      })
      const updated = res?.data ?? res
      const idx = persons.value.findIndex(p => p.id === Number(id))
      if (idx !== -1) persons.value[idx] = updated
      return updated
    } catch (err) {
      console.error(err)
      throw new Error('Gagal update auxiliary person')
    }
  }

  // DELETE
  const remove = async (id: number | string) => {
    try {
      await $fetch(`/auxiliary-persons/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })
      persons.value = persons.value.filter(p => p.id !== Number(id))
      return true
    } catch (err) {
      console.error(err)
      throw new Error('Gagal menghapus auxiliary person')
    }
  }

  return {
    persons,
    person,
    fetchAll,
    fetchByMember,  // 👈 Export function baru
    fetchById,
    create,
    update,
    remove,
    loading,
    error
  }
}
