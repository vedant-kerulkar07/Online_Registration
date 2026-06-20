import { Routes, Route } from "react-router-dom";
// import OnlineResistrationForm from "./Pages/RegistrationForm";
// import Success from "./Pages/Success";
import AdminPage from "./Pages/AdminPage";
import RegistrationClosed from "./Pages/RegistrationClosed";


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<OnlineResistrationForm />} />
      <Route path="/success" element={<Success />} /> */}
      {/* <Route path="/admin" element={<AdminPage />} /> */}
      <Route path="/" element={<RegistrationClosed />} />
    </Routes>
  );
}

export default App;