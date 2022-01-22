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
    const [toggleMenu, setToggleMenu] = useState(false)
    const [error, setError] = useState()
    const ethereum = window.ethereum

    const handleNetworkSwitch = async (networkName) => {
        setError()
        await changeNetwork({ networkName, setError })
    }

    const networkChanged = (chainId) => {
        console.log({ chainId })
    }

    async function mtmLogin() {
        //handleNetworkSwitch('bsc')
        try {
            if (typeof ethereum !== 'undefined') {
                const accounts = await ethereum.request({
                    method: 'eth_requestAccounts',
                })
                //const accounts = await ethereum.request({method: "eth_accounts"})
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <nav className="z-50 w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial items-center"></div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center">
                <li
                    className="bg-[#2952e3] py-2 px-7 rounded-full items-center justify-center flex cursor-pointer hover:bg-[#6495ED]"
                    onClick={() => mtmLogin()}
                >
                    Connect with Metamask
                </li>
            </ul>
            <div className="flex relative">
                {toggleMenu ? (
                    <br /> /*<AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(false)}/> */
                ) : (
                    <HiMenuAlt4
                        fontSize={28}
                        className="text-white md:hidden cursor-pointer"
                        onClick={() => setToggleMenu(true)}
                    />
                )}
                {toggleMenu && (
                    <ul
                        className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                                    flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
                    >
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose
                                className="cursor-pointer"
                                onClick={() => setToggleMenu(false)}
                            />
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default Navbar
