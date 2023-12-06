<template>
  <div :class="['input-container', error ? 'error-border' : '']">
    <i :class="['input-icon', icon]"></i>
    <input :type="type ? type : 'text'" class="input-value" v-model="value"  required />
    <label class="input-placeholder">{{ text }}</label>
    <div class="error-validation" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: "Input",
  props: ["text", "icon", "error",'defaultValue','type'],
  data() {
    return {
      value: this.defaultValue || '',
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.$emit("update", newValue);
    },
  },
  methods: {
    clear() {
      this.value = '';
    }
  },
};
</script>

<style>
:root {
  --backgroundInput: #181818;
  --borderInput: #303030;
  --backgroundInputActive: #212121;
}
.input-value:focus ~ .input-placeholder,
.input-value:valid ~ .input-placeholder {
  top: 2px !important;
  left: 45px !important;
  background: transparent;
  z-index: 1;
  font-size: 10px;
}
.input-value:focus {
  background: var(--backgroundInputActive);
}
.input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--navTextColor);
  background: var(--backgroundInput);
  width: fit-content;
  border-radius: 4px;
  position: relative;
  margin-top: 20px;
}

.input-icon {
  width: 32px;
  height: 37px;
  font-size: 18px;
  border: 1px solid var(--borderInput);
  border-right: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 0 0 4px;
}

.input-value {
  height: 32px;
  background: transparent;
  border: 1px solid var(--borderInput);
  outline: none;
  color: var(--mobileMenuColor);
  font-size: 14px;
  padding: 5px 0 0 5px;
  border-radius: 0 4px 4px 0;
}

.input-placeholder {
  position: absolute;
  left: 40px;
  top: 12px;
  color: #6b6868;
  font-size: 13px;
  transition: 0.2s;
  pointer-events: none;
}

.error-validation {
  position: absolute;
  font-size: 10px;
  bottom: -13px;
  left: 5px;
  color: rgba(210, 5, 5, 0.99);
}

.error-border .input-icon,
.error-border .input-value {
  border: 1px solid rgba(255, 0, 0, 0.45);
  /*box-shadow: 0px 0px 1px 1px rgb(210 5 5 / 75%);*/
}
</style>
