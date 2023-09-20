import { GraphQLClient } from 'graphql-request'

import { ChatClient } from './chatClient'
import { EmbedBuilder } from './embedBuilder'

import * as gql from './types.gen'

export type { ChatClient } from './chatClient'
export type { EmbedBuilder, UrlParams } from './embedBuilder'
export type { EmbedClient } from './embed'
export * from './types'
export * from './types.gen'

export class PixellandChat {
  static embedChat(apiHost: string, uiHost: string) {
    return new EmbedBuilder<ChatClient>({ apiHost }, ChatClient).withUrl(uiHost)
  }

  static getClient(apiHost: string) {
    const client = new GraphQLClient(apiHost)
    return gql.getSdk(client)
  }
}
