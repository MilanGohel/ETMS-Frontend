

export interface ApiResponse<T> {
  data: T;
  message: string;
  errors: string[];
  succeeded: boolean;
  statusCode: number;
}

export interface ErrorResponse {
  succeeded: false;
  message: string;
  errors: string[];
  statusCode: number;
}

export enum StatusEnum {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  OnHold = 4,
  Cancelled = 5,
}

export interface Status {
  id: number;
  name: string;
}

export interface ProjectDto {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  statusId: StatusEnum;
  status?: Status;
  isAddDefaultBoards?: boolean
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}


export interface CurrentUserDto {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  profileUrl?: string;
  email: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  accessExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}
export interface SignUpRequestDto {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateBoardDto {
  name: string;
  colorCode?: string;
  description?: string;
  projectId: number;
}

export interface BoardDto extends BaseEntityDto {
  name: string;
  colorCode: string |  null;
  description?: string;
  projectId: number;
  tasks?: TaskDto[];
}

export interface BaseEntityDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface TaskDto extends BaseEntityDto {
  name: string;
  description?: string;
  boardId: number;
  statusId: StatusEnum; 
}

export interface UserNameExistsDto {
  isUserNameExists: boolean;
}

