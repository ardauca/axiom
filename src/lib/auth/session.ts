import { prisma } from '../prisma';

export interface UserSession {
  id: string;
  username: string;
  rating: number;
  independenceScore: number;
  xp: number;
  streakDays: number;
  role: string;
  preferredLang: string;
}

/**
 * Extracts student session from HTTP request headers or cookies.
 * Priority order:
 * 1. 'x-axiom-user-id' header
 * 2. 'axiom_user_id' cookie
 * 3. Deterministic guest session / creation (never silently falls back to ADMIN)
 */
export async function getSessionUser(req?: Request): Promise<UserSession> {
  let requestedUserId: string | null = null;

  if (req) {
    // 1. Header
    const headerUserId = req.headers.get('x-axiom-user-id');
    if (headerUserId) {
      requestedUserId = headerUserId;
    } else {
      // 2. Cookie
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/axiom_user_id=([^;]+)/);
      if (match && match[1]) {
        requestedUserId = match[1].trim();
      }
    }
  }

  if (requestedUserId) {
    const existing = await prisma.user.findUnique({
      where: { id: requestedUserId },
    });
    if (existing) {
      return {
        id: existing.id,
        username: existing.username,
        rating: existing.rating,
        independenceScore: existing.independenceScore,
        xp: existing.xp,
        streakDays: existing.streakDays,
        role: existing.role,
        preferredLang: existing.preferredLang,
      };
    }
  }

  // If no user found or none requested, create a isolated deterministic student
  return getOrCreateGuestUser(requestedUserId || undefined);
}

/**
 * Get or create an isolated student profile.
 */
export async function getOrCreateGuestUser(guestId?: string): Promise<UserSession> {
  if (guestId) {
    const existing = await prisma.user.findUnique({
      where: { id: guestId },
    });
    if (existing) {
      return {
        id: existing.id,
        username: existing.username,
        rating: existing.rating,
        independenceScore: existing.independenceScore,
        xp: existing.xp,
        streakDays: existing.streakDays,
        role: existing.role,
        preferredLang: existing.preferredLang,
      };
    }
  }

  // Create isolated student user
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newUser = await prisma.user.create({
    data: {
      username: `Scholar_${randomSuffix}`,
      rating: 1200,
      independenceScore: 5.0,
      xp: 0,
      streakDays: 1,
      role: 'USER',
      preferredLang: 'tr',
    },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    rating: newUser.rating,
    independenceScore: newUser.independenceScore,
    xp: newUser.xp,
    streakDays: newUser.streakDays,
    role: newUser.role,
    preferredLang: newUser.preferredLang,
  };
}
