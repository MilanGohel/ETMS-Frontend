import { computed, Injectable } from "@angular/core";
import { CurrentUserDto } from "../../core/models";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

export interface CurrentUserState {
  user: CurrentUserDto | null;
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
        setCurrentUser(userDto: CurrentUserDto){
          patchState(store, {user: userDto})
        },
        resetCurrentUser(){
          patchState(store, {user: null})
        }
      }
    }
  )
){}