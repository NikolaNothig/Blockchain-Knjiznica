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
console.log("Ethers object:", ethers);
console.log("Ethers providers:", ethers.providers);


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
      try {
        console.log("Starting initialization of ethers...");
        this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        console.log("Provider initialized:", this.provider);
        this.signer = this.provider.getSigner();
        console.log("Signer obtained:", this.signer);
        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        const abi = [
          "function registerBook(string memory title, string memory author) public",
          "function loanBook(uint256 bookId) public",
          "function returnBook(uint256 bookId) public",
          "function books(uint256) public view returns (uint256, string memory, string memory, address, bool)",
          "function nextBookId() public view returns (uint256)"
        ];
        this.contract = new ethers.Contract(contractAddress, abi, this.signer);
        console.log("Contract initialized:", this.contract);
        await this.loadBooks();
      } catch (error) {
        console.error("Failed to initialize ethers:", error);
      }
    },
    async registerBook() {
      try {
        console.log("Attempting to register a book:", this.title, this.author);
        await this.contract.registerBook(this.title, this.author);
        await this.loadBooks();
      } catch (error) {
        console.error("Error registering book:", error);
      }
    },
    async loanBook(bookId) {
      try {
        console.log("Attempting to loan a book:", bookId);
        await this.contract.loanBook(bookId);
        await this.loadBooks();
      } catch (error) {
        console.error("Error loaning book:", error);
      }
    },
    async returnBook(bookId) {
      try {
        console.log("Attempting to return a book:", bookId);
        await this.contract.returnBook(bookId);
        await this.loadBooks();
      } catch (error) {
        console.error("Error returning book:", error);
      }
    },
    async loadBooks() {
      try {
        console.log("Loading books from the contract...");
        const bookCount = await this.contract.nextBookId();
        console.log("Number of books registered:", bookCount.toString());
        const bookPromises = [];
        for (let i = 0; i < bookCount; i++) {
          bookPromises.push(this.contract.books(i));
        }
        const booksData = await Promise.all(bookPromises);
        this.books = booksData.map((book, index) => ({
          id: index,
          title: book[1],
          author: book[2],
          currentHolder: book[3],
          isLoaned: book[4]
        }));
        console.log("Books loaded:", this.books);
      } catch (error) {
        console.error("Error loading books:", error);
      }
    }
  }
};
</script>
