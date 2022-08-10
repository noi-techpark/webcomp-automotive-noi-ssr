<template>
  <div
    class="select"
    :class="{
      disabled: disabled,
      'not-valid': !valid,
      fill: aspect === 'fill',
      'white-contrast': whiteContrast,
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
      @apply bg-transparent text-black text-base appearance-none;

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

  &.disabled {
    @apply pointer-events-none opacity-25;
  }
}
</style>
