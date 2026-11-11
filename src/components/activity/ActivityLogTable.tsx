import {
  Avatar,
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { ActivityLogEntry } from "../../types/index.types";
import { EMPTY_VALUE } from "../../utils/format";
import AppTablePagination from "../common/AppTablePagination";
import {
  bodyCellSx as sharedBodyCellSx,
  bodyRowSx,
  headCellSx,
  headRowSx,
  tableHeadSx,
} from "../common/tableStyles";
import { formatRelativeTime } from "../notifications/utils";
import {
  actionIcon,
  actionLabel,
  actionSubject,
  actionTone,
  displayName,
  formatDay,
  formatTime,
  humanize,
  initials,
  metadataEntries,
  TONE_COLORS,
} from "./activityFormat";

const COLUMNS = ["Activity", "Performed by", "Target", "Details", "Created At"];
const SKELETON_ROWS = 5;
const DETAILS_SHOWN = 2;

// Text sizes match the Orders table.
const bodyCellSx = { ...sharedBodyCellSx, fontSize: 12, verticalAlign: "middle" };
const mainTextSx = { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" };
const subTextSx = { fontSize: 12, color: "var(--text-secondary)" };
const monoSx = { fontFamily: "monospace", fontSize: 12 };

function ActivityCell({ entry }: { entry: ActivityLogEntry }) {
  const Icon = actionIcon(entry);
  const color = TONE_COLORS[actionTone(entry.action)];
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "8px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          backgroundColor: `${color}1A`,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Tooltip title={entry.action} placement="top-start">
          <Typography sx={mainTextSx}>{actionLabel(entry.action)}</Typography>
        </Tooltip>
        <Typography sx={subTextSx}>{actionSubject(entry)}</Typography>
      </Box>
    </Box>
  );
}

function ActorCell({ entry }: { entry: ActivityLogEntry }) {
  if (!entry.actor) {
    return (
      <Box>
        <Typography sx={mainTextSx}>System</Typography>
        <Typography sx={subTextSx}>Automated</Typography>
      </Box>
    );
  }
  return (

      <Box sx={{ minWidth: 140 }}>
        <Typography sx={mainTextSx}>{displayName(entry.actor.label) || EMPTY_VALUE}</Typography>
        <Typography sx={subTextSx}>{humanize(entry.actor.type)}</Typography>
      </Box>
  );
}

function TargetCell({ entry }: { entry: ActivityLogEntry }) {
  return (
    <Box >
      <Typography sx={{ fontSize: 12, color: "var(--text-primary)" }}>
        {humanize(entry.object_type)}
      </Typography>
      {entry.object_id && (
        // Full ID, wrapping onto a second line if needed so it never widens the table.
        <Box
          component="span"
          sx={{
            ...monoSx,
            display: "inline-block",
            mt: 0.25,
            px: 0.75,
            py: 0.1,
            maxWidth: 220,
            borderRadius: "4px",
            color: "var(--text-secondary)",
            backgroundColor: "rgba(120,130,150,0.10)",
            wordBreak: "break-all",
            userSelect: "all",
          }}
        >
          {entry.object_id}
        </Box>
      )}
    </Box>
  );
}

function DetailsCell({ entry }: { entry: ActivityLogEntry }) {
  const details = metadataEntries(entry.metadata);
  if (details.length === 0) {
    return <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>{EMPTY_VALUE}</Typography>;
  }
  const tag = (d: { key: string; value: string }) => (
    <Box
      key={d.key}
      component="span"
      sx={{
        display: "inline-flex",
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: "16px",
        fontSize: 11.5,
        backgroundColor: "rgba(120,130,150,0.10)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <Box component="span" sx={{ color: "var(--text-secondary)" }}>
        {d.key}:
      </Box>
      <Box component="span" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
        {d.value}
      </Box>
    </Box>
  );
  return (
    <Tooltip
      placement="top-start"
      title={
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {details.map((d) => (
            <li key={d.key}>
              {d.key}: {d.value}
            </li>
          ))}
        </Box>
      }
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
        {details.slice(0, DETAILS_SHOWN).map(tag)}
        {details.length > DETAILS_SHOWN && (
          <Typography component="span" sx={subTextSx}>
            +{details.length - DETAILS_SHOWN} more
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

function DateCell({ iso }: { iso: string }) {
  return (
    <Tooltip title={formatRelativeTime(iso)} placement="top-start">
      <Box sx={{ whiteSpace: "nowrap",minWidth: 100, display:"flex", gap: 0.5}}>
        <Typography sx={{ fontSize: 12, color: "var(--text-primary)" }}>{formatDay(iso)}</Typography>
        <Typography sx={subTextSx}>{formatTime(iso)}</Typography>
      </Box>
    </Tooltip>
  );
}

interface Props {
  entries: ActivityLogEntry[];
  count: number;
  loading: boolean;
  filtered: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function ActivityLogTable({
  entries,
  count,
  loading,
  filtered,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <Box sx={{mt:4}}>
      <TableContainer>
        <Table sx={{ minWidth: 880 }}>
          <TableHead sx={tableHeadSx}>
            <TableRow sx={headRowSx}>
              {COLUMNS.map((column) => (
                <TableCell key={column} sx={headCellSx}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && entries.length === 0 ? (
              Array.from({ length: SKELETON_ROWS }).map((_, row) => (
                <TableRow key={row}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column} sx={bodyCellSx}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.length}
                  sx={{ ...bodyCellSx, textAlign: "center", py: 6 }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {filtered ? "No activity matches these filters" : "No activity recorded yet"}
                  </Typography>
                  <Typography sx={{ ...subTextSx, mt: 0.5 }}>
                    {filtered
                      ? "Try a different action, actor type or date range."
                      : "Actions taken in your organization will appear here."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id} sx={bodyRowSx}>
                  <TableCell sx={bodyCellSx}>
                    <ActivityCell entry={entry} />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <ActorCell entry={entry} />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <TargetCell entry={entry} />
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, maxWidth: 280 }}>
                    <DetailsCell entry={entry} />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <DateCell iso={entry.created_at} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <AppTablePagination
          count={count}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
}
