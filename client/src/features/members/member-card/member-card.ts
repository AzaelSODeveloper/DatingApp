import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/members';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikeService } from '../../../core/services/like-service';
import { subscribeOn } from 'rxjs';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  private likeService = inject(LikeService);
  private presenceService = inject(PresenceService);
  member = input.required<Member>();
  protected hasLiked = computed(() =>
    this.likeService.likesIds().includes(this.member().id));
  protected isOnline = computed(() => 
    this.presenceService.onlineUsers().includes(this.member().id))

  tooggleLike(event: Event){
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id)
  }
}
