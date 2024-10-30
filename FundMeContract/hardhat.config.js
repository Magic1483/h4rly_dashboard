/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const {API_URL, PRIVATE_KEY,LH_PRIVATE_KEY} = process.env

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "localhost",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${LH_PRIVATE_KEY}`]
    },
  }
};