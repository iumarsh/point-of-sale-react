import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import UserDashboard from "./scenes/dashboard/UserDashboard"
import Team from "./scenes/team";
import AddCategory from "./scenes/Category";
import CategoryList from "./scenes/Category/CategoryList";
import Invoices from "./scenes/invoices";
import Transactions from "./scenes/transactions";
import Cheques from "./scenes/cheques"
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

import EditTransaction from "./scenes/transactions/edit";
import ViewTransaction from "./scenes/transactions/view";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const regularUser = true
  console.log('isSidebar: ', isSidebar);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            {
              !regularUser && <Topbar setIsSidebar={setIsSidebar} />
            }
            <Routes>
              <Route path="/" element={regularUser ? <UserDashboard /> : <Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/category" element={<AddCategory />} />
              <Route path="/categoryList" element={<CategoryList />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/cheques" element={<Cheques />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/transaction/edit/:transactionID" element={<EditTransaction />} />
              <Route path="/transaction/view/:transactionID" element={<ViewTransaction />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
