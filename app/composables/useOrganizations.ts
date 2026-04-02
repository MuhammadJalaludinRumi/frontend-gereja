export interface Organization {
  id: number
  name: string
  abbreviation: string
  address: string
  city: City
  latitude: number
  longitude: number
  phone: string
  email: string
  group_id: string | number
  website: string
  logo: string
  founded: string
  legal: string
}

export const useOrganizations = () => {

  const organizations = ref<Organization[]>([])
  const organization = ref<Organization | null>(null)

  const { request, loading, saving, error } = useApiFetch()

  const fetchAll = async (params?: {
    search?: string
  }) => {
    organizations.value = await request<Organization[]>('/organizations', { params })
  }

  const fetchById = async (id: number | string) => {
    organization.value = await request<Organization>(`/organizations/${id}`)
  }

  const create = async (payload: FormData) => {
    await request('/organizations', {
      method: 'POST',
      body: payload,
    })
  }

  const update = async (
    id: number | string,
    payload: FormData
  ) => {
    const isFormData = payload instanceof FormData

    if (isFormData && !payload.has('_method')) {
      payload.append('_method', 'PUT')
    }

    await request(`/organizations/${id}`, {
      method: isFormData ? 'POST' : 'PUT',
      body: payload,
    })
  }

  const remove = async (id: number | string) => {
    await request(`/organizations/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    organizations,
    organization,
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