const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config()

// const fs = require('fs');
const mnemonic = "quit nation parade clever tuna salon visa vital install picnic salmon hold";


module.exports = {
    contracts_build_directory: "../src/abis", 
    networks: {
      development: {
        host: "127.0.0.1",     // Localhost (default: none)
        port: 7545,            // Standard BSC port (default: none)
        network_id: "*",       // Any network (default: none)
        gasPrice: 20000000000
      },
      testnet: {
        provider: () => new HDWalletProvider(process.env.mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
        network_id: 97,
        confirmations: 10,
        timeoutBlocks: 200,
        skipDryRun: true
      }
  },
    
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1
        }
      }
      //  evmVersion: "byzantium"
      // }
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "CAD",
      // coinmarketcap: "fc271b40-94b0-4605-8d66-675171124d18"
    },
  },
  
};
