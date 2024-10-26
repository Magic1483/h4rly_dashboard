/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const {API_URL, PRIVATE_KEY} = process.env

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
    // localhost: {
    //   url: "http://127.0.0.1:8545",
    //   accounts: [process.env.prive_key]
    // },
  }
};