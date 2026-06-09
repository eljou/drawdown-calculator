import { useState } from "react";
import type { MarketSymbol, ResumedOrder } from "../../domain";
import type { AppStore } from "../../viewmodels/store";
import InputNumber from "../basics/number-input";

const getOrdersAvgDelta = (orders: ResumedOrder[], ticker: string) => {
	if (orders.length === 0) return 0;

	const sortedByPrice = orders
		.filter((o) => o.symbol === ticker)
		.sort((a, b) => a.openPrice - b.openPrice);

	const minPrice = sortedByPrice[0].openPrice;
	const maxPrice = sortedByPrice[sortedByPrice.length - 1].openPrice;
	return (maxPrice - minPrice) / sortedByPrice.length;
};

export default function AddDummyOrders({
	symbolConfigs,
	orders,
	addEstimatedOrders,
}: {
	symbolConfigs: Record<string, MarketSymbol>;
	orders: ResumedOrder[];
	addEstimatedOrders: AppStore["addEstimatedOrders"];
}) {
	const [multiplier, setMultiplier] = useState(1);
	const [ticker, setTicker] = useState<string>("BTCUSD");

	const avgDelta = getOrdersAvgDelta(orders, ticker);

	return (
		<div className="card" style={{ padding: "0.5rem" }}>
			<b>Agregar ordenes estimadas</b>
			<div
				className="label-row"
				style={{ padding: "0.2rem", marginBottom: 0, alignItems: "flex-start" }}
			>
				<div
					className="form-group"
					style={{ marginRight: 20, marginBottom: 0 }}
				>
					<label htmlFor="symbol">Símbolo / Activo</label>
					<div className="input-wrapper">
						<select
							id="symbol"
							className="select-box"
							value={ticker}
							onChange={(e) => setTicker(e.target.value)}
						>
							{Object.keys(symbolConfigs).map((sym) => (
								<option key={sym} value={sym}>
									{sym}
								</option>
							))}
						</select>
					</div>
				</div>

				<div style={{ minWidth: 150, marginRight: 20 }}>
					<p
						className="text-muted"
						style={{ marginBottom: 5, marginTop: 0, fontSize: "1rem" }}
					>
						Average distance
					</p>

					<span>${(avgDelta * multiplier).toFixed(2).toLocaleString()}</span>
				</div>

				<InputNumber
					id="gapMultiplier"
					label="Mult"
					max={10}
					placeholder="2"
					value={multiplier}
					onValueChange={setMultiplier}
					step={1}
					min={1}
					styles={{ fontSize: "0.2rem", minWidth: 65, marginRight: 20 }}
					mb={0}
				/>
				<button
					type="button"
					style={{ width: 100, marginTop: 18 }}
					onClick={() => addEstimatedOrders(ticker, multiplier, avgDelta)}
				>
					Add
				</button>
			</div>
		</div>
	);
}
