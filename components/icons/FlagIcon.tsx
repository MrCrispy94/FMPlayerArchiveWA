

import React from 'react';

interface FlagData {
  pattern: 'bi-horizontal' | 'bi-vertical' | 'tri-horizontal' | 'tri-vertical' | 'scandinavian-cross' | 'centered-cross' | 'saltire' | 'special-japan' | 'special-nepal' | 'special-brazil' | 'special-usa' | 'special-colombia' | 'special-uruguay' | 'special-nz' | 'special-aus' | 'default';
  colors: string[];
}

// Data for rendering various world flags with specific patterns and colors.
const countryFlagData: Record<string, FlagData> = {
    // Europe
    'Albania': { pattern: 'bi-horizontal', colors: ['#FF0000', '#000000'] }, // Simplified
    'Andorra': { pattern: 'tri-vertical', colors: ['#103C8A', '#FEDD00', '#D50032'] },
    'Armenia': { pattern: 'tri-horizontal', colors: ['#D90012', '#0033A0', '#F2A800'] },
    'Austria': { pattern: 'tri-horizontal', colors: ['#ED2939', '#FFFFFF', '#ED2939'] },
    'Azerbaijan': { pattern: 'tri-horizontal', colors: ['#00B5E2', '#ED2939', '#00A551']},
    'Belarus': { pattern: 'bi-horizontal', colors: ['#CF101A', '#007D2C'] }, // Simplified
    'Belgium': { pattern: 'tri-vertical', colors: ['#000000', '#FAE042', '#ED2939'] },
    'Bosnia and Herzegovina': { pattern: 'bi-vertical', colors: ['#002395', '#FFCD00'] }, // Simplified
    'Bulgaria': { pattern: 'tri-horizontal', colors: ['#FFFFFF', '#00966E', '#D62612'] },
    'Croatia': { pattern: 'tri-horizontal', colors: ['#FF0000', '#FFFFFF', '#0033CC'] },
    'Cyprus': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#D47600'] }, // Simplified
    'Czech Republic': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#D7141A'] }, // Simplified
    'Denmark': { pattern: 'scandinavian-cross', colors: ['#C60C30', '#FFFFFF'] },
    'England': { pattern: 'centered-cross', colors: ['#FFFFFF', '#CE1124'] },
    'Estonia': { pattern: 'tri-horizontal', colors: ['#4891D9', '#000000', '#FFFFFF'] },
    'Faroe Islands': { pattern: 'scandinavian-cross', colors: ['#FFFFFF', '#003897', '#ED2939']},
    'Finland': { pattern: 'scandinavian-cross', colors: ['#FFFFFF', '#003580'] },
    'France': { pattern: 'tri-vertical', colors: ['#002395', '#FFFFFF', '#ED2939'] },
    'Georgia': { pattern: 'centered-cross', colors: ['#FFFFFF', '#FF0000']}, // Simplified
    'Germany': { pattern: 'tri-horizontal', colors: ['#000000', '#DD0000', '#FFCE00'] },
    'Gibraltar': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#CE1124']}, // Simplified
    'Greece': { pattern: 'bi-horizontal', colors: ['#0D5EAF', '#FFFFFF'] }, // Simplified
    'Hungary': { pattern: 'tri-horizontal', colors: ['#CE2939', '#FFFFFF', '#477050'] },
    'Iceland': { pattern: 'scandinavian-cross', colors: ['#02529C', '#FFFFFF', '#DC1E35'] },
    'Ireland': { pattern: 'tri-vertical', colors: ['#169B62', '#FFFFFF', '#FF883E'] },
    'Italy': { pattern: 'tri-vertical', colors: ['#009246', '#FFFFFF', '#CE2B37'] },
    'Kazakhstan': { pattern: 'bi-horizontal', colors: ['#00AFCA', '#FCE300']},
    'Kosovo': { pattern: 'bi-horizontal', colors: ['#244AA5', '#D0A650']},
    'Latvia': { pattern: 'tri-horizontal', colors: ['#9E3039', '#FFFFFF', '#9E3039'] }, // Proportions simplified
    'Liechtenstein': { pattern: 'bi-horizontal', colors: ['#002B7F', '#CE1126']},
    'Lithuania': { pattern: 'tri-horizontal', colors: ['#FDB913', '#006A44', '#C1272D'] },
    'Luxembourg': { pattern: 'tri-horizontal', colors: ['#EF3340', '#FFFFFF', '#00A1DE'] },
    'Malta': { pattern: 'bi-vertical', colors: ['#FFFFFF', '#C73636']},
    'Moldova': { pattern: 'tri-vertical', colors: ['#0047AB', '#FFD100', '#CC092F']},
    'Monaco': { pattern: 'bi-horizontal', colors: ['#CE1126', '#FFFFFF']},
    'Montenegro': { pattern: 'bi-horizontal', colors: ['#C40308', '#D4AF37']},
    'Netherlands': { pattern: 'tri-horizontal', colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
    'North Macedonia': { pattern: 'bi-horizontal', colors: ['#D20000', '#FFE600']},
    'Northern Ireland': { pattern: 'centered-cross', colors: ['#FFFFFF', '#E40011'] }, // Simplified
    'Norway': { pattern: 'scandinavian-cross', colors: ['#EF2B2D', '#FFFFFF', '#00205B'] },
    'Poland': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#DC143C'] },
    'Portugal': { pattern: 'bi-vertical', colors: ['#006600', '#FF0000'] }, // Proportions simplified
    'Romania': { pattern: 'tri-vertical', colors: ['#002B7F', '#FCD116', '#CE1126'] },
    'Russia': { pattern: 'tri-horizontal', colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
    'San Marino': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#73C2FB']},
    'Scotland': { pattern: 'saltire', colors: ['#005EB8', '#FFFFFF'] },
    'Serbia': { pattern: 'tri-horizontal', colors: ['#C6363C', '#0C4076', '#FFFFFF'] },
    'Slovakia': { pattern: 'tri-horizontal', colors: ['#FFFFFF', '#0B4EA2', '#EE1C25'] },
    'Slovenia': { pattern: 'tri-horizontal', colors: ['#FFFFFF', '#0066CC', '#FF0000'] },
    'Spain': { pattern: 'tri-horizontal', colors: ['#AA151B', '#F1B517', '#AA151B'] }, // Proportions simplified
    'Sweden': { pattern: 'scandinavian-cross', colors: ['#006AA7', '#FECC02'] },
    'Switzerland': { pattern: 'centered-cross', colors: ['#FF0000', '#FFFFFF'] },
    'Turkey': { pattern: 'special-japan', colors: ['#E30A17', '#FFFFFF'] }, // Simplified to circle on red
    'Ukraine': { pattern: 'bi-horizontal', colors: ['#0057B7', '#FFD700'] },
    'Wales': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#00B140'] }, // Simplified

    // Africa
    'Algeria': { pattern: 'bi-vertical', colors: ['#006233', '#FFFFFF'] },
    'Angola': { pattern: 'bi-horizontal', colors: ['#C8102E', '#000000']},
    'Benin': { pattern: 'bi-horizontal', colors: ['#FCD116', '#E8112D']},
    'Botswana': { pattern: 'tri-horizontal', colors: ['#75AADB', '#FFFFFF', '#000000']},
    'Burkina Faso': { pattern: 'bi-horizontal', colors: ['#EF2B2D', '#009E49']},
    'Burundi': { pattern: 'saltire', colors: ['#FFFFFF', '#CE1126', '#1EB53A']},
    'Cabo Verde': { pattern: 'bi-horizontal', colors: ['#003893', '#FFFFFF']},
    'Cameroon': { pattern: 'tri-vertical', colors: ['#007A5E', '#CE1126', '#FCD116'] },
    'Central African Republic': { pattern: 'tri-horizontal', colors: ['#003082', '#FFFFFF', '#289728']},
    'Chad': { pattern: 'tri-vertical', colors: ['#002664', '#FECB00', '#C60C30']},
    'Comoros': { pattern: 'tri-horizontal', colors: ['#FFC300', '#FFFFFF', '#3A75C4']},
    'Congo': { pattern: 'tri-horizontal', colors: ['#F7D618', '#009543', '#DC241F']},
    'Congo, Democratic Republic of the': { pattern: 'bi-horizontal', colors: ['#007FFF', '#F7D618']},
    'Cote d\'Ivoire': { pattern: 'tri-vertical', colors: ['#FF8C00', '#FFFFFF', '#009E60'] },
    'Djibouti': { pattern: 'bi-horizontal', colors: ['#73C2FB', '#12AD2B']},
    'Egypt': { pattern: 'tri-horizontal', colors: ['#CE1126', '#FFFFFF', '#000000'] },
    'Equatorial Guinea': { pattern: 'tri-horizontal', colors: ['#3E9A00', '#FFFFFF', '#E32118']},
    'Eritrea': { pattern: 'tri-horizontal', colors: ['#418F00', '#EA0437', '#4189DD']},
    'Eswatini': { pattern: 'tri-horizontal', colors: ['#3E5EB6', '#FFC72C', '#B10C0C']},
    'Ethiopia': { pattern: 'tri-horizontal', colors: ['#078930', '#FCDD09', '#DA121A']},
    'Gabon': { pattern: 'tri-horizontal', colors: ['#009E60', '#FCD116', '#3A75C4']},
    'Gambia': { pattern: 'tri-horizontal', colors: ['#CE1126', '#0C1C8C', '#3A7728']},
    'Ghana': { pattern: 'tri-horizontal', colors: ['#CE1126', '#FCD116', '#006B3F'] },
    'Guinea': { pattern: 'tri-vertical', colors: ['#CE1126', '#FCD116', '#009460']},
    'Guinea-Bissau': { pattern: 'tri-horizontal', colors: ['#FCD116', '#009E49', '#CE1126']},
    'Kenya': { pattern: 'tri-horizontal', colors: ['#000000', '#BB0000', '#006600']},
    'Lesotho': { pattern: 'tri-horizontal', colors: ['#00209F', '#FFFFFF', '#009453']},
    'Liberia': { pattern: 'special-usa', colors: ['#BF0A30', '#FFFFFF', '#002868']},
    'Libya': { pattern: 'tri-horizontal', colors: ['#E70013', '#239e46', '#000000']},
    'Madagascar': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#FC3D32']},
    'Malawi': { pattern: 'tri-horizontal', colors: ['#000000', '#CE1126', '#6AA84F']},
    'Mali': { pattern: 'tri-vertical', colors: ['#14B53A', '#FCD116', '#CE1126']},
    'Mauritania': { pattern: 'tri-horizontal', colors: ['#D01C1F', '#00A95C', '#FFD700']},
    'Mauritius': { pattern: 'tri-horizontal', colors: ['#EA2839', '#1A206D', '#FFD500']}, // Simplified
    'Morocco': { pattern: 'bi-horizontal', colors: ['#C1272D', '#006233']}, // Simplified
    'Mozambique': { pattern: 'tri-horizontal', colors: ['#009736', '#000000', '#FCD116']},
    'Namibia': { pattern: 'tri-horizontal', colors: ['#003580', '#FF0000', '#009543']},
    'Niger': { pattern: 'tri-horizontal', colors: ['#DD5700', '#FFFFFF', '#0DB02B']},
    'Nigeria': { pattern: 'tri-vertical', colors: ['#008751', '#FFFFFF', '#008751'] },
    'Rwanda': { pattern: 'tri-horizontal', colors: ['#2060A8', '#FAD201', '#5DBF3A']},
    'Sao Tome and Principe': { pattern: 'tri-horizontal', colors: ['#12AD2B', '#FCD116', '#CE1126']},
    'Senegal': { pattern: 'tri-vertical', colors: ['#00853F', '#FDEF42', '#E31B23'] },
    'Seychelles': { pattern: 'tri-horizontal', colors: ['#003F87', '#FCD856', '#D62828']},
    'Sierra Leone': { pattern: 'tri-horizontal', colors: ['#1EB53A', '#FFFFFF', '#0072C6']},
    'Somalia': { pattern: 'bi-horizontal', colors: ['#4189DD', '#FFFFFF']},
    'South Africa': { pattern: 'tri-horizontal', colors: ['#E03C31', '#FFFFFF', '#007749'] }, // Simplified
    'South Sudan': { pattern: 'tri-horizontal', colors: ['#000000', '#DA121A', '#0F47AF']},
    'Sudan': { pattern: 'tri-horizontal', colors: ['#D21034', '#FFFFFF', '#000000']},
    'Tanzania': { pattern: 'tri-horizontal', colors: ['#1EB53A', '#00A3DD', '#000000']},
    'Togo': { pattern: 'tri-horizontal', colors: ['#006A4E', '#FFCE00', '#D21034']},
    'Tunisia': { pattern: 'special-japan', colors: ['#E70013', '#FFFFFF']},
    'Uganda': { pattern: 'tri-horizontal', colors: ['#000000', '#FCDC04', '#D90000']},
    'Zambia': { pattern: 'tri-vertical', colors: ['#198D00', '#EF7D00', '#DE2010']},
    'Zimbabwe': { pattern: 'tri-horizontal', colors: ['#31920B', '#F7D116', '#D81120']},

    // Asia
    'Afghanistan': { pattern: 'tri-vertical', colors: ['#000000', '#AB0000', '#008A00']},
    'Bahrain': { pattern: 'bi-vertical', colors: ['#FFFFFF', '#CE1126']},
    'Bangladesh': { pattern: 'special-japan', colors: ['#006A4E', '#F42A41']},
    'Bhutan': { pattern: 'bi-horizontal', colors: ['#FF9933', '#FF6633']},
    'Brunei': { pattern: 'bi-horizontal', colors: ['#F7E417', '#FFFFFF']},
    'Cambodia': { pattern: 'tri-horizontal', colors: ['#032EA1', '#D62828', '#FFFFFF']},
    'China': { pattern: 'special-japan', colors: ['#EE1C25', '#FFFF00'] },
    'India': { pattern: 'tri-horizontal', colors: ['#FF9933', '#FFFFFF', '#138808'] },
    'Indonesia': { pattern: 'bi-horizontal', colors: ['#FF0000', '#FFFFFF'] },
    'Iran': { pattern: 'tri-horizontal', colors: ['#239F40', '#FFFFFF', '#DA0000'] },
    'Iraq': { pattern: 'tri-horizontal', colors: ['#CE1126', '#FFFFFF', '#000000']},
    'Israel': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#0038B8']},
    'Japan': { pattern: 'special-japan', colors: ['#FFFFFF', '#BC002D'] },
    'Jordan': { pattern: 'tri-horizontal', colors: ['#000000', '#FFFFFF', '#007A3D']},
    'Kuwait': { pattern: 'tri-horizontal', colors: ['#007A3D', '#FFFFFF', '#CE1126']},
    'Kyrgyzstan': { pattern: 'special-japan', colors: ['#FF0000', '#FFD700']},
    'Laos': { pattern: 'tri-horizontal', colors: ['#CE1126', '#002868', '#FFFFFF']},
    'Lebanon': { pattern: 'tri-horizontal', colors: ['#ED1C24', '#FFFFFF', '#00A651']},
    'Malaysia': { pattern: 'bi-horizontal', colors: ['#CC0000', '#000066']},
    'Maldives': { pattern: 'bi-horizontal', colors: ['#D21034', '#007E3A']},
    'Mongolia': { pattern: 'tri-vertical', colors: ['#DA2032', '#0066B3', '#FFD700']},
    'Myanmar': { pattern: 'tri-horizontal', colors: ['#FECB00', '#34B233', '#EA2839']},
    'Nepal': { pattern: 'special-nepal', colors: ['#DC143C', '#FFFFFF']},
    'North Korea': { pattern: 'tri-horizontal', colors: ['#024FA2', '#FFFFFF', '#ED1C27']},
    'Oman': { pattern: 'tri-horizontal', colors: ['#FFFFFF', '#D22730', '#00833E']},
    'Pakistan': { pattern: 'bi-vertical', colors: ['#FFFFFF', '#006600'] },
    'Palestine': { pattern: 'tri-horizontal', colors: ['#000000', '#FFFFFF', '#009736']},
    'Philippines': { pattern: 'bi-horizontal', colors: ['#0038A8', '#CE1126']},
    'Qatar': { pattern: 'bi-vertical', colors: ['#FFFFFF', '#8D1B3D']},
    'Saudi Arabia': { pattern: 'bi-horizontal', colors: ['#006C35', '#FFFFFF'] },
    'Singapore': { pattern: 'bi-horizontal', colors: ['#ED2939', '#FFFFFF']},
    'South Korea': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#CD2E3A'] },
    'Sri Lanka': { pattern: 'bi-horizontal', colors: ['#FFC400', '#8D1B3D']},
    'Syria': { pattern: 'tri-horizontal', colors: ['#CE1126', '#FFFFFF', '#000000']},
    'Taiwan': { pattern: 'bi-horizontal', colors: ['#FE0000', '#000095']},
    'Tajikistan': { pattern: 'tri-horizontal', colors: ['#CD2027', '#FFFFFF', '#006633']},
    'Thailand': { pattern: 'tri-horizontal', colors: ['#A51931', '#FFFFFF', '#2D2A4A']},
    'Timor-Leste': { pattern: 'bi-horizontal', colors: ['#DA291C', '#FFC72C']},
    'Turkmenistan': { pattern: 'bi-horizontal', colors: ['#009736', '#B40A2D']},
    'United Arab Emirates': { pattern: 'tri-horizontal', colors: ['#00732F', '#FFFFFF', '#000000']},
    'Uzbekistan': { pattern: 'tri-horizontal', colors: ['#009DD6', '#FFFFFF', '#009A6C']},
    'Vietnam': { pattern: 'special-japan', colors: ['#DA251D', '#FFFF00']},
    'Yemen': { pattern: 'tri-horizontal', colors: ['#CE1126', '#FFFFFF', '#000000']},
    
    // North America
    'Antigua and Barbuda': { pattern: 'tri-horizontal', colors: ['#CE1126', '#007A5E', '#FCD116']},
    'Bahamas': { pattern: 'tri-horizontal', colors: ['#00778B', '#FFC72C', '#000000']},
    'Barbados': { pattern: 'tri-vertical', colors: ['#00267F', '#FFC72C', '#00267F']},
    'Belize': { pattern: 'bi-horizontal', colors: ['#0032A0', '#D91023']},
    'Canada': { pattern: 'tri-vertical', colors: ['#FF0000', '#FFFFFF', '#FF0000'] }, // Simplified ratio
    'Costa Rica': { pattern: 'tri-horizontal', colors: ['#002B7F', '#FFFFFF', '#CE1126']},
    'Cuba': { pattern: 'tri-horizontal', colors: ['#002A8F', '#FFFFFF', '#CF142B']},
    'Dominica': { pattern: 'bi-horizontal', colors: ['#006B3F', '#FCD116']},
    'Dominican Republic': { pattern: 'centered-cross', colors: ['#002D62', '#FFFFFF', '#CE1126']},
    'El Salvador': { pattern: 'tri-horizontal', colors: ['#0047AB', '#FFFFFF', '#0047AB']},
    'Grenada': { pattern: 'bi-horizontal', colors: ['#CE1126', '#007A5E']},
    'Guatemala': { pattern: 'tri-vertical', colors: ['#4997D0', '#FFFFFF', '#4997D0']},
    'Haiti': { pattern: 'bi-horizontal', colors: ['#00209F', '#D21034']},
    'Honduras': { pattern: 'tri-horizontal', colors: ['#00BCE4', '#FFFFFF', '#00BCE4']},
    'Jamaica': { pattern: 'saltire', colors: ['#009B3A', '#000000', '#FED100'] },
    'Mexico': { pattern: 'tri-vertical', colors: ['#006847', '#FFFFFF', '#CE1126'] },
    'Nicaragua': { pattern: 'tri-horizontal', colors: ['#0067C6', '#FFFFFF', '#0067C6']},
    'Panama': { pattern: 'centered-cross', colors: ['#FFFFFF', '#00529B', '#D21034']},
    'Saint Kitts and Nevis': { pattern: 'tri-horizontal', colors: ['#009E49', '#000000', '#CE1126']},
    'Saint Lucia': { pattern: 'bi-horizontal', colors: ['#63C5F1', '#000000']},
    'Saint Vincent and the Grenadines': { pattern: 'tri-vertical', colors: ['#0072C6', '#FCD116', '#4B8B3B']},
    'Trinidad and Tobago': { pattern: 'bi-horizontal', colors: ['#CE1126', '#000000']},
    'USA': { pattern: 'special-usa', colors: ['#B31942', '#FFFFFF', '#3C3B6E'] },
    
    // South America
    'Argentina': { pattern: 'tri-horizontal', colors: ['#75AADB', '#FFFFFF', '#75AADB'] },
    'Bolivia': { pattern: 'tri-horizontal', colors: ['#DA291C', '#F8E600', '#007A3D'] },
    'Brazil': { pattern: 'special-brazil', colors: ['#009B3A', '#FFDF00', '#002776'] },
    'Chile': { pattern: 'bi-horizontal', colors: ['#FFFFFF', '#DA291C'] }, // Simplified
    'Colombia': { pattern: 'special-colombia', colors: ['#FCD116', '#003893', '#CE1126'] },
    'Ecuador': { pattern: 'special-colombia', colors: ['#FFDD00', '#0033A0', '#EF3340'] },
    'Guyana': { pattern: 'tri-horizontal', colors: ['#009E49', '#FCD116', '#CE1126']},
    'Paraguay': { pattern: 'tri-horizontal', colors: ['#D52B1E', '#FFFFFF', '#0038A8'] },
    'Peru': { pattern: 'tri-vertical', colors: ['#D91023', '#FFFFFF', '#D91023'] },
    'Suriname': { pattern: 'tri-horizontal', colors: ['#377E36', '#FFFFFF', '#B40A2D']}, // Simplified
    'Uruguay': { pattern: 'special-uruguay', colors: ['#FFFFFF', '#0038A8'] },
    'Venezuela': { pattern: 'tri-horizontal', colors: ['#FFCE00', '#00367A', '#CE1126'] },
    
    // Oceania
    'Australia': { pattern: 'special-aus', colors: ['#00008B', '#FFFFFF'] },
    'Fiji': { pattern: 'bi-horizontal', colors: ['#62B3E1', '#FFFFFF']},
    'Kiribati': { pattern: 'bi-horizontal', colors: ['#CE1126', '#0032A0']},
    'Marshall Islands': { pattern: 'bi-horizontal', colors: ['#003893', '#FF6700']},
    'Micronesia': { pattern: 'bi-horizontal', colors: ['#75B2DD', '#FFFFFF']},
    'Nauru': { pattern: 'bi-horizontal', colors: ['#002B7F', '#FFC72C']},
    'New Zealand': { pattern: 'special-nz', colors: ['#00247D', '#CC142E'] },
    'Palau': { pattern: 'special-japan', colors: ['#4AADD6', '#FFDE00']},
    'Papua New Guinea': { pattern: 'bi-horizontal', colors: ['#CE1126', '#000000']},
    'Samoa': { pattern: 'bi-horizontal', colors: ['#CE1126', '#002B7F']},
    'Solomon Islands': { pattern: 'bi-horizontal', colors: ['#0051BA', '#215B33']},
    'Tonga': { pattern: 'centered-cross', colors: ['#FFFFFF', '#C10000']},
    'Tuvalu': { pattern: 'bi-horizontal', colors: ['#81C4E9', '#F9D616']},
    'Vanuatu': { pattern: 'tri-horizontal', colors: ['#D21034', '#009543', '#FDCE12']},

    'Default': { pattern: 'default', colors: ['#6B7280', '#D1D5DB'] },
};

interface FlagIconProps extends React.SVGProps<SVGSVGElement> {
  nationality: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ nationality, ...props }) => {
  const flagInfo = countryFlagData[nationality] || countryFlagData['Default'];

  const { pattern, colors } = flagInfo;
  
  const renderPattern = () => {
    switch (pattern) {
      case 'bi-horizontal':
        return (<><rect width="5" height="1.5" y="0" fill={colors[0]} /><rect width="5" height="1.5" y="1.5" fill={colors[1]} /></>);
      case 'bi-vertical':
        return (<><rect width="2.5" height="3" x="0" fill={colors[0]} /><rect width="2.5" height="3" x="2.5" fill={colors[1]} /></>);
      case 'tri-horizontal':
        return (<><rect width="5" height="1" y="0" fill={colors[0]} /><rect width="5" height="1" y="1" fill={colors[1]} /><rect width="5" height="1" y="2" fill={colors[2]} /></>);
      case 'tri-vertical':
        return (<><rect width="1.67" height="3" x="0" fill={colors[0]} /><rect width="1.66" height="3" x="1.67" fill={colors[1]} /><rect width="1.67" height="3" x="3.33" fill={colors[2]} /></>);
      case 'scandinavian-cross':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <rect x="0" y="1.2" width="5" height="0.6" fill={colors[1]} />
          <rect x="1.5" y="0" width="0.6" height="3" fill={colors[1]} />
          {colors.length > 2 && <>
            <rect x="0" y="1.35" width="5" height="0.3" fill={colors[2]} />
            <rect x="1.65" y="0" width="0.3" height="3" fill={colors[2]} />
          </>}
        </>);
      case 'centered-cross':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <rect x="0" y="1.2" width="5" height="0.6" fill={colors[1]} />
          <rect x="2.2" y="0" width="0.6" height="3" fill={colors[1]} />
        </>);
      case 'saltire':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <polygon points="0,0 5,3 5,2.4 0.6,0" fill={colors[1]} />
          <polygon points="0,3 5,0 5,0.6 0.6,3" fill={colors[1]} />
        </>);
      case 'special-japan':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <circle cx="2.5" cy="1.5" r="0.9" fill={colors[1]} />
        </>);
      case 'special-nepal':
        return (<>
          <polygon points="0,0 3,1.5 0,3" fill={colors[0]} />
          <circle cx="1" cy="1.5" r="0.5" fill={colors[1]} />
        </>);
      case 'special-brazil':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <polygon points="0.5,1.5 2.5,0.2 4.5,1.5 2.5,2.8" fill={colors[1]} />
          <circle cx="2.5" cy="1.5" r="0.8" fill={colors[2]} />
        </>);
       case 'special-usa':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <rect y="0.6" width="5" height="0.3" fill={colors[1]} />
          <rect y="1.2" width="5" height="0.3" fill={colors[1]} />
          <rect y="1.8" width="5" height="0.3" fill={colors[1]} />
          <rect y="2.4" width="5" height="0.3" fill={colors[1]} />
          <rect x="0" y="0" width="2.5" height="1.5" fill={colors[2]} />
        </>);
      case 'special-colombia':
        return (<>
          <rect width="5" height="1.5" y="0" fill={colors[0]} />
          <rect width="5" height="0.75" y="1.5" fill={colors[1]} />
          <rect width="5" height="0.75" y="2.25" fill={colors[2]} />
        </>);
      case 'special-uruguay':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <rect y="0.33" width="5" height="0.33" fill={colors[1]} />
          <rect y="1.0" width="5" height="0.33" fill={colors[1]} />
          <rect y="1.66" width="5" height="0.33" fill={colors[1]} />
          <rect y="2.33" width="5" height="0.33" fill={colors[1]} />
          <circle cx="1" cy="0.75" r="0.5" fill="#FDD922" />
        </>);
      case 'special-nz':
      case 'special-aus':
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <polygon points="0,0 2,1 2,1.2 0,0.1" fill={colors[1]} />
        </>);
      default:
        return (<>
          <rect width="5" height="3" fill={colors[0]} />
          <rect x="0" y="1" width="5" height="1" fill={colors[1]} />
        </>);
    }
  };

  return (
    <svg viewBox="0 0 5 3" {...props}>
      {renderPattern()}
    </svg>
  );
};
