import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../backend/graph/schema.graphqls',
  documents: [
    '../ui/src/graphql/mutations/**/!(*.gen).ts',
    '../ui/src/graphql/queries/**/!(*.gen).ts',
    '../ui/src/graphql/subscriptions/**/!(*.gen).ts',
    '../ui/src/graphql/fragments/**/!(*.gen).ts',
  ],
  generates: {
    'src/types.gen.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        rawRequest: true,
      },
    },
    // 'src/graphql.gen/': {
    //   preset: 'client',
    //   plugins: [],
    //   config: {
    //     scalars: {
    //       Uuid: 'string',
    //       Time: 'string',
    //     },
    //   },
    // },
  },
}

export default config
