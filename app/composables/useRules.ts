export interface Rule {
  id: number
  role_id: number
  acl_id: number
  permission: boolean
  role: Role
  acl: Acl
  created_at: string
}

export const useRules = () => {
  const rules = ref<Rule[]>([])
  const rule = ref<Rule | null>(null)

  const { request, loading, saving, error } = useApiFetch()

  const fetchAll = async (params?: { search?: string }) => {
    rules.value = await request<Rule[]>('/rules', { params })
  }

  const fetchById = async (id: number) => {
    rule.value = await request<Rule>(`/rules/${id}`)
  }

  const create = async (payload: RuleForm) => {
    await request('/rules', {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: RuleForm) => {
    await request(`/rules/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    await request(`/rules/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    rules,
    rule,

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
