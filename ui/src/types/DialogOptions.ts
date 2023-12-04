export interface DialogButton {
  text: string
  onClicked?: () => void
  loading?: boolean
}

export function initDialogButton(options?: Partial<DialogButton>): DialogButton {
  const defaults = {
    text: '',
    onClicked: () => {},
    loading: false,
  }

  return {
    ...defaults,
    ...options,
  }
}

export interface DialogOptions {
  title: string
  text: string
  subtext: string
  buttons: DialogButton[]
  animateText: boolean
  showTextInput?: boolean
  inputText?: string
  inputPlaceholder?: string
}

export function initDialogOptions(options?: Partial<DialogOptions>): DialogOptions {
  if (options?.buttons) {
    options.buttons = options.buttons.map(button => initDialogButton(button))
  }

  const defaults = {
    text: '',
    title: '',
    subtext: '',
    buttons: [],
    animateText: false,
    showTextInput: false,
  }

  return {
    ...defaults,
    ...options,
  }
}
