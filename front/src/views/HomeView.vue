<template>
  <div class="home">
    <header class="filter-nav l-5">
      <div class="search">
        <span class="form-element">
        <span class="fa fa-search"></span>
        <input placeholder="Wprowadz tytuł lub autora" v-model="filtrName">
        </span>
      </div>
      <div class="range-box">
        <div class="rSlider">
          <span :style=[sliderStyle] class="slide"></span>
          <input id="range" type="range" min="1900" :max="new Date().getFullYear()" v-model="yearValue" @change="updateSlider">
        </div>
        <fieldset class="year-fieldset">
          <legend>wydanie</legend>
          <number id="year-value" :from="this.yearValue" :to="this.yearValue" :duration="0.5" />
        </fieldset>
      </div>
      <DropDownMenu :list="filterPages" class="filter-dropdown" icon="fa-solid fa-arrow-up-wide-short" @changeForm="this.updateFiltrOne($event)" type="filter"></DropDownMenu>
      <DropDownMenu :list="filterPageType" class="filter-dropdown filter-types" icon="fa-solid fa-arrow-up-z-a" @changeForm="this.updateFiltrTwo($event)" type="filter"></DropDownMenu>
      <button class="btn-classic btn-gray" id="sort-btn" @click="resetFilter">Resetuj</button>
    </header>
    <main class="book-box-home">
      <div class="book-cointaner box-90 l-5">
        <div class="admin-menu">
          <button class="btn-classic btn-gray" v-if="this.$user.info.rank === 'ADMIN'" @click="showAddMenu=!showAddMenu">Dodaj ksiązkę</button>
          <button class="btn-classic btn-gray" v-if="this.$user.info.rank === 'ADMIN'" @click="showChangeMenu=!showChangeMenu">Edytuj ksiązkę</button>
          <button class="btn-classic btn-gray" v-if="this.$user.info.rank === 'ADMIN'" @click="showRemoveMenu=!showRemoveMenu">Usuń ksiązkę</button>
          <button class="btn-classic btn-gray" v-if="this.$user.info.rank === 'ADMIN'" @click="showReports=!showReports">Pokaż zgłoszenia</button>
        </div>
        <Transition name="fade">
        <div class="loader-comments homepage-loader"  v-if="!isLoaded"><i class="fa-solid fa-spinner"></i></div>
        </Transition>
        <PageNavBar :current="currentPage" :maxPage="maxPages" @update="getBooks($event)"></PageNavBar>
        <Book v-for="book in this.books" :data="book"></Book>
      </div>
      <div class="page-change"></div>

      <div class="config-content" v-if="showAddMenu">
        <div class="bg-blur" @click="showAddMenu=!showAddMenu"></div>
      <SettingsWindow class="config-box">
        <template v-slot:title><b>Dodaj ksiązkę <i class="fa-solid fa-user-plus"></i></b> </template>
        <template v-slot:content>
          <UploadImage @update="this.bookAdd.image = $event"></UploadImage>
          <Input text="Podaj nazwe książki" @update='this.bookAdd.name=$event' icon="fa-solid fa-font"></Input>
          <Input text="Podaj opis książki" @update='this.bookAdd.desc=$event' icon="fa-solid fa-font"></Input>
          <Input text="Podaj gatunki ksiązki (oddziel ;)" @update='this.bookAdd.tags=$event' icon="fa-solid fa-font"></Input>
          <Input text="Rok ksiązki" @update='this.bookAdd.year=$event' icon="fa-solid fa-font"></Input>
          <Input text="Język ksiązki" @update='this.bookAdd.language=$event' icon="fa-solid fa-font"></Input>
          <Input text="Autor książki" @update='this.bookAdd.author=$event' icon="fa-solid fa-font"></Input>
          <label for="files" class="select-epub">Wybierz plik epub</label>
          <input class="epub-upload" type='file' accept="application/epub+zip" @change="uploadEpub" />
          <button class="btn-classic" @click="createBook">Wyślij</button>
        </template>
      </SettingsWindow>
      </div>

      <div class="config-content" v-if="showChangeMenu">
        <div class="bg-blur" @click="showChangeMenu=!showChangeMenu"></div>
        <SettingsWindow class="config-box">
          <template v-slot:title><b>Edycja książki <i class="fa-solid fa-user-plus"></i></b> </template>
          <template v-slot:content>
            <Input text="Podaj ID książki" @update='this.changeBookInput.bookId=$event' icon="fa-solid fa-font"></Input>
            <Input text="Podaj nazwe książki" @update='this.changeBookInput.name=$event' icon="fa-solid fa-font"></Input>
            <Input text="Podaj opis książki" @update='this.changeBookInput.desc=$event' icon="fa-solid fa-font"></Input>
            <Input text="Podaj gatunki ksiązki (oddziel ;)" @update='this.changeBookInput.tags=$event' icon="fa-solid fa-font"></Input>
            <Input text="Rok ksiązki" @update='this.changeBookInput.year=$event' icon="fa-solid fa-font"></Input>
            <Input text="Język ksiązki" @update='this.changeBookInput.language=$event' icon="fa-solid fa-font"></Input>
            <Input text="Autor książki" @update='this.changeBookInput.author=$event' icon="fa-solid fa-font"></Input>
            <button class="btn-classic" @click="changeBook">Wyślij</button>
          </template>
        </SettingsWindow>
      </div>

      <div class="config-content reports" v-if="showReports">
        <div class="bg-blur" @click="showReports=!showReports"></div>
        <SettingsWindow class="config-box">
          <template v-slot:title><b>Zgłoszenia użytkowników <i class="fa-solid fa-user-plus"></i></b> </template>
          <template v-slot:content>
            <div id="report-table">
                <table>
                  <thead>
                    <tr>
                      <th>Id użytkownika</th>
                      <th>Treść</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in reportList">
                      <td>{{item.author}}</td>
                      <td>{{item.message}}</td>
                      <td>{{new Date(+item.date).toLocaleString()}}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <button class="btn-classic" @click="showReports=false">Zamknij</button>
          </template>
        </SettingsWindow>
      </div>

      <div class="config-content" v-if="showRemoveMenu">
        <div class="bg-blur" @click="showRemoveMenu=!showRemoveMenu"></div>
        <SettingsWindow class="config-box">
          <template v-slot:title><b>Usuwanie książki <i class="fa-solid fa-user-plus"></i></b> </template>
          <template v-slot:content>
            <Input text="Podaj ID książki" @update='this.removeBookId=$event' icon="fa-solid fa-font"></Input>
            <button class="btn-classic" @click="removeBook">Wyślij</button>
          </template>
        </SettingsWindow>
      </div>


    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Book from "@/components/Books/Book";
import DropDownMenu from "@/components/HtmlElements/DropDownMenu";
import PageNavBar from "@/components/HtmlElements/PageNavBar";
import ProfileView from "@/components/Profile/ProfileView";
import SettingsWindow from "@/components/HtmlElements/SettingsWindow";
import UploadImage from "@/components/HtmlElements/UploadImage";
import Input from "@/components/HtmlElements/Input";

export default {
  name: 'HomeView',
  components: {Book,DropDownMenu,PageNavBar,ProfileView,UploadImage,SettingsWindow,Input},
  data() {
    return {
      showAddMenu:false,
      showChangeMenu:false,
      showRemoveMenu: false,
      removeBookId: '',
      showReports: false,
      reportList: [],
      changeBookInput: {
        bookId: '',
        year: 0,
        author: "Nieznany",
        tags: ``,
        language: "PL",
        name: "Brak tytułu",
        desc: "Brak opisu",
      },
      bookAdd: {
        year: 0,
        author: "Nieznany",
        tags: ``,
        language: "PL",
        image: '',
        name: "Brak tytułu",
        desc: "Brak opisu",
        epub: '',
      },
      isLoaded: false,
      currentPage: this.$route.query.page ? +this.$route.query.page : 0,
      maxPages: 0,
      yearValue: this.$route.query.year || 1900,
      filtrName: this.$route.query.name || "",
      timeOutFilter: false,
      params : {
        page : this.currentPage,
        name: this.$route.query.name || "",
        year: this.$route.query.year || 0,
        filtrOne: this.$route.query.filtrOne || false,
        filtrTwo: this.$route.query.filtrTwo || false,
      },
      sliderStyle: {
        width: '0%',
      },
      filterPages: {
        'komentarze':`<i class="fa-solid fa-comment"></i>`,
        'odsłony':`<i class="fa-solid fa-eye view-color"></i>`,
        'oceny':`<i class="fa-solid fa-star rate-color"></i>`,
        'polubione':`<i class="fa-solid fa-heart fav-color"></i>`,
      },
      filterPageType: {
        'epika':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'nowela': `<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'opowiadanie':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'epos':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'baśń':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'pamiętniki':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'oda':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'fraszka':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'elegia':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'tragedia':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
        'komedia':`<i class="fa-solid fa-arrow-up-z-a"></i>`,
      },
      books: {}
    }
  },
  watch: {
    yearValue(newValue) {
      const sliderValue = +this.yearValue;
      const maxValue = +new Date().getFullYear();
      const calculate = (((sliderValue-1900)/ (maxValue - 1900)) * 100);

      this.sliderStyle.width = `${calculate}%`

      clearTimeout(this.timeOutFilter);
      this.timeOutFilter = setTimeout(()=>{
        this.updateYear(newValue);
      },500)

    },
    filtrName(newValue,oldValue) {
      clearTimeout(this.timeOutFilter);
      this.timeOutFilter = setTimeout(()=>{
        this.updateFiltrName(newValue);
      },500)
    },
    showReports(newValue,oldValue) {
      if(newValue === true) {
        this.getUsersReports()
      }
    },
  },
  created() {
    this.getBooks(this.currentPage);
  },
  methods: {
    uploadEpub(e) {
      if (e.target.files.length) {
        const reader = new FileReader();

        reader.onload = (e) =>{
          this.isUpload = true;
          this.src = e.target.result;
          this.bookAdd.epub = this.src;
        }

        reader.readAsDataURL(e.target.files[0]);
      }
    },
    async createBook() {
     const res =  await this.$send('/admin/createBook',this.bookAdd);
    },
    async changeBook() {
      const res =  await this.$send('/admin/changeBook',this.changeBookInput);
    },
    async removeBook() {
      const res =  await this.$send('/admin/removeBook',{bookId:this.removeBookId});
    },
    async resetFilter() {
      this.params = {
        page : 0,
        name: "",
        year: 0,
        filtrOne:  false,
        filtrTwo: false,
      }

      this.yearValue = 1900;
      this.filtrName = '';

      this.updateParams()
      await this.$sleep(500);
      this.getBooks(0);
    },
    async updateFiltrOne(e) {
      this.params.filtrOne = e;
      this.params.page = 0;
      this.updateParams();
      await this.$sleep(500);
      this.getBooks(0);
    },
    async updateFiltrTwo(e) {
      this.params.filtrTwo = e;
      this.params.page = 0;
      this.updateParams();
      await this.$sleep(500);
      this.getBooks(0);
    },
    async updateFiltrName(name) {
      this.params.name = name;
      this.params.page = 0;
      this.updateParams();
      await this.$sleep(500);
      this.getBooks(0);
    },
    async updateYear(year) {
      this.params.year = year;
      this.params.page = 0;
      this.updateParams();
      await this.$sleep(500);
      this.getBooks(0);
    },
    async getUsersReports() {
      const res = await this.$send(`/admin/getReports`,null ,"GET");
      this.reportList = res.reports;
    },
    updateParams(){
      let temp = {};

      for(let i in this.params) {
        if(this.params[i]) {
          temp[i] = this.params[i]
        }
      }

      this.$router.replace({query: temp});
    },
    async getBooks(page) {
      this.isLoaded = false;
      this.books = {};
      const res = await this.$send(`/user/getBooks/${page}${window.location.search}`,null ,"GET");
      if(res.error) return;
      this.books = res.books;
      this.currentPage = res.pageInfo.currentPage;
      this.maxPages = res.pageInfo.maxPage;
      this.isLoaded = true;
      console.log(this.currentPage)
      this.params.page = this.currentPage;

      this.updateParams();
    },
  },
}
</script>

<style>

.admin-menu {
  position: absolute;
  left: 0;
  display: flex;
  grid-gap: 10px;
}

.reports  .config-box{
  width: 80% !important;
  left: 10% !important;
}

.select-epub {
  position: relative;
  top: 8px;
}
.book-box-home .config-content .btn-classic {
  position: relative;
  margin-top: 30px;
  width: 80%;
}

.book-box-home .config-content .drop-menu-widthdraw .dropdown{
  width: 200px;
}

.book-box-home .config-content .last-element-config {
  margin-bottom: 70px !important;
}

.book-box-home .epub-upload {
  position: relative;
  margin-left: 50px;
  margin-top: 20px;
}

.book-box-home .config-content .config-box button {
  height: 35px;
  margin-bottom: -15px;
  background-color: #383838;
  box-shadow: inset 0 -3px 0 0 #2a2a2a;
}
.book-box-home .config-content .config-box i {
  margin-left: 2px;
}

.book-box-home .config-content .config-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.book-box-home .config-box .input-container,.book-box-home .config-box input{
  width: 100%;
}

.book-box-home .config-box {
  position: absolute;
  margin-bottom: 30px;
  top: 40px !important;
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
  z-index: 15;
  box-shadow: 0 0 14px 3px #141414;
}
.flex-between {
  display: flex;
  font-size: 13px;
  width: 100%;
  justify-content: space-between;
  padding: 5px 0;
}

.book-box-home .config-content .config-box b {
  margin-bottom: 20px;
  border-bottom: 1px solid #505050;
  width: 100%;
  padding-bottom:12px;
}

#report-table {
  width: 100%;
}

#report-table table{
  width: 100%;
  text-align: center;
  word-wrap: break-word;
}

.btn-add-book {
  position: absolute;
  left: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.homepage-loader {
  min-height: 80vh;
  height: calc(100% - 70px) !important;
  top: 52px;
  z-index: 11;
}

.book-cointaner .nav-page{
  /*left: 0;*/
}

  .home {
    height: 100%;
  }

  .book-cointaner {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    grid-gap: 20px;
    justify-content: flex-start;
    position: relative;
    top: 100px;
    padding-bottom: 20px;
  }

  .search {
    display: flex;
    color: #aaa;
    font-size: 16px;
    width: auto;
    margin-right: 50px;
  }
  .form-element {
    position: relative;
    width: 100%;
  }
  .search input {
    background: transparent;
    border: 1px solid var(--borderInput);
    padding: 8px;
    font-weight: 600;
    border-radius: 20px;
    color: var(--categoryColor);
    outline: none;
  }
  .search input {
    text-indent: 1em;
    padding-right: 30px;
    width: 100%;
  }
  .search .fa-search {
    position: absolute;
    top: 8px;
    right: -25px;
    bottom: 0;
  }

  .filter-nav {
    position: relative;
    display: flex;
    top: 30px;
    background: var(--darkBlack15);
    padding: 10px;
    border-radius: 8px;
    width: calc(90% - 25px);
    box-shadow: var(--darkLittleShadow);
    align-items: center;
    justify-content: space-around;
  }

  .filter-dropdown {
    width: 180px;
    height: 30px;
  }

  #sort-btn {
    position: absolute;
    right: 8px;
    width: 80px;
    height: 40px;
  }

  .filter-types {
   position: relative;
   margin-right: 90px;
    margin-left: 8px;
  }

  .rSlider {
    width: 300px;
    position: relative;
    margin-right: 10px;
  }

  .rSlider .slide {
    background: #282828;
    height: 5px;
    width: 80px;
    position: absolute;
    left: 0;
    top: 9px;
    z-index: 2;
  }
  input[type=range] {
    position: relative;
    -webkit-appearance: none;
    width: 100%;
    height: 5px;
    background: rgba(221, 221, 221, 0.2);
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #525252;
    border-radius: 50%;
    cursor: pointer;
    margin-bottom: 30px;
  }

  input[type="range"]::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #282828;
  }

  .range-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .year-fieldset {
    font-size: 14px;
    margin-top: -6px;
    padding: 1px;
    width: 70px;
    height: 32px;
    border: 1px solid var(--borderInput);
    border-radius: 4px;
  }

  .year-fieldset legend {
    color: var(--hiddenText);
    font-size: 12px;
  }

  @media only screen and (max-width: 780px) {
    .book-cointaner {
      justify-content: center;
    }

    .filter-nav {
      display: flex;
      flex-direction: column;
    }

    .filter-types {
      margin: 5px 0 0 0;
    }

    .rSlider {
      width: 90%;
      padding: 20px 0 20px 0;
    }

    #sort-btn {
      position: relative;
      margin-top: 10px;
      width: 80%;
      left: -1px;
    }

    .rSlider .slide {
      top: 29px;
    }

  }
</style>
