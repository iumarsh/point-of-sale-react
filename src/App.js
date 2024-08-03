import { useContext, useState } from "react";
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
import Ledger from "./scenes/ledger/Ledger"
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
import PrivateRoute from "./utility/PrivateRoute";
import Login from "./scenes/login";
import AuthContext, { AuthProvider } from "./utility/AuthContext";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const regularUser = true

  
  return (
    <AuthProvider>
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
              <Route path="/login" element={<Login />} />
              <Route path="/"  element={
                  <PrivateRoute>
                    {regularUser ? <UserDashboard /> : <Dashboard />}
                  </PrivateRoute>
                } 
              />
              <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute> } />
              <Route path="/category" element={<PrivateRoute><AddCategory /></PrivateRoute>} />
              <Route path="/categoryList" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
              <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
              <Route path="/cheques" element={<PrivateRoute><Cheques /></PrivateRoute>} />
              <Route path="/ledger" element={<PrivateRoute><Ledger /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
              <Route path="/form" element={<PrivateRoute><Form /></PrivateRoute>} />
              <Route path="/bar" element={<PrivateRoute><Bar /></PrivateRoute>} />
              <Route path="/pie" element={<PrivateRoute><Pie /></PrivateRoute>} />
              <Route path="/line" element={<PrivateRoute><Line /></PrivateRoute>} />
              <Route path="/faq" element={<PrivateRoute><FAQ /></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
              <Route path="/geography" element={<PrivateRoute><Geography /></PrivateRoute>} />
              <Route path="/transaction/edit/:transactionID" element={<PrivateRoute><EditTransaction /></PrivateRoute>} />
              <Route path="/transaction/view/:transactionID" element={<PrivateRoute><ViewTransaction /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
