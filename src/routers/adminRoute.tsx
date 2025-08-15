import { Navigate, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Employee,
  Expense,
  FamilyCard,
  FamilyCardDetail,
  Income,
  IncomingLetter,
  OutgoingLetter,
  Period,
  PeriodDetail,
  Region,
  RegionDetail,
  Resident,
  Role,
  RTUnit,
  RWUnit,
  Service,
  SocialAssistance,
  Tax,
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
      <Route path="period/:id" element={<PeriodDetail />} />
      <Route path="incomes" element={<Income />} />
      <Route path="expenses" element={<Expense />} />

      {/* Title Region */}
      <Route path="regions" element={<Region />} />
      <Route path="region/:id" element={<RegionDetail />} />
      <Route path="citizen-associations" element={<RWUnit />} />
      <Route path="neighborhood-associations" element={<RTUnit />} />

      {/* Village Management */}
      <Route path="services" element={<Service />} />
      <Route path="social-assistances" element={<SocialAssistance />} />
      <Route path="taxes" element={<Tax />} />
    </Routes>
  );
};

export default AdminRoute;
