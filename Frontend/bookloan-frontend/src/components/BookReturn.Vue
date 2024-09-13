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
        <router-link to="/book-loan">Loan Book</router-link>
        <router-link to="/book-return">Return Book</router-link>
      </nav>
      <h1>Return a Book</h1>
      <ul v-if="userBooks.length">
        <li v-for="book in userBooks" :key="book.id">
          ID: {{ book.id }}, Title: {{ book.title }}, Author: {{ book.author }},
          Current Holder: {{ book.originalOwner }}
          <button @click="returnBook(book.id)">Return Book</button>
        </li>
      </ul>
      <div v-else>
        No books available to return.
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import bookLoanContract from '@/ethereum/bookLoan.js';  // Ensure the path is correct
  import { ethers } from 'ethers';
  
  export default {
    name: 'BookReturn',
    setup() {
      const currentAccount = ref(null);
      const userBooks = ref([]);
  
      const fetchUserBooks = async () => {
        const totalBooks = await bookLoanContract.nextBookId();
        const books = [];
  
        for (let i = 0; i < totalBooks; i++) {
          const book = await bookLoanContract.books(i);
          const bookHolder = book.currentHolder.toLowerCase();
          const userAccount = currentAccount.value ? currentAccount.value.toLowerCase() : null;
  
          // Only fetch books that are currently held by the user and are loaned
          if (book.isLoaned && bookHolder === userAccount) {
            const originalOwner = await bookLoanContract.owner();  // Assuming owner is the original owner
            books.push({
              id: book.id.toString(),
              title: book.title,
              author: book.author,
              originalOwner: originalOwner  // Show who the original owner is
            });
          }
        }
  
        userBooks.value = books;
      };
  
      const returnBook = async (bookId) => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();  // Fetch the current signer dynamically
          const contractWithSigner = bookLoanContract.connect(signer);  // Connect contract with dynamic signer
  
          // Ask MetaMask to return the book
          const tx = await contractWithSigner.returnBook(bookId);
          await tx.wait();
  
          alert('Book returned successfully!');
          await fetchUserBooks();  // Refresh the list after returning the book
        } catch (error) {
          console.error('Error returning the book:', error);
          alert('Failed to return the book.');
        }
      };
  
      onMounted(async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          currentAccount.value = accounts[0];
        }
  
        await fetchUserBooks();
      });
  
      return {
        currentAccount,
        userBooks,
        returnBook
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
  }
  
  li {
    padding: 8px;
    margin: 5px;
    background-color: #eee;
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
  </style>
  