

// Allows us to use ES6 in our migrations and tests.
require('babel-register');

const HDWalletProvider = require('truffle-hdwallet-provider');

// object used for keeping configuration rinkeby connection. 
// next line commented, for avoiding compilation errors.
// const rinkebyConfig = require('./rinkeby-config');


// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },

    rinkeby: {
      provider: ()=> {
        // rinkebyConfig uses a file that is on .gitingnore for privacy matters.
        // the revisor should replace it by his/her own configuration to make this peace of code to work.
        // next line commented, for avoiding compilation errors.
        // return new HDWalletProvider(rinkebyConfig.seed, rinkebyConfig.url);
        
        //replace string parameters
        return new HDWalletProvider('rinkebyConfig.seed', 'rinkebyConfig.url');
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000
    }

  }
}
