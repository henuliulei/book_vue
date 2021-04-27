<template>
<div>
  <img :src="imgUrl" height="100%" width="100%">
</div>
</template>

<script>
export default {
  name: "Welcome",
  data(){
    return{
      imgUrl :require("../assets/image/img_2.png"),
    }
  },

}
</script>

<style scoped>

</style>