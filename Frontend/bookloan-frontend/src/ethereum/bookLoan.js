import { ethers } from 'ethers';
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "bookId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            }
        ],
        "name": "BookLoaned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "bookId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "author",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "registrant",
                "type": "address"
            }
        ],
        "name": "BookRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "bookId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "returnee",
                "type": "address"
            }
        ],
        "name": "BookReturned",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "books",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "author",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "currentHolder",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isLoaned",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bookId",
                "type": "uint256"
            }
        ],
        "name": "loanBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextBookId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "author",
                "type": "string"
            }
        ],
        "name": "registerBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bookId",
                "type": "uint256"
            }
        ],
        "name": "returnBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Contract address after deployment on localhost
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

// Connect to the local Hardhat network using ethers.js
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
const signer = provider.getSigner();  // This will work with MetaMask, or manually handle accounts
const bookLoanContract = new ethers.Contract(contractAddress, contractABI, signer);

export default bookLoanContract;
