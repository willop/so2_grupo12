import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Info from '../Info';


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} > </Route>
                <Route path="/info/:pid" element={<Info />} > </Route>
            </Routes>
        </BrowserRouter>
    )
}