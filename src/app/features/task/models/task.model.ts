import { StatusEnum } from "../../../core/models";
import { BaseEntityDto } from "../../shared/models/base-entity.model";
import { UserDto } from "../../shared/models/user.model";

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