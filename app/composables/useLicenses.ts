export interface License {
  id: number
  name: string
  price: number
  created_at: string
}

export const useLicenses = () => {
  const licenses = ref<License[]>([])
  const license = ref<License | null>(null)

  const { request, loading, saving, error } = useApiFetch()

  // 🔹 Ambil semua licenses
  const fetchAll = async (params?: {search?: string}) => {
    licenses.value = await request<License[]>('/licenses', { params })
  }

  // 🔹 Ambil license by ID
  const fetchById = async (id: number) => {
    license.value = await request<License>(`/licenses/${id}`)
  }

  // 🔹 Create license
  const create = async (payload: LicenseForm) => {
    await request('/licenses', {
      method: 'POST',
      body: payload,
    })
  }

  // 🔹 Update license
  const update = async (id: number, payload: LicenseForm) => {
    await request(`/licenses/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  // 🔹 Hapus license
  const remove = async (id: number) => {
    await request(`/licenses/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    licenses,
    license,
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
