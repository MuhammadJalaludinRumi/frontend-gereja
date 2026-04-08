export interface User {
  id?: number
  username: string
  password?: string
  name: string
  is_active: boolean
  role_id: number
}

export const useUsers = () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const userOptions = ref<SelectOption[]>([])
  const meta = ref<PaginationMeta>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

  const { request, requestPaginated, loading, saving, error } = useApiFetch()

  // GET semua user
  const fetchAll = async (params?: {
    page?: number
    per_page?: number
    search?: string
  }) => {
    const response = await requestPaginated<User>('/users', { params })
    
    users.value = response.data
    meta.value = response.meta
  }

  const fetchById = async (id: number) => {
    currentUser.value = await request<User>(`/users/${id}`)
  }

  const create = async (payload: User) => {
    await request('/users', {
      method: 'POST',
      body: payload
    })
  }

  // PUT update user
  const update = async (id: number, payload: Partial<User>) => {
    await request(`/users/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // DELETE user
  const remove = async (id: number) => {
    await request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  const fetchUserSelect = async (search: string) => {
    userOptions.value = await request<SelectOption[]>('/users/select', { params: { search } })    
  }

  return { 
    users, 
    currentUser,
    userOptions,
    meta, 
    fetchAll,  
    fetchById,
    fetchUserSelect,
    create, 
    update, 
    remove,
    loading, 
    saving,
    error 
  }
}
