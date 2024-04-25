<script setup lang="ts"></script>

<template>
  <div>
    <Button label="hello" loading>
      <template #icon>
        <Icon name="heroicons:moon-20-solid" />
      </template>
    </Button>

    <MonacoEditor class="h-[50vh]" lang="typescript" />
  </div>
</template>
