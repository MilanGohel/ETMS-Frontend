import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucidePlus,
  lucideDownload,
  lucideSettings,
  lucideBell,
  lucideListFilter,
  lucideArrowUpDown,
  lucideEllipsisVertical
} from '@ng-icons/lucide';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    NgIcon,
    RouterLink
  ],
  viewProviders: [provideIcons({
    lucideLayoutDashboard,
    lucidePlus,
    lucideDownload,
    lucideSettings,
    lucideBell,
    lucideListFilter,
    lucideArrowUpDown,
    lucideEllipsisVertical
  })],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails {


  items: MenuItem[] = [
    {
      icon: 'lucideLayoutDashboard',
      routerLink: ['/tasks'], // Example link,
    },
    {
      label: 'Board',
      routerLink: ['/tasks/board'], // Example link,
    },
    {
      label: 'Overview'
    }
  ];

  // Data for avatars (replace with real data)
  members = [
    { name: 'Member 1', img: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Member 2', img: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Member 3', img: 'https://i.pravatar.cc/150?img=3' },
  ];

  // Data for navigation tabs
  navTabs = ['Board', 'List', 'Timeline', 'Due Tasks'];
  activeTab = 'Board';
}