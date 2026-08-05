import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);


  init(){
    return this.accountService.refreshToken().pipe(
      tap(user => {
        if(user){
          this.accountService.setCurrentUser(user);
          this.accountService.startTokenRefreshInterval();
        }
      }),
      // no session to restore (no cookie, or an expired/stale one) is not a
      // failure - the app just starts logged out
      catchError(() => of(null)))
  }

}
