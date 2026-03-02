<script setup lang="ts">
import FamilyMemberDetail from './FamilyMemberDetail.vue';

const props = defineProps<{
  modelValue: boolean
  data: Member
}>()

const { familyMembers, fetchByKK } = useMembers() 
const emit = defineEmits(['update:modelValue'])
const selectedFamilyMember = ref<Member | null>(null)
const loadingFamilyMembers = ref(false)
const familyMemberModalOpen = ref(false)

const localOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

watch(() => props.data?.id, async (newId) => {
  if (newId) {
    try {
      loadingFamilyMembers.value = true
      await fetchByKK(props.data.family_id)
    } catch (err) {
      console.error("Error fetching family members:", err)
    } finally {
      loadingFamilyMembers.value = false
    }
  }
})

const familyMemberOnly = computed(() => 
  familyMembers.value?.filter(member => member.id !== props.data.id) 
  ?? [])

const openDetail = (member: Member) => {
  selectedFamilyMember.value = member
  familyMemberModalOpen.value = true
}

</script>

<template>
  <UModal
    v-model:open="localOpen"
    :dismissible="true"
    :modal="true"
    :close="true"
    :transition="true"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <section class="flex flex-col w-full gap-2">      
        <section class="flex flex-col items-center mb-5">
          <p class="text-muted text-sm">{{ data.id_local }}</p>
          <h1 class="text-2xl font-bold capitalize">{{ data.name }}</h1>
          <UAvatar :src="data.photo" size="3xl" class="my-4 h-32 w-32" />
        </section>

        <section class="flex flex-col w-full gap-4">
          <h2 class="text-lg font-semibold">Detail Anggota</h2>

          <div class="w-full grid grid-cols-3 gap-2">
            <div>
              <p class="text-muted text-sm">Nomor Induk</p>
              <h1 class="text-md font-medium">{{ data.id_local ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Jenis ID</p>
              <h1 class="text-md font-medium">{{ data.id_type ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Nomor ID</p>
              <h1 class="text-md font-medium">{{ data.id_number ?? '-' }}</h1>
            </div>
          </div>
          
          <div class="w-full grid grid-cols-3 gap-2">
            <div>
              <p class="text-muted text-sm">Nama Lengkap</p>
              <h1 class="text-md font-medium capitalize">{{ data.name }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Tempat Lahir</p>
              <h1 class="text-md font-medium capitalize">{{ data.pob ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Tanggal Lahir</p>
              <h1 class="text-md font-medium">{{ $formatDate(data.dob) ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Jenis Kelamin</p>
              <h1 class="text-md font-medium capitalize">{{ data.sex ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Agama</p>
              <h1 class="text-md font-medium capitalize">{{ data.religion ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Golongan Darah</p>
              <h1 class="text-md font-medium capitalize">{{ data.blood ?? '-' }}</h1>
            </div>
          </div>
          
          <div class="w-full grid grid-cols-3 gap-2">
            <div>
              <p class="text-muted text-sm">Warga Negara</p>
              <h1 class="text-md font-medium capitalize">{{ data.nationality ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Suku</p>
              <h1 class="text-md font-medium capitalize">{{ data.ethnic ?? '-' }}</h1>
            </div>

            <div>
              <p class="text-muted text-sm">Alamat</p>
              <h1 class="text-md font-medium">{{ data.address ?? '-' }}</h1>
            </div>
            <div>
              <p class="text-muted text-sm">Kota</p>
            <h1 class="text-md font-medium">{{ typeof data.city === 'object' ? data.city?.name ?? '-' : '-' }}</h1>
          </div>
          <!-- <div>
            <p class="text-muted text-sm">Lat</p>
            <h1 class="text-md font-medium">{{ data.latitude ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Long</p>
            <h1 class="text-md font-medium">{{ data.longitude ?? '-' }}</h1>
          </div> -->
        </div>
        
        <div class="w-full grid grid-cols-3 gap-2">
          <div>
            <p class="text-muted text-sm">No. KK</p>
            <h1 class="text-md font-medium">{{ data.family_id ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Hubungan Keluarga</p>
            <h1 class="text-md font-medium">{{ data.family_relation ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Status Perkawinan</p>
            <h1 class="text-md font-medium">{{ data.marriage ?? '-' }}</h1>
          </div>
        </div>
        
        <div class="w-full grid grid-cols-3 gap-2">
          <div>
            <p class="text-muted text-sm">Tanggal Baptis</p>
            <h1 class="text-md font-medium">{{ $formatDate(data.baptist_date) }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Tempat Baptis</p>
            <h1 class="text-md font-medium">{{ data.baptist_place ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Pendeta Baptis</p>
            <h1 class="text-md font-medium">{{ data.baptist_host_name ?? '-' }}</h1>
          </div>
        </div>
        
        <div class="w-full grid grid-cols-3 gap-2">
          <div>
            <p class="text-muted text-sm">Tanggal Sidi</p>
            <h1 class="text-md font-medium">{{ $formatDate(data.consecrate_date) ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Tempat Sidi</p>
            <h1 class="text-md font-medium">{{ data.consecrate_place ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Pendeta Sidi</p>
            <h1 class="text-md font-medium">{{ data.consecrate_host_name ?? '-' }}</h1>
          </div>
        </div>
        
        <div class="w-full grid grid-cols-3 gap-2">
          <div>
            <p class="text-muted text-sm">Tanggal Menjadi Jemaat</p>
            <h1 class="text-md font-medium">{{ $formatDate(data.attest_date) ?? '-' }}</h1>
          </div>
          <div>
            <p class="text-muted text-sm">Gereja Asal</p>
            <h1 class="text-md font-medium">{{ data.attest_origin ?? '-' }}</h1>
          </div>
        </div>
        
        <div class="w-full grid grid-cols-3 gap-2">
          <div>
            <p class="text-muted text-sm">Meninggal</p>
            <h1 
              class="text-md font-medium"
              :class="data.is_deceased ? 'text-error' : 'text-primary'"
            >
              {{ data.is_deceased ? 'Ya' : 'Tidak' }}
            </h1>
          </div>
          <div>
            <p class="text-muted text-sm">Aktif</p>
            <h1 
              class="text-md font-medium"
              :class="data.is_active ? 'text-primary' : 'text-neutral'"
            >
              {{ data.is_active ? 'Ya' : 'Tidak' }}
            </h1>
          </div>
        </div>
        </section>

        <section class="mt-5">
          <h2 class="text-lg font-semibold mb-3">Anggota Keluarga</h2>
          <Loader v-if="loadingFamilyMembers" label="anggota keluarga"/>
          <div v-else>
            <div v-if="familyMemberOnly.length > 0" class="flex flex-col gap-2">
              <UCard v-for="member in familyMemberOnly" variant="outline" :key="member.id">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-4">
                    <UAvatar :src="member.photo" size="lg" class="h-12 w-12" />
                    <div>
                      <h3 class="text-lg font-medium capitalize">{{ member.name }}</h3>
                      <p class="text-sm text-muted">{{ member.family_relation }}</p>
                    </div>
                  </div>
                  <UButton 
                    color="neutral" 
                    variant="ghost" 
                    label="Lihat" 
                    icon="i-heroicons-information-circle"
                    @click="openDetail(member)"
                  />
                </div>
              </UCard>
            </div>
            <div v-else class="text-muted text-sm">Tidak ada anggota keluarga</div>
          </div>
        </section>
      </section>
      
      <FamilyMemberDetail
        v-model="familyMemberModalOpen"
        :data="selectedFamilyMember!"
        :related="data"
      />
    </template>
  </UModal>
</template>