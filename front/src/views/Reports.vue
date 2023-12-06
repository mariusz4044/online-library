<template>
  <div class="box-90 l-5" id="report-box">
    <textarea placeholder="Opisz swój problem, możesz również zgłosić wulgarny komentarz." maxlength="1500" v-model="message"></textarea>
    <label>(maksymalnie 750 znaków)</label>
    <button class="btn-classic btn-gray" @click="sendReport">Wyślij zgłoszenie</button>
  </div>
</template>

<script>
export default {
  name: "Reports",
  data() {
    return {
      message: ``
    }
  },
  methods: {
    async sendReport() {
      const res = await this.$send('/user/report',{
        message: this.message
      })
    }
  },
}
</script>

<style>
  #report-box textarea{
    background: var(--darkBlack15);
    width: 50%;
    height: 500px;
    border: var(--windowBorder);
    resize: none;
    margin-top: 100px;
    color: #cccccc;
    border-radius: 8px;
    font-size: 17px;
    padding: 15px;
  }

  #report-box label {
    font-size: 12px;
    position: relative;
    top: 5px;
    color: var(--hiddenText);
  }

  #report-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #report-box button {
    position: relative;
    top: 15px;
  }
</style>