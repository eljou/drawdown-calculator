import type { Order } from "../domain";
import { useAppStore } from "../viewmodels/store";
import AddOrder from "./add-order";
import FileInput from "./basics/file-input";

export default function AccountConfig(props: {
	balance: number;
	setNewBalance: (newBalance: number) => void;
}) {
	const addNewOrder = useAppStore((st) => st.addOrder);
	const setUpOrders = useAppStore((st) => st.setUpOrders);
	const symbolConfigs = useAppStore((st) => st.symbolConfigs);

	const handleCsvUpload = (text: string) => {
		const csvContent = text.split("\n").map((row) => row.split(","));
		const dataMatrix = csvContent.slice(1, csvContent.length - 1);

		const operations = dataMatrix.reduce<Order[]>(
			(orders, line) => [
				...orders,
				{
					id: line[0],
					createdAt: new Date(line[1]),
					type: line[2] as Order["type"],
					lots: Number(line[3]),
					symbol: line[4],
					openPrice: Number(line[5]),
				},
			],
			[],
		);

		setUpOrders(operations);
	};

	return (
		<div className="card">
			<div
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}
			>
				<div>
					<h2>Configuración de Cuenta</h2>

					<div className="form-group">
						<label htmlFor="balance">Balance</label>
						<div className="input-wrapper currency">
							<input
								type="number"
								id="balance"
								style={{ fontSize: "1.5rem" }}
								value={props.balance}
								onChange={(e) => props.setNewBalance(Number(e.target.value))}
							/>
						</div>
					</div>

					<FileInput onCsvDataParse={handleCsvUpload} />
				</div>

				<AddOrder
					validSymbols={Object.keys(symbolConfigs)}
					onAddOrder={addNewOrder}
				/>
			</div>
		</div>
	);
}
