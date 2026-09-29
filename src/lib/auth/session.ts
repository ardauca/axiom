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
 * Get or create a default guest profile for instant frictionless practice.
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

  // Create new guest user
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
