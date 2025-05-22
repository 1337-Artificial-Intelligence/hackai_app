import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sign from "./pages/Sign";
import Dashboard from "./pages/Dashboard/Dashboard";
import Main from "./pages/Dashboard/Main";
import ChallengePage from "./pages/Dashboard/challenge/ChallngePage";
import Admin from "./pages/Admin/Admin";
import NotFound from "./pages/NotFound";
import PublicLeaderboard from "./pages/PublicLeaderboard";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const App = () => {

  useEffect(() => {
    document.getElementById('root').classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Main />} />
          <Route path="challenge/:id" element={<ChallengePage />} />
          {/* <Route path="graph" element={<Graph />} /> */}
        </Route>
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } />
        <Route path="/leaderboard" element={<PublicLeaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
