import './App.css'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRouter from "./index.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";

function App() {

  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  )
}

export default App
