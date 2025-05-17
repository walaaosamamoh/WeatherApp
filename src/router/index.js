import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue'
// import About from '../views/About.vue'
// import Services from '../views/Services.vue'
// import Contact from '../views/Contact.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    }
  // {
  //     path: '/about',
  //     name: 'about',
  //     component: About
  // },
  // {
  //     path: '/services',
  //     name: 'services',
  //     component: Services
  // },
  // {
  //     path: '/contact',
  //     name: 'contact',
  //     component: Contact
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
