import { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import { AiOutlineClose } from 'react-icons/ai'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useDispatch, useSelector } from 'react-redux'
import { getWalletConnect, clearAccount } from '../redux/walletConnect'

const networks = {
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
            name: 'Binance Chain Native Token',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: [
            'https://bsc-dataseed1.binance.org',
            'https://bsc-dataseed2.binance.org',
            'https://bsc-dataseed3.binance.org',
            'https://bsc-dataseed4.binance.org',
            'https://bsc-dataseed1.defibit.io',
            'https://bsc-dataseed2.defibit.io',
            'https://bsc-dataseed3.defibit.io',
            'https://bsc-dataseed4.defibit.io',
            'https://bsc-dataseed1.ninicoin.io',
            'https://bsc-dataseed2.ninicoin.io',
            'https://bsc-dataseed3.ninicoin.io',
            'https://bsc-dataseed4.ninicoin.io',
            'wss://bsc-ws-node.nariox.org',
        ],
        blockExplorerUrls: ['https://bscscan.com'],
    },
}

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
}

// const provider = new WalletConnectProvider({
//     //infuraId: '06ba877b3d513b26464bc3384fb3e278',
//     infuraId: '836dd9508e394e8ebb3d5983bb0d08f2',
// })

function Navbar() {
    const [account, setAccount] = useState(null)
    const [error, setError] = useState()
    const [info, setInfo] = useState('')
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    const handleToggle = () => {
        setOpen(!open)
    }
    const WC = useDispatch()
    const wc = useSelector((state) => state.walletConnect.value)
    let chain
    let web3Provider = window.ethereum

    useEffect(() => {
        if (!!wc.account) {
            setAccount(wc.account)
            WC(getWalletConnect())
            web3Provider = wc.provider
        } else if (isMetaMaskInstalled()) {
            web3Provider = window.ethereum
        }
        return () => {}
    }, [account])

    console.log('wc:', wc)

    useEffect(() => {
        console.log('wc:', wc.account)

        if (isMetaMaskInstalled()) {
            getCurrentAccount()
            web3Provider.on('accountsChanged', (accounts) => {
                setAccount(accounts[0])
            })
        }
        // web3Provider.on('disconnect', (code, reason) => {
        //     console.log('DISCONNECTED!')
        //     console.log(code, reason)
        //     setAccount()
        // })

        // web3Provider.on('chainChanged', (_chainId) => {
        //     chain = _chainId
        //     console.log('chainId:', chain)
        //     if (chain != '4') {
        //         setError('Wrong Network!')
        //     } else {
        //         setError('')
        //     }
        // })

        return () => {}
    }, [])

    const coin = '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02'
    let abi = require('../abi/IERC20')

    async function walletConnectLogin() {
        await WC(getWalletConnect())
            .then(() => {
                setAccount(wc.account)
                handleClose()
            })
            .catch((err) => console.log)

        handleClose()
    }

    async function getCurrentAccount() {
        const accounts = await web3Provider.request({ method: 'eth_accounts' })
        setAccount(accounts[0])
        return accounts[0]
    }

    async function mtmLogin() {
        //handleNetworkSwitch('bsc')
        try {
            if (typeof web3Provider !== 'undefined') {
                const accounts = await web3Provider.request({
                    method: 'eth_requestAccounts',
                })
                setAccount(accounts[0])
            }
        } catch (err) {
            console.log(err)
        }
        handleClose()
        await web3Provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }],
        })
    }

    return (
        <nav className="z-50 w-full flex flex-col items-center text-center p-4">
            {!!account ? (
                <div>
                    <p className="text-slate-400 text-lg p-3 flex flex-row">
                        {account.slice(0, 5) + '....' + account.slice(-4)}{' '}
                        <AiOutlineClose
                            onClick={async () => {
                                await wc.provider.disconnect()
                                WC(clearAccount())
                                setAccount(null)
                            }}
                        />
                    </p>
                    <p className="text-red-600 font-bold animate-pulse flex flex-row">
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="sc-m6ivbz-6 gWhSnL"
                        >
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg> */}
                        {error}
                    </p>
                </div>
            ) : (
                <div className="text-white md:flex  list-none flex-row justify-between items-center">
                    <button
                        id="connectButton"
                        className="bg-[#2952e3] py-2 px-7 rounded-full items-center justify-center flex cursor-pointer hover:bg-[#6495ED]"
                        onClick={() => {
                            setInfo('Connect to a wallet')
                            handleToggle()
                        }}
                    >
                        Connect Wallet
                    </button>
                </div>
            )}

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
                className="flex flex-col"
                //onClick={() => handleClose()}
            >
                <div className="bg-white flex flex-col m-4 items-center text-center text-gray-900 text-lg p-3 rounded-lg md:w-2/5 w-full display-linebreak">
                    <div className="w-full justify-end flex -scroll-my-9">
                        <AiOutlineClose
                            className="cursor-pointer"
                            onClick={() => handleClose()}
                        />
                    </div>
                    <div className="text-gray-500 text-md my-2 font-bold">
                        {info}
                    </div>
                    <button
                        id="mtmBtn"
                        className="bg-white w-4/5 shadow-md border my-2 py-2 px-7 justify-between rounded-lg items-center flex cursor-pointer hover:bg-[#bffeff]"
                        onClick={() => {
                            if (isMetaMaskInstalled()) {
                                mtmLogin()
                            } else {
                                setInfo("Metamask isn't install yet")
                            }
                        }}
                    >
                        Metamask
                        <img
                            src="http://smc.alotof.fun/img/metamask.png"
                            width="24"
                        />
                    </button>

                    <button
                        id="wcBtn"
                        className="bg-white w-4/5 shadow-md border my-2 py-2 px-7 justify-between rounded-lg items-center flex cursor-pointer hover:bg-[#bffeff]"
                        onClick={() => {
                            walletConnectLogin()
                        }}
                    >
                        WalletConnect
                        <img
                            src="http://smc.alotof.fun/img/walletConnectIcon.svg"
                            width="24"
                        />
                    </button>

                    <div className="text-gray-500 text-xs my-2">
                        By connecting your wallet, you agree to our
                        <br />
                        <a href="#"> Term of Service</a> and
                        <a href="#"> Privacy Policy</a>
                    </div>
                </div>
                <br />
            </Backdrop>
        </nav>
    )
}

export default Navbar
