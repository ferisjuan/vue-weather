import {createRouter, createWebHistory} from "vue-router";
import CitiView from "../views/CityView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home",
      },
    },
    {
      path: "/weather/:state/:city",
      name: "cityView",
      component: CitiView,
      meta: {
        title: "Weather",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const place = to.params.state
    ? `${to.params.city}, ${to.params.state}`
    : to.meta.title;

  document.title = `${place} | The Local Weather`;

  next();
});

export default router;
