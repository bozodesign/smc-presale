import React, { useState, useEffect } from 'react'
import AnimatedNumber from 'animated-number-react'
import MyLoader from './MyLoader'
import js_ago from 'js-ago'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'

function separator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function TxList({ contractAddress }) {
    const [tx, setTx] = useState({})
    const [totalSold, setTotalSold] = useState(0)
    //const contractAddress = '0xA0a285f6E742f78b8B0Cf90Fb13918d99219eeDD'
    //const contractAddress = '0xa0a285f6e742f78b8b0cf90fb13918d99219eedd'
    const apiKey = 'WZAYVUH8THPDWFR1KDABGTA1IR6G618BH9'
    const formatValue = (value) => `${Number(value).toFixed(2)}`
    let _totalSold = 0

    const userAction = async () => {
        const response = await fetch(
            `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=${contractAddress}&startblock=0&endblock=999999999&sort=asc&apikey=${apiKey}`
        )

        const myJson = await response.json() //extract JSON from the http response
        //console.log(myJson) // do something with myJson
        //console.log(myJson.status)
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
    if (tx.status) {
        const txFilted = tx.result.filter((x) => {
            return (
                (x.tokenSymbol === 'USDT' || x.tokenSymbol === 'LINK') &&
                x.value / 10 ** x.tokenDecimal >= 1 &&
                x.to.toUpperCase() == contractAddress.toUpperCase()
            )
        })

        for (let i = 0; i < txFilted.length; i++) {
            _totalSold += txFilted[i].value / 10 ** txFilted[i].tokenDecimal
        }

        console.log('totalSold', _totalSold)

        return (
            <div className="flex flex-col text-center">
                <span className="text-4xl font-bold my-10 text-gray-400">
                    <br />
                    <Progress
                        type="circle"
                        percent={((_totalSold * 0.05) / 28000).toFixed(2)}
                        width={150}
                        strokeWidth={12}
                        status="active"
                        theme={{
                            active: {
                                trailColor: 'rgb(100 116 139)',
                                color: 'rgb(30 64 175)',
                            },
                        }}
                    />
                    <br />
                    SMC{' '}
                    <AnimatedNumber
                        value={_totalSold * 0.05}
                        formatValue={formatValue}
                        duration="600"
                    />
                    K /28,000K SOLD!
                </span>

                <div className="flex flex-wrap-reverse flex-row text-left">
                    {txFilted.map((x) => (
                        <div
                            key={x.timeStamp}
                            className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80"
                        >
                            <span className="text-xs">{x.from}</span>
                            <br />
                            <span className="text-xl font-bold">
                                BUY SMC{' '}
                                {separator(
                                    (x.value / 10 ** x.tokenDecimal) * 50
                                )}{' '}
                            </span>
                            <br />
                            <span>
                                with {x.tokenSymbol}{' '}
                                {separator(x.value / 10 ** x.tokenDecimal)}
                            </span>
                            <br />
                            <span className="text-xs">
                                {js_ago(x.timeStamp, { format: 'long' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col text-center">
                <span className="text-4xl font-bold my-10 text-gray-400 animate-pulse">
                    SMC SOLD!
                </span>

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
