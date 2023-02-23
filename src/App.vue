<template>
  <section class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <SiteNavigation />
    <RouterView v-slot="{Component}">
      <Transition name="page" mode="out-in">
        <component :is="Component"/>
      </Transition>
    </RouterView>
  </section>
</template>

<script setup>
import {Transition} from 'vue';
import {RouterView} from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
</script>
