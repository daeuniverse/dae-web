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

export const general = graphql(`
  query General($up: Boolean) {
    general {
      dae {
        running
        modified
        version
      }

      interfaces(up: $up) {
        name
        ifindex
        ip

        flag {
          default {
            ipVersion
            gateway
            source
          }
        }
      }
    }
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

export const routings = graphql(`
  query Routings {
    routings {
      id
      name
      selected
      routing {
        string
      }
    }
  }
`)

export const dnss = graphql(`
  query DNSs {
    dnss {
      id
      name
      selected

      dns {
        string

        routing {
          request {
            string
          }

          response {
            string
          }
        }
      }
    }
  }
`)

export const nodes = graphql(`
  query Nodes {
    nodes {
      edges {
        id
        name
        link
        address
        protocol
        tag
      }
    }
  }
`)

export const subscriptions = graphql(`
  query Subscriptions {
    subscriptions {
      id
      tag
      status
      link
      info
      updatedAt

      nodes {
        edges {
          id
          name
          protocol
          link
        }
      }
    }
  }
`)
