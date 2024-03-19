<script setup lang="ts">
import type { ConfigFormModal } from '#components'

const apiStore = useAPIStore()
const defaults = await apiStore.getDefaults()

const isCreateConfigModalOpen = ref(false)
const createConfigFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()
const isUpdateConfigFormModalOpen = ref(false)
const updateConfigFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()

const { state: configs, execute: refetchConfigs } = useAsyncState(async () => {
  const data = await apiStore.apiClient?.query(
    graphql(`
      query Configs {
        configs {
          id
          name
          selected
          global {
            logLevel
            tproxyPort
            allowInsecure
            checkInterval
            checkTolerance
            lanInterface
            wanInterface
            udpCheckDns
            tcpCheckUrl
            dialMode
            tcpCheckHttpMethod
            disableWaitingNetwork
            autoConfigKernelParameter
            sniffingTimeout
            tlsImplementation
            utlsImitate
            tproxyPortProtect
          }
        }
      }
    `),
    {}
  )

  return data?.data?.configs
}, [])

const isRemovingConfig = ref(false)

const removeConfig = async (id: string | number) => {
  isRemovingConfig.value = true

  try {
    await apiStore.apiClient?.mutation(
      graphql(`
        mutation RemoveConfig($id: ID!) {
          removeConfig(id: $id)
        }
      `),
      { id }
    )

    await refetchConfigs()
  } finally {
    isRemovingConfig.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <UButton
      block
      icon="i-heroicons-plus"
      @click="isCreateConfigModalOpen = true"
    />

    <UCard v-for="config in configs" :key="config.id">
      <template #header>
        {{ config.name }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            size="xs"
            icon="i-heroicons-pencil"
            @click="
              () => {
                updateConfigFormModalRef?.setValues({
                  name: config.name,
                  checkIntervalSeconds: deriveTime(
                    config.global.checkInterval as string,
                    's'
                  ),
                  sniffingTimeoutMS: deriveTime(
                    config.global.sniffingTimeout as string,
                    'ms'
                  ),
                  checkToleranceMS: deriveTime(
                    config.global.checkTolerance as string,
                    'ms'
                  ),
                  ...config.global
                })

                isUpdateConfigFormModalOpen = true
              }
            "
          />

          <UButton
            :loading="isRemovingConfig"
            :disabled="config.id === defaults?.defaultConfigID"
            size="xs"
            icon="i-heroicons-minus"
            @click="removeConfig(config.id)"
          />
        </div>
      </template>
    </UCard>

    <ConfigFormModal
      ref="createConfigFormModalRef"
      v-model="isCreateConfigModalOpen"
      type="create"
      @submit="
        async () => {
          await refetchConfigs()

          isCreateConfigModalOpen = false
        }
      "
    />

    <ConfigFormModal
      ref="updateConfigFormModalRef"
      v-model="isUpdateConfigFormModalOpen"
      type="update"
      @submit="
        async () => {
          await refetchConfigs()

          isUpdateConfigFormModalOpen = false
        }
      "
    />
  </div>
</template>
