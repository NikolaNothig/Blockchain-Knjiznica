const { expect } = require('chai');

describe("BookLoan Contract", function() {
  let BookLoan;
  let bookLoan;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function() {
    // Get the ContractFactory and Signers here.
    BookLoan = await ethers.getContractFactory("BookLoan");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new contract before each test.
    bookLoan = await BookLoan.deploy();
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await bookLoan.owner()).to.equal(owner.address);
    });
  });

  describe("Registration and Retrieval", function() {
    it("Should register and retrieve a book", async function() {
      await bookLoan.registerBook("1984", "George Orwell");
      const book = await bookLoan.books(0);
      expect(book.title).to.equal("1984");
      expect(book.author).to.equal("George Orwell");
      expect(book.currentHolder).to.equal(owner.address);
      expect(book.isLoaned).to.equal(false);
    });
  });

  describe("Loaning and Returning", function() {
    it("Should allow a book to be loaned and returned", async function() {
      await bookLoan.registerBook("1984", "George Orwell");

      // Use addr1 to loan the book
      await bookLoan.connect(addr1).loanBook(0);
      let book = await bookLoan.books(0);
      expect(book.isLoaned).to.equal(true);

      // Use addr1 to return the book
      await bookLoan.connect(addr1).returnBook(0);
      book = await bookLoan.books(0);
      expect(book.isLoaned).to.equal(false);
    });
  });
});
