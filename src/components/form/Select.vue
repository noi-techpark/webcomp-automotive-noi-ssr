<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="select"
    :class="{
      disabled: disabled,
      'not-valid': !valid,
      fill: aspect === 'fill',
      'white-contrast': whiteContrast,
      primary: primary,
      'centered-text': centeredText,
    }"
  >
    <InputLabel v-if="label" :text="label" :required="required" />
    <div class="selector">
      {{ prefix ? prefix : '' }}
      <select :id="label" v-model="selected" :aria-label="ariaLabel || label" aria-controls="actorsList" :required="required" :class="{'placeholder': selected == ''}">
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.name }}
          <!-- Display the number of companies this filter applies to. -->
          {{
            filterCount && // check wether filterCount is defined/not null
            (!selected || selected === option.value) && // if a filter is applied, only display a count for the selected one
            (filterCount[option.value] || filterCount[option.value] === 0) // don't display a count for "Select..."
              ? '(' + filterCount[option.value] + ')'
              : ''
          }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    ariaLabel: {
      type: String,
      default: '',
    },

    ariaControls: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
    filterCount: {
      type: Object,
      required: false,
      default: undefined
    },
    prefix: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    aspect: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'fill'].includes(value)
      },
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
    whiteContrast: {
      type: Boolean,
      default: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    centeredText: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selected: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>

<style lang="postcss" scoped>
.select {
  & label {
    @apply block text-sm text-black mb-1;
  }

  & .selector {
    @apply inline-block bg-input px-4 rounded-lg text-base cursor-pointer;

    padding-top: 0.6rem;
    padding-bottom: 0.6rem;

    & select {
      @apply text-inherit text-base appearance-none border-0 p-0;

      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><path d='m 3.562255,158.69404 3.6,-5.2 c 6.4,-9.1 18.9,-11.4 28.1,-5 l 214.699995,149.7 214.7,-149.6 c 9.1,-6.4 21.7,-4.1 28.1,5 l 3.6,5.2 c 6.4,9.1 4.1,21.7 -5,28.1 l -241.4,168.2 -241.399995,-168.3 c -9.10000002,-6.4 -11.3,-18.9 -5,-28.1 z' /></svg>");
      background-color: transparent;
      background-position: 98% center;
      background-size: 18px auto;
      background-repeat: no-repeat;


      &:focus {
        background-color: color-mix(in srgb, var(--primary-color) 25%, theme('colors.secondary'));
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><path d='m 3.5880746,196.40172 3.6,5.2 c 6.4000004,9.1 18.9000004,11.4 28.1000004,5 L 249.98807,56.901718 l 214.7,149.600002 c 9.1,6.4 21.7,4.1 28.1,-5 l 3.6,-5.2 c 6.4,-9.1 4.1,-21.7 -5,-28.1 L 249.98807,0.00171832 8.5880746,168.30172 c -9.09999999,6.4 -11.3,18.9 -5,28.1 z' /></svg>");
        background-position: 98% 75%;
      }

      &.placeholder {
        @apply text-black text-opacity-60;
      }
    }
  }

  &.not-valid {
    & .selector {
      @apply bg-light-red;
    }
  }

  &.fill {
    & .selector {
      @apply block;

      & select {
        @apply w-full;
      }
    }
  }

  &.white-contrast {
    & .selector {
      @apply bg-white;
    }
  }

  &.centered-text {
    & .selector {
      & select {
        @apply text-center;
      }
    }
  }

  &.primary {
    & .selector {
      background-color: var(--primary-color);
      color: var(--primary-color-text);
    }

    &:hover, &:focus {
      background-color: var(--primary-hover);
    }
  }

  &.disabled {
    @apply pointer-events-none opacity-25;
  }
}
</style>
