<script setup lang="ts">
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isSubscriptionModalOpen = ref(false)

const { data: subscriptions } = useAsyncData(async () =>
  (
    await apiStore.apiClient?.query(queries.subscriptions, {})
  )?.data?.subscriptions.map((subscription) => ({
    id: subscription.id,
    link: subscription.link
  }))
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-link"
        @click="isSubscriptionModalOpen = true"
      />
    </div>

    <UTable :rows="subscriptions" />

    <UModal v-model="isSubscriptionModalOpen">
      <UCard>
        <template #header>Import Subscriptions</template>
      </UCard>
    </UModal>
  </div>
</template>
