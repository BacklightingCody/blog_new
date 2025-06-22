'use client';

import {
  useUser,
  useAuth,
  useClerk,
  useSignIn,
  useSignUp,
  useSession,
  useSessionList,
  useOrganization,
  useOrganizationList,
} from '@clerk/nextjs';

export function useClerkInfo() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, getToken } = useAuth();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { session } = useSession();
  const { sessions } = useSessionList();
  const { organization } = useOrganization();
  // const { organizationList } = useOrganizationList();
  // console.log('user', user);
  // console.log('session', session);
  // console.log('userLoaded', userLoaded);
  // console.log('organization', organization);
  // console.log('organizationList', organizationList);
  // console.log('sessions', sessions);
  // console.log('isSignedIn', isSignedIn);
  // console.log('signIn', signIn);
  // console.log('signUp', signUp);
  return {
    // User info
    user,
    userLoaded,
    isSignedIn,
    getToken,

    // Clerk core
    signOut,
    openSignIn,
    openSignUp,

    // Auth logic
    signIn,
    setSignInActive,
    signUp,
    setSignUpActive,

    // Sessions
    session,
    sessions,

    // Organizations
    organization,
    // organizationList,
  };
}
