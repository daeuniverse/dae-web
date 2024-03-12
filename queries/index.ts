// graphql query

// 用户数量
export const numberUsers = graphql(`
  query NumberUsers {
    numberUsers
  }
`)

// 获取登陆 token
export const token = graphql(`
  query Token($username: String!, $password: String!) {
    token(username: $username, password: $password)
  }
`)

// 获取用户信息
export const user = graphql(`
  query User {
    user {
      name
      username
      avatar
    }
  }
`)

// 获取 JSON 对象存储
export const jsonStorage = graphql(`
  query JsonStorage($paths: [String!]) {
    jsonStorage(paths: $paths)
  }
`)

// 获取常规信息
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

// 获取配置列表
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

// 获取群组列表
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

// 获取路由列表
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

// 获取 DNS 列表
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

// 获取节点列表
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

// 获取订阅列表
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
          link
          address
          protocol
          tag
        }
      }
    }
  }
`)
