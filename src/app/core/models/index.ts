

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
  colorCode: string | null;
  description?: string;
  projectId: number;
  tasks: TaskDto[];
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
  projectId?: number;
  statusId: StatusEnum;
  isAddedAtEndOfBoard: boolean;
  previousTaskId?: number;
  nextTaskId?: number;
  taskMembers?: UserDto[];
}

export interface MoveBoardDto {
  previousBoardId?: number;
  nextBoardId?: number;

}
export interface UserNameExistsDto {
  isUserNameExists: boolean;
}

export interface UpdateTaskPositionDto {
  taskId: number;
  newBoardId: number;
  newPosition: number;
}
export interface GoogleLoginDto {
  accessToken: string;
  idToken: string;
  ipAddress?: string;
  authProviderEnum: AuthProviderEnum.Google; // Will always be AuthProviderEnum.Google
}
export enum AuthProviderEnum {
  Normal = 1,
  Google = 2,
  Github = 3
}

export interface ShiftTaskOrderRangeDto {
  minOrder: number;
  maxOrder: number;
  boardId: number;
  shiftAmount: number;
}


export interface MoveTaskDto {
  newBoardId: number;
  previousTaskId?: number | null;
  nextTaskId?: number | null;
}

export interface UserDto extends BaseEntityDto {
  firstName: string;       // required, maxLength 50
  lastName: string;        // required, maxLength 50
  userName: string;        // regex: ^[a-zA-Z0-9._-]{3,15}$
  email: string;           // required, email, maxLength 100
  avatarUrl?: string | null; // optional, maxLength 200
}


export enum RoleEnum {
  ProgramManager = 2,
  ProjectManager = 3,
  TeamLead = 4,
  SeniorDeveloper = 5,
  JuniorDeveloper = 6,
  User = 7
}

export const RoleDescriptions: Record<RoleEnum, string> = {
  [RoleEnum.ProgramManager]: 'Program Manager',
  [RoleEnum.ProjectManager]: 'Project Manager',
  [RoleEnum.TeamLead]: 'Team Lead',
  [RoleEnum.SeniorDeveloper]: 'Senior Developer',
  [RoleEnum.JuniorDeveloper]: 'Junior Developer',
  [RoleEnum.User]: 'User'
};

export interface PaginatedList<T> {
  /** The items for the current page. */
  items: T[];

  /** The current page index (1-based). */
  pageIndex: number;

  /** The total number of pages. */
  totalPages: number;

  /** The total count of items across all pages. */
  totalCount: number;

  /** Indicates whether there is a previous page. */
  hasPreviousPage: boolean;

  /** Indicates whether there is a next page. */
  hasNextPage: boolean;
}


export interface AddUsersToProjectDto {
  userRoles: UserRoleDto[];
}

export interface UserRoleDto {
  userId: number;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}