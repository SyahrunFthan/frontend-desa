import { Navigate, Route, Routes } from "react-router-dom";
import {
  Activity,
  Dashboard,
  DetailNews,
  Development,
  Employee,
  Expense,
  Facility,
  FamilyCard,
  FamilyCardDetail,
  Income,
  IncomingLetter,
  News,
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
  SubmissionService,
  Tax,
  User,
  Village,
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
      <Route path="submission-services" element={<SubmissionService />} />

      {/* APBDES */}
      <Route path="periods" element={<Period />} />
      <Route path="period/:id" element={<PeriodDetail />} />
      <Route path="incomes" element={<Income />} />
      <Route path="expenses" element={<Expense />} />

      {/* Region */}
      <Route path="regions" element={<Region />} />
      <Route path="region/:id" element={<RegionDetail />} />
      <Route path="citizen-associations" element={<RWUnit />} />
      <Route path="neighborhood-associations" element={<RTUnit />} />
      <Route path="facilities" element={<Facility />} />

      {/* Village Management */}
      <Route path="services" element={<Service />} />
      <Route path="social-assistances" element={<SocialAssistance />} />
      <Route path="taxes" element={<Tax />} />
      <Route path="developments" element={<Development />} />
      <Route path="activities" element={<Activity />} />
      <Route path="villages" element={<Village />} />

      {/* System */}
      <Route path="news" element={<News />} />
      <Route path="news/:id" element={<DetailNews />} />
    </Routes>
  );
};

export default AdminRoute;
