import {createStore} from 'redux'
import {rootReducer} from "./reducers/rootReducer"
import logger from 'redux-logger'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
    key: 'rootStorage',
    storage: storage,
    whitelist: ['destroy']
}
const middleware: any[] = []
if (process.env.NODE_ENV === 'development') middleware.push(logger)

const pReducer = persistReducer(rootPersistConfig, rootReducer)
const store: any = createStore(pReducer)
const persistor = persistStore(store)

export { store, persistor }
