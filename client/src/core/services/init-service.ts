import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { User } from '../../types/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);

  init(): Observable<null> {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    this.accountService.currentUser.set(user);
    return of(null);
  }

}
