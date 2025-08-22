import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { TreeModule } from 'primeng/tree';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PermissionStateService } from '../../shared/store/permission-state-store/permission-state-store';
import { ButtonModule } from 'primeng/button';
import { of } from 'rxjs';
import {  UpdateRolePermissionsDto } from '../../../core/models';
import { CheckboxModule } from 'primeng/checkbox';
import { Permission } from '../../shared/models/permission.model';

@Component({
  selector: 'app-permission-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    ListboxModule,
    CheckboxModule,
    TreeModule,
    ProgressSpinnerModule,
    ButtonModule
  ],
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PermissionStateService],
})
export class PermissionManagementComponent implements OnInit {
  readonly state = inject(PermissionStateService);

  // Hold selected nodes for the PrimeNG Tree
  selectedPermissions: TreeNode[] = [];
  selectedPermissionIds: Permission[] = [];
  constructor() {
    effect(() => {
      const permissionIds = this.state.rolePermissionIds();
      const allTreeNodes = this.flattenTree(this.state.permissionTree());

      const newSelected = allTreeNodes.filter(
        node => node.key && permissionIds.has(parseInt(node.key, 10))
      );

      // --- in-place mutation to keep same array reference ---
      this.selectedPermissions.length = 0;
      this.selectedPermissions.push(...newSelected);
      
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  private flattenTree(nodes: TreeNode[]): TreeNode[] {
    return nodes.flatMap(node =>
      node.children ? this.flattenTree(node.children) : node
    );
  }

  ngOnInit(): void {
    this.state.loadInitialData();
    this.state.expandedNodes().forEach(expandedNode => {
      this.expandRecursive(expandedNode, true);
    });
  }

  onRoleChange(event: { value: number | null }): void {
    if (event.value === null) {
      (event as any).value = this.state.selectedRoleId(); // Prevent deselection
      return;
    }
    this.state.selectRole(event.value);
  }

  onNodeExpand(event: { node: TreeNode }): void {
    if (event.node.key) {
      this.state.expandNode(event.node);
    }
  }

  onNodeCollapse(event: { node: TreeNode }): void {
    if (event.node.key) {
      this.state.collapseNode(event.node);
    }
  }
  /**
  * Fired when a user checks a box.
  * This method ensures all parent nodes are also checked.
  */
  onNodeSelect(event: { node: TreeNode }): void {
    this.selectParents(event.node);
  }

  /**
   * Fired when a user un-checks a box.
   * This method ensures all child nodes are also un-checked.
   */
  onNodeUnselect(event: { node: TreeNode }): void {
    this.unselectChildren(event.node);
  }

  /**
   * Recursively traverses up the tree to select parent nodes.
   * @param node The node whose parents should be selected.
   */
  private selectParents(node: TreeNode): void {
    // Stop if there is no parent or if the key is missing.
    if (!node.parent || !node.parent.key) {
      return;
    }

    const parent = node.parent;

    if (!parent || !parent.key) return;
    const index = Number(node.key)
    // Add the parent to the selection model.
    this.selectedPermissions[index] = { checked: true, partialSelected: false };

    // Recurse to the grandparent.
    this.selectParents(parent);
  }

  /**
   * Recursively traverses down the tree to unselect child nodes.
   * @param node The node whose children should be unselected.
   */
  private unselectChildren(node: TreeNode): void {
    // Stop if the node has no children.
    if (!node.children || node.children.length === 0) {
      return;
    }

    // Iterate through all direct children.
    for (const child of node.children) {
      if (child.key) {
        if (!child || !child.key) return;
        const index = Number(child.key)
        // Remove the child from the selection model.
        delete this.selectedPermissions[index];
      }

      // Recurse to the grandchildren.
      this.unselectChildren(child);
    }
  }


  onPermissionSelect(event: { node: TreeNode }): void {
    const selectedRoleId = this.state.selectedRoleId();
    const permissionId = parseInt(event.node.key!, 10);
    if (!selectedRoleId || isNaN(permissionId)) return;
    this.state.assignPermission({ roleId: selectedRoleId, permissionId });
  }

  onPermissionUnselect(event: { node: TreeNode }): void {
    const selectedRoleId = this.state.selectedRoleId();
    const permissionId = parseInt(event.node.key!, 10);
    if (!selectedRoleId || isNaN(permissionId)) return;
    this.state.revokePermission({ roleId: selectedRoleId, permissionId });
  }

  onSave() {
    const roleId = this.state.selectedRoleId();
    if (!roleId) return;
    
    console.log(this.selectedPermissions + "Selected permissions")
    
    // // 1. Get the final selected permission IDs from the p-tree model
    const finalPermissionIdsInString = new Set<string>(
      Object.keys(this.selectedPermissions)
    );
    const finalPermissionIds = new Set<number>(
      Object.values(this.selectedPermissions).map((perm: any) => perm.key) // or perm.id if that's what you need
    );

    const updateRolePermissionDto: UpdateRolePermissionsDto = {
      roleId: roleId,
      permissionIds: [...finalPermissionIds]
    }
    this.state.updateRolePermissions({ updateRolePermissionDto });

  }
  onCancel() {

  }
}
