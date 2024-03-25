<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import dayjs from 'dayjs'
import type { ResultOf } from 'gql.tada'
import { z } from 'zod'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isSubscriptionModalOpen = ref(false)

const schema = z.object({
  importSubscriptions: z.array(
    z.object({
      tag: z.string(),
      link: z.string().url()
    })
  )
})

type Schema = z.output<typeof schema>

const initialState = () =>
  ({
    importSubscriptions: [
      {
        tag: '',
        link: ''
      }
    ]
  }) satisfies Schema

const state = reactive<Schema>(initialState())

const selected = ref<ResultOf<typeof queries.subscriptions>['subscriptions']>(
  []
)

const {
  data: subscriptions,
  pending: isLoading,
  execute
} = useAsyncData(async () =>
  (
    await apiStore.apiClient?.query(queries.subscriptions, {})
  )?.data?.subscriptions.map((subscription) => ({
    ...subscription,
    nodes: subscription.nodes.edges.length,
    updatedAt: dayjs(subscription.updatedAt).format('YYYY-MM:DD HH:mm:ss')
  }))
)

const isRemoving = ref(false)

const onRemove = async () => {
  isRemoving.value = true

  await apiStore.apiClient?.mutation(mutations.removeSubscriptions, {
    ids: selected.value.map((subscription) => subscription.id)
  })

  await execute()

  isRemoving.value = false
}

const isSubmitting = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true

  const { importSubscriptions } = event.data

  for (const { tag, link } of importSubscriptions) {
    await apiStore.apiClient?.mutation(mutations.importSubscription, {
      arg: {
        tag,
        link
      },
      rollbackError: false
    })
  }

  await execute()

  isSubmitting.value = false
  isSubscriptionModalOpen.value = false
}

const onError = (event: FormErrorEvent) => {
  console.log(event)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end gap-2">
      <UButton
        :loading="isRemoving"
        :disabled="!selected.length"
        icon="i-heroicons-minus"
        @click="onRemove"
      />

      <UButton
        icon="i-heroicons-link"
        @click="isSubscriptionModalOpen = true"
      />
    </div>

    <ClientOnly>
      <UTable v-model="selected" :rows="subscriptions" :loading="isLoading" />
    </ClientOnly>

    <UModal v-model="isSubscriptionModalOpen">
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        @error="onError"
      >
        <UCard>
          <template #header>Import Subscriptions</template>

          <div class="space-y-2">
            <div
              v-for="({ tag, link }, index) in state.importSubscriptions"
              :key="index"
              class="flex items-center gap-2"
            >
              <UInput
                class="w-full"
                :value="tag"
                placeholder="tag"
                @input="
                  (event: InputEvent) =>
                    (state.importSubscriptions[index].tag = (
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
                    (state.importSubscriptions[index].link = (
                      event.target as HTMLInputElement
                    ).value)
                "
              />

              <UButton
                size="xs"
                icon="i-heroicons-minus"
                @click="state.importSubscriptions.splice(index, 1)"
              />
            </div>

            <div class="flex justify-end">
              <UButton
                size="xs"
                icon="i-heroicons-plus"
                @click="
                  state.importSubscriptions.push({
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
  </div>
</template>
