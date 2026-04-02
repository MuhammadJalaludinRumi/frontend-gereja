export interface Group {
  id: number
  name: string
  address: string
  city: City
  phone: string
  email: string
  website: string
  logo: string
  founded: string
  legal: string
}

export const useGroups = () => {
  const groups = ref<Group[]>([])
  const group = ref<Group | null>(null)

  const { request, loading, saving, error } = useApiFetch()


  const fetchAll = async (params?: {
    search?: string
  }) => {
    groups.value = await request<Group[]>('/groups', { params })
  }

  const fetchById = async (id: number) => {
    group.value = await request<Group>(`/groups/${id}`)
  }

  const create = async (payload: FormData) => {
    await request('/groups', {
      method: 'POST',
      body: payload,
    })
  }

  const update = async (id: number, payload: FormData) => {
    const isFormData = payload instanceof FormData

    if (isFormData && !payload.has('_method')) {
      payload.append('_method', 'PUT')
    }

    await request(`/groups/${id}`, {
      method: 'POST',
      body: payload,
    })
  }

  const remove = async (id: number) => {
    await request(`/groups/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    groups,
    group,
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
