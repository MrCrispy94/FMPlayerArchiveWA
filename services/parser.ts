import { v4 as uuidv4 } from 'uuid';
import { Attributes, SeasonStat, LeagueTableRow } from '../types';
import { outfieldAttributeGroups, goalkeeperAttributeGroups } from '../constants';

// Create a definitive map from the constant definitions for robust mapping.
const attributeMap = new Map<string, keyof Attributes>();

// Combine all attribute names into one array
const allAttributeNames = [
    ...outfieldAttributeGroups.Technical,
    ...outfieldAttributeGroups.Mental,
    ...outfieldAttributeGroups.Physical,
    ...goalkeeperAttributeGroups.Goalkeeping,
    ...goalkeeperAttributeGroups.Mental,
    ...goalkeeperAttributeGroups.Physical,
];

// Use a Set to get unique attribute names, preventing duplicates
const uniqueAttributeNames = new Set(allAttributeNames);

uniqueAttributeNames.forEach(name => {
    // e.g. "First Touch" -> "firstTouch"
    // e.g. "Punching (Tendency)" -> "punching"
    const camelCaseName = name
        .replace(/\s*\(.*\)\s*$/, '')
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
            if (+match === 0) return "";
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        }).replace(/\s+/g, '');
    
    // key is the full lowercase name from constants.ts
    attributeMap.set(name.toLowerCase(), camelCaseName as keyof Attributes);
});


export const parseAttributesFromHTML = (htmlContent: string): { attributes: Partial<Attributes>, isGoalkeeper: boolean } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const parsedAttrs: Partial<Attributes> = {};
    let isGoalkeeper = false;

    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
        const headerCell = table.querySelector('tr th:first-child');
        const headerText = headerCell?.textContent?.trim().toLowerCase();
        
        // This is the important check for GK files
        if (headerText === 'goalkeeping') {
            isGoalkeeper = true;
        }

        if (headerText && ['technical', 'mental', 'physical', 'goalkeeping'].includes(headerText)) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 3) {
                    const namePart = cells[0].textContent?.trim().toLowerCase();
                    const valuePart = cells[2].textContent?.trim();

                    if (namePart && valuePart && attributeMap.has(namePart)) {
                        const value = parseInt(valuePart, 10);
                        if (!isNaN(value) && value >= 1 && value <= 20) {
                            const camelCaseName = attributeMap.get(namePart)!;
                            parsedAttrs[camelCaseName] = value;
                        }
                    }
                }
            });
        }
    });

    return { attributes: parsedAttrs, isGoalkeeper };
};

export const parsePlayerNameFromHTML = (htmlContent: string): { firstName: string; lastName: string; knownAs: string } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const result = { firstName: '', lastName: '', knownAs: '' };
    
    // Try h1 tag first as it's usually cleaner
    const h1 = doc.querySelector('h1');
    let nameStr = h1?.textContent?.trim() || '';

    // If h1 is empty or generic, try title
    if (!nameStr || nameStr.toLowerCase().includes('football manager')) {
        nameStr = doc.title || '';
        // Clean up title tag common suffixes
        nameStr = nameStr.replace(/ - Profile.*$/, '').trim();
    }
    
    if (nameStr) {
        const nameParts = nameStr.split(' ').filter(Boolean);
        if (nameParts.length === 1) {
            result.lastName = nameParts[0];
            result.knownAs = nameParts[0];
        } else if (nameParts.length > 1) {
            result.firstName = nameParts[0];
            result.lastName = nameParts.slice(1).join(' ');
        }
    }
    
    return result;
};


export const parseHistoryFromHTML = (htmlContent: string): SeasonStat[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const stats: SeasonStat[] = [];
    
    const tables = doc.querySelectorAll('table');
    let historyTable: HTMLTableElement | null = null;

    tables.forEach(table => {
        const headerText = table.querySelector('tr')?.textContent?.toLowerCase() || '';
        if (headerText.includes('season') && headerText.includes('club') && headerText.includes('apps')) {
            historyTable = table;
        }
    });

    if (historyTable) {
        const rows = Array.from(historyTable.querySelectorAll('tr'));
        const headerRow = rows.find(row => (row.querySelector('th') || row.querySelector('td'))?.textContent?.toLowerCase().includes('season'));

        if (!headerRow) return stats;

        const headers = Array.from(headerRow.querySelectorAll('th, td')).map(h => h.textContent?.trim().toLowerCase() || '');

        const headerMappings: { [key: string]: string[] } = {
            season: ['season'],
            club: ['club'],
            league: ['league', 'division'],
            apps: ['apps', 'app'],
            goals: ['goals', 'gls'],
            assists: ['assists', 'ast'],
            cleanSheets: ['cs', 'clean sheets'],
            goalsConceded: ['gc', 'goals conceded'],
            pom: ['pom', 'player of match'],
            avgRating: ['av r', 'avg rt', 'av rt'],
        };
        
        const headerMap: { [key: string]: number } = {};

        Object.entries(headerMappings).forEach(([key, variants]) => {
            for (const variant of variants) {
                const index = headers.findIndex(h => h.includes(variant));
                if (index !== -1) {
                    headerMap[key] = index;
                    break;
                }
            }
        });
        
        if (!headerMap.season || !headerMap.club || !headerMap.apps) return stats;

        rows.forEach(row => {
            if (row === headerRow || row.textContent?.toLowerCase().includes('career total')) return;

            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return;

            const getCell = (key: string) => cells[headerMap[key]]?.textContent?.trim() || '';

            const season = getCell('season');
            if (!/^\d{4}[-/]\d{2,4}$/.test(season)) return;
            
            const avgRatingStr = getCell('avgRating') || '0.0';
            const avgRating = avgRatingStr === '-' || avgRatingStr === '-.--' ? 0.0 : parseFloat(avgRatingStr);

            stats.push({
                id: uuidv4(),
                season: season.replace('-', '/'),
                club: getCell('club'),
                league: getCell('league') || undefined,
                apps: parseInt(getCell('apps'), 10) || 0,
                goals: parseInt(getCell('goals'), 10) || 0,
                assists: parseInt(getCell('assists'), 10) || 0,
                cleanSheets: parseInt(getCell('cleanSheets'), 10) || 0,
                goalsConceded: parseInt(getCell('goalsConceded'), 10) || 0,
                pom: parseInt(getCell('pom'), 10) || 0,
                avgRating: isNaN(avgRating) ? 0.0 : avgRating,
                honours: [],
            });
        });
    }
    
    return stats;
};

export const parseLeagueTableFromHTML = (htmlContent: string): LeagueTableRow[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const tables = doc.querySelectorAll('table');
    const data: LeagueTableRow[] = [];
    let leagueTable: HTMLTableElement | null = null;

    tables.forEach(table => {
        const headerText = table.querySelector('tr')?.textContent?.toLowerCase() || '';
        if (headerText.includes('team') && headerText.includes('pld') && headerText.includes('pts')) {
            leagueTable = table;
        }
    });
    
    if (!leagueTable) return data;

    const rows = Array.from(leagueTable.querySelectorAll('tr'));
    
    const headerRow = rows.find(row => {
        const firstCellText = row.querySelector('th, td')?.textContent?.trim().toLowerCase();
        return firstCellText === 'pos' || row.querySelector('th');
    });

    if (!headerRow) return data;

    const headers = Array.from(headerRow.querySelectorAll('th, td')).map(h => h.textContent?.trim().toLowerCase() || '');
    
    const headerMap: { [key in keyof LeagueTableRow]?: number } = {};
    const headerMappings: { [key in keyof LeagueTableRow]: string[] } = {
        pos: ['pos'],
        inf: ['inf'],
        team: ['team'],
        pld: ['pld'],
        won: ['won', 'w'],
        drn: ['drn', 'd'],
        lst: ['lst', 'l'],
        for: ['for', 'f'],
        ag: ['ag', 'ga', 'against'],
        gd: ['gd'],
        pts: ['pts'],
    };
    
    (Object.keys(headerMappings) as (keyof LeagueTableRow)[]).forEach(key => {
        for (const variant of headerMappings[key]) {
            const index = headers.indexOf(variant);
            if (index !== -1) {
                headerMap[key] = index;
                break;
            }
        }
    });
    
    if (headerMap.pos === undefined || headerMap.team === undefined || headerMap.pts === undefined) {
        return data;
    }

    rows.forEach(row => {
        if (row === headerRow) return;
        
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return;

        const getCell = (key: keyof LeagueTableRow): string => {
            const index = headerMap[key];
            return (index !== undefined && cells[index]) ? cells[index].textContent?.trim() || '' : '';
        };

        const pos = getCell('pos');
        if (!pos.match(/^\d+/)) return;

        data.push({
            pos,
            inf: getCell('inf'),
            team: getCell('team'),
            pld: getCell('pld'),
            won: getCell('won'),
            drn: getCell('drn'),
            lst: getCell('lst'),
            for: getCell('for'),
            ag: getCell('ag'),
            gd: getCell('gd'),
            pts: getCell('pts'),
        });
    });

    return data;
};

export const parseManagerSeasonResultsFromText = (textContent: string): { wins: number; losses: number; draws: number } => {
    const stats = { wins: 0, losses: 0, draws: 0 };
    const lines = textContent.split('\n');

    const headerIndex = lines.findIndex(l => 
        l.toLowerCase().includes('result') && 
        l.toLowerCase().includes('competition') &&
        l.toLowerCase().includes('opposition')
    );

    if (headerIndex === -1) return stats;

    const headerLine = lines[headerIndex].toLowerCase();
    const resultStartIndex = headerLine.indexOf('result');
    const competitionStartIndex = headerLine.indexOf('competition');
    const goalscorersStartIndex = headerLine.indexOf('goalscorers');

    const resultEndIndex = goalscorersStartIndex > resultStartIndex ? goalscorersStartIndex : competitionStartIndex;

    if (resultStartIndex === -1 || competitionStartIndex === -1) return stats;

    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        if (line.length < 20 || !/\d/.test(line)) continue;

        const competitionText = line.substring(competitionStartIndex).trim().toLowerCase();
        const resultText = line.substring(resultStartIndex, resultEndIndex).trim();
        
        if (competitionText.includes('friendly')) continue;

        if (resultText && resultText.includes('-')) {
            const scores = resultText.split('-').map(s => parseInt(s.trim(), 10));
            
            if (scores.length === 2 && !isNaN(scores[0]) && !isNaN(scores[1])) {
                if (scores[0] > scores[1]) {
                    stats.wins++;
                } else if (scores[0] < scores[1]) {
                    stats.losses++;
                } else {
                    stats.draws++;
                }
            }
        }
    }
    return stats;
};

export const parseConfigXml = (xmlString: string): Record<string, string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    const mapping: Record<string, string> = {};

    const uidRegex = /\/person\/([^/]+)\/portrait/;

    const records = doc.querySelectorAll('record[from][to]');
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const from = record.getAttribute('from'); // This is the filename, e.g., "Heffler"
        const to = record.getAttribute('to'); // This contains the UID

        if (from && to) {
            const match = to.match(uidRegex);
            if (match && match[1]) {
                const uid = match[1]; // e.g., "r-2002151551" or "1"
                mapping[uid] = from;
            }
        }
    }
    return mapping;
};
