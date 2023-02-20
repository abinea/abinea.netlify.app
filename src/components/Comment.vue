<script setup lang="ts">
import { init } from "@waline/client"

onMounted(() => {
  init({
    el: "#waline",
    serverURL: "https://app-production-ccf1.up.railway.app/",
    lang: "zh-CN",
    search: false,
  })
})

</script>
<template>
  <div class="max-w-86ch m-auto">
    <div id="waline"> </div>
  </div>
</template>