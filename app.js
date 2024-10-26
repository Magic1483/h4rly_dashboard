

const contractAddress = "0x9f3E1281e46Bfb73278a2c82fBc2B895Fa80B615";
const contractABI = [ 
    "function contribute() public payable", 
    "function getBalance() public view returns (uint)", 
    "function withdraw() public",
    "function getUserCount() public view returns (uint)",
    "function getUserByIndex(uint _ind) public view returns (address)",
    "function getUserDonationsByIndex(uint _ind) public view returns (uint)",
    "function getAdminAddress() public view returns(address)",

    "event UpdateDonationsEvent(address indexed addr, uint amount)",
    "event WithdrawEvent()"
];

let provider;
let signer;
let currentAccount;
let fundMeContract;

let is_button_active = true


const get_my_balance = async (provider, account) => {
    const balance = await provider.getBalance(account)
    document.getElementById('mybalance').innerText = `Balance: ${parseFloat(ethers.utils.formatEther(balance)).toFixed(4)} ETH\n for account ${account}`;
}

const get_donation_rating = async (fundMeContract) => {
    const all_users = await fundMeContract.getUserCount()

    const ratings = []
    for (let i = 0; i < all_users; i++) {
        const user = await fundMeContract.getUserByIndex(i);
        const donate_amount = await fundMeContract.getUserDonationsByIndex(i);
        ratings.push({user,rating: ethers.utils.formatEther(donate_amount).toString()})
    }

    ratings.sort((a,b) => b.rating - a.rating);
    // ratings.forEach((entry, index) => {
    //     console.log(`${index + 1}. User: ${entry.user}, Donate_amount: ${entry.rating}`);
    // });

    const tbody = document.getElementById('rating_table').querySelector('tbody');
    tbody.innerHTML = ""
    
    ratings.forEach((entry,ind) => {
        // console.log(currentAccount.toLowerCase(),entry.user.toLowerCase());
        
        let row
        // check current account and mark
        if (entry.user.toLowerCase() === currentAccount.toLowerCase()) {
            row = `<tr class="font-bold" id="${entry.user}" >
                <td>${entry.user}</td>
                <td>${entry.rating}</td>
            </tr>`
        } else {
            row = `<tr id="${entry.user}">
                <td>${entry.user}</td>
                <td>${entry.rating}</td>
            </tr>`
        }
        
        tbody.innerHTML += row
    })
}



async function connectMetamask() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // console.log('accounts\n',accounts);
            
            // set provider
            // provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
            provider = new ethers.providers.Web3Provider(window.ethereum)
            provider.on("network",async (Network)=>{
                if (Network['chainId'] != 11155111){
                    await handleError("Wrong network!","please use Sepolia network")
                    return
                }
                console.log('Network changed ',Network);
                
            })

            signer = provider.getSigner(accounts[0]) // get signer for selected account

            currentAccount = await signer.getAddress() // signer address
            // console.log('signer addr',currentAccount);
            
            
            console.log("Connected account:", currentAccount);

            // Create contract instance with the initial signer
            fundMeContract = new ethers.Contract(contractAddress,contractABI,signer)

            
            fundMeContract.on('UpdateDonationsEvent',async (addr,amount) => {
                console.log(`addr ${addr} amount ${amount}`);
                await getBalance()
                await get_donation_rating(fundMeContract)
                
            })

            fundMeContract.on('WithdrawEvent',async () => {
                console.log(`Withdraw completed`);
                await getBalance()
                await get_my_balance(provider,currentAccount)
                await get_donation_rating(fundMeContract)
            })

            

            
            // await setAdminAddr()
            // update UI
            await handleAccountChange()

            await getBalance()
            await get_my_balance(provider,currentAccount)
            await get_donation_rating(fundMeContract)
            

            
        } catch (err) {
            console.error("Metamask connection failed", err);
        }
        

    } else {
        console.log('скачай метамаск сука!!');
    }
}


async function handleAccountChange() {
    window.ethereum.on('accountsChanged', async (accounts) => {
        console.log(accounts[0]);
        
        if (accounts.length === 0){
            console.log("MetaMask is locked or no accounts are available.");
            disconnectMetaMask();
        } else {
            signer = provider.getSigner(accounts[0])
            currentAccount = accounts[0]
            fundMeContract = fundMeContract.connect(signer) // update signer for contract

            // update UI
            await get_my_balance(provider,currentAccount) //update balance
            await get_donation_rating(fundMeContract)
        }
    })
}


async function disconnectMetaMask() {
    provider = null
    signer = null
    currentAccount = null

    console.log('Disconnect metamask');
    
}


async function contribute() {
    if (fundMeContract === null) return

    const amount = document.getElementById("donate_amount").value
    if (amount > 0){
        try{
            

            const tx = await fundMeContract.contribute({ value: ethers.utils.parseEther(amount) });
            document.getElementById("donate_amount").value = ""
            await tx.wait();
            await get_my_balance(provider,currentAccount) // redraw my balance
            await get_donation_rating(fundMeContract) //redraw table
            await getBalance()

            
        } catch (err) {
            console.error(err);
            handleError("Donate error!","Not enough funds")
            
        }
        
    }

}


async function getBalance() {
    if (fundMeContract === null) return
    
    const all_users = await fundMeContract.getUserCount()
    if (all_users > 0){
        await get_donation_rating(fundMeContract)
    }

    const balance = await fundMeContract.getBalance();
    document.getElementById('balance').innerText = `FundMe balance: ${ethers.utils.formatEther(balance)} ETH`;
}

async function withdraw() {
    if (fundMeContract === null) return
    
    try {
        await fundMeContract.withdraw()
    } catch (err) {
        console.log('Withdraw error: Only admin can withdraw');
        await handleError('Withdraw error !',"Only admin can withdraw")
    }

}

const setAdminAddr = async () => {
    if (fundMeContract === null) return
    const admin_addr = await fundMeContract.getAdminAddress()
    // console.log('admin addr: ',admin_addr);
    document.getElementById('admin_addr').textContent = admin_addr;
}



const main = async () => {
    if (window.ethereum){

        document.getElementById('withdraw').addEventListener('click', async () => {
            if (is_button_active) await withdraw()
            
            
        }); 

        document.getElementById('contribute').addEventListener('click', async () => {
            if (is_button_active) await contribute()
        }); 


        document.getElementById('connect').addEventListener('click', async () => {
            if (is_button_active) await connectMetamask()
        });
        

        
    } else {
        console.log('metamask not found');
    }
}


main()


