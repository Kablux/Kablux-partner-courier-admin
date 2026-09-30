import { createSlice,  PayloadAction } from "@reduxjs/toolkit";
import { fetchMembers, addMember, removeMember } from "../../api/xhrHelper";
import { TeamMember } from "../../types/index.types";


interface MemberState {
  members: TeamMember[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  formErrors: Record<string, string> | null;
}

const initialState: MemberState = {
  members: [],
  loading: false,
  submitting: false,
  error: null,
  formErrors: null,
};


const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    clearFormErrors: (state) => {
      state.formErrors = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Members
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<TeamMember[]>) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Member
      .addCase(addMember.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.formErrors = null;
      })
      .addCase(addMember.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addMember.rejected, (state, action: PayloadAction<any>) => {
        state.submitting = false;
        const errData = action.payload;
        if (typeof errData === "string") {
          state.error = errData;
        } else if (errData?.errors) {
          const formatted: Record<string, string> = {};
          Object.keys(errData.errors).forEach((key) => {
            formatted[key] = Array.isArray(errData.errors[key])
              ? errData.errors[key][0]
              : errData.errors[key];
          });
          state.formErrors = formatted;
        } else {
          state.error = errData?.error || "An error occurred";
        }
      })

      // Remove Member
      .addCase(removeMember.fulfilled, (state, action: PayloadAction<string>) => {
        state.members = state.members.filter((m) => m.id !== action.payload);
      });
  },
});

export const { clearFormErrors } = memberSlice.actions;
export default memberSlice.reducer;