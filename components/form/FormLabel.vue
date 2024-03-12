<script setup lang="ts">
import type { LabelProps } from 'radix-vue'
import { Label } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils'
import { useFormField } from './useFormField'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const { error, formItemId } = useFormField()
</script>

<template>
  <Label
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-red-500',
        props.class
      )
    "
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
