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
        <p class="py-2" v-if="searchError">
          Sorry, something went wrong, please try agan
        </p>
        <p class="py-2" v-if="!searchError && mapboxSearchResults.lenght === 0">
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            @click="previewCity(searchResult)"
            :key="searchResult.id"
            v-for="searchResult in mapboxSearchResults"
            class="py-2 cursor-pointer"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
import CityList from "../components/CityList.vue";

const searchQuery = ref("");
const searchError = ref(null);
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value === "") mapboxSearchResults.value = null;

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
        searchQuery.value
      }.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&types=place`;

      const result = await axios.get(endpoint);

      mapboxSearchResults.value = result.data.features;
    } catch {
      searchError.value = true;
    }
  }, 300);
};

const router = useRouter();
const previewCity = (searchResult) => {
  console.log(searchResult);
  const [city, state] = searchResult.place_name.split(",");
  const [lon, lat] = searchResult.geometry.coordinates;

  router.push({
    name: "cityView",
    params: {state: state.replaceAll(" ", ""), city},
    query: {
      lat,
      lon,
      preview: true,
    },
  });
};
</script>
