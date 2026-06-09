import { useState } from "react";
import { useAppStore } from "../../viewmodels/store";
import InputNumber from "../basics/number-input";

/*
{
  ticker: string;
	currentPrice: number;
	longsStop: number;
	shortsStop: number;
	min: number;
	max: number
}
*/

export default function AddSymbol() {
	const [ticker, setTicker] = useState("");
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(5000);
	const [currentPrice, setCurrentPrice] = useState(2500);
	const addSymbol = useAppStore((st) => st.addSymbol);

	return (
		<div>
			<div className="form-group">
				<label htmlFor="ticker">Ticker </label>
				<div className="input-wrapper">
					<input
						type="text"
						id="ticker"
						placeholder="Ej. BTCUSD"
						value={ticker}
						onChange={(e) => setTicker(e.target.value)}
					/>
				</div>
			</div>

			<div className="label-row">
				<InputNumber
					id="minPrice"
					label="Precio mínimo"
					placeholder="10"
					max={max}
					value={min}
					onValueChange={(v) => {
						setMin(v);
						setCurrentPrice(Math.max(min, currentPrice));
						console.log(min, currentPrice);
					}}
					after="currency"
				/>

				<InputNumber
					id="maxPrice"
					label="Precio máximo"
					placeholder="1302"
					min={min}
					max={max + 1000}
					value={max}
					onValueChange={(v) => {
						setMax(v);
						setCurrentPrice(Math.min(max, currentPrice));
					}}
					after="currency"
				/>
			</div>

			<InputNumber
				id="currentPrice"
				label="Precio actual"
				placeholder="1000"
				min={min}
				max={max}
				value={currentPrice}
				onValueChange={setCurrentPrice}
				after="currency"
			/>

			<button
				onClick={() => {
					addSymbol({
						ticker,
						min,
						max,
						currentPrice,
						longsStop: min,
						shortsStop: max,
						colorClass: "text-main",
					});
				}}
				type="button"
			>
				Agregar
			</button>
		</div>
	);
}
