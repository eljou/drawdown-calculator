import { useState } from "react";
import type { Order } from "../../domain";
import "./add-order.css";

export default function AddOrder(props: {
	onAddOrder: (order: Order) => void;
	validSymbols: string[];
}) {
	const [openPrice, setOpenPrice] = useState("");
	const [lots, setLots] = useState("");
	const [symbol, setSymbol] = useState("BTCUSD");
	const [type, setType] = useState<"buy" | "sell">("buy");

	const handleSubmit = () => {
		if (!openPrice || !lots || !symbol.trim()) return;

		const newOrder = {
			id: crypto.randomUUID(),
			createdAt: new Date(),
			symbol: symbol.trim().toUpperCase(),
			openPrice: Number(openPrice),
			lots: Number(lots),
			type: type,
		};

		props.onAddOrder(newOrder);

		setOpenPrice("");
		setLots("");
	};

	return (
		<div className="card">
			<div style={{ display: "flex", flexDirection: "column" }}>
				<h2>Nueva Operación</h2>
				<br />

				<div>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div className="form-group">
							<label htmlFor="symbol">Símbolo / Activo</label>
							<div className="input-wrapper">
								<select
									id="symbol"
									className="select-box"
									value={symbol}
									onChange={(e) => setSymbol(e.target.value)}
								>
									{props.validSymbols.map((sym) => (
										<option key={sym} value={sym}>
											{sym}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="type">Tipo de Operación</label>
							<div className="input-wrapper">
								<select
									id="type"
									value={type}
									onChange={(e) => setType(e.target.value as "buy" | "sell")}
									className="select-box"
								>
									<option value="buy">COMPRA</option>
									<option value="sell">VENTA</option>
								</select>
							</div>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="openPrice">Precio de Apertura</label>
						<div className="input-wrapper currency">
							<input
								type="number"
								id="openPrice"
								placeholder="Ej. 75300"
								value={openPrice}
								onChange={(e) => setOpenPrice(e.target.value)}
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="lots">Tamaño de Posición (Lotes / BTC)</label>
						<div className="input-wrapper lots">
							<input
								type="number"
								id="lots"
								step="0.01"
								placeholder="Ej. 0.50"
								value={lots}
								onChange={(e) => setLots(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<br />
				<br />
				<button onClick={handleSubmit} type="button">
					Agregar
				</button>
			</div>
		</div>
	);
}
