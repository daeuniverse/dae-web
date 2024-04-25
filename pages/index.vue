<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

const resourceTabs: MenuItem[] = [
  {
    label: 'Group'
  },
  {
    label: 'Routing'
  },
  {
    label: 'DNS'
  },
  {
    label: 'Config'
  }
]

const selectedResourceTabIndex = ref(0)
const selectedResourceTab = computed(
  () => resourceTabs[selectedResourceTabIndex.value]
)

watch(selectedResourceTab, (selectedResourceTab) => {
  console.log('Selected tab:', selectedResourceTab)
})
</script>

<template>
  <div>
    <TheHeader />

    <div
      class="flex flex-col items-start gap-4 px-0 py-4 sm:px-4 lg:flex-row lg:px-0 [&>*]:w-full [&>*]:space-y-2 lg:[&>*]:w-1/2"
    >
      <div>
        <TabMenu
          v-model:active-index="selectedResourceTabIndex"
          :model="resourceTabs"
        />

        <ResourceConfig />
      </div>

      <div>
        <ClientOnly>
          <Panel header="subscription">
            <ResourceSubscription />
          </Panel>

          <Panel header="node">
            <ResourceNode />
          </Panel>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
