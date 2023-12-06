<template>
<h1>Zostałeś wylogowany!</h1>
</template>

<script>
export default {
  name: "LogOut",
  created() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    if(localStorage.getItem('is_login')) {
      localStorage.removeItem('is_login');
      location.reload();
    }
  },
}
</script>

<style>

</style>