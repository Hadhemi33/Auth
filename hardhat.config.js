require('@nomicfoundation/hardhat-toolbox');
// Ensure your configuration variables are set before executing the script
// const { vars } = require('hardhat/config');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
