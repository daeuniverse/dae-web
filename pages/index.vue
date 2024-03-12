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
    label: t('groups'),
    slot: 'groups'
  },
  {
    label: t('routings'),
    slot: 'routings'
  },
  {
    label: t('configs'),
    slot: 'configs'
  }
]

const accordionItems = [
  {
    label: t('subscriptions'),
    slot: 'subscriptions',
    defaultOpen: true
  },
  {
    label: t('nodes'),
    slot: 'nodes'
  }
]
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <UTabs :items="tabsItems" class="w-full">
      <template #groups>
        <ResourceGroups />
      </template>

      <template #routings>
        <UCard>
          <CodeEditor v-model="value" class="h-[50dvh]" lang="routingA" />
        </UCard>
      </template>

      <template #configs>
        <ResourceConfigs />
      </template>
    </UTabs>

    <UAccordion :items="accordionItems">
      <template #subscriptions>
        <div>b</div>
      </template>

      <template #nodes>
        <div>a</div>
      </template>
    </UAccordion>
  </div>
</template>
