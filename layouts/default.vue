<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'dark'
  }
})
</script>

<template>
  <main class="min-h-screen bg-surface-600">
    <div class="container mx-auto">
      <slot />
    </div>
  </main>
</template>
