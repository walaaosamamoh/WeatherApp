<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:outline-none focus:shadow-[0px_1px_0_0_#004E71] focus:border-weather-scondary"
      />

      <ul
        v-if="openweathermapRsults"
        class="absolute bg-weather-scondary text-white w-full shadow-md top-[66px]"
      >
        <p class="py-2 px-1" v-if="searchError">
          Sorry, something went wrong, please try again.
        </p>
        <p
          class="py-2 px-1"
          v-else-if="
            !searchError && searchQuery && openweathermapRsults.length === 0
          "
        >
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="(searchResult, index) in openweathermapRsults"
            :key="index"
            @click="previewCity(searchResult)"
            class="py-2 cursor-pointer px-1"
          >
            {{ searchResult.name }}, {{ searchResult.state || "" }},
            {{ searchResult.country }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";

const router = useRouter();

const previewCity = (searchResult) => {
  console.log(searchResult);
  const city = searchResult.name;
  const state = searchResult.state;
  router.push({
    name: "cityView",
    params: { state: state, city: city },
    query: {
      lat: searchResult.lat,
      lon: searchResult.lon,
      preview: true,
    },
  });
};

const searchQuery = ref("");
const queryTimeout = ref(null);
const openweathermapRsults = ref([]);
const searchError = ref(false);
const apiKey = "5d96731c2640185932bfa687657372ff";

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=
                ${searchQuery.value}&limit=5&appid=${apiKey}`
        );
        openweathermapRsults.value = result.data;
        console.log(openweathermapRsults.value);
        console.log(openweathermapRsults.value.length);
      } catch {
        searchError.value = true;
      }
      return;
    }
    openweathermapRsults.value = [];
  }, 300);
};
</script>
