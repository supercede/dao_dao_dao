import "@typechain/hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    // DEVELOPMENT BLOCKCHAINS
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
  },
  namedAccounts: {
    alice: {
      default: 0, // INDEX for the deployer's account in the array of accounts that Hardhat gives us.
    },
  },
};

export default config;
