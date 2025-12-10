import { ref } from "vue";
import { useApiUrl } from "~/composables/useApiUrl";
import { useCookie, useRuntimeConfig } from "#app";

export const useFamilyRelations = () => {
  const apiBase = useApiUrl();

  const relations = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ======================
  // AUTH HEADERS
  // ======================
  const config = useRuntimeConfig();
  const isProd = config.public.sessionSecureCookie === "true";

  const xsrfToken = useCookie("XSRF-TOKEN").value;
  const token = useCookie("token").value;

  const getHeaders = (isFormData = false): Record<string, string> => {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Sanctum XSRF token (production mode)
    if (isProd && xsrfToken) {
      headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    // Bearer token (local mode)
    if (!isProd && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  // ======================
  // GET BY MEMBER
  // ======================
  const getByMember = async (memberId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch(`/family-relations/member/${memberId}`, {
        baseURL: apiBase,
        headers: getHeaders(),
        credentials: "include",
      });

      relations.value = (res || []).map((item: any) => ({
        id: item.id,
        relationType: item.relation_type,

        related_member_id: item.related_member_id,
        related_auxiliary_id: item.related_auxiliary_id,

        nik_manual: item.nik_manual,
        nama_manual: item.nama_manual,

        nik: item.display_nik,
        name: item.display_name,
      }));
    } catch (e: any) {
      error.value = e.message || "Error fetching relations";
    } finally {
      loading.value = false;
    }
  };

  // ======================
  // SAVE
  // ======================
  const saveRelations = async (memberId: number, relationsList: any[]) => {
    loading.value = true;
    error.value = null;

    try {
      const payload = {
        member_id: memberId,
        relations: relationsList.map((r) => ({
          relation_type: r.relationType,
          related_member_id: r.related_member_id || null,
          related_auxiliary_id: r.related_auxiliary_id || null,
          nik_manual: r.related_member_id || r.related_auxiliary_id ? null : (r.nik || null),
          nama_manual: r.related_member_id || r.related_auxiliary_id ? null : (r.name || null),
        })),
      };

      console.log('Payload yang dikirim:', payload); // Debug

      await $fetch('/family-relations/save', {
        baseURL: apiBase,
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
        body: payload,
      });
    } catch (e: any) {
      console.error('Save relations error:', e);
      error.value = e.message || "Error saving relations";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addRelation = () => {
    relations.value.push({
      id: null,
      relationType: "",
      related_member_id: null,
      related_auxiliary_id: null,
      nik_manual: "",
      nama_manual: "",
      nik: "",
      name: "",
    });
  };

  const removeRelation = (index: number) => {
    relations.value.splice(index, 1);
  };

  return {
    relations,
    loading,
    error,
    getByMember,
    saveRelations,
    addRelation,
    removeRelation,
  };
};
