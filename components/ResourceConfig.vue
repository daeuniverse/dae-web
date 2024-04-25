<script setup lang="tsx">
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isCreateConfigModalOpen = ref(false)

const { data: configs, execute: reloadConfigs } = useAsyncData(
  'configs',
  async () => {
    const data = await apiStore.apiClient?.query(queries.configs, {})

    return data?.data?.configs
  }
)
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-end">
      <Button @click="isCreateConfigModalOpen = true">
        <template #icon>
          <Icon name="i-heroicons:plus" />
        </template>
      </Button>
    </div>

    <ResourceConfigCard
      v-for="config in configs"
      :key="config.id"
      :config="config"
      @reload-configs="reloadConfigs"
    />
  </div>
</template>
