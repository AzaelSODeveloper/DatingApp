import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../types/error';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError {
  protected error : ApiError | null = null;
  private router = inject(Router);
  protected showDetails = false;

  constructor() {
    // get navigation state via history to avoid deprecated getCurrentNavigation()
    const state = (history && (history.state as any)) ?? null;
    this.error = state?.error ?? null;
  }
  detailsToggle(){
    this.showDetails = !this.showDetails;
  }
}
