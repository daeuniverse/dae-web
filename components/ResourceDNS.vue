<script setup lang="ts">
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()
const defaults = await apiStore.getDefaults()

const { data: dnss, execute: reloadDNSs } = useAsyncData(
  'routings',
  async () => {
    const data = await apiStore.apiClient?.query(queries.dnss, {})

    return data?.data?.dnss
  }
)

const isRemovingDNS = ref(false)

const removeDNS = async (id: string | number) => {
  isRemovingDNS.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.removeDNS, { id })

    await reloadDNSs()
  } finally {
    isRemovingDNS.value = false
  }
}

const isSelectingDNS = ref(false)

const selectDNS = async (id: string | number) => {
  isSelectingDNS.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.selectDNS, { id })

    await reloadDNSs()
  } finally {
    isSelectingDNS.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <UButton block icon="i-heroicons-plus" />

    <UCard v-for="dns in dnss" :key="dns.id">
      <template #header>
        {{ dns.name }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            :loading="isRemovingDNS"
            :disabled="dns.id === defaults?.defaultDNSID || dns.selected"
            size="xs"
            icon="i-heroicons-minus"
            @click="removeDNS(dns.id)"
          />

          <UButton
            :loading="isSelectingDNS"
            :disabled="dns.selected"
            size="xs"
            icon="i-heroicons-map-pin"
            @click="selectDNS(dns.id)"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
