import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { UserMamangement } from "../../features/admin/user-mamangement/user-mamangement";
import { PhotoManagement } from "../../features/admin/photo-management/photo-management";

@Component({
  selector: 'app-admin',
  imports: [UserMamangement, PhotoManagement],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  protected accountService = inject(AccountService);
  activeTab = 'photos';
  tabs= [
    {label: 'Photo moderation', value: 'photos'},
    {label: 'User management', value: 'roles'}
  ]

  setTab(tab: string){
    this.activeTab = tab;
  }
}
