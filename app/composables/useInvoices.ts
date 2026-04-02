export interface Invoice {
  id?: number
  organization_id: number
  organization: Organization
  date: string
  current_expiry: string
  new_expiry: string
  total: number
}

export const useInvoices = () => {
  const invoices = ref<Invoice[]>([])
  const invoice = ref<Invoice | null>(null)

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
    const response = await requestPaginated<Invoice>('/invoices', { params })
    
    invoices.value = response.data
    meta.value = response.meta
  }

  const fetchById = async (id: number) => {
    invoice.value = await request<Invoice>(`/invoices/${id}`)
  }

  const create = async (payload: InvoiceForm) => {
    await request('/invoices', {
      method: 'POST',
      body: payload
    })
  }

  // 🔹 Update invoice
  const update = async (id: number, payload: Partial<InvoiceForm>) => {
    await request(`/invoices/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // 🔹 Delete invoice
  const remove = async (id: number) => {
    await request(`/invoices/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    invoices,
    invoice,
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
