

export interface Attributes {
  corners: number; crossing: number; dribbling: number; finishing: number; firstTouch: number; freeKickTaking: number; heading: number; longShots: number; longThrows: number; marking: number; passing: number; penaltyTaking: number; tackling: number; technique: number;
  aggression: number; anticipation: number; bravery: number; composure: number; concentration: number; decisions: number; determination: number; flair: number; leadership: number; offTheBall: number; positioning: number; teamwork: number; vision: number; workRate: number;
  acceleration: number; agility: number; balance: number; jumpingReach: number; naturalFitness: number; pace: number; stamina: number; strength: number;
  aerialReach: number; commandOfArea: number; communication: number; eccentricity: number; handling: number; kicking: number; oneOnOnes: number; punching: number; reflexes: number; rushingOut: number; throwing: number;
  [key: string]: number;
}

export interface ManagerAttributes {
    attacking: number;
    defending: number;
    tactical: number;
    technical: number;
    mental: number;
    workingWithYoungsters: number;
    manManagement: number;
    determination: number;
    levelOfDiscipline: number;
    adaptability: number;
    [key: string]: number;
}

export interface AttributeSnapshot {
  id: string;
  date: string;
  attributes: Attributes;
  value?: number;
}

export interface ClubHistory {
  id: string;
  clubName: string;
  startYear: number;
  endYear: number | 'Present' | string;
  managedByUser: boolean;
  wasCaptain: boolean;
  transferFee?: number;
  isManagerTransfer?: boolean;
  isLoan?: boolean;
}

export interface SeasonStat {
  id: string;
  season: string;
  club: string;
  league?: string;
  apps: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  goalsConceded?: number;
  avgRating: number;
  honours: string[];
  pom: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  knownAs: string;
  dateOfBirth: string;
  squadNumber: number;
  nationality: string;
  primaryPosition: string;
  currentClub: string;
  fmVersion: string;
  isRegen: boolean;
  isYouthIntake: boolean;
  isImported?: boolean;
  saveGameName: string;
  hasKnownAttributes: boolean;
  isFavourite: boolean;
  internationalCaps: number;
  internationalGoals: number;
  clubHistory: ClubHistory[];
  seasonStats: SeasonStat[];
  attributes: Attributes;
  attributeSnapshots: AttributeSnapshot[];
  originalManager: string;
  imageUrl?: string;
  facepackId?: string;
  currentValue?: number;
  customTags?: string[];
}

export type ManagerStyle = 'Tracksuit' | 'Suit and Tie';

export interface ManagerClubHistory {
    id: string;
    clubName: string;
    startYear: number;
    endYear: number | 'Present' | string;
    gamesManaged: number;
    winRatio: number;
    isLoan?: boolean;
}

export interface LeagueTableRow {
    pos: string;
    inf: string;
    team: string;
    pld: string;
    won: string;
    drn: string;
    lst: string;
    for: string;
    ag: string;
    gd: string;
    pts: string;
}

export interface ManagerSeasonStat {
    id: string;
    season: string;
    club: string;
    league: string;
    wins: number;
    losses: number;
    draws: number;
    leaguePosition: string;
    honours: Record<string, number>;
    leagueTable?: LeagueTableRow[];
}

export interface Manager {
    id: string;
    firstName: string;
    lastName: string;
    knownAs: string;
    nationality: string;
    currentClub: string;
    fmVersion: string;
    saveGameName: string;
    coachingBadge: string;
    managerStyle: ManagerStyle;
    isFavourite: boolean;
    isImported?: boolean;
    clubHistory: ManagerClubHistory[];
    seasonStats: ManagerSeasonStat[];
    attributes: ManagerAttributes;
    originalManager: string;
}

export interface League {
  id: string;
  name: string;
  nation: string;
}

export interface Club {
  id: string;
  name: string;
  kitColors: {
    primary: string;
    secondary: string;
  };
  pattern: 'plain' | 'stripes' | 'hoops';
}

export type HonourType = 
    | 'league' 
    | 'domestic_cup' 
    | 'continental_cup' 
    | 'intercontinental_cup' 
    | 'international_trophy' 
    | 'friendly_cup'
    | 'personal_global' 
    | 'personal_national' 
    | 'personal_domestic';

export interface Honour {
  id: string;
  name: string;
  type: HonourType;
  isManagerOnly?: boolean;
  isCountable?: boolean;
  icon?: string;
  category?: 'Team' | 'Personal';
}

export interface Competition extends Honour {}

export interface SaveGame {
  name: string;
  color: string;
}

export interface CustomTag {
  id: string;
  name: string;
  color: string;
}

export type AllTimeXI = Record<string, string | null>;

export interface SavedSquad {
  squadName: string;
  formation: string;
  xi: AllTimeXI;
  players: Player[];
}

export interface ExportData {
  players?: Player[];
  managers?: Manager[];
  customClubs: Club[];
  customCompetitions: Competition[];
  saveGames: SaveGame[];
}

export type NewgenTerm = 'NewGen' | 'Regen';

export type DateFormatOption = 'dd/mm/yyyy' | 'mm/dd/yyyy';

export type CurrencyOption = 'GBP' | 'USD' | 'EUR' | 'BRL' | 'JPY' | 'AUD' | 'CAD';

export interface TrophyCabinetSettings {
    backgroundType: 'texture' | 'color';
    backgroundValue: string;
    shelfColor: string;
    shelfTitleColor: string;
    textColor: string;
}

export interface FullExportData {
    username: string | null;
    players: Player[];
    managers: Manager[];
    customLeagues: League[];
    customClubs: Club[];
    customCompetitions: Competition[];
    customTags: CustomTag[];
    saveGames: SaveGame[];
    fmVersions: string[];
    allTimeXI: AllTimeXI;
    customIcons: Record<string, string>;
    trophyCabinetSettings: TrophyCabinetSettings;
    newgenTerm: NewgenTerm;
    dateFormat: DateFormatOption;
    currency: CurrencyOption;
    welcomeModalShown: boolean;
    facesPath: string;
    facepackConfig: Record<string, string>;
}

export interface FormationPosition {
  position: string;
  top: string;
  left: string;
}

export interface TeamRatings {
    gk: number;
    def: number;
    mid: number;
    att: number;
    overall: number;
}

export interface Goal {
    team: 'home' | 'away';
    scorerName: string;
    minute: number;
}

export interface MatchResult {
    homeScore: number;
    awayScore: number;
    goals: Goal[];
}