<template>
  <div class="profile-container" v-if="show">
    <div class="bg-blur" @click="show = !show"> </div>
    <div id="profile-box" v-if="user.nick">
      <b class="profile-title">Profil użytkownika {{user.nick}}</b>
      <div class="line"></div>
      <div class="close-profile" @click="show = !show"><i class="fa-solid fa-xmark"></i></div>
      <header class="profile-header">
        <img :src="avatar(user.avatar)" alt="user avatar">
        <div class="book-stats-prev">
          <div class="general-info">
            <label><span>Czytane utwory</span><span><b>{{user.readBooks}} (ukończone {{user.readEnd}})</b> <i class="fa-solid fa-book"></i></span></label>
            <label><span>Przeczytanych stron</span><span><b>{{user.readPages}}</b> <i class="fa-solid fa-file"></i></span></label>
            <label><span>Ocenione utwory</span><span><b>{{user.rateCount}}</b> <i class="fa-solid fa-star-half-stroke"></i></span></label>
            <label><span>Spędzony czas</span><span><b>{{user.spendTime}}</b> <i class="fa-solid fa-clock"></i></span></label>
            <label><span>Średna czytania</span><span><b>{{user.avgPerPage}} / strona</b> <i class="fa-solid fa-stopwatch-20"></i></span></label>
            <label><span>Średnia odwiedzin</span><span><b>{{user.avgVisit || 0}} wizyt / książka</b> <i class="fa-solid fa-eye"></i></span></label>
          </div>
        </div>
      </header>
      <main>
        <div class="last-read-text">Ostatnio czytane utwory</div>
      </main>
      <bottom class="main-profile">
          <Book v-for="book in this.user.bookList" :data="book"></Book>
      </bottom>
      <div class="loader-comments" v-if="!user.spendTime"><i class="fa-solid fa-spinner"></i></div>
    </div>

  </div>
</template>

<script>
import humanizeDuration from "humanize-duration";
import Book from "@/components/Books/Book";
export default {
  name: "ProfileView",
  components: {Book},
  props: ['profileName'],
  data() {
    return {
      show: true,
      user: {},
    }
  },
  watch: {
    show(newValue, oldValue) {
      if(newValue === false) {
        this.$emit('closeWindow',1)
      }
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    async getProfile() {
      await this.$sleep(500);
      const res = await this.$send(`/user/profile/${this.$profile.name}`,null,'GET');
      if(res.error) return this.show = false;

      this.user = res;
      this.user.avgPerPage = humanizeDuration(this.user.avgPerPage*1000,{language: "pl" ,largest:2,maxDecimalPoints: 2});
      this.user.spendTime = humanizeDuration(this.user.spendTime*1000,{language: "pl" ,largest:2,maxDecimalPoints: 2});
    }
  },
}
</script>

<style >


.profile-header {
  display: flex;
  height: 250px;
  flex-direction: row;
}

.profile-header img{
  position: relative;
  margin-left: 25px;
  width: 180px;
  height: 203px;
  border-radius: 4px;
  box-shadow: 0 0 3px 0 #343434;
  top: -3px;
}

.profile-header i {
  min-width: 18px;
}
.profile-header .book-stats-prev {
  top: -25px;
  font-size: 13px;
  height: auto;
  display: flex;
  box-shadow: inset 0 0 3px 0 #343434;
  flex-direction: column-reverse;
  justify-content: center;
}
.profile-title {
  position: relative;
  top: 8px;
}

.profile-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  color: #cccccc;
}

.last-read-text {
  color: var(--categoryColor);
  margin-top: -20px;
}

#profile-box {
  width: 800px;
  height: 670px;
  background: var(--bgBook);
  border: 1px solid rgba(128, 128, 128, 0.2);
  position: sticky;
  top: calc(50% - 350px);
  left: calc(50% - 350px);
  z-index: 12;
  border-radius: 4px;
}

.close-profile {
  position: absolute;
  right: 20px;
  top: 5px;
  font-size: 20px;
  color: var(--hiddenText);
  cursor: pointer;
}

.main-profile {
  display: flex;
  justify-content: center;
}

.main-profile #stats-box {
  left: 18px;
}

.main-profile .book-box {
  transform: scale(0.9);
}

.bg-blur {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  backdrop-filter: blur(3px);
  z-index: 11;
  background: rgba(37, 37, 37, 0.6);
}

@media only screen and (max-width: 780px) {
  #profile-box {
    width: 90%;
    left: 5%;
    position: absolute;
    height: auto;
  }

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-header img {
    margin-bottom: 20px;
  }

  .main-profile {
    display: flex;
    flex-wrap: wrap;
    margin-top: 200px;
  }

 .main-profile #book-desc {
    left: 18px !important;
    width: 75.5% !important;
    overflow-y: hidden;
  }
}
</style>