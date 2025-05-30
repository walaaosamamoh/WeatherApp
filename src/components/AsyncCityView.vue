<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white p-4 w-full text-center bg-weather-scondary"
    >
      You are currently previewing this city, click the "+" icon to start
      tracking this city.
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.dt * 1000).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.dt * 1000).toLocaleTimeString("en-us", {
            timeStyle: "short",
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
    <hr class="w-full border border-white border-opacity-10" />
    <!-- Hourly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div
            v-for="hour in forecastData.list.slice(0, 8)"
            :key="hour.dt"
            class="flex flex-col gap-4 items-center"
          >
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hour.dt * 1000).toLocaleTimeString("en-us", {
                  hour: "numeric",
                  hour12: true,
                })
              }}
            </p>
            <img
              :src="`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
              alt=""
              class="w-auto h-[50px] object-cover"
            />
            <p class="text-xl">{{ Math.round(hour.main.temp) }}&deg</p>
          </div>
        </div>
      </div>
    </div>
    <hr class="w-full border border-white border-opacity-10" />
    <!-- Weekly Weather -->
    <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Weekly Forecast</h2>
        <div
          v-for="day in forecastData.daily"
          :key="day.dt"
          class="flex items-center"
        >
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <img
            class="w-[50px] h-[50px] object-cover"
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
            alt="daily icon"
          />
          <div class="flex gap-2 flex-1 justify-end">
            <p>H: {{ Math.round(day.temp.max) }}</p>
            <p>L: {{ Math.round(day.temp.min) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const apiKey = "5d96731c2640185932bfa687657372ff";

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${route.query.lat}&lon=${route.query.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`
    );

    return weatherData.data;
  } catch (err) {
    console.log(err);
  }
};

const getForecastData = async () => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${route.query.lat}&lon=${route.query.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`
    );

    const forecastData = res.data;

    // Group forecast list into days
    const dailyForecast = {};

    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toDateString(); // Group by date

      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp: {
            max: entry.main.temp_max,
            min: entry.main.temp_min,
          },
          weather: entry.weather,
          dt: entry.dt,
        };
      } else {
        dailyForecast[date].temp.max = Math.max(
          dailyForecast[date].temp.max,
          entry.main.temp_max
        );
        dailyForecast[date].temp.min = Math.min(
          dailyForecast[date].temp.min,
          entry.main.temp_min
        );
      }
    });

    // Convert map to array
    forecastData.daily = Object.values(dailyForecast);

    return forecastData;
  } catch (err) {
    console.log(err);
  }
};
const weatherData = await getWeatherData();
const forecastData = await getForecastData();

const router = useRouter();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({
    name: "home",
  });
};
</script>
