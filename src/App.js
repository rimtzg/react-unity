import './App.css';

import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import Index from './pages/Index'
import Unity from './pages/Unity'
import Wallets from './pages/Wallets'
import GoogleLogin from './pages/GoogleLogin'

import { Buffer } from "buffer";
window.Buffer = Buffer

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/login">GoogleLogin</Link>
                    </li>
                    <li>
                        <Link to="/unity">Unity</Link>
                    </li>
                    <li>
                        <Link to="/wallets">Wallets</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="wallets" element={<Wallets />} />
                    <Route path="unity" element={<Unity />} />
                    <Route path="login" element={<GoogleLogin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
