import type { ChatClient } from './chatClient'

/**
 * Cookieless request init
 * Looker 22.20+
 */
export interface CookielessRequestInit extends RequestInit {
  url: string
}

/**
 * Cookieless request callback function
 * Looker 22.20+
 */

export type CookielessCallback = () => Promise<SessionData>

export interface ConnectUserRequest {
  avatar: string
  name: string
  bio: string
  token: string
  verified?: boolean
}

export interface SetInstanceRequest {
  instanceId: string
  token: string
  verified?: boolean
}

export interface ViewInviteRequest {
  code: string
}

export interface SetVisibilityRequest {
  visible: boolean
}

export interface SetTokenRequest {
  token: string
  verified?: boolean
}

export interface SessionData {
  /**
   * api token.
   */
  authToken?: string | null
  /**
   * Authentication token time to live in seconds.
   */
  authTokenTtl?: number | null
}

/**
 * Chat Layout
 *
 * Contains details of chat layout.
 */

export interface ChatLayout {
  id: string
  chat_id: string
  type: 'newspaper'
  active: boolean
  column_width: number
  width: number | null
  deleted: boolean
  chat_layout_components: ChatLayoutComponent[]
}

/**
 * Chat Layout Component
 *
 * Contains details of individual chat element layout.
 */

export interface ChatLayoutComponent {
  id: string
  chat_layout_id: string
  chat_element_id: string
  row: number
  column: number
  width: number
  height: number
  deleted: boolean
}

/**
 * Visualization Config interface
 */

export interface VisConfig {
  type: string
  [key: string]: any
}

/**
 * Element Options interface
 */

export interface ElementOptionItems {
  title?: string | null
  title_hidden?: boolean
  vis_config?: VisConfig | null
}

/**
 * Element to element options mapping interface
 */
export interface ElementOptions {
  [id: string]: ElementOptionItems
}

/**
 * A generic Looker embed event
 */

export interface LookerEmbedEvent {
  type: string

  [key: string]: any
}

/**
 * A generic Looker event detail
 */

export interface EventDetail {
  [key: string]: any
}

export type SessionTokenRequest = EventDetail

export interface SessionStatus extends EventDetail {
  /**
   * Session time to live in seconds
   */
  session_ttl: number
  /**
   * Session expired when true
   */
  expired: boolean
  /**
   * Session interrupted when true. This means new
   * tokens could not be retrieved in a timely manner.
   * Can happen if server is temporarily unavailable
   * for some reason
   */
  interrupted: boolean
  /**
   * Interrupted session can be recovered. When false
   * session cannot continue. This is most likely
   * a problem with the embedding application.
   */
  recoverable?: boolean
}

/**
 * Detailed chat data returned by chat events
 */

export interface ChatEventDetail extends EventDetail {
  id: string | number
  title: string
  canEdit: boolean
  absoluteUrl: string
  url: string
}

export interface ChatEvent extends LookerEmbedEvent {
  chat: ChatEventDetail
  /// Available on Chats Next
  status?: 'complete' | 'error' | 'stopped'
}

export interface EmbedEventMap {
  // 'chat:user:connect': (this: ChatClient, event: ChatEvent) => void
  'chat:run:start': (this: ChatClient, event: ChatEvent) => void
  'chat:run:complete': (this: ChatClient, event: ChatEvent) => void
  'chat:filters:changed': (this: ChatClient, event: ChatEvent) => void
  'chat:edit:start': (this: ChatClient, event: ChatEvent) => void
  'chat:edit:cancel': (this: ChatClient, event: ChatEvent) => void
  'chat:save:complete': (this: ChatClient, event: ChatEvent) => void
  'chat:delete:complete': (this: ChatClient, event: ChatEvent) => void

  'session:token:request': (this: ChatClient, event: SessionTokenRequest) => void
  'session:status': (this: ChatClient, event: SessionStatus) => void

  [key: string]: any
}
