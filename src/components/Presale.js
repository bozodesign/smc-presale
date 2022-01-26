import React, { useEffect, useState } from 'react'
import { FaAngleDoubleDown } from 'react-icons/fa'
import { BiLoaderAlt } from 'react-icons/bi'
import { ethers } from 'ethers'
import Select from 'react-select'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

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

function Presale({ contractAddress }) {
    const [smc, setSmc] = useState(0)
    const [usdt, setUsdt] = useState(400)
    const [isProcess, setIsProcess] = useState(false)
    const [error, setError] = useState()
    const [info, setInfo] = useState()
    const [ustdBalance, setUsdtBalance] = useState(0)
    const [open, setOpen] = useState(false)
    const [focusedInput, setFocus] = useState(null)
    const [coin, setCoin] = useState('usdt')

    useEffect(() => {
        if (focusedInput == 'coin') {
            setUsdt(smc * 0.02)
        } else if (focusedInput == 'usd') {
            setSmc(usdt / 0.02)
        }
        console.log('coin:', coin)

        return () => {}
    }, [smc, usdt, focusedInput, coin])
    const handleClose = () => {
        setOpen(false)
    }
    const handleToggle = () => {
        setOpen(!open)
    }
    const ethereum = window.ethereum
    const provider = new ethers.providers.Web3Provider(ethereum)
    let tempSigner = provider.getSigner()
    let abi = require('../abi/IERC20')
    const smcContract = contractAddress
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
        //document.getElementById('usdt').setAttribute('disabled', 'disabled')
        const tx = await tokenContract
            .transfer(smcContract, ethers.utils.parseUnits(smc, 18))
            .catch((error) => {
                setIsProcess(false)
                //document.getElementById('usdt').removeAttribute('disabled')
                setError('Payment error, please check your wallet balance')
                handleClose()
            })

        setInfo('Please wait for a block confirmation')

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
                //document.getElementById('usdt').removeAttribute('disabled')

                handleClose()
                setInfo('')
            })
            .catch((error) => {
                console.log('error code:', error.code)
                console.error(error)
                setIsProcess(false)
                //document.getElementById('usdt').removeAttribute('disabled')
                handleClose()
            })
    }

    const options = [
        {
            value: 'usdt',
            label: (
                <div className="flex flex-row text-sm font-bold justify-between items-center">
                    <img src="http://smc.alotof.fun/img/coins/usdt.png" /> USDT
                </div>
            ),
        },
        {
            value: 'usdc',
            label: (
                <div className="flex flex-row text-sm font-bold justify-between items-center">
                    <img src="http://smc.alotof.fun/img/coins/usdc.png" /> USDC
                </div>
            ),
        },
    ]

    return (
        <div className="flex flex-col justifyitem-center items-center">
            <div className="w-2/5 p-5 flex flex-col justifyitem-center items-center drop-shadow-lg rounded-3xl text-black bg-gray-900">
                <div className="rounded-2xl border border-[#3d4f7c] w-full">
                    <div className=" w-full flex justify-between my-0">
                        <p className="text-slate-500 text-xs p-3">From</p>{' '}
                        <p className="text-slate-500 text-xs p-3"></p>
                    </div>
                    <div className=" w-full flex justify-between">
                        <Select
                            defaultValue={options[0]}
                            options={options}
                            className="w-1/3 my-5 m-2"
                            onChange={() => setCoin('xx')}
                        />
                        <input
                            placeholder="USDT"
                            type="number"
                            min="400"
                            id="usdt"
                            keyboardtype="decimal-pad"
                            value={usdt}
                            autoComplete="off"
                            onFocus={() => setFocus('usd')}
                            onChange={(e) => setUsdt(e.target.value)}
                            className="my-2 w-2/5 active:outline-none rounded-sm p-2 outline-non bg-transparent text-slate-500 border-none text-3xl font-bold focus:outline-none"
                        />
                    </div>

                    <div className=" w-full flex justify-between my-0">
                        <p className="text-slate-500 text-sm p-3">Balance </p>

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
                            placeholder="SMC"
                            type="number"
                            id="smc"
                            value={smc}
                            step="50"
                            min="20000"
                            keyboardtype="decimal-pad"
                            onFocus={() => setFocus('coin')}
                            onChange={(e) => setSmc(e.target.value)}
                            className="my-2 w-2/5 active:outline-none rounded-sm p-2 outline-non bg-transparent text-slate-500 border-none text-3xl font-bold focus:outline-none"
                        />
                    </div>
                </div>
                {isProcess ? (
                    <Loader />
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            if (smc < 5) {
                                setError('$400 Minimum Purchase required')
                            } else {
                                setInfo(
                                    'Waiting for your confirmation on Metamask'
                                )
                                handleToggle()
                                setIsProcess(true)
                                setError('')
                                buy(smc)
                            }
                        }}
                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-[#A9A9A9]"
                    >
                        Book Now
                    </button>
                )}
                <p className="text-red-600 font-bold text-sm my-1">{error}</p>
            </div>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
                className="flex flex-col"
            >
                <div className="bg-white m-4 text-center text-gray-900 text-lg p-3 rounded-lg w-2/5 display-linebreak">
                    <CircularProgress color="inherit" />
                    <br />
                    {info}
                </div>
                <br />
            </Backdrop>
        </div>
    )
}

export default Presale
