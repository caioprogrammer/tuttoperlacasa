declare module '*.gql' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphql: any
  export default graphql
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}