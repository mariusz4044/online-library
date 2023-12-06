<template>
  <div class="book-box">
    <div id="book-title" class="l-5 box-90">
      {{
        preview ? book.title : this.truncate(book.title,21)
      }}
    </div>
    <div id="book-author">({{book.author}})</div>
    <img id="book-image" class="l-5" :src="getImgUrl(book.image)" />
    <div id="stats-box" v-if="!preview">
      <div id="book-pages" class="pages-color">{{book.comments}} <i class="fa-solid fa-comment"></i></div>
      <div id="book-views" class="views-color">{{book.views}} <i class="fa-solid fa-eye"></i></div>
      <div id="book-rate" class="rate-color">{{book.rate}} <i class="fa-solid fa-star"></i></div>
      <div id="book-fav" class="fav-color">{{book.favorite}} <i class="fa-solid fa-heart"></i></div>
    </div>
    <div id="action-box"  v-if="!preview" >
      <div id='favIcon' @click="this.likeBook(); this.$emit('removeFav',1)"><i class="fa-regular fa-heart"></i></div>
      <div id='descIcon' @click="showDesc = !showDesc"><i class="fa-solid fa-repeat"></i></div>
    </div>

    <Transition>
      <div id="book-desc" v-if="showDesc">{{this.truncate(book.description,300)}}</div>
    </Transition>

    <button v-if="!preview" class="btn-classic btn-gray box-90 l-5" @click='this.$router.push({ path: `/book/view/${book._id}`});changeRouter()' >Sprawdz</button>

    <button v-if='preview' class="btn-classic btn-gray" id="btn-read-online"  @click="this.$router.push({ path: `/book/read/${book._id}/${book.title}` })" >
      <i class="fa-solid fa-book-open"></i>
      Czytaj online
    </button>

  </div>
</template>

<script>
export default {
  name: "Book",
  props: ['data','preview'],
  data() {
    return {
      book: this.data,
      showDesc: false,
    }
  },
  methods: {
    getImgUrl(pet) {
      return require('../../../public/books/'+pet)
    },
    changeRouter(){
      console.log(1)
      if(this.$profile.name) {
        this.$profile.name=false;
        setTimeout(()=>{location.reload()},100)
      }
    },
    async likeBook(){
      if(!this.$user.info.likeBooks.includes(this.book._id)){
        const res = await this.$send('/user/book/like',{bookId:this.book._id});
        if(res.error) return;
        this.$user.info.likeBooks = res.likeBooks;
        return true;
      }
      const res = await this.$send('/user/book/unlike',{bookId:this.book._id});
      if(res.error) return;
      this.$user.info.likeBooks = res.likeBooks;
    }
  },
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

  #action-box {
    display: flex;
    position: absolute;
    left: 20px;
    top: 58px;
    width: 82%;
    font-size: 18px;
    justify-content: space-between;
  }

  #action-box div {
    display: flex;
    margin: 0 8px 0 8px;
    background: rgba(255,255,255, 0.37);
    padding: 4px;
    border-radius: 50%;
    color: black;
    align-items: center;
    justify-content: center;
    box-shadow:  0px 0px 5px -1px rgba(66, 68, 90, 1);
    transition: 250ms;
    cursor: pointer;
  }

  #action-box div:active {
    transform: scale(0.90);
  }

  #favIcon:hover {
    color: red;
  }

  @keyframes shake {
    0% {transform: rotate(0deg)}
    25% {transform: rotate(-25deg)}
    50% {transform: rotate(-0deg)}
    75% {transform: rotate(25deg)}
    100% {transform: rotate(0deg)}
  }

  #book-desc {
    position: absolute;
    font-size: 13px;
    width: 77.5%;
    height: 195px;
    background: rgba(0, 0, 0, 0.8);
    top: 50px;
    left: 20px;
    border-radius: 3px;
    z-index: 3;
    padding: 45px 5px 10px 5px;
  }

  #descIcon {
    z-index: 4;
  }

  .book-box {
    font-family: Arial;
    width: 200px;
    height: 350px;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 10px;
    border-radius: 8px;
    background: var(--bgBook);
    box-shadow: var(--darkLittleShadow);
  }

  #book-image {
    width: 90%;
    height: 250px;
    object-fit: revert;
    position: relative;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  #stats-box {
    position: absolute;
    display: flex !important;
    justify-content: space-evenly !important;
    font-size: 13px;
    padding: 8px;
    bottom: 70px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    left: 20px;
    width: 74.6%;
    height: 11px;
    border-radius: 2px;
    user-select: none;
  }

  #book-author {
    font-size: 12px;
    color: var(--hiddenText);
    padding: 4px
  }

  .pages-color {
    color: #bdbdbd;
    font-weight: 600;
  }

  .views-color {
    color: #bdbdbd;
    font-weight: 600;
  }

  .rate-color {
    color: rgba(255, 215, 0, 1);
    font-weight: 600;
  }

  .fav-color {
    color: rgba(190, 0, 0, 1);
    font-weight: 600;
  }

</style>