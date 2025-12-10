// composables/useKkLinks.ts
import { ref } from 'vue'
import { useApiUrl } from './useApiUrl'
import { useCookie, useRuntimeConfig } from '#app'

export const useKkLinks = () => {
  const apiBase = useApiUrl()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Auth & cookie handling
  const config = useRuntimeConfig()
  const isProd = config.public.sessionSecureCookie === 'true'
  const xsrfToken = useCookie('XSRF-TOKEN').value
  const token = useCookie('token').value

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }
    if (!isFormData) headers['Content-Type'] = 'application/json'
    if (isProd && xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken
    }
    if (!isProd && token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  // ======================================
  // 1. CONNECT KK
  // ======================================
  const connectKK = async (nokk_main: string, nokk_related: string) => {
    loading.value = true
    error.value = null

    // Validasi input
    if (!nokk_main || !nokk_related) {
      error.value = 'Nomor KK tidak boleh kosong'
      loading.value = false
      return null
    }

    console.log('Connecting KK:', { nokk_main, nokk_related })

    try {
      const res = await $fetch('/kk-links', {
        baseURL: apiBase,
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: {
          nokk_main: nokk_main.trim(),
          nokk_related: nokk_related.trim()
        }
      })

      console.log('Connect KK Response:', res)
      return res
    } catch (err: any) {
      console.error('Connect KK Error:', err)
      error.value = err?.data?.message || 'Gagal menyambungkan KK'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ======================================
  // 2. DELETE KK LINK
  // ======================================
  const deleteKKLink = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch(`/kk-links/${id}`, {
        baseURL: apiBase,
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      return res
    } catch (err: any) {
      console.error('Delete KK Link Error:', err)
      error.value = err?.data?.message || 'Gagal menghapus link'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ======================================
  // 3. GET CONNECTED KK
  // ======================================
  const getConnectedKKs = async (nokk: string) => {
    if (!nokk) {
      console.warn('getConnectedKKs: No KK provided')
      return []
    }

    try {
      console.log('🔍 Getting connected KKs for:', nokk)

      const res = await $fetch(`/connected/${nokk}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      console.log('📥 RAW API Response:', JSON.stringify(res, null, 2))
      console.log('📊 Response Type:', typeof res)
      console.log('🔑 Response Keys:', Object.keys(res || {}))

      // Backend mengembalikan { connected_kk: ["nokk1", "nokk2"] }
      const connectedList = res?.connected_kk || []

      console.log('📋 Extracted Connected KK List:', connectedList)
      console.log('📏 List Length:', connectedList.length)
      console.log('🔢 List Type:', typeof connectedList)
      console.log('✅ Is Array:', Array.isArray(connectedList))

      // Pastikan setiap item adalah string dan tampilkan detail
      if (Array.isArray(connectedList)) {
        console.log('🔍 DETAIL SETIAP ITEM:')
        connectedList.forEach((kk, index) => {
          console.log(`  [${index}] Value: "${kk}"`)
          console.log(`  [${index}] Type: ${typeof kk}`)
          console.log(`  [${index}] Length: ${String(kk).length}`)
          console.log(`  [${index}] As String: "${String(kk)}"`)
          console.log('  ---')
        })
      }

      return connectedList
    } catch (err: any) {
      console.error('❌ Get Connected KKs Error:', err)
      console.error('Error Details:', {
        message: err?.message,
        data: err?.data,
        status: err?.status
      })
      error.value = err?.data?.message || 'Gagal memuat KK terkait'
      return []
    }
  }

  // ======================================
  // 4. GET ALL FAMILY MEMBERS
  // ======================================
  const getFamilyMembers = async (nokk: string) => {
    if (!nokk) {
      console.warn('getFamilyMembers: No KK provided')
      return { members: [] }
    }

    try {
      console.log('📞 Getting family members for KK:', nokk)

      const res = await $fetch(`/family/${nokk}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: 'include'
      })

      console.log('📥 Family Members RAW API Response for', nokk, ':', JSON.stringify(res, null, 2))

      // Periksa dan konversi tipe data
      if (res?.members && Array.isArray(res.members)) {
        console.log('🔍 Processing members - converting numeric fields to string:')

        res.members = res.members.map((member: any, index: number) => {
          const processed = {
            ...member,
            id_local: String(member.id_local || ''),
            family_id: String(member.family_id || '')
          }

          console.log(`  [${index}] ${member.name}:`)
          console.log(`    - id_local: "${member.id_local}" (${typeof member.id_local}) -> "${processed.id_local}" (${typeof processed.id_local})`)
          console.log(`    - family_id: "${member.family_id}" (${typeof member.family_id}) -> "${processed.family_id}" (${typeof processed.family_id})`)

          return processed
        })
      }

      console.log('✅ Family Members processed:', res)

      return res || { members: [] }
    } catch (err: any) {
      console.error('❌ Get Family Members Error for', nokk, ':', err)
      error.value = err?.data?.message || 'Gagal memuat keluarga'
      return { members: [] }
    }
  }

  return {
    loading,
    error,
    connectKK,
    deleteKKLink,
    getConnectedKKs,
    getFamilyMembers
  }
}
