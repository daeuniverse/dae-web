<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const apiStore = useAPIStore()

const isLoading = ref(false)

const schema = toTypedSchema(
  z.object({
    endpointURL: z.string().url(),
    username: z.string().min(4),
    password: z.string().min(8)
  })
)

const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  const { endpointURL, username, password } = values
  apiStore.endpointURL = endpointURL

  try {
    const token = await apiStore.login(username, password)
    if (token) apiStore.token = token
    await apiStore.initialize()
    await navigateTo('/', { replace: true })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <form @submit="onSubmit">
      <Card class="mx-auto w-full max-w-md">
        <template #title>Login</template>

        <template #content>
          <div class="space-y-2">
            <Field #="{ componentField }" name="endpointURL">
              <FormItem>
                <FormLabel>Endpoint URL</FormLabel>

                <FormControl>
                  <InputText class="w-full" v-bind="componentField" />
                </FormControl>

                <FormDescription>
                  The URL of the API endpoint to connect to.
                </FormDescription>

                <FormMessage />
              </FormItem>
            </Field>

            <Field #="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>

                <FormControl>
                  <InputText class="w-full" v-bind="componentField" />
                </FormControl>

                <FormDescription>
                  The username to use for authentication.
                </FormDescription>

                <FormMessage />
              </FormItem>
            </Field>

            <Field #="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Password
                    class="w-full"
                    toggle-mask
                    v-bind="componentField"
                  />
                </FormControl>

                <FormDescription>
                  The password to use for authentication.
                </FormDescription>

                <FormMessage />
              </FormItem>
            </Field>
          </div>
        </template>

        <template #footer>
          <Button type="submit" class="w-full">Login</Button>
        </template>
      </Card>
    </form>
  </div>
</template>
