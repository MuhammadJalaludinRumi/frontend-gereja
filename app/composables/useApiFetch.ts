export const useApiFetch = () => {
  const { apiBase, getHeaders } = useApi()
  const {
    loading,
    saving,
    error,
    startLoading,
    stopLoading,
    startSaving,
    stopSaving,
    setError
  } = useAsyncState()

  const request = async <T>(
    url: string,
    options: any = {}
  ): Promise<T> => {
    const method = (options.method || 'GET').toUpperCase()

    const isLoading = method === 'GET'

    try {
      if (isLoading) startLoading()
      else startSaving()

      const res: any = await $fetch<T>(url, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include',
        ...options
      })

      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      if (isLoading) stopLoading()
      else stopSaving()
    }
  }

  const requestPaginated = async <T>(
    url: string,
    options: any = {}
  ): Promise<{
    data: T[]
    meta: PaginationMeta
  }> => {
    return await request(url, {
      ...options,
      transform: (res: PaginatedResponse<T>) => ({
        data: res.data,
        meta: {
          total: res.total,
          per_page: res.per_page,
          current_page: res.current_page,
          last_page: res.last_page
        }
      })
    })
  }

  return {
    request,
    requestPaginated,
    loading,
    saving,
    error
  }
}