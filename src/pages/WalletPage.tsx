import React, { useState } from "react";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import BalanceCards from "../components/wallet/BalanceCards";
import CardPanel from "../components/wallet/CardPanel";
import QuickActions from "../components/wallet/QuickAction";
import RecentActivity from "../components/wallet/RecentActivity";
import RecentTransactionsTable from "../components/wallet/RecentTransTable";
import StatisticsChart from "../components/wallet/StatisticsChart";
import UpcomingTransactions from "../components/wallet/UpcomingTransactions";
import { WALLET_BALANCES, UPCOMING, INITIAL_ACTIVITIES, naira, RECENT_TXNS } from "../data/data";
import { UpcomingTxn, Activity, WalletActionType } from "../types/common.types";
import WalletActionModal, { WalletActionPayload } from "../components/wallet/ActionModal";

let activitySeq = 100;

export default function WalletPage() {
  // Local wallet state — swap for redux/query + API later.
  const [total, setTotal] = useState(WALLET_BALANCES.total);
  const [spent, setSpent] = useState(WALLET_BALANCES.spent);
  const [cardActive, setCardActive] = useState(true);
  const [upcoming, setUpcoming] = useState<UpcomingTxn[]>(UPCOMING);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

  const [modalAction, setModalAction] = useState<WalletActionType | null>(null);

  const logActivity = (title: string, amount: number, dir: "in" | "out") =>
    setActivities((prev) => [
      { id: `a${activitySeq++}`, title, amount, direction: dir, time: "Just now" },
      ...prev,
    ]);

  const handleAction = (action: WalletActionType, p: WalletActionPayload) => {
    switch (action) {
      case "deposit":
        setTotal((t) => t + p.amount);
        logActivity("Deposit", p.amount, "in");
        toast.success(`${naira(p.amount)} deposited`);
        break;
      case "withdraw":
        if (p.amount > total) return toast.error("Insufficient balance");
        setTotal((t) => t - p.amount);
        setSpent((s) => s + p.amount);
        logActivity("Withdrawal", p.amount, "out");
        toast.success(`${naira(p.amount)} withdrawn`);
        break;
      case "send":
        if (p.amount > total) return toast.error("Insufficient balance");
        setTotal((t) => t - p.amount);
        setSpent((s) => s + p.amount);
        logActivity(`Sent to ${p.recipient}`, p.amount, "out");
        toast.success(`${naira(p.amount)} sent to ${p.recipient}`);
        break;
      case "request":
        logActivity(`Requested from ${p.recipient}`, p.amount, "in");
        toast.success(`Request for ${naira(p.amount)} sent`);
        break;
      case "invoice":
        logActivity(`Invoice · ${p.recipient}`, p.amount, "in");
        toast.success(`Invoice created for ${p.recipient}`);
        break;
    }
  };

  const handleToggleCard = () => {
    setCardActive((a) => {
      toast.success(a ? "Card deactivated" : "Card activated");
      return !a;
    });
  };

  const handlePay = (txn: UpcomingTxn) => {
    if (txn.amount > total) return toast.error("Insufficient balance");
    setTotal((t) => t - txn.amount);
    setSpent((s) => s + txn.amount);
    setUpcoming((prev) => prev.filter((u) => u.id !== txn.id));
    logActivity(`Paid ${txn.route}`, txn.amount, "out");
    toast.success(`${naira(txn.amount)} paid`);
  };

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Quick actions */}
      <QuickActions onAction={(a) => setModalAction(a)} />

      {/* Main grid: left content + right rail */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.7fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <BalanceCards
            total={total}
            spent={spent}
            bonus={WALLET_BALANCES.bonus}
          />
          <StatisticsChart />
          <RecentTransactionsTable transactions={RECENT_TXNS} />
        </Box>

        {/* Right column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <CardPanel
            balance={total}
            cardActive={cardActive}
            onToggleCard={handleToggleCard}
            onAddMoney={() => setModalAction("deposit")}
          />
          <UpcomingTransactions items={upcoming} onPay={handlePay} />
        </Box>
      </Box>

      {/* Recent activity (full width) */}
      <RecentActivity activities={activities} />

      {/* Action modal (deposit / withdraw / send / request / invoice) */}
      <WalletActionModal
        action={modalAction}
        isOpen={!!modalAction}
        onClose={() => setModalAction(null)}
        onSubmit={handleAction}
      />
    </Box>
  );
}