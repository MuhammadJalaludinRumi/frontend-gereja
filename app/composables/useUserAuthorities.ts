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

  const { request, loading, saving, error } = useApiFetch()

  const fetchAll = async (params?: { search?: string }) => {
    userAuthorities.value = await request<UserAuthority[]>('/user-authorities', { params })
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
