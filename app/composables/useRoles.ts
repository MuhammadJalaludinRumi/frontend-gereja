export interface Role {
  id: number
  organization_id: number
  organization: Organization
  name: string
}

export const useRoles = () => {
  const roles = ref<Role[]>([])
  const role = ref<Role | null>(null)

  const { request, loading, saving, error } = useApiFetch()

  const fetchAll = async (params?: { search?: string }) => {
    roles.value = await request<Role[]>('/roles', { params })
  }

  const fetchById = async (id: number) => {
    role.value = await request<Role>(`/roles/${id}`)
  }

  const create = async (payload: RoleForm) => {
    await request('/roles', {
      method: 'POST',
      body: payload
    })    
  }

  const update = async (id: number, payload: RoleForm) => {
    await request(`/roles/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    await request(`/roles/${id}`, {
      method: 'DELETE',
    })   
  }

  return { 
    roles, 
    role, 
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
