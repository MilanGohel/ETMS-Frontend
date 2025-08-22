import { BaseEntityDto } from "./base-entity.model";

// export interface CurrentUserDto {
//   id: number;
//   firstname: string;
//   lastname: string;
//   username: string;
//   profileUrl?: string;
//   email: string;
// }

export interface UserDto extends BaseEntityDto {
  firstName: string;       // required, maxLength 50
  lastName: string;        // required, maxLength 50
  userName: string;        // regex: ^[a-zA-Z0-9._-]{3,15}$
  email: string;           // required, email, maxLength 100
  profileUrl?: string | null; // optional, maxLength 200
}