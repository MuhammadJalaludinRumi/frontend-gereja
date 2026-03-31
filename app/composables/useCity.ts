export interface City {
  id: number
  name: string
  province: number
  province_name: string
}

export const useCities = () => {
  const cities = ref<City[]>([])
  const city = ref<City | null>(null)

  const { request, loading, error, saving } = useApiFetch()

  const fetchAll = async () => {
    cities.value = await request<City[]>('/city')
  }

  const fetchById = async (id: number) => {
    city.value = await request<City>(`/city/${id}`)
  }

  const create = async (payload: { name: string, province: string }) => {
    
  }

  const update = async (id: number, payload: any) => {
    
  }

  const remove = async (id: number) => {
    
  }

  return { 
    cities, 
    city, 
    fetchAll, 
    fetchById, 
    create, 
    update, 
    remove, 
    loading, 
    error 
  }
}
