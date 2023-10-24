<script>
export default {
  name: 'UILoader',
}
</script>

<template>
  <div class="c-Loader">
    <div class="c-Loader__waves" v-html="'&nbsp;&nbsp;🏄'" />
  </div>
</template>

<style lang="scss" scoped>
// Taken from https://css-loaders.com/nature/
.c-Loader {
  color: var(--c-black);
  &__waves {
    animation: waves 1s infinite linear;
    background: radial-gradient(circle 11px at top, #0000 94%, #b0e5f3) 0 20px,
      radial-gradient(circle 11px at top, #0000 94%, #5dc1e4) 0 10px,
      radial-gradient(circle 11px at top, #0000 94%, #008cd9) 0 0;
    background-repeat: repeat-x;
    background-size: 20px 100%;
    font-size: 1.8em;
    height: 40px;
    line-height: 0.5em;
    width: 80px;
  }
}
@keyframes waves {
  50% {
    background-position: 10px 15px, -10px 12px, 15px 8px;
  }
  100% {
    background-position: 20px 20px, -20px 10px, 20px 0px
  }
}
</style>
