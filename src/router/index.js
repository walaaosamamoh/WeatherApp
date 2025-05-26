import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import CityView from "../views/CityView.vue";
// import Services from '../views/Services.vue'
// import Contact from '../views/Contact.vue'

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/weather/:state/:city",
    name: "cityView",
    component: CityView,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
