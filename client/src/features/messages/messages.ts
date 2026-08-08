import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-service';
import { PresenceService } from '../../core/services/presence-service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { Paginator } from "../../shared/paginator/paginator";
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {  
  private messageService = inject(MessageService);
  private presenceService = inject(PresenceService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

  tabs = [
    {label: 'Inbox', value: "Inbox"  },
    {label: 'Outbox', value: "Outbox"  }
  ]

  constructor() {
    // a message pushed by the presence hub belongs at the top of the inbox.
    // only page 1 is touched, so paging through older messages stays stable.
    effect(() => {
      const message = this.presenceService.newMessage();
      if (!message || this.fetchedContainer !== 'Inbox' || this.pageNumber !== 1) return;

      this.paginatedMessages.update(prev => {
        if (!prev || prev.items.some(x => x.id === message.id)) return prev;
        return {
          items: [message, ...prev.items].slice(0, this.pageSize),
          metadata: {...prev.metadata, totalCount: prev.metadata.totalCount + 1}
        }
      })
    })
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  deleteMessage(event: Event, id: string){
    event.stopPropagation();
    this.messageService.deleteMessage(id);
    const current = this.paginatedMessages();
    if(current?.items){
      this.paginatedMessages.update(prev => {
        if(!prev) return null;

        const newItems = prev.items.filter(x => x.id !== id) || [];
        return {
          items: newItems,
          metadata: prev.metadata
        }
      })
    }
  }
  loadMessages(){
    this.messageService.getMessage(this.container, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.paginatedMessages.set(response)
        this.fetchedContainer = this.container;
      }
    })
  }

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }
  setContiner(container: string){
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }
  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMessages();
  }
}
