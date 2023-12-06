<template>
 <div class="nav-page box-90 l-5">
   <i class="fa-solid fa-angles-left" @click="updatePage(this.pageCurrent-1)"></i>
   <div class="page" v-for="i in this.calcucateShowPages()" :key="[`key${i}`]" @click="updatePage(i)">
     <label v-if="pageCurrent === i" class="current-page">{{i}}</label>
     <label v-else>{{i}}</label>
   </div>
   <div class="page-max" v-if="!this.calcucateShowPages().includes(maxPage)" @click="updatePage(this.maxPage)">...{{maxPage}}</div>
   <i class="fa-solid fa-angles-right" @click="updatePage(this.pageCurrent+1)"></i>
 </div>
</template>

<script>
export default {
  name: "PageNavBar",
  props: ['current','maxPage'],
  data() {
    return {
      totalPages: false,
      pageCurrent: this.current,
    }
  },
  methods: {
    updatePage(i) {
      if(i>this.maxPage || i<0) return;
      this.pageCurrent =+i;
      this.$emit('update',this.pageCurrent);
    },
    calcucateShowPages() {
      let showPage = [];

      //Sprawdzam czy po lewej i po prawej zawsze będą 4 numery. Jeżeli nie ustawiam 8 z dowolnej strony.
      let num1 = this.pageCurrent <= 4 ? 8 - this.pageCurrent : 4;
      let num2 = this.maxPage - this.pageCurrent<= 4  ? this.pageCurrent + 8 - this.maxPage : 4;

      for(let i=0;i<=num2;i++) {
        const cur = +this.pageCurrent;
        if(cur - i >= 0) {
          showPage.push(this.pageCurrent - i)
        };
      }

      for(let i=0;i<=num1;i++) {
        const cur = +this.pageCurrent;
        if(cur + i <= this.maxPage) {
          showPage.push(this.pageCurrent + i)
        };
      }


      //Remove current page double from array.
      showPage.splice(showPage.indexOf(this.pageCurrent),1);
      //

     // console.log(showPage)

      return showPage.sort((a, b) =>{
        return a - b;
      });
    }
  },
}
</script>

<style >

.page-max {
  margin-right: 2px;
}

.page {
  padding: 0 5px 0 5px;
  cursor: pointer;
  min-width: 12px;
  max-width: 12px;
  width: 12px;
  font-family: Arial;
  display: flex;
  justify-content: center;
}

.page label{
  cursor: pointer;
  transition: all 250ms;
}

.page label:hover {
  color: #e35e00;
}

.current-page {
  color: #e35e00;
  border-bottom: 1px solid #e35e00;
}

.nav-page {
  display: flex;
  justify-content: center;
}
</style>