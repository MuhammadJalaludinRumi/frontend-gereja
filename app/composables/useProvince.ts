interface Province {
  id: number
  name: string
}

export const useProvinces = () => {
  const provinces = ref<Province[]>([])
  const province = ref<Province | null>(null)

  const { request, loading, saving, error } = useApiFetch()

  const fetchAll = async (params?: { search?: string }) => {
    provinces.value = await request<Province[]>('/province', 
      { params }
    )
  }

  const fetchById = async (id: number) => {
    province.value = await request<Province>(`/province/${id}`)
  }

  const create = async (payload: any) => {
    await request('/province', {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: any) => {
    await request(`/province/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    await request(`/province/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    provinces,
    province,
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
