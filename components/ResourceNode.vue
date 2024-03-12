<script setup lang="ts">
import { UseClipboard } from '@vueuse/components'
import type { ResultOf } from 'gql.tada'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const selected = ref<ResultOf<typeof queries.nodes>['nodes']['edges']>([])
const expanded = ref<ResultOf<typeof queries.nodes>['nodes']['edges']>()

const {
  data,
  pending: isLoading,
  execute
} = useAsyncData(
  'nodes',
  async () =>
    (await apiStore.apiClient?.query(queries.nodes, {}))?.data?.nodes.edges,
  {
    default: () => []
  }
)

const isImportModalVisible = ref(false)
const isImporting = ref(false)

const isRemoving = ref(false)
const confirmRemove = useConfirm()

const onRemove = async () => {
  isRemoving.value = true

  await apiStore.apiClient?.mutation(mutations.removeNodes, {
    ids: selected.value.map((node) => node.id)
  })

  await execute()

  isRemoving.value = false
}
</script>

<template>
  <div>
    <DataTable
      v-model:selection="selected"
      v-model:expanded-rows="expanded"
      :value="data"
      :loading="isLoading"
      data-key="id"
      striped-rows
      selection-mode="multiple"
      meta-key-selection
      removable-sort
      scrollable
    >
      <template #header>
        <div class="flex items-center gap-2">
          <Button :loading="isImporting" @click="isImportModalVisible = true">
            <template #icon>
              <Icon name="heroicons:inbox-arrow-down" />
            </template>
          </Button>

          <Button
            :loading="isRemoving"
            :disabled="!selected.length"
            severity="danger"
            @click="
              () => {
                confirmRemove.require({
                  header: 'Remove nodes',
                  message: 'Are you sure you want to remove selected nodes?',
                  accept: onRemove
                })
              }
            "
          >
            <template #icon>
              <Icon name="heroicons:trash" />
            </template>
          </Button>
        </div>
      </template>

      <template #empty>No node can be found.</template>

      <Column field="link" header="link">
        <template #body="{ data: { link } }">
          <UseClipboard #="{ copy, copied }" :source="link">
            <Button rounded @click="copy()">
              <template #icon>
                <Icon
                  :name="copied ? 'heroicons:check' : 'heroicons:clipboard'"
                />
              </template>
            </Button>
          </UseClipboard>
        </template>
      </Column>

      <Column field="name" header="name" sortable />
      <Column field="protocol" header="protocol" sortable />
      <Column field="address" header="address" sortable />
      <Column field="tag" header="tag" sortable />
    </DataTable>

    <ImportNodeModal
      v-model:visible="isImportModalVisible"
      v-model:isImporting="isImporting"
      @submit="execute"
    />
  </div>
</template>
