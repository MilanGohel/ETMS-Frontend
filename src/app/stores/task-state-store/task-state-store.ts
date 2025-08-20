import { Injectable } from "@angular/core";
import { UserDto } from "../../core/models";
import { signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

// 1. Define the shape of our state
export interface TaskState{
    task: TaskState | null;
    taskMembers: UserDto[];
    isLoading: boolean;
}

// 2. Define the initial state
const initialState:TaskState = {
    task: null, 
    taskMembers: [],
    isLoading: false
}

@Injectable({providedIn: "root"})

export class TaskStateStore extends signalStore(
    withState(initialState),

    withComputed((store) => ({})),

    withMethods((store) => {
        return {
            // 
        }
    })
){}