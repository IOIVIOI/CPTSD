import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { CrisisReferral } from "./components/CrisisReferral";
import { GroundingPractice } from "./components/GroundingPractice";
import { Layout } from "./components/Layout";
import { PointerGlow } from "./components/PointerGlow";
import { AppProvider } from "./context/AppContext";
import { CriticPage } from "./pages/CriticPage";
import { GrievePage } from "./pages/GrievePage";
import { HomePage } from "./pages/HomePage";
import { LearnPage } from "./pages/LearnPage";
import { MethodsPage } from "./pages/MethodsPage";
import { RescuePage } from "./pages/RescuePage";

export default function App() {
  return (
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="rescue" element={<RescuePage />} />
            <Route path="critic" element={<CriticPage />} />
            <Route path="grieve" element={<GrievePage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="methods" element={<MethodsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <GroundingPractice />
        <CrisisReferral />
        <PointerGlow />
      </AppProvider>
    </HashRouter>
  );
}
