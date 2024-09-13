import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BooksOverview from '../components/BooksOverview.vue';
import BookRegister from '../components/BookRegister.vue';
import BookLoan from '../components/BookLoan.vue';  // Import the BookLoan component
import BookReturn from '../components/BookReturn.vue';  // Import the BookReturn component

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
    path: '/book-register',
    name: 'BookRegister',
    component: BookRegister
  },
  {
    path: '/book-loan',  // Define the path for loaning books
    name: 'BookLoan',
    component: BookLoan  // Assign the BookLoan component to the route
  },
  {
    path: '/book-return',  // Define the path for returning books
    name: 'BookReturn',
    component: BookReturn  // Assign the BookReturn component to the route
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
