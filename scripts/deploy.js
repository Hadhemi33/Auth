const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // Specify the bidding time for the auction (e.g., 24 hours)
  const biddingTime = 60 * 60 * 24;
  // Get the ContractFactory of your Contract
  const Auction = await hre.ethers.getContractFactory('Auction');

  // Deploy the contract with the required argument
  const auction = await Auction.deploy(biddingTime);

  // Wait for the deployment transaction to be mined
  const dep = await auction.waitForDeployment();

  console.log('Auction contract deployed to:', auction.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
