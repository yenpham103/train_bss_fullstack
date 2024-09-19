import { store } from '../store';
import { Provider } from 'react-redux';
import '@/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className=''>
        <Component {...pageProps} />
        <ToastContainer />
      </div>
    </Provider>
  );
}
