import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/_login/login';
import Admin from "../pages/administrador/secretario";


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router