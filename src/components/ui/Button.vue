<script>
export default {
  name: 'UIButton',
  props: {
    userLabel: {
      type: String,
      required: true,
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
  <button type="button" class="c-Button" @click="emitClick">
    {{ userLabel }}
  </button>
</template>

<style lang="scss" scoped></style>
