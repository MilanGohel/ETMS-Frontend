import { CurrentUserDto } from "../core/models/auth/current-user.dto";

export interface CurrentUserState {
  user: CurrentUserDto | null;
}

export const initialCurrentUserState: CurrentUserState = {
  user: null,
};
