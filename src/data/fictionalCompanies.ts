export interface FictionalCompany {
  id: string;
  name: string;
  tagline: string;
  hqLocation: string;
  size: string;
  website: string;
  logoBg: string;
  logoColor: string;
  initials: string;
}

// Companies will be fetched from the backend API.
export const FICTIONAL_COMPANIES: FictionalCompany[] = [];
