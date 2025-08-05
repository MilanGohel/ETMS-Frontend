import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import {
  lucideFileText,
  lucideHouse,
  lucideFileCheck,
  lucideCalendar1,
  lucideMessageCircle,
  lucideFolder,
  lucideSearch
} from "@ng-icons/lucide";
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgOptimizedImage, NgIcon, CommonModule, RouterLink],
  viewProviders: [provideIcons({
    lucideFileText,
    lucideHouse,
    lucideFileCheck,
    lucideCalendar1,
    lucideMessageCircle,
    lucideFolder,
    lucideSearch
  })],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar {
  isFilesSectionOpen = false;
  selectedItem: string = 'dashboard';
  searchQuery: string = '';
  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'lucideHouse', link: '/dashboard' },
    { id: 'projects', label: 'Projects', icon: 'lucideFileText', link: '/projects' },
    { id: 'calendar', label: 'Calendar', icon: 'lucideCalendar1', link: '/calendar' },
    { id: 'messages', label: 'Messages', icon: 'lucideMessageCircle', link: '/messages' },
    { id: 'files', label: 'Files', icon: 'lucideFolder', link: '/files' }
  ];


  // ... inside @Component and class definition

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      const matchedItem = this.menuItems.find(item => currentUrl.startsWith(item.link));
      if (matchedItem) {
        this.selectedItem = matchedItem.id;
      }
    });
  }

  toggleFilesSection() {
    this.isFilesSectionOpen = !this.isFilesSectionOpen;
  }

  selectItem(item: string) {
    this.selectedItem = item;
  }

  isSelected(item: string): boolean {
    return this.selectedItem === item;
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
    // Implement your search logic here
  }

  getItemClasses(itemId: string): string {
    const baseClasses = 'flex items-center p-2 text-gray-900 rounded-lg dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-primary-light group ';
    const activeClasses = this.isSelected(itemId) ? ' bg-primary-light dark:bg-primary-light dark:text-white outline-2 outline-gray-700' : '';
    return baseClasses + activeClasses;
  }
}