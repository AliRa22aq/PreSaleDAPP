const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config()

// const fs = require('fs');
const mnemonic = "quit nation parade clever tuna salon visa vital install picnic salmon hold";


module.exports = {

  // networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    //   provider: () => new HDWalletProvider(process.env.mnemonic, `https://ropsten.infura.io/v3/d9fb7fe853c94891811d279e8055defe`),
    //   network_id: 3,       // Ropsten's id
    //   gas: 5500000,        // Ropsten has a lower block limit than mainnet
    //   confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard BSC port (default: none)
      network_id: "*",       // Any network (default: none)
    },
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
// bscTestnet: {

//   provider: () => new HDWalletProvider(mnemonic, `https://speedy-nodes-nyc.moralis.io/bcf0017bb895dcaaa02ec143/bsc/testnet`),
//   network_id: 97,       // Ropsten's id
//   gas: 5500000,        // Ropsten has a lower block limit than mainnet
//   confirmations: 10,    // # of confs to wait between deployments. (default: 0)
//   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
//   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )

// },
// testnet: {
//   provider: () => new HDWalletProvider(process.env.mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
//   network_id: 97,
//   confirmations: 10,
//   timeoutBlocks: 200,
//   skipDryRun: true
// },
// bsc: {
//   provider: () => new HDWalletProvider(process.env.mnemonic, `https://bsc-dataseed1.binance.org`),
//   network_id: 56,
//   confirmations: 10,
//   timeoutBlocks: 200,
//   skipDryRun: true
// },
