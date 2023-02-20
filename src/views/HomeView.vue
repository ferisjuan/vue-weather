<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
        placeholder="Search for a city or state"
        type="text"
        @input="getSearchResults"
        v-model="searchQuery"
      />
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[67px]"
        v-if="mapboxSearchResults"
      >
        <li
          v-for="searchResult in mapboxSearchResults"
          :key="searchResult.id"
          class="py-2 cursor-pointer"
        >
          {{ searchResult.place_name }}
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value === "") mapboxSearchResults.value = null;

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      searchQuery.value
    }.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&types=place`;

    const result = await axios.get(endpoint);

    console.log(mapboxSearchResults.value);
    mapboxSearchResults.value = result.data.features;
  }, 300);
};
</script>
