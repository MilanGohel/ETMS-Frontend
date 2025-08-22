
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



export interface UpdateRolePermissionsDto {
  roleId: number;
  permissionIds: number[];
}
export interface UserNameExistsDto {
  isUserNameExists: boolean;
}

export interface UpdateTaskPositionDto {
  taskId: number;
  newBoardId: number;
  newPosition: number;
}