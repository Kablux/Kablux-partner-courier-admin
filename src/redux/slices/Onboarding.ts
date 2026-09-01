// src/redux/slices/onboardingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyInfo } from "../../types/common.types";


interface OnboardingState {
  currentStep: number;
  companyInfo: CompanyInfo;
  otp: string;
  // You can add future steps here (e.g., moreInfo, paymentDetails)
}

const initialState: OnboardingState = {
  currentStep: 1,
  companyInfo: {
    companyName: "",
    registrationNumber: "",
    companyEmail: "",
    staffCapacity: "",
    phone: "",
    region: "",
    isAuthorized: false,
  },
  otp: "",
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateCompanyInfo: (state, action: PayloadAction<Partial<CompanyInfo>>) => {
      state.companyInfo = { ...state.companyInfo, ...action.payload };
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  nextStep,
  prevStep,
  setStep,
  updateCompanyInfo,
  setOtp,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;