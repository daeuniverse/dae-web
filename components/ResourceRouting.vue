<script setup lang="ts">
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isRoutingFormModalOpen = ref(false)
const routingFormModalContent = ref('')

const { data: defaults } = useAsyncData('defaults', () =>
  apiStore.getDefaults()
)

const { data: routings, execute: reloadRoutings } = useAsyncData(
  'routings',
  async () => {
    const data = await apiStore.apiClient?.query(queries.routings, {})

    return data?.data?.routings
  }
)

const isRemovingRouting = ref(false)

const removeRouting = async (id: string) => {
  isRemovingRouting.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.removeRouting, { id })

    await reloadRoutings()
  } finally {
    isRemovingRouting.value = false
  }
}

const isSelectingRouting = ref(false)

const selectRouting = async (id: string) => {
  isSelectingRouting.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.selectRouting, { id })

    await reloadRoutings()
  } finally {
    isSelectingRouting.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons:plus"
        @click="
          () => {
            routingFormModalContent = ''
            isRoutingFormModalOpen = true
          }
        "
      />
    </div>

    <UCard v-for="routing in routings" :key="routing.id">
      <template #header>
        {{ routing.name }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            size="xs"
            icon="i-heroicons:pencil"
            @click="
              () => {
                routingFormModalContent = routing.routing.string
                isRoutingFormModalOpen = true
              }
            "
          />

          <UButton
            :loading="isRemovingRouting"
            :disabled="
              routing.id === defaults?.defaultRoutingID || routing.selected
            "
            size="xs"
            icon="i-heroicons:minus"
            @click="removeRouting(routing.id)"
          />

          <UButton
            :loading="isSelectingRouting"
            :disabled="routing.selected"
            size="xs"
            icon="i-heroicons:map-pin"
            @click="selectRouting(routing.id)"
          />
        </div>
      </template>
    </UCard>

    <RoutingFormModal
      v-model="isRoutingFormModalOpen"
      v-model:content="routingFormModalContent"
    />
  </div>
</template>
