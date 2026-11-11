import { Box, Skeleton, Typography } from "@mui/material";
import { WalletTransaction } from "../../types/index.types";
import { formatDateTime } from "../../utils/format";
import AppModal from "../common/AppModal";
import ErrorState from "../common/ErrorState";
import { StatusChip } from "./WalletTransactionsTable";
import { directionOf, formatAmount, humanizeCode } from "./walletFormat";

const Field = ({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</Typography>
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 500,
        wordBreak: "break-all",
        fontFamily: mono ? "monospace" : undefined,
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

interface Props {
  transaction: WalletTransaction | null;
  detail: WalletTransaction | null;
  currency: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export default function TransactionDetailModal({
  transaction,
  detail,
  currency,
  loading,
  error,
  onRetry,
  onClose,
}: Props) {
  // The list row fills in while the detail loads.
  const txn = detail ?? transaction;
  const dir = directionOf(txn?.direction);

  return (
    <AppModal
      open={!!transaction}
      onClose={onClose}
      maxWidth={500}
      title="Transaction details"
      subtitle={txn ? humanizeCode(txn.type) : undefined}
    >
      {error ? (
        <ErrorState title="Couldn't load this transaction" message={error} onRetry={onRetry} />
      ) : !txn ? null : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Typography
              sx={{ fontSize: 24, fontWeight: 700, color: dir === "in" ? "#16A34A" : "var(--text-primary)" }}
            >
              {dir === "in" ? "+" : dir === "out" ? "−" : ""}
              {formatAmount(txn.amount, currency)}
            </Typography>
            <StatusChip status={txn.status} />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              p: 2,
              borderRadius: "10px",
              border: "1px solid var(--border-subtle, var(--border))",
            }}
          >
            <Field label="Type" value={humanizeCode(txn.type)} />
            <Field
              label="Direction"
              value={dir === "in" ? "Money in" : dir === "out" ? "Money out" : humanizeCode(txn.direction)}
            />
            <Field label="Reference" value={txn.reference} mono />
            <Field label="Transaction ID" value={txn.id} mono />
            <Field label="Created" value={formatDateTime(txn.created_at)} />
            {loading ? (
              <Box>
                <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Last updated</Typography>
                <Skeleton variant="text" width={120} />
              </Box>
            ) : (
              <Field label="Last updated" value={formatDateTime(detail?.updated_at)} />
            )}
          </Box>
        </Box>
      )}
    </AppModal>
  );
}
