<script setup lang="ts">
import type { SortingState } from '@tanstack/vue-table'

interface Column {
  header: string
  accessorKey: string
  id: string
  sortable?: boolean
}

const emit = defineEmits([
  'update:pagination', 
  'detail', 
  'delete', 
  'search',
  'sort',
  'retry'
])

const props = withDefaults(defineProps<{
  type: string
  data: any[]
  columns: Column[]
  showActions?: boolean
  loading: boolean
  error?: string | null
  total?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  showInputSearch?: boolean 
}>(), {
  showActions: true,
  showInputSearch: true,
  pagination: undefined,
  error: null
})

const route = useRoute()
const sorting = ref<SortingState>([])
const UButton = resolveComponent('UButton')
const searchQuery = ref('')

const columns = computed(() => {
  return props.columns.map(col => {
    if (!col.sortable) return col

    return {
      ...col,
      header: ({ column }: { column: any }) => {
        const isSorted = column.getIsSorted()

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: col.header,
          trailingIcon: isSorted
            ? isSorted === 'asc'
              ? 'i-heroicons-bars-arrow-up'
              : 'i-heroicons-bars-arrow-down'
            : 'i-heroicons-arrows-up-down',
          class: 'uppercase p-0',
          onClick: () =>
            column.toggleSorting(isSorted === 'asc')
        })
      }
    }
  }).concat(
    props.showActions
      ? [{ accessorKey: 'actions', header: 'Aksi', id: 'actions' }]
      : []
  )
})

const pagination = computed({
  get: () => props.pagination,
  set: (val) => emit('update:pagination', val)
})

watch(sorting, (val) => {
  emit('sort', val)
})

const getValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? '-'
}

</script>

<template>
  <div v-if="showInputSearch" class="w-full flex justify-end item-center gap-2 mb-4">
    <UInput 
      v-model="searchQuery"
      placeholder="Ketik untuk mencari..." 
      type="text"
      icon="i-heroicons-magnifying-glass"
      @keyup.enter="$emit('search', searchQuery)"
    >
      <template v-if="searchQuery?.length" #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-x"
          aria-label="Clear input"
          @click="() => {
            searchQuery = ''
            $emit('search', '')
          }"
        />
      </template>
    </UInput>
    
    <UButton
      color="primary"
      variant="subtle"
      size="md"
      icon="i-heroicons-magnifying-glass"
      class="cursor-pointer"
      @click="$emit('search', searchQuery)"
    />
  </div>

  <UTable
    v-model:sorting="sorting"
    ref="table"
    :data="data" 
    :columns="columns" 
    :show-actions="showActions" 
    :loading="loading" 
    loading-animation="carousel"
    @hover=""
    :ui="{
      thead: 'font-medium uppercase whitespace-nowrap bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-200'
    }"
  >
    <template #empty>
      <div v-if="error" class="flex flex-col items-center gap-4">
        <span class="text-error text-sm">
          {{ error }}
        </span>
        
        <UButton
          icon="i-heroicons-arrow-path"
          size="sm"
          color="neutral"
          variant="ghost"
          label="Coba Lagi"
          @click="$emit('retry')"
        />
      </div>

      <span v-else class="text-muted text-sm">Tidak ada data</span>
    </template>
    
    <template #loading>
      <span class="text-muted text-sm">Memuat data...</span>
    </template>

    <template
      v-for="col in columns.filter(c => c.id !== 'actions')"
      :key="col.id"
      #[`${col.id}-cell`]="slotProps"
    >
      <!-- Jika parent provide custom slot -->
      <slot
        v-if="$slots[`${col.id}-cell`]"
        :name="`${col.id}-cell`"
        v-bind="slotProps"
      />

      <!-- Default rendering -->
      <template v-else>
        <div>
          <p class="text-sm font-medium whitespace-nowrap">
            {{ getValue(slotProps.row.original, col.accessorKey) }}
          </p>
        </div>
      </template>
    </template>

    <template #actions-cell="slotProps">
      <div class="flex gap-2">
        <!-- Custom slot -->
        <slot
          name="actions-cell"
          v-bind="slotProps"
        />

        <!-- Default actions -->
        <UButton
          icon="i-heroicons-pencil-square"
          color="info"
          variant="soft"
          size="xs"
          label="Edit"
          :to="`${route.path}/${slotProps.row.original.id}`"
          class="cursor-pointer"
        />

        <DeleteButton
          :row="slotProps.row.original"
          :on-delete="async (r) => $emit('delete', r)"
          :type="type"
          :labelData="slotProps.row.original.id"
        />
      </div>
    </template>
  </UTable>

  <!-- Pagination -->
  <div v-if="pagination" class="flex justify-end border-t border-default pt-4 px-4 gap-2">
    <USelect
      :model-value="pagination.pageSize"
      :items="[10, 20, 50]"
      @update:model-value="(size: number) => {
        emit('update:pagination', {
          ...pagination,
          pageIndex: 0,
          pageSize: size
        })
      }"
    />
      
    <UPagination
      :page="pagination.pageIndex + 1"
      :items-per-page="pagination.pageSize"
      :total="total || 0"
      @update:page="(p) =>
        emit('update:pagination', {
          ...pagination,
          pageIndex: p - 1
        })
      "
    />
  </div>
</template>