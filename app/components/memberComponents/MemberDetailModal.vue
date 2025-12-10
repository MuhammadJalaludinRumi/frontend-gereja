<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="props.open" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="close">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <UCard class="p-4"
            style="background: var(--ui-bg); color: var(--ui-text); border: 1px solid var(--ui-border);">
            <!-- HEADER -->
            <template #header>
              <div class="flex items-start justify-between">
                <div class="flex flex-col items-center flex-1 py-2">
                  <!-- Nomor Induk -->
                  <p class="text-base text-gray-500 mb-2">{{ member?.id_local || '-' }}</p>

                  <!-- Nama Besar dan Tebal -->
                  <h2 class="text-3xl font-bold mb-3 text-center">{{ member?.name }}</h2>

                  <!-- Foto -->
                  <div v-if="member?.photo" class="mb-2">
                    <img :src="member.photo" class="h-32 w-32 rounded-full object-cover border-4 border-gray-200 shadow-lg" />
                  </div>
                  <div v-else class="h-32 w-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-2 shadow-lg">
                    {{ member?.name?.charAt(0).toUpperCase() }}
                  </div>
                </div>

                <UButton icon="i-heroicons-x-mark" variant="ghost" @click="close" class="ml-2" />
              </div>
            </template>

            <!-- DETAIL LENGKAP -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">

              <!-- IDENTITAS DASAR -->
              <div>
                <p class="font-semibold">Nomor Induk:</p>
                <p>{{ member?.id_local || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Nama:</p>
                <p>{{ member?.name || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Jenis ID:</p>
                <p>{{ member?.id_type || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Nomor ID:</p>
                <p>{{ member?.id_number || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Tanggal Lahir:</p>
                <p>{{ formatDate(member?.dob) }}</p>
              </div>

              <div>
                <p class="font-semibold">Tempat Lahir:</p>
                <p>{{ member?.pob || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Warga Negara:</p>
                <p>{{ member?.nationality || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Suku:</p>
                <p>{{ member?.ethnic || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Jenis Kelamin:</p>
                <p>{{ member?.sex || '-' }}</p>
              </div>

              <!-- KONTAK -->
              <div>
                <p class="font-semibold">Telepon:</p>
                <p>{{ member?.phone || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Email:</p>
                <p>{{ member?.email || '-' }}</p>
              </div>

              <!-- ALAMAT -->
              <div class="col-span-1 sm:col-span-2">
                <p class="font-semibold">Alamat:</p>
                <p>{{ member?.address || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Kota:</p>
                <p>{{ typeof member?.city === 'object' ? member.city?.name : member?.city || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Latitude:</p>
                <p>{{ member?.latitude || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Longitude:</p>
                <p>{{ member?.longitude || '-' }}</p>
              </div>

              <!-- KELUARGA -->
              <div>
                <p class="font-semibold">Nomor KK:</p>
                <p>{{ member?.family_id || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Hubungan Keluarga:</p>
                <p>{{ member?.family_relation || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Status Perkawinan:</p>
                <p>{{ member?.marriage || '-' }}</p>
              </div>

              <!-- STATUS -->
              <div>
                <p class="font-semibold">Meninggal:</p>
                <p :class="member?.is_deceased ? 'text-red-500' : 'text-green-500'">
                  {{ member?.is_deceased ? 'Ya' : 'Tidak' }}
                </p>
              </div>

              <div>
                <p class="font-semibold">Aktif:</p>
                <p :class="member?.is_active ? 'text-green-500' : 'text-gray-400'">
                  {{ member?.is_active ? 'Ya' : 'Tidak' }}
                </p>
              </div>

              <!-- AGAMA -->
              <div>
                <p class="font-semibold">Agama:</p>
                <p>{{ member?.religion || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Golongan Darah:</p>
                <p>{{ member?.blood || '-' }}</p>
              </div>

              <!-- BAPTIS -->
              <div>
                <p class="font-semibold">Tanggal Baptis:</p>
                <p>{{ formatDate(member?.baptist_date) }}</p>
              </div>

              <div>
                <p class="font-semibold">Tempat Baptis:</p>
                <p>{{ member?.baptist_place || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Pendeta Baptis:</p>
                <p>{{ member?.baptist_host_name || '-' }}</p>
              </div>

              <!-- SIDI -->
              <div>
                <p class="font-semibold">Tanggal Sidi:</p>
                <p>{{ formatDate(member?.consecrate_date) }}</p>
              </div>

              <div>
                <p class="font-semibold">Tempat Sidi:</p>
                <p>{{ member?.consecrate_place || '-' }}</p>
              </div>

              <div>
                <p class="font-semibold">Pendeta Sidi:</p>
                <p>{{ member?.consecrate_host_name || '-' }}</p>
              </div>

              <!-- ATTEST -->
              <div>
                <p class="font-semibold">Tgl Jadi Jemaat:</p>
                <p>{{ formatDate(member?.attest_date) }}</p>
              </div>

              <div>
                <p class="font-semibold">Gereja Asal:</p>
                <p>{{ member?.attest_origin || '-' }}</p>
              </div>

              <!-- FOTO -->
              <div class="col-span-1 sm:col-span-2">
                <p class="font-semibold mb-1">Foto:</p>
                <img v-if="member?.photo" :src="member.photo" class="h-28 w-28 rounded object-cover border mt-1" />
              </div>

            </div>
            <!-- ANGGOTA KELUARGA -->
            <div v-if="familyMembers.length > 0" class="mt-6 border-t pt-4">
              <h3 class="text-lg font-bold mb-3">
                Anggota Dengan Nomor KK Sama
              </h3>

              <div class="space-y-2">
                <div v-for="fm in familyMembers" :key="fm.id" @click="switchTo(fm)"
                  class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                  <img v-if="fm.photo" :src="fm.photo" class="h-14 w-14 rounded-full object-cover border" />

                  <div v-else
                    class="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
                    {{ fm.name.charAt(0).toUpperCase() }}
                  </div>

                  <div class="flex-1">
                    <p class="font-semibold text-base truncate">{{ fm.name }}</p>
                    <p class="text-sm text-gray-500 truncate">Status keluarga: {{ member?.family_relation || '-' }}</p>
                  </div>

                  <UButton label="Lihat" size="xs" color="blue" trailing icon="i-heroicons-arrow-right" />
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <template #footer>
              <div class="flex justify-end">
                <UButton label="Tutup" color="gray" @click="close" />
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  open: Boolean,
  member: Object,
  allMembers: Array
})

const emits = defineEmits(['update:open', 'switch-member'])

const close = () => emits('update:open', false)

const formatDate = (d: any) => (d ? d.split(' ')[0] : '-')

const familyMembers = computed(() => {
  if (!props.member?.family_id) return []
  return props.allMembers.filter((m: any) =>
    m.family_id === props.member.family_id && m.id !== props.member.id
  )
})

// pindah modal ke member baru
const switchTo = (m: any) => {
  emits('switch-member', m)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.15s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
