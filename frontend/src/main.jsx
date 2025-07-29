
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Details from "./Details.jsx";
import { AuthProvider } from "react-oidc-context";


const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE || "code",
  scope: import.meta.env.VITE_COGNITO_SCOPE || "email openid phone",
};

createRoot(document.getElementById('root')).render(
 <AuthProvider {...cognitoAuthConfig}>
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </div>
  </Router>
 </AuthProvider>
)
