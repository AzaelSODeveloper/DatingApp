import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikeService);
  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
      })
    );
  } 

  login(creds: any) {
    return this.http.post<User | null>(this.baseUrl + 'account/login', creds).pipe(
      tap((user: User | null) => {
        if (user) {
          this.setCurrentUser(user);
        }      
      })
    );
  }

  setCurrentUser(user: User | null) {
    this.currentUser.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
      this.likesService.getLikesIds();
    } else {
      localStorage.removeItem('user');
    }
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    this.likesService.clearLikeIds();
    localStorage.removeItem('filters');
  } 


}
