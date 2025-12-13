import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import MainLayout from '../layout/MainLayout';
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ProfilePage from '../pages/ProfilePage';
import Dashboard from '../pages/Dashboard';
import FieldsPage from '../pages/FieldsPage';
import FieldDetail from '../pages/FieldDetail';
import CropBatchesPage from '../pages/CropBatchesPage';
import IrrigationPage from '../pages/IrrigationPage';
import DataImportPage from '../pages/DataImportPage';
import CropBatchDetail from '../pages/CropBatchDetail';
import NotesPage from '../pages/NotesPage';
import RiskAnalysisPage from '../pages/RiskAnalysisPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Protected/App Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="crop-batches/:batchId" element={<CropBatchDetail />} />
      </Route>
      
      {/* Pages with their own full-screen layouts */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="fields" element={<FieldDetail />} />
      <Route path="crop-batches" element={<CropBatchesPage />} />
      <Route path="irrigation" element={<IrrigationPage />} />
      <Route path="notes" element={<NotesPage />} />
      <Route path="risk-analysis" element={<RiskAnalysisPage />} />
      <Route path="data-import" element={<DataImportPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </>
  )
);
