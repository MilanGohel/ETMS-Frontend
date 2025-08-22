import { inject, Injectable } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserService } from "../../../../services/user/user-service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { of, pipe, switchMap, tap } from "rxjs";
import { ProjectService } from "../../../../services/project/project-service";
import { ToastService } from "../../services/toast/toast.service";
import { UserDto } from "../../models/user.model";
import { AddUsersToProjectDto } from "../../../project/models/add-users-to-project.model";


export interface GlobalState {
    searchedMembers: UserDto[];
    isFindMemberModalOpen: boolean,
    isLoading: boolean;
}

const initialGlobalState: GlobalState = {
    searchedMembers: [],
    isFindMemberModalOpen: false,

    isLoading: false,
}

@Injectable({ providedIn: "root" })

export class GlobalStateStore extends signalStore(
    withState(initialGlobalState),
    withMethods((store) => {
        const userService = inject(UserService);
        const projectService = inject(ProjectService);
        const toastService = inject(ToastService);
        return {
            searchMembers: rxMethod<string>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((searchString) => {
                        if (searchString.length < 3) {
                            return of(null);
                        }
                        return userService.searchMembers(searchString).pipe(
                            tap({
                                next: (res) => {
                                    if (res.succeeded) {
                                        patchState(store, { searchedMembers: res.data.items, isLoading: false });
                                    } else {
                                        patchState(store, { isLoading: false });
                                    }
                                },
                                error: () => {
                                    patchState(store, { isLoading: false });
                                }
                            })
                        );
                    })
                )
            ),
            setSearchedMembers(userDtos: UserDto[]) {
                patchState(store, { searchedMembers: userDtos });
            },
            setIsFindMemberModalOpen(value: boolean) {
                patchState(store, (state) => ({
                    isFindMemberModalOpen: value
                }))
            },
            

            //Add user to project
            shareProjectMember: rxMethod<{ projectId: number, userProjectDto: AddUsersToProjectDto }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(({ projectId, userProjectDto }) => {

                        return projectService.addUserToProject(projectId, userProjectDto)
                            .pipe(
                                tap(
                                    {
                                        next: (response) => {
                                            if (response.succeeded) {
                                                patchState(store, { isLoading: false })
                                            }
                                            else {
                                                patchState(store, { isLoading: false })
                                                toastService.error("Error", response.message);
                                            }
                                        },
                                        error: (err) => patchState(store, { isLoading: false })
                                    }
                                )
                            )
                    })
                )
            )
        }
    })
) { }