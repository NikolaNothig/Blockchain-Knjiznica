import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BooksOverview from '../components/BooksOverview.vue';
import BookRegister from '../components/BookRegister.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/books-overview',
    name: 'BooksOverview',
    component: BooksOverview
  },
  {
    path: '/book-register',  // Define the path for registering books
    name: 'BookRegister',
    component: BookRegister  // Assign the BookRegister component to the route
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
