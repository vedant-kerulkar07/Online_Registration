import { Routes, Route } from "react-router-dom";
import OnlineResistrationForm from "./Pages/RegistrationForm";
import Success from "./Pages/Success";
// import AdminPage from "./Pages/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnlineResistrationForm />} />
      <Route path="/success" element={<Success />} />
      {/* <Route path="/admin" element={<AdminPage />} /> */}
    </Routes>
  );
}

export default App;