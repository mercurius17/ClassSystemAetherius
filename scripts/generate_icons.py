import os

icons_dir = 'sistema-classes/ui/assets/icons'
os.makedirs(icons_dir, exist_ok=True)

svg_icons = {
    'elementalista': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="42" stroke="#a0c4ff" stroke-width="2" stroke-dasharray="4 2"/>
        <path d="M50 20 C35 35 30 50 50 65 C70 50 65 35 50 20Z" fill="#ff7b00" opacity="0.8"/>
        <path d="M30 45 C45 55 55 70 40 80 C25 75 25 55 30 45Z" fill="#00f0ff" opacity="0.8"/>
        <path d="M70 45 C55 55 45 70 60 80 C75 75 75 55 70 45Z" fill="#ffd700" opacity="0.8"/>
        <circle cx="50" cy="50" r="6" fill="#ffffff"/>
    </svg>''',

    'criomante': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="#aae0fa" stroke-width="4" stroke-linecap="round"/>
        <polygon points="50,25 45,35 55,35" fill="#e0f7ff"/>
        <polygon points="50,75 45,65 55,65" fill="#e0f7ff"/>
        <polygon points="25,50 35,45 35,55" fill="#e0f7ff"/>
        <polygon points="75,50 65,45 65,55" fill="#e0f7ff"/>
        <circle cx="50" cy="50" r="8" fill="#b8e2f2" stroke="#ffffff" stroke-width="2"/>
    </svg>''',

    'eletromante': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M55 10 L25 52 L48 52 L40 90 L75 46 L50 46 L65 10 Z" fill="#ffe600" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="48" cy="49" r="3" fill="#ffffff"/>
    </svg>''',

    'piromante': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 12 C50 12 68 35 68 55 C68 72 58 88 50 88 C42 88 32 72 32 55 C32 35 50 12 50 12 Z" fill="#ff4500" opacity="0.9"/>
        <path d="M50 32 C50 32 60 48 60 62 C60 74 54 82 50 82 C46 82 40 74 40 62 C40 48 50 32 50 32 Z" fill="#ffa500"/>
        <path d="M50 50 C50 50 55 60 55 70 C55 76 52 80 50 80 C48 80 45 76 45 70 C45 60 50 50 50 50 Z" fill="#ffffaa"/>
    </svg>''',

    'invocador': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="24" ry="40" stroke="#ba68c8" stroke-width="4" stroke-dasharray="8 4" transform="rotate(15 50 50)"/>
        <ellipse cx="50" cy="50" rx="16" ry="30" fill="#4a148c" opacity="0.7" transform="rotate(-15 50 50)"/>
        <path d="M50 15 L50 85 M20 50 L80 50" stroke="#e1bee7" stroke-width="2"/>
        <circle cx="50" cy="50" r="5" fill="#ffffff"/>
    </svg>''',

    'anti_mago': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 25 L75 75 M75 25 L25 75" stroke="#7c4dff" stroke-width="5" stroke-linecap="round"/>
        <path d="M50 15 L65 35 L50 85 L35 35 Z" fill="none" stroke="#b388ff" stroke-width="3"/>
        <circle cx="50" cy="50" r="12" stroke="#ffffff" stroke-width="2" fill="none"/>
    </svg>''',

    'guardiao': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 L80 28 V55 C80 72 50 88 50 88 C50 88 20 72 20 55 V28 Z" fill="#37474f" stroke="#cfd8dc" stroke-width="4" stroke-linejoin="round"/>
        <path d="M50 25 L70 35 V52 C70 65 50 77 50 77 C50 77 30 65 30 52 V35 Z" fill="#455a64" stroke="#b0bec5" stroke-width="2"/>
        <line x1="50" y1="25" x2="50" y2="75" stroke="#eceff1" stroke-width="3"/>
        <line x1="30" y1="45" x2="70" y2="45" stroke="#eceff1" stroke-width="3"/>
    </svg>''',

    'berserker': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="80" x2="80" y2="20" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>
        <line x1="80" y1="80" x2="20" y2="20" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>
        <path d="M68 15 C75 12 85 22 82 28 C78 35 68 32 68 15 Z" fill="#b71c1c" stroke="#d32f2f" stroke-width="2"/>
        <path d="M32 15 C25 12 15 22 18 28 C22 35 32 32 32 15 Z" fill="#b71c1c" stroke="#d32f2f" stroke-width="2"/>
        <circle cx="50" cy="50" r="8" fill="#ff5252" stroke="#ffffff" stroke-width="2"/>
    </svg>''',

    'cavaleiro_negro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 L54 65 L50 72 L46 65 Z" fill="#212121" stroke="#9e9e9e" stroke-width="3"/>
        <line x1="35" y1="68" x2="65" y2="68" stroke="#616161" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="72" x2="50" y2="88" stroke="#424242" stroke-width="4"/>
        <circle cx="50" cy="91" r="4" fill="#757575"/>
        <path d="M25 40 L50 25 L75 40 L50 55 Z" fill="none" stroke="#b71c1c" stroke-width="2" opacity="0.7"/>
    </svg>''',

    'paladino': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="28" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="6 3"/>
        <path d="M50 15 L50 85 M28 38 L72 38" stroke="#fff8e1" stroke-width="7" stroke-linecap="square"/>
        <circle cx="50" cy="38" r="6" fill="#ffd700"/>
        <polygon points="50,5 53,12 60,10 55,16 62,20 54,22" fill="#ffe082"/>
    </svg>''',

    'mestre_espadachim': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="22" y1="78" x2="78" y2="22" stroke="#e0e0e0" stroke-width="4" stroke-linecap="round"/>
        <line x1="78" y1="78" x2="22" y2="22" stroke="#e0e0e0" stroke-width="4" stroke-linecap="round"/>
        <circle cx="22" cy="78" r="7" stroke="#b0bec5" stroke-width="3" fill="none"/>
        <circle cx="78" cy="78" r="7" stroke="#b0bec5" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="5" fill="#00e5ff"/>
    </svg>''',

    'druida': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 V45 M50 45 C40 30 25 35 20 22 C32 25 45 35 50 45 Z" fill="#4caf50" stroke="#81c784" stroke-width="2"/>
        <path d="M50 45 C60 30 75 35 80 22 C68 25 55 35 50 45 Z" fill="#4caf50" stroke="#81c784" stroke-width="2"/>
        <circle cx="50" cy="28" r="10" fill="#2e7d32" stroke="#a5d6a7" stroke-width="2"/>
        <path d="M42 88 H58" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>
    </svg>''',

    'arqueiro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 15 C60 35 60 65 30 85" stroke="#8d6e63" stroke-width="4" stroke-linecap="round" fill="none"/>
        <line x1="30" y1="15" x2="30" y2="85" stroke="#b0bec5" stroke-width="1.5"/>
        <line x1="20" y1="50" x2="75" y2="50" stroke="#eceff1" stroke-width="3" stroke-linecap="round"/>
        <polygon points="75,45 85,50 75,55" fill="#eceff1"/>
        <polygon points="20,46 25,50 20,54" fill="#8d6e63"/>
    </svg>''',

    'ranger': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="25" y1="65" x2="75" y2="25" stroke="#81c784" stroke-width="3" stroke-linecap="round"/>
        <polygon points="75,20 82,25 73,32" fill="#a5d6a7"/>
        <line x1="20" y1="75" x2="70" y2="35" stroke="#81c784" stroke-width="3" stroke-linecap="round"/>
        <polygon points="70,30 77,35 68,42" fill="#a5d6a7"/>
        <line x1="30" y1="85" x2="80" y2="45" stroke="#81c784" stroke-width="3" stroke-linecap="round"/>
        <polygon points="80,40 87,45 78,52" fill="#a5d6a7"/>
    </svg>''',

    'viper': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 L56 55 L50 62 L44 55 Z" fill="#2e7d32" stroke="#00e676" stroke-width="3"/>
        <line x1="38" y1="58" x2="62" y2="58" stroke="#b9f6ca" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="62" x2="50" y2="75" stroke="#1b5e20" stroke-width="3"/>
        <circle cx="50" cy="78" r="3" fill="#00e676"/>
        <path d="M50 15 C50 15 54 25 50 30 C46 35 50 40 50 40" stroke="#76ff03" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="20" r="2" fill="#76ff03"/>
    </svg>''',

    'assassino': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 18 C35 18 30 35 30 55 C30 75 42 82 50 82 C58 82 70 75 70 55 C70 35 65 18 50 18 Z" fill="#212121" stroke="#757575" stroke-width="3"/>
        <ellipse cx="43" cy="48" rx="4" ry="2" fill="#d50000"/>
        <ellipse cx="57" cy="48" rx="4" ry="2" fill="#d50000"/>
        <path d="M38 65 C45 70 55 70 62 65" stroke="#424242" stroke-width="2" fill="none"/>
    </svg>''',

    'curandeiro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="34" fill="#1b5e20" stroke="#69f0ae" stroke-width="3"/>
        <path d="M50 30 V70 M30 50 H70" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="6" fill="#b9f6ca"/>
    </svg>''',

    'trapaceiro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 32 C25 20 75 20 75 32 C75 55 65 75 50 82 C35 75 25 55 25 32 Z" fill="#f5f5f5" stroke="#9e9e9e" stroke-width="2"/>
        <ellipse cx="40" cy="40" rx="5" ry="3" fill="#212121" transform="rotate(10 40 40)"/>
        <ellipse cx="60" cy="40" rx="5" ry="3" fill="#212121" transform="rotate(-10 60 40)"/>
        <path d="M38 60 C45 68 55 68 62 60" stroke="#212121" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>'''
}

for name, svg in svg_icons.items():
    with open(f'{icons_dir}/{name}.svg', 'w', encoding='utf-8') as f:
        f.write(svg.strip())

print(f'Generated {len(svg_icons)} SVGs in {icons_dir}')
