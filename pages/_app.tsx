import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'
import {Provider} from 'react-redux'
import {persistor, store} from '../store/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}
