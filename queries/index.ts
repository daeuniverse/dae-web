export const numberUsers = graphql(`
  query NumberUsers {
    numberUsers
  }
`)

export const token = graphql(`
  query Token($username: String!, $password: String!) {
    token(username: $username, password: $password)
  }
`)

export const user = graphql(`
  query User {
    user {
      name
      username
      avatar
    }
  }
`)

export const jsonStorage = graphql(`
  query JsonStorage($paths: [String!]) {
    jsonStorage(paths: $paths)
  }
`)

export const configs = graphql(`
  query Configs {
    configs {
      id
      name
      selected
      global {
        logLevel
        tproxyPort
        allowInsecure
        checkInterval
        checkTolerance
        lanInterface
        wanInterface
        udpCheckDns
        tcpCheckUrl
        dialMode
        tcpCheckHttpMethod
        disableWaitingNetwork
        autoConfigKernelParameter
        sniffingTimeout
        tlsImplementation
        utlsImitate
        tproxyPortProtect
      }
    }
  }
`)

export const groups = graphql(`
  query Groups {
    groups {
      id
      name

      nodes {
        id
        link
        name
        address
        protocol
        tag
        subscriptionID
      }

      subscriptions {
        id
        updatedAt
        tag
        link
        status
        info

        nodes {
          edges {
            id
            link
            name
            address
            protocol
            tag
            subscriptionID
          }
        }
      }

      policy

      policyParams {
        key
        val
      }
    }
  }
`)
