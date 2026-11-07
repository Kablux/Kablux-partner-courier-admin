import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { OrderDetail, OrderListItem } from "../../types/index.types";
import AppModal from "../common/AppModal";
import ErrorState from "../common/ErrorState";
import OrderStatusChip from "./OrderStatusChip";
import {
  EMPTY_VALUE,
  formatDateTime,
  formatEnum,
  formatMoney,
} from "./utils";

const cardSx = {
  p: 2,
  borderRadius: "10px",
  border: "1px solid var(--border, rgba(255,255,255,0.12))",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box>
    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>{title}</Typography>
    {children}
  </Box>
);

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 13, fontWeight: 500, wordBreak: "break-word" }}>
      {value || EMPTY_VALUE}
    </Typography>
  </Box>
);

const FieldGrid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      ...cardSx,
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
      gap: 2,
    }}
  >
    {children}
  </Box>
);

const joinContact = (name?: string | null, contact?: string | null) =>
  [name, contact].filter(Boolean).join(" · ") || EMPTY_VALUE;

export function OrderDetailContent({ detail }: { detail: OrderDetail }) {
  const items = detail.items ?? [];
  const stops = detail.stop_info ?? [];
  const delivery = detail.delivery;
  const rider = delivery?.rider;
  const orderPackage = detail.package;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <OrderStatusChip status={detail.status} />
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          {formatMoney(detail.price)}
        </Typography>
      </Box>

      <Section title="Order">
        <FieldGrid>
          <Field label="Reference" value={detail.reference} />
          <Field label="External reference" value={detail.external_reference} />
          <Field
            label="Partner status"
            value={formatEnum(detail.partner_status)}
          />
          <Field label="Source" value={formatEnum(detail.order_source)} />
          <Field label="Category" value={formatEnum(detail.category)} />
          <Field label="Priority" value={formatEnum(detail.priority)} />
          <Field
            label="Preferred vehicle"
            value={formatEnum(detail.preferred_delivery_vehicle_type)}
          />
          <Field
            label="Payment method"
            value={formatEnum(detail.payment_method)}
          />
          <Field
            label="Payment on delivery"
            value={detail.payment_on_delivery ? "Yes" : "No"}
          />
          <Field label="Last updated" value={formatDateTime(detail.updated_at)} />
        </FieldGrid>
      </Section>

      <Section title="Route">
        <Box
          sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box>
            <Field label="Pickup" value={detail.vendor_address} />
            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {joinContact(detail.pickup_contact_name, detail.pickup_contact)} ·
              Scheduled{" "}
              {formatDateTime(detail.scheduled_pickup_time)}
            </Typography>
          </Box>

          {stops.map((stop, index) => (
            <Field
              key={`${stop.address}-${index}`}
              label={`Stop ${index + 1}`}
              value={stop.address}
            />
          ))}

          <Box>
            <Field label="Drop-off" value={detail.recipient_address} />
            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {joinContact(detail.recipient_name, detail.recipient_contact)} ·
              Scheduled{" "}
              {formatDateTime(detail.scheduled_delivery_time)}
            </Typography>
          </Box>
        </Box>
      </Section>

      <Section title={`Items (${items.length})`}>
        <Box sx={cardSx}>
          {items.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
              No items listed.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map((item, index) => (
                <Box
                  key={`${item.name}-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>{item.name}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {formatMoney(item.price)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Section>

      {orderPackage && (
        <Section title="Package">
          <FieldGrid>
            <Field label="Description" value={orderPackage.description} />
            <Field
              label="Quantity"
              value={orderPackage.quantity?.toString()}
            />
            <Field
              label="Weight"
              value={
                orderPackage.weight_kg
                  ? `${orderPackage.weight_kg} kg`
                  : null
              }
            />
            <Field
              label="Declared value"
              value={formatMoney(orderPackage.declared_value)}
            />
            <Field label="Fragile" value={orderPackage.fragile ? "Yes" : "No"} />
          </FieldGrid>
        </Section>
      )}

      {detail.delivery_instructions && (
        <Section title="Delivery instructions">
          <Typography sx={{ ...cardSx, fontSize: 13 }}>
            {detail.delivery_instructions}
          </Typography>
        </Section>
      )}

      <Section title="Delivery">
        {delivery ? (
          <FieldGrid>
            <Field label="Rider" value={rider?.full_name} />
            <Field label="Rider phone" value={rider?.phone} />
            <Field
              label="Vehicle"
              value={
                rider
                  ? [formatEnum(rider.vehicle_type), rider.plate_number]
                      .filter(Boolean)
                      .join(" · ")
                  : null
              }
            />
            <Field
              label="Rider rating"
              value={rider?.rating ? String(rider.rating) : null}
            />
            <Field label="Stage" value={formatEnum(delivery.current_stage)} />
            <Field
              label="Delivery status"
              value={formatEnum(delivery.status)}
            />
            <Field label="Pickup code" value={delivery.pickup_code} />
            <Field label="Drop-off code" value={delivery.dropoff_code} />
          </FieldGrid>
        ) : (
          <Typography
            sx={{ ...cardSx, fontSize: 13, color: "var(--text-secondary)" }}
          >
            No rider has accepted this order yet.
          </Typography>
        )}
      </Section>
    </Box>
  );
}

const DetailSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Skeleton variant="text" width="40%" height={32} />
    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
  </Box>
);

interface Props {
  order: OrderListItem | null;
  detail: OrderDetail | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  detail,
  loading,
  error,
  onRetry,
  onClose,
}: Props) {
  return (
    <AppModal
      open={!!order}
      onClose={onClose}
      title={order?.order_code ? `Order ${order.order_code}` : "Order details"}
      subtitle={
        order?.created_at
          ? `Created ${formatDateTime(order.created_at)}`
          : undefined
      }
    >
      {error ? (
        <ErrorState
          title="Couldn't load this order"
          message={error}
          onRetry={onRetry}
        />
      ) : order && detail && !loading ? (
        // The list row fills in fields the detail response may not repeat.
        <OrderDetailContent detail={{ ...order, ...detail }} />
      ) : (
        <DetailSkeleton />
      )}
    </AppModal>
  );
}
