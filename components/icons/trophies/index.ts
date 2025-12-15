
import { BallonDorIcon } from './BallonDorIcon';
import { ChampionsLeagueTrophyIcon } from './ChampionsLeagueTrophyIcon';
import { CupTrophyIcon } from './CupTrophyIcon';
import { LaLigaTrophyIcon } from './LaLigaTrophyIcon';
import { MedalIcon } from './MedalIcon';
import { PremierLeagueTrophyIcon } from './PremierLeagueTrophyIcon';
import { ShieldTrophyIcon } from './ShieldTrophyIcon';
import { WorldCupTrophyIcon } from './WorldCupTrophyIcon';
import { GoldenBootIcon } from './GoldenBootIcon';
import { PlateTrophyIcon } from './PlateTrophyIcon';
import { GenericCupIcon } from './GenericCupIcon';
import { PlaqueAwardIcon } from './PlaqueAwardIcon';
import { PomAwardIcon } from './PomAwardIcon';

export const TROPHY_ICONS: Record<string, React.FC<any>> = {
    'WorldCupTrophyIcon': WorldCupTrophyIcon,
    'ChampionsLeagueTrophyIcon': ChampionsLeagueTrophyIcon,
    'BallonDorIcon': BallonDorIcon,
    'PremierLeagueTrophyIcon': PremierLeagueTrophyIcon,
    'LaLigaTrophyIcon': LaLigaTrophyIcon,
    'CupTrophyIcon': CupTrophyIcon,
    'ShieldTrophyIcon': ShieldTrophyIcon,
    'MedalIcon': MedalIcon,
    'GoldenBootIcon': GoldenBootIcon,
    'PlateTrophyIcon': PlateTrophyIcon,
    'GenericCupIcon': GenericCupIcon,
    'PlaqueAwardIcon': PlaqueAwardIcon,
    'PomAwardIcon': PomAwardIcon,
};