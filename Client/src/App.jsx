import { Routes, Route } from "react-router-dom";
import OnlineResistrationForm from "./Pages/RegistrationForm";
import Success from "./Pages/Success";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnlineResistrationForm />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;