import type { AppDataV1 } from './types';

export function isAppDataV1(obj: any): obj is AppDataV1 {
  return obj && typeof obj == 'object'
    && 'version' in obj
    && Object.entries(obj).every(([key, value]) => {
      switch (key) {
        case 'gameData':
          // TODO: check GameData properties
          return value && typeof value === 'object';
        case 'settings':
          return value && typeof value === 'object';
        case 'version':
          return value === 1;
        default:
          return false;
      }
    });
}
