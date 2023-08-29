import type { ChattyHost, ChattyHostBuilder } from '@looker/chatty'
import { Chatty } from '@looker/chatty'

import type { EmbedBuilder } from './embedBuilder'

const IS_URL = /^https?:\/\//

export class EmbedClient<T> {
  _hostBuilder: ChattyHostBuilder | null = null
  _host: ChattyHost | null = null
  _connection: Promise<T> | null = null
  _client: T | null = null

  constructor(private _builder: EmbedBuilder<T>) {}

  /**
   * Returns a promise that resolves to a client that can be used to send messages to the
   * embedded content.
   */

  get connection() {
    return this._connection
  }

  /**
   * Indicates whether two way communication has successfully been established with the embedded content.
   */

  get isConnected() {
    return !!this._connection
  }

  private async createIframe(url: string) {
    this._hostBuilder = Chatty.createHost(url)
    for (const eventType in this._builder.handlers) {
      for (const handler of this._builder.handlers[eventType]) {
        this._hostBuilder.on(eventType, (...args) => handler.apply(this._client, args))
      }
    }
    this._host = this._hostBuilder
      // tslint:disable-next-line:deprecation
      .frameBorder('0')
      .withTargetOrigin(window.location.origin)
      .appendTo(this._builder.el)
      .build()

    // IE doesn't like calling classList.add() with no arguments, so check
    if (this._builder.classNames.length) {
      this._host.iframe.classList.add(...this._builder.classNames)
    }

    return this._host.connect().then(host => {
      // eslint-disable-next-line new-cap
      this._client = new this._builder.clientConstructor(host)
      return this._client
    })
  }

  /**
   * Establish two way communication with embedded content. Returns a promise that resolves to a
   * client that can be used to send messages to the embedded content.
   */

  async connect(): Promise<T> {
    if (this._connection) return this._connection

    this._connection = this.createIframe(this._builder.embedUrl)

    return this._connection
  }
}
