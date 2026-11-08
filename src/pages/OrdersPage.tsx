import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { MdElectricBike } from "react-icons/md";
import { fetchOrderDetail, fetchOrders } from "../api/xhrHelper";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import OrderDetailModal from "../components/order/OrderDetailModal";
import OrdersTable from "../components/order/OrdersTable";
import { EMPTY_VALUE, getOrderGroup } from "../components/order/utils";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearOrderDetail } from "../redux/slices/Orders";
import { OrderListItem } from "../types/index.types";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, count, loading, error, detail, detailLoading, detailError } =
    useAppSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(
    null,
  );

  const loadOrders = useCallback(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleRowClick = (order: OrderListItem) => {
    setSelectedOrder(order);
    dispatch(fetchOrderDetail(order.id));
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    dispatch(clearOrderDetail());
  };

  const orderStats = useMemo<OverviewItem[]>(() => {
    const countGroup = (group: "active" | "cancelled") =>
      orders.filter((o) => getOrderGroup(o.status) === group).length;

    return [
      {
        title: "Total Orders",
        value: error ? EMPTY_VALUE : count,
        icon: <ReceiptLongRoundedIcon />,
      },
      {
        title: "Active Orders",
        value: error ? EMPTY_VALUE : countGroup("active"),
        icon: <MdElectricBike color="#4A90E2" />,
      },
      {
        title: "Cancelled Orders",
        value: error ? EMPTY_VALUE : countGroup("cancelled"),
        icon: <CancelRoundedIcon color="error" />,
      },
    ];
  }, [orders, count, error]);

  // A background refetch keeps the current rows on screen.
  const showLoading = loading && orders.length === 0;

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: 1 }}
    >
      <OverviewCards items={orderStats} maxWidth={768} loading={showLoading} />

      <OrdersTable
        orders={orders}
        loading={showLoading}
        error={error}
        onRetry={loadOrders}
        onRowClick={handleRowClick}
      />

      <OrderDetailModal
        order={selectedOrder}
        detail={detail}
        loading={detailLoading}
        error={detailError}
        onRetry={() => selectedOrder && handleRowClick(selectedOrder)}
        onClose={handleCloseDetail}
      />
    </Box>
  );
}
