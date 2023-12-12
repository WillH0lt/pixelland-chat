import { EventEmitter } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'

interface Events {
  'chat:close': void
  'chat:instance:edit': string
  'chat:instance:click': string
  'chat:verify:request': void
  'chat:login:request': void
  'chat:user:edit': void
  'chat:image:request': void
}

export const emitter: StrictEventEmitter<EventEmitter, Events> = new EventEmitter()
