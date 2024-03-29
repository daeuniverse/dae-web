<script setup lang="ts">
const isModalOpen = defineModel<boolean>()
const content = defineModel<string>('content')

watch(content, (content) => {
  console.log(content)
})
</script>

<template>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Routing</h2>
      </template>

      <CodeEditor v-model="content" class="h-[60dvh]" />

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="black">Reset</UButton>

          <UButton type="submit">Submit</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
