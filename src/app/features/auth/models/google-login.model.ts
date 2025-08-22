import { AuthProviderEnum } from "../../shared/models/auth-provider.enum";

export interface GoogleLoginDto {
  accessToken: string;
  idToken: string;
  ipAddress?: string;
  authProviderEnum: AuthProviderEnum.Google;
}