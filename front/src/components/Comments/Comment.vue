<template>
  <div class="comment-view">
    <img :src="avatar(comment.avatar)" class="comment-avatar" @click="this.$profile.name=comment.nick"/>
    <div class="main-comment box-90">
      <div id="comment-nick" class='click-nick' @click="this.$profile.name=comment.nick">
        {{comment.nick}}
        <div class="readIcon" v-if="comment.read">
          <i class="fa-solid fa-book"></i>
          <div class="tip-up">Użytkownik przeczytał ten utwór.</div>
        </div>
        <div id="comment-date">{{date}} temu</div>
      </div>
      <div id="comment-text" class="box-90">{{comment.text}}</div>
    </div>
    <div id="comment-icons">
      <div class="comment-actions">
        <i :class="{'fa-regular fa-thumbs-down':true,animationRateDisLike}" @click="this.sendRate(-1)"><label>({{comment.dislike}})</label></i>
        <i :class="{'fa-regular fa-thumbs-up':true,animationRateLike}" @click="this.sendRate(1)"><label>({{comment.like}})</label></i>
      </div>
    </div>
  </div>
</template>

<script>
import humanizeDuration from "humanize-duration";

export default {
  name: "Comment",
  props: ['comment'],
  data() {
    return {
      animationRateLike: false,
      animationRateDisLike: false,
      date: humanizeDuration(Date.now() - this.comment.date,{language: "pl" ,largest:1,maxDecimalPoints: 0})
    }
  },
  methods: {
    sendRate(value) {
      this.$emit('rate',{
        comment: this.comment.id,
        value: value,
      })
    },
  },
  watch: {
    'comment.like' :{
      handler(newVal,oldVal){
          this.animationRateLike = true;
          setTimeout(()=>this.animationRateLike = false,2000)
      },
      deep: true
    },
    'comment.dislike' :{
      handler(newVal,oldVal){
          this.animationRateDisLike = true;
        setTimeout(()=>this.animationRateDisLike = false,2000)
      },
      deep: true
    }
  },
}
</script>

<style>

.readIcon:hover > .tip-up {
  display: block;
}

.readIcon {
  font-size: 11px;
  margin-left: 2px;
  position: relative;
  transition: all 250ms;
  cursor: pointer;
}

.tip-up {
  display: none;
  position: absolute;
  left: 10px;
  top: -22px;
  width: 200px;
  background: #2d2d2d;
  box-shadow: var(--darkLittleShadowOutSide);
  z-index: 2;
  border-radius: 8px 8px 8px 1px;
  padding: 5px !important;
}

.animationRateDisLike {
  animation: AnimationRateDisLike 500ms linear;
}

.animationRateLike {
  animation: AnimationRateLike 500ms linear;
}

@keyframes AnimationRateDisLike {
  0% {transform: rotate(0deg)}
  33% {color: darkred; transform: rotate(-10deg)}
  66% {color: darkred; transform: rotate(10deg)}
  100% {color: #cccccc; transform: rotate(0deg)}
}

@keyframes AnimationRateLike {
  0% { transform: rotate(0deg)}
  33% {color: darkgreen; transform: rotate(-10deg)}
  66% {color: darkgreen; transform: rotate(10deg)}
  100% {color: #cccccc; transform: rotate(0deg)}
}

.comment-actions label {
  font-size: 15px !important;
  margin-left: 3px;
  user-select: none;
  font-family: Arial !important;
}

.legit {
  color: #209600;
  font-size: 18px;
}

.icon-check {
  position: absolute;
}

.icon-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comment-actions{
  margin-top: 5px;
  margin-right: 10px;
}

  .comment-actions i{
    margin-right: 5px;
    float: right;
    cursor: pointer;
    transition: all 500ms;
  }

.comment-actions i:first-child:hover{
  color: #9b0000;
}

.comment-actions i:last-child:hover{
  color: #227900;
}

  #comment-icons {
    position: absolute;
    right: 0;
    top: 0;
  }

  .comment-view {
    margin: 10px 0 0 10px;
    position: relative;
  }

  .comment-avatar {
    width: 50px;
    float: left;
    height: 50px;
    border-radius: 50%;
  }

  .main-comment {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 4px;
    position: relative;
    left: 5px;
  }

  .main-comment div {
    padding: 2px;
  }

  #comment-nick {
    display: flex;
    font-size: 14px;
  }

  #comment-date {
    font-size: 10px;
    color: #6e6c6c;
    left: 3px;
    position: relative;
    top: 1px;
  }

  #comment-text {
    font-size: 14px;
    text-align: left;
    overflow-wrap: break-word;
  }
</style>