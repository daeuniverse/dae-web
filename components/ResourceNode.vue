<script setup lang="ts">
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isNodeModalOpen = ref(false)

const { data: nodes } = useAsyncData(async () =>
  (await apiStore.apiClient?.query(queries.nodes, {}))?.data?.nodes.edges.map(
    (node) => ({
      id: node.id,
      link: node.link
    })
  )
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <UButton icon="i-heroicons-plus" @click="isNodeModalOpen = true" />
    </div>

    <UTable :rows="nodes" />

    <UModal v-model="isNodeModalOpen">
      <UCard>
        <template #header>Import Nodes</template>
      </UCard>
    </UModal>
  </div>
</template>
