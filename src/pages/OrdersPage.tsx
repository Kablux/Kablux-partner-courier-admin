import React, { useState } from "react";
import { Box } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import CustomerProfileModal, { ProfileDetail } from "../components/order/CustomProfile";
import OrdersTable from "../components/order/OrdersTable";
import { Order, ORDER_SUMMARY, ORDERS } from "../data/data";

const orderToProfile = (o: Order): ProfileDetail => ({
  name: o.name,
  email: `${o.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  rating: o.rating,
  reminder: "Reminder 4 months before next inspection and paper registration",
  phone: o.phone,
  address: o.address,
  points: { bonus: 150, mileage: 140 },
  rideOverview: { total: 150, completed: 140, canceled: 10 },
  rideInfo: {
    type: "Car",
    carModel: o.vehicle,
    carColor: "Blue",
    registration: "15.01.2025",
  },
  bankInfo: { name: "Ade Washiu", accountNumber: "234568798", bank: "Polaris" },
  totalAmount: 200000,
});

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Dummy stats (swap ORDER_SUMMARY for API data later)
  const orderStats: OverviewItem[] = [
    {
      title: "Total Orders",
      value: ORDER_SUMMARY.total,
      icon: <ReceiptLongRoundedIcon />,
    },
    {
      title: "Active Orders",
      value: ORDER_SUMMARY.active,
      icon: <LocalShippingRoundedIcon />,
    },
    {
      title: "Cancelled Orders",
      value: ORDER_SUMMARY.cancelled,
      icon: <CancelRoundedIcon />,
    },
  ];

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: 1 }}
    >
      {/* Overview Cards Block */}
      <OverviewCards items={orderStats} maxWidth={620} />

      {/* Orders table */}
      <OrdersTable
        orders={ORDERS}
        onRowClick={(order) => setSelectedOrder(order)}
       
      />

      {/* Profile modal (opens on row click) */}
      <CustomerProfileModal
        profile={selectedOrder ? orderToProfile(selectedOrder) : null}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Box>
  );
}