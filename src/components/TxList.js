import React, { useState, useEffect } from 'react'
import AnimatedNumber from 'animated-number-react'
import MyLoader from './MyLoader'
import js_ago from 'js-ago'

function separator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function TxList() {
    const [tx, setTx] = useState({})
    const [totalSold, setTotalSold] = useState(0)
    //const contractAddress = '0xA0a285f6E742f78b8B0Cf90Fb13918d99219eeDD'
    const contractAddress = '0xa0a285f6e742f78b8b0cf90fb13918d99219eedd'
    const apiKey = 'WZAYVUH8THPDWFR1KDABGTA1IR6G618BH9'
    const formatValue = (value) => `${Number(value).toFixed(2)}`
    let _totalSold = 0
    const userAction = async () => {
        const response = await fetch(
            `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=${contractAddress}&startblock=0&endblock=999999999&sort=asc&apikey=${apiKey}`
        )

        const myJson = await response.json() //extract JSON from the http response
        //console.log(myJson) // do something with myJson
        console.log(myJson.result[1].from)
        setTx(myJson)
    }

    useEffect(() => {
        const fetchData = setInterval(() => {
            userAction()
        }, 10000)
        setTotalSold(_totalSold)

        return () => {
            clearInterval(fetchData)
        }
    }, [])

    //
    if (tx.result !== undefined) {
        const txFilted = tx.result.filter((x) => {
            return (
                x.tokenSymbol === 'USDT' &&
                x.value / 10 ** x.tokenDecimal >= 1 &&
                x.to == contractAddress
            )
        })

        for (let i = 0; i < txFilted.length; i++) {
            _totalSold += txFilted[i].value / 10 ** txFilted[i].tokenDecimal
        }

        console.log('totalSold', _totalSold)
        _totalSold *= 50
        return (
            <div className="flex flex-col text-center">
                <p className="text-4xl font-bold my-10 text-gray-400">
                    SMC{' '}
                    <AnimatedNumber
                        value={_totalSold}
                        formatValue={formatValue}
                        duration="600"
                    />{' '}
                    SOLD!
                </p>
                <div className="flex flex-wrap-reverse flex-row text-left">
                    {txFilted.map((x) => (
                        <div
                            key={x.timeStamp}
                            className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80"
                        >
                            <p className="text-xs">{x.from}</p>
                            <p className="text-xl font-bold">
                                BUY SMC{' '}
                                {separator(
                                    (x.value / 10 ** x.tokenDecimal) * 50
                                )}{' '}
                            </p>
                            <p>
                                with {x.tokenSymbol}{' '}
                                {separator(x.value / 10 ** x.tokenDecimal)}
                            </p>
                            <p className="text-xs">
                                {js_ago(x.timeStamp, { format: 'long' })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col text-center">
                <p className="text-4xl font-bold my-10 text-gray-400 animate-pulse">
                    SMC SOLD!
                </p>
                <div className="flex flex-wrap-reverse flex-row">
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                    <div className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80 animate-pulse">
                        <MyLoader />
                    </div>
                </div>
            </div>
        )
    }
}
