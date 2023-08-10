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
      <select v-model="selected" :required="required">
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
      @apply bg-transparent text-inherit text-base appearance-none border-0 p-0;

      &:focus {
        @apply outline-none;
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

    & .selector:hover {
      background-color: var(--primary-hover); 
    }
  }

  &.disabled {
    @apply pointer-events-none opacity-25;
  }
}
</style>
