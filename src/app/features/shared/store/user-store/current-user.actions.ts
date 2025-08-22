import { createAction, props } from '@ngrx/store';
import { UserDto } from '../../models/user.model';

export const setCurrentUser = createAction(
  '[CurrentUser] Set',
  props<{ user: UserDto }>()
);

export const resetCurrentUser = createAction('[CurrentUser] Reset');
