import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Register from "@/views/Register";
import Login from "@/views/Login";
import BookView from "@/views/BookView";
import ReadView from "@/views/ReadView";
import LikeBooks from "@/views/LikeBooks";
import Reports from "@/views/Reports";
import Settings from "@/views/Settings";
import Profile from "@/views/Profile";
import LogOut from "@/views/LogOut.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    params: true,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/logOut",
    name: "logout",
    component: LogOut,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/reports",
    name: "report",
    component: Reports,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
  {
    path: "/fav",
    name: "favorite",
    component: LikeBooks,
  },
  {
    path: "/book/view/:id",
    name: "bookview",
    component: BookView,
  },
  {
    path: "/book/read/:id/:name",
    name: "readview",
    component: ReadView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
