import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/members';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikeService } from '../../../core/services/like-service';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  private likeService = inject(LikeService);
  member = input.required<Member>();
  protected hasLiked = computed(() => this.likeService.likesIds().includes(this.member().id));

  tooggleLike(event: Event){
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if(this.hasLiked()){
          this.likeService.likesIds.update(ids => ids.filter(x => x !== this.member().id))
        } else {
          this.likeService.likesIds.update(ids => [...ids, this.member().id])
        }
      }
    })
  }
}
