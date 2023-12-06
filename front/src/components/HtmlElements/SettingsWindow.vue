<template>
  <div class="window-box">
    <slot name="title" ></slot>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: "SettingsWindow"
}
</script>

<style scoped>
</style>