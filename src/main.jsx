import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './routes/route.jsx'
import { GlobalStyle } from './styles/style.jsx'
import AuthProvider from './contexts/auth.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
      <GlobalStyle />
    </AuthProvider>
  </React.StrictMode>,
)
