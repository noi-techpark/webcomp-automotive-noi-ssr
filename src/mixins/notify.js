// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default {
  methods: {
    notifyGenericError() {
      this.notifyError(this.$t('common.genericError'))
    },

    notifySavedChanges() {
      this.notifySuccess(this.$t('common.settingsSaved'))
    },

    /**
     * possible types are: info, warn, error, success
     */
    notify(message, type) {
      switch(type) {
        case 'info':
          this.notifyInfo(message)
          break
        case 'warn':
          this.notifyWarn(message)
          break
        case 'warning':
          this.notifyWarn(message)
          break
        case 'error':
          this.notifyError(message)
          break
        case 'success':
          this.notifySuccess(message)
          break
      }
    },

    notifyInfo(message) {
      this.$notify({
        group: 'main',
        text: message,
        duration: 5000,
        type: 'info',
      })
    },

    notifyWarn(message) {
      this.$notify({
        group: 'main',
        text: message,
        duration: 5000,
        type: 'warn',
      })
    },

    notifyError(message) {
      this.$notify({
        group: 'main',
        text: message,
        duration: 5000,
        type: 'error',
      })
    },

    notifySuccess(message) {
      this.$notify({
        group: 'main',
        text: message,
        duration: 3000,
        type: 'success',
      })
    },
  },
}
