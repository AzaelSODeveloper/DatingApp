import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/members';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memeberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  constructor() {

  }
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memeberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }
  onUploadImage(file: File){
    this.loading.set(true);
    this.memeberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memeberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo ])
      },
      error: error => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo){
    this.memeberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if(currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User);
        this.memeberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member)
      }
    })
  }

  deletePhoto(photoId: number){
    this.memeberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.id !== photoId))
      }
    })
  }
}
