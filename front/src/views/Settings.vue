<template>
  <div class="config-content">
    <SettingsWindow class="config-box">
      <template v-slot:title><b>Informacje Główne <i class="fas fa-copy"></i></b> </template>
      <template v-slot:content>
        <div class="flex-between"><label>Nick</label> <label>{{this.$user.info.nick}}</label></div>
        <div class="flex-between"><label>Login</label> <label>{{this.$user.info.login}}</label></div>
        <div class="flex-between"><label>Ranga</label> <label>{{this.$user.info.rank}}</label></div>
        <div class="flex-between"><label>UerID</label> <label>{{this.$user.info.userID}}</label></div>
      </template>
    </SettingsWindow>

    <SettingsWindow class="config-box last-element-config">
      <template v-slot:title><b>Zmiana hasła <i class="fa-solid fa-key"></i></b> </template>
      <template v-slot:content>
        <Input icon="fa-solid fa-unlock" text="Stare hasło" type='password' ref="passElement" @update="passwordOld = $event" ></Input>
        <Input icon="fa-solid fa-lock" text="Nowego hasło" type='password' ref="passElement1" @update="password = $event"></Input>
        <Input icon="fa-solid fa-lock" text="Nowego hasło" type='password'  ref="passElement2" @update="password2 = $event">></Input>
        <button class="btn-classic" @click="this.changePass()">Wyślij</button>
      </template>
    </SettingsWindow>


    <SettingsWindow class="config-box">
      <template v-slot:title><b>Zmiana zdjęcia <i class="fa-solid fa-user-plus"></i></b> </template>
      <template v-slot:content>
        <UploadImage @update="this.avatar = $event"></UploadImage>
        <button class="btn-classic" @click="sendAvatar">Wyślij</button>
      </template>
    </SettingsWindow>

  </div>
</template>

<script>
import SettingsWindow from "@/components/HtmlElements/SettingsWindow";
import Input from "@/components/HtmlElements/Input";
import DropDownMenu from "@/components/HtmlElements/DropDownMenu";
import UploadImage from "@/components/HtmlElements/UploadImage";


export default {
  name: "Settings",
  components: {SettingsWindow,Input,DropDownMenu,UploadImage},
  data() {
    return {
      password: '',
      passwordOld: '',
      password2: '',
      avatar: '',
    }
  },
  methods: {
    async changePass() {
      if(!this.passwordOld || !this.password2 || !this.password){
        return this.$alert('Uzupełnij wszystkie pola!','error');
      }

      if(this.password.length < 6) {
        return this.$alert('Hasło powinno mieć wiecej niż 6 znaków!','error');
      }


      if(this.password != this.password2) {
        this.$refs.passElement2.clear();
        this.$refs.passElement1.clear();
        return this.$alert(`Nowe hasła są różne!`,'error');
      }

      const res = await this.$send('/user/changePass',{
        oldPassword: this.passwordOld,
        password: this.password.toString(),
      })

      this.$refs.passElement2.clear();
      this.$refs.passElement1.clear();
      this.$refs.passElement.clear();

      if(res.error) return;

      return this.$alert(`Pomyślnie zmieniono hasło!`,'success');
    },
    async isBase64UrlImage(base64String) {
      let image = new Image()
      image.src = base64String
      return await (new Promise((resolve)=>{
        image.onload = function () {
          if (image.height === 0 || image.width === 0) {
            resolve(false);
            return;
          }
          resolve(true)
        }
        image.onerror = () =>{
          resolve(false)
        }
      }))
    },
    async sendAvatar(e){
     if(!this.avatar) {
       return this.$alert(`Wrzuć zdjęcie przed wysłaniem!`,'error');
     };

     if(!this.avatar.startsWith('data:image/png') || this.avatar.startsWith('data:image/jpg')) {
       return this.$alert(`Dozwolony format to JPG oraz PNG!`,'error');
     }

     const valid = await this.isBase64UrlImage(this.avatar);

     if(!valid) {
       return this.$alert(`Wgrany obraz jest niepoprawny!`,'error');
     }

      const res = await this.$send('/user/avatar',{
        avatar: this.avatar,
      })
    }
  },
}
</script>

<style scoped>

.btn-classic {
  position: relative;
  margin-top: 30px;
  width: 80%;
}

.drop-menu-widthdraw .dropdown{
  width: 200px;
}

.last-element-config {
  margin-bottom: 70px !important;
}

.config-box button {
  height: 35px;
  margin-bottom: -15px;
  background-color: #383838;
  box-shadow: inset 0 -3px 0 0 #2a2a2a;
}
.config-box i {
  margin-left: 2px;
}

.config-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.config-box {
  position: relative;
  margin-bottom: 30px;
  top: 40px !important;
  z-index: auto !important;
  background: var(--darkBlack15);
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
  z-index: 2;
  box-shadow: 0 0 14px 3px #141414;
}
.flex-between {
  display: flex;
  font-size: 13px;
  width: 100%;
  justify-content: space-between;
  padding: 5px 0;
}

.config-box b {
  margin-bottom: 20px;
  border-bottom: 1px solid #505050;
  width: 100%;
  padding-bottom:12px;
}
</style>