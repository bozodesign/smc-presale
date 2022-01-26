import { Navbar, Presale, TxList } from './components'

function App() {
    const contractAddress = '0xa86dbece45355c9e7e43fd0a96f1ed78af78aeb6'
    return (
        <div className="App bg-gray-800 h-max p-5">
            <Navbar />
            <Presale contractAddress={contractAddress} />
            <TxList contractAddress={contractAddress} />
        </div>
    )
}

export default App
