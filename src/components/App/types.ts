import type { GameData } from '~/components/Game/types';
import type { Settings } from '~/components/SettingsPage/types';

export interface AppDataV1 {
    gameData?: GameData,
    settings?: Settings,
    /** The version of the app data format */
    version: 1
}
