<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatDate } from '~/utils'
import type { Post } from '~/types'

const props = defineProps<{
  posts?: Post[]
}>()

const router = useRouter()
const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date)
  .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date))
  .filter(i => !i.path.endsWith('.html'))
  .map(i => ({
    path: i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    tag: i.meta.frontmatter.tag,
    duration: i.meta.frontmatter.duration,
  }))

const posts = computed(() => (props.posts || routes))

const getYear = (a: Date | string | number) => new Date(a).getFullYear()
const isSameYear = (a: Date | string | number, b: Date | string | number) => a && b && getYear(a) === getYear(b)
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>

    <template v-for="route, idx in posts" :key="route.path">
      <div v-if="!isSameYear(route.date, posts[idx - 1]?.date)" relative h20 pointer-events-none>
        <span text-8em op10 absolute left--3rem top--2rem font-bold>{{ getYear(route.date) }}</span>
      </div>
      <Link class="item block font-normal mb-6 mt-2 no-underline" :to="route.path">
      <li class="no-underline">
        <div class="title text-lg leading-1.2em">
          <span v-if="route.tag" align-middle class="text-xs border border-current rounded px-1 pb-0.2 md:ml--10.5 mr2">{{
            route.tag }}</span>
          <span align-middle>{{ route.title }}</span>
        </div>

        <div class="time opacity-80 text-sm">
          {{ formatDate(route.date) }}
          <span v-if="route.duration" op80>· {{ route.duration }}</span>
        </div>
      </li>
      </Link>
    </template>
  </ul>
</template>
