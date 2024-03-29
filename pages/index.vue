<script setup lang="ts">
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
        <!-- 群组 -->
        <ResourceGroup />
      </template>

      <template #routing>
        <!-- 路由 -->
        <ResourceRouting />
      </template>

      <template #dns>
        <!-- DNS -->
        <ResourceDNS />
      </template>

      <template #config>
        <!-- 配置 -->
        <ResourceConfig />
      </template>
    </UTabs>

    <UAccordion
      :items="accordionItems"
      multiple
      class="w-full flex-shrink-0 sm:w-1/2"
    >
      <template #subscription>
        <!-- 订阅 -->
        <ResourceSubscription />
      </template>

      <template #node>
        <!-- 节点 -->
        <ResourceNode />
      </template>
    </UAccordion>
  </div>
</template>
