import type { CallbackStore, ChattyHostConnection } from '@looker/chatty'

import { EmbedClient } from './embed'
import type { EmbedEventMap, SessionData } from './types'

type EmbedClientConstructor<T> = { new (host: ChattyHostConnection): T }

interface EmbedHostSettings {
  apiHost: string
}

export interface UrlParams {
  [key: string]: string
}

function stringify(params: { [key: string]: string }) {
  const result = <string[]>[]
  for (const key in params) {
    result.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  }
  return result.join('&')
}

/**
 * The builder class for [[EmbedClient]]. Contains methods for defining the properties of embedded
 * Looker content.
 */

export class EmbedBuilder<T> {
  private _handlers: CallbackStore = {}
  private _appendTo: HTMLElement | null = null
  private _classNames: string[] = []
  private _params: UrlParams
  private _url?: string | null

  /**
   * @hidden
   */

  constructor(
    private _hostSettings: EmbedHostSettings,
    private _clientConstructor: EmbedClientConstructor<T>
  ) {
    this._params = {
      embed_domain: window.location.origin,
      api_host: _hostSettings.apiHost,
    }
  }

  /**
   * Allows manual control of URL parameters for the embedded content
   *
   * @param params Additional URL parameters
   * created by ID.
   */

  withParams(params: UrlParams) {
    for (const key in params) {
      this._params[key] = params[key]
    }
    return this
  }

  /**
   * Allows specifying classes for an embedded content
   * @param className one or more sandbox attributes for an embedded content.
   */

  withClassName(...className: string[]) {
    this._classNames = this._classNames.concat(className)
    return this
  }

  withUrl(url: string) {
    this._url = url
    return this
  }

  /**
   * The element to append the embedded content to.
   */

  get el() {
    return this._appendTo || document.body
  }

  /**
   * The address of the Looker instance being used
   */

  get apiHost() {
    return this._hostSettings.apiHost
  }

  /**
   * The content URL of this embedded content, if provided
   */

  get url() {
    return this._url
  }

  /**
   * @hidden
   */

  get embedUrl() {
    const params = stringify(this._params)
    return `${this._url}?${params}`
  }

  /**
   * @hidden
   */

  get handlers() {
    return this._handlers
  }

  /**
   * The classnames to apply to the embedded content
   */

  get classNames() {
    return this._classNames
  }

  /**
   * @hidden
   */

  get clientConstructor() {
    return this._clientConstructor
  }

  /**
   * Select an element to append the embedded content to, either a content selector or
   * the DOM element.
   *
   * @param el
   */

  appendTo(el: HTMLElement | string) {
    if (typeof el === 'string') {
      this._appendTo = document.querySelector(el)
    } else {
      this._appendTo = el
    }
    return this
  }

  /**
   * Register an event handler.
   *
   * @typeparam K: A Looker embed event name
   * @param name: string Name of the event to respond to.
   * @param handler: Callback A callback method to be invoked when the message is received.
   */

  on<K extends keyof EmbedEventMap>(name: K, handler: EmbedEventMap[K]) {
    this._handlers[name] = this._handlers[name] ? this._handlers[name] : []
    this._handlers[name].push(handler)
    return this
  }

  /**
   * Constructs the embedded content, including creating the DOM element that contains the content.
   */

  build(): EmbedClient<T> {
    return new EmbedClient<T>(this)
  }
}
