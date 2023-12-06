<template>
  <b class='empty-info' v-if="Object.values(this.books).length == 0">Brak ulubionych utworów!</b>
  <Transition name="fade">
    <div class="loader-comments"  v-if="!isLoaded"><i class="fa-solid fa-spinner"></i></div>
  </Transition>
  <div class="fav-box">
    <Book v-for="book in this.books" :data="book" @removeFav="unlike"></Book>
  </div>
</template>

<script>
import Book from "@/components/Books/Book";

export default {
  name: "LikeBooks",
  components: {Book},
  data() {
    return {
      isLoaded:false,
      books: {},
    }
  },
  created() {
    this.getFavBooks();
  },
  methods: {
    unlike(){
      setTimeout(()=>{
         this.getFavBooks();
      },100)
    },
    async getFavBooks() {
      const res = await this.$send('/user/book/getFav',null,'GET');
      this.isLoaded = true;
      if(res.error) return;
      for(let i in res) {
        res[i].comments = res[i].comments.length;
      }
      this.books = res;
    }
  },
}
</script>

<style>
  .fav-box {
    display: flex;
    width: 100%;
    height: 90%;
    flex-wrap: wrap;
    grid-gap: 10px;
    position: relative;
    top: 50px;
    justify-content: center;
  }

  .empty-info {
    font-size: 30px;
    position: relative;
    top: calc(50% - 15px);
    color: rgba(77, 77, 77, 0.4);
  }

</style>