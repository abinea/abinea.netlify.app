<script setup lang="ts">
import { formatDate } from "~/utils"

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const content = ref<HTMLDivElement>()

onMounted(() => {
  const navigate = () => {
    // #anchor
    if (location.hash) {
      document.querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAchors = (event: MouseEvent & { target: HTMLElement }) => {
    const link = event.target.closest('a')
    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }
  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAchors, { passive: true })
  navigate()
  setTimeout(navigate, 500)
})


</script>


<template>
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto mb-8">
    <h1 class="mb-0">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-80 !-mt-2">
      {{ formatDate(frontmatter.date) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p v-if="frontmatter.subtitle" class="opacity-80 !-mt-6 italic">
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <article ref="content">
    <slot />
  </article>
  <div v-if="route.path != '/'" class="prose m-auto mt-8 mb-8">
    <br>
    <span font-mono op50>> </span>
    <RouterLink :to="route.path.split('/').slice(0, -1).join('/') || '/'" class="font-mono op50 hover:op75"
      v-text="'cd ..'" />
  </div>
</template>


<style scoped></style>