import { createSlice } from "@reduxjs/toolkit";
import {
  createWalletTopUp,
  fetchWalletSummary,
  fetchWalletTransaction,
  fetchWalletTransactions,
} from "../../api/xhrHelper";
import { WalletSummary, WalletTransaction } from "../../types/index.types";
import { logout, sessionExpired } from "./Auth";

/** Members get a 403 from the wallet endpoints; that decides what the page shows. */
export type WalletAccess = "unknown" | "allowed" | "denied";

interface WalletState {
  access: WalletAccess;

  summary: WalletSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;

  transactions: WalletTransaction[];
  /** Total across all pages, from the server. */
  count: number;
  transactionsLoading: boolean;
  transactionsError: string | null;
  /** Only the latest page request may update the list. */
  latestTransactionsRequest: string | null;

  /** The transaction open in the detail modal. Late answers for others are dropped. */
  detailId: string | null;
  detail: WalletTransaction | null;
  detailLoading: boolean;
  detailError: string | null;

  toppingUp: boolean;
}

const initialState: WalletState = {
  access: "unknown",
  summary: null,
  summaryLoading: false,
  summaryError: null,
  transactions: [],
  count: 0,
  transactionsLoading: false,
  transactionsError: null,
  latestTransactionsRequest: null,
  detailId: null,
  detail: null,
  detailLoading: false,
  detailError: null,
  toppingUp: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearTransactionDetail: (state) => {
      state.detailId = null;
      state.detail = null;
      state.detailLoading = false;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Wallet data belongs to one organization; never show it to the next account.
      .addCase(logout, () => initialState)
      .addCase(sessionExpired, () => initialState)

      // Summary
      .addCase(fetchWalletSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchWalletSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.access = "allowed";
        state.summary = action.payload;
      })
      .addCase(fetchWalletSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.summary = null;
          return;
        }
        state.summaryError = action.payload?.message || "Failed to load the wallet balance.";
      })

      // Transactions
      .addCase(fetchWalletTransactions.pending, (state, action) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
        state.latestTransactionsRequest = action.meta.requestId;
      })
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.latestTransactionsRequest) return;
        state.transactionsLoading = false;
        state.access = "allowed";
        state.transactions = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestTransactionsRequest) return;
        state.transactionsLoading = false;
        if (action.payload?.status === 403) {
          state.access = "denied";
          state.transactions = [];
          state.count = 0;
          return;
        }
        state.transactionsError =
          action.payload?.message || "Failed to load wallet transactions.";
      })

      // Transaction detail
      .addCase(fetchWalletTransaction.pending, (state, action) => {
        state.detailId = action.meta.arg;
        state.detail = null;
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchWalletTransaction.fulfilled, (state, action) => {
        if (state.detailId !== action.meta.arg) return;
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchWalletTransaction.rejected, (state, action) => {
        if (state.detailId !== action.meta.arg) return;
        state.detailLoading = false;
        state.detailError = action.payload?.message || "Failed to load this transaction.";
      })

      // Top-up
      .addCase(createWalletTopUp.pending, (state) => {
        state.toppingUp = true;
      })
      .addCase(createWalletTopUp.fulfilled, (state) => {
        // Stays "in progress" while the browser leaves for Paystack.
        state.toppingUp = true;
      })
      .addCase(createWalletTopUp.rejected, (state, action) => {
        state.toppingUp = false;
        if (action.payload?.status === 403) state.access = "denied";
      });
  },
});

export const { clearTransactionDetail } = walletSlice.actions;
export default walletSlice.reducer;
