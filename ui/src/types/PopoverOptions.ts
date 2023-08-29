import { SIDE } from '@/types/SideEnum'

export interface PopoverOptions {
  side: SIDE
  anchor: SIDE
  element: HTMLElement
}

export function initPopoverOptions(options?: Partial<PopoverOptions>): PopoverOptions {
  const defaults = {
    side: SIDE.BOTTOM,
    anchor: SIDE.LEFT,
    element: document.body as HTMLElement,
  }

  return {
    ...defaults,
    ...options,
  }
}
