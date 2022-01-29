import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/walletConnect'

const store = configureStore({
    reducer: {
        walletConnect: userReducer,
    },
})

export default store
