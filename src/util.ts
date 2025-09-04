import type { Position } from './types';

export const isWithinRadius = (pos1: Position, pos2: Position, radius: number) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distanceSquared = dx * dx + dy * dy;

  return distanceSquared <= radius * radius;
};
