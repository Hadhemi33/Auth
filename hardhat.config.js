require('@nomicfoundation/hardhat-toolbox');
// Ensure your configuration variables are set before executing the script
// const { vars } = require('hardhat/config');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/cf8c01ab331948e4b5df67110ae6d7a1', // Infura or Alchemy URL
      // accounts: '0x4E5822E47189ECBE52B22Ac91eDaEb3f7665F47E', // Your wallet private key
      accounts: [
        'dfe47c099fffd0458fc770a60b54da8ae9bdeff3832995db87822171dbd9f973',
      ],
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
