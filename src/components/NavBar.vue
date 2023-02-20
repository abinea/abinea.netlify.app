<script setup lang="ts">

</script>

<template>
  <header class="header z-40">
    <router-link class="w-10 h-10 absolute lg:fixed m-6 select-none outline-none" to="/" focusable="false">
      <img src="../assets/avatar.jpg" alt="logo">
    </router-link>

    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/" title="Home">
          <span class="lt-md:hidden">Home</span>
          <div i-ri-screenshot-line class="md:hidden" />
        </router-link>
        <router-link to="/posts" title="Posts">
          <span class="lt-md:hidden">Posts</span>
          <div i-ri-article-line md:hidden />
        </router-link>
        <router-link to="/friends" title="Friends">
          <span class="lt-md:hidden">Friends</span>
          <div i-ri-lightbulb-line class="md:hidden" />
        </router-link>
        <router-link to="/talks" class="lt-md:hidden" title="Talks">
          Talks
        </router-link>
        <!-- Others -->
        <ToggleTheme />
        <a href="https://github.com/abinea/abinea.me" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
      </div>
    </nav>
  </header>
</template>


<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav>* {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.7;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right>* {
  margin: auto;
}
</style>