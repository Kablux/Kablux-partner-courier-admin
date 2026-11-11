import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchWalletSummary,
  fetchWalletTransaction,
  fetchWalletTransactions,
} from "../api/xhrHelper";
import AppButton from "../components/common/AppButton";
import { OwnerOnlyState } from "../components/common/CenteredState";
import ErrorState from "../components/common/ErrorState";
import FundWalletDialog from "../components/wallet/FundWalletDialog";
import TransactionDetailModal from "../components/wallet/TransactionDetailModal";
import WalletSummaryCards from "../components/wallet/WalletSummaryCards";
import WalletTransactionsTable from "../components/wallet/WalletTransactionsTable";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearTransactionDetail } from "../redux/slices/Wallet";
import { WalletTransaction } from "../types/index.types";

export default function WalletPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useAppSelector((s) => s.wallet);
  const currency = wallet.summary?.currency || "NGN";

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [fundOpen, setFundOpen] = useState(false);
  const [selected, setSelected] = useState<WalletTransaction | null>(null);

  const loadSummary = useCallback(() => {
    dispatch(fetchWalletSummary());
  }, [dispatch]);

  const loadTransactions = useCallback(() => {
    dispatch(fetchWalletTransactions({ page: page + 1, page_size: pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Back from Paystack: it adds ?reference to the return URL.
  // The re-check timer lives in a ref: cleaning the URL re-runs this effect,
  // and a per-run cleanup would cancel the timer before it fires.
  const recheckTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get("reference") && !params.get("trxref")) return;
    toast.success("Payment submitted. Your balance updates once Paystack confirms it.");
    navigate("/wallet", { replace: true });
    window.clearTimeout(recheckTimer.current);
    recheckTimer.current = window.setTimeout(() => {
      dispatch(fetchWalletSummary());
      dispatch(fetchWalletTransactions({ page: 1, page_size: pageSize }));
    }, 5000);
  }, [location.search, navigate, dispatch, pageSize]);

  // Only cancel the re-check if the user leaves the page.
  useEffect(() => () => window.clearTimeout(recheckTimer.current), []);

  const openTransaction = (txn: WalletTransaction) => {
    setSelected(txn);
    dispatch(fetchWalletTransaction(txn.id));
  };

  const closeTransaction = () => {
    setSelected(null);
    dispatch(clearTransactionDetail());
  };

  const header = (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography component="h1" sx={{ fontSize: 24, fontWeight: 700 }}>
          Wallet
        </Typography>
        <Typography sx={{ fontSize: 14, color: "var(--text-muted, var(--text-secondary))" }}>
          Fund your organization's wallet and review every transaction.
        </Typography>
      </Box>
      {wallet.access === "allowed" && (
        <AppButton startIcon={<AddRoundedIcon />} onClick={() => setFundOpen(true)} sx={{ px: 3 }}>
          Fund wallet
        </AppButton>
      )}
    </Box>
  );

  if (wallet.access === "denied") {
    return (
      <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        {header}
        <OwnerOnlyState
          title="Only the organization owner can manage the wallet"
          body="Ask your organization's owner if you need to fund the wallet or review its transactions."
        />
      </Box>
    );
  }

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      {header}

      {wallet.summaryError ? (
        <ErrorState
          title="Couldn't load the wallet balance"
          message={wallet.summaryError}
          onRetry={loadSummary}
        />
      ) : (
        <WalletSummaryCards
          summary={wallet.summary}
          loading={!wallet.summary && (wallet.summaryLoading || wallet.access === "unknown")}
        />
      )}

      <Box sx={{mt:4}}>
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>
          Transactions
        </Typography>
        {wallet.transactionsError ? (
          <ErrorState
            title="Couldn't load transactions"
            message={wallet.transactionsError}
            onRetry={loadTransactions}
          />
        ) : (
          <WalletTransactionsTable
            transactions={wallet.transactions}
            currency={currency}
            count={wallet.count}
            loading={wallet.transactionsLoading || wallet.access === "unknown"}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(0);
            }}
            onRowClick={openTransaction}
          />
        )}
      </Box>

      <FundWalletDialog open={fundOpen} currency={currency} onClose={() => setFundOpen(false)} />

      <TransactionDetailModal
        transaction={selected}
        detail={wallet.detail}
        currency={currency}
        loading={wallet.detailLoading}
        error={wallet.detailError}
        onRetry={() => selected && openTransaction(selected)}
        onClose={closeTransaction}
      />
    </Box>
  );
}
