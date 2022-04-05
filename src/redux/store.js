import {createStore,combineReducers} from 'redux';
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer} from './reducers/LoadingReducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

//redux-persist
const persistConfig = {
    key: 'root',
    storage,
    blacklist:['LoadingReducer']
  }

const reducers = combineReducers({
    CollapsedReducer,
    LoadingReducer})

const persistedReducer = persistReducer(persistConfig, reducers)
   
let store = createStore(persistedReducer)
let persistor = persistStore(store)

export { store, persistor }
 