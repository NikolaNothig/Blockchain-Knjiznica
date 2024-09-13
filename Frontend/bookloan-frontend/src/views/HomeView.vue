<template>
    <div>
      <h1>Welcome to BookLoan</h1>
      <div v-if="userAddress">
        Current MetaMask User: {{ userAddress }}
      </div>
      <div v-else>
        MetaMask not connected or not installed.
      </div>
      <button @click="loginWithMetaMask">Connect with MetaMask</button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { ethers } from 'ethers';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'HomeView',
    setup() {
      const router = useRouter();
      const userAddress = ref(null);
  
      const loginWithMetaMask = async () => {
        if (typeof window.ethereum !== 'undefined') {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
  
            // Request accounts from MetaMask, this triggers MetaMask to open if accounts are not already connected
            await provider.send("eth_requestAccounts", []);
  
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
              userAddress.value = accounts[0]; // Set the user address
              router.push({ name: 'BooksOverview' }); // Navigate after successful account connection
            }
          } catch (error) {
            console.error("Failed to login with MetaMask:", error);
          }
        } else {
          console.error('MetaMask is not installed. Please install it to use this app.');
        }
      };
  
      return {
        userAddress,
        loginWithMetaMask,
      };
    }
  };
  </script>
  