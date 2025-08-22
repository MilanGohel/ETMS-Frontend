import { Status, StatusEnum } from "../../../core/models";

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
