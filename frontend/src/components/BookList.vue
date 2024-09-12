<template>
    <div>
      <h1>Book Loan DApp</h1>
      <div>
        <input v-model="title" placeholder="Title of the book">
        <input v-model="author" placeholder="Author of the book">
        <button @click="registerBook">Register Book</button>
      </div>
      <div v-for="book in books" :key="book.id">
        <p>{{ book.title }} by {{ book.author }}</p>
        <p>Current Holder: {{ book.currentHolder }}</p>
        <p>Status: {{ book.isLoaned ? 'Loaned' : 'Available' }}</p>
        <button v-if="!book.isLoaned" @click="loanBook(book.id)">Loan Book</button>
        <button v-if="book.isLoaned" @click="returnBook(book.id)">Return Book</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ethers } from 'ethers';
  
  export default {
    data() {
      return {
        title: '',
        author: '',
        books: [],
        contract: null,
        provider: null,
        signer: null
      };
    },
    mounted() {
      this.initEthers();
    },
    methods: {
      async initEthers() {
        this.provider = new ethers.providers.JsonRpcProvider(); // Connect to the local Ethereum network
        this.signer = this.provider.getSigner(); // Get the signer (default account)
        const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
        const abi = [ // ABI of your smart contract
          "function registerBook(string memory title, string memory author) public",
          "function loanBook(uint256 bookId) public",
          "function returnBook(uint256 bookId) public",
          "function books(uint256) public view returns (uint256, string memory, string memory, address, bool)"
        ];
        this.contract = new ethers.Contract(contractAddress, abi, this.signer);
        await this.loadBooks();
      },
      async registerBook() {
        await this.contract.registerBook(this.title, this.author);
        await this.loadBooks(); // Reload the books after registering a new one
      },
      async loanBook(bookId) {
        await this.contract.loanBook(bookId);
        await this.loadBooks();
      },
      async returnBook(bookId) {
        await this.contract.returnBook(bookId);
        await this.loadBooks();
      },
      async loadBooks() {
        const bookCount = await this.contract.nextBookId();
        this.books = [];
        for (let i = 0; i < bookCount; i++) {
          const book = await this.contract.books(i);
          this.books.push({
            id: i,
            title: book[1],
            author: book[2],
            currentHolder: book[3],
            isLoaned: book[4]
          });
        }
      }
    }
  };
  </script>
  