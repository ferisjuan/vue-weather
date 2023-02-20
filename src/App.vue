<template>
  <main class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <SiteNavigation />
    <RouterView />
  </main>
</template>

<script setup>
import {RouterView} from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
</script>
