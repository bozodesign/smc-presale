const initialState = {
    useData: {},
    isFetching: false,
    isError: false,
}

const asyncReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USER':
            return Object.assign({}, state, {
                isFetching: false,
                userData: {},
                isError: false,
            })
        case 'FETCHED_USER':
            return Object.assign({}, state, {
                isFetching: true,
                userData: action.data,
                isError: false,
            })
        case 'REVICE_ERROR':
            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
            })
        default:
            return state
    }
    return state
}

export default asyncReducer
