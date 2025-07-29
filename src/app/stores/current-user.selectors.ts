import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrentUserState } from './current-user.state';

export const selectCurrentUserState = createFeatureSelector<CurrentUserState>('currentUser');

export const selectCurrentUser = createSelector(
  selectCurrentUserState,
  state => state.user
);

export const isAuthenticated = createSelector(
  selectCurrentUser,
  user => !!user
);
