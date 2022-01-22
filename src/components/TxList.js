import React, { useState, useEffect } from 'react'
import js_ago from 'js-ago'

function separator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function TxList() {
    const [tx, setTx] = useState({})
    const contractAddress = '0xA0a285f6E742f78b8B0Cf90Fb13918d99219eeDD'
    const apiKey = 'WZAYVUH8THPDWFR1KDABGTA1IR6G618BH9'
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

        return () => {
            clearInterval(fetchData)
        }
    }, [])

    //
    if (tx.result !== undefined) {
        return (
            <div className="flex flex-wrap-reverse flex-row">
                {tx.result.map((x) => (
                    <div
                        key={x.timeStamp}
                        className="text-gray-400 border rounded-2xl p-3 m-2 border-[#3d4f7c] shadow-lg w-80"
                    >
                        <p className="text-xs">{x.from}</p>
                        <p className="text-xl font-bold">
                            BUY SMC{' '}
                            {separator((x.value / 10 ** x.tokenDecimal) * 50)}{' '}
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
        )
    } else {
        return <div></div>
    }
}
