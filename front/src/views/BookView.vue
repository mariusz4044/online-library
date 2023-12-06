<template>
  <div id="router-back" @click="this.$router.go(-1)"><i class="fa-solid fa-arrow-left-long"></i></div>
  <div id="box-details">
    <div class="book-box-prev" v-if="this.book">
      <Book :data="book" preview="1"></Book>
    </div>
    <div class="right-nav">
      <div class="book-stats-prev">
        <b>Opis książki</b>
        <div class="line"></div>
        <label>{{book.description}}</label>
      </div>
      <div class="book-stats-prev">
        <b>Informację główne</b>
        <div class="line"></div>
        <div class="general-info">
          <label><span>Dodał</span><span><b class="click-nick" @click="this.$profile.name=book.upload">{{book.upload}}</b> <i class="fa-solid fa-user"></i></span></label>
          <label><span>Rok</span><span><b>{{book.year}}</b> <i class="fa-solid fa-calendar-days"></i></span></label>
          <label><span>Język</span><span><b>{{book.language}}</b> <i class="fa-solid fa-earth-americas"></i></span></label>
          <label><span>Gatunki</span><span><b>{{book.type?.length ? book.type.join(', ') : `--Brak--`}}</b> <i class="fa-solid fa-font"></i></span></label>
          <label><span>Ocena</span><span><b>{{book.rate}} / 5</b> <i class="fa-solid fa-star"></i></span></label>
          <label><span>Wyświetlenia</span><span><b>{{book.views}}</b> <i class="fa-solid fa-eye"></i></span></label>
          <label><span>Polubiono</span><span><b>{{book.favorite}}</b> <i class="fa-solid fa-heart"></i></span></label>
        </div>
      </div>
    </div>
  </div>
  <div class="comment-container box-90 l-5">
    <div class="comment-top">
      <b>Komentarze</b>
      <div class="line"></div>
    </div>
    <div class="comment-write">
      <img :src="avatar(this.$user.info.avatar)">
      <input placeholder="Wpisz treść komentarza" v-model="this.commentText"/>
      <button @click="newComment"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
    <PageNavBar v-if="book" :current="currentPageComment" :maxPage="book.commentsPages" @update="changePage($event)"></PageNavBar>
    <div class="comment-box box-90 l-5">
      <Transition>
      <div class="loader-comments"  v-if="!isLoaded"><i class="fa-solid fa-spinner"></i></div>
      </Transition>
      <Comment v-if="book.comments" v-for="comment in book.comments" :comment = "comment" :key="comment.id" @rate="rate($event)"></Comment>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/Comments/Comment";

import Book from "@/components/Books/Book";
import PageNavBar from "@/components/HtmlElements/PageNavBar";
export default {
  name: "BookView",
  components: {PageNavBar, Book,Comment},
  data() {
    return {
      bookId: this.$route.params.id,
      book: false,
      currentPageComment: 0,
      isLoaded: true,
      commentText: '',
    }
  },
  created() {
    //Fix vue router scroll.
    document.querySelector('#content').scrollTop = 0;
    //
    this.getBook();
  },
  methods: {
    async rate({comment,value}) {
      const res = await this.$send('/user/comment/rate',{
        bookId: this.bookId,
        commentId: comment,
        rate: value,
      });

      if(res.error) return;

      const findComment = this.book.comments.find(el=>{
        return el.id == comment;
      });

      if(value === 1) findComment.like++;
      if(value === -1) findComment.dislike++;
    },
    async newComment() {
      const msg = this.commentText;

      if(msg.length < 2 || msg.length > 255) {
        return this.$alert("Wiadomość powinna mieć od 2 do 255 znaków!",'error');
      }

      const res = await this.$send('/user/comment/new',{
        comment: msg,
        bookId: this.bookId,
      });

      if(res.error) return;

      this.book.comments.unshift(res.comment);
      this.commentText = '';
    },
    async getBook() {
      const res = await this.$send(`/user/getBook/${this.bookId}`,null,"GET");
      if(res.error) return;

      this.book = res;
    },
    async changePage(page) {
      this.isLoaded = false;

      const res = await this.$send('/user/comment/get',{
        page,
        bookId: this.bookId,
      });

      this.isLoaded = true;

      if(res.error) return;

      console.log(res)
      this.currentPageComment = res.currentPage;
      this.book.comments = res.comments;
    }
  },
}
</script>

<style>

#btn-read-online  {
  position: absolute;
  width: 120px;
  bottom: 50px;
  left: calc(50% - 60px);
  display: flex;
  z-index: 5;
}

#btn-read-online i {
  margin-top: 2.2px;
  margin-right: 4px;
}

.loader-comments {
  position: absolute;
  background: #181818;
  width: 100%;
  height: 100%;
  z-index: 10;
  bottom: 0px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-comments i {
  color: var(--hiddenText);
  z-index: 11;
  font-size: 30px;
  animation: spinner 1s linear infinite;
  position: absolute;
}

.click-nick {
  cursor: pointer;
}

@keyframes spinner {
  from {transform: rotate(0deg)}
  to {transform: rotate(360deg)}
}
.nav-page {
  margin-top: 15px;
}

.comment-box {
  height: auto;
  min-height: 150px;
  margin: 30px 0 0 0;
  background: rgba(24, 24, 24, 0.5);
  border-radius: 4px;
  position: relative;
  bottom: 10px;
  display: flex;
  padding-bottom: 20px;
  padding-top: 10px;
  flex-direction: column;
  box-shadow: var(--darkLittleShadow);
}

.comment-write input:focus {
  border-bottom: 2px solid #727272;
}

.comment-write button {
  background: #343434;
  border: 1px solid var(--darkBlack30);
  padding: 10px;
  border-radius: 8px;
  color: #cccccc;
  margin-left: 10px;
  font-size: 20px;
  box-shadow: inset 0px 0px 24px -5px rgba(66, 68, 90, 1);
  cursor: pointer;
}

.comment-write button:active {
  transform: scale(0.95);
}

.comment-write img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.comment-write input {
  left: 2px;
  top: -10px;
  background: none;
  resize: none;
  padding-top: 5px;
  height: 30px;
  outline: none;
  color: #ccc;
  padding-left: 5px;
  border: none;
  border-bottom: 1px solid #505050;
  width: 80%;
  transition: all 0.2s;
}

.comment-write {
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-top {
  padding-top: 20px;
}

.comment-container {
  background: var(--bgBook);
  height: auto;
  min-height: 20%;
  position: relative;
  top: 120px;
  box-shadow: var(--darkLittleShadow);
  margin-bottom: 150px;
  border-radius: 8px;
  margin-top: 50px;
}

.right-nav {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
}

 .line {
   margin: 15px 0px 25px 0px;
   width: 100%;
   height: 1px;
   display: block;
   background: linear-gradient(to right,rgba(200,175,133,0) 2%, #3c3c3c 30%, #3c3c3c 70%,rgba(200,175,133,0) 98%);
  }

 .general-info label{
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px dotted #333333;
 }

.general-info label b {
  color: #868686;
  }

 #box-details {
   display: flex;
   flex-direction: row;
   height: auto;
 }

 .book-stats-prev {
  width: 90%;
  height: 80%;
  background: var(--bgBook);
  box-shadow: var(--darkLittleShadow);
  margin: 20px;
  top: 80px;
  padding: 20px;
  position: relative;
  border-radius: 8px;
 }


 #router-back {
   position: absolute;
   left: 20px;
   top: 10px;
   font-size: 25px;
   cursor: pointer;
   z-index: 2;
 }

 .book-box-prev {
   width: 40%;
   height: 650px;
   position: relative;
 }

 .book-box-prev .book-box {
  position: relative;
  left: 50px;
  top: 100px;
  width: 80%;
  height: 100%;
 }

 .book-box-prev .book-box #book-image{
   height: 600px;
   width: calc(100% - 10%);
   object-fit: cover;
 }

@media only screen and (max-width: 1000px) {
  #box-details {
    display: flex;
    flex-direction: column;
    height: auto;
    align-items: center;
  }

  .comment-container {
    position: relative;
    top: 80px;
  }

  .comment-write img {
    display: none;
  }

  .comment-write button{
    display: flex;
    width: 30px;
    height: 30px;
    font-size: 15px;
    align-items: center;
    justify-content: center;
  }

  .book-box-prev {
    position: relative;
    width: calc(80vw);
    height: 100%;
    display: flex;
    margin-bottom: 20px;
    justify-content: center;
  }

  .book-box-prev .book-box {
    left: 0;
  }

  .book-stats-prev {
    width: 80%;
  }

  /*.right-nav {*/
  /*  position: relative;*/
  /*  top: 100px;*/
  /*}*/
}

</style>