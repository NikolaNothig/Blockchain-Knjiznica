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
      <h1>Loan a Book</h1>
      <ul v-if="availableBooks.length">
        <li v-for="book in availableBooks" :key="book.id">
          ID: {{ book.id }}, Title: {{ book.title }}, Author: {{ book.author }},
          Current Holder: {{ book.currentHolder || 'None' }}
          <!-- Button for loaning a book -->
          <button
            v-if="book.currentHolder !== currentAccount && !book.isLoaned"
            @click="loanBook(book.id)"
          >
            Loan Book
          </button>
          <!-- Button showing if the book is already loaned -->
          <button
            v-else-if="book.isLoaned"
            disabled
            style="background-color: red; color: white;"
          >
            Book already loaned
          </button>
        </li>
      </ul>
      <div v-else>
        No books available for loan.
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import bookLoanContract from '@/ethereum/bookLoan.js';  // Ensure this path is correct
  import { ethers } from 'ethers';
  
  export default {
    name: 'BookLoan',
    setup() {
      const currentAccount = ref(null);
      const availableBooks = ref([]);
  
      const fetchBooks = async () => {
        const totalBooks = await bookLoanContract.nextBookId();
        const books = [];
  
        for (let i = 0; i < totalBooks; i++) {
          const book = await bookLoanContract.books(i);
          const bookHolder = book.currentHolder.toLowerCase();
          const userAccount = currentAccount.value ? currentAccount.value.toLowerCase() : null;
  
          // Show all books except those held by the current user
          if (bookHolder !== userAccount) {
            books.push({
              id: book.id.toString(),
              title: book.title,
              author: book.author,
              currentHolder: bookHolder === ethers.constants.AddressZero ? 'None' : book.currentHolder,
              isLoaned: book.isLoaned
            });
          }
        }
  
        availableBooks.value = books;
      };
  
      const loanBook = async (bookId) => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();  // Fetch the current signer dynamically
          const contractWithSigner = bookLoanContract.connect(signer);  // Connect the contract to the signer
          
          // Ask MetaMask to loan the book
          const tx = await contractWithSigner.loanBook(bookId);
          await tx.wait();
          
          alert('Book loaned successfully!');
          await fetchBooks();  // Refresh the list after loaning
        } catch (error) {
          console.error('Error loaning the book:', error);
          alert('Failed to loan the book.');
        }
      };
  
      onMounted(async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          currentAccount.value = accounts[0];
        }
        await fetchBooks();
      });
  
      return {
        currentAccount,
        availableBooks,
        loanBook
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
  
  button[disabled] {
    background-color: red;
    cursor: not-allowed;
  }
  </style>
  