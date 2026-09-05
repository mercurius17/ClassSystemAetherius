import os

acc_dir = 'sistema-classes/ui/assets/icons/accents'
os.makedirs(acc_dir, exist_ok=True)

accent_icons = {
    'elementalista': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20 C65 20 75 35 70 50 C65 65 45 65 45 50 C45 40 55 35 60 40" stroke="#d4af37" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M30 65 C20 50 30 35 45 35 C60 35 60 55 50 60 C40 65 35 55 40 50" stroke="#a0c4ff" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M70 65 C60 80 40 80 35 65 C30 50 50 40 55 50 C60 60 50 65 45 60" stroke="#ff7043" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>''',

    'criomante': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 20 L70 80 M70 20 L30 80" stroke="#80deea" stroke-width="4" stroke-linecap="round"/>
        <polygon points="70,15 85,25 65,30" fill="#b2ebf2"/>
        <polygon points="30,85 15,75 35,70" fill="#b2ebf2"/>
        <polygon points="80,50 60,40 65,60" fill="#e0f7fa"/>
    </svg>''',

    'eletromante': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 10 L25 55 H52 L40 90 L80 42 H50 Z" fill="#fff59d" stroke="#fbc02d" stroke-width="2"/>
    </svg>''',

    'piromante': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="65" cy="40" r="18" fill="#ff7043" opacity="0.9"/>
        <path d="M65 22 C45 22 25 50 15 65 C35 60 45 55 55 58 C65 62 75 55 83 45 C75 35 70 22 65 22 Z" fill="#ffab91"/>
        <circle cx="68" cy="38" r="6" fill="#fff3e0"/>
    </svg>''',

    'invocador': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 85 V35 C35 22 65 22 65 35 V85" stroke="#ce93d8" stroke-width="4" fill="#311b92"/>
        <path d="M20 75 C25 65 30 70 35 60 C35 75 25 80 20 85 Z" fill="#ba68c8"/>
        <path d="M80 75 C75 65 70 70 65 60 C65 75 75 80 80 85 Z" fill="#ba68c8"/>
    </svg>''',

    'anti_mago': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 L80 28 V55 C80 75 50 90 50 90 C50 90 20 75 20 55 V28 Z" fill="#4a148c" stroke="#b39ddb" stroke-width="3"/>
        <path d="M50 30 V75" stroke="#ffffff" stroke-width="3"/>
    </svg>''',

    'guardiao': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 15 L70 25 V60 C70 75 35 88 35 88 C35 88 15 75 15 60 V25 Z" fill="#37474f" stroke="#cfd8dc" stroke-width="3"/>
        <line x1="20" y1="85" x2="85" y2="20" stroke="#eceff1" stroke-width="4" stroke-linecap="round"/>
        <line x1="75" y1="18" x2="90" y2="33" stroke="#b0bec5" stroke-width="3"/>
    </svg>''',

    'berserker': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="80" x2="80" y2="20" stroke="#cfd8dc" stroke-width="4"/>
        <line x1="80" y1="80" x2="20" y2="20" stroke="#cfd8dc" stroke-width="4"/>
        <path d="M70 15 C80 15 88 25 80 35 L70 28 Z" fill="#b0bec5"/>
        <path d="M30 15 C20 15 12 25 20 35 L30 28 Z" fill="#b0bec5"/>
    </svg>''',

    'cavaleiro_negro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="20" x2="80" y2="80" stroke="#e0e0e0" stroke-width="5" stroke-linecap="round"/>
        <line x1="15" y1="32" x2="32" y2="15" stroke="#9e9e9e" stroke-width="5"/>
        <circle cx="15" cy="15" r="4" fill="#757575"/>
    </svg>''',

    'paladino': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="18" fill="#fff9c4" stroke="#fbc02d" stroke-width="3"/>
        <line x1="50" y1="10" x2="50" y2="25" stroke="#fbc02d" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="75" x2="50" y2="90" stroke="#fbc02d" stroke-width="4" stroke-linecap="round"/>
        <line x1="10" y1="50" x2="25" y2="50" stroke="#fbc02d" stroke-width="4" stroke-linecap="round"/>
        <line x1="75" y1="50" x2="90" y2="50" stroke="#fbc02d" stroke-width="4" stroke-linecap="round"/>
        <line x1="22" y1="22" x2="32" y2="32" stroke="#fbc02d" stroke-width="3" stroke-linecap="round"/>
        <line x1="68" y1="68" x2="78" y2="78" stroke="#fbc02d" stroke-width="3" stroke-linecap="round"/>
        <line x1="78" y1="22" x2="68" y2="32" stroke="#fbc02d" stroke-width="3" stroke-linecap="round"/>
        <line x1="22" y1="78" x2="32" y2="68" stroke="#fbc02d" stroke-width="3" stroke-linecap="round"/>
    </svg>''',

    'mestre_espadachim': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="25" y1="80" x2="80" y2="25" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <circle cx="25" cy="80" r="6" stroke="#b0bec5" stroke-width="3"/>
        <line x1="45" y1="90" x2="85" y2="50" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="45" cy="90" r="5" stroke="#b0bec5" stroke-width="2"/>
    </svg>''',

    'druida': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 45 C20 30 35 15 45 25 C45 35 35 40 30 45 Z" fill="#a5d6a7"/>
        <path d="M70 45 C80 30 65 15 55 25 C55 35 65 40 70 45 Z" fill="#a5d6a7"/>
        <path d="M50 40 L45 65 L50 85 L55 65 Z" fill="#81c784"/>
    </svg>''',

    'arqueiro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 50 C30 30 70 30 85 50 C70 70 30 70 15 50 Z" stroke="#cfd8dc" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="10" stroke="#cfd8dc" stroke-width="2" fill="#263238"/>
        <circle cx="50" cy="50" r="4" fill="#ffffff"/>
        <line x1="50" y1="20" x2="50" y2="80" stroke="#90a4ae" stroke-width="2"/>
    </svg>''',

    'ranger': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="25" y1="75" x2="80" y2="25" stroke="#cfd8dc" stroke-width="3" stroke-linecap="round"/>
        <line x1="15" y1="65" x2="70" y2="15" stroke="#cfd8dc" stroke-width="3" stroke-linecap="round"/>
        <line x1="35" y1="85" x2="90" y2="35" stroke="#cfd8dc" stroke-width="3" stroke-linecap="round"/>
    </svg>''',

    'viper': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="30" y1="20" x2="70" y2="70" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M68 68 C75 75 72 85 68 85 C64 85 62 75 68 68 Z" fill="#00e676"/>
    </svg>''',

    'assassino': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 C30 15 25 35 25 55 C25 80 40 85 50 85 C60 85 75 80 75 55 C75 35 70 15 50 15 Z" fill="#263238"/>
        <ellipse cx="42" cy="50" rx="4" ry="2" fill="#d50000"/>
        <ellipse cx="58" cy="50" rx="4" ry="2" fill="#d50000"/>
    </svg>''',

    'curandeiro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="45" cy="45" r="22" stroke="#ffffff" stroke-width="3" fill="none"/>
        <line x1="25" y1="65" x2="15" y2="85" stroke="#b0bec5" stroke-width="4" stroke-linecap="round"/>
        <path d="M75 25 V45 M65 35 H85" stroke="#69f0ae" stroke-width="5" stroke-linecap="round"/>
    </svg>''',

    'trapaceiro': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 30 C25 18 75 18 75 30 C75 55 65 75 50 80 C35 75 25 55 25 30 Z" fill="#eceff1" stroke="#90a4ae" stroke-width="2"/>
        <circle cx="40" cy="38" r="3" fill="#212121"/>
        <circle cx="60" cy="38" r="3" fill="#212121"/>
        <path d="M40 55 C45 62 55 62 60 55" stroke="#212121" stroke-width="2" fill="none"/>
    </svg>'''
}

for name, svg in accent_icons.items():
    with open(f'{acc_dir}/{name}.svg', 'w', encoding='utf-8') as f:
        f.write(svg.strip())

print(f'Generated {len(accent_icons)} accent SVGs in {acc_dir}')
