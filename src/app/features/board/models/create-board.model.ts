export interface CreateBoardDto {
  name: string;
  colorCode?: string;
  description?: string;
  projectId: number;
}