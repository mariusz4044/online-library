<template>
  <div class="file-upload">
    <div class="image-upload-wrap" :class="{'isUpload':isUpload}">
      <input class="file-upload-input" type='file' @change="uploadImage" accept="image/*" />
      <div class="drag-text">
        <h3>Przeciągnij lub kliknij</h3>
      </div>
    </div>
    <div class="file-upload-content" :class="{'showUpload':isUpload}">
      <img class="file-upload-image" :src="imageSrc" alt="your image" />
      <button type="button" @click="removeUpload" class="remove-image">X</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadImage",
  data() {
    return {
      isUpload: false,
      imageSrc: `#`,
    }
  },
  methods: {
    uploadImage(e) {
        if (e.target.files.length) {
          const reader = new FileReader();

          reader.onload = (e) =>{
              this.isUpload = true;
              this.imageSrc = e.target.result;
              this.$emit('update',this.imageSrc);
          }

          reader.readAsDataURL(e.target.files[0]);
        }
    },
    removeUpload() {
      this.isUpload = false;
      this.imageSrc = `#`;
    }
  },
}
</script>

<style scoped>

.isUpload {
  display: none;
}

.showUpload {
  display: block !important;
}

.file-upload {
  background-color: transparent;
  width: 250px;
  margin: 0 auto;
}


.file-upload-content {
  display: none;
  text-align: center;
  position: relative;
}

.file-upload-input {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  outline: none;
  opacity: 0;
  cursor: pointer;
  left: 0;
}

.image-upload-wrap {
  margin-top: 20px;
  border: 4px dashed #414141;
  position: relative;
}

.image-dropping,
.image-upload-wrap:hover {
  background-color: #1c1c1c;
  border: 4px dashed #363636;
}

.image-title-wrap {
  padding: 0 15px 15px 15px;
  color: #222;
}

.drag-text {
  text-align: center;
  font-size: 12px;
  padding: 20px 0px;
}

.drag-text h3 {
  font-weight: 100;
  color: #cccccc;
}

.file-upload-image {
  width: 150px;
  height: 150px;
  margin: auto;
  padding: 10px 0 0 0;
  object-fit: cover;
  border-radius: 4px;
}

.remove-image {
  background: none;
  color: #cccccc;
  border: none;
  position: absolute;
  right: 50px;
  top: 10px;
  background: #00000073;
  border-bottom-left-radius: 4px;
  padding: 8px;
  cursor: pointer;
}

.remove-image:active {
  border: 0;
  transition: all .2s ease;
}

</style>