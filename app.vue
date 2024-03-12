<script setup lang="ts">
import { configure } from 'vee-validate'

configure({
  validateOnBlur: false
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <ConfirmDialog />
    <Toast />
  </NuxtLayout>
</template>
