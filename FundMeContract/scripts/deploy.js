const hre = require('hardhat')

async function main() {
    const Clicker = await hre.ethers.getContractFactory("Clicker");
    const clicker = await Clicker.deploy();

    console.log('Clicker deployed at',await clicker.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1)
    })