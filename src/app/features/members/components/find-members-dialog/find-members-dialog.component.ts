import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { GlobalStateStore } from '../../../shared/store/global-state-store/global-state-store';
import { SelectModule } from 'primeng/select';
import { UserDto } from '../../../shared/models/user.model';
import { RoleDescriptions, RoleEnum } from '../../../../core/models';

@Component({
  selector: 'app-find-members-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    AutoCompleteModule,
    DividerModule,
    FormsModule,
    SelectModule

  ],
  templateUrl: './find-members-dialog.component.html',
  styleUrls: ['./find-members-dialog.component.css']
})
export class FindMembersDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  selectedItem!: UserDto;
  // Member data for the list
  members = [
    {
      name: 'Milan Gohel (you)',
      email: '@milangohel2',
      role: 'Workspace admin',
      permission: 'Member',
      avatar: 'MG',
      avatarColor: '#7E57C2' // Example color
    },
    {
      name: 'milangohel07',
      email: '@milangohel071',
      role: 'Workspace admin',
      permission: 'Admin',
      avatar: 'M',
      avatarColor: '#FF7043' // Example color
    },
    {
      name: '@milangohel25',
      email: 'Account not yet created',
      role: 'Workspace guest',
      permission: 'Member',
      avatar: 'M',
      avatarColor: '#5C6BC0' // Example color
    }
  ];

  // Options for dropdowns
  roles = [
    { label: RoleDescriptions[RoleEnum.ProgramManager], value: RoleEnum.ProgramManager },
    { label: RoleDescriptions[RoleEnum.ProjectManager], value: RoleEnum.ProjectManager },
    { label: RoleDescriptions[RoleEnum.TeamLead], value: RoleEnum.TeamLead },
    { label: RoleDescriptions[RoleEnum.SeniorDeveloper], value: RoleEnum.SeniorDeveloper },
    { label: RoleDescriptions[RoleEnum.JuniorDeveloper], value: RoleEnum.JuniorDeveloper },
  ];

  permissions = [
    { label: 'View only', value: 'View' },
    { label: 'Can edit', value: 'Edit' }
  ];

  selectedRole = null;
  selectedPermission = this.permissions[0];
  filteredRoles: any[] = [];
  selectedMember!: UserDto;
  globalState = inject(GlobalStateStore);

  globalStateStore = inject(GlobalStateStore);
  filterRoles(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredRoles = this.roles.filter(role =>
      role.label.toLowerCase().startsWith(query)
    );
  }

  filteredMembers = this.globalStateStore.searchedMembers;

  filterMembers(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    if (query.length < 3) return;

    this.globalStateStore.searchMembers(query);
  }
  constructor() { }

  // --- Empty functions for you to implement ---

  share() {
    // Implement share functionality
    console.log('Shared!');
    
  }

  copyLink() {
    // Implement copy link functionality
    console.log('Link copied!');
  }

  deleteLink() {
    // Implement delete link functionality
    console.log('Link deleted!');
  }

  changePermissions(event: any) {
    // Implement change permissions functionality
    console.log('Permissions changed!', event.value);
  }

  // --- Dialog visibility control ---

  closeDialog() {
    this.visible = false;
    this.globalState.setIsFindMemberModalOpen(false);
  }
}
