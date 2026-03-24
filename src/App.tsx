import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { getSession } from "@/lib/auth";
import Index from "./pages/Index";
import Goals from "./pages/Goals";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import ProfilePage from "./pages/Profile";
import Categories from "./pages/Categories";
import ViewAllActives from "./pages/ViewAllActives";
import StrategicFinance from "./pages/StrategicFinance";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Support from "./pages/Support";
import ChatSupport from "./pages/ChatSupport";
import Documentation from "./pages/Documentation";
import DocArticle from "./pages/docs/DocArticle";
import ForgotPassword from "./pages/ForgotPassword";
import EmailSent from "./pages/EmailSent";
import ResetPassword from "./pages/ResetPassword";
import PlanMode from "./pages/PlanMode";
import Payment from "./pages/Payment";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getSession() ? <>{children}</> : <Navigate to="/apresentacao" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  return !getSession() ? <>{children}</> : <Navigate to="/" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/apresentacao"
            element={
              <PublicOnlyRoute>
                <Landing />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/esqueci-senha"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/email-enviado"
            element={
              <PublicOnlyRoute>
                <EmailSent />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/resetar-senha"
            element={
              <PublicOnlyRoute>
                <ResetPassword />
              </PublicOnlyRoute>
            }
          />
          <Route path="/suporte" element={<Support />} />
          <Route path="/chat" element={<ChatSupport />} />
          <Route path="/documentacao" element={<Documentation />} />
          <Route path="/documentacao/:id" element={<DocArticle />} />
          <Route path="/planos" element={<PlanMode />} />
          <Route path="/pagamento" element={<Payment />} />

          {/* Private routes */}
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/contas" element={<Accounts />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/view-all-actives" element={<ViewAllActives />} />
            <Route path="/estrategia" element={<StrategicFinance />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* Root redirect: go to app or landing */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
