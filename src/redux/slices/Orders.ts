import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderDetail, fetchOrders } from "../../api/xhrHelper";
import { OrderDetail, OrderListItem } from "../../types/index.types";
import { logout, sessionExpired } from "./Auth";

interface OrdersState {
  orders: OrderListItem[];
  count: number;
  loading: boolean;
  error: string | null;

  /** The order the detail modal is showing. Late responses for others are dropped. */
  detailId: string | null;
  detail: OrderDetail | null;
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  count: 0,
  loading: false,
  error: null,

  detailId: null,
  detail: null,
  detailLoading: false,
  detailError: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetail: (state) => {
      state.detailId = null;
      state.detail = null;
      state.detailLoading = false;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Orders hold customer contacts, so never carry them to the next account.
      .addCase(logout, () => initialState)
      .addCase(sessionExpired, () => initialState)

      // List
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load orders.";
      })

      // Detail
      .addCase(fetchOrderDetail.pending, (state, action) => {
        state.detailId = action.meta.arg;
        state.detail = null;
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        if (state.detailId !== action.meta.arg) return;
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        if (state.detailId !== action.meta.arg) return;
        state.detailLoading = false;
        state.detailError =
          action.payload?.message || "Failed to load this order.";
      });
  },
});

export const { clearOrderDetail } = ordersSlice.actions;
export default ordersSlice.reducer;
