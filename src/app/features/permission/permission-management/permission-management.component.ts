import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { TreeModule } from 'primeng/tree';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PermissionStateService } from '../../../stores/permission-state-store/permission-state-store';

@Component({
  selector: 'app-permission-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    ListboxModule,
    TreeModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PermissionStateService],
})
export class PermissionManagementComponent implements OnInit {
  readonly state = inject(PermissionStateService);
  private isSyncingFromState = false;

  // Hold selected nodes for the PrimeNG Tree
  selectedPermissions: TreeNode[] = [];

  constructor() {
    effect(() => {
      const permissionIds = this.state.rolePermissionIds();
      const allTreeNodes = this.flattenTree(this.state.permissionTree());

      const newSelected = allTreeNodes.filter(
        node => node.key && permissionIds.has(parseInt(node.key, 10))
      );

      // --- in-place mutation to keep same array reference ---
      this.isSyncingFromState = true;
      this.selectedPermissions.length = 0;
      this.selectedPermissions.push(...newSelected);
      Promise.resolve().then(() => (this.isSyncingFromState = false));
    });
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

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  onPermissionSelect(event: { node: TreeNode }): void {
    if (this.isSyncingFromState) return;
    const selectedRoleId = this.state.selectedRoleId();
    const permissionId = parseInt(event.node.key!, 10);
    if (!selectedRoleId || isNaN(permissionId)) return;
    this.state.assignPermission({ roleId: selectedRoleId, permissionId });
  }

  onPermissionUnselect(event: { node: TreeNode }): void {
    if (this.isSyncingFromState) return;
    const selectedRoleId = this.state.selectedRoleId();
    const permissionId = parseInt(event.node.key!, 10);
    if (!selectedRoleId || isNaN(permissionId)) return;
    this.state.revokePermission({ roleId: selectedRoleId, permissionId });
  }
}
