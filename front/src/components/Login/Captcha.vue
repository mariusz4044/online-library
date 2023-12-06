<template>
  <div id="captcha" v-html="svg"></div>
</template>

<script>
export default {
  name: "Captcha",
  data() {
    return {
      svg: `<div class="captcha-loader"><i class="fa-solid fa-spinner"></i></div>`,
    };
  },
  created() {
    this.loadCaptcha();
  },
  methods: {
    async loadCaptcha() {
      const res = await fetch(`${this.$domain}/user/captcha`, {
        method : "GET",
        withCredentials: true,
        credentials: "include",
      });

      this.svg = await res.text();
    },
  },
};
</script>

<style>
#captcha {
  width: 208px;
  background-color: var(--backgroundInput);
  height: 80px;
  margin-top: 20px;
  border: 1px solid var(--borderInput);
  border-radius: 4px;
}

.captcha-loader i {
  animation: spin 1s linear infinite;
}

.captcha-loader {
  color: #545454;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
