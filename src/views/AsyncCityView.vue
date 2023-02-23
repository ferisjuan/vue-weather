<template>
  <div class="flex flex-col flex-1 items-center">
    <div
      v-if="query.preview"
      class="text-white p-4 bg-weather-secondary w-full text-cet"
    >
      <p class="text-center">
        You are currenly previewing this city, click the "+" icon to start
        tracking this city.
      </p>
    </div>

    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
      </p>
      <p class="text-8xl mb-8">{{ Math.round(weatherData.main.temp) }}&deg;</p>
      <p>Feels like {{ Math.round(weatherData.main.feels_like) }}&deg;</p>
      <p class="capitalize">{{ weatherData.weather[0].description }}</p>
      <img
        class="w-[150px] h-auto"
        :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
        alt=""
      />
    </div>

    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-400"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash" />
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const {params, query} = useRoute();

const getWeatherData = async () => {
  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");

    url.searchParams.set("lat", query.lat);
    url.searchParams.set("lon", query.lon);
    url.searchParams.set("appid", import.meta.env.VITE_OPEN_WEATHER_API_KEY);
    url.searchParams.set("units", "metric");

    const weatherData = await axios.get(url.href);

    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.dt * 1000 + localOffset;

    weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone;

    return weatherData.data;
  } catch (error) {
    console.log(error);
  }
};

const weatherData = await getWeatherData();

const router = useRouter();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  console.log('🚀 ~ removeCity ~ cities:', cities);

  const updatedCities = cities.filter(city => city.id !== query.id);

  localStorage.setItem("savedCities", JSON.stringify(updatedCities));

  router.push({
    name: "home",
  });
};
</script>
