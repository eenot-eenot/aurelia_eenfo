window.eelib = {
    nav: {
        leftBtn: 'nav',
        downStyle: 'floating',
        noName: false,
        noIcon: false,
    },
    theme: {
        blackDown: true,
    }
};

window.eelib.pages = [
    {
        id: 'home',
        title: 'Main',
        icon: 'img/ui/home.svg',
        btns: [
            ['search'],
        ],
        subpages: [
            'reader',
        ],
    },
    {
        id: 'newspapers',
        title: 'Newspapers',
        icon: 'img/ui/text_big.svg',
        subpages: [
            'reader',
        ],
    },
    {
        id: 'newspaperInfo',
        title: 'Newspaper',
        icon: 'img/ui/text_big.svg',
        iconHead: 'img/ui/blank.svg',
        leftBtn: 'back',
        subpages: [
            'reader',
        ],
        noBottom: true,
        noLeft: true,
    },
    {
        id: 'characters',
        title: 'Characters',
        icon: 'img/ui/user.svg',
        subpages: [
            'characterInfo',
        ],
    },
    {
        id: 'characterInfo',
        title: 'Character',
        icon: 'img/ui/user.svg',
        iconHead: 'img/ui/user.svg',
        leftBtn: 'back',
        subpages: [
            'partyInfo',
        ],
        noBottom: true,
        noLeft: true,
    },
    {
        id: 'parties',
        title: 'Parties',
        icon: 'img/ui/flag.svg',
        subpages: [
            'partyInfo',
        ],
        active: true,
    },
    {
        id: 'partyInfo',
        title: 'Party',
        icon: 'img/ui/flag.svg',
        iconHead: 'img/ui/blank.svg',
        leftBtn: 'back',
        subpages: [
            'characterInfo',
        ],
        noBottom: true,
        noLeft: true,
    },
    {
        id: 'reader',
        title: 'Reader',
        icon: 'img/ui/notebook.svg',
        leftBtn: 'back',
        btns: [
            ['search'],
        ],
        subpages: [
            'characterInfo',
            'partyInfo'
        ],
        noLeft: true,
        noBottom: true,
    },
    {
        id: 'about',
        title: 'About',
        icon: 'img/ui/user.svg',
        leftBtn: 'back',
        btns: [
            ['search'],
            ['add'],
            ['test', 'img/ui/code'],
        ],
        subpages: [
            'seek',
        ],
        subpagesmode: 'modal',
        noNav: true,
        noLeft: true,
        noBottom: true,
    },
    {
        id: 'fakeSettings',
        title: 'Reader settings',
        icon: 'img/ui/settings.svg',
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: 'img/ui/settings.svg',
        noBottom: true,
        noLeft: true,
    },
]

window.eelib.translations = {}

window.eelib.settingsConfig = {
    storageKey: 'appSettings',
    defaultSettings: {
        main: {
            theme: "dark",
        },
    },
    schema: {
        main: {
            title: "Main",
            items: [
                {
                    type: "select",
                    key: "theme",
                    label: "Theme",
                    options: { "dark": "Dark", "light": "Light", "oled": "Black OLED" }
                },
            ]
        },
    },
    onChange: (settings) => {
        // Вызывается при любом изменении настроек
        if (typeof updateTimeDisplay === 'function') {
        updateTimeDisplay();
        }
    }
}