import { createAction, props } from '@ngrx/store';
import { CurrentUserDto } from '../core/models/auth/current-user.dto';

export const setCurrentUser = createAction(
  '[CurrentUser] Set',
  props<{ user: CurrentUserDto }>()
);

export const resetCurrentUser = createAction('[CurrentUser] Reset');
