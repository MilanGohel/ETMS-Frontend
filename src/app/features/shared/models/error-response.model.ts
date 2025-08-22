export interface ErrorResponse {
  succeeded: false;
  message: string;
  errors: string[];
  statusCode: number;
}
