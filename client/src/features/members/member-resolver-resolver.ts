import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member-service';
import { Member } from '../../types/members';
import { EMPTY, retry } from 'rxjs';

export const memberResolverResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memeberId = route.paramMap.get('id');

  if(!memeberId){
    router.navigateByUrl('/not-found');
    return EMPTY
  }
  return memberService.getMember(memeberId);
};
