export type Order = {
	id: string;
	createdAt: Date;
	symbol: string;
	openPrice: number;
	lots: number;
	type: "buy" | "sell";
};

export type ResumedOrder = Order & { totalPnL: number; currentPnL: number };
