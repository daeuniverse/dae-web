<script setup lang="ts">
import { z } from 'zod'
import * as mutations from '~/mutations'

const apiStore = useAPIStore()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const visible = defineModel('visible', {
  type: Boolean,
  default: false
})

const isImporting = defineModel('isImporting', {
  type: Boolean,
  default: false
})

const schema = z.object({
  importSubscriptions: z.array(
    z.object({
      tag: z.string().min(1),
      link: z.string().url()
    })
  )
})

const { handleSubmit, handleReset } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    importSubscriptions: [{ tag: '', link: '' }]
  }
})

const { remove, push, fields } = useFieldArray<
  z.infer<typeof schema>['importSubscriptions'][number]
>('importSubscriptions')

watch(visible, (visible) => {
  if (!visible) return

  handleReset()
})

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  isImporting.value = true

  for (const { tag, link } of values.importSubscriptions) {
    await apiStore.apiClient?.mutation(mutations.importSubscription, {
      arg: {
        tag,
        link
      },
      rollbackError: false
    })
  }

  isImporting.value = false
  visible.value = false

  resetForm()

  emit('submit')
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Import Subscriptions"
    :draggable="false"
  >
    <div class="space-y-4">
      <div class="flex flex-col gap-2">
        <InputGroup v-for="(field, index) in fields" :key="field.key">
          <InputGroupAddon>
            <Icon name="heroicons:link" />
          </InputGroupAddon>

          <Field
            #="{ componentField }"
            :name="`importSubscriptions.${index}.link`"
          >
            <InputText placeholder="link" v-bind="componentField" />
          </Field>

          <Field
            #="{ componentField }"
            :name="`importSubscriptions.${index}.tag`"
          >
            <InputText placeholder="tag" v-bind="componentField" />
          </Field>

          <Button
            severity="danger"
            :disabled="field.isFirst"
            @click="remove(index)"
          >
            <Icon name="heroicons:trash" />
          </Button>
        </InputGroup>
      </div>

      <div>
        <Button @click="push({ tag: '', link: '' })">
          <Icon name="heroicons:plus" />
        </Button>
      </div>
    </div>

    <template #footer>
      <Button text @click="visible = false">Cancel</Button>

      <Button :loading="isImporting" @click="onSubmit">Save</Button>
    </template>
  </Dialog>
</template>
