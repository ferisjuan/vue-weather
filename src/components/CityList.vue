<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>

  <p v-if="savedCities.length === 0">
    No locations added. To start tracking a location, search in the field above.
  </p>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
import CityCard from "./CityCard.vue";

const savedCities = ref([]);

const getCities = async () => {
  const SAVED_CITIES_KEY = "savedCities";
  const localStorageSavedCities = localStorage.getItem(SAVED_CITIES_KEY);

  if (localStorageSavedCities) {
    savedCities.value = JSON.parse(localStorageSavedCities);

    const requests = [];
    savedCities.value.forEach((city) => {
      const url = new URL("https://api.openweathermap.org/data/2.5/weather");
      url.searchParams.set("lat", city.coords.lat);
      url.searchParams.set("lon", city.coords.lon);
      url.searchParams.set("appid", import.meta.env.VITE_OPEN_WEATHER_API_KEY);
      url.searchParams.set("units", "metric");
      requests.push(axios.get(url));
    });

    const weatherData = await Promise.all(requests);

    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value.data;
    });
  }
};

await getCities();

const router = useRouter();
const goToCityView = (city) => {
  router.push({
    name: "cityView",
    params: {state: city.state, city: city.city},
    query: {id: city.id, lat: city.coords.lat, lon: city.coords.lon},
  });
};
</script>
