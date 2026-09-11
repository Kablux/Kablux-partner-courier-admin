import React from "react";
import {
  Box,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  PermissionAction,
  PermissionState,
} from "../../data/data";

const checkboxSx = {
  p: 0.5,
  color: "rgba(120,130,150,0.5)",
  "&.Mui-checked": { color: "var(--accent-gold, #FFD700)" },
  "&.MuiCheckbox-indeterminate": { color: "var(--accent-gold, #FFD700)" },
};

const cellSx = {
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
  py: 1,
  color: "var(--text-primary)",
};

interface Props {
  value: PermissionState;
  onChange: (next: PermissionState) => void;
}

export default function PermissionMatrix({ value, onChange }: Props) {
  const allCells = PERMISSION_MODULES.flatMap((m) =>
    PERMISSION_ACTIONS.map((a) => value[m.key]?.[a] ?? false),
  );
  const allChecked = allCells.every(Boolean);
  const someChecked = allCells.some(Boolean) && !allChecked;

  const setCell = (moduleKey: string, action: PermissionAction, on: boolean) =>
    onChange({
      ...value,
      [moduleKey]: { ...value[moduleKey], [action]: on },
    });

  const setModule = (moduleKey: string, on: boolean) =>
    onChange({
      ...value,
      [moduleKey]: PERMISSION_ACTIONS.reduce(
        (acc, a) => ({ ...acc, [a]: on }),
        {} as Record<PermissionAction, boolean>,
      ),
    });

  const setAll = (on: boolean) =>
    onChange(
      PERMISSION_MODULES.reduce((acc, m) => {
        acc[m.key] = PERMISSION_ACTIONS.reduce(
          (a2, a) => ({ ...a2, [a]: on }),
          {} as Record<PermissionAction, boolean>,
        );
        return acc;
      }, {} as PermissionState),
    );

  const moduleAll = (moduleKey: string) =>
    PERMISSION_ACTIONS.every((a) => value[moduleKey]?.[a]);
  const moduleSome = (moduleKey: string) =>
    PERMISSION_ACTIONS.some((a) => value[moduleKey]?.[a]) &&
    !moduleAll(moduleKey);

  return (
    <Box
      sx={{
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
        }}
      >
        <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
          Permissions
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={(e) => setAll(e.target.checked)}
            sx={checkboxSx}
          />
          <Typography sx={{ fontSize: 13 }}>Select all</Typography>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 520 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...cellSx, fontSize: 12, color: "var(--text-secondary)" }}>
                Module
              </TableCell>
              {PERMISSION_ACTIONS.map((a) => (
                <TableCell
                  key={a}
                  align="center"
                  sx={{
                    ...cellSx,
                    fontSize: 12,
                    textTransform: "capitalize",
                    color: "var(--text-secondary)",
                  }}
                >
                  {a}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ ...cellSx, fontSize: 12, color: "var(--text-secondary)" }}
              >
                All
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PERMISSION_MODULES.map((m) => (
              <TableRow key={m.key}>
                <TableCell sx={{ ...cellSx, fontSize: 13, fontWeight: 500 }}>
                  {m.label}
                </TableCell>
                {PERMISSION_ACTIONS.map((a) => (
                  <TableCell key={a} align="center" sx={cellSx}>
                    <Checkbox
                      checked={value[m.key]?.[a] ?? false}
                      onChange={(e) => setCell(m.key, a, e.target.checked)}
                      sx={checkboxSx}
                    />
                  </TableCell>
                ))}
                <TableCell align="center" sx={cellSx}>
                  <Checkbox
                    checked={moduleAll(m.key)}
                    indeterminate={moduleSome(m.key)}
                    onChange={(e) => setModule(m.key, e.target.checked)}
                    sx={checkboxSx}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}