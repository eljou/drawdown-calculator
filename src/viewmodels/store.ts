import { create } from "zustand";
import {
  addEstimatedOrders,
  addOrder,
  getOrderResume,
  type MarketSymbol,
  type Order,
  type ResumedOrder,
  removeOrder,
  updateAccountEquityAndPnL,
} from "../domain";
import { type Account, createAccount } from "../domain/";

export type StoreSymbol = MarketSymbol & {
  min: number;
  max: number;
  color: string;
};
export type SymbolConfigs = Record<string, StoreSymbol>;

export type AppStore = {
  account: Account;
  orders: ResumedOrder[];
  symbolConfigs: SymbolConfigs;
  updateBalance: (newBalance: number) => void;
  setUpOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
  addEstimatedOrders: (symbol: MarketSymbol["ticker"], mult: number, baseDiff: number, lots: number) => void;
  addSymbol: (symbol: StoreSymbol) => void;
  updateSymbolParams: (symbol: StoreSymbol) => void;
  removeSymbol: (ticker: string) => void;
};

const getOrderSymbol = (order: Order, symbolConfigs: SymbolConfigs) => symbolConfigs[order.symbol];

const addNewOrder = (order: Order) => (orders: ResumedOrder[], symConfigs: SymbolConfigs) =>
  addOrder(order, getOrderSymbol(order, symConfigs), orders);
const setUpActualOrders = (newOrders: Order[]) => (orders: ResumedOrder[], symConfigs: SymbolConfigs) => [
  ...orders,
  ...newOrders.map((o) => getOrderResume(o, getOrderSymbol(o, symConfigs))),
];

const updateOrders = (updateFn: (st: AppStore) => ResumedOrder[]) => (st: AppStore) => {
  const symConfigs = st.symbolConfigs;
  const updatedOrders = updateFn(st);

  return {
    account: updateAccountEquityAndPnL(st.account, updatedOrders, symConfigs),
    orders: updatedOrders,
  };
};

const addOrUpdateSymbol =
  (symbol: StoreSymbol) =>
  ({ symbolConfigs }: AppStore) => ({ ...symbolConfigs, [symbol.ticker]: symbol });

const removeSymbol =
  (ticker: string) =>
  ({ symbolConfigs }: AppStore) =>
    Object.keys(symbolConfigs)
      .filter((t) => t !== ticker)
      .reduce<SymbolConfigs>((acc, t) => ({ ...acc, [t]: symbolConfigs[t] }), {});

const updateSymbols = (updateFn: (st: AppStore) => SymbolConfigs) => (st: AppStore) => {
  const symbolConfigs = updateFn(st);
  const orders = st.orders.map((o) => getOrderResume(o, symbolConfigs[o.symbol]));

  return {
    account: updateAccountEquityAndPnL(st.account, orders, symbolConfigs),
    symbolConfigs,
    orders,
  };
};

// TODO: update all state changin methods to void repeating logic
export const useAppStore = create<AppStore>((set) => ({
  account: createAccount(1000),
  orders: [],
  symbolConfigs: {
    BTCUSD: {
      ticker: "BTCUSD",
      currentPrice: 60000,
      longsStop: 35000,
      shortsStop: 70000,
      min: 20000,
      max: 120000,
      color: "orange",
    },
    ETHUSD: {
      ticker: "ETHUSD",
      currentPrice: 1600,
      longsStop: 900,
      shortsStop: 2500,
      min: 100,
      max: 7000,
      color: "#ff52ff",
    },
  },

  updateBalance: (newBalance) =>
    set((st) => ({
      account: updateAccountEquityAndPnL(createAccount(newBalance), st.orders, st.symbolConfigs),
    })),

  setUpOrders: (xs) => set(updateOrders(({ orders, symbolConfigs }) => setUpActualOrders(xs)(orders, symbolConfigs))),

  addOrder: (x) => set(updateOrders(({ orders, symbolConfigs }) => addNewOrder(x)(orders, symbolConfigs))),

  removeOrder: (id) => set(updateOrders(({ orders }) => removeOrder(id, orders))),

  addEstimatedOrders: (symbol, mult, avgDelta, lots) =>
    set(
      updateOrders(({ orders, symbolConfigs }) =>
        addEstimatedOrders(orders, symbolConfigs[symbol], avgDelta * mult, lots),
      ),
    ),

  addSymbol: (symbol) => set(updateSymbols(addOrUpdateSymbol(symbol))),

  updateSymbolParams: (updatedSymbol) => set(updateSymbols(addOrUpdateSymbol(updatedSymbol))),

  removeSymbol: (ticker) => set(updateSymbols(removeSymbol(ticker))),
}));
