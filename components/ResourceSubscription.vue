<script setup lang="ts">
import { UseClipboard } from '@vueuse/components'
import dayjs from 'dayjs'
import type { ResultOf } from 'gql.tada'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const selected = ref<ResultOf<typeof queries.subscriptions>['subscriptions']>(
  []
)
const expanded = ref<ResultOf<typeof queries.subscriptions>['subscriptions']>()

const {
  data,
  pending: isLoading,
  execute
} = useAsyncData(
  'subscriptions',
  async () =>
    (await apiStore.apiClient?.query(queries.subscriptions, {}))?.data
      ?.subscriptions,
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

  await apiStore.apiClient?.mutation(mutations.removeSubscriptions, {
    ids: selected.value.map((subscription) => subscription.id)
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
                  header: 'Remove subscription',
                  message:
                    'Are you sure you want to remove selected subscriptions?',
                  accept: onRemove,
                  rejectLabel: 'Cancel',
                  acceptLabel: 'Confirm'
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

      <template #empty>No subscription can be found.</template>

      <Column expander />

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

      <Column field="tag" header="tag" sortable />

      <Column field="nodes" header="nodes" sortable>
        <template #body="{ data: { nodes } }">
          {{ nodes.edges.length }}
        </template>
      </Column>

      <Column field="status" header="status" sortable />
      <Column field="info" header="info" sortable />

      <Column field="updatedAt" header="updatedAt" sortable>
        <template #body="{ data: { updatedAt } }">
          {{ dayjs(updatedAt).format('YYYY-MM-DD HH:mm') }}
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-2">
          <DataTable
            :value="slotProps.data.nodes.edges"
            data-key="id"
            size="small"
            removable-sort
            scrollable
          >
            <Column field="link" header="link" body-class="break-all">
              <template #body="{ data: { link } }">
                <UseClipboard #="{ copy, copied }" :source="link">
                  <Button rounded @click="copy()">
                    <template #icon>
                      <Icon
                        :name="
                          copied ? 'heroicons:check' : 'heroicons:clipboard'
                        "
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
        </div>
      </template>
    </DataTable>

    <ImportSubscriptionModal
      v-model:visible="isImportModalVisible"
      v-model:isImporting="isImporting"
      @submit="execute"
    />
  </div>
</template>
