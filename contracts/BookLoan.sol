// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract BookLoan {
    address public owner;

    struct Book {
        uint256 id;
        string title;
        string author;
        address currentHolder;
        bool isLoaned;
    }

    uint256 public nextBookId;
    mapping(uint256 => Book) public books;

    event BookRegistered(uint256 indexed bookId, string title, string author, address indexed registrant);
    event BookLoaned(uint256 indexed bookId, address indexed borrower);
    event BookReturned(uint256 indexed bookId, address indexed returnee);

    constructor() {
        owner = msg.sender;
    }

    // Registriraj knjigu
    function registerBook(string memory title, string memory author) public {
        books[nextBookId] = Book(nextBookId, title, author, msg.sender, false);
        emit BookRegistered(nextBookId, title, author, msg.sender);
        nextBookId++;
    }

    // Posudi knjigu
    function loanBook(uint256 bookId) public {
        require(!books[bookId].isLoaned, "Book is already loaned");
        books[bookId].isLoaned = true;
        books[bookId].currentHolder = msg.sender;
        emit BookLoaned(bookId, msg.sender);
    }

    // Vrati knjigu
    function returnBook(uint256 bookId) public {
        require(books[bookId].isLoaned, "Book is not loaned");
        require(books[bookId].currentHolder == msg.sender, "You are not holding this book");
        books[bookId].isLoaned = false;
        emit BookReturned(bookId, msg.sender);
    }
}
