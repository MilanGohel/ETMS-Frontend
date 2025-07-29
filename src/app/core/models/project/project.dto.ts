// It's good practice to replicate your C# enum in TypeScript for type safety.
// The numeric values should match your C# StatusEnum.
export enum StatusEnum {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  OnHold = 4,
  Cancelled = 5,
}

// An interface for the nested Status object.
// This corresponds to your 'Status' entity in C#.
export interface Status {
  id: number;
  name: string; // e.g., "Pending", "In Progress"
}

// The main interface for your Project DTO.
export interface ProjectDto {
  id: number;
  name: string;
  description?: string; // The '?' makes this property optional.

  /**
   * Represents the start date.
   * C# DateTime is typically serialized as an ISO 8601 string.
   * Example: "2023-10-27T14:30:00Z"
   */
  startDate: string;

  /**
   * Represents the end date, serialized as an ISO 8601 string.
   */
  endDate: string;

  statusId: StatusEnum; // Using the enum provides better type safety than just 'number'.
  status?: Status;      // Optional nested object for the full status details.
}