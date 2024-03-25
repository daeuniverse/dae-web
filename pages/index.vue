<script setup lang="ts">
const apiStore = useAPIStore()

await apiStore.initialize()

const value = ref(
  `
pname(NetworkManager, systemd-resolved) -> direct
dip(geoip:private) -> direct
dip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: proxy
`.trim()
)

watch(value, (value) => {
  console.log(value)
})

const { t } = useI18n()

const tabsItems = [
  {
    label: t('group'),
    slot: 'group'
  },
  {
    label: t('routing'),
    slot: 'routing'
  },
  {
    label: t('dns'),
    slot: 'dns'
  },
  {
    label: t('config'),
    slot: 'config'
  }
]

const accordionItems = [
  {
    label: t('subscription'),
    slot: 'subscription',
    defaultOpen: true
  },
  {
    label: t('node'),
    slot: 'node',
    defaultOpen: true
  }
]
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
    <UTabs :items="tabsItems" class="w-full flex-shrink-0 sm:w-1/2">
      <template #group>
        <ResourceGroup />
      </template>

      <template #routing>
        <ResourceRouting />
      </template>

      <template #dns>
        <ResourceDNS />
      </template>

      <template #config>
        <ResourceConfig />
      </template>
    </UTabs>

    <UAccordion
      :items="accordionItems"
      multiple
      class="w-full flex-shrink-0 sm:w-1/2"
    >
      <template #subscription>
        <ResourceSubscription />
      </template>

      <template #node>
        <ResourceNode />
      </template>
    </UAccordion>
  </div>
</template>
