export type UserRole = 'admin' | 'operator';

export type PlanTier = 'starter' | 'pro' | 'business';

export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'canceled';

export type EventStatus = 'active' | 'completed' | 'scheduled';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  plan: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  daysRemaining: number;
  createdAt: Date;
  activeEventId?: string;
  totalEvents: number;
  totalVideos: number;
}

export interface GEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  videoCount: number;
  status: EventStatus;
  ownerId: string;
  introUrl?: string;
  outroUrl?: string;
  frameUrl?: string;
  musicUrl?: string;
}

export interface Video {
  id: string;
  eventId: string;
  userId: string;
  cloudinaryUrl: string;
  transformedUrl?: string;
  createdAt: Date;
  downloads: number;
}

export interface Plan {
  id: PlanTier;
  name: string;
  description: string;
  price: { daily: number; monthly: number; annual: number };
  features: string[];
  limits: { events: number; videos: number };
  highlighted: boolean;
  badge?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: 'MXN' | 'USD';
  plan: PlanTier;
  period: 'daily' | 'monthly' | 'annual';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  method: 'stripe' | 'mercadopago' | 'manual';
  date: string;
}
