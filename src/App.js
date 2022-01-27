import { Navbar, Presale, TxList } from './components'

const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
}

function App() {
    const contractAddress = '0xa86dbece45355c9e7e43fd0a96f1ed78af78aeb6'
    return (
        <div className="App bg-gray-800 h-max p-5">
            <Navbar />
            {isMetaMaskInstalled() ? (
                <Presale contractAddress={contractAddress} />
            ) : (
                <div></div>
            )}
            <TxList contractAddress={contractAddress} />
        </div>
    )
}

export default App
