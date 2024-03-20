import { Client, fetchExchange } from '@urql/core'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

export const useAPIStore = defineStore('api', () => {
  const endpointURL = useCookie('endpointURL', { sameSite: true })
  const token = useCookie('token', { sameSite: true })

  const apiClient = computed(() => {
    if (!endpointURL.value) return null

    return new Client({
      url: endpointURL.value,
      exchanges: [fetchExchange],
      fetchOptions: () => {
        return {
          headers: {
            Authorization: token.value ? `Bearer ${token.value}` : ''
          }
        }
      }
    })
  })

  const login = async (username: string, password: string) => {
    const client = apiClient.value

    if (!client) return

    const { data: numberUsers } = await client.query(queries.numberUsers, {})

    if (!numberUsers?.numberUsers || numberUsers.numberUsers === 0) {
      await client.mutation(mutations.createUser, {
        username,
        password
      })
    }

    const { data: token } = await client.query(queries.token, {
      username,
      password
    })

    return token?.token
  }

  const getDefaults = async () => {
    const client = apiClient.value

    if (!client) return

    const data = await client.query(queries.jsonStorage, {
      paths: [
        'defaultConfigID',
        'defaultRoutingID',
        'defaultDNSID',
        'defaultGroupID'
      ]
    })

    if (!data.data) return

    const [defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID] =
      data.data.jsonStorage

    return {
      defaultConfigID,
      defaultRoutingID,
      defaultDNSID,
      defaultGroupID
    }
  }

  const initialize = async () => {
    const client = apiClient.value

    if (!client) return

    const { defaultConfigID, defaultRoutingID, defaultDNSID, defaultGroupID } =
      (await getDefaults()) || {}

    if (!defaultConfigID) {
      const { data } = await client.mutation(mutations.createConfig, {
        name: 'global',
        global: {
          logLevel: 'info',
          tproxyPort: 12345,
          tproxyPortProtect: true,
          allowInsecure: false,
          checkInterval: '30s',
          checkTolerance: '0ms',
          sniffingTimeout: '0ms',
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
        }
      })

      if (data?.createConfig.id) {
        await client.mutation(mutations.selectConfig, {
          id: data.createConfig.id
        })

        await client.mutation(mutations.setJsonStorage, {
          paths: ['defaultConfigID'],
          values: [String(data.createConfig.id)]
        })
      }
    }

    if (!defaultRoutingID) {
      const { data } = await client.mutation(mutations.createRouting, {
        name: 'default',
        routing: `
pname(NetworkManager, systemd-resolved) -> direct
dip(geoip:private) -> direct
dip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: proxy
`.trim()
      })

      if (data?.createRouting.id) {
        await client.mutation(mutations.selectRouting, {
          id: data.createRouting.id
        })

        await client.mutation(mutations.setJsonStorage, {
          paths: ['defaultRoutingID'],
          values: [String(data.createRouting.id)]
        })
      }
    }

    if (!defaultDNSID) {
      const { data } = await client.mutation(mutations.createDNS, {
        name: 'default',
        dns: `
upstream {
  alidns: 'udp://223.5.5.5:53'
  googledns: 'tcp+udp://8.8.8.8:53'
}
routing {
  request {
    qname(geosite:cn) -> alidns
    fallback: googledns
  }
}
`.trim()
      })

      if (data?.createDns.id) {
        await client.mutation(mutations.selectDNS, {
          id: data.createDns.id
        })

        await client.mutation(mutations.setJsonStorage, {
          paths: ['defaultDNSID'],
          values: [String(data.createDns.id)]
        })
      }
    }

    if (!defaultGroupID) {
      const { data } = await client.mutation(mutations.createGroup, {
        name: 'proxy',
        policy: 'min_moving_avg',
        policyParams: []
      })

      if (data?.createGroup.id) {
        await client.mutation(mutations.setJsonStorage, {
          paths: ['defaultGroupID'],
          values: [String(data.createGroup.id)]
        })
      }
    }
  }

  return { endpointURL, token, apiClient, login, getDefaults, initialize }
})
