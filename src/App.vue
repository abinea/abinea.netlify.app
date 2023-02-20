<script setup lang="ts">
const route = useRoute()

const hasCommentsPath = computed(() => {
  const path = route.path.split('/')
  if (path[1]) {
    const subPath = ['talks']
    const postsPath = path[1] === 'posts' && path[2] && path[2] !== ''
    return subPath.includes(path[1]) || postsPath
  }
})
</script>

<template>
  <main class="px-7 py-10">
    <RouterView />
    <Comment v-if="hasCommentsPath" />
  </main>
</template>