import { Button, Typography } from "@mui/material";
import { TeamMember } from "../../types/index.types";
import AppModal from "../common/AppModal";

interface RemoveMemberDialogProps {
  member: TeamMember | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveMemberDialog({
  member,
  onClose,
  onConfirm,
}: RemoveMemberDialogProps) {
  return (
    <AppModal
      open={Boolean(member)}
      onClose={onClose}
      title="Remove Member"
      maxWidth="xs"
      actions={
        <>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Remove
          </Button>
        </>
      }
    >
      <Typography sx={{ fontSize: 14 }}>
        Are you sure you want to remove{" "}
        <strong style={{ textTransform: "capitalize" }}>
          {member?.first_name} {member?.last_name}
        </strong>{" "}
        from your organization? They will immediately lose
        access.
      </Typography>
    </AppModal>
  );
}