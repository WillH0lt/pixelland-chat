import { acceptHMRUpdate, defineStore } from 'pinia'

import { DialogOptions, initDialogOptions } from '@/types/DialogOptions'

export const useDialogStore = defineStore({
  id: 'dialog',
  state: () => ({
    options: initDialogOptions(),
    visible: false,
  }),
  actions: {
    showDialog(dialogOptions: Partial<DialogOptions>) {
      this.options = initDialogOptions(dialogOptions)
      this.visible = true
    },
    hideDialog() {
      this.visible = false
      this.$reset()
    },
  },
})
