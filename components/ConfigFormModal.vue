<script setup lang="ts">
import type { ResultOf } from 'gql.tada'
import { z } from 'zod'
import type * as queries from '~/queries'

const props = defineProps<{
  config?: ResultOf<typeof queries.configs>['configs'][number]
}>()

const visible = defineModel('visible', {
  type: Boolean,
  default: false
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(1),
      tproxyPort: z.number()
    })
  ),
  initialValues: {
    name: props.config?.name || '',
    tproxyPort: props.config?.global.tproxyPort || 0
  }
})

const onSubmit = handleSubmit(async () => {})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    header="Create Config"
  >
    <div>
      <Field #="{ componentField }" name="name">
        <FormItem class="w-full">
          <FormLabel>Name</FormLabel>

          <FormControl>
            <InputText class="w-full" v-bind="componentField" />
          </FormControl>

          <FormDescription>The name of the configuration.</FormDescription>

          <FormMessage />
        </FormItem>
      </Field>

      <Accordion class="py-4" multiple>
        <AccordionTab header="Software Options">
          <Field
            #="{ componentField: { onInput, ...componentField } }"
            name="tproxyPort"
          >
            <FormItem class="w-full">
              <FormLabel>tproxyPort</FormLabel>

              <FormControl>
                <InputNumber
                  class="w-full"
                  v-bind="componentField"
                  :format="false"
                  @input="({ value }) => onInput(value)"
                />
              </FormControl>

              <FormDescription>
                Transparent Proxy Port to listen on. Valid range is 0 - 65535.
                It is NOT a HTTP/SOCKS port, and is just used by eBPF program.
                In normal case, you do not need to use it.
              </FormDescription>

              <FormMessage />
            </FormItem>
          </Field>
        </AccordionTab>

        <AccordionTab header="Interface and Kernel Options">
          <Field #="{ componentField }" name="name">
            <FormItem class="w-full">
              <FormLabel>Name</FormLabel>

              <FormControl>
                <InputText class="w-full" v-bind="componentField" />
              </FormControl>

              <FormDescription>The name of the configuration.</FormDescription>

              <FormMessage />
            </FormItem>
          </Field>
        </AccordionTab>

        <AccordionTab header="Node Connectivity Check">
          <Field #="{ componentField }" name="name">
            <FormItem class="w-full">
              <FormLabel>Name</FormLabel>

              <FormControl>
                <InputText class="w-full" v-bind="componentField" />
              </FormControl>

              <FormDescription>The name of the configuration.</FormDescription>

              <FormMessage />
            </FormItem>
          </Field>
        </AccordionTab>

        <AccordionTab header="Connecting Options">
          <Field #="{ componentField }" name="name">
            <FormItem class="w-full">
              <FormLabel>Name</FormLabel>

              <FormControl>
                <InputText class="w-full" v-bind="componentField" />
              </FormControl>

              <FormDescription>The name of the configuration.</FormDescription>

              <FormMessage />
            </FormItem>
          </Field>
        </AccordionTab>
      </Accordion>
    </div>

    <template #footer>
      <Button text>Reset</Button>

      <Button @click="onSubmit">Save</Button>
    </template>
  </Dialog>
</template>
