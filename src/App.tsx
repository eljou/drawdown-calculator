import AccountConfig from "./components/account-config";
import Header from "./components/header";
import MetricsSummary from "./components/metrics-summary";
import OrdersTable from "./components/orders-list";
import SymbolsConfig from "./components/symbols-config";

import { useAppStore } from "./viewmodels/store";

import "./App.css";

function App() {
  const account = useAppStore((st) => st.account);
  const setNewBalance = useAppStore((st) => st.updateBalance);

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div>
          <Header />
          <MetricsSummary />
          <AccountConfig balance={account.balance} setNewBalance={setNewBalance} />
        </div>
        <SymbolsConfig />
      </div>
      <OrdersTable />
    </div>
  );
}

export default App;
