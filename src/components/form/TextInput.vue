<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="text-input"
    :class="{
      disabled,
      fill: aspect === 'fill',
      'external-background': externalBackground,
      'not-valid': !valid,
      'inverted-colorscheme': invertedColorscheme,
      searchbar: type === 'search'
    }"
  >
    <InputLabel v-if="label" :text="label" :required="required" />
    <input
      :id="type === 'search' ? 'searchbar' : ''"
      ref="input"
      :role="type === 'search' ? 'searchbox' : ''"
      :aria-label="type === 'search' ? 'insert key words to search for companies' : ''"
      :aria-keyshortcuts="type === 'search' ? 'Control+K' : ''"
      :aria-controls="type === 'search' ? 'actorsList' : ''"
      :tabindex="type === 'search' ? 1 : '0'"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :value="value"
      :required="required"
      :disabled="disabled"
      @keypress="keypress($event)"
      @input="updateValue($event.target.value)"
      @blur="onBlur($event.target.value)"
    />
    <InputDescription v-if="description" :text="description" />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator(value) {
        return [
          'text',
          'number',
          'tel',
          'email',
          'search',
          'password',
          'hidden',
        ].includes(value)
      },
    },
    aspect: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'fill'].includes(value)
      },
    },
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    invertedColorscheme: {
      type: Boolean,
      default: false,
    },
    externalBackground: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },

    focus() {
      this.$refs.input.focus()
    },

    keypress(event) {
      switch (event.keyCode) {
        case 13:
          this.$emit('onEnter')
          break
      }
    },

    onBlur(value) {
      this.$emit('blur', value)
    },
  },
}
</script>

<style lang="postcss" scoped>
.text-input {
  & input {
    @apply text-base px-5 bg-transparent resize-none text-black font-medium;

    width: 300px;
    padding-top: 10px;
    padding-bottom: 10px;
    border: var(--primary-color) solid 3px;
    border-radius: 40px;

    &:focus {
      @apply outline-none;
    }
  }

  &.searchbar {
    @apply bg-no-repeat bg-input backdrop-blur;
    background-color: rgba(242, 242, 242, 0.8);

    padding-right: 50px;
    background-image: url(~assets/icon/search.svg?inline);
    background-position: calc(100% - 20px) center;
    background-size: 18px auto;
  }

  &.external-background {
    @apply opacity-80;

    & input {
      @apply border-none;
    }
  }

  &.fill {
    & input {
      @apply w-full;
    }
  }

  &.inverted-colorscheme {
    & input {
      @apply bg-white;
    }
  }

  &.not-valid {
    & input {
      @apply bg-light-red;

      &:focus {
        @apply bg-light-red-focus;
      }
    }
  }

  &.disabled {
    @apply pointer-events-none opacity-25;
  }
}
</style>
