export interface Acl {
  id: number
  name: string
  create_at: string
}

export const useAcls = () => {
  const acls = ref<Acl[]>([])
  const acl = ref<Acl | null>(null)

  const { request, loading, saving, error } = useApiFetch()

  const fetchAll = async (params?: { search?: string }) => {
    acls.value = await request<Acl[]>('/acls', { params })
  }

  const fetchById = async (id: number) => {
    acl.value = await request<Acl>(`/acls/${id}`)
  }

  const create = async (payload: { name: string }) => {
    await await request('/acls', {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: { name: string }) => {
    await request(`/acls/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    await request(`/acls/${id}`, {
      method: 'DELETE',
    })
  }

  return { 
    acls, 
    acl, 
    
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
