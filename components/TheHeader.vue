<script setup lang="ts">
import { useAPIStore } from '#imports'
import { z } from 'zod'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isSettingsDialogVisible = ref(false)

const { data: user, execute } = useAsyncData(
  'user',
  async () => (await apiStore.apiClient?.query(queries.user, {}))?.data?.user
)

const { handleSubmit, setValues, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(4),
      avatar: z.string()
    })
  ),
  initialValues: {
    name: user.value?.name || '',
    avatar: user.value?.avatar || ''
  }
})

watch(isSettingsDialogVisible, (isSettingsDialogVisible) => {
  if (!isSettingsDialogVisible) return

  setValues({
    name: user.value?.name || '',
    avatar: user.value?.avatar || ''
  })
})

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  if (values.name !== user.value?.name) {
    await apiStore.apiClient?.mutation(mutations.updateName, {
      name: values.name
    })
  }

  if (values.avatar !== user.value?.avatar) {
    await apiStore.apiClient?.mutation(mutations.updateAvatar, {
      avatar: values.avatar
    })
  }

  await execute()

  isSettingsDialogVisible.value = false

  resetForm()
})

const {
  open: openFileDialog,
  files: fileDialogFiles,
  onChange: onFileDialogChange,
  reset: resetFileDialog
} = useFileDialog({ accept: 'image/*', multiple: false })

onFileDialogChange(async () => {
  if (!fileDialogFiles.value) return

  const formData = new FormData()
  formData.append('avatar', fileDialogFiles.value[0])

  setFieldValue(
    'avatar',
    await $fetch('/api/avatar', {
      method: 'POST',
      body: formData
    })
  )

  resetFileDialog()
})
</script>

<template>
  <div>
    <header>
      <ClientOnly>
        <Menubar>
          <template #start>
            <TextLogo class="px-2" />
          </template>

          <template #end>
            <Button @click="isSettingsDialogVisible = true">
              <Avatar :image="user?.avatar || ''" shape="circle" />
            </Button>
          </template>
        </Menubar>
      </ClientOnly>
    </header>

    <Dialog v-model:visible="isSettingsDialogVisible" modal header="Settings">
      <div class="space-y-2">
        <Field #="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>

            <FormControl>
              <InputText class="w-full" v-bind="componentField" />
            </FormControl>

            <FormDescription>
              The name to display in the header.
            </FormDescription>

            <FormMessage />
          </FormItem>
        </Field>

        <Field #="{ componentField }" name="avatar">
          <FormItem>
            <FormLabel>Avatar</FormLabel>

            <FormControl>
              <div class="flex items-center justify-center">
                <Button plain @click="() => openFileDialog()">
                  <Avatar
                    :image="componentField.modelValue"
                    size="xlarge"
                    shape="circle"
                  />
                </Button>
              </div>
            </FormControl>

            <FormDescription>
              The avatar to display in the header.
            </FormDescription>

            <FormMessage />
          </FormItem>
        </Field>
      </div>

      <template #footer>
        <Button
          text
          @click="
            setValues({
              name: user?.name || '',
              avatar: user?.avatar || ''
            })
          "
        >
          Reset
        </Button>

        <Button @click="onSubmit">Save</Button>
      </template>
    </Dialog>
  </div>
</template>
