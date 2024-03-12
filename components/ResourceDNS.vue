<script setup lang="ts">
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()
const { data: defaults } = useAsyncData('defaults', () =>
  apiStore.getDefaults()
)

const { data: dnss, execute: reloadDNSs } = useAsyncData('dnss', async () => {
  const data = await apiStore.apiClient?.query(queries.dnss, {})

  return data?.data?.dnss
})

const isRemovingDNS = ref(false)

const removeDNS = async (id: string) => {
  isRemovingDNS.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.removeDNS, { id })

    await reloadDNSs()
  } finally {
    isRemovingDNS.value = false
  }
}

const isSelectingDNS = ref(false)

const selectDNS = async (id: string) => {
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
    <div class="flex justify-end">
      <UButton icon="i-heroicons:plus" />
    </div>

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
            icon="i-heroicons:minus"
            @click="removeDNS(dns.id)"
          />

          <UButton
            :loading="isSelectingDNS"
            :disabled="dns.selected"
            size="xs"
            icon="i-heroicons:map-pin"
            @click="selectDNS(dns.id)"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
