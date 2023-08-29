import type { ChattyHostConnection } from '@looker/chatty'

import type {
  ConnectUserRequest,
  SetInstanceRequest,
  SetTokenRequest,
  SetVisibilityRequest,
  ViewInviteRequest,
} from './types'

/**
 * Client that communicates with an embedded Looker chat. Messages are documented
 * [here](https://docs.looker.com/r/sdk/events)
 */

export class ChatClient {
  /**
   * @hidden
   *
   * @param _host
   */
  constructor(private _host: ChattyHostConnection) {}

  /**
   * Send a message to the embedded content.
   *
   * @param message String message identifier.
   * @param params Additional parameters to be sent to the client. After transmission ownership
   * of the parameters is transferred to the embedded Explore.
   */

  send(message: string, params?: any) {
    this._host.send(message, params)
  }

  /**
   * Send a message to the embedded content and resolve with a response
   *
   * @param message String message identifier.
   * @param params Additional parameters to be sent to the client. After transmission ownership
   * of the parameters is transferred to the embedded Explore.
   */

  async sendAndReceive(message: string, params?: any) {
    return this._host.sendAndReceive(message, params)
  }

  connectUser(connectUserRequest: ConnectUserRequest) {
    this.send('chat:user:connect', connectUserRequest)
  }

  setInstance(setInstanceRequest: SetInstanceRequest) {
    this.send('chat:instance:set', setInstanceRequest)
  }

  viewInvite(viewInviteRequest: ViewInviteRequest) {
    this.send('chat:invite:view', viewInviteRequest)
  }

  setChatVisibility(setVisibilityRequest: SetVisibilityRequest) {
    this.send('chat:visibility:set', setVisibilityRequest)
  }

  setToken(setTokenRequest: SetTokenRequest) {
    this.send('chat:token:set', setTokenRequest)
  }
}
