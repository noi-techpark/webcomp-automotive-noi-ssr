<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
    <div style="height: 100vh; overflow: hidden">
      <WebComponent website-mode="true" :default-company="(isNumber($router?.params?.companyName) ? $router?.params?.companyName :  decodeURI($router?.params?.companyName))" @changeTitle="changeTitle"/>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tabTitle: (this.pageTitle ? decodeURI(this.pageTitle) + ' - ' : '') + 'NOI Automotive Automation - test',
        TITLE_END: ' - NOI Automotive Automation',
      }
    },
    head() {
      return {
        title: this.tabTitle,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.$t('home.meta.description'),
          },
        ],
      }
    },
    computed: {
      pageTitle() {
        return this.$router?.params?.companyName;
      }
    },
    methods: {
      changeTitle(newTitle) {
        this.tabTitle = newTitle.substring(0, 60 - this.TITLE_END.length) + this.TITLE_END;
      }
    },
  }
  </script>
  