<script setup lang="ts">
import type { ConfigFormModal } from '#components'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()
const { data: defaults } = useAsyncData(() => apiStore.getDefaults())

const isCreateConfigModalOpen = ref(false)
const createConfigFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()
const isUpdateConfigFormModalOpen = ref(false)
const updateConfigFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()

const { data: configs, execute: reloadConfigs } = useAsyncData(
  'configs',
  async () => {
    const data = await apiStore.apiClient?.query(queries.configs, {})

    return data?.data?.configs
  }
)

const isRemovingConfig = ref(false)

const removeConfig = async (id: string) => {
  isRemovingConfig.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.removeConfig, { id })

    await reloadConfigs()
  } finally {
    isRemovingConfig.value = false
  }
}

const isSelectingConfig = ref(false)

const selectConfig = async (id: string) => {
  isSelectingConfig.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.selectConfig, { id })

    await reloadConfigs()
  } finally {
    isSelectingConfig.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons:plus"
        @click="isCreateConfigModalOpen = true"
      />
    </div>

    <UCard v-for="config in configs" :key="config.id">
      <template #header>
        {{ config.name }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            size="xs"
            icon="i-heroicons:pencil"
            @click="
              () => {
                const {
                  checkInterval,
                  sniffingTimeout,
                  checkTolerance,
                  ...global
                } = config.global

                updateConfigFormModalRef?.setValues({
                  name: config.name,

                  checkIntervalSeconds: deriveTime(
                    checkInterval as string,
                    's'
                  ),

                  sniffingTimeoutMS: deriveTime(
                    sniffingTimeout as string,
                    'ms'
                  ),

                  checkToleranceMS: deriveTime(checkTolerance as string, 'ms'),

                  ...global
                })

                isUpdateConfigFormModalOpen = true
              }
            "
          />

          <UButton
            :loading="isRemovingConfig"
            :disabled="
              config.id === defaults?.defaultConfigID || config.selected
            "
            size="xs"
            icon="i-heroicons:minus"
            @click="removeConfig(config.id)"
          />

          <UButton
            :loading="isSelectingConfig"
            :disabled="config.selected"
            size="xs"
            icon="i-heroicons:map-pin"
            @click="selectConfig(config.id)"
          />
        </div>
      </template>
    </UCard>

    <ConfigFormModal
      ref="createConfigFormModalRef"
      v-model="isCreateConfigModalOpen"
      @submit="
        async () => {
          await reloadConfigs()

          isCreateConfigModalOpen = false
        }
      "
    />

    <ConfigFormModal
      ref="updateConfigFormModalRef"
      v-model="isUpdateConfigFormModalOpen"
      @submit="
        async () => {
          await reloadConfigs()

          isUpdateConfigFormModalOpen = false
        }
      "
    />
  </div>
</template>
