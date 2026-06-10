import type { Account } from "./account";
import type { MarketSymbol } from "./market-symbol";
import type { Order, ResumedOrder } from "./order";

const getOrderPnL = (order: Order, symbol: MarketSymbol, total = true) => {
  const priceLimit =
    total === true
      ? order.type === "buy"
        ? symbol.longsStop
        : symbol.shortsStop
      : symbol.currentPrice;

  if (order.symbol === symbol.ticker)
    return order.lots * (priceLimit - order.openPrice);

  return 0;
};

export const getOrderResume = (
  order: Order,
  symbol: MarketSymbol,
): ResumedOrder => {
  const totalPnL = getOrderPnL(order, symbol);
  const currentPnL = getOrderPnL(order, symbol, false);
  return { ...order, totalPnL, currentPnL };
};

export const removeOrder = (
  id: string,
  orders: ResumedOrder[],
): ResumedOrder[] => orders.filter((o) => o.id !== id);

export const createAccount = (balance: number): Account => ({
  balance,
  equity: balance,
  pnl: 0,
  totalEquity: 0,
  totalPnL: 0,
});

export const updateAccountEquityAndPnL = (
  account: Account,
  orders: Order[],
  symbols: Record<string, MarketSymbol>,
): Account => {
  const { currentPnL, totalPnL } = orders.reduce(
    (acc, o) => {
      const orderResume = getOrderResume(o, symbols[o.symbol]);
      acc.currentPnL += orderResume.currentPnL;
      acc.totalPnL += orderResume.totalPnL;
      return acc;
    },
    { totalPnL: 0, currentPnL: 0 },
  );

  return {
    balance: account.balance,
    equity: account.balance + currentPnL,
    totalEquity: account.balance + totalPnL,
    pnl: currentPnL,
    totalPnL,
  };
};

export type AccountMetrics = {
  orders: Order[];
  equity: number;
  totalEquity: number;
  pnl: number;
  drawdown: number;
  stopLossPnL: number;
  maxDrawdown: number;
  exposition: Record<string, number>;
  rescueCapital: number;
};
export const getAccountResume = (
  account: Account,
  orders: Order[],
): AccountMetrics => {
  const expositionBySymbol = orders.reduce<Record<string, number>>(
    (acc, o) => ({ ...acc, [o.symbol]: (acc[o.symbol] ?? 0) + o.lots }),
    {},
  );

  return {
    orders,
    equity: account.equity,
    totalEquity: account.totalEquity,
    rescueCapital:
      account.totalEquity < 0 ? Math.abs(account.totalEquity) + 500 : 0,
    pnl: account.pnl,
    drawdown: (Math.abs(account.pnl) / account.balance) * 100,
    stopLossPnL: account.totalPnL,
    maxDrawdown: (Math.abs(account.totalPnL) / account.balance) * 100,
    exposition: expositionBySymbol,
  };
};

export function addEstimatedOrders(
  orders: ResumedOrder[],
  symbol: MarketSymbol,
  avgDelta: number,
  lots: number,
): ResumedOrder[] {
  if (orders.length === 0) return [];

  const sortedByPrice = orders
    .filter((o) => o.symbol === symbol.ticker)
    .sort((a, b) => a.openPrice - b.openPrice);
  const minPrice = sortedByPrice[0].openPrice;

  const remainingPriceGap = minPrice - symbol.longsStop;
  const newOpsNo = Math.floor(remainingPriceGap / avgDelta);

  const result = [];
  for (let i = 1; i <= newOpsNo; i++) {
    result.push(
      getOrderResume(
        {
          id: crypto.randomUUID().substr(0, 9),
          createdAt: new Date(),
          symbol: symbol.ticker,
          openPrice: minPrice - i * avgDelta,
          lots,
          type: "buy",
        },
        symbol,
      ),
    );
  }

  return result.reverse().concat(orders);
}
