const { ethers, getNamedAccounts } = require('hardhat')

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('deployer address',deployer);

    
    
    const FundMe = await ethers.getContractFactory("FundMe")
    const fund_me = await FundMe.deploy();

    console.log("deployed to: ",await fund_me.getAddress());
    
}


main()