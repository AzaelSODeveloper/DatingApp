import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  if(component.editForm?.dirty){
    return confirm('The data unsave is going to be lost, do you want to continue?')
  }
  return true;
};
