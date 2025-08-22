import { BaseEntityDto } from "../../shared/models/base-entity.model";
import { TaskDto } from "../../task/models/task.model";

export interface BoardDto extends BaseEntityDto {
  name: string;
  colorCode: string | null;
  description?: string;
  projectId: number;
  tasks: TaskDto[];
}