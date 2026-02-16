"use server";
import { LoginResponse, OptResponse, OtpCredentials, ProfileResponse, VerifyOtpCredentials, VerifyOtpResponse, changeRoleCredentials } from "@/lib/types/user.type";
import { serverRequest } from "../axios-server";
import { endpoints } from "../endpoints";

export async function LoginAction(credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const response = await serverRequest<LoginResponse>(endpoints.USER.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error;
  }
}

export async function SendOtp(
  credentials: OtpCredentials
): Promise<OptResponse> {
  try {
    const response = await serverRequest<OptResponse>(endpoints.USER.REGISTER, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error;
  }
}

export async function VerifyOtp(
  credentials: VerifyOtpCredentials
): Promise<VerifyOtpResponse> {
  try {
    const response = await serverRequest<VerifyOtpResponse>(
      endpoints.USER.OTP.verify,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error;
  }
}

export async function ResendOtp(credentials: {
  keys: string;
}): Promise<OptResponse> {
  try {
    const response = await serverRequest<OptResponse>(
      endpoints.USER.OTP.reload,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error;
  }
}

export async function ProfileAction(): Promise<ProfileResponse> {
  try {
    const response = await serverRequest<ProfileResponse>(
      endpoints.USER.PROFILE,
      {
        method: "GET",
      }
    );
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error;
  }
}

export async function ChangeRole(
  credentials: changeRoleCredentials
): Promise<LoginResponse> {
  try {
    const response = await serverRequest<LoginResponse>(
      endpoints.USER.CHANGE_ROLE,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error;
  }
}
