import { Player, Attributes, League, Club, Competition, SaveGame, AllTimeXI, Manager, ManagerAttributes, TrophyCabinetSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { defaultAttributes, defaultManagerAttributes } from '../constants';

export const PLAYERS_KEY = 'fm_player_archive_players';
export const MANAGERS_KEY = 'fm_player_archive_managers';
export const CUSTOM_LEAGUES_KEY = 'fm_custom_leagues';
export const CUSTOM_CLUBS_KEY = 'fm_custom_clubs';
export const CUSTOM_COMPETITIONS_KEY = 'fm_custom_competitions';
export const CUSTOM_ICONS_KEY = 'fm_custom_icons';
export const CUSTOM_TAGS_KEY = 'fm_custom_tags';
export const SAVE_GAMES_KEY = 'fm_save_games';
export const ALL_TIME_XI_KEY = 'fm_player_archive_all_time_xi';
export const USERNAME_KEY = 'fm_player_archive_username';
export const FM_VERSIONS_KEY = 'fm_player_archive_fm_versions';
export const WELCOME_MODAL_SHOWN_KEY = 'fm_player_archive_welcome_modal_shown';
export const TROPHY_CABINET_SETTINGS_KEY = 'fm_trophy_cabinet_settings';
export const NEWGEN_TERM_KEY = 'fm_player_archive_newgen_term';
export const DATE_FORMAT_KEY = 'fm_player_archive_date_format';
export const CURRENCY_KEY = 'fm_player_archive_currency';
export const FACEPACK_PATH_KEY = 'fm_facepack_path';
export const FACEPACK_CONFIG_KEY = 'fm_facepack_config';

const sabljicAttributes: Attributes = {
  ...defaultAttributes,
  // Technical
  corners: 4,
  crossing: 10,
  dribbling: 10,
  finishing: 7,
  firstTouch: 15,
  freeKickTaking: 6,
  heading: 19,
  longShots: 6,
  longThrows: 4,
  marking: 17,
  passing: 14,
  penaltyTaking: 4,
  tackling: 16,
  technique: 17,
  
  // Mental
  aggression: 12,
  anticipation: 16,
  bravery: 14,
  composure: 13,
  concentration: 17,
  decisions: 15,
  determination: 18,
  flair: 10,
  leadership: 10,
  offTheBall: 10,
  positioning: 17,
  teamwork: 12,
  vision: 13,
  workRate: 15,

  // Physical
  acceleration: 14,
  agility: 16,
  balance: 18,
  jumpingReach: 19,
  naturalFitness: 12,
  pace: 15,
  stamina: 16,
  strength: 14,
  
  // Goalkeeping
  aerialReach: 6, commandOfArea: 5, communication: 10, eccentricity: 8, handling: 7, kicking: 8, oneOnOnes: 5, punching: 5, reflexes: 6, rushingOut: 7, throwing: 12,
};

const sabljicAttributesOlder: Attributes = {
  ...sabljicAttributes,
  heading: 18,
  marking: 18,
  passing: 13,
  tackling: 15,
  technique: 16,
  determination: 17,
  jumpingReach: 18,
  workRate: 14,
};


const novakAttributes: Attributes = {
  ...defaultAttributes,
  aerialReach: 16, commandOfArea: 15, communication: 14, eccentricity: 8, handling: 17, kicking: 15, oneOnOnes: 16, punching: 13, reflexes: 18, rushingOut: 14, throwing: 15,
  anticipation: 15, bravery: 16, composure: 14, concentration: 16, decisions: 15, determination: 17, leadership: 12, positioning: 16, teamwork: 13,
  acceleration: 12, agility: 14, balance: 13, jumpingReach: 17, naturalFitness: 15, pace: 11, stamina: 14, strength: 15,
};

const novakAttributesYounger: Attributes = {
  ...novakAttributes,
  handling: 15,
  oneOnOnes: 14,
  reflexes: 17,
  determination: 15,
  jumpingReach: 16,
};

const pelaezSnapshot1Attributes: Attributes = {
  corners: 15,
  crossing: 11,
  dribbling: 13,
  finishing: 17,
  firstTouch: 13,
  freeKickTaking: 16,
  heading: 18,
  longShots: 12,
  longThrows: 6,
  marking: 6,
  passing: 11,
  penaltyTaking: 13,
  tackling: 3,
  technique: 17,
  aggression: 7,
  anticipation: 14,
  bravery: 9,
  composure: 13,
  concentration: 13,
  decisions: 14,
  determination: 15,
  flair: 14,
  leadership: 7,
  offTheBall: 15,
  positioning: 7,
  teamwork: 12,
  vision: 14,
  workRate: 14,
  acceleration: 18,
  agility: 19,
  balance: 19,
  jumpingReach: 12,
  naturalFitness: 16,
  pace: 17,
  stamina: 17,
  strength: 17,
  aerialReach: 10,
  commandOfArea: 10,
  communication: 10,
  eccentricity: 10,
  handling: 10,
  kicking: 10,
  oneOnOnes: 10,
  punching: 10,
  reflexes: 10,
  rushingOut: 10,
  throwing: 10,
};

const pelaezAttributes: Attributes = {
  corners: 18,
  crossing: 13,
  dribbling: 13,
  finishing: 17,
  firstTouch: 15,
  freeKickTaking: 16,
  heading: 18,
  longShots: 12,
  longThrows: 6,
  marking: 6,
  passing: 12,
  penaltyTaking: 16,
  tackling: 3,
  technique: 17,
  aggression: 7,
  anticipation: 15,
  bravery: 9,
  composure: 14,
  concentration: 15,
  decisions: 15,
  determination: 15,
  flair: 14,
  leadership: 8,
  offTheBall: 16,
  positioning: 7,
  teamwork: 12,
  vision: 16,
  workRate: 15,
  acceleration: 17,
  agility: 20,
  balance: 19,
  jumpingReach: 12,
  naturalFitness: 17,
  pace: 16,
  stamina: 16,
  strength: 17,
  aerialReach: 10,
  commandOfArea: 10,
  communication: 10,
  eccentricity: 10,
  handling: 10,
  kicking: 10,
  oneOnOnes: 10,
  punching: 10,
  reflexes: 10,
  rushingOut: 10,
  throwing: 10,
};

const initialPlayers: Player[] = [
  {
    id: uuidv4(),
    firstName: 'Goran',
    lastName: 'Sabljic',
    knownAs: '',
    dateOfBirth: '2007-12-09',
    squadNumber: 5,
    nationality: 'Serbia',
    primaryPosition: 'DC',
    currentClub: 'West Ham United',
    fmVersion: 'FM24',
    isRegen: true,
    isYouthIntake: false,
    saveGameName: 'Network Save',
    hasKnownAttributes: true,
    isFavourite: true,
    internationalCaps: 40,
    internationalGoals: 3,
    currentValue: 125,
    clubHistory: [
      { id: uuidv4(), clubName: 'FK Crvena zvezda', startYear: 2023, endYear: 2028, managedByUser: false, wasCaptain: false, transferFee: 0, isManagerTransfer: false, isLoan: false },
      { id: uuidv4(), clubName: 'West Ham United', startYear: 2028, endYear: 'Present', managedByUser: true, wasCaptain: true, transferFee: 85, isManagerTransfer: true, isLoan: false },
    ],
    seasonStats: [
      { id: uuidv4(), season: '2023/24', club: 'FK Crvena zvezda', league: 'Serbian SuperLiga', apps: 0, goals: 0, assists: 0, avgRating: 0.00, honours: [], pom: 0 },
      { id: uuidv4(), season: '2024/25', club: 'FK Crvena zvezda', league: 'Serbian SuperLiga', apps: 0, goals: 0, assists: 0, avgRating: 0.00, honours: [], pom: 0 },
      { id: uuidv4(), season: '2025/26', club: 'FK Crvena zvezda', league: 'Serbian SuperLiga', apps: 12, goals: 0, assists: 1, avgRating: 6.78, honours: [], pom: 1 },
      { id: uuidv4(), season: '2026/27', club: 'FK Crvena zvezda', league: 'Serbian SuperLiga', apps: 29, goals: 1, assists: 0, avgRating: 7.12, honours: [], pom: 2 },
      { id: uuidv4(), season: '2027/28', club: 'FK Crvena zvezda', league: 'Serbian SuperLiga', apps: 19, goals: 1, assists: 1, avgRating: 7.44, honours: [], pom: 4 },
      { id: uuidv4(), season: '2028/29', club: 'West Ham United', league: 'Premier League', apps: 32, goals: 11, assists: 2, avgRating: 7.24, honours: ['communityshield', 'prem', 'facup', 'ucl'], pom: 5 },
      { id: uuidv4(), season: '2029/30', club: 'West Ham United', league: 'Premier League', apps: 34, goals: 22, assists: 6, avgRating: 7.62, honours: ['communityshield', 'prem'], pom: 8 },
      { id: uuidv4(), season: '2030/31', club: 'West Ham United', league: 'Premier League', apps: 34, goals: 24, assists: 1, avgRating: 7.81, honours: ['world_player_of_year', 'world_footballer_of_year', 'prem'], pom: 11 },
    ],
    attributes: sabljicAttributes,
    attributeSnapshots: [
      { id: uuidv4(), date: '2030-05-30', attributes: sabljicAttributesOlder, value: 82 },
      { id: uuidv4(), date: '2031-05-30', attributes: sabljicAttributes, value: 125 }
    ],
    originalManager: 'Chris Sorrell',
    isImported: false,
    imageUrl: undefined,
    facepackId: undefined,
    customTags: [],
  },
  {
    id: "ea3eb806-ea60-4a26-9c5f-48034dee3cad",
    firstName: "Claudio",
    lastName: "Pelaez",
    knownAs: "",
    dateOfBirth: '2000-11-21',
    squadNumber: 10,
    nationality: "Argentina",
    primaryPosition: "ST",
    currentClub: "Atlético Madrid",
    fmVersion: "FM15",
    isRegen: true,
    isYouthIntake: false,
    saveGameName: "Mobile",
    hasKnownAttributes: true,
    isFavourite: false,
    internationalCaps: 135,
    internationalGoals: 92,
    clubHistory: [
      { id: "4605b10d-39cd-4cc7-aec7-1b4cd763e9d1", clubName: "Rosario Central", startYear: 2018, endYear: "2019", managedByUser: false, wasCaptain: false, transferFee: 0, isManagerTransfer: false, isLoan: false },
      { id: "041d6bf0-d85c-46c7-95a6-fb9b3e5b4ffc", clubName: "Arsenal", startYear: 2019, endYear: "2020", managedByUser: false, wasCaptain: false, transferFee: 1.9, isManagerTransfer: false, isLoan: false },
      { id: "047c5192-4fd1-4e64-a9fb-628acff93325", clubName: "Villarreal", startYear: 2019, endYear: "2020", managedByUser: false, wasCaptain: false, transferFee: 0, isManagerTransfer: false, isLoan: false },
      { id: "16bf188d-c1a8-4c77-84b8-635c277c4706", clubName: "Manchester United", startYear: 2020, endYear: "2026", managedByUser: true, wasCaptain: false, transferFee: 40, isManagerTransfer: true, isLoan: false },
      { id: "cdc54ca0-ba93-4e40-b0d1-bbbd9f34bcca", clubName: "Paris Saint-Germain", startYear: 2026, endYear: "2031", managedByUser: true, wasCaptain: false, transferFee: 65, isManagerTransfer: true, isLoan: false },
      { id: "015d6bcf-ae87-4653-a840-dfebffbcc667", clubName: "Atlético Madrid", startYear: 2031, endYear: "Present", managedByUser: true, wasCaptain: false, transferFee: 34, isManagerTransfer: true, isLoan: false }
    ],
    seasonStats: [
      { id: "7b213e78-1be9-470c-b88b-0dbb661f8028", season: "2018/19", club: "Rosario Central", apps: 34, goals: 23, assists: 4, avgRating: 7.04, honours: [], cleanSheets: 0, goalsConceded: 0, pom: 1 },
      { id: "c33b3a8d-4379-4e53-af13-3f08b4464fd0", season: "2019/20", club: "Villarreal", apps: 22, goals: 10, assists: 3, avgRating: 6.95, honours: [ "prem", "facup" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "La Liga" },
      { id: "0d312498-1093-4541-801b-6f5f7878f081", season: "2020/21", club: "Manchester United", apps: 29, goals: 25, assists: 2, avgRating: 7.72, honours: [ "ucl", "poty" ], cleanSheets: 0, goalsConceded: 0, pom: 2, league: "Premier League" },
      { id: "992f6b30-0383-4116-8357-1e8ea58e9e16", season: "2021/22", club: "Manchester United", apps: 28, goals: 15, assists: 7, avgRating: 7.35, honours: [ "carabao" ], cleanSheets: 0, goalsConceded: 0, pom: 1, league: "Premier League" },
      { id: "7fb87d5a-d2f2-4921-a049-2d2028ab52d5", season: "2022/23", club: "Manchester United", apps: 34, goals: 26, assists: 12, avgRating: 7.61, honours: [ "prem", "ucl", "ballondor" ], cleanSheets: 0, goalsConceded: 0, pom: 5, league: "Premier League" },
      { id: "9c11aef8-9895-4f6e-844d-4d50bd0aee44", season: "2023/24", club: "Manchester United", apps: 67, goals: 58, assists: 26, avgRating: 7.68, honours: [], cleanSheets: 0, goalsConceded: 0, pom: 15, league: "Premier League" },
      { id: "c3636972-3e14-41c7-8c4c-49ef165c497d", season: "2024/25", club: "Manchester United", apps: 57, goals: 49, assists: 17, avgRating: 7.66, honours: [ "prem" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "Premier League" },
      { id: "4e37a435-f889-4912-9e6f-d432ed397df2", season: "2025/26", club: "Manchester United", apps: 41, goals: 28, assists: 13, avgRating: 7.8, honours: [ "facup" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "Premier League" },
      { id: "5c03b4d2-b1bd-4e04-ab46-b150ad7f1ab8", season: "2026/27", club: "Paris Saint-Germain", apps: 49, goals: 38, assists: 19, avgRating: 8.4, honours: [ "poty" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "Ligue 1" },
      { id: "c9419c56-4f0a-414c-9511-506124c82471", season: "2027/28", club: "Paris Saint-Germain", apps: 37, goals: 31, assists: 30, avgRating: 7.94, honours: [ "ligue1", "coupedefrance", "ucl", "ballondor" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "Ligue 1" },
      { id: "92ae560e-f148-4853-a0cc-0b6c10bbbc71", season: "2028/29", club: "Paris Saint-Germain", apps: 38, goals: 37, assists: 15, avgRating: 8.5, honours: [ "ligue1", "club_wc" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "Ligue 1" },
      { id: "cd23e562-00fe-4a46-9371-6a102f25307b", season: "2029/30", club: "Paris Saint-Germain", apps: 54, goals: 44, assists: 34, avgRating: 7.95, honours: [ "ligue1", "coupedefrance", "poty", "trophee_champions", "uefa_super_cup" ], cleanSheets: 0, goalsConceded: 0, pom: 13, league: "Ligue 1" },
      { id: "ac1dba2a-1c00-4dfa-acda-377d7f9de4e8", season: "2030/31", club: "Paris Saint-Germain", apps: 35, goals: 30, assists: 12, avgRating: 7.7, honours: [ "ligue1", "trophee_champions", "coupedefrance" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "Ligue 1" },
      { id: "9aebf78d-199c-4df2-904c-ee1cbbc684b9", season: "2031/32", club: "Atlético Madrid", apps: 39, goals: 24, assists: 11, avgRating: 7.94, honours: [ "copadelrey" ], cleanSheets: 0, goalsConceded: 0, pom: 0, league: "La Liga" }
    ],
    attributes: pelaezAttributes,
    attributeSnapshots: [
      { id: "960ca921-5e02-4514-a522-2edd64668193", date: "2024-05-31", attributes: pelaezSnapshot1Attributes, value: 52 },
      { id: "5cf29271-59ab-4829-994b-8a368b53bc1c", date: "2030-05-18", attributes: pelaezAttributes, value: 33 }
    ],
    originalManager: "Chris Sorrell",
    isImported: false,
    currentValue: 33,
    imageUrl: undefined,
    facepackId: undefined,
    customTags: [],
  },
  {
    id: uuidv4(),
    firstName: 'Jan',
    lastName: 'Novák',
    knownAs: '',
    dateOfBirth: '2008-03-15',
    squadNumber: 1,
    nationality: 'Czech Republic',
    primaryPosition: 'GK',
    currentClub: 'Borussia Dortmund',
    fmVersion: 'FM23',
    isRegen: true,
    isYouthIntake: true,
    saveGameName: 'My Career',
    hasKnownAttributes: true,
    isFavourite: false,
    internationalCaps: 88,
    internationalGoals: 0,
    currentValue: 65,
    clubHistory: [
      { id: uuidv4(), clubName: 'Borussia Dortmund', startYear: 2024, endYear: 'Present', managedByUser: true, wasCaptain: false, transferFee: 0, isManagerTransfer: true, isLoan: false },
    ],
    seasonStats: [
        { id: uuidv4(), season: '2024/25', club: 'Borussia Dortmund', league: 'Bundesliga', apps: 34, goals: 0, assists: 0, cleanSheets: 15, goalsConceded: 28, avgRating: 7.1, honours: ['dfl_supercup'], pom: 3 },
        { id: uuidv4(), season: '2025/26', club: 'Borussia Dortmund', league: 'Bundesliga', apps: 38, goals: 0, assists: 1, cleanSheets: 18, goalsConceded: 22, avgRating: 7.3, honours: ['bundesliga', 'dfbpokal'], pom: 5 },
        { id: uuidv4(), season: '2026/27', club: 'Borussia Dortmund', league: 'Bundesliga', apps: 41, goals: 0, assists: 0, cleanSheets: 20, goalsConceded: 25, avgRating: 7.4, honours: ['bundesliga', 'ucl'], pom: 6 },
    ],
    attributes: novakAttributes,
    attributeSnapshots: [
        { id: uuidv4(), date: '2025-05-30', attributes: novakAttributesYounger, value: 21 },
        { id: uuidv4(), date: '2027-05-30', attributes: novakAttributes, value: 65 }
    ],
    originalManager: 'Chris Sorrell',
    isImported: false,
    imageUrl: undefined,
    facepackId: undefined,
    customTags: [],
  },
];

const initialManagers: Manager[] = [
    {
        id: uuidv4(),
        firstName: 'Luca',
        lastName: 'Colton',
        knownAs: '',
        nationality: 'England',
        currentClub: 'West Ham United',
        fmVersion: 'FM24',
        saveGameName: 'Journeyman',
        coachingBadge: 'Continental Pro',
        managerStyle: 'Tracksuit',
        isFavourite: true,
        clubHistory: [
            { id: uuidv4(), clubName: 'Wycombe Wanderers', startYear: 2024, endYear: 2025, gamesManaged: 52, winRatio: 55.8, isLoan: false },
            { id: uuidv4(), clubName: 'Queens Park Rangers', startYear: 2025, endYear: 2026, gamesManaged: 25, winRatio: 48.0, isLoan: false },
            { id: uuidv4(), clubName: 'Girona', startYear: 2026, endYear: 2026, gamesManaged: 1, winRatio: 0, isLoan: false },
            { id: '3', clubName: 'Luton Town', startYear: 2026, endYear: 2028, gamesManaged: 102, winRatio: 51.0, isLoan: false },
            { id: uuidv4(), clubName: 'West Ham United', startYear: 2028, endYear: 'Present', gamesManaged: 152, winRatio: 78.0, isLoan: false },
        ],
        seasonStats: [
            { id: uuidv4(), season: '2024/25', club: 'Wycombe Wanderers', league: 'League One', wins: 29, losses: 13, draws: 10, leaguePosition: '4', honours: { motm: 2 } },
            { id: uuidv4(), season: '2025/26', club: 'Queens Park Rangers', league: 'Championship', wins: 12, losses: 7, draws: 6, leaguePosition: '10', honours: {} },
            { id: uuidv4(), season: '2025/26', club: 'Girona', league: 'La Liga', wins: 0, losses: 1, draws: 0, leaguePosition: '19', honours: {} },
            { id: uuidv4(), season: '2026/27', club: 'Luton Town', league: 'Championship', wins: 30, losses: 9, draws: 7, leaguePosition: '1', honours: { moty: 1, championship: 1, motm: 5 } },
            { id: uuidv4(), season: '2027/28', club: 'Luton Town', league: 'Premier League', wins: 11, losses: 19, draws: 8, leaguePosition: '15', honours: { motm: 1 } },
            { id: uuidv4(), season: '2028/29', club: 'West Ham United', league: 'Premier League', wins: 30, losses: 2, draws: 6, leaguePosition: '1', honours: { prem: 1, facup: 1, ucl: 1, moty: 1 } },
            { id: uuidv4(), season: '2029/30', club: 'West Ham United', league: 'Premier League', wins: 32, losses: 3, draws: 3, leaguePosition: '1', honours: { prem: 1, moty: 1, motm: 4 } },
        ],
        attributes: { ...defaultManagerAttributes, determination: 20, manManagement: 18, workingWithYoungsters: 17, adaptability: 16 },
        originalManager: 'Chris Sorrell',
        isImported: false,
    }
];


export const getPlayers = (): Player[] => {
  try {
    const playersJson = localStorage.getItem(PLAYERS_KEY);
    return playersJson ? JSON.parse(playersJson) : [];
  } catch (error) {
    console.error("Failed to parse players from localStorage", error);
    return [];
  }
};

export const savePlayers = (players: Player[]): void => {
  try {
    const playersJson = JSON.stringify(players);
    localStorage.setItem(PLAYERS_KEY, playersJson);
  } catch (error) {
    console.error("Failed to save players to localStorage", error);
  }
};

export const getInitialPlayers = (): Player[] => {
    return initialPlayers;
};

export const getManagers = (): Manager[] => {
  try {
    const managersJson = localStorage.getItem(MANAGERS_KEY);
    return managersJson ? JSON.parse(managersJson) : [];
  } catch (error) {
    console.error("Failed to parse managers from localStorage", error);
    return [];
  }
};

export const saveManagers = (managers: Manager[]): void => {
  try {
    const managersJson = JSON.stringify(managers);
    localStorage.setItem(MANAGERS_KEY, managersJson);
  } catch (error) {
    console.error("Failed to save managers to localStorage", error);
  }
};

export const getInitialManagers = (): Manager[] => {
    return initialManagers;
};

export const getCustomData = <T>(key: string): T[] => {
    try {
        const dataJson = localStorage.getItem(key);
        // Basic check to see if we're migrating from string[] to SaveGame[]
        if (key === SAVE_GAMES_KEY && dataJson) {
            const parsed = JSON.parse(dataJson);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                const defaultColors = ['#8b5cf6', '#10b981', '#f97316', '#3b82f6', '#ef4444'];
                const migratedData = parsed.map((name: string, index: number) => ({
                    name,
                    color: defaultColors[index % defaultColors.length]
                }));
                saveCustomData(key, migratedData);
                return migratedData as T[];
            }
            return parsed;
        }
        return dataJson ? JSON.parse(dataJson) : [];
    } catch (error) {
        console.error(`Failed to parse ${key} from localStorage`, error);
        return [];
    }
}

export const saveCustomData = <T>(key: string, data: T[]): void => {
    try {
        const dataJson = JSON.stringify(data);
        localStorage.setItem(key, dataJson);
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
}

export const getCustomObject = <T>(key: string, defaultValue: T): T => {
  try {
    const dataJson = localStorage.getItem(key);
    return dataJson ? JSON.parse(dataJson) : defaultValue;
  } catch (error) {
    console.error(`Failed to parse object ${key} from localStorage`, error);
    return defaultValue;
  }
}

export const saveCustomObject = <T>(key: string, data: T): void => {
    try {
        const dataJson = JSON.stringify(data);
        localStorage.setItem(key, dataJson);
    } catch (error) {
        console.error(`Failed to save object ${key} to localStorage`, error);
    }
}

export const getDefaultTrophyCabinetSettings = (): TrophyCabinetSettings => ({
    backgroundType: 'texture',
    backgroundValue: 'https://www.transparenttextures.com/patterns/wood-pattern.png',
    shelfColor: 'rgba(120, 53, 15, 0.7)',
    shelfTitleColor: 'rgba(252, 211, 77, 0.5)',
    textColor: '#e5e7eb',
});

export const getAllTimeXI = (): AllTimeXI => {
  try {
    const xiJson = localStorage.getItem(ALL_TIME_XI_KEY);
    return xiJson ? JSON.parse(xiJson) : {};
  } catch (error) {
    console.error("Failed to parse All Time XI from localStorage", error);
    return {};
  }
};

export const saveAllTimeXI = (xi: AllTimeXI): void => {
  try {
    const xiJson = JSON.stringify(xi);
    localStorage.setItem(ALL_TIME_XI_KEY, xiJson);
  } catch (error) {
    console.error("Failed to save All Time XI to localStorage", error);
  }
};

// --- IndexedDB for large objects ---

const DB_NAME = 'FMPA_DB';
const DB_VERSION = 1;
const LARGE_OBJECT_STORE = 'large_objects';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject('IndexedDB not supported');
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(LARGE_OBJECT_STORE)) {
                db.createObjectStore(LARGE_OBJECT_STORE, { keyPath: 'key' });
            }
        };
    });
}

export function saveLargeObject(key: string, value: any): Promise<void> {
    return openDB().then(db => {
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(LARGE_OBJECT_STORE, 'readwrite');
            const store = transaction.objectStore(LARGE_OBJECT_STORE);
            store.put({ key, value });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    });
}

export function getLargeObject<T>(key: string): Promise<T | null> {
    return openDB().then(db => {
        return new Promise<T | null>((resolve, reject) => {
            const transaction = db.transaction(LARGE_OBJECT_STORE, 'readonly');
            const store = transaction.objectStore(LARGE_OBJECT_STORE);
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };
            request.onerror = () => reject(request.error);
        });
    });
}

export function removeLargeObject(key: string): Promise<void> {
    return openDB().then(db => {
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(LARGE_OBJECT_STORE, 'readwrite');
            const store = transaction.objectStore(LARGE_OBJECT_STORE);
            store.delete(key);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    });
}
