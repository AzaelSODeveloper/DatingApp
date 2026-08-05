import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';
import { LikeService } from './like-service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikeService);
  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds, {withCredentials: true}).pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
        this.startTokenRefreshInterval();
      })
    );
  } 

  refreshToken(){
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true})
  }

  startTokenRefreshInterval(){
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true}).subscribe({
        next: user => {
          this.setCurrentUser(user);
        },
        error: () => {this.logout()}
      })
    }, 5 * 60 * 1000)
  }

  login(creds: any) {
    return this.http.post<User | null>(this.baseUrl + 'account/login', creds, {withCredentials: true}).pipe(
      tap((user: User | null) => {
        if (user) {
          this.setCurrentUser(user);
        }      
      })
    );
  }

  setCurrentUser(user: User | null) {
    if (user) {
      user.roles = this.getRolesFromToken(user);      
      this.currentUser.set(user);
      this.likesService.getLikesIds();
    } else {
      localStorage.removeItem('user');
    }
  }

  logout() {
    this.currentUser.set(null);    
    this.likesService.clearLikeIds();
    localStorage.removeItem('filters');
  } 

  private getRolesFromToken(user: User): string[]{
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }
}

