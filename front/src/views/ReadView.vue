<template>
  <div id="router-back" @click="this.$router.go(-1)"><i class="fa-solid fa-arrow-left-long"></i></div>
  <div class="book-read-box">
     <div class="page-prev page-action-btn" @click="this.rendition.prev();this.updateCurrentPage(-1)"><i class="fa-solid fa-chevron-left"></i></div>
     <div id="area" :style="areaStyle">
       <div class="loader-comments loader-book" v-if="!isLoaded"><i class="fa-solid fa-spinner"></i></div>
       <div class="current-page-chapter" :style="pageNavStyle"><label>[ {{this.currentPage}} / {{this.totalPages}} ]</label></div>
     </div>
     <div class="page-next page-action-btn" @click="this.rendition.next();this.updateCurrentPage(1)"><i class="fa-solid fa-chevron-right"></i></div>
  </div>
  <div class="change-theme">
    <i class="fa-regular fa-moon" @click="this.theme='dark'; this.setTheme()"></i>
    <i class="fa-regular fa-sun" @click="this.theme='white'; this.setTheme()"></i>
  </div>
</template>

<script>
import ePub from 'epubjs'

export default {
  name: "ReadView",
  data() {
    return {
      isLoaded :false,
      readInterval: false,
      currentPage: 0,
      totalPages: 0,
      currentChapter: '',
      book: false,
      chapters: false,
      rateAsk: false,
      theme: "dark",
      pageCount: +localStorage.getItem('page-back') || -1,
      areaStyle: {
        background: `#1e1e1e`
      },
      pageNavStyle: {
        color: 'black',
      }
    }
  },
  created() {
      this.loadBook(this.$route.params.name)
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.readInterval);
    next()
  },
  methods: {
    async loadBook(name) {
      const res = await this.$send('/user/book/action', {
        task : "startRead",
        bookId: this.$route.params.id,
      });

      if(res.error) return;

      const url = require(`../../public/epubs/${name}.epub`);

      this.book = ePub(`${location.origin}${url.default}`);

      this.rendition = await this.book.renderTo("area", {
        method: "default",
        width: `100%`,
        height: `97%`,
        allowScriptedContent: true
      });

      this.displayed = await this.rendition.display(res.cfi || 1);
      this.loadTheme();
      await this.$sleep(500);
      this.chapters = this.book.locations.spine.items;

      if(res.cfi) {
        this.$alert('Załadowano ostatnio zapisany rozdział.','success')
      }

      this.updateCurrentPage();

      if(!this.readInterval) {
        this.readInterval = setInterval(async ()=>{
          const data = {
            task : "update",
            cfi: this.rendition?.currentLocation()?.start?.cfi,
            bookId: this.$route.params.id,
          }

          if(this.pageCount>0)  {
            data['read'] = this.pageCount;
          }

          if(this.rendition?.currentLocation()?.atEnd) {
            data['atEnd'] = true;
          }

          const res = await this.$send('/user/book/action', data);

          if(this.pageCount>0) {
            this.pageCount = 0;
            localStorage.setItem('page-back',0);
          }

          if(res.canRate && !this.rateAsk) {
            this.rateAsk = true;

            const inputOptions = {
              '1': '1',
              '2': '2',
              '3': '3',
              '4': '4',
              '5': '5',
            }

            const { value: rate } = await this.$swal.fire({
              title: 'Jak oceniasz przeczytany utwór?',
              input: 'radio',
              inputOptions: inputOptions,
              inputValidator: (value) => {
                if (!value) {
                  return 'Wybierz ocene!'
                }
              }
            });

            const res = await this.$send('/user/book/rate', {
              bookId: this.$route.params.id,
              rate: +rate,
            });
          }

        },1000);
      }

      this.isLoaded = true;
    },
    setTheme() {
      localStorage.setItem('theme',this.theme);
      this.loadTheme();
    },
    loadTheme() {
      const ls = localStorage.getItem('theme') || 'dark';
      if(ls === 'dark') {
        this.setThemeDark();
      }else{
        this.setThemeWhite();
      }
    },
    updateCurrentPage(s) {
      const ls = localStorage.getItem('page-back') || localStorage.setItem('page-back',-1);

      if(s === -1) {
        localStorage.setItem('page-back',parseInt(ls)-1);
        this.pageCount-- ;
      }else {
        localStorage.setItem('page-back',parseInt(ls)+1);
        this.pageCount++;
      }

      console.log(this.rendition?.currentLocation())
      if(!this.rendition?.currentLocation().end) return;
      const {page,total} = this.rendition?.currentLocation().end.displayed;
      this.currentPage = page;
      this.totalPages = total;
      this.getCurrentChapter();
    },
    getCurrentChapter() {
      let locationCfi = this.rendition.currentLocation().start.cfi;
      let spineItem = this.book.spine.get(locationCfi);
      let navItem = this.book.navigation.get(spineItem.href);
      if(!navItem?.label) return;
      this.currentChapter = navItem.label;
    },
    setThemeWhite() {
      console.log(this.areaStyle)
      this.rendition.themes.default({
        "a": { "color": "#424242 !important"},
        "p": { "color": "black !important"},
      })

      this.areaStyle.background = 'white';
      this.pageNavStyle.color = 'black';
    },
    setThemeDark() {
      this.rendition.themes.default({
        "p": { "color": "#cccccc !important"},
        "div": { "color": "#cccccc !important"},
        "a": { "color": "#cccccc !important"},
        "h1": { "color": "#cccccc !important"},
        "h2": { "color": "#cccccc !important"},
        "h3": { "color": "#cccccc !important"},
        ".block-rw": {
          "border-top": "2px solid #424242 !important",
          "border-bottom": "2px solid #424242 !important"
        },
      })
      this.areaStyle.background = '#1e1e1e';
      this.pageNavStyle.color = '#cccccc';
    }
  },
}
</script>

<style>

.loader-book {
  border-radius: 8px;
}

.change-theme {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 22px;
}

.change-theme i {
  cursor:pointer;
  margin-right: 10px;
}

.current-page-chapter {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

#book-stats-read {
  height: auto;
  background: var(--bgBook);
  box-shadow: var(--darkLittleShadow);
  margin-top: 30px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  position: relative;
}

.title-inbox {
  top: 8px;
  position: relative;
}

.book-read-box {
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5vh;
}

#area {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 700px;
  border-radius: 8px;
  user-select: none;
  box-shadow: var(--darkLittleShadowOutSide);
}

.page-action-btn {
  cursor: pointer;
  transition: all 250ms;
}

.page-action-btn:active {
  transform: scale(0.7);
}

.page-prev {
  margin-right: 25px;
  font-size: 25px;
  padding: 5px;
}

.page-next {
  margin-left: 25px;
  font-size: 25px;
  padding: 5px;
}


@media only screen and (max-width: 900px) {
  .page-next {
    position: absolute;
    right: 10px;
    background: #4f4f4f;
    border-radius: 50%;
    padding: 8px;
    font-size: 10px;
  }

  .page-prev {
    position: absolute;
    left: 10px;
    background: #4f4f4f;
    border-radius: 50%;
    padding: 8px;
    font-size: 10px;
    z-index: 5;
  }

  #area {
    position: relative;
    top: 10px;
  }

}
</style>