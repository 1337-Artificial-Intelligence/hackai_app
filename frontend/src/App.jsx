import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sign from "./pages/Sign";
import Dashboard from "./pages/Dashboard/Dashboard";
import Main from "./pages/Dashboard/Main";
import ChallengePage from "./pages/Dashboard/challenge/ChallngePage";
import Admin from "./pages/Admin/Admin";
import Graph from "./pages/Dashboard/Graph";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const App = () => {

  useEffect(() => {
    document.getElementById('root').classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="main" element={<Main />} />
          <Route path="challenge/:id" element={<ChallengePage />} />
          <Route path="Graph" element={<Graph />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
