<script setup lang="ts">
import type { Form, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { isEqual } from 'lodash-es'
import { z } from 'zod'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

withDefaults(
  defineProps<{
    type: 'create' | 'update'
  }>(),
  {
    type: 'create'
  }
)

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const apiStore = useAPIStore()

const isLoading = ref(false)

const schema = z.object({
  name: z.string().min(4),
  logLevel: z.string(),
  tproxyPort: z.number(),
  tproxyPortProtect: z.boolean(),
  allowInsecure: z.boolean(),
  checkIntervalSeconds: z.number(),
  checkToleranceMS: z.number(),
  sniffingTimeoutMS: z.number(),
  lanInterface: z.array(z.string().min(1)),
  wanInterface: z.array(z.string()),
  udpCheckDns: z.array(z.string()).min(1),
  tcpCheckUrl: z.array(z.string()).min(1),
  dialMode: z.string(),
  tcpCheckHttpMethod: z.string(),
  disableWaitingNetwork: z.boolean(),
  autoConfigKernelParameter: z.boolean(),
  tlsImplementation: z.string(),
  utlsImitate: z.string()
})

type Schema = z.output<typeof schema>

const formRef = ref<Form<Schema>>()

const initialState = () =>
  ({
    name: '',
    logLevel: 'info',
    tproxyPort: 12345,
    tproxyPortProtect: true,
    allowInsecure: false,
    checkIntervalSeconds: 30,
    checkToleranceMS: 0,
    sniffingTimeoutMS: 0,
    lanInterface: [],
    wanInterface: ['auto'],
    udpCheckDns: ['dns.google.com:53', '8.8.8.8', '2001:4860:4860::8888'],
    tcpCheckUrl: [
      'http://cp.cloudflare.com',
      '1.1.1.1',
      '2606:4700:4700::1111'
    ],
    dialMode: 'domain',
    tcpCheckHttpMethod: 'HEAD',
    disableWaitingNetwork: false,
    autoConfigKernelParameter: false,
    tlsImplementation: 'tls',
    utlsImitate: 'randomized'
  }) satisfies Schema

const state = reactive<Schema>(initialState())

const { t } = useI18n()

const accordionItems = [
  {
    label: t('software options'),
    slot: 'software-options',
    defaultOpen: true
  },
  {
    label: t('interface and kernel options'),
    slot: 'interface-and-kernel-options'
  },
  {
    label: t('node connectivity check'),
    slot: 'node-connectivity-check'
  },
  {
    label: t('connecting options'),
    slot: 'connecting-options'
  }
]

const logLevelOptions = [
  {
    label: 'error',
    value: 'error'
  },
  {
    label: 'warn',
    value: 'warn'
  },
  {
    label: 'info',
    value: 'info'
  },
  {
    label: 'debug',
    value: 'debug'
  },
  {
    label: 'trace',
    value: 'trace'
  }
]

const { data: lanInterfaceOptions, pending: isLanInterfaceLoading } =
  useAsyncData('lanInterface', async () => {
    const interfaces = await apiStore.apiClient?.query(queries.general, {
      up: true
    })

    return interfaces?.data?.general.interfaces.map(({ name }) => name)
  })

const { data: wanInterfaceOptions, pending: isWanInterfaceLoading } =
  useAsyncData('wanInterface', async () => {
    const interfaces = await apiStore.apiClient?.query(queries.general, {
      up: true
    })

    return [
      'auto',
      ...(interfaces?.data?.general.interfaces
        .filter(({ flag }) => !!flag.default)
        .map(({ name }) => name) || [])
    ]
  })

enum TcpCheckHttpMethod {
  CONNECT = 'CONNECT',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  PUT = 'PUT'
}

const dialModeOptions = ['ip', 'domain', 'domain+', 'domain++']

const tlsImplementationOptions = ['tls', 'utls']

enum UTLSImitate {
  randomized = 'randomized',
  randomizedalpn = 'randomizedalpn',
  randomizednoalpn = 'randomizednoalpn',
  firefox_auto = 'firefox_auto',
  firefox_55 = 'firefox_55',
  firefox_56 = 'firefox_56',
  firefox_63 = 'firefox_63',
  firefox_65 = 'firefox_65',
  firefox_99 = 'firefox_99',
  firefox_102 = 'firefox_102',
  firefox_105 = 'firefox_105',
  chrome_auto = 'chrome_auto',
  chrome_58 = 'chrome_58',
  chrome_62 = 'chrome_62',
  chrome_70 = 'chrome_70',
  chrome_72 = 'chrome_72',
  chrome_83 = 'chrome_83',
  chrome_87 = 'chrome_87',
  chrome_96 = 'chrome_96',
  chrome_100 = 'chrome_100',
  chrome_102 = 'chrome_102',
  ios_auto = 'ios_auto',
  ios_11_1 = 'ios_11_1',
  ios_12_1 = 'ios_12_1',
  ios_13 = 'ios_13',
  ios_14 = 'ios_14',
  android_11_okhttp = 'android_11_okhttp',
  edge_auto = 'edge_auto',
  edge_85 = 'edge_85',
  edge_106 = 'edge_106',
  safari_auto = 'safari_auto',
  safari_16_0 = 'safari_16_0',
  utls_360_auto = '360_auto',
  utls_360_7_5 = '360_7_5',
  utls_360_11_0 = '360_11_0',
  qq_auto = 'qq_auto',
  qq_11_1 = 'qq_11_1'
}

const isResetDisabled = computed(() => isEqual(state, initialState()))

const onReset = () => {
  formRef.value?.clear()
  Object.assign(state, initialState())
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true

  try {
    const {
      name,
      checkIntervalSeconds,
      checkToleranceMS,
      sniffingTimeoutMS,
      ...global
    } = event.data

    await apiStore.apiClient?.mutation(mutations.createConfig, {
      name,
      global: {
        checkInterval: `${checkIntervalSeconds}s`,
        checkTolerance: `${checkToleranceMS}ms`,
        sniffingTimeout: `${sniffingTimeoutMS}ms`,
        ...global
      }
    })

    onReset()

    emit('submit')
  } finally {
    isLoading.value = false
  }
}

const onError = (event: FormErrorEvent) => {
  console.log('error', event, state)
}

defineExpose({
  setValues(values?: Schema) {
    if (values) {
      Object.assign(state, { ...values })
    } else {
      onReset()
    }
  }
})
</script>

<template>
  <UModal>
    <UForm ref="formRef" :schema :state @submit="onSubmit" @error="onError">
      <UCard>
        <template #header>
          <UFormGroup label="Name" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>
        </template>

        <UAccordion :items="accordionItems">
          <template #software-options>
            <div class="space-y-2">
              <UFormGroup label="tproxyPort">
                <UInput v-model="state.tproxyPort" type="number" />
              </UFormGroup>

              <UFormGroup label="tproxyPortProtect">
                <UToggle v-model="state.tproxyPortProtect" />
              </UFormGroup>

              <UFormGroup label="logLevel">
                <URadioGroup
                  v-model="state.logLevel"
                  :options="logLevelOptions"
                />
              </UFormGroup>

              <UFormGroup label="disableWaitingNetwork">
                <UToggle v-model="state.disableWaitingNetwork" />
              </UFormGroup>
            </div>
          </template>

          <template #interface-and-kernel-options>
            <div class="space-y-2">
              <UFormGroup label="lanInterface">
                <USelectMenu
                  v-model="state.lanInterface"
                  :loading="isLanInterfaceLoading"
                  :options="lanInterfaceOptions"
                  multiple
                >
                  <template #label>
                    <span v-if="state.lanInterface.length" class="truncate">
                      {{ state.lanInterface.join(', ') }}
                    </span>

                    <span v-else>Select LanInterfaces</span>
                  </template>
                </USelectMenu>
              </UFormGroup>

              <UFormGroup label="wanInterface">
                <USelectMenu
                  v-model="state.wanInterface"
                  :loading="isWanInterfaceLoading"
                  :options="wanInterfaceOptions"
                  multiple
                >
                  <template #label>
                    <span v-if="state.wanInterface.length" class="truncate">
                      {{ state.wanInterface.join(', ') }}
                    </span>

                    <span v-else>Select WanInterfaces</span>
                  </template>
                </USelectMenu>
              </UFormGroup>

              <UFormGroup label="autoConfigKernelParameter">
                <UToggle v-model="state.autoConfigKernelParameter" />
              </UFormGroup>
            </div>
          </template>

          <template #node-connectivity-check>
            <div class="space-y-2">
              <UFormGroup label="tcpCheckUrl">
                <div class="space-y-2">
                  <UInput
                    v-for="(url, index) in state.tcpCheckUrl"
                    :key="index"
                    :value="url"
                    @input="
                      (event: InputEvent) =>
                        (state.tcpCheckUrl[index] = (
                          event.target as HTMLInputElement
                        ).value)
                    "
                  />

                  <div class="flex justify-end">
                    <UButton
                      size="xs"
                      icon="i-heroicons-plus"
                      @click="state.tcpCheckUrl.push('')"
                    />
                  </div>
                </div>
              </UFormGroup>

              <UFormGroup label="tcpCheckHttpMethod">
                <USelect
                  v-model="state.tcpCheckHttpMethod"
                  :options="Object.values(TcpCheckHttpMethod)"
                />
              </UFormGroup>

              <UFormGroup label="udpCheckDns">
                <div class="space-y-2">
                  <div
                    v-for="(url, index) in state.udpCheckDns"
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <UInput
                      class="w-full"
                      :value="url"
                      @input="
                        (event: InputEvent) =>
                          (state.udpCheckDns[index] = (
                            event.target as HTMLInputElement
                          ).value)
                      "
                    />

                    <UButton
                      size="xs"
                      icon="i-heroicons-minus"
                      @click="state.udpCheckDns.splice(index, 1)"
                    />
                  </div>

                  <div class="flex justify-end">
                    <UButton
                      size="xs"
                      icon="i-heroicons-plus"
                      @click="state.udpCheckDns.push('')"
                    />
                  </div>
                </div>
              </UFormGroup>

              <UFormGroup label="checkInterval (s)">
                <UInput v-model="state.checkIntervalSeconds" type="number" />
              </UFormGroup>

              <UFormGroup label="checkTolerance (ms)">
                <UInput v-model="state.checkToleranceMS" type="number" />
              </UFormGroup>
            </div>
          </template>

          <template #connecting-options>
            <div class="space-y-2">
              <UFormGroup label="dialMode">
                <URadioGroup
                  v-model="state.dialMode"
                  :options="dialModeOptions"
                />
              </UFormGroup>

              <UFormGroup label="allowSecure">
                <UToggle v-model="state.allowInsecure" />
              </UFormGroup>

              <UFormGroup label="sniffingTimeout (ms)">
                <UInput v-model="state.sniffingTimeoutMS" type="number" />
              </UFormGroup>

              <UFormGroup label="tlsImplementation">
                <USelectMenu
                  v-model="state.tlsImplementation"
                  :options="tlsImplementationOptions"
                />
              </UFormGroup>

              <UFormGroup
                v-if="state.tlsImplementation === 'utls'"
                label="utlsImitate"
              >
                <USelectMenu
                  v-model="state.utlsImitate"
                  :options="Object.values(UTLSImitate)"
                />
              </UFormGroup>
            </div>
          </template>
        </UAccordion>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton :disabled="isResetDisabled" color="black" @click="onReset">
              Reset
            </UButton>
            <UButton :loading="isLoading" type="submit">Submit</UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>
