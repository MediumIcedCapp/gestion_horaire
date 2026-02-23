import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/connexion/login.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;