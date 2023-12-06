<template>
  <div class="window-box" v-if="showWindow">
    <div class="close-window" @click="$emit('closeWindow')">
      <i class="fa-solid fa-x"></i>
    </div>
    <slot name="title" ></slot>
    <slot name="content"></slot>
  </div>

  <teleport to="#content">
    <div id="blur"></div>
  </teleport>

</template>

<script>
export default {
  name: "window",
  emits: ['closeWindow'],
  data() {
    return {
      showWindow: true
    }
  },
}
</script>

<style>
 .window-box {
   display: flex;
   flex-direction: column;
   align-items: center;
   border-radius: 8px;
   background: var(--window);
   width: 250px;
   padding: 30px;
   left: calc(50% - 150px);
   top: calc(50vh - 250px);
   border: 1px solid #2e2e2e;
   position: absolute;
   z-index: 2;
   box-shadow: 0px 0px 14px 3px rgb(20 20 20);
 }

 .close-window {
   position: absolute;
   right: 20px;
   top: 10px;
   cursor: pointer;
 }

</style>