export interface LoginResponseDto {
  accessToken: string;
  accessExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}