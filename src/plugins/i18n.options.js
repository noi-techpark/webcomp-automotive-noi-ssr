// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const AVAILABLE_LANGUAGES = ['en', 'de', 'it'];

export default {
    locales: AVAILABLE_LANGUAGES,
    strategy: 'prefix_and_default',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: AVAILABLE_LANGUAGES.reduce(
        (obj, key) => ({
          ...obj,
          [key]: require('../locales/' + key + '.json'),
        }),
        {}
      ),
    },
};
