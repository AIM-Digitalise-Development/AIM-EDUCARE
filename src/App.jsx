import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';

import PublicLayout from '@/layouts/PublicLayout';
import StudentLayout from '@/layouts/StudentLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AttemptLayout from '@/layouts/AttemptLayout';
import RequireStudent from '@/components/guards/RequireStudent';
import RequireAdmin from '@/components/guards/RequireAdmin';
import RedirectIfAuthed from '@/components/guards/RedirectIfAuthed';

import HomePage from '@/pages/public/HomePage';
import ExamsPage from '@/pages/public/ExamsPage';
import ExamDetailPage from '@/pages/public/ExamDetailPage';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

import MyExamsPage from '@/pages/student/MyExamsPage';
import MyExamDetailPage from '@/pages/student/MyExamDetailPage';
import MyPlansPage from '@/pages/student/MyPlansPage';
import MyOrdersPage from '@/pages/student/MyOrdersPage';
import ProfilePage from '@/pages/student/ProfilePage';
import CheckoutPage from '@/pages/student/CheckoutPage';
import ResultPage from '@/pages/student/ResultPage';

import AttemptPage from '@/pages/attempt/AttemptPage';

import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import CategoriesPage from '@/pages/admin/exams/CategoriesPage';
import ExamsPageAd from '@/pages/admin/exams/ExamsPage';
import SubjectsPage from '@/pages/admin/exams/SubjectsPage';
import TopicsPage from '@/pages/admin/exams/TopicsPage';
import QuestionBankPage from '@/pages/admin/QuestionBankPage';
import TestBuilderPage from '@/pages/admin/TestBuilderPage';
import TestListPage from '@/pages/admin/TestListPage';
import PlansPage from '@/pages/admin/PlansPage';
import UsersPage from '@/pages/admin/UsersPage';
import SubAdminsPage from '@/pages/admin/SubAdminsPage';
import OrdersPage from '@/pages/admin/OrdersPage';
import TransactionsPage from '@/pages/admin/TransactionsPage';
import AuditLogsPage from '@/pages/admin/AuditLogsPage';
import SettingsPage from '@/pages/admin/SettingsPage';

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/exams', element: <ExamsPage /> },
      { path: '/exams/:slug', element: <ExamDetailPage /> },
      {
        element: <RedirectIfAuthed />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <StudentLayout />,
    children: [
      {
        element: <RequireStudent />,
        children: [
          { path: '/my-exams', element: <MyExamsPage /> },
          { path: '/my-exams/:slug', element: <MyExamDetailPage /> },
          { path: '/my-exams/:slug/result/:attemptId', element: <ResultPage /> },
          { path: '/my-plans', element: <MyPlansPage /> },
          { path: '/my-orders', element: <MyOrdersPage /> },
          { path: '/checkout/:orderId', element: <CheckoutPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <AttemptLayout />,
    children: [
      {
        element: <RequireStudent />,
        children: [{ path: '/attempt/:attemptId', element: <AttemptPage /> }],
      },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    element: <AdminLayout />,
    children: [
      {
        element: <RequireAdmin />,
        children: [
          { path: '/admin', element: <DashboardPage /> },
          { path: '/admin/dashboard', element: <DashboardPage /> },
          { path: '/admin/exam-categories', element: <CategoriesPage /> },
          { path: '/admin/exams', element: <ExamsPageAd /> },
          { path: '/admin/exams/:examId/subjects', element: <SubjectsPage /> },
          { path: '/admin/subjects/:subjectId/topics', element: <TopicsPage /> },
          { path: '/admin/questions', element: <QuestionBankPage /> },
          { path: '/admin/tests', element: <TestListPage /> },
          { path: '/admin/tests/:testId/builder', element: <TestBuilderPage /> },
          { path: '/admin/plans', element: <PlansPage /> },
          { path: '/admin/users', element: <UsersPage /> },
          { path: '/admin/sub-admins', element: <SubAdminsPage /> },
          { path: '/admin/orders', element: <OrdersPage /> },
          { path: '/admin/transactions', element: <TransactionsPage /> },
          { path: '/admin/audit-logs', element: <AuditLogsPage /> },
          { path: '/admin/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </HelmetProvider>
  );
}