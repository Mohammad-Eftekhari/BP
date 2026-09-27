export const en = {
  siteName: "Application starter",
  siteDescription: "A reusable starting point for a full-stack web application.",
  nav: {
    account: "Account",
    home: "Application starter",
    dashboard: "Dashboard",
    profile: "Profile",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
  },
  home: {
    title: "Application starter",
    description:
      "A neutral starting point for a web application with accounts, a private area, and one reference profile you can replace.",
    signUp: "Create account",
    signIn: "Sign in",
  },
  signIn: {
    title: "Sign in",
    description: "Use the email and password for your account.",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in...",
    prompt: "New here?",
    alternate: "Create an account",
    invalidCredentials: "Email or password is incorrect.",
    rateLimited: "Too many attempts. Wait a moment and try again.",
  },
  signUp: {
    title: "Create account",
    description: "Choose a name, email, and password.",
    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    submit: "Create account",
    submitting: "Creating account...",
    prompt: "Already have an account?",
    alternate: "Sign in",
    failed: "Could not create an account with those details.",
    rateLimited: "Too many attempts. Wait a moment and try again.",
  },
  dashboard: {
    title: "Dashboard",
    signedInAs: "Signed in as",
    editProfile: "Edit profile",
  },
  profile: {
    title: "Profile",
    description:
      "This reference feature saves a display name and biography for the signed-in account.",
    displayName: "Display name",
    biography: "Biography",
    save: "Save profile",
    saving: "Saving...",
    saved: "Profile saved",
    loadError: "The profile could not be loaded.",
    saveError: "Could not save the profile.",
    tryAgain: "Try again",
  },
  notFound: {
    title: "Page not found",
    description: "That address is not part of this application.",
    home: "Back to home",
  },
  appError: {
    title: "Something went wrong",
    description: "The page could not be displayed. You can try again.",
    tryAgain: "Try again",
  },
  theme: {
    toggle: "Toggle color theme",
  },
  language: {
    switchToPersian: "تغییر به فارسی",
    switchToEnglish: "Switch to English",
    persianShort: "فا",
    englishShort: "EN",
  },
  validation: {
    email: "Enter a valid email address",
    passwordMin: "Password must be at least 8 characters",
    passwordMax: "Password must be at most 128 characters",
    nameRequired: "Name is required",
    nameMax: "Name must be at most 80 characters",
    confirmPassword: "Confirm your password",
    passwordMismatch: "Passwords do not match",
    displayNameRequired: "Display name is required",
    displayNameMax: "Display name must be at most 80 characters",
    bioMax: "Biography must be at most 280 characters",
  },
} as const;

type TStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : TStringify<T[K]>;
};

export type TDictionary = TStringify<typeof en>;
