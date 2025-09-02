import { Navigate, Route, Routes } from "react-router-dom";
import {
  Activity,
  Dashboard,
  DetailNews,
  DetailSubmissionService,
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
  Stall,
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
      <Route path="resident" element={<Resident />} />
      <Route path="employee" element={<Employee />} />
      <Route path="family-card" element={<FamilyCard />} />
      <Route path="family-card/:id" element={<FamilyCardDetail />} />
      <Route path="role" element={<Role />} />
      <Route path="user" element={<User />} />

      {/* Letter */}
      <Route path="incoming-letter" element={<IncomingLetter />} />
      <Route path="outgoing-letter" element={<OutgoingLetter />} />
      <Route path="submission-service" element={<SubmissionService />} />
      <Route
        path="submission-service/:id"
        element={<DetailSubmissionService />}
      />

      {/* APBDES */}
      <Route path="period" element={<Period />} />
      <Route path="period/:id" element={<PeriodDetail />} />
      <Route path="income" element={<Income />} />
      <Route path="expense" element={<Expense />} />

      {/* Region */}
      <Route path="region" element={<Region />} />
      <Route path="region/:id" element={<RegionDetail />} />
      <Route path="citizen-association" element={<RWUnit />} />
      <Route path="neighborhood-association" element={<RTUnit />} />
      <Route path="facility" element={<Facility />} />

      {/* Village Management */}
      <Route path="stall-village" element={<Stall />} />
      <Route path="service" element={<Service />} />
      <Route path="social-assistance" element={<SocialAssistance />} />
      <Route path="taxes" element={<Tax />} />
      <Route path="development" element={<Development />} />
      <Route path="activity" element={<Activity />} />
      <Route path="village" element={<Village />} />

      {/* System */}
      <Route path="news" element={<News />} />
      <Route path="news/:id" element={<DetailNews />} />
    </Routes>
  );
};

export default AdminRoute;
