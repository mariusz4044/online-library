<template>
  <div className="flex f-center-w f-col">
    <div id="register-container" className="flex f-center-w f-col size-50">
      <b className="title">Rejestracja</b>
      <Input
        text="Podaj nazwę użytkownika"
        icon="fa-solid fa-user-pen"
        :error="inputs.nick.error"
        @update="inputs.nick.value = $event"
      ></Input>
      <Input
        text="Podaj login"
        icon="fa-solid fa-pencil"
        :error="inputs.login.error"
        @update="inputs.login.value = $event"
      ></Input>
      <Input
        text="Podaj hasło"
        icon="fa-solid fa-key"
        type='password'
        :error="inputs.password.error"
        @update="inputs.password.value = $event"
      ></Input>
      <Input
        text="Podaj email"
        icon="fa-solid fa-envelope"
        :error="inputs.email.error"
        @update="inputs.email.value = $event"
      ></Input>
      <Captcha ref="captchaElement"></Captcha>
      <Input
        text="Podaj kod captcha"
        icon="fa-solid fa-robot"
        :error="inputs.captcha.error"
        @update="inputs.captcha.value = $event"
      ></Input>
      <div id="rules">Akceptuję regulamin strony.</div>

      <button className="btn-classic flex f-center-h f-row" @click="send($event)" :disabled="this.blockButton">
        <div v-if='!blockButton' className="btn-txt">Zarejestruj</div>
        <div v-else class="captcha-loader"><i class="fa-solid fa-spinner"></i></div>
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
    Input,
    Captcha,
  },
  data() {
    return {
      blockButton: false,
      inputs: {
        nick: {
          value: ``,
        },
        login: {
          value: ``,
        },
        password: {
          value: ``,
        },
        email: {
          value: ``,
        },
        captcha: {
          value: ``,
        },
      },
    };
  },
  methods: {
    resetInputErrors() {
      for (let i in this.inputs) {
        delete this.inputs[i].error;
      }
    },

    parseToBody() {
      let temp = {};
      for(let i in this.inputs){
        temp[i] = this.inputs[i].value;
      }
      return temp;
    },

    validInputs() {
      this.resetInputErrors();

      let valid = true;
      for (let i in this.inputs) {
        if (!this.inputs[i].value) {
          console.log(i)
          return this.$alert('Uzupełnij wszystkie pola!','error');
          valid = false;
        }
      }
      return valid;
    },

    blockButtons() {
      this.blockButton = true;
      setTimeout(()=>{
        this.blockButton=false;
      },1000);
    },

    async send(event) {
      console.log(event)
      const valid = this.validInputs();
      if (!valid) return;

      const res = await this.$send('/user/register',{...this.parseToBody()});

      this.blockButtons();

      if(res.error) {
        return this.$refs.captchaElement.loadCaptcha();
      }

      this.$user.info = res;

      localStorage.setItem('is_login','1');
      this.$router.push({ path: '/login' });
      await this.$sleep(500);
    },
  },
};
</script>

<style src="./style.css"></style>
