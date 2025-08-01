import { CurrentUserDto } from "../core/models";

export interface CurrentUserState {
  user: CurrentUserDto | null;
}

export const initialCurrentUserState: CurrentUserState = {
  user: null,
};
