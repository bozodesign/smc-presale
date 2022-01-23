import { useState, useEffect } from 'react'
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'

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

const NavBarItems = ({ title, classProps }) => {
    return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>
}

function Navbar() {
    const [account, setAccount] = useState(null)
    const [error, setError] = useState()
    let chain
    const ethereum = window.ethereum

    useEffect(() => {
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
        return () => {}
    }, [])

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
                <p className="text-slate-400 text-lg p-3">
                    {account.slice(0, 5) + '....' + account.slice(-4)}
                    <p className="text-red-600 font-bold animate-pulse">
                        {error}
                    </p>
                </p>
            ) : (
                <ul className="text-white md:flex  list-none flex-row justify-between items-center">
                    <li
                        className="bg-[#2952e3] py-2 px-7 rounded-full items-center justify-center flex cursor-pointer hover:bg-[#6495ED]"
                        onClick={() => mtmLogin()}
                    >
                        Connect with Metamask
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default Navbar
