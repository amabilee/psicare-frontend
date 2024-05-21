import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/_login/login';


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router