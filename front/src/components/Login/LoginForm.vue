<template>
  <div className="flex f-center-w f-col">
    <div id="register-container" className="flex f-center-w f-col size-50">
      <b className="title">Logowanie</b>
      <Input text="Podaj login" icon="fa-solid fa-pencil" @update="this.login = $event"></Input>
      <Input text="Podaj hasło" icon="fa-solid fa-key" type='password' @update="this.password = $event"></Input>
      <Captcha ref="captchaElement"></Captcha>
      <Input text="Podaj kod captcha" icon="fa-solid fa-robot" @update="this.captcha = $event"></Input>
      <button className="btn-classic flex f-center-h f-row"  @click="send">
        <div className="btn-txt">Zaloguj</div>
      </button>
    </div>

    <teleport to="#content">
      <div id="blur"></div>
    </teleport>

  </div>
</template>

<script>
import Input from "@/components/HtmlElements/Input";
import Captcha from "@/components/Login/Captcha";

export default {
  components: {
    Captcha,
    Input,
  },
  props: ['user'],
  data() {
    return {
        login: ``,
        password: ``,
        captcha: ``
    }
  },
  methods: {
    async send() {
      if(!this.login || !this.password || !this.captcha) {
        return this.$alert("Uzupełnij puste pola!",'error',false,4000)
      };

      const res = await this.$send('/user/login',{
        login: this.login,
        password: this.password,
        captcha: this.captcha
      });

      if (res.error){
        return this.$refs.captchaElement.loadCaptcha();
      }

      this.$user.info = res;

      localStorage.setItem('is_login','1');
      this.$router.push({ path: '/' });
      await this.$sleep(100);
      location.reload();
    }
  },
}
</script>

<style src="./style.css"></style>