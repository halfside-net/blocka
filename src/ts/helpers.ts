/**
 * Seeded random number generator function using mulberry32: https://github.com/cprosche/mulberry32
 * @param seed
 * @param salt A salt to add to the seed. Pass in a different number literal in each place you call this function!
 * @yields A random number between 0 and 1
 */
export function mulberry32Generator(seed: number, salt: number) {
  seed += salt;

  return () => {
    let t = seed += 0x6D2B79F5;

    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);

    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
