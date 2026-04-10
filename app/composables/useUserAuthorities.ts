export interface UserAuthority {
  id: number
  user_id: number
  role_id: number
  created_at: string
  user: User
  role: Role
}

export const useUserAuthorities = () => {
  const userAuthorities = ref<UserAuthority[]>([])
  const userAuthority = ref<UserAuthority | null>(null)

  const { request, requestPaginated, loading, saving, error } = useApiFetch()
  
  const meta = ref<PaginationMeta>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

  const fetchAll = async (params?: 
    { 
      page?: number
      per_page?: number
      search?: string 
    }
  ) => {
    const response = await requestPaginated<UserAuthority>('/user-authorities', { params })
    
    userAuthorities.value = response.data
    meta.value = response.meta
  }

  const fetchById = async (id: number) => {
    userAuthority.value = await request<UserAuthority>(`/user-authorities/${id}`)
  }


  const create = async (payload: { user_id: number; role_id: number }) => {
    await request('/user-authorities', {
      method: 'POST',
      body: payload,
    })
  }

  const update = async (id: number, payload: { user_id: number; role_id: number }) => {
    await request(`/user-authorities/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  const remove = async (id: number) => {
    await request(`/user-authorities/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    userAuthorities,
    userAuthority,
    meta,
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
