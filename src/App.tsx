import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Outlet, Routes, Route } from 'react-router-dom';
import SiteContentProvider from '@/components/custom/SiteContentProvider';
import ScrollToTop from '@/components/custom/ScrollToTop';
import LanguageSync from '@/components/custom/LanguageSync';
import CookieConsent from '@/components/custom/CookieConsent';
import HomePage from '@/components/pages/HomePage';
import SchedulePage from '@/components/pages/SchedulePage';
import RegistrationPage from '@/components/pages/RegistrationPage';
import CompetitionPage from '@/components/pages/CompetitionPage';
import ShopPage from '@/components/pages/ShopPage';
import ContactPage from '@/components/pages/ContactPage';
import DataPolicyPage from '@/components/pages/DataPolicyPage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { Constants } from '@/core/constants';

// separate chunk: visitors never download Firebase or the back office
const AdminPage = lazy(() => import('@/components/pages/AdminPage'));

const queryClient: QueryClient = new QueryClient();

// visitor pages share the cookie banner, the back office has none
const PublicLayout = () => (
  <>
    <Outlet />
    <CookieConsent />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteContentProvider>
      <LanguageSync />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={Constants.ROUTE_HOME} element={<HomePage />} />
            <Route path={Constants.ROUTE_SCHEDULE} element={<SchedulePage />} />
            <Route path={Constants.ROUTE_REGISTRATION} element={<RegistrationPage />} />
            <Route path={Constants.ROUTE_COMPETITION} element={<CompetitionPage />} />
            <Route path={Constants.ROUTE_SHOP} element={<ShopPage />} />
            <Route path={Constants.ROUTE_CONTACT} element={<ContactPage />} />
            <Route path={Constants.ROUTE_DATA_POLICY} element={<DataPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route
            path={`${Constants.ROUTE_ADMIN}/*`}
            element={
              <Suspense fallback={null}>
                <AdminPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </SiteContentProvider>
  </QueryClientProvider>
);

export default App;
