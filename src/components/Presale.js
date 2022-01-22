import React, { useState } from 'react'
import { FaAngleDoubleDown } from 'react-icons/fa'
import { BiLoaderAlt } from 'react-icons/bi'
import { ethers } from 'ethers'

function Loader() {
    return (
        <button
            type="button"
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer  cursor-not-allowed flex flex-row items-center justify-center"
        >
            <BiLoaderAlt className="animate-spin mr-2" />
            <p className="animate-pulse">Processing... </p>
        </button>
    )
}

const contractAddress = '0xD92E713d051C37EbB2561803a3b5FBAbc4962431'
const networks = {
    rinkeby: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: 'Rinkeby Test Network',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: [
            'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        ],
        blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    },
}

const changeNetwork = async ({ networkName, setError }) => {
    try {
        if (!window.ethereum) throw new Error('No crypto wallet found')
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    ...networks[networkName],
                },
            ],
        })
    } catch (err) {
        setError(err.message)
    }
}

function Presale() {
    const [smc, setSmc] = useState(0)
    const [usdt, setUsdt] = useState(0)
    const [isProcess, setIsProcess] = useState(false)
    const [error, setError] = useState()
    const [ustdBalance, setUsdtBalance] = useState(0)
    const ethereum = window.ethereum
    const provider = new ethers.providers.Web3Provider(ethereum)
    let tempSigner = provider.getSigner()
    let abi = require('../abi/IERC20')
    const smcContract = '0xA0a285f6E742f78b8B0Cf90Fb13918d99219eeDD'
    const tokenContractAddress = '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02'
    const tokenContract = new ethers.Contract(
        tokenContractAddress,
        abi,
        tempSigner
    )

    window.ethereum.on('accountsChanged', function (accounts) {
        getCurrentAccount()
        getUserBalance()
    })

    getCurrentAccount()
    getUserBalance()

    const handleNetworkSwitch = async (networkName) => {
        setError()
        await changeNetwork({ networkName, setError })
    }

    const handleChange = (e) => {
        setSmc(e)
    }

    const handleChangeSMC = (e) => {
        setUsdt(e * 2)
    }

    async function getCurrentAccount() {
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        console.log('accounts[0]:', accounts[0])
        return accounts[0]
    }

    async function getUserBalance() {
        await tokenContract.balanceOf(getCurrentAccount()).then((x) => {
            setUsdtBalance((x / 10 ** 18).toFixed(2))
            console.log('balance', (x / 10 ** 18).toFixed(2))
        })
    }

    async function buy(smc) {
        document.getElementById('usdt').setAttribute('disabled', 'disabled')
        const tx = await tokenContract.transfer(
            smcContract,
            ethers.utils.parseUnits(smc, 18)
        )
        const receipt = await tx
            .wait(1)
            .then((x) => {
                //console.log('tx:', x)
                console.log('txHash:', x.transactionHash)
                if (x.confirmations >= 1) {
                    console.log('Confirmed:', x.confirmations)
                }
                console.log('USDT Check :', x.to) // USDT contract address
                setUsdt(0)
                getUserBalance()
                setIsProcess(false)
                setUsdtBalance(ustdBalance - smc)
                document.getElementById('usdt').removeAttribute('disabled')
            })
            .catch(() => {
                setIsProcess(false)
                document.getElementById('usdt').removeAttribute('disabled')
            })
    }

    return (
        <div className="flex flex-col justifyitem-center items-center">
            <div className="w-2/5 p-5 flex flex-col justifyitem-center items-center drop-shadow-lg rounded-3xl text-black bg-gray-900">
                <div className="rounded-2xl border border-[#3d4f7c] w-full">
                    <div className=" w-full flex justify-between my-0">
                        <p className="text-slate-500 text-xs p-3">From</p>{' '}
                        <p className="text-slate-500 text-xs p-3"></p>
                    </div>
                    <div className=" w-full flex justify-between">
                        <p className="p-3 text-lg text-slate-500">USDT</p>
                        <input
                            name="message"
                            placeholder="USDT"
                            id="usdt"
                            type="number"
                            step="1"
                            min="1"
                            onChange={(e) => handleChange(e.target.value)}
                            className="my-2 w-2/5 active:outline-non rounded-sm p-2 outline-non bg-transparent text-slate-500 border-none text-3xl font-bold"
                        />
                    </div>
                    <div className=" w-full flex justify-between my-0">
                        <p className="text-slate-500 text-sm p-3">Balance </p>{' '}
                        <p className="text-slate-500 text-sm p-3">
                            ${ustdBalance}
                        </p>
                    </div>
                </div>

                <FaAngleDoubleDown fontSize={28} color="white" />

                <div className="rounded-2xl border border-[#3d4f7c] w-full">
                    <div className=" w-full flex justify-between my-0">
                        <p className="text-slate-500 text-xs p-3">To</p>{' '}
                        <p className="text-slate-500 text-xs p-3"></p>
                    </div>
                    <div className=" w-full flex justify-between">
                        <p className="p-3 text-lg text-slate-500">SMC</p>
                        <input
                            disabled
                            name="message"
                            placeholder="SMC"
                            id="usdt"
                            type="text"
                            min="0"
                            value={smc * 50}
                            onChange={(e) => e.target.value}
                            className="my-2 w-2/5 active:outline-non rounded-sm p-2 outline-non bg-transparent text-slate-500 border-none text-3xl font-bold"
                        />
                    </div>
                </div>
                {isProcess ? (
                    <Loader />
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setIsProcess(true)
                            buy(smc)
                        }}
                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-[#A9A9A9]"
                    >
                        Book Now
                    </button>
                )}
            </div>
        </div>
    )
}

export default Presale
