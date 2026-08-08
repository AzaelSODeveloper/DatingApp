import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../../types/user';
import { email } from '@angular/forms/signals';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private toast = inject(ToastService);
  public hubConnection?: HubConnection;
  onlineUsers = signal<string[]>([]);
  // last message pushed by the hub, so open views (eg. the inbox) can react to it
  newMessage = signal<Message | null>(null);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence', {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();
    
    this.hubConnection.start()
    .catch(error => console.log(error))

    this.hubConnection.on('UserOnline', userId => {
      this.onlineUsers.update(users => [...users, userId])
    });

    this.hubConnection.on('UserOffline', userId => {
      this.onlineUsers.update(users => users.filter(x => x !== userId))
    });
    this.hubConnection.on('GetOnlineUsers', userIds => {
      this.onlineUsers.set(userIds);
    });
    this.hubConnection.on("NewMessageRecieved", (message: Message) => {
      this.toast.info(message.senderDisplayName + ' has sent you new message',
         10000, message.senderImageUrl, `/members/${message.senderId}/messages`);
      this.newMessage.set(message);
    })
  }
  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected)
    {
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }
  
}
