export const setJsonStorage = graphql(`
  mutation SetJsonStorage($paths: [String!]!, $values: [String!]!) {
    setJsonStorage(paths: $paths, values: $values)
  }
`)

export const createUser = graphql(`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password)
  }
`)

export const createConfig = graphql(`
  mutation CreateConfig($name: String, $global: globalInput) {
    createConfig(name: $name, global: $global) {
      id
    }
  }
`)

export const updateConfig = graphql(`
  mutation UpdateConfig($id: ID!, $global: globalInput!) {
    updateConfig(id: $id, global: $global) {
      id
    }
  }
`)

export const removeConfig = graphql(`
  mutation RemoveConfig($id: ID!) {
    removeConfig(id: $id)
  }
`)

export const selectConfig = graphql(`
  mutation SelectConfig($id: ID!) {
    selectConfig(id: $id)
  }
`)

export const renameConfig = graphql(`
  mutation RenameConfig($id: ID!, $name: String!) {
    renameConfig(id: $id, name: $name)
  }
`)

export const createRouting = graphql(`
  mutation CreateRouting($name: String, $routing: String) {
    createRouting(name: $name, routing: $routing) {
      id
    }
  }
`)

export const updateRouting = graphql(`
  mutation UpdateRouting($id: ID!, $routing: String!) {
    updateRouting(id: $id, routing: $routing) {
      id
    }
  }
`)

export const removeRouting = graphql(`
  mutation RemoveRouting($id: ID!) {
    removeRouting(id: $id)
  }
`)

export const selectRouting = graphql(`
  mutation SelectRouting($id: ID!) {
    selectRouting(id: $id)
  }
`)

export const renameRouting = graphql(`
  mutation RenameRouting($id: ID!, $name: String!) {
    renameRouting(id: $id, name: $name)
  }
`)

export const createDNS = graphql(`
  mutation CreateDNS($name: String, $dns: String) {
    createDns(name: $name, dns: $dns) {
      id
    }
  }
`)

export const updateDNS = graphql(`
  mutation UpdateDNS($id: ID!, $dns: String!) {
    updateDns(id: $id, dns: $dns) {
      id
    }
  }
`)

export const removeDNS = graphql(`
  mutation RemoveDNS($id: ID!) {
    removeDns(id: $id)
  }
`)

export const selectDNS = graphql(`
  mutation SelectDNS($id: ID!) {
    selectDns(id: $id)
  }
`)

export const renameDNS = graphql(`
  mutation RenameDNS($id: ID!, $name: String!) {
    renameDns(id: $id, name: $name)
  }
`)

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

export const removeGroup = graphql(`
  mutation RemoveGroup($id: ID!) {
    removeGroup(id: $id)
  }
`)

export const setGroupPolicy = graphql(`
  mutation GroupSetPolicy(
    $id: ID!
    $policy: Policy!
    $policyParams: [PolicyParam!]
  ) {
    groupSetPolicy(id: $id, policy: $policy, policyParams: $policyParams)
  }
`)

export const renameGroup = graphql(`
  mutation RenameGroup($id: ID!, $name: String!) {
    renameGroup(id: $id, name: $name)
  }
`)

export const addGroupNodes = graphql(`
  mutation GroupAddNodes($id: ID!, $nodeIDs: [ID!]!) {
    groupAddNodes(id: $id, nodeIDs: $nodeIDs)
  }
`)

export const removeGroupNodes = graphql(`
  mutation GroupDelNodes($id: ID!, $nodeIDs: [ID!]!) {
    groupDelNodes(id: $id, nodeIDs: $nodeIDs)
  }
`)

export const addGroupSubscriptions = graphql(`
  mutation GroupAddSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {
    groupAddSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)
  }
`)

export const removeGroupSubscriptions = graphql(`
  mutation GroupDelSubscriptions($id: ID!, $subscriptionIDs: [ID!]!) {
    groupDelSubscriptions(id: $id, subscriptionIDs: $subscriptionIDs)
  }
`)

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

export const updateNode = graphql(`
  mutation UpdateNode($id: ID!, $newLink: String!) {
    updateNode(id: $id, newLink: $newLink) {
      id
    }
  }
`)

export const removeNodes = graphql(`
  mutation RemoveNodes($ids: [ID!]!) {
    removeNodes(ids: $ids)
  }
`)

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

export const updateSubscription = graphql(`
  mutation UpdateSubscription($id: ID!) {
    updateSubscription(id: $id) {
      id
    }
  }
`)

export const removeSubscription = graphql(`
  mutation UpdateSubscription($id: ID!) {
    updateSubscription(id: $id) {
      id
    }
  }
`)

export const run = graphql(`
  mutation Run($dry: Boolean!) {
    run(dry: $dry)
  }
`)

export const updateAvatar = graphql(`
  mutation UpdateAvatar($avatar: String!) {
    updateAvatar(avatar: $avatar)
  }
`)

export const updateName = graphql(`
  mutation UpdateName($name: String!) {
    updateName(name: $name)
  }
`)
