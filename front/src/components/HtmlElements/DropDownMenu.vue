<template>
  <div class="dropdown">
    <button class="dropbtn">
      <label class="drop-icon-box"><i :class="['dropdown-icon',icon]"></i></label>
      <div class="wallet-name">{{walletName}}</div>
      <i class="fa-solid fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <div class="dropdown-item"
           v-for="(item,index) in list"
           @click="this.currentItem = index"
           :class="{
             'dropdown-item-space':this.itemExist(item),
             'dropdown-item-center':!this.itemExist(item),
           }"
      >
        <label v-if="type==='filter'">Sortuj {{ index }}</label>
        <label v-else>{{ index }}</label>
        <div class="" v-if="type==='filter'" v-html="item"></div>
        <div class="" v-else>{{item}}</div>
      </div>
      <div class="dropdown-item dropdown-item-center no-options" v-if="!this.list || Object.values(this.list).length ==0">Wybierz opcję</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropDownMenu",
  emits: ['changeForm'],
  props: ['list','icon','blockClick','selectedItem','type'],
  data() {
    return {
      currentItem: this.selectedItem,
      selectItem: this.list[this.currentItem],
    }
  },
  computed: {
    walletName() {
      if(!this.currentItem && !this.selectItem) {
        return `Wybierz opcję`;
      }

      if(!this.currentItem && this.selectItem) return Object.keys(this.selectItem)[0];

      return this.currentItem;
    },
  },
  methods: {
    itemExist(item) {
      if(typeof item == "undefined") return false;
      return true;
    }
  },
  watch: {
    currentItem(newValue) {
      this.$emit('changeForm',this.currentItem);
    }
  },
}
</script>

<style>

.no-options {
  color: #727272 !important;
  font-size: 10px !important;
  cursor: default !important;
}

.drop-icon-box i {
  display: block !important;
}

.fa-caret-down{
  display: block !important;
}

.dropdown-icon {
  position: absolute;
  padding: 2px;
}

.drop-icon-box {
  position: relative;
  height: 100%;
}

.dropdown-item-space {
  justify-content: space-between;
}

.dropdown-item-center {
  justify-content: center;
}

.dropdown-item-center {
  width: auto !important;
}

.dropdown-item {
  display: flex;
  color: #ccc;
  padding: 5px 10px;
  text-decoration: none;
  cursor: pointer;
  font-size: 13px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown:hover>.dropdown-content {
  display: block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--darkBlack15);
  min-width: 148px;
  width: calc(100% - 2px);
  box-shadow: 0 8px 16px 0 rgb(0 0 0 / 20%);
  border: 1px solid var(--borderInput);
  border-top: none;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  z-index: 5;
}

.dropdown-item:hover{
  background: var(--darkBlack20);
}

.dropbtn {
  display: flex;
  background-color: var(--backgroundInput);
  color: #cccccc;
  padding: 5px;
  font-size: 15px;
  border: none;
  width: 100%;
  height: 100%;
  border: 1px solid var(--borderInput);
  border-radius: 4px;
  justify-content: space-between;
  cursor: pointer;
}

</style>