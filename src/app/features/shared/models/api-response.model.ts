export interface ApiResponse<T> {
  data: T;
  message: string;
  errors: string[];
  succeeded: boolean;
  statusCode: number;
}