import { Player, Honour, Club, Attributes, League, Competition, HonourType, FormationPosition, Manager, ManagerAttributes, CurrencyOption } from './types';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_FM_VERSIONS = [
    'FM25', 'FM24', 'FM23', 'FM22', 'FM21', 'FM20', 'FM19', 'FM18', 'FM17', 'FM16', 'FM15', 'FM14', 'FM13', 'FM12', 'FM11', 'FM10', 'FM09', 'FM08', 'FM07', 'FM06', 'FM05', 'CM04', 'CM03', 'CM02', 'CM01'
];

export const CONTINENTS: Record<string, string[]> = {
    'Europe': [
        'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria',
        'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'England', 'Estonia', 'Faroe Islands', 'Finland', 'France',
        'Georgia', 'Germany', 'Gibraltar', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Kosovo', 'Latvia',
        'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro',
        'Netherlands', 'North Macedonia', 'Northern Ireland', 'Norway', 'Poland', 'Portugal', 'Romania',
        'Russia', 'San Marino', 'Scotland', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
        'Switzerland', 'Turkey', 'Ukraine', 'Wales'
    ],
    'Africa': [
        'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon',
        'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Congo, Democratic Republic of the',
        'Cote d\'Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia',
        'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
        'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia',
        'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
        'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
        'Zambia', 'Zimbabwe'
    ],
    'Asia': [
        'Afghanistan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia',
        'China', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan',
        'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia',
        'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar',
        'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan',
        'Thailand', 'Timor-Leste', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan',
        'Vietnam', 'Yemen'
    ],
    'North America': [
        'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 'Cuba',
        'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Haiti', 'Honduras',
        'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'Saint Lucia',
        'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'USA'
    ],
    'South America': [
        'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru',
        'Suriname', 'Uruguay', 'Venezuela'
    ],
    'Oceania': [
        'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'New Zealand',
        'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu'
    ]
};

export const LEAGUES: Record<string, string[]> = {
    'Premier League': [
        'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton & Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool', 'Luton Town', 'Manchester City', 'Manchester United', 'Newcastle United', 'Nottingham Forest', 'Sheffield United', 'Tottenham Hotspur', 'West Ham United', 'Wolverhampton Wanderers'
    ],
    'Championship': [
        'Birmingham City', 'Blackburn Rovers', 'Bristol City', 'Cardiff City', 'Coventry City', 'Huddersfield Town', 'Hull City', 'Ipswich Town', 'Leeds United', 'Leicester City', 'Middlesbrough', 'Millwall', 'Norwich City', 'Plymouth Argyle', 'Preston North End', 'Queens Park Rangers', 'Rotherham United', 'Sheffield Wednesday', 'Southampton', 'Stoke City', 'Sunderland', 'Swansea City', 'Watford', 'West Bromwich Albion'
    ],
    'League One': [
        'Barnsley', 'Blackpool', 'Bolton Wanderers', 'Bristol Rovers', 'Burton Albion', 'Cambridge United', 'Carlisle United', 'Charlton Athletic', 'Cheltenham Town', 'Derby County', 'Exeter City', 'Fleetwood Town', 'Leyton Orient', 'Lincoln City', 'Northampton Town', 'Oxford United', 'Peterborough United', 'Port Vale', 'Portsmouth', 'Reading', 'Shrewsbury Town', 'Stevenage', 'Wigan Athletic', 'Wycombe Wanderers'
    ],
    'League Two': [
        'AFC Wimbledon', 'Accrington Stanley', 'Barrow', 'Bradford City', 'Colchester United', 'Crawley Town', 'Crewe Alexandra', 'Doncaster Rovers', 'Forest Green Rovers', 'Gillingham', 'Grimsby Town', 'Harrogate Town', 'Mansfield Town', 'MK Dons', 'Morecambe', 'Newport County', 'Notts County', 'Salford City', 'Stockport County', 'Sutton United', 'Swindon Town', 'Tranmere Rovers', 'Walsall', 'Wrexham'
    ],
    'Vanarama National League': [
        'AFC Fylde', 'Aldershot Town', 'Altrincham', 'Barnet', 'Boreham Wood', 'Bromley', 'Chesterfield', 'Dagenham & Redbridge', 'Dorking Wanderers', 'Eastleigh', 'Ebbsfleet United', 'FC Halifax Town', 'Gateshead', 'Hartlepool United', 'Kidderminster Harriers', 'Maidenhead United', 'Oldham Athletic', 'Oxford City', 'Rochdale', 'Solihull Moors', 'Southend United', 'Wealdstone', 'Woking', 'York City'
    ],
    'La Liga': [
        'Alavés', 'Almería', 'Athletic Bilbao', 'Atlético Madrid', 'Barcelona', 'Cádiz', 'Celta Vigo', 'Getafe', 'Girona', 'Granada', 'Las Palmas', 'Mallorca', 'Osasuna', 'Rayo Vallecano', 'Real Betis', 'Real Madrid', 'Real Sociedad', 'Sevilla', 'Valencia', 'Villarreal'
    ],
    'LaLiga 2': ['Espanyol', 'Real Valladolid', 'Eibar'],
    'Bundesliga': [
        '1. FC Heidenheim', '1. FC Köln', 'Bayer Leverkusen', 'Borussia Dortmund', 'Borussia Mönchengladbach', 'Darmstadt 98', 'Eintracht Frankfurt', 'FC Augsburg', 'Bayern Munich', 'Mainz 05', 'RB Leipzig', 'SC Freiburg', 'TSG Hoffenheim', 'Union Berlin', 'VfB Stuttgart', 'VfL Bochum', 'VfL Wolfsburg', 'Werder Bremen'
    ],
    '2. Bundesliga': [
        'Eintracht Braunschweig', 'Fortuna Düsseldorf', 'Greuther Fürth', 'Hamburger SV', 'Hannover 96', 'Hansa Rostock', 'Hertha BSC', 'Holstein Kiel', 'Kaiserslautern', 'Karlsruher SC', 'Magdeburg', 'Nürnberg', 'Osnabrück', 'Paderborn', 'Schalke 04', 'St. Pauli', 'Wehen Wiesbaden'
    ],
    'Serie A': [
        'AC Milan', 'Atalanta', 'Bologna', 'Cagliari', 'Empoli', 'Fiorentina', 'Frosinone', 'Genoa', 'Hellas Verona', 'Inter Milan', 'Juventus', 'Lazio', 'Lecce', 'Monza', 'Napoli', 'Roma', 'Salernitana', 'Sassuolo', 'Torino', 'Udinese'
    ],
    'Serie B': [
        'Ascoli', 'Bari', 'Brescia', 'Catanzaro', 'Cittadella', 'Como', 'Cosenza', 'Cremonese', 'Feralpisalò', 'Lecco', 'Modena', 'Palermo', 'Parma', 'Pisa', 'Reggiana', 'Sampdoria', 'Spezia', 'Südtirol', 'Ternana', 'Venezia'
    ],
    'Ligue 1': [
        'AS Monaco', 'Brest', 'Clermont Foot', 'Le Havre', 'Lens', 'Lille', 'Lorient', 'Metz', 'Montpellier', 'Nantes', 'Nice', 'Olympique de Marseille', 'Olympique Lyonnais', 'Paris Saint-Germain', 'Reims', 'Rennes', 'Strasbourg', 'Toulouse'
    ],
    'Ligue 2': ['Saint-Étienne', 'Bordeaux', 'Angers'],
    'Liga Portugal': [
        'Arouca', 'Boavista', 'Braga', 'Casa Pia', 'Chaves', 'Estoril Praia', 'Estrela da Amadora', 'Famalicão', 'Farense', 'Gil Vicente', 'Moreirense', 'Portimonense', 'Rio Ave', 'SL Benfica', 'FC Porto', 'Sporting CP', 'Vitória de Guimarães', 'Vizela'
    ],
};

export const CLUBS: Record<string, Club> = {
    // England - Premier League
    'Arsenal': { id: 'Arsenal', name: 'Arsenal', kitColors: { primary: '#EF0107', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Aston Villa': { id: 'Aston Villa', name: 'Aston Villa', kitColors: { primary: '#670E36', secondary: '#95BFE5' }, pattern: 'plain' },
    'Bournemouth': { id: 'Bournemouth', name: 'Bournemouth', kitColors: { primary: '#DA291C', secondary: '#000000' }, pattern: 'stripes' },
    'Brentford': { id: 'Brentford', name: 'Brentford', kitColors: { primary: '#C8102E', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Brighton & Hove Albion': { id: 'Brighton & Hove Albion', name: 'Brighton & Hove Albion', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Burnley': { id: 'Burnley', name: 'Burnley', kitColors: { primary: '#6C1D45', secondary: '#99D6EA' }, pattern: 'plain' },
    'Chelsea': { id: 'Chelsea', name: 'Chelsea', kitColors: { primary: '#034694', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Crystal Palace': { id: 'Crystal Palace', name: 'Crystal Palace', kitColors: { primary: '#1B458F', secondary: '#C4122E' }, pattern: 'stripes' },
    'Everton': { id: 'Everton', name: 'Everton', kitColors: { primary: '#003399', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Fulham': { id: 'Fulham', name: 'Fulham', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Liverpool': { id: 'Liverpool', name: 'Liverpool', kitColors: { primary: '#C8102E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Luton Town': { id: 'Luton Town', name: 'Luton Town', kitColors: { primary: '#F78F1E', secondary: '#000054' }, pattern: 'plain' },
    'Manchester City': { id: 'Manchester City', name: 'Manchester City', kitColors: { primary: '#6CABDD', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Manchester United': { id: 'Manchester United', name: 'Manchester United', kitColors: { primary: '#DA291C', secondary: '#000000' }, pattern: 'plain' },
    'Newcastle United': { id: 'Newcastle United', name: 'Newcastle United', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Nottingham Forest': { id: 'Nottingham Forest', name: 'Nottingham Forest', kitColors: { primary: '#E53233', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Sheffield United': { id: 'Sheffield United', name: 'Sheffield United', kitColors: { primary: '#EE2737', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Tottenham Hotspur': { id: 'Tottenham Hotspur', name: 'Tottenham Hotspur', kitColors: { primary: '#FFFFFF', secondary: '#132257' }, pattern: 'plain' },
    'West Ham United': { id: 'West Ham United', name: 'West Ham United', kitColors: { primary: '#7A263A', secondary: '#1BB1E7' }, pattern: 'plain' },
    'Wolverhampton Wanderers': { id: 'Wolverhampton Wanderers', name: 'Wolverhampton Wanderers', kitColors: { primary: '#FDB913', secondary: '#231F20' }, pattern: 'plain' },

    // England - Championship
    'Birmingham City': { id: 'Birmingham City', name: 'Birmingham City', kitColors: { primary: '#003399', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Blackburn Rovers': { id: 'Blackburn Rovers', name: 'Blackburn Rovers', kitColors: { primary: '#FFFFFF', secondary: '#0057B8' }, pattern: 'hoops' },
    'Bristol City': { id: 'Bristol City', name: 'Bristol City', kitColors: { primary: '#E30613', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Cardiff City': { id: 'Cardiff City', name: 'Cardiff City', kitColors: { primary: '#0070B5', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Coventry City': { id: 'Coventry City', name: 'Coventry City', kitColors: { primary: '#87CEEB', secondary: '#000054' }, pattern: 'stripes' },
    'Huddersfield Town': { id: 'Huddersfield Town', name: 'Huddersfield Town', kitColors: { primary: '#0E63AD', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Hull City': { id: 'Hull City', name: 'Hull City', kitColors: { primary: '#F5A302', secondary: '#000000' }, pattern: 'stripes' },
    'Ipswich Town': { id: 'Ipswich Town', name: 'Ipswich Town', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Leeds United': { id: 'Leeds United', name: 'Leeds United', kitColors: { primary: '#FFFFFF', secondary: '#1D428A' }, pattern: 'plain' },
    'Leicester City': { id: 'Leicester City', name: 'Leicester City', kitColors: { primary: '#003090', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Middlesbrough': { id: 'Middlesbrough', name: 'Middlesbrough', kitColors: { primary: '#E30613', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Millwall': { id: 'Millwall', name: 'Millwall', kitColors: { primary: '#003399', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Norwich City': { id: 'Norwich City', name: 'Norwich City', kitColors: { primary: '#FFF200', secondary: '#00A65D' }, pattern: 'plain' },
    'Plymouth Argyle': { id: 'Plymouth Argyle', name: 'Plymouth Argyle', kitColors: { primary: '#006A4D', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Preston North End': { id: 'Preston North End', name: 'Preston North End', kitColors: { primary: '#FFFFFF', secondary: '#002D62' }, pattern: 'plain' },
    'Queens Park Rangers': { id: 'Queens Park Rangers', name: 'Queens Park Rangers', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Rotherham United': { id: 'Rotherham United', name: 'Rotherham United', kitColors: { primary: '#E30613', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Sheffield Wednesday': { id: 'Sheffield Wednesday', name: 'Sheffield Wednesday', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Southampton': { id: 'Southampton', name: 'Southampton', kitColors: { primary: '#D71920', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Stoke City': { id: 'Stoke City', name: 'Stoke City', kitColors: { primary: '#E03A3E', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Sunderland': { id: 'Sunderland', name: 'Sunderland', kitColors: { primary: '#EB172B', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Swansea City': { id: 'Swansea City', name: 'Swansea City', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Watford': { id: 'Watford', name: 'Watford', kitColors: { primary: '#FBEE23', secondary: '#ED2127' }, pattern: 'plain' },
    'West Bromwich Albion': { id: 'West Bromwich Albion', name: 'West Bromwich Albion', kitColors: { primary: '#FFFFFF', secondary: '#1D2F54' }, pattern: 'stripes' },

    // England - League One
    'Barnsley': { id: 'Barnsley', name: 'Barnsley', kitColors: { primary: '#D3141E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Blackpool': { id: 'Blackpool', name: 'Blackpool', kitColors: { primary: '#F68E1F', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Bolton Wanderers': { id: 'Bolton Wanderers', name: 'Bolton Wanderers', kitColors: { primary: '#FFFFFF', secondary: '#243e82' }, pattern: 'plain' },
    'Bristol Rovers': { id: 'Bristol Rovers', name: 'Bristol Rovers', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Burton Albion': { id: 'Burton Albion', name: 'Burton Albion', kitColors: { primary: '#FDD100', secondary: '#000000' }, pattern: 'plain' },
    'Cambridge United': { id: 'Cambridge United', name: 'Cambridge United', kitColors: { primary: '#FBB829', secondary: '#000000' }, pattern: 'plain' },
    'Carlisle United': { id: 'Carlisle United', name: 'Carlisle United', kitColors: { primary: '#003399', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Charlton Athletic': { id: 'Charlton Athletic', name: 'Charlton Athletic', kitColors: { primary: '#D3171E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Cheltenham Town': { id: 'Cheltenham Town', name: 'Cheltenham Town', kitColors: { primary: '#C71A21', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Derby County': { id: 'Derby County', name: 'Derby County', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Exeter City': { id: 'Exeter City', name: 'Exeter City', kitColors: { primary: '#EC1D25', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Fleetwood Town': { id: 'Fleetwood Town', name: 'Fleetwood Town', kitColors: { primary: '#E31B23', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Leyton Orient': { id: 'Leyton Orient', name: 'Leyton Orient', kitColors: { primary: '#ED1C24', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Lincoln City': { id: 'Lincoln City', name: 'Lincoln City', kitColors: { primary: '#E20A17', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Northampton Town': { id: 'Northampton Town', name: 'Northampton Town', kitColors: { primary: '#800000', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Oxford United': { id: 'Oxford United', name: 'Oxford United', kitColors: { primary: '#FFEB00', secondary: '#003399' }, pattern: 'plain' },
    'Peterborough United': { id: 'Peterborough United', name: 'Peterborough United', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Port Vale': { id: 'Port Vale', name: 'Port Vale', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Portsmouth': { id: 'Portsmouth', name: 'Portsmouth', kitColors: { primary: '#00448d', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Reading': { id: 'Reading', name: 'Reading', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Shrewsbury Town': { id: 'Shrewsbury Town', name: 'Shrewsbury Town', kitColors: { primary: '#0050A0', secondary: '#F7A700' }, pattern: 'stripes' },
    'Stevenage': { id: 'Stevenage', name: 'Stevenage', kitColors: { primary: '#E20A17', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Wigan Athletic': { id: 'Wigan Athletic', name: 'Wigan Athletic', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Wycombe Wanderers': { id: 'Wycombe Wanderers', name: 'Wycombe Wanderers', kitColors: { primary: '#87CEEB', secondary: '#001E50' }, pattern: 'hoops' },
    
    // England - League Two
    'AFC Wimbledon': { id: 'AFC Wimbledon', name: 'AFC Wimbledon', kitColors: { primary: '#002D62', secondary: '#FFD700' }, pattern: 'plain' },
    'Accrington Stanley': { id: 'Accrington Stanley', name: 'Accrington Stanley', kitColors: { primary: '#E21A21', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Barrow': { id: 'Barrow', name: 'Barrow', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Bradford City': { id: 'Bradford City', name: 'Bradford City', kitColors: { primary: '#800000', secondary: '#FFCC00' }, pattern: 'stripes' },
    'Colchester United': { id: 'Colchester United', name: 'Colchester United', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Crawley Town': { id: 'Crawley Town', name: 'Crawley Town', kitColors: { primary: '#E20A17', secondary: '#000000' }, pattern: 'plain' },
    'Crewe Alexandra': { id: 'Crewe Alexandra', name: 'Crewe Alexandra', kitColors: { primary: '#DD0A1E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Doncaster Rovers': { id: 'Doncaster Rovers', name: 'Doncaster Rovers', kitColors: { primary: '#D81921', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Forest Green Rovers': { id: 'Forest Green Rovers', name: 'Forest Green Rovers', kitColors: { primary: '#008751', secondary: '#000000' }, pattern: 'plain' },
    'Gillingham': { id: 'Gillingham', name: 'Gillingham', kitColors: { primary: '#0055A5', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Grimsby Town': { id: 'Grimsby Town', name: 'Grimsby Town', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Harrogate Town': { id: 'Harrogate Town', name: 'Harrogate Town', kitColors: { primary: '#FFDD00', secondary: '#000000' }, pattern: 'plain' },
    'Mansfield Town': { id: 'Mansfield Town', name: 'Mansfield Town', kitColors: { primary: '#FFC20E', secondary: '#002D62' }, pattern: 'plain' },
    'MK Dons': { id: 'MK Dons', name: 'MK Dons', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Morecambe': { id: 'Morecambe', name: 'Morecambe', kitColors: { primary: '#E20A17', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Newport County': { id: 'Newport County', name: 'Newport County', kitColors: { primary: '#FFC20E', secondary: '#000000' }, pattern: 'plain' },
    'Notts County': { id: 'Notts County', name: 'Notts County', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Salford City': { id: 'Salford City', name: 'Salford City', kitColors: { primary: '#DA291C', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Stockport County': { id: 'Stockport County', name: 'Stockport County', kitColors: { primary: '#00539f', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Sutton United': { id: 'Sutton United', name: 'Sutton United', kitColors: { primary: '#FFC20E', secondary: '#5A3A31' }, pattern: 'plain' },
    'Swindon Town': { id: 'Swindon Town', name: 'Swindon Town', kitColors: { primary: '#D71920', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Tranmere Rovers': { id: 'Tranmere Rovers', name: 'Tranmere Rovers', kitColors: { primary: '#FFFFFF', secondary: '#0055A5' }, pattern: 'plain' },
    'Walsall': { id: 'Walsall', name: 'Walsall', kitColors: { primary: '#E20A17', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Wrexham': { id: 'Wrexham', name: 'Wrexham', kitColors: { primary: '#E10600', secondary: '#FFFFFF' }, pattern: 'plain' },

    // England - National League
    'AFC Fylde': { id: 'AFC Fylde', name: 'AFC Fylde', kitColors: { primary: '#FFFFFF', secondary: '#00529B' }, pattern: 'plain' },
    'Aldershot Town': { id: 'Aldershot Town', name: 'Aldershot Town', kitColors: { primary: '#FF0000', secondary: '#0000FF' }, pattern: 'plain' },
    'Altrincham': { id: 'Altrincham', name: 'Altrincham', kitColors: { primary: '#DA291C', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Barnet': { id: 'Barnet', name: 'Barnet', kitColors: { primary: '#FFC107', secondary: '#000000' }, pattern: 'plain' },
    'Boreham Wood': { id: 'Boreham Wood', name: 'Boreham Wood', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Bromley': { id: 'Bromley', name: 'Bromley', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Chesterfield': { id: 'Chesterfield', name: 'Chesterfield', kitColors: { primary: '#0033A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Dagenham & Redbridge': { id: 'Dagenham & Redbridge', name: 'Dagenham & Redbridge', kitColors: { primary: '#D71920', secondary: '#0033A0' }, pattern: 'hoops' },
    'Dorking Wanderers': { id: 'Dorking Wanderers', name: 'Dorking Wanderers', kitColors: { primary: '#FF0000', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Eastleigh': { id: 'Eastleigh', name: 'Eastleigh', kitColors: { primary: '#004D98', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Ebbsfleet United': { id: 'Ebbsfleet United', name: 'Ebbsfleet United', kitColors: { primary: '#DA291C', secondary: '#FFFFFF' }, pattern: 'plain' },
    'FC Halifax Town': { id: 'FC Halifax Town', name: 'FC Halifax Town', kitColors: { primary: '#0053A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Gateshead': { id: 'Gateshead', name: 'Gateshead', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Hartlepool United': { id: 'Hartlepool United', name: 'Hartlepool United', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Kidderminster Harriers': { id: 'Kidderminster Harriers', name: 'Kidderminster Harriers', kitColors: { primary: '#E30613', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Maidenhead United': { id: 'Maidenhead United', name: 'Maidenhead United', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Oldham Athletic': { id: 'Oldham Athletic', name: 'Oldham Athletic', kitColors: { primary: '#1D5BA4', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Oxford City': { id: 'Oxford City', name: 'Oxford City', kitColors: { primary: '#003399', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Rochdale': { id: 'Rochdale', name: 'Rochdale', kitColors: { primary: '#0033A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Solihull Moors': { id: 'Solihull Moors', name: 'Solihull Moors', kitColors: { primary: '#FFC20E', secondary: '#004B8C' }, pattern: 'plain' },
    'Southend United': { id: 'Southend United', name: 'Southend United', kitColors: { primary: '#00448d', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Wealdstone': { id: 'Wealdstone', name: 'Wealdstone', kitColors: { primary: '#0033A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Woking': { id: 'Woking', name: 'Woking', kitColors: { primary: '#D71920', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'York City': { id: 'York City', name: 'York City', kitColors: { primary: '#DA291C', secondary: '#FFFFFF' }, pattern: 'plain' },
    
    // Spain - La Liga
    'Alavés': { id: 'Alavés', name: 'Alavés', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Almería': { id: 'Almería', name: 'Almería', kitColors: { primary: '#CD122D', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Athletic Bilbao': { id: 'Athletic Bilbao', name: 'Athletic Bilbao', kitColors: { primary: '#ED1C24', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Atlético Madrid': { id: 'Atlético Madrid', name: 'Atlético Madrid', kitColors: { primary: '#D90000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Barcelona': { id: 'Barcelona', name: 'Barcelona', kitColors: { primary: '#A50044', secondary: '#004D98' }, pattern: 'stripes' },
    'Cádiz': { id: 'Cádiz', name: 'Cádiz', kitColors: { primary: '#FFD700', secondary: '#003399' }, pattern: 'plain' },
    'Celta Vigo': { id: 'Celta Vigo', name: 'Celta Vigo', kitColors: { primary: '#87CEEB', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Getafe': { id: 'Getafe', name: 'Getafe', kitColors: { primary: '#0050A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Girona': { id: 'Girona', name: 'Girona', kitColors: { primary: '#ED1C24', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Granada': { id: 'Granada', name: 'Granada', kitColors: { primary: '#ED1C24', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Las Palmas': { id: 'Las Palmas', name: 'Las Palmas', kitColors: { primary: '#FFD700', secondary: '#0057B8' }, pattern: 'plain' },
    'Mallorca': { id: 'Mallorca', name: 'Mallorca', kitColors: { primary: '#ED1C24', secondary: '#000000' }, pattern: 'plain' },
    'Osasuna': { id: 'Osasuna', name: 'Osasuna', kitColors: { primary: '#C8102E', secondary: '#000054' }, pattern: 'plain' },
    'Rayo Vallecano': { id: 'Rayo Vallecano', name: 'Rayo Vallecano', kitColors: { primary: '#FFFFFF', secondary: '#ED1C24' }, pattern: 'plain' },
    'Real Betis': { id: 'Real Betis', name: 'Real Betis', kitColors: { primary: '#00A65D', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Real Madrid': { id: 'Real Madrid', name: 'Real Madrid', kitColors: { primary: '#FFFFFF', secondary: '#FEBE10' }, pattern: 'plain' },
    'Real Sociedad': { id: 'Real Sociedad', name: 'Real Sociedad', kitColors: { primary: '#0067B1', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Sevilla': { id: 'Sevilla', name: 'Sevilla', kitColors: { primary: '#FFFFFF', secondary: '#D4192C' }, pattern: 'plain' },
    'Valencia': { id: 'Valencia', name: 'Valencia', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Villarreal': { id: 'Villarreal', name: 'Villarreal', kitColors: { primary: '#FFD700', secondary: '#0057B8' }, pattern: 'plain' },
    
    // Spain - LaLiga 2
    'Espanyol': { id: 'Espanyol', name: 'Espanyol', kitColors: { primary: '#007fc8', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Real Valladolid': { id: 'Real Valladolid', name: 'Real Valladolid', kitColors: { primary: '#5B0A8C', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Eibar': { id: 'Eibar', name: 'Eibar', kitColors: { primary: '#9B1D2F', secondary: '#006FB7' }, pattern: 'stripes' },

    // Germany - Bundesliga
    '1. FC Heidenheim': { id: '1. FC Heidenheim', name: '1. FC Heidenheim', kitColors: { primary: '#E60020', secondary: '#004D9D' }, pattern: 'plain' },
    '1. FC Köln': { id: '1. FC Köln', name: '1. FC Köln', kitColors: { primary: '#FFFFFF', secondary: '#ED1C24' }, pattern: 'plain' },
    'Bayer Leverkusen': { id: 'Bayer Leverkusen', name: 'Bayer Leverkusen', kitColors: { primary: '#E32221', secondary: '#000000' }, pattern: 'plain' },
    'Borussia Dortmund': { id: 'Borussia Dortmund', name: 'Borussia Dortmund', kitColors: { primary: '#FDE100', secondary: '#000000' }, pattern: 'plain' },
    'Borussia Mönchengladbach': { id: 'Borussia Mönchengladbach', name: 'Borussia Mönchengladbach', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Darmstadt 98': { id: 'Darmstadt 98', name: 'Darmstadt 98', kitColors: { primary: '#004689', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Eintracht Frankfurt': { id: 'Eintracht Frankfurt', name: 'Eintracht Frankfurt', kitColors: { primary: '#000000', secondary: '#E1000F' }, pattern: 'plain' },
    'FC Augsburg': { id: 'FC Augsburg', name: 'FC Augsburg', kitColors: { primary: '#FFFFFF', secondary: '#BA1224' }, pattern: 'plain' },
    'Bayern Munich': { id: 'Bayern Munich', name: 'Bayern Munich', kitColors: { primary: '#DC052D', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Mainz 05': { id: 'Mainz 05', name: 'Mainz 05', kitColors: { primary: '#ED1B24', secondary: '#FFFFFF' }, pattern: 'plain' },
    'RB Leipzig': { id: 'RB Leipzig', name: 'RB Leipzig', kitColors: { primary: '#FFFFFF', secondary: '#DA0A14' }, pattern: 'plain' },
    'SC Freiburg': { id: 'SC Freiburg', name: 'SC Freiburg', kitColors: { primary: '#C90421', secondary: '#FFFFFF' }, pattern: 'plain' },
    'TSG Hoffenheim': { id: 'TSG Hoffenheim', name: 'TSG Hoffenheim', kitColors: { primary: '#1C63B7', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Union Berlin': { id: 'Union Berlin', name: 'Union Berlin', kitColors: { primary: '#ED1C24', secondary: '#FFFFFF' }, pattern: 'plain' },
    'VfB Stuttgart': { id: 'VfB Stuttgart', name: 'VfB Stuttgart', kitColors: { primary: '#FFFFFF', secondary: '#E30613' }, pattern: 'plain' },
    'VfL Bochum': { id: 'VfL Bochum', name: 'VfL Bochum', kitColors: { primary: '#00549F', secondary: '#FFFFFF' }, pattern: 'plain' },
    'VfL Wolfsburg': { id: 'VfL Wolfsburg', name: 'VfL Wolfsburg', kitColors: { primary: '#69B32E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Werder Bremen': { id: 'Werder Bremen', name: 'Werder Bremen', kitColors: { primary: '#1D9153', secondary: '#FFFFFF' }, pattern: 'plain' },

    // Germany - 2. Bundesliga
    'Eintracht Braunschweig': { id: 'Eintracht Braunschweig', name: 'Eintracht Braunschweig', kitColors: { primary: '#FFF200', secondary: '#004E95' }, pattern: 'plain' },
    'Fortuna Düsseldorf': { id: 'Fortuna Düsseldorf', name: 'Fortuna Düsseldorf', kitColors: { primary: '#E2051E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Greuther Fürth': { id: 'Greuther Fürth', name: 'Greuther Fürth', kitColors: { primary: '#FFFFFF', secondary: '#008D36' }, pattern: 'hoops' },
    'Hamburger SV': { id: 'Hamburger SV', name: 'Hamburger SV', kitColors: { primary: '#FFFFFF', secondary: '#d5000d' }, pattern: 'plain' },
    'Hannover 96': { id: 'Hannover 96', name: 'Hannover 96', kitColors: { primary: '#CE0000', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Hansa Rostock': { id: 'Hansa Rostock', name: 'Hansa Rostock', kitColors: { primary: '#00549F', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Hertha BSC': { id: 'Hertha BSC', name: 'Hertha BSC', kitColors: { primary: '#005ca9', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Holstein Kiel': { id: 'Holstein Kiel', name: 'Holstein Kiel', kitColors: { primary: '#004B8C', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Kaiserslautern': { id: 'Kaiserslautern', name: 'Kaiserslautern', kitColors: { primary: '#BE0027', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Karlsruher SC': { id: 'Karlsruher SC', name: 'Karlsruher SC', kitColors: { primary: '#00539F', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Magdeburg': { id: 'Magdeburg', name: 'Magdeburg', kitColors: { primary: '#00559F', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Nürnberg': { id: 'Nürnberg', name: 'Nürnberg', kitColors: { primary: '#9B1331', secondary: '#000000' }, pattern: 'plain' },
    'Osnabrück': { id: 'Osnabrück', name: 'Osnabrück', kitColors: { primary: '#8A004F', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Paderborn': { id: 'Paderborn', name: 'Paderborn', kitColors: { primary: '#0058A5', secondary: '#000000' }, pattern: 'plain' },
    'Schalke 04': { id: 'Schalke 04', name: 'Schalke 04', kitColors: { primary: '#004d9d', secondary: '#FFFFFF' }, pattern: 'plain' },
    'St. Pauli': { id: 'St. Pauli', name: 'St. Pauli', kitColors: { primary: '#593D2B', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Wehen Wiesbaden': { id: 'Wehen Wiesbaden', name: 'Wehen Wiesbaden', kitColors: { primary: '#DF0024', secondary: '#000000' }, pattern: 'stripes' },
    
    // Italy - Serie A
    'AC Milan': { id: 'AC Milan', name: 'AC Milan', kitColors: { primary: '#FB090B', secondary: '#000000' }, pattern: 'stripes' },
    'Atalanta': { id: 'Atalanta', name: 'Atalanta', kitColors: { primary: '#1E53A3', secondary: '#000000' }, pattern: 'stripes' },
    'Bologna': { id: 'Bologna', name: 'Bologna', kitColors: { primary: '#9F1D35', secondary: '#1B2D4F' }, pattern: 'stripes' },
    'Cagliari': { id: 'Cagliari', name: 'Cagliari', kitColors: { primary: '#EE242C', secondary: '#002D62' }, pattern: 'stripes' },
    'Empoli': { id: 'Empoli', name: 'Empoli', kitColors: { primary: '#005CB9', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Fiorentina': { id: 'Fiorentina', name: 'Fiorentina', kitColors: { primary: '#482E92', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Frosinone': { id: 'Frosinone', name: 'Frosinone', kitColors: { primary: '#FFF200', secondary: '#1E53A3' }, pattern: 'plain' },
    'Genoa': { id: 'Genoa', name: 'Genoa', kitColors: { primary: '#D52B1E', secondary: '#0039A6' }, pattern: 'stripes' },
    'Hellas Verona': { id: 'Hellas Verona', name: 'Hellas Verona', kitColors: { primary: '#002D62', secondary: '#FFD700' }, pattern: 'plain' },
    'Inter Milan': { id: 'Inter Milan', name: 'Inter Milan', kitColors: { primary: '#0068A8', secondary: '#000000' }, pattern: 'stripes' },
    'Juventus': { id: 'Juventus', name: 'Juventus', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'stripes' },
    'Lazio': { id: 'Lazio', name: 'Lazio', kitColors: { primary: '#87D2E5', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Lecce': { id: 'Lecce', name: 'Lecce', kitColors: { primary: '#FFD700', secondary: '#D52B1E' }, pattern: 'stripes' },
    'Monza': { id: 'Monza', name: 'Monza', kitColors: { primary: '#ED1C24', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Napoli': { id: 'Napoli', name: 'Napoli', kitColors: { primary: '#12A0D7', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Roma': { id: 'Roma', name: 'Roma', kitColors: { primary: '#970A2C', secondary: '#FFC500' }, pattern: 'plain' },
    'Salernitana': { id: 'Salernitana', name: 'Salernitana', kitColors: { primary: '#800020', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Sassuolo': { id: 'Sassuolo', name: 'Sassuolo', kitColors: { primary: '#008E55', secondary: '#000000' }, pattern: 'stripes' },
    'Torino': { id: 'Torino', name: 'Torino', kitColors: { primary: '#8A1E23', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Udinese': { id: 'Udinese', name: 'Udinese', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'stripes' },

    // Italy - Serie B
    'Ascoli': { id: 'Ascoli', name: 'Ascoli', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'stripes' },
    'Bari': { id: 'Bari', name: 'Bari', kitColors: { primary: '#FFFFFF', secondary: '#ED1C24' }, pattern: 'plain' },
    'Brescia': { id: 'Brescia', name: 'Brescia', kitColors: { primary: '#0057B8', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Catanzaro': { id: 'Catanzaro', name: 'Catanzaro', kitColors: { primary: '#FDB913', secondary: '#C8102E' }, pattern: 'stripes' },
    'Cittadella': { id: 'Cittadella', name: 'Cittadella', kitColors: { primary: '#800020', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Como': { id: 'Como', name: 'Como', kitColors: { primary: '#0033A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Cosenza': { id: 'Cosenza', name: 'Cosenza', kitColors: { primary: '#D71920', secondary: '#003399' }, pattern: 'stripes' },
    'Cremonese': { id: 'Cremonese', name: 'Cremonese', kitColors: { primary: '#ADABA4', secondary: '#E30613' }, pattern: 'plain' },
    'Feralpisalò': { id: 'Feralpisalò', name: 'Feralpisalò', kitColors: { primary: '#00945D', secondary: '#005EB8' }, pattern: 'hoops' },
    'Lecco': { id: 'Lecco', name: 'Lecco', kitColors: { primary: '#003882', secondary: '#87CEEB' }, pattern: 'plain' },
    'Modena': { id: 'Modena', name: 'Modena', kitColors: { primary: '#FFEB00', secondary: '#004B8C' }, pattern: 'plain' },
    'Palermo': { id: 'Palermo', name: 'Palermo', kitColors: { primary: '#F090A4', secondary: '#000000' }, pattern: 'plain' },
    'Parma': { id: 'Parma', name: 'Parma', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Pisa': { id: 'Pisa', name: 'Pisa', kitColors: { primary: '#000000', secondary: '#2C59A5' }, pattern: 'stripes' },
    'Reggiana': { id: 'Reggiana', name: 'Reggiana', kitColors: { primary: '#A50034', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Sampdoria': { id: 'Sampdoria', name: 'Sampdoria', kitColors: { primary: '#0052a2', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Spezia': { id: 'Spezia', name: 'Spezia', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Südtirol': { id: 'Südtirol', name: 'Südtirol', kitColors: { primary: '#FFFFFF', secondary: '#EB3323' }, pattern: 'plain' },
    'Ternana': { id: 'Ternana', name: 'Ternana', kitColors: { primary: '#DD1E2A', secondary: '#00843D' }, pattern: 'stripes' },
    'Venezia': { id: 'Venezia', name: 'Venezia', kitColors: { primary: '#000000', secondary: '#00AB50' }, pattern: 'plain' },
    
    // France
    'Angers': { id: 'Angers', name: 'Angers', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'AS Monaco': { id: 'AS Monaco', name: 'AS Monaco', kitColors: { primary: '#EF3340', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Bordeaux': { id: 'Bordeaux', name: 'Bordeaux', kitColors: { primary: '#001a4e', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Brest': { id: 'Brest', name: 'Brest', kitColors: { primary: '#E2051E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Clermont Foot': { id: 'Clermont Foot', name: 'Clermont Foot', kitColors: { primary: '#C8102E', secondary: '#0039A6' }, pattern: 'plain' },
    'Le Havre': { id: 'Le Havre', name: 'Le Havre', kitColors: { primary: '#00A3E0', secondary: '#001F3F' }, pattern: 'stripes' },
    'Lens': { id: 'Lens', name: 'Lens', kitColors: { primary: '#EF3340', secondary: '#FDB913' }, pattern: 'plain' },
    'Lille': { id: 'Lille', name: 'Lille', kitColors: { primary: '#E2051E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Lorient': { id: 'Lorient', name: 'Lorient', kitColors: { primary: '#FF8200', secondary: '#000000' }, pattern: 'plain' },
    'Metz': { id: 'Metz', name: 'Metz', kitColors: { primary: '#8B0D37', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Montpellier': { id: 'Montpellier', name: 'Montpellier', kitColors: { primary: '#00387B', secondary: '#F37321' }, pattern: 'plain' },
    'Nantes': { id: 'Nantes', name: 'Nantes', kitColors: { primary: '#FCB514', secondary: '#00A651' }, pattern: 'plain' },
    'Nice': { id: 'Nice', name: 'Nice', kitColors: { primary: '#D2122E', secondary: '#000000' }, pattern: 'stripes' },
    'Olympique de Marseille': { id: 'Olympique de Marseille', name: 'Olympique de Marseille', kitColors: { primary: '#FFFFFF', secondary: '#0098D7' }, pattern: 'plain' },
    'Olympique Lyonnais': { id: 'Olympique Lyonnais', name: 'Olympique Lyonnais', kitColors: { primary: '#FFFFFF', secondary: '#004D98' }, pattern: 'plain' },
    'Paris Saint-Germain': { id: 'Paris Saint-Germain', name: 'Paris Saint-Germain', kitColors: { primary: '#004170', secondary: '#DA291C' }, pattern: 'stripes' },
    'Reims': { id: 'Reims', name: 'Reims', kitColors: { primary: '#E2051E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Rennes': { id: 'Rennes', name: 'Rennes', kitColors: { primary: '#E2051E', secondary: '#000000' }, pattern: 'plain' },
    'Saint-Étienne': { id: 'Saint-Étienne', name: 'Saint-Étienne', kitColors: { primary: '#008e56', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Strasbourg': { id: 'Strasbourg', name: 'Strasbourg', kitColors: { primary: '#0050A0', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Toulouse': { id: 'Toulouse', name: 'Toulouse', kitColors: { primary: '#8A2BE2', secondary: '#FFFFFF' }, pattern: 'plain' },
    
    // Portugal
    'Arouca': { id: 'Arouca', name: 'Arouca', kitColors: { primary: '#FFD100', secondary: '#00387B' }, pattern: 'plain' },
    'Boavista': { id: 'Boavista', name: 'Boavista', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Braga': { id: 'Braga', name: 'Braga', kitColors: { primary: '#E03A3E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Casa Pia': { id: 'Casa Pia', name: 'Casa Pia', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Chaves': { id: 'Chaves', name: 'Chaves', kitColors: { primary: '#003E98', secondary: '#DA291C' }, pattern: 'stripes' },
    'Estoril Praia': { id: 'Estoril Praia', name: 'Estoril Praia', kitColors: { primary: '#FBE122', secondary: '#00529B' }, pattern: 'plain' },
    'Estrela da Amadora': { id: 'Estrela da Amadora', name: 'Estrela da Amadora', kitColors: { primary: '#008453', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Famalicão': { id: 'Famalicão', name: 'Famalicão', kitColors: { primary: '#FFFFFF', secondary: '#1D3557' }, pattern: 'plain' },
    'Farense': { id: 'Farense', name: 'Farense', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Gil Vicente': { id: 'Gil Vicente', name: 'Gil Vicente', kitColors: { primary: '#C8102E', secondary: '#FFFFFF' }, pattern: 'plain' },
    'Moreirense': { id: 'Moreirense', name: 'Moreirense', kitColors: { primary: '#FFFFFF', secondary: '#009351' }, pattern: 'hoops' },
    'Portimonense': { id: 'Portimonense', name: 'Portimonense', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Rio Ave': { id: 'Rio Ave', name: 'Rio Ave', kitColors: { primary: '#FFFFFF', secondary: '#008453' }, pattern: 'stripes' },
    'SL Benfica': { id: 'SL Benfica', name: 'SL Benfica', kitColors: { primary: '#E50000', secondary: '#FFFFFF' }, pattern: 'plain' },
    'FC Porto': { id: 'FC Porto', name: 'FC Porto', kitColors: { primary: '#004284', secondary: '#FFFFFF' }, pattern: 'stripes' },
    'Sporting CP': { id: 'Sporting CP', name: 'Sporting CP', kitColors: { primary: '#008453', secondary: '#FFFFFF' }, pattern: 'hoops' },
    'Vitória de Guimarães': { id: 'Vitória de Guimarães', name: 'Vitória de Guimarães', kitColors: { primary: '#FFFFFF', secondary: '#000000' }, pattern: 'plain' },
    'Vizela': { id: 'Vizela', name: 'Vizela', kitColors: { primary: '#87CEEB', secondary: '#FFFFFF' }, pattern: 'plain' },

    // Serbia
    'FK Crvena zvezda': { id: 'FK Crvena zvezda', name: 'FK Crvena zvezda', kitColors: { primary: '#FF0000', secondary: '#FFFFFF' }, pattern: 'stripes' },

    // Brazil
    'Vasco da Gama': { id: 'Vasco da Gama', name: 'Vasco da Gama', kitColors: { primary: '#000000', secondary: '#FFFFFF' }, pattern: 'plain' },

    // Other
    'West Cambourne FC': { id: 'West Cambourne FC', name: 'West Cambourne FC', kitColors: { primary: '#5e2a96', secondary: '#FFFFFF' }, pattern: 'plain' },
};


export const GOALKEEPER_KITS = [
    { primary: '#fde047', secondary: '#1f2937' }, // Yellow
    { primary: '#4ade80', secondary: '#1f2937' }, // Green
    { primary: '#f472b6', secondary: '#1f2937' }, // Pink
];

export const POSITIONS = ['GK', 'DR', 'DL', 'DC', 'WBR', 'WBL', 'DM', 'MR', 'ML', 'MC', 'AMR', 'AML', 'AMC', 'ST'];

export const HONOUR_TYPES: { label: string, options: { value: HonourType, label: string }[] }[] = [
    {
        label: "Team Honours",
        options: [
            { value: 'league', label: 'Domestic League Title' },
            { value: 'domestic_cup', label: 'Domestic Cup' },
            { value: 'continental_cup', label: 'Continental Cup' },
            { value: 'intercontinental_cup', label: 'Intercontinental Cup' },
            { value: 'international_trophy', label: 'International Trophy' },
            { value: 'friendly_cup', label: 'Friendly Trophy' },
        ]
    },
    {
        label: "Personal Awards",
        options: [
            { value: 'personal_global', label: 'Global Award' },
            { value: 'personal_national', label: 'National Award (International)' },
            { value: 'personal_domestic', label: 'Domestic Award (Club)' },
        ]
    }
];

export const HONOURS: Honour[] = [
    // Leagues
    { id: 'prem', name: 'Premier League', type: 'league' },
    { id: 'championship', name: 'Championship', type: 'league' },
    { id: 'leagueone', name: 'League One', type: 'league' },
    { id: 'leaguetwo', name: 'League Two', type: 'league' },
    { id: 'laliga', name: 'La Liga', type: 'league' },
    { id: 'laliga2', name: 'LaLiga 2', type: 'league' },
    { id: 'bundesliga', name: 'Bundesliga', type: 'league' },
    { id: 'bundesliga2', name: '2. Bundesliga', type: 'league' },
    { id: 'seriea', name: 'Serie A', type: 'league' },
    { id: 'serieb', name: 'Serie B', type: 'league' },
    { id: 'ligue1', name: 'Ligue 1', type: 'league' },
    { id: 'ligue2', name: 'Ligue 2', type: 'league' },

    // Domestic Cups
    { id: 'facup', name: 'FA Cup', type: 'domestic_cup' },
    { id: 'carabao', name: 'Carabao Cup', type: 'domestic_cup' },
    { id: 'communityshield', name: 'Community Shield', type: 'domestic_cup' },
    { id: 'copadelrey', name: 'Copa Del Rey', type: 'domestic_cup' },
    { id: 'supercopa_espana', name: 'Supercopa de España', type: 'domestic_cup' },
    { id: 'dfbpokal', name: 'DFB-Pokal', type: 'domestic_cup' },
    { id: 'dfl_supercup', name: 'DFL-Supercup', type: 'domestic_cup' },
    { id: 'coppaitalia', name: 'Coppa Italia', type: 'domestic_cup' },
    { id: 'supercoppa_italiana', name: 'Supercoppa Italiana', type: 'domestic_cup' },
    { id: 'coupedefrance', name: 'Coupe de France', type: 'domestic_cup' },
    { id: 'trophee_champions', name: 'Trophée des Champions', type: 'domestic_cup' },

    // Continental Cups
    { id: 'ucl', name: 'Champions League', type: 'continental_cup' },
    { id: 'uel', name: 'Europa League', type: 'continental_cup' },
    { id: 'uecl', name: 'Conference League', type: 'continental_cup' },
    { id: 'uefa_super_cup', name: 'UEFA Super Cup', type: 'continental_cup' },

    // Intercontinental Cups
    { id: 'club_wc', name: 'Club World Cup', type: 'intercontinental_cup' },

    // International Trophies
    { id: 'wc', name: 'World Cup', type: 'international_trophy' },
    { id: 'euros', name: 'Euros', type: 'international_trophy' },
    { id: 'afcon', name: 'AFCON', type: 'international_trophy' },
    { id: 'copa_america', name: 'Copa America', type: 'international_trophy' },
    
    // Friendly
    { id: 'friendly_cup', name: 'Pre-season Shield', type: 'friendly_cup' },
    
    // Personal Awards
    { id: 'ballondor', name: 'Ballon d\'Or', type: 'personal_global' },
    { id: 'world_player_of_year', name: 'World Player of the Year', type: 'personal_global' },
    { id: 'world_footballer_of_year', name: 'World Footballer of the Year', type: 'personal_global' },
    { id: 'goldenboot', name: 'European Golden Boot', type: 'personal_global' },
    { id: 'poty', name: 'Player of the Year', type: 'personal_domestic' },
    { id: 'ppoty', name: 'Players Player of the Year', type: 'personal_domestic' },
    { id: 'ypoty', name: 'Young Player of the Year', type: 'personal_domestic' },
    { id: 'apoy', name: 'African Player of the Year', type: 'personal_global' },
    
    // Manager Awards
    { id: 'moty', name: 'Manager of the Year', type: 'personal_domestic', isManagerOnly: true },
    { id: 'motm', name: 'Manager of the Month', type: 'personal_domestic', isManagerOnly: true, isCountable: true },
];

export const HONOUR_IMPORTANCE: Record<string, number> = {
  // Global Personal
  'ballondor': 1,
  'world_player_of_year': 1,
  'world_footballer_of_year': 1,
  
  // International
  'wc': 2,
  
  // Continental Club
  'ucl': 3,

  // International Continental
  'euros': 4,
  'copa_america': 4,
  
  // Domestic League
  'prem': 5,
  'laliga': 5,
  'bundesliga': 5,
  'seriea': 5,
  'ligue1': 5,
  
  // Continental Personal
  'goldenboot': 6,
  'apoy': 6,
  
  // Domestic Personal
  'poty': 7,
  'ppoty': 8,
  'moty': 8,

  // Domestic Cup
  'facup': 8,
  'copadelrey': 8,
  'dfbpokal': 8,
  'coppaitalia': 8,
  'coupedefrance': 8,

  // Lesser Continental Club
  'uel': 8,
  'club_wc': 8,

  // Lesser International
  'afcon': 8,
  
  // Domestic Personal
  'ypoty': 9,

  // Lesser Domestic Cup
  'carabao': 10,
  'motm': 10,

  // Super Cups
  'uefa_super_cup': 11,
  'communityshield': 12,
  'supercopa_espana': 12,
  'dfl_supercup': 12,
  'supercoppa_italiana': 12,
  'trophee_champions': 12,
  
  // Even Lesser Continental Club
  'uecl': 13,
  
  // Lower Leagues
  'championship': 14,
  'leaguetwo': 16,
  'leagueone': 15,
  'laliga2': 14,
  'bundesliga2': 14,
  'serieb': 14,
  'ligue2': 14,
  
  // Friendly
  'friendly_cup': 99,
};

export const TROPHY_CABINET_TEXTURES: Record<string, string> = {
    'Dark Wood': 'https://www.transparenttextures.com/patterns/wood-pattern.png',
};

export const LEAGUE_TO_NATION_MAP: Record<string, string> = {
    'Premier League': 'England',
    'Championship': 'England',
    'League One': 'England',
    'League Two': 'England',
    'La Liga': 'Spain',
    'LaLiga 2': 'Spain',
    'Bundesliga': 'Germany',
    '2. Bundesliga': 'Germany',
    'Serie A': 'Italy',
    'Serie B': 'Italy',
    'Ligue 1': 'France',
    'Ligue 2': 'France',
    'Serbian SuperLiga': 'Serbia',
    'Brasileirão': 'Brazil',
    'Liga Portugal': 'Portugal',
};

export const FORMATIONS: Record<string, FormationPosition[]> = {
    '4-4-2': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'MR', top: '50%', left: '85%' },
        { position: 'MCR', top: '55%', left: '60%' },
        { position: 'MCL', top: '55%', left: '40%' },
        { position: 'ML', top: '50%', left: '15%' },
        { position: 'STCR', top: '25%', left: '60%' },
        { position: 'STCL', top: '25%', left: '40%' },
    ],
    '4-3-3': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'MCR', top: '55%', left: '70%' },
        { position: 'MC', top: '60%', left: '50%' },
        { position: 'MCL', top: '55%', left: '30%' },
        { position: 'AMR', top: '28%', left: '85%' },
        { position: 'ST', top: '22%', left: '50%' },
        { position: 'AML', top: '28%', left: '15%' },
    ],
    '4-2-3-1': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'DMCR', top: '65%', left: '65%' },
        { position: 'DMCL', top: '65%', left: '35%' },
        { position: 'AMR', top: '40%', left: '85%' },
        { position: 'AMC', top: '40%', left: '50%' },
        { position: 'AML', top: '40%', left: '15%' },
        { position: 'ST', top: '22%', left: '50%' },
    ],
    '3-5-2': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DCR', top: '80%', left: '70%' },
        { position: 'DC', top: '82%', left: '50%' },
        { position: 'DCL', top: '80%', left: '30%' },
        { position: 'WBR', top: '50%', left: '90%' },
        { position: 'MCR', top: '55%', left: '65%' },
        { position: 'MC', top: '60%', left: '50%' },
        { position: 'MCL', top: '55%', left: '35%' },
        { position: 'WBL', top: '50%', left: '10%' },
        { position: 'STCR', top: '25%', left: '60%' },
        { position: 'STCL', top: '25%', left: '40%' },
    ],
    '5-3-2': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'WBR', top: '75%', left: '90%' },
        { position: 'DCR', top: '80%', left: '70%' },
        { position: 'DC', top: '82%', left: '50%' },
        { position: 'DCL', top: '80%', left: '30%' },
        { position: 'WBL', top: '75%', left: '10%' },
        { position: 'MCR', top: '55%', left: '70%' },
        { position: 'MC', top: '60%', left: '50%' },
        { position: 'MCL', top: '55%', left: '30%' },
        { position: 'STCR', top: '25%', left: '60%' },
        { position: 'STCL', top: '25%', left: '40%' },
    ],
    '4-4-2 Diamond': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'DM', top: '68%', left: '50%' },
        { position: 'MR', top: '50%', left: '75%' },
        { position: 'ML', top: '50%', left: '25%' },
        { position: 'AMC', top: '40%', left: '50%' },
        { position: 'STCR', top: '25%', left: '60%' },
        { position: 'STCL', top: '25%', left: '40%' },
    ],
    '4-1-2-1-2 Wide': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'DM', top: '68%', left: '50%' },
        { position: 'MR', top: '50%', left: '85%' },
        { position: 'ML', top: '50%', left: '15%' },
        { position: 'AMC', top: '40%', left: '50%' },
        { position: 'STCR', top: '25%', left: '60%' },
        { position: 'STCL', top: '25%', left: '40%' },
    ],
    '3-4-3': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DCR', top: '80%', left: '70%' },
        { position: 'DC', top: '82%', left: '50%' },
        { position: 'DCL', top: '80%', left: '30%' },
        { position: 'MR', top: '50%', left: '80%' },
        { position: 'MCR', top: '55%', left: '60%' },
        { position: 'MCL', top: '55%', left: '40%' },
        { position: 'ML', top: '50%', left: '20%' },
        { position: 'AMR', top: '28%', left: '85%' },
        { position: 'ST', top: '22%', left: '50%' },
        { position: 'AML', top: '28%', left: '15%' },
    ],
    '4-5-1': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'MR', top: '50%', left: '88%' },
        { position: 'MCR', top: '55%', left: '65%' },
        { position: 'MC', top: '60%', left: '50%' },
        { position: 'MCL', top: '55%', left: '35%' },
        { position: 'ML', top: '50%', left: '12%' },
        { position: 'ST', top: '25%', left: '50%' },
    ],
    '5-2-3': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'WBR', top: '75%', left: '90%' },
        { position: 'DCR', top: '80%', left: '70%' },
        { position: 'DC', top: '82%', left: '50%' },
        { position: 'DCL', top: '80%', left: '30%' },
        { position: 'WBL', top: '75%', left: '10%' },
        { position: 'MCR', top: '55%', left: '65%' },
        { position: 'MCL', top: '55%', left: '35%' },
        { position: 'AMR', top: '28%', left: '85%' },
        { position: 'ST', top: '22%', left: '50%' },
        { position: 'AML', top: '28%', left: '15%' },
    ],
    '4-2-4': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'MC_R', top: '55%', left: '65%' },
        { position: 'MC_L', top: '55%', left: '35%' },
        { position: 'AMR', top: '30%', left: '90%' },
        { position: 'STCR', top: '25%', left: '60%' },
        { position: 'STCL', top: '25%', left: '40%' },
        { position: 'AML', top: '30%', left: '10%' },
    ],
    '4-3-2-1 (Christmas Tree)': [
        { position: 'GK', top: '94%', left: '50%' },
        { position: 'DR', top: '75%', left: '88%' },
        { position: 'DCR', top: '78%', left: '65%' },
        { position: 'DCL', top: '78%', left: '35%' },
        { position: 'DL', top: '75%', left: '12%' },
        { position: 'MCR', top: '60%', left: '70%' },
        { position: 'MC', top: '65%', left: '50%' },
        { position: 'MCL', top: '60%', left: '30%' },
        { position: 'AMCR', top: '45%', left: '60%' },
        { position: 'AMCL', top: '45%', left: '40%' },
        { position: 'ST', top: '25%', left: '50%' },
    ],
};

export const getHonourInfo = (honourId: string, allHonours: Honour[]): Honour | undefined => {
    return allHonours.find(h => h.id === honourId);
};

export const defaultAttributes: Attributes = {
  corners: 10, crossing: 10, dribbling: 10, finishing: 10, firstTouch: 10, freeKickTaking: 10, heading: 10, longShots: 10, longThrows: 10, marking: 10, passing: 10, penaltyTaking: 10, tackling: 10, technique: 10,
  aggression: 10, anticipation: 10, bravery: 10, composure: 10, concentration: 10, decisions: 10, determination: 10, flair: 10, leadership: 10, offTheBall: 10, positioning: 10, teamwork: 10, vision: 10, workRate: 10,
  acceleration: 10, agility: 10, balance: 10, jumpingReach: 10, naturalFitness: 10, pace: 10, stamina: 10, strength: 10,
  aerialReach: 10, commandOfArea: 10, communication: 10, eccentricity: 10, handling: 10, kicking: 10, oneOnOnes: 10, punching: 10, reflexes: 10, rushingOut: 10, throwing: 10,
};

export const createNewPlayer = (defaultSaveGame: string, username: string): Player => {
    const initialAttributes = { ...defaultAttributes };
    return {
        id: uuidv4(),
        firstName: 'New',
        lastName: 'Player',
        knownAs: '',
        dateOfBirth: '2008-01-01',
        squadNumber: 99,
        nationality: 'England',
        primaryPosition: 'ST',
        currentClub: '',
        fmVersion: 'FM25',
        isRegen: false,
        isYouthIntake: false,
        isImported: false,
        saveGameName: defaultSaveGame,
        hasKnownAttributes: true,
        isFavourite: false,
        internationalCaps: 0,
        internationalGoals: 0,
        currentValue: 0,
        clubHistory: [],
        seasonStats: [],
        attributes: initialAttributes,
        attributeSnapshots: [{ id: uuidv4(), date: new Date().toISOString().split('T')[0], attributes: initialAttributes, value: 0 }],
        originalManager: username,
        imageUrl: undefined,
        facepackId: undefined,
        customTags: [],
    };
};

export const outfieldAttributeGroups = {
  Technical: ['Corners', 'Crossing', 'Dribbling', 'Finishing', 'First Touch', 'Free Kick Taking', 'Heading', 'Long Shots', 'Long Throws', 'Marking', 'Passing', 'Penalty Taking', 'Tackling', 'Technique'],
  Mental: ['Aggression', 'Anticipation', 'Bravery', 'Composure', 'Concentration', 'Decisions', 'Determination', 'Flair', 'Leadership', 'Off The Ball', 'Positioning', 'Teamwork', 'Vision', 'Work Rate'],
  Physical: ['Acceleration', 'Agility', 'Balance', 'Jumping Reach', 'Natural Fitness', 'Pace', 'Stamina', 'Strength'],
};

export const goalkeeperAttributeGroups = {
    Goalkeeping: ['Aerial Reach', 'Command Of Area', 'Communication', 'Eccentricity', 'First Touch', 'Handling', 'Kicking', 'One On Ones', 'Passing', 'Punching (Tendency)', 'Reflexes', 'Rushing Out', 'Throwing'],
    Mental: ['Aggression', 'Anticipation', 'Bravery', 'Composure', 'Concentration', 'Decisions', 'Determination', 'Flair', 'Leadership', 'Off The Ball', 'Positioning', 'Teamwork', 'Vision', 'Work Rate'],
    Physical: ['Acceleration', 'Agility', 'Balance', 'Jumping Reach', 'Natural Fitness', 'Pace', 'Stamina', 'Strength'],
};


// Manager Constants
export const COACHING_BADGES: readonly string[] = ['None', 'National C', 'National B', 'National A', 'Continental C', 'Continental B', 'Continental A', 'Continental Pro'];
export const MANAGER_STYLES: readonly string[] = ['Tracksuit', 'Suit and Tie'];

export const defaultManagerAttributes: ManagerAttributes = {
    attacking: 10,
    defending: 10,
    tactical: 10,
    technical: 10,
    mental: 10,
    workingWithYoungsters: 10,
    manManagement: 10,
    determination: 10,
    levelOfDiscipline: 10,
    adaptability: 10,
};

export const managerAttributeGroups = {
    Coaching: ['Attacking', 'Defending', 'Tactical', 'Technical', 'Mental', 'Working With Youngsters'],
    Mental: ['Man Management', 'Determination', 'Level Of Discipline', 'Adaptability'],
};

export const createNewManager = (defaultSaveGame: string, username: string): Manager => ({
    id: uuidv4(),
    firstName: 'New',
    lastName: 'Manager',
    knownAs: '',
    nationality: 'England',
    currentClub: '',
    fmVersion: 'FM25',
    saveGameName: defaultSaveGame,
    coachingBadge: 'Continental Pro',
    managerStyle: 'Tracksuit',
    isFavourite: false,
    isImported: false,
    clubHistory: [],
    seasonStats: [],
    attributes: { ...defaultManagerAttributes },
    originalManager: username,
});

export const keyAttributesByRole: Record<string, (keyof Attributes)[]> = {
    GK: ['aerialReach', 'commandOfArea', 'communication', 'eccentricity', 'handling', 'kicking', 'oneOnOnes', 'punching', 'reflexes', 'rushingOut', 'throwing', 'anticipation', 'decisions', 'positioning'],
    DC: ['heading', 'marking', 'tackling', 'positioning', 'strength', 'jumpingReach', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions'],
    DL: ['crossing', 'marking', 'tackling', 'passing', 'workRate', 'stamina', 'pace', 'acceleration', 'positioning', 'anticipation', 'decisions'],
    DR: ['crossing', 'marking', 'tackling', 'passing', 'workRate', 'stamina', 'pace', 'acceleration', 'positioning', 'anticipation', 'decisions'],
    WBL: ['crossing', 'dribbling', 'passing', 'tackling', 'workRate', 'stamina', 'pace', 'acceleration', 'offTheBall', 'flair'],
    WBR: ['crossing', 'dribbling', 'passing', 'tackling', 'workRate', 'stamina', 'pace', 'acceleration', 'offTheBall', 'flair'],
    DM: ['tackling', 'passing', 'workRate', 'stamina', 'strength', 'positioning', 'teamwork', 'decisions', 'concentration', 'anticipation'],
    MC: ['firstTouch', 'passing', 'technique', 'vision', 'teamwork', 'workRate', 'decisions', 'offTheBall', 'composure'],
    ML: ['crossing', 'dribbling', 'passing', 'technique', 'workRate', 'pace', 'acceleration', 'offTheBall', 'flair'],
    MR: ['crossing', 'dribbling', 'passing', 'technique', 'workRate', 'pace', 'acceleration', 'offTheBall', 'flair'],
    AMC: ['dribbling', 'finishing', 'firstTouch', 'passing', 'technique', 'vision', 'flair', 'offTheBall', 'composure', 'acceleration'],
    AML: ['crossing', 'dribbling', 'finishing', 'firstTouch', 'technique', 'pace', 'acceleration', 'flair', 'offTheBall'],
    AMR: ['crossing', 'dribbling', 'finishing', 'firstTouch', 'technique', 'pace', 'acceleration', 'flair', 'offTheBall'],
    ST: ['finishing', 'dribbling', 'firstTouch', 'heading', 'technique', 'composure', 'offTheBall', 'pace', 'acceleration', 'strength'],
};

export const CURRENCIES: Record<CurrencyOption, { symbol: string, name: string }> = {
    'GBP': { symbol: '£', name: 'Pound Sterling' },
    'USD': { symbol: '$', name: 'US Dollar' },
    'EUR': { symbol: '€', name: 'Euro' },
    'BRL': { symbol: 'R$', name: 'Brazilian Real' },
    'JPY': { symbol: '¥', name: 'Japanese Yen' },
    'AUD': { symbol: 'A$', name: 'Australian Dollar' },
    'CAD': { symbol: 'C$', name: 'Canadian Dollar' },
};

export const getCurrencySymbol = (currency: CurrencyOption): string => {
    return CURRENCIES[currency]?.symbol || '£';
};