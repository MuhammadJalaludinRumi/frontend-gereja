export interface OrganizationLicense {
  id: number
  organization_id: number
  license_id: number
  max_member: number
  is_active: boolean
  expiry: string
  created_at: string
  organization?: Organization
  license?: License
}

export const useOrganizationLicenses = () => {
  const orgLicenses = ref<OrganizationLicense[]>([])
  const orgLicense = ref<OrganizationLicense | null>(null)

  const { request, requestPaginated, loading, saving, error } = useApiFetch()

  const meta = ref<PaginationMeta>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

  // 🔹 Ambil semua organization licenses
  const fetchAll = async (params?:
    {
      page?: number
      per_page?: number
      search?: string
    }
  ) => {
    const response = await requestPaginated<OrganizationLicense>('/organization-licenses', { params })

    orgLicenses.value = response.data
    meta.value = response.meta
  }

  // 🔹 Ambil per ID
  const fetchById = async (id: number) => {
    orgLicense.value = await request<OrganizationLicense>(`/organization-licenses/${id}`)
  }

  // 🔹 Create
  const create = async (payload: any) => {
    await request('/organization-licenses', {
      method: 'POST',
      body: payload,
    })
  }

  // 🔹 Update
  const update = async (id: number, payload: any) => {
    await request(`/organization-licenses/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  // 🔹 Delete
  const remove = async (id: number) => {
    await request(`/organization-licenses/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    orgLicenses,
    orgLicense,
    meta,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    loading,
    saving,
    error,
  }
}
