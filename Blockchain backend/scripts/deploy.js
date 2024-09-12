async function main() {
    const BookLoan = await ethers.getContractFactory("BookLoan");
    const bookLoan = await BookLoan.deploy();

    console.log("BookLoan deployed to:", bookLoan.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
