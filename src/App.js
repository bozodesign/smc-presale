import { Navbar, Presale, TxList } from './components'

function App() {
    const contractAddress = '0xcc74baf861695cc8984410c6b2dba929d782936f'
    return (
        <div className="App bg-gray-800 h-max p-5">
            <Navbar />
            <Presale contractAddress={contractAddress} />
            <TxList contractAddress={contractAddress} />
        </div>
    )
}

export default App
