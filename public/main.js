const ContractId = "0x9d63950284A3F9Ff92CF71e048630c57C6dAc93D";

const isConnected = () => {

    if (!window.ethereum) {
        return false;
    }

    return ethereum.isConnected();
}

const payment = async (account) => {
    const amount = document.getElementById('amount').value;
    const orderId = document.getElementById('orderId').value;

    const weiValue = Web3.utils.toWei(amount, 'ether');

    const web3 = new Web3(window.ethereum);
    const myContract = new web3.eth.Contract(abi, ContractId, {
        from: account,
        value: weiValue
    });

    myContract.methods.paymentOrder(orderId).send({
        from: account,
        value: weiValue
    }, (error, transactionHash) => {
        if (error) {
            return;
        }

        //Можно отправить на сервер потом сдедить за подтверждением    
        alert(`Операция ${transactionHash} успешно прошла`)
    });
}

const rendering = (accounts) => {
    const root = document.getElementById('root');

    const div = document.createElement('div');

    const labelId = document.createElement('label');
    labelId.innerText = "Ордер ID"

    const inputId = document.createElement('input');
    inputId.setAttribute('id', 'orderId');

    const labelAmount = document.createElement('label');
    labelAmount.innerText = "Amount"

    const inputAmount = document.createElement('input');
    inputAmount.setAttribute('id', 'amount');

    const button = document.createElement('button');
    button.innerText = "Оплатить"
    button.addEventListener('click', () => { payment(accounts[0]) })

    const elements = [labelId, inputId, labelAmount, inputAmount, button]

    elements.forEach(e => {
        const subdDiv = document.createElement('div');
        subdDiv.appendChild(e);
        div.appendChild(subdDiv);
    })

    root.appendChild(div);
}

window.addEventListener('DOMContentLoaded', async () => {

    if (!isConnected()) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            rendering(accounts);
        }
        catch {
            const root = document.getElementById('root');
            const div = document.createElement('div');
            div.innerHTML = "Не удалось авторизоваться";
            root.appendChild(div);
        }
    }
})



const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "outputMoney",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "paymentOrder",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "PaymentOrder",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "revertOrder",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "RevertOrder",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "orders",
        "outputs": [
            {
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "revert",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]