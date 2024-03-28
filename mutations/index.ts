// graphql mutation

// 设置 JSON 对象存储
export const setJsonStorage = graphql(`
  mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {
    setJsonStorage(paths: $paths, values: $values)
  }
`)

// 新建用户
export const createUser = graphql(`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password)
  }
`)

// 新建配置
export const createConfig = graphql(`
  mutation CreateConfig($name: String, $global: globalInput) {
    createConfig(name: $name, global: $global) {
      id
    }
  }
`)

// 更新配置
export const updateConfig = graphql(`
  mutation UpdateConfig($id: ID!, $global: globalInput!) {
    updateConfig(id: $id, global: $global) {
      id
    }
  }
`)

// 移除配置
export const removeConfig = graphql(`
  mutation RemoveConfig($id: ID!) {
    removeConfig(id: $id)
  }
`)

// 选择配置
export const selectConfig = graphql(`
  mutation SelectConfig($id: ID!) {
    selectConfig(id: $id)
  }
`)

// 重命名配置
export const renameConfig = graphql(`
  mutation RenameConfig($id: ID!, $name: String!) {
    renameConfig(id: $id, name: $name)
  }
`)

// 新建路由
export const createRouting = graphql(`
  mutation CreateRouting($name: String, $routing: String) {
    createRouting(name: $name, routing: $routing) {
      id
    }
  }
`)

// 更新路由
export const updateRouting = graphql(`
  mutation UpdateRouting($id: ID!, $routing: String!) {
    updateRouting(id: $id, routing: $routing) {
      id
    }
  }
`)

// 移除路由
export const removeRouting = graphql(`
  mutation RemoveRouting($id: ID!) {
    removeRouting(id: $id)
  }
`)

// 选择路由
export const selectRouting = graphql(`
  mutation SelectRouting($id: ID!) {
    selectRouting(id: $id)
  }
`)

// 重命名路由
export const renameRouting = graphql(`
  mutation RenameRouting($id: ID!, $name: String!) {
    renameRouting(id: $id, name: $name)
  }
`)

// 新建 DNS
export const createDNS = graphql(`
  mutation CreateDNS($name: String, $dns: String) {
    createDns(name: $name, dns: $dns) {
      id
    }
  }
`)

// 更新 DNS
export const updateDNS = graphql(`
  mutation UpdateDNS($id: ID!, $dns: String!) {
    updateDns(id: $id, dns: $dns) {
      id
    }
  }
`)

// 移除 DNS
export const removeDNS = graphql(`
  mutation RemoveDNS($id: ID!) {
    removeDns(id: $id)
  }
`)

// 选择 DNS
export const selectDNS = graphql(`
  mutation SelectDNS($id: ID!) {
    selectDns(id: $id)
  }
`)

// 重命名 DNS
export const renameDNS = graphql(`
  mutation RenameDNS($id: ID!, $name: String!) {
    renameDns(id: $id, name: $name)
  }
`)

// 新建群组
export const createGroup = graphql(`
  mutation CreateGroup(
    $name: String!
    $policy: Policy!
    $policyParams: [PolicyParam!]
  ) {
    createGroup(name: $name, policy: $policy, policyParams: $policyParams) {
      id
    }
  }
`)

// 移除群组
export const removeGroup = graphql(`
  mutation RemoveGroup($id: ID!) {
    removeGroup(id: $id)
  }
`)

// 设置群组策略
export const setGroupPolicy = graphql(`
  mutation GroupSetPolicy(
    $id: ID!
    $policy: Policy!
    $policyParams: [PolicyParam!]
  ) {
    groupSetPolicy(id: $id, policy: $policy, policyParams: $policyParams)
  }
`)

// 重命名群组
export const renameGroup = graphql(`
  mutation RenameGroup($id: ID!, $name: String!) {
    renameGroup(id: $id, name: $name)
  }
`)

// 向群组添加节点
export const addGroupNodes = graphql(`
  mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {
    groupAddNodes(id: $id, nodeIDs: $nodeIDs)
  }
`)

// 从群组移除节点
export const removeGroupNodes = graphql(`
  mutation GroupDelNodes($id: ID!, $nodeIDs: [ID!]!) {
    groupDelNodes(id: $id, nodeIDs: $nodeIDs)
  }
`)

// 向群组添加订阅
export const addGroupSubscriptions = graphql(`
  mutation GroupAddSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {
    groupAddSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)
  }
`)

// 从群组移除订阅
export const removeGroupSubscriptions = graphql(`
  mutation GroupDelSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {
    groupDelSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)
  }
`)

// 导入节点
export const importNodes = graphql(`
  mutation ImportNodes($rollbackError: Boolean!, $args: [ImportArgument!]!) {
    importNodes(rollbackError: $rollbackError, args: $args) {
      link
      error
      node {
        id
      }
    }
  }
`)

// 更新节点
export const updateNode = graphql(`
  mutation UpdateNode($id: ID!, $newLink: String!) {
    updateNode(id: $id, newLink: $newLink) {
      id
    }
  }
`)

// 移除节点
export const removeNodes = graphql(`
  mutation RemoveNodes($ids: [ID!]!) {
    removeNodes(ids: $ids)
  }
`)

// 导入订阅
export const importSubscription = graphql(`
  mutation ImportSubscription($rollbackError: Boolean!, $arg: ImportArgument!) {
    importSubscription(rollbackError: $rollbackError, arg: $arg) {
      link
      sub {
        id
      }
      nodeImportResult {
        node {
          id
        }
      }
    }
  }
`)

// 更新订阅
export const updateSubscription = graphql(`
  mutation UpdateSubscription($id: ID!) {
    updateSubscription(id: $id) {
      id
    }
  }
`)

// 移除订阅
export const removeSubscriptions = graphql(`
  mutation RemoveSubscriptions($ids: [ID!]!) {
    removeSubscriptions(ids: $ids)
  }
`)

// 启动/挂起
export const run = graphql(`
  mutation Run($dry: Boolean!) {
    run(dry: $dry)
  }
`)

// 更新头像
export const updateAvatar = graphql(`
  mutation UpdateAvatar($avatar: String!) {
    updateAvatar(avatar: $avatar)
  }
`)

// 更新名称
export const updateName = graphql(`
  mutation UpdateName($name: String!) {
    updateName(name: $name)
  }
`)
