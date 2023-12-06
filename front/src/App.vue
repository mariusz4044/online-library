<template>
  <div id="nav">
    <div id="logo"><b>Logo</b></div>
    <div id="avatar-box" >
      <img :src="avatar(this.$user.info.avatar)" alt="user avatar" />
      <div id="nick-name" >Witaj, {{ this.$user.info.nick }}</div>
    </div>
    <div id="routers">
      <div
          v-for="cat in this.categories"
          :key="'cat-' + cat"
          class="router-cat"
      >
        <div class="cat-bold">{{ cat }}</div>

        <div
            v-for="(value, key) in findItemsInCat(cat)"
            :key="key"
            class="router-item"
        >
          <router-link :to="{ path: key }" v-if="value.login ? this.isLogin : true">
            <i :class="{ [value.icon]: true }"></i>
            <span>{{ value.name }}</span>
          </router-link>
        </div>
      </div>

      <!--      <Traslate></Traslate>-->
      <!--      -->
      <div id="down-nav-menu" class="flex f-center-h" v-if="!this.isLogin">
        <button
            class="btn-classic size-30 router-btn"
            id="btn-login"
            @click="this.$router.push({ path: '/login' })"
        >
          <i class="fa-solid fa-right-to-bracket"></i>
          <div class="btn-txt">Logowanie</div>
        </button>

        <button
            class="btn-classic size-30 router-btn btn-gray"
            id="btn-register"
            @click="this.$router.push({ path: '/register' })"
        >
          <i class="fa-solid fa-plus"></i>
          <div class="btn-txt">Rejestracja</div>
        </button>
      </div>
    </div>
  </div>

  <div id="content">
    <router-view/>
  </div>

  <ProfileView v-if="this.$profile.name" @closeWindow="this.$profile.name = false"></ProfileView>
</template>


<script>
const routers_ = {
  "/": {
    name: "Strona głowna",
    category: "Kategorie Główne",
    icon: "fa-solid fa-house-user",
  },
  "/fav": {
    name: "Ulubione",
    category: "Zapisane",
    icon: "fa-solid fa-heart",
    login:1,
  },
  "/reports": {
    name: "Zgłoszenia",
    category: "Zgłoszenia",
    icon: "fa-solid fa-flag",
    login:1,
  },
  "/profile": {
    name: "Profil",
    category: "Konto",
    icon: "fa-solid fa-address-card",
    login:1,
  },
  "/settings": {
    name: "Ustawienia konta",
    category: "Konto",
    icon: "fa-solid fa-gears",
    login:1
  },
  "/logOut": {
    name: "Wyloguj się",
    category: "Konto",
    icon: "fa-solid fa-gears",
    login:1
  },
};

import ProfileView from "@/components/Profile/ProfileView";
export default {
  name: "App",
  emits: ['viewProfile','closeWindow'],
  components: {ProfileView},
  data() {
    return {
      nickname: this.$user.info.nick,
      isLogin: false,
      isLoading: false,
      routers: routers_,
    };
  },
  computed: {
    categories() {
      const uniqueCategories = [];
      Object.values(this.routers).forEach((el,index) => {
        if (!uniqueCategories.includes(el.category)) {
          if(el.login) {
            if(this.isLogin) uniqueCategories.push(el.category);
          }else{
            uniqueCategories.push(el.category);
          }
        }
      });
      return uniqueCategories;
    },
  },
  created() {
    this.getSession();
  },
  methods: {
    findItemsInCat(nameCat) {
      const items = {};
      for (let i in this.routers) {
        let item = this.routers[i];
        if (item.category === nameCat) {
          items[i] = item;
        }
      }
      return items;
    },
    async getSession() {
      if(!localStorage.getItem('is_login')) {
        return this.isLoading = true;
      }

      const res = await this.$send('/user/session',null,"GET");

      if(res.error) {
        this.isLogin = false;
        localStorage.removeItem('is_login')
      }

      this.isLogin = true;
      this.$user.info = res;
    }
  },
}

</script>


<style>

:root {
  --navTextColor: #ededed;
  --categoryColor: #a1a1a1;
  --darkBlack10: rgba(38, 37, 37, 0.98);
  --darkBlack15: #1c1c1c;
  --darkBlack20: #212121;
  --darkBlack25: #252525;
  --darkBlack30: #2b2b2b;
  --tipMobileColor: #484848;
  --activeRouter: rgba(197, 158, 88, 0.5);
  --mobileMenuColor: #aaaaaa;
  --bodyColor: #1a1a1a;
  --window: #1e1d1d;
  --windowBorder: 2px solid #2f2f2f;
  --classicBtnBackground: rgb(62 50 30);
  --registerBtnBackground: #3f3e3e;
  --boldTextOrange: rgba(255, 126, 0, 1);
  --betBox: #1a1a1a;
  --walletSmallColor: #7e7e7e;
  /*Buttons*/
  --greenButtonBg: #109d00;
  --greenButtonShadow: inset 0 -3px 0 0 #016c2b;
  --grayButtonBg: #383838;
  --grayButtonShadow:inset 0 -3px 0 0 #2a2a2a;
  --bgBook: #1c1c1c;
  --hiddenText: #575757;
  --darkLittleShadow: inset 0 0 5px 0 #161616;
  --darkLittleShadowOutSide: 0 0 5px 0 #161616;
}


/*Alerts style fix*/
.swal2-popup.swal2-toast.swal2-show{
  display: flex !important;
  flex-direction: row;
  box-shadow: none;
}

.swal2-container {
  color: #cccccc !important;
}
/**/

#app {
  display: flex;
}

.btn-classic {
  width: auto;
  height: 40px;
  display: flex;
  position: relative;
  border-radius: 8px;
  color: #cccccc;
  border: none;
  transition: all 250ms;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
}

.btn-classic:active {
  transform: scale(0.95);
}

#btn-login {
  background: var(--greenButtonBg);
  box-shadow: var(--greenButtonShadow);
}

#content {
  background: var(--darkBlack20);
  width: calc(100%);
  margin: 10px;
  border-radius: 8px;
  position: relative;
  max-height: calc(100vh - 20px);
  overflow-y: auto;
  color: #c5c5c5;
}

/*Main Css Selection*/

.flex {
  display: flex;
}

.box-90 {
  width: 90%;
}

.l-5 {
  position: relative;
  left: 5%;
}

.f-center-w {
  /*center items from width.*/
  align-items: center;
}

.f-center-h {
  /*center items from height.*/
  justify-content: center;
}

.f-col {
  flex-direction: column;
}
.f-row {
  flex-direction: row;
}
.size-90 {
  width: 90%;
}
.size-50 {
  width: 50%;
}
.size-40 {
  width: 50%;
}
.size-25 {
  width: 25%;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #1f1f1f;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #4b4b4b;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

#down-nav-menu {
  position: absolute;
  width: 100%;
  bottom: 20px;
  grid-gap: 5px;
}
.router-btn {
  margin: 10px 5px 0 0;
}
.cat-bold {
  color: var(--categoryColor) !important;
  font-size: 0.9rem;
  position: relative;
  width: 90%;
  padding: 5px;
  text-align: left;
  margin-left: 10px;
  user-select: none;
}


.btn-gray {
  background-color: var(--grayButtonBg);
  box-shadow: var(--grayButtonShadow);
}

.router-link-active {
  border-left: 2px solid var(--activeRouter);
  background-color: var(--darkBlack15);
}
.router-item a {
  color: var(--navTextColor);
  text-decoration: none;
  text-align: left;
  position: relative;
  padding: 5px;
  display: grid;
  grid-template-columns: 20% 80%;
}
.router-item:hover {
  background-color: var(--darkBlack15);
}
.router-item a i {
  text-align: center;
}
.router-item {
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}
#routers {
  position: relative;
  top: 50px;
  left: 2%;
  width: 95%;
  height: calc(100vh - 210px);
  background-color: var(--darkBlack20);
  border-radius: 4px;
  border: 1px solid #1a1a1a;
}
#mobile-show-menu {
  position: absolute;
  top: 10px;
  left: calc(25px - 10px);
  width: 25px;
  height: 25px;
  display: none;
}
#mobile-show-menu span {
  position: absolute;
  width: 20px;
  height: auto;
  border-bottom: 3px solid var(--mobileMenuColor);
  left: 0;
  top: 0;
  transition: all 300ms;
  border-radius: 2px;
}
#mobile-show-menu span:nth-child(1) {
  top: 14px !important;
}
#mobile-show-menu span:nth-child(2) {
  top: 19px !important;
}
#mobile-show-menu span:last-child {
  top: 24px !important;
}
#logo {
  font-size: 2em;
  background: var(--darkBlack20);
  height: 100px;
  width: 100%;
  padding-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#avatar-box img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 80px;
  left: 15px;
  border: 5px solid #262626;
}
#avatar-box #nick-name {
  position: absolute;
  top: 110px;
  left: 110px;
  height: 40px;
  text-align: initial;
}
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--bodyColor);
  margin: 0;
}
#nav {
  position: relative;
  background-color: var(--darkBlack30);
  max-width: 250px;
  width: 25%;
  height: 100vh;
  border-right: 2px solid #505050;
  color: var(--navTextColor);
}
#nav button .fa-solid {
  display: none;
}

.loader {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: #282828;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader i {
  position: absolute;
  font-size: 80px;
  color:#cccccc;
  animation: loaderAnimation 2s linear infinite;
}

@keyframes loaderAnimation {
  0% {transform: scale(1)}
  33% {transform: scale(1.5)}
  66% {transform: scale(1.2)}
  100% {transform: scale(1)}
}

@media only screen and (max-width: 1320px) {
  #nav {
    width: 50px;
  }
  #logo {
    opacity: 0;
  }
  #avatar-box img {
    width: 32px;
    height: 32px;
    position: absolute;
    left: 5px;
  }
  #nick-name {
    display: none;
  }
  .cat-bold {
    display: none;
  }
  .router-item a {
    grid-template-columns: 1fr;
  }
  .router-item span {
    opacity: 0;
    position: absolute;
    left: 60px;
    padding: 8px;
    background: var(--tipMobileColor);
    font-size: 10px;
    border-radius: 4px;
    white-space: nowrap;
    transition: all 0.25s;
    z-index: 5;
  }
  .router-item span:before {
    content: "";
    width: 45px;
    height: 25px;
    position: absolute;
    top: 0px;
    left: -59px;
  }
  .router-item a span:after {
    content: "";
    position: absolute;
    top: 25%;
    left: -10px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--tipMobileColor) transparent transparent;
  }
  .router-item span:hover {
    opacity: 0.8;
  }
  #down-nav-menu {
    flex-direction: column;
    grid-gap: 1px;
    margin-left: 2px;
  }
  #nav button .fa-solid {
    display: block;
  }
  #nav button .btn-txt {
    display: none;
  }
  #mobile-show-menu {
    display: block;
  }
  #bet-container {
    height: 700px !important;
    flex-direction: column !important;
  }
  .bet-box {
    width: 100% !important;
  }

  #chat-container {
    display: none;
  }

  .saldo-text {
    display: none;
  }

  #saldo-icon{
    position: relative;
    right: 5px;
  }

  #saldo-value {
    display: block !important;
  }

  .router-item .wallet-name{
    display: none;
  }

  .acc-info-nav {
    height: 70px;
    width: 88%;
  }

  #saldo-value {
    font-size: 12px;
    position: absolute;
    bottom: -5px;
    display: block !important;
    opacity: 1 !important;
  }

  #saldo-value:after {
    content: "";
    position: absolute;
    top: 25%;
    left: -10px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--tipMobileColor) transparent transparent;
  }

  .dropdown-content {
    position: absolute;
    top: 0px;
    left: 40px;
    width: 200px;
    border: 1px solid #505050;
    z-index: 8;
  }

  .dropdown .fa-caret-down {
    position: relative;
    left: 2px;
  }

  #routers {
    width: 88%;
  }

}

</style>
