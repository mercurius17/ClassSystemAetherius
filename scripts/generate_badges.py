import os

ui_dir = 'sistema-classes/ui/assets/ui'
os.makedirs(ui_dir, exist_ok=True)

badges = {
    'conjuradores': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,10 62,38 90,50 62,62 50,90 38,62 10,50 38,38" fill="none" stroke="#d4af37" stroke-width="4"/>
        <circle cx="50" cy="50" r="14" fill="#ffd700" opacity="0.3"/>
        <circle cx="50" cy="50" r="6" fill="#ffffff"/>
    </svg>''',

    'guerreiros': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 L82 28 V58 C82 75 50 90 50 90 C50 90 18 75 18 58 V28 Z" fill="#263238" stroke="#cfd8dc" stroke-width="4"/>
        <path d="M50 25 V80 M30 45 H70" stroke="#b0bec5" stroke-width="3"/>
    </svg>''',

    'especialistas': '''<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 12 L75 35 L50 88 L25 35 Z" fill="#212121" stroke="#a5d6a7" stroke-width="4"/>
        <line x1="50" y1="20" x2="50" y2="78" stroke="#ffffff" stroke-width="3"/>
        <circle cx="50" cy="35" r="5" fill="#a5d6a7"/>
    </svg>'''
}

for name, svg in badges.items():
    with open(f'{ui_dir}/{name}.svg', 'w', encoding='utf-8') as f:
        f.write(svg.strip())

print(f'Generated archetype badges in {ui_dir}')
