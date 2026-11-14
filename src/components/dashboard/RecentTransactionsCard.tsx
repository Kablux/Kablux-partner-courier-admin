import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { fetchRecentWalletTransactions, fetchWalletTransaction } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearTransactionDetail } from "../../redux/slices/Wallet";
import { WalletTransaction } from "../../types/index.types";
import { useTeamRole } from "../../utils/useTeamRole";
import ErrorState from "../common/ErrorState";
import TransactionDetailModal from "../wallet/TransactionDetailModal";
import WalletTransactionsTable from "../wallet/WalletTransactionsTable";

/**
 * Latest wallet transactions on the dashboard. The endpoint is owner-only;
 * for members (403) the card is simply not shown.
 */
export default function RecentTransactionsCard() {
  const dispatch = useAppDispatch();
  const { recent, recentLoading, recentError, recentDenied, summary, detail, detailLoading, detailError } =
    useAppSelector((s) => s.wallet);
  const currency = summary?.currency || "NGN";
  const [selected, setSelected] = useState<WalletTransaction | null>(null);
  const recentFetchedAt = useAppSelector((s) => s.wallet.recentFetchedAt);

  // Reuses a list fetched moments ago; "Try again" forces a fresh request.
  const load = useCallback(
    (force = false) => {
      dispatch(fetchRecentWalletTransactions({ force }));
    },
    [dispatch],
  );

  const { role } = useTeamRole();
  const isMember = role === "MEMBER";

  useEffect(() => {
    if (!isMember) load();
  }, [load, isMember]);

  const openTransaction = (txn: WalletTransaction) => {
    setSelected(txn);
    dispatch(fetchWalletTransaction(txn.id));
  };

  const closeTransaction = () => {
    setSelected(null);
    dispatch(clearTransactionDetail());
  };

  if (recentDenied || isMember) return null;

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(120,130,150,0.10)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>
            Recent transactions
          </Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", mt: 0.25 }}>
            Latest activity in your organization's wallet
          </Typography>
        </Box>
        <Box
          component={RouterLink}
          to="/wallet"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--accent-gold)",
            textDecoration: "none",
            whiteSpace: "nowrap",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View all
          <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {recentError ? (
        <ErrorState title="Couldn't load recent transactions" message={recentError} onRetry={() => load(true)} />
      ) : (
        <WalletTransactionsTable
          transactions={recent}
          currency={currency}
          count={recent.length}
          loading={recentLoading || (!recentFetchedAt && !recentError)}
          page={0}
          pageSize={Math.max(recent.length, 1)}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onRowClick={openTransaction}
          hidePagination
          emptyTitle="No wallet transactions yet"
        />
      )}

      <TransactionDetailModal
        transaction={selected}
        detail={detail}
        currency={currency}
        loading={detailLoading}
        error={detailError}
        onRetry={() => selected && openTransaction(selected)}
        onClose={closeTransaction}
      />
    </Box>
  );
}
