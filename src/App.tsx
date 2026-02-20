import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";
import Index from "./pages/Index";
import Goals from "./pages/Goals";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getSession() ? <>{children}</> : <Navigate to="/apresentacao" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  return !getSession() ? <>{children}</> : <Navigate to="/" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* Root redirect: go to app or landing */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
