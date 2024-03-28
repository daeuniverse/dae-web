<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import type { ResultOf } from 'gql.tada'
import { z } from 'zod'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isNodeModalOpen = ref(false)

const schema = z.object({
  importNodes: z.array(
    z.object({
      tag: z.string(),
      link: z.string().url()
    })
  )
})

type Schema = z.output<typeof schema>

const initialState = () =>
  ({
    importNodes: [
      {
        tag: '',
        link: ''
      }
    ]
  }) satisfies Schema

const state = reactive<Schema>(initialState())

const selected = ref<ResultOf<typeof queries.nodes>['nodes']['edges']>([])

const {
  data: nodes,
  pending: isLoading,
  execute
} = useAsyncData(
  'nodes',
  async () =>
    (await apiStore.apiClient?.query(queries.nodes, {}))?.data?.nodes.edges,
  {
    default: () => []
  }
)

const isRemoving = ref(false)

const onRemove = async () => {
  isRemoving.value = true

  await apiStore.apiClient?.mutation(mutations.removeNodes, {
    ids: selected.value.map((node) => node.id)
  })

  await execute()

  isRemoving.value = false
}

const isSubmitting = ref(false)
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true

  const { importNodes: importSubscriptions } = event.data

  await apiStore.apiClient?.mutation(mutations.importNodes, {
    args: importSubscriptions,
    rollbackError: false
  })

  await execute()

  isSubmitting.value = false
  isNodeModalOpen.value = false
}

const onError = (event: FormErrorEvent) => {
  console.log(event)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-end gap-2">
        <UButton
          :loading="isRemoving"
          :disabled="!selected.length"
          icon="i-heroicons-minus"
          @click="onRemove"
        />

        <UButton icon="i-heroicons-link" @click="isNodeModalOpen = true" />
      </div>
    </template>

    <ClientOnly>
      <UTable v-model="selected" :rows="nodes" :loading="isLoading" />
    </ClientOnly>

    <UModal v-model="isNodeModalOpen">
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        @error="onError"
      >
        <UCard>
          <template #header>Import Nodes</template>

          <div class="space-y-2">
            <div
              v-for="({ tag, link }, index) in state.importNodes"
              :key="index"
              class="flex items-center gap-2"
            >
              <UInput
                class="w-full"
                :value="tag"
                placeholder="tag"
                @input="
                  (event: InputEvent) =>
                    (state.importNodes[index].tag = (
                      event.target as HTMLInputElement
                    ).value)
                "
              />

              <UInput
                class="w-full"
                :value="link"
                placeholder="link"
                @input="
                  (event: InputEvent) =>
                    (state.importNodes[index].link = (
                      event.target as HTMLInputElement
                    ).value)
                "
              />

              <UButton
                size="xs"
                icon="i-heroicons-minus"
                @click="state.importNodes.splice(index, 1)"
              />
            </div>

            <div class="flex justify-end">
              <UButton
                size="xs"
                icon="i-heroicons-plus"
                @click="
                  state.importNodes.push({
                    tag: '',
                    link: ''
                  })
                "
              />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton :loading="isSubmitting" type="submit">Confirm</UButton>
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </UCard>
</template>
