// src/app/features/permissions/services/permission-state.service.ts

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { forkJoin, pipe, switchMap, tap } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { Permission, Role } from '../../core/models';
import { PermissionService } from '../../services/permission/permission-service';
import { ToastService } from '../../services/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { debug } from 'console';

// 1. Define the state shape
type PermissionState = {
    roles: Role[];
    permissions: Permission[];
    selectedRoleId: number | null;
    rolePermissionIds: Set<number>; // Efficient lookup for assigned permissions
    isLoading: boolean;
    expandedNodes: TreeNode[]; // NEW: To store expanded state by node key
};

const initialState: PermissionState = {
    roles: [],
    permissions: [],
    selectedRoleId: null,
    rolePermissionIds: new Set(),
    expandedNodes: [], // NEW: Initialize as an empty object
    isLoading: false,
};

// Helper to build the dependency map
const buildPermissionDependencies = (permissions: Permission[]): Map<number, number[]> => {
    const dependencyMap = new Map<number, number[]>();
    const permissionMapByName = new Map(permissions.map(p => [p.name, p]));

    for (const p of permissions) {
        if (p.name.includes('.')) {
            const parentName = p.name.split('.')[0] + '.Read'; // Or .Get
            const parent = permissionMapByName.get(parentName);
            if (parent) {
                if (!dependencyMap.has(parent.id)) {
                    dependencyMap.set(parent.id, []);
                }
                dependencyMap.get(parent.id)!.push(p.id);
            }
        }
    }
    return dependencyMap;
};


// 2. Create the SignalStore
export const PermissionStateService = signalStore(
    withState(initialState),

    // 3. Define Computed Signals (Derived State)
    withComputed((store) => ({
        // Always a computed signal
        dependencies: computed(() => buildPermissionDependencies(store.permissions())),

        // Always a computed signal
        permissionTree: computed<TreeNode[]>(() => {
            const nodes: { [key: string]: TreeNode } = {};
            const tree: TreeNode[] = [];
            const assignedIds = store.rolePermissionIds();

            if (store.permissions() && store.permissions().length > 0) {
                for (const p of store.permissions()) {
                    const parts = p.name.split('.');
                    const key = parts[0];

                    if (!nodes[key]) {
                        nodes[key] = { key: key, label: key, children: [] };
                        tree.push(nodes[key]);
                    }

                    if (parts.length > 1) {
                        nodes[key].children!.push({
                            key: p.id.toString(),
                            label: p.name,
                            data: p
                        });
                    }
                }
            }

            tree.forEach(node => {
                let childSelectedCount = 0;
                node.children!.forEach(child => {
                    if (assignedIds.has(parseInt(child.key!, 10))) {
                        childSelectedCount++;
                    }
                });
                if (childSelectedCount > 0 && childSelectedCount < node.children!.length) {
                    node.partialSelected = true;
                }
            });

            return tree;
        })
    })),

    // 4. Define Methods (Actions)
    withMethods((store,
        api = inject(PermissionService),
        toastService = inject(ToastService)) => ({

            expandNode(node: TreeNode) {
                patchState(store, (state) => ({
                    expandedNodes: [...state.expandedNodes, node]
                }));
            },

            collapseNode(node: TreeNode) {
                patchState(store, (state) => ({
                    expandedNodes: [...state.expandedNodes.filter((node) => node.key !== node)]
                }));
            },
            // Example of loading data with error handling
            loadInitialData: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(() => forkJoin({
                        roles: api.getRoles(),
                        permissions: api.getPermissions(),
                    })),
                    tap({

                        next: ({ roles, permissions }) => {
                            debugger;
                            // Your backend response is wrapped in ApiResponse
                            patchState(store, {
                                roles: roles.data,
                                permissions: permissions.data,
                                isLoading: false
                            });
                        },
                        error: (err: HttpErrorResponse) => {
                            patchState(store, { isLoading: false });
                            toastService.error('Failed to load initial data', err.error?.message || 'A server error occurred.');
                        }
                    })
                )
            ),

            // Example of an action (assigning a permission)
            assignPermission: rxMethod<{ roleId: number, permissionId: number }>(
                pipe(
                    switchMap(({ roleId, permissionId }) => {
                        // You could add an optimistic update here if desired
                        return api.assignPermissionToRole(roleId, permissionId).pipe(
                            tap({
                                next: (response) => {
                                    // Case 1: The API returns a 200 OK, but with succeeded: false
                                    if (!response.succeeded) {
                                        toastService.error('Assignment Failed', response.message);
                                        // You would revert the optimistic update here
                                        return;
                                    }

                                    // Case 2: Success!
                                    toastService.success('Success', 'Permission assigned successfully!');

                                    // Update the state with the new permission
                                    patchState(store, (currentState) => {
                                        const newPermissionIds = new Set(currentState.rolePermissionIds);
                                        newPermissionIds.add(permissionId);
                                        return { rolePermissionIds: newPermissionIds };
                                    });
                                },
                                error: (err: HttpErrorResponse) => {
                                    // Case 3: A true HTTP error (404, 500, etc.)
                                    toastService.error('API Error', err.error?.message || 'Could not assign permission.');
                                    // You would also revert the optimistic update here
                                }
                            })
                        );
                    })
                )
            ),

            // Example of a delete action (revoking a permission)
            revokePermission: rxMethod<{ roleId: number, permissionId: number }>(
                pipe(
                    switchMap(({ roleId, permissionId }) => {
                        return api.revokePermissionFromRole(roleId, permissionId).pipe(
                            tap({
                                next: (response) => {
                                    if (!response.succeeded) {
                                        toastService.error('Revoke Failed', response.message);
                                        return;
                                    }
                                    toastService.success('Success', 'Permission revoked.');
                                    patchState(store, (currentState) => {
                                        const newPermissionIds = new Set(currentState.rolePermissionIds);
                                        newPermissionIds.delete(permissionId);
                                        // You should also handle revoking dependent permissions here
                                        return { rolePermissionIds: newPermissionIds };
                                    });
                                },
                                error: (err: HttpErrorResponse) => {
                                    toastService.error('API Error', err.error?.message || 'Could not revoke permission.');
                                }
                            })
                        );
                    })
                )
            ),

            selectRole: rxMethod<number>(
                pipe(
                    tap((roleId) => patchState(store, { isLoading: true, selectedRoleId: roleId })),
                    switchMap((roleId) => api.getPermissionsForRole(roleId)),
                    tap({

                        next: (response) => { // 'response' is the ApiResponse object
                            debugger;
                            if (!response.succeeded) {
                                toastService.error('Error', response.message);
                                patchState(store, { isLoading: false });
                                return;
                            }

                            // CORRECT: Extract the array from the .data property
                            const permissionsForRole = response.data;

                            // CORRECT: Create a Set of IDs from the extracted array
                            const permissionIds = new Set(permissionsForRole.map(p => p.id));

                            // CORRECT: ONLY update the rolePermissionIds and loading state.
                            // DO NOT touch the main 'permissions' state here.
                            console.log(store.permissions())
                            patchState(store, {
                                rolePermissionIds: permissionIds,
                                isLoading: false
                            });
                        },
                        error: (err: HttpErrorResponse) => {
                            patchState(store, { isLoading: false });
                            toastService.error('Failed to load permissions for role', err.error?.message || 'A server error occurred.');
                        }
                    })
                )
            ),

        }))
);