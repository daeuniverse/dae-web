<script setup lang="ts">
import * as queries from '~/queries'

const apiStore = useAPIStore()

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
  <UTable :rows="nodes" />
</template>
