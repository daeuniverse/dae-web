<script setup lang="ts">
import * as queries from '~/queries'

const apiStore = useAPIStore()

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
  <UTable :rows="subscriptions" />
</template>
