import { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import { AiOutlineClose } from 'react-icons/ai'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

const provider = new WalletConnectProvider({
    infuraId: '06ba877b3d513b26464bc3384fb3e278',
})

const networks = {
    // polygon: {
    //   chainId: `0x${Number(137).toString(16)}`,
    //   chainName: "Polygon Mainnet",
    //   nativeCurrency: {
    //     name: "MATIC",
    //     symbol: "MATIC",
    //     decimals: 18
    //   },
    //   rpcUrls: ["https://polygon-rpc.com/"],
    //   blockExplorerUrls: ["https://polygonscan.com/"]
    // },
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

function Navbar() {
    const [account, setAccount] = useState(null)
    const [error, setError] = useState()
    const [info, setInfo] = useState('')
    const [walletConnect, setWalledConnect] = useState(false)
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    const handleToggle = () => {
        setOpen(!open)
    }
    let chain
    const ethereum = window.ethereum
    const web3Provider = new ethers.providers.Web3Provider(provider)
    useEffect(() => {
        getCurrentAccountWC()
        if (isMetaMaskInstalled()) {
            getCurrentAccount()
            ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0])
            })

            ethereum.on('chainChanged', (_chainId) => {
                chain = _chainId
                console.log('chainId:', chain)
                if (chain !== '0x4') {
                    setError('Wrong Network!')
                } else {
                    setError('')
                }
            })
        } else if (walletConnect) {
            getCurrentAccountWC()
            provider.on('accountsChanged', (accounts) => {
                setAccount(accounts[0])
            })
            provider.on('chainChanged', (_chainId) => {
                chain = _chainId
                console.log('chainId:', chain)
                if (chain !== '0x4') {
                    setError('Wrong Network!')
                } else {
                    setError('')
                }
            })
        }
        provider.on('disconnect', (code, reason) => {
            console.log(code, reason)
            setAccount()
        })
        return () => {}
    }, [])

    async function getCurrentAccountWC() {
        const accounts = await provider.request({ method: 'eth_accounts' })
        console.log('accounts[0]WC:', accounts[0])
        setAccount(accounts[0])
    }

    async function walletConnectLogin() {
        try {
            await provider.enable()
            setWalledConnect(true)
        } catch (err) {
            console.log(err)
        }
        getCurrentAccountWC()
        handleClose()
    }

    async function getCurrentAccount() {
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        setAccount(accounts[0])
    }

    async function mtmLogin() {
        //handleNetworkSwitch('bsc')
        try {
            if (typeof ethereum !== 'undefined') {
                const accounts = await ethereum.request({
                    method: 'eth_requestAccounts',
                })
                setAccount(accounts[0])
            }
        } catch (err) {
            console.log(err)
        }
        await ethereum.request({
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
                                await provider.disconnect()
                                setAccount(null)
                            }}
                        />{' '}
                    </p>
                    <p className="text-red-600 font-bold animate-pulse">
                        {error}
                    </p>
                </div>
            ) : (
                <ul className="text-white md:flex  list-none flex-row justify-between items-center">
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
                    <button
                        id="connectButton"
                        className="bg-[#2952e3] py-2 px-7 rounded-full items-center justify-center flex cursor-pointer hover:bg-[#6495ED]"
                        onClick={() => {
                            getCurrentAccountWC()
                        }}
                    >
                        Test
                    </button>
                </ul>
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
                        id="wcBtn"
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
                        onClick={() => walletConnectLogin()}
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
