import { computed, Injectable } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserDto } from "../../models/user.model";

export interface CurrentUserState {
  user: UserDto | null;
}

export const initialCurrentUserState: CurrentUserState = {
  user: null,
};

@Injectable({providedIn: 'root'})

export class CurrentUserStateStore extends signalStore(
  withState(initialCurrentUserState),
  withComputed((store) => ({
    currentUser: computed(() => store.user),
    isAuthenticated: computed(() => !!store.user)
  })),
  withMethods(
    (store) => {
      return{
        setCurrentUser(userDto: UserDto){
          patchState(store, {user: userDto})
        },
        resetCurrentUser(){
          patchState(store, {user: null})
        }
      }
    }
  )
){}