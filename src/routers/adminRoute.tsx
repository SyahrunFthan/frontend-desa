import { Navigate, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Employee,
  FamilyCard,
  FamilyCardDetail,
  IncomingLetter,
  OutgoingLetter,
  Period,
  Resident,
  Role,
  User,
} from "../pages";
import { getItem } from "../helpers/storage";

const AdminRoute = () => {
  const profile = getItem("profile");
  const isAuthenticated = !!profile;

  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  return (
    <Routes>
      <Route index element={<Navigate to={"dashboard"} replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      {/* Users */}
      <Route path="residents" element={<Resident />} />
      <Route path="employees" element={<Employee />} />
      <Route path="family-cards" element={<FamilyCard />} />
      <Route path="family-card/:id" element={<FamilyCardDetail />} />
      <Route path="roles" element={<Role />} />
      <Route path="users" element={<User />} />

      {/* Letter */}
      <Route path="incoming-letters" element={<IncomingLetter />} />
      <Route path="outgoing-letters" element={<OutgoingLetter />} />

      {/* APBDES */}
      <Route path="periods" element={<Period />} />
    </Routes>
  );
};

export default AdminRoute;
