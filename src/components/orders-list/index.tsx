import { useAppStore } from "../../viewmodels/store";
import AddDummyOrders from "./add-dummy-orders";

import "./orders-list.css";

export default function OrdersTable() {
  const orders = useAppStore((st) => st.orders);
  const symbolConfigs = useAppStore((st) => st.symbolConfigs);
  const removeOrder = useAppStore((st) => st.removeOrder);
  const addEstimatedOrders = useAppStore((st) => st.addEstimatedOrders);

  return (
    <div className="card">
      <div className="label-row" style={{ alignItems: "flex-end" }}>
        <h2>Historial de Posiciones Activas</h2>

        <AddDummyOrders orders={orders} symbolConfigs={symbolConfigs} addEstimatedOrders={addEstimatedOrders} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="text-center" style={{ width: "60px" }}>
                #
              </th>
              <th>Id</th>
              <th>Fecha de apertura</th>
              <th>Tipo</th>
              <th>Precio de Apertura</th>
              <th>Lotes / Unidades</th>
              <th>PnL USD</th>
              <th>Total PnL USD</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty-state">
                  No hay operaciones registradas.
                </td>
              </tr>
            ) : (
              orders.map((o, index) => (
                <tr key={o.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{o.id}</td>
                  <td>{o.createdAt.toDateString()}</td>
                  <td
                    style={{
                      color: o.type === "buy" ? "steelblue" : "salmon",
                    }}
                  >
                    {o.type}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    $
                    {o.openPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ color: symbolConfigs[o.symbol]?.color ?? "#94a3b8" }}>
                    {o.lots.toFixed(2)} {o.symbol}
                  </td>
                  <td
                    style={{ textAlign: "right" }}
                    className={o.currentPnL == 0 ? "text-muted" : o.currentPnL > 0 ? "text-green" : "text-red"}
                  >
                    {o.currentPnL > 0 ? "+" : ""}${o.currentPnL.toFixed(2)}
                  </td>
                  <td
                    style={{ textAlign: "right" }}
                    className={o.totalPnL == 0 ? "text-muted" : o.totalPnL > 0 ? "text-green" : "text-red"}
                  >
                    {o.totalPnL > 0 ? "+" : ""}${o.totalPnL.toFixed(2)}
                  </td>
                  <td>
                    <button type="button" className="btn-dimmed" onClick={() => removeOrder(o.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
