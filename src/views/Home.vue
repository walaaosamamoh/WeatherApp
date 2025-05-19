<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <input type="text" v-model="searchQuery" 
            @input="getSearchResults"
            placeholder="Search for a city or state"
            class="py-2 px-1 w-full bg-transparent border-b focus:outline-none 
            focus:shadow-[0px_1px_0_0_#004E71] focus:border-weather-scondary" />

            <ul v-if="openweathermapRsults.length" class="absolute bg-weather-scondary text-white w-full shadow-md
            py-2 px-1 top-[66px]">
                <p v-if="searchError">
                    Sorry, something went wrong, please try again.
                </p>
                <p class="py-2" v-else-if="!searchError && openweathermapRsults && openweathermapRsults.length===0">
                    No results match your query, try a different term.
                </p>
                <template v-else>
                    <li v-for="(searchResult, index) in openweathermapRsults" 
                :key="index"
                class="py-2 cursor-pointer">
                    {{ searchResult.name }},
                    {{ searchResult.state || ''}},
                    {{ searchResult.country }} 
                 </li>
                </template>
            </ul>
        </div>
    </main>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';

const searchQuery = ref("");
const queryTimeout= ref(null);
const openweathermapRsults = ref([]);
const searchError = ref(null)
const apiKey= "d41b1ee92fbedbd5df397e7407400630";

const getSearchResults = ()=>{
    clearTimeout(queryTimeout.value);
    queryTimeout.value=setTimeout(async () => {
        if (searchQuery.value !== "") {
            try{
                const result = await axios.get(
                `http://api.openweathermap.org/geo/1.0/direct?q=
                ${searchQuery.value}&limit=5&appid=${apiKey}`
                );
                openweathermapRsults.value= result.data;
                console.log(openweathermapRsults.value);
            }catch{
                searchError.value = true
            }
            
            return;
        }
        openweathermapRsults.value = null
    }, 300);
}
</script>