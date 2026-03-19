import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/connexion/login.jsx";
import SignUp from "./pages/connexion/SignUp.jsx";
import Accueil from "./pages/accueil/Accueil.jsx";
import PageCalendrier from "./composantes/PageCalendrier.jsx";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pageCalendrier" element={<PageCalendrier />} />
      </Routes>
  );
}

export default App;
