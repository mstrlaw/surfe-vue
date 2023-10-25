<script>
export default {
  name: 'UIButton',
  props: {
    userLabel: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    variation: {
      type: String,
      default: 'secondary',
      validator(value) {
        return ['primary', 'secondary'].includes(value)
      }
    },
  },
  computed: {
    buttonClass() {
      return this.variation === 'primary'
        ? 'c-Button--isPrimary'
        : 'c-Button--isSecondary'
    },
  },
  methods: {
    emitClick() {
      this.$emit('on-click')
    },
  },
}
</script>

<template>
  <button type="button" :class="['c-Button', buttonClass]" :title="title" @click="emitClick">
    {{ userLabel }}
  </button>
</template>

<style lang="scss" scoped>
.c-Button {
  @include transition(box-shadow);
  -webkit-appearance: button;
  background-color: var(--c-blue-light); // Default bg
  border-radius: var(--base-radius);
  background-image: none;
  font-family: inherit;
  color: inherit;
  padding-left: 1rem;
  font-weight: 600;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-color: transparent;
  height: calc(var(--base-gap) * 3);
  min-width: calc(var(--base-gap) * 3.2);
  box-shadow: 0px 0px 0px 0px var(--c-horizon-300);
  outline-color: var(--c-horizon-300);

  &:hover {
    @include transition(box-shadow);
    cursor: pointer;
    box-shadow: 2px 2px 0px 0px var(--c-horizon-300);
  }

  &--isPrimary {
    background-color: var(--c-seaweed-100);
    color: var(--c-blue-light);
  }
  &--isSecondary {
    background-color: var(--c-blue-light);
  }
}
</style>
