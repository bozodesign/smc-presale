import { createSlice, createAsyncThunk, thunkAPI } from '@reduxjs/toolkit'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'

export const getWalletConnect = createAsyncThunk(
    'walletConnect/enable',
    async (_, thunkAPI) => {
        const provider = new WalletConnectProvider({
            infuraId: '836dd9508e394e8ebb3d5983bb0d08f2',
        })
        //thunkAPI.getState().walletConnect.value.stableCoin
        await provider.enable()
        const accounts = await provider.request({ method: 'eth_accounts' })
        console.log('account[0]:', accounts[0])
        thunkAPI.dispatch(
            setAccount({
                account: accounts[0],
                provider: provider,
                web3Provider: new ethers.providers.Web3Provider(provider),
            })
        )
    }
)

const userSlice = createSlice({
    name: 'walletConnect',
    initialState: {
        value: {
            account: '',
            provider: {},
            web3Provider: '',
        },
    },
    reducers: {
        // setStableCoin, setUsd , setUseWc, transfer, setProvidor, enableProvidor, disconnect

        setAccount: (state, action) => {
            console.log('SET ACCOUNT', action.payload)
            state.value = action.payload
        },
        clearAccount: (state, action) => {
            console.log('CLEAR ACCOUNT', action.payload)
            state.value = {}
        },
    },
    extraReducers(builder) {
        builder.addCase(getWalletConnect.fulfilled, (state, action) => {
            state.status = 'Connected!'
            state.provider = action.payload
        })
    },
})

export const {
    setProvider,
    setStableCoin,
    setAccount,
    setWeb3Provider,
    status,
} = userSlice.actions
export default userSlice.reducer
