import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "./routers/adminRoute";
import AuthRoute from "./routers/authRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/auth/*" element={<AuthRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
