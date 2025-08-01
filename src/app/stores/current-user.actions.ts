import { createAction, props } from '@ngrx/store';
import { CurrentUserDto } from '../core/models';

export const setCurrentUser = createAction(
  '[CurrentUser] Set',
  props<{ user: CurrentUserDto }>()
);

export const resetCurrentUser = createAction('[CurrentUser] Reset');
