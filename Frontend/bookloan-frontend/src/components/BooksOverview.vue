<template>
    <div>
      <div v-if="currentAccount">
        Current User: {{ currentAccount }}
      </div>
      <div v-else>
        No user detected.
      </div>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/books-overview">Books Overview</router-link> |
        <router-link to="/book-register">Register Book</router-link> |
        <router-link to="/book-loan">Loan Book</router-link> |
        <router-link to="/book-return">Return Book</router-link>
      </nav>
      <h1>Books Overview</h1>
      <div v-if="books.length">
        <ul>
          <li v-for="book in books" :key="book.id">
            ID: {{ book.id }}, Title: {{ book.title }}, Author: {{ book.author }},
            Current Holder: {{ book.currentHolder || 'None' }},
            Loaned: {{ book.isLoaned ? 'Yes' : 'No' }}
          </li>
        </ul>
      </div>
      <div v-else>
        There are no registered books.
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { ethers } from 'ethers';
  import bookLoanContract from '@/ethereum/bookLoan.js';  // Ensure the path is correct
  
  export default {
    name: 'BooksOverview',
    setup() {
      const currentAccount = ref(null);
      const books = ref([]);
  
      // Function to fetch all the books
      const fetchBooks = async () => {
        const totalBooks = await bookLoanContract.nextBookId();
        const bookFetchPromises = [];
  
        for (let i = 0; i < totalBooks; i++) {
          bookFetchPromises.push(bookLoanContract.books(i));
        }
  
        const booksResult = await Promise.all(bookFetchPromises);
        books.value = booksResult.map(book => ({
          id: book.id.toString(),
          title: book.title,
          author: book.author,
          currentHolder: book.currentHolder === ethers.constants.AddressZero ? null : book.currentHolder,
          isLoaned: book.isLoaned
        }));
      };
  
      // Fetch current account and books on component mount
      onMounted(async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          currentAccount.value = accounts[0];
        }
  
        await fetchBooks();
      });
  
      return {
        currentAccount,
        books
      };
    }
  };
  </script>
  
  <style scoped>
  nav {
    padding: 10px 0;
    background-color: #f4f4f4;
    margin-bottom: 20px;
  }
  
  nav a {
    padding: 10px;
    margin-right: 10px;
    text-decoration: none;
    color: #333;
  }
  
  nav a.router-link-exact-active {
    color: #42b983;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    background-color: #eee;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #367c59;
  }
  
  button[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  