<script setup lang="ts">
import dayjs from 'dayjs'
const year = dayjs().year()
</script>

<template>
  <div class="mt-20 mb-6 prose m-auto opacity-80 flex">
    <span class="text-sm"><a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        style="color:inherit"> CC BY-NC-SA 4.0 </a>
      <span> 2021-{{ year }} © ABin </span>
      <span class="mt-5"> Thanks To
        <a target="_blank" href="https://antfu.me" style="color:inherit">Anthony Fu's Blog</a>
      </span>
    </span>
    <div class="flex-auto" />
  </div>
</template>
