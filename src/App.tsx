import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "./routers/adminRoute";
import AuthRoute from "./routers/authRoute";
import {
  HomePage,
  MapVillagePage,
  SocialAssistancePage,
  StatisticPage,
} from "./pages/main";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/check-social-assistance"
          element={<SocialAssistancePage />}
        />
        <Route path="/statistic" element={<StatisticPage />} />
        <Route path="/maps" element={<MapVillagePage />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/auth/*" element={<AuthRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
