import { getAccountResume } from "../../domain";
import { useAppStore } from "../../viewmodels/store";
import "./metrics-summary.css";

export default function MetricsSummary() {
	const account = useAppStore((st) => st.account);
	const orders = useAppStore((st) => st.orders);
	const {
		rescueCapital,
		totalEquity,
		equity,
		stopLossPnL,
		pnl,
		maxDrawdown,
		drawdown,
		exposition,
	} = getAccountResume(account, orders);

	const pnlClass = stopLossPnL >= 0 ? "profit" : "drawdown";
	const equityClass = totalEquity >= 0 ? "profit" : "drawdown";

	return (
		<div className="card">
			<div className="label-row" style={{ alignItems: "flex-end" }}>
				<h2>Resumen de Métricas</h2>

				<div className="stat-box profit" style={{ padding: "10px" }}>
					<div className="stat-label stat-label-title">Capital de rescate</div>
					<div className="label-row baseline" style={{ marginBottom: "0px" }}>
						<span className="stat-label">+500</span>
						<div className="stat-value">${rescueCapital.toFixed(2)}</div>
					</div>
				</div>
			</div>
			<hr />
			<br />

			<div className="summary-stats">
				<div className={`stat-box ${equityClass}`}>
					<div className="stat-label stat-label-title">Saldo</div>
					<div className="label-row baseline">
						<span className="stat-label">Final</span>
						<div className="stat-value">${totalEquity.toFixed(2)}</div>
					</div>
					<hr />

					<div className="label-row baseline">
						<span className="stat-label">Actual</span>
						<div className="stat-value">
							<small>${equity.toFixed(2)}</small>
						</div>
					</div>
				</div>

				<div className={`stat-box ${pnlClass}`}>
					<div className="stat-label stat-label-title">P&L</div>
					<div className="label-row baseline">
						<span className="stat-label">Final</span>
						<div className="stat-value">
							{stopLossPnL >= 0 ? "" : "-"}${Math.abs(stopLossPnL).toFixed(2)}
						</div>
					</div>
					<hr />

					<div className="label-row baseline">
						<div className="stat-label">Actual</div>
						<div className="stat-value">
							<small>
								{pnl >= 0 ? "" : "-"}${Math.abs(pnl).toFixed(2)}
							</small>
						</div>
					</div>
				</div>

				<div className="stat-box drawdown">
					<div className="stat-label stat-label-title">Drawdown</div>
					<div className="label-row baseline">
						<span className="stat-label">Final</span>
						<div className="stat-value">{maxDrawdown.toFixed(2)}%</div>
					</div>
					<hr />
					<div className="label-row baseline">
						<div className="stat-label">Actual</div>
						<div className="stat-value">
							<small>{drawdown.toFixed(2)}%</small>
						</div>
					</div>
				</div>

				<div className="stat-box neutral">
					<div className="stat-label stat-label-title">Exposición</div>
					{Object.keys(exposition).map((k) => (
						<div key={k} className="label-row">
							<div className="stat-label">{k}</div>
							<div className="stat-value">{exposition[k].toFixed(2)}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
