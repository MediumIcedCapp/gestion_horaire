import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/connexion/login.jsx";
import SignUp from "./pages/connexion/SignUp.jsx";
import Accueil from "./Accueil.jsx";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
  );
}

export default App;