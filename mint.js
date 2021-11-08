const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')

const MNEMONIC = "";
const INFURA_KEY = "e982b8dc204e4b2491e4f2ad28264673"
let NFT_CONTRACT_ADDRESS = "0x90bcE93ab9c03776b8FB33fcc49eAAa116f061cF"
let OWNER_ADDRESS = "0x9d88aE48A858594BdE74072f84698cF142B58873"
const NETWORK = "rinkeby"
const NUM_TOKENS = 1
const proof = require('./zokrates/code/square/proof.json');
const CONTRACT_FILE = require('./eth-contracts/build/contracts/SolnSquareVerifier.json');
const NFT_ABI = CONTRACT_FILE.abi;

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}


async function main() {
    const provider = new HDWalletProvider(MNEMONIC,`https://${NETWORK}.infura.io/v3/${INFURA_KEY}`);
    const web3Instance = new web3(provider);
  
    if (NFT_CONTRACT_ADDRESS) {
      const token = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, {gasLimit: "1000000",});
      for (let i = 0; i < NUM_TOKENS; i++) {
        try {
          console.log("OWNER_ADDRESS " + OWNER_ADDRESS + "\n");
          console.log("i " + i + "\n");

          let tx = await token.methods
          .mint( proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, 1)
          .send({ from: OWNER_ADDRESS });
          console.log("mint complete...tx hash:" + tx.transactionHash);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  
  main();