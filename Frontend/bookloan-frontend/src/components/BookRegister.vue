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
      <h1>Register a New Book</h1>
      <form @submit.prevent="registerBook">
        <input v-model="newBook.title" placeholder="Book Title" required>
        <input v-model="newBook.author" placeholder="Author Name" required>
        <button type="submit">Register Book</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import bookLoanContract from '@/ethereum/bookLoan.js';  
  import { ethers } from 'ethers';
  
  export default {
    name: 'BookRegister',
    setup() {
      const currentAccount = ref(null);
      const newBook = ref({ title: '', author: '' });
  
      const registerBook = async () => {
        if (!newBook.value.title || !newBook.value.author) {
          alert('Both title and author are required.');
          return;
        }
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();  // Fetch the current signer dynamically
          const contractWithSigner = bookLoanContract.connect(signer); // Connect contract with dynamic signer
          
          const tx = await contractWithSigner.registerBook(newBook.value.title, newBook.value.author);
          await tx.wait();
          
          alert('Book registered successfully!');
          newBook.value = { title: '', author: '' }; // Reset the form
        } catch (error) {
          console.error('Failed to register the book:', error);
          alert('Failed to register the book.');
        }
      };
  
      onMounted(async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          currentAccount.value = accounts[0];
        }
  
        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts.length > 0) {
            currentAccount.value = accounts[0];
          } else {
            currentAccount.value = null;
          }
        });
      });
  
      return {
        currentAccount,
        newBook,
        registerBook
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
  
  input {
    margin: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px 20px;
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
  