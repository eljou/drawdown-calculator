import type { MarketSymbol } from "../../domain";
import { useAppStore } from "../../viewmodels/store";
import Accordion from "../basics/accordeon";
import AddSymbol from "./add-symbol";
import SymbolConfig from "./symbol-config";

export default function SymbolsConfig() {
	const symbolsConfig = useAppStore((st) => st.symbolConfigs);
	const updateSymbolParams = useAppStore((st) => st.updateSymbolParams);

	return (
		<div className="card">
			<h2>Configuración de símbolos</h2>

			<Accordion headContent="Agregar Símbolo">
				<AddSymbol />
			</Accordion>

			<div className="form-group">
				{Object.values(symbolsConfig).map((s) => (
					<div key={s.ticker}>
						<Accordion
							headContent={(isOpen) =>
								!isOpen ? (
									<CompactSymbolClosed {...s} />
								) : (
									<CompactSymbolOpen {...s} />
								)
							}
						>
							<SymbolConfig state={s} onChange={updateSymbolParams} />
						</Accordion>
					</div>
				))}
			</div>
		</div>
	);
}

const CompactSymbolOpen = (s: MarketSymbol) => {
	return (
		<div className="ticker-preview-card">
			{/* Header Section */}
			<div className="ticker-card-header">
				<span className="ticker-badge">{s.ticker.toUpperCase()}</span>
				<div className="ticker-live-status">
					<span className="status-dot animate-pulse"></span>
					Active Metric
				</div>
			</div>
		</div>
	);
};

const CompactSymbolClosed = (s: MarketSymbol) => {
	return (
		<div className="ticker-preview-card">
			{/* Header Section */}
			<div className="ticker-card-header">
				<span className="ticker-badge">{s.ticker.toUpperCase()}</span>
			</div>

			<div className="ticker-card-divider" />

			{/* Metrics Grid Layout */}
			<div className="ticker-metrics-grid">
				<div className="metric-row current-price-row">
					<span className="metric-label">Precio actual</span>
					<b className="metric-value">
						${Number(s.currentPrice).toLocaleString()}
					</b>
				</div>

				<div className="metric-row long-limit-row">
					<span className="metric-label">Stop Loss COMPRAS</span>
					<b className="metric-value long-text">
						${Number(s.longsStop).toLocaleString()}
					</b>
				</div>

				<div className="metric-row short-limit-row">
					<span className="metric-label">Stop Loss VENTAS</span>
					<b className="metric-value short-text">
						${Number(s.shortsStop).toLocaleString()}
					</b>
				</div>
			</div>
		</div>
	);
};
