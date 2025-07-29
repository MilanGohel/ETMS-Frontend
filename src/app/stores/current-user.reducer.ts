import { createReducer, on } from '@ngrx/store';
import { setCurrentUser, resetCurrentUser } from './current-user.actions';
import { initialCurrentUserState } from './current-user.state';

export const currentUserReducer = createReducer(
  initialCurrentUserState,
  on(setCurrentUser, (state, { user }) => ({ ...state, user })),
  on(resetCurrentUser, () => ({ user: null }))
);
