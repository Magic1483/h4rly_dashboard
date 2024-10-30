require('dotenv').config()
const {select ,text} = require('@clack/prompts')
const {Web3} = require('web3');


const {priv_key,contract_addr,sender_addr} = process.env
console.log(contract_addr);


const ABI = require('./contract_abi.json');
const web3 = new Web3('https://rpc.sepolia.org/')
// create contract
const contract = new web3.eth.Contract(ABI,contract_addr)



async function selectCommand() {
    const command = await select({
        message: 'Pick a project type.',
        options: [
          { value: 'mint', label: 'Mint Something' },
          { value: 'burn', label: 'Burn All' },
        ],
      });
    
      switch (command) {
        case 'mint':
            const amount = await text({
                message: 'Set amount for minting (18 decimals)',
              });
            console.log('selected amount ',amount);
            await MintSome(Number(amount))
            break;
        case 'burn':
            await burnAll()
            break;
      }
      
      
}

async function makeCall(txData) {
    const nonce = await web3.eth.getTransactionCount(sender_addr, 'latest');
    
    const tx = {
        from: sender_addr,
        to: contract_addr,
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce,
        data: txData
    }
    const signedTx = await web3.eth.accounts.signTransaction(tx,priv_key)

    console.log('signed transaction hash',signedTx['transactionHash']);
    
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => console.log(receipt));
}

async function MintSome(_amount) {
    const amount = _amount * 10 ** 18 ;
    const txData = contract.methods.mintSomething(amount).encodeABI();
    await makeCall(txData)
}

async function burnAll() {
    const txData = contract.methods.burnAll().encodeABI();
    await makeCall(txData)
}




selectCommand()