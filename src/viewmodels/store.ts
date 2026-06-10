import { create } from "zustand";
import {
  addEstimatedOrders,
  getOrderResume,
  type MarketSymbol,
  type Order,
  type ResumedOrder,
  removeOrder,
  updateAccountEquityAndPnL,
} from "../domain";
import { type Account, createAccount } from "../domain/";

type StoreSymbol = MarketSymbol & {
  min: number;
  max: number;
  colorClass: string;
};

export type AppStore = {
  account: Account;
  orders: ResumedOrder[];
  symbolConfigs: Record<string, StoreSymbol>;
  addSymbol: (symbol: StoreSymbol) => void;
  updateBalance: (newBalance: number) => void;
  updateSymbolParams: (symbol: MarketSymbol) => void;
  setUpOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
  addEstimatedOrders: (
    symbol: MarketSymbol["ticker"],
    mult: number,
    baseDiff: number,
    lots: number,
  ) => void;
};

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
      colorClass: "text-orange",
    },
    ETHUSD: {
      ticker: "ETHUSD",
      currentPrice: 1600,
      longsStop: 900,
      shortsStop: 2500,
      min: 100,
      max: 7000,
      colorClass: "text-magenta",
    },
  },

  addSymbol: (symbol) =>
    set((st) => ({
      symbolConfigs: { ...st.symbolConfigs, [symbol.ticker]: symbol },
    })),

  updateBalance: (newBalance: number) =>
    set((st) => ({
      account: updateAccountEquityAndPnL(
        createAccount(newBalance),
        st.orders,
        st.symbolConfigs,
      ),
    })),

  setUpOrders: (orders: Order[]) =>
    set((st) => {
      const updatedOrders = orders.map((o) =>
        getOrderResume(o, st.symbolConfigs[o.symbol]),
      );

      return {
        account: updateAccountEquityAndPnL(
          st.account,
          updatedOrders,
          st.symbolConfigs,
        ),
        orders: updatedOrders,
      };
    }),

  addOrder: (order: Order) =>
    set((st) => {
      const updatedOrders = [
        getOrderResume(order, st.symbolConfigs[order.symbol]),
        ...st.orders,
      ];

      return {
        account: updateAccountEquityAndPnL(
          st.account,
          updatedOrders,
          st.symbolConfigs,
        ),
        orders: updatedOrders,
      };
    }),

  removeOrder: (id: string) =>
    set((st) => {
      const updatedOrders = removeOrder(id, st.orders);
      return {
        account: updateAccountEquityAndPnL(
          st.account,
          updatedOrders,
          st.symbolConfigs,
        ),
        orders: updatedOrders,
      };
    }),

  updateSymbolParams: (symbol: MarketSymbol) =>
    set((st) => {
      const symbolToUpdate = st.symbolConfigs[symbol.ticker];

      const newSymbolConfigs = {
        ...st.symbolConfigs,
        [symbol.ticker]: { ...symbolToUpdate, ...symbol },
      };

      const updatedOrders = st.orders.map((o) =>
        getOrderResume(o, newSymbolConfigs[o.symbol]),
      );

      return {
        account: updateAccountEquityAndPnL(
          st.account,
          updatedOrders,
          newSymbolConfigs,
        ),
        symbolConfigs: newSymbolConfigs,
        orders: updatedOrders,
      };
    }),

  addEstimatedOrders: (symbol, mult, avgDelta, lots) =>
    set((st) => {
      const newOrders = addEstimatedOrders(
        st.orders,
        st.symbolConfigs[symbol],
        avgDelta * mult,
        lots,
      );

      return {
        account: updateAccountEquityAndPnL(
          st.account,
          newOrders,
          st.symbolConfigs,
        ),
        orders: newOrders,
      };
    }),
}));
