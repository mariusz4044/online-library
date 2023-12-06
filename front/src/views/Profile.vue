<template>
</template>

<script>
import ProfileView from "@/components/Profile/ProfileView";

export default {
  name: "Profile",
  components: {ProfileView},
  data() {
    return {
      show: false
    }
  },
  created() {
    this.$profile.name = this.$user.info.nick;
  }
}
</script>

<style>
.profile-b .bg-blur {
  display: none !important;
}
</style>