const state = {
    allChannels: [],
    channelsData: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    channelHistory: JSON.parse(localStorage.getItem('channelHistory')) || {},
    currentChannel: null,
    clearButtonClickCount: 0,
    lastClearButtonClickTime: 0,
    elcanoRetries: 0,
    eventsRetries: 0,
    primaryColor: localStorage.getItem('primaryColor') || '#2563eb',
    channelRatings: JSON.parse(localStorage.getItem('channelRatings')) || {},
    lastChannelPlay: JSON.parse(localStorage.getItem('lastChannelPlay')) || null,
    firstSeen: JSON.parse(localStorage.getItem('firstSeen')) || {},
    hideEventDetails: localStorage.getItem('hideEventDetails') === 'true',
    tvCurrentFilter: localStorage.getItem('tvCurrentFilter') || 'all',
    tvSportFilter: localStorage.getItem('tvSportFilter') || 'all',
    tvSearchTerm: '',
    tvFocusManager: null,
    playerActive: false,
    lastPlayedByChannel: JSON.parse(localStorage.getItem('lastPlayedByChannel')) || {},
    fullScreenOnClick: localStorage.getItem('fullScreenOnClick') === 'true',
    hideOptionsButton: localStorage.getItem('hideOptionsButton') === 'true'
};
const LOGOPEDIA_BASE_URL = "https://static.wikia.nocookie.net/logopedia/images/";
const IMAGE_PROXY_URL = "https://images.weserv.nl/?url=";
const ERA_URL = "https://ipfs.io/ipns/k2k4r8oqlcjxsritt5mczkcn4mmvcmymbqw7113fz2flkrerfwfps004/data/listas/listaplana.txt";
const championsLeagueImages = {
    'M+ LIGA DE CAMPEONES': '0/05/Liga_de_Campeones_por_Movistar_Plus%2B.svg/revision/latest?cb=20220128151054',
    'M+ COMEDIA': '2/27/Comedia_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230721191930',
    'M+ LIGA DE CAMPEONES 2': '3/33/Liga_de_Campeones_2_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171922',
    'M+ LIGA DE CAMPEONES 3': 'f/f8/Liga_de_Campeones_3_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171923',
    'M+ LIGA DE CAMPEONES 4': '0/0a/Liga_de_Campeones_4_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171811',
    'M+ LIGA DE CAMPEONES 5': 'b/b3/Liga_de_Campeones_5_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171812',
    'M+ LIGA DE CAMPEONES 6': 'd/d8/Liga_de_Campeones_6_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171813',
    'M+ LIGA DE CAMPEONES 7': 'b/bf/Liga_de_Campeones_7_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171814',
    'M+ LIGA DE CAMPEONES 8': '3/3f/Liga_de_Campeones_8_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171815',
    'M+ DEPORTES': 'd/d7/Deportes_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230721194319',
    'M+ DEPORTES 2': '7/7c/Deportes_2_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230721201028',
    'M+ DEPORTES 3': '4/40/Deportes_3_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230721201007',
    'M+ DEPORTES 4': 'e/eb/Deportes_4_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230721201006',
    'M+ DEPORTES 5': '8/88/Deportes_5_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230721201005',
    'M+ DEPORTES 6': 'd/d1/Deportes_6_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230721201004',
    'M+ LA LIGA': 'c/cd/LaLigaTV_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230704125929',
    'M+ LA LIGA 2': '4/4c/LaLigaTV_2_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230708175335',
    'M+ LA LIGA 3': '0/0e/LaLigaTV_3_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230708175336',
    'M+ LA LIGA 4': 'a/a2/LaLigaTV_4_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230708175337',
    'M+ LA LIGA 5': 'b/ba/LaLigaTV_5_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230708175338',
    'M+ LIGA DE CAMPEONES 9': '5/5b/Liga_de_Campeones_9_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171816',
    'M+ LIGA DE CAMPEONES 10': 'a/ad/Liga_de_Campeones_10_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171816',
    'M+ LIGA DE CAMPEONES 11': 'e/e5/Liga_de_Campeones_11_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171817',
    'M+ LIGA DE CAMPEONES 12': '1/1e/Liga_de_Campeones_12_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171818',
    'M+ LIGA DE CAMPEONES 13': '0/02/Liga_de_Campeones_13_por_Movistar_Plus%2B.png/revision/latest?cb=20230708171819',
    'M+ LIGA DE CAMPEONES 14': '1/10/Liga_de_Campeones_14_por_Movistar_Plus%2B.png/revision/latest?cb=20230708172106',
    'M+ LIGA DE CAMPEONES 15': '0/0c/Liga_de_Campeones_15_por_Movistar_Plus%2B.png/revision/latest?cb=20230708172107',
    'M+ LIGA DE CAMPEONES 16': '2/23/Liga_de_Campeones_16_por_Movistar_Plus%2B.png/revision/latest?cb=20230708172108',
    'M+ LIGA DE CAMPEONES 17': '7/7b/Liga_de_Campeones_17_por_Movistar_Plus%2B.png/revision/latest?cb=20230708172109',
    'LA 1': '1/19/Logo_TVE-1.svg/revision/latest?cb=20220319071348',
    '★EUROSPORT 1': 'c/c8/Eurosport_1.svg/revision/latest?cb=20210911124742',
    'M+ PLUS': '0/07/Movistar_Plus%2B.svg/revision/latest?cb=20240116071854',
    'M+ FESTIVAL DE SAN SEBASTIÁN': '3/38/M%C3%BAsica_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230801070424',
    'M+ EN JUEGO': '4/4d/Suspense_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230801070149',
    'M+ PLUS 2': '1/1f/Movistar_Plus%2B_2_2023.svg/revision/latest/scale-to-width-down/250?cb=20240116072142',
    'LA LIGA HYPERMOTION 3': '2/23/La_Liga_Hypermotion_3.svg/revision/latest/scale-to-width-down/250?cb=20240921160145',
    'M+ ACCIÓN': 'b/b6/Acci%C3%B3n_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230721192021',
    'M+ CINE ESPAÑOL': 'd/d2/Cine_Espa%C3%B1ol_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230722062235',
    'M+ CLÁSICOS': '2/2f/Cl%C3%A1sicos_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230721192128',
    'M+ DOCUMENTALES': '7/7c/Documentales_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230801070305',
    'M+ DRAMA': '0/0d/Drama_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230721191847',
    'M+ ESTRENOS': '8/88/Estrenos_por_Movistar_Plus%2B_2025.svg/revision/latest?cb=20250128104456',
    'M+ ELLAS': '1/1d/Ellas_Vamos_por_Movistar_Plus%2B.svg/revision/latest?cb=20230728171815',
    'M+ HITS': '3/3c/Hits_por_M%2B.svg/revision/latest?cb=20250128110338',
    'M+ INDIE': '2/22/Indie_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230801070038',
    'M+ ORIGINALES': '0/09/Originales_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230801070235',
    'DAZN 1 BAR': '8/83/DAZN_2019_logo.svg/revision/latest?cb=20210824002335',
    'DAZN PVV': '2/29/DAZN_PPV.png/revision/latest/scale-to-width-down/250?cb=20230708104557',
    '★EUROSPORT 2': '0/0d/Eurosport_2_%282015%29.svg/revision/latest?cb=20171209134527',
    'M+ VAMOS': 'b/be/Vamos_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230728170813',
    'LA LIGA HYPERMOTION': 'b/b5/LaLiga_TV_Hypermotion.svg/revision/latest?cb=20230704141115',
    'LA LIGA HYPERMOTION 2': '6/6f/La_Liga_Hypermotion_2.svg/revision/latest/scale-to-width-down/250?cb=20240921151926',
    'M+ GOLF': '2/21/Golf_por_Movistar_Plus%2B_2023.svg/revision/latest?cb=20230721202544',
    'M+ GOLF 2': '5/57/Golf_2_por_Movistar_Plus%2B_2023.png/revision/latest?cb=20230721202546',
    'DAZN F1': 'c/cc/DAZN_F1.svg/revision/latest?cb=20221210225344',
    'DAZN LA LIGA': '1/18/DAZN_LALIGA_2024.svg/revision/latest?cb=20240910115205',
    'DAZN BALONCESTO': '2/2b/B77YC301.svg/revision/latest?cb=20251211214002',
    'DAZN LA LIGA 2': 'f/fa/DAZN_LaLiga_2_2024.svg/revision/latest/scale-to-width-down/250?cb=20240910121150',
    'DAZN 1': '1/18/DAZN_1_2024.svg/revision/latest?cb=20240713213358',
    'DAZN 2': '8/82/DAZN_2_2024.svg/revision/latest?cb=20240713212845',
    'DAZN 3': '0/0f/DAZN_3_2024.svg/revision/latest?cb=20240713212252',
    'DAZN 4': 'f/f7/DAZN_4_2024.svg/revision/latest?cb=20240713211915',
    'DAZN BALONCESTO 2': '2/2b/B77YC301.svg/revision/20251211214725',
    'DAZN BALONCESTO 3': '2/2b/B77YC301.svg/revision/latest?cb=20251211214725',
    'M+ NAVIDAD': '2/2c/Navidad_por_M%2B.svg/revision/latest?cb=20251210160452'
};

function getPlaceholderInfo(channelName) {
    const name = channelName.toUpperCase().trim();
    if (championsLeagueImages[name]) {
        let url = championsLeagueImages[name];

        const baseUrl = LOGOPEDIA_BASE_URL;
        if (url.startsWith('https:')) {
            url = url.substring(baseUrl.length);
        }

        return {
            url: url,
            class: 'channel-card--logo-img'
        };
    }
    return null;
}

function proxyImage(url) {
    return IMAGE_PROXY_URL + encodeURIComponent(url);
}
const PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy/?quest=',
    'https://proxy-cors-simple.vercel.app/api?url=',
    'https://yacdn.org/proxy/',
    'https://cors-proxy.fringe.co.kr/?'
];
const GIST_URL = "https://gist.githubusercontent.com/Ciento20/f7847e86d06e5011706fa76f2dab90be/raw";
const ELCANO_URL = 'https://ipfs.io/ipns/elcano.top';
const EVENTS_URL = 'https://eventos-eight-dun.vercel.app/';
const SHICKAT_URL = 'https://shickat.me/';
const BACKUP_KEYS = {
    gist: 'gist_channels_backup',
    elcano: 'elcano_channels_backup',
    events: 'events_channels_backup',
    shickat: 'shickat_channels_backup',
    era: 'era_channels_backup'
};
const MAX_RETRIES = 3;
const BACKUP_EXPIRY_HOURS = 480;
const HISTORY_EXPIRY_HOURS = 168;
const TV_BRAND_FILTER_KEYS = ['all', 'events_only', 'live', 'favorites', 'dazn', 'm+', 'eurosport'];
const TV_SPORT_FILTER_KEYS = ['futbol', 'baloncesto', 'tenis', 'motorsport', 'f1'];
const OTHER_SUBGROUPS = ['LIGA ENDESA', 'CANAL DE TENIS', 'SUPERTENNIS', 'BUNDESLIGA', 'PRIMERA FEDERACIÓN', '1RFEF', 'ARAGON TV', 'BEIN', 'BT SPORT', 'CANAL+SPORT', 'ESPN', 'ESSPN', 'SKY', 'ESPORT 3', 'FOX', 'GOL PLAY', 'REAL MADRID TV', 'ORANGE TV', 'RALLY TV', 'MOTOR', 'NBA', 'NFL', 'PREMIER SPORTS', 'DISCOVERY CHANNEL', 'DARK', 'AMC', 'LA 1', 'LA 2', 'ANTENA 3', 'Cuatro', 'Telecinco', 'LA SEXTA', '24 HORAS', 'TELEDEPORTE', 'CAZA Y PESCA', 'CANAL COCINA', 'DECASA', 'ONETORO', 'ZIGGO', 'XTRM', 'MIXED TV', 'DAZN', '(DE)', '(PL)', '(RU)'];

function normalizeText(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function extractPID(enlace) {
    if (!enlace) return '';
    return enlace.replace('acestream://', '').trim();
}

async function hashContent(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function trackFirstSeen(channelId) {
    if (!state.firstSeen[channelId]) {
        state.firstSeen[channelId] = new Date().getTime();
        localStorage.setItem('firstSeen', JSON.stringify(state.firstSeen));
    }
}

function isChannelNew(channelId) {
    const firstSeenTime = state.firstSeen[channelId];
    if (!firstSeenTime) {
        return false;
    }
    const tenMinutesInMs = 10 * 60 * 1000;
    return (new Date().getTime() - firstSeenTime) < tenMinutesInMs;
}

function cleanupOldFirstSeenRecords() {
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    for (const channelId in state.firstSeen) {
        if ((now - state.firstSeen[channelId]) > oneWeekInMs) {
            delete state.firstSeen[channelId];
        }
    }
    localStorage.setItem('firstSeen', JSON.stringify(state.firstSeen));
}

function toggleFavorite(channelId) {
    const index = state.favorites.indexOf(channelId);
    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push(channelId);
    }
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    renderTVChannels();
}

function toggleFullScreenOnClick() {
    state.fullScreenOnClick = !state.fullScreenOnClick;
    localStorage.setItem('fullScreenOnClick', state.fullScreenOnClick);
    document.getElementById('fullScreenOnClickCheckbox').checked = state.fullScreenOnClick;
}

function toggleHideOptionsButton() {
    state.hideOptionsButton = !state.hideOptionsButton;
    localStorage.setItem('hideOptionsButton', state.hideOptionsButton);
    document.getElementById('hideOptionsButtonCheckbox').checked = state.hideOptionsButton;
    document.body.classList.toggle('hide-options-button-active', state.hideOptionsButton);
    renderTVChannels();
}

function requestFullScreen() {
    if (document.fullscreenElement) {
        return;
    }
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function clearAllTVFilterVisuals() {
    document.querySelectorAll('#tvSidebar .tv-nav-link').forEach(link => {
        link.classList.remove('tv-sidebar-link-focused');
    });
    document.querySelectorAll('#tvBottomNav button').forEach(button => {
        button.classList.remove('tv-sidebar-link-focused');
    });
}

function applyTVFilter(filter, type) {
    let updateNeeded = false;
    if (type === 'brand') {
        if (filter === 'all' && state.tvSearchTerm) {
            state.tvSearchTerm = '';
            const tvSearchInput = document.getElementById('tvSearch');
            if (tvSearchInput) {
                tvSearchInput.value = '';
            }
            updateNeeded = true;
        }
        if (state.tvCurrentFilter !== filter) {
            state.tvCurrentFilter = filter;
            localStorage.setItem('tvCurrentFilter', filter);
            updateNeeded = true;
        } else if (filter === 'all' || filter === 'live' || filter === 'favorites' || filter === 'events_only') {
            updateNeeded = false;
        } else {
            state.tvCurrentFilter = 'all';
            localStorage.setItem('tvCurrentFilter', 'all');
            updateNeeded = true;
        }
        if (state.tvSportFilter !== 'all') {
            state.tvSportFilter = 'all';
            localStorage.setItem('tvSportFilter', 'all');
            updateNeeded = true;
        }
    }
    if (type === 'sport') {
        state.tvSportFilter = state.tvSportFilter === filter ? 'all' : filter;
        localStorage.setItem('tvSportFilter', state.tvSportFilter);
        updateNeeded = true;
        if (state.tvSportFilter !== 'all' && state.tvCurrentFilter !== 'all') {
            state.tvCurrentFilter = 'all';
            localStorage.setItem('tvCurrentFilter', 'all');
        }
    }
    if (updateNeeded) {
        renderTVChannels();
    }
}

function showStatusMessage(message, type = "info") {
    let statusElement;
    let container;
    container = document.getElementById('tvStatusMessageContainer');
    statusElement = container.querySelector(".status-message");
    if (!statusElement) {
        statusElement = document.createElement("div");
        statusElement.className = "status-message";
        container.prepend(statusElement);
    }
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.classList.remove('hide');
    if (type === 'error') {
        statusElement.style.color = 'var(--text)';
    } else if (type === 'warning') {
        statusElement.style.color = 'var(--warning)';
    } else if (type === 'success' || type === 'info') {
        statusElement.style.color = 'var(--primary)';
    } else {
        statusElement.style.color = '';
    }
    if (type === "success" || type === "info") {
        setTimeout(() => {
            statusElement.classList.add('hide');
            statusElement.addEventListener('transitionend', () => {
                if (statusElement.classList.contains('hide')) {
                    statusElement.remove();
                }
            }, {
                once: true
            });
        }, 3000);
    }
}

function saveBackup(data, key, contentHash = null) {
    try {
        localStorage.setItem(key, JSON.stringify({
            timestamp: new Date().getTime(),
            data,
            contentHash
        }));
    } catch (e) {
        console.error(`Error al guardar la copia de seguridad para ${key}:`, e);
    }
}

function loadBackup(key) {
    try {
        const backupData = localStorage.getItem(key);
        if (backupData) {
            const {
                timestamp,
                data,
                contentHash
            } = JSON.parse(backupData);
            const backupAgeHours = (new Date().getTime() - timestamp) / (1000 * 60 * 60);
            if (backupAgeHours > BACKUP_EXPIRY_HOURS) {
                localStorage.removeItem(key);
                return null;
            }
            return {
                timestamp,
                data,
                contentHash
            };
        }
    } catch (e) {
        console.error(`Error al cargar la copia de seguridad para ${key}:`, e);
    }
    return null;
}

function mergeChannels(channelsArray) {
    const allChannels = channelsArray;
    const eventChannels = allChannels.filter(channel => channel.source === 'events');
    const otherChannels = allChannels.filter(channel => channel.source !== 'events');
    const eventIds = new Set(eventChannels.map(channel => channel.id));
    const uniqueOtherChannelsMap = new Map();
    const orderedOtherSources = ['elcano', 'shickat', 'era', 'gist'];
    orderedOtherSources.forEach(source => {
        otherChannels.forEach(channel => {
            if (channel.source === source) {
                if (!eventIds.has(channel.id)) {
                    if (!uniqueOtherChannelsMap.has(channel.id)) {
                        uniqueOtherChannelsMap.set(channel.id, channel);
                    }
                }
            }
        });
    });
    const mergedOtherChannels = Array.from(uniqueOtherChannelsMap.values());
    return eventChannels.concat(mergedOtherChannels);
}

function loadAndRenderBackupChannels() {
    let allBackupChannels = [];
    let hasBackup = false;
    for (const key in BACKUP_KEYS) {
        const backup = loadBackup(BACKUP_KEYS[key]);
        if (backup && backup.data) {
            allBackupChannels = allBackupChannels.concat(backup.data.map(c => ({
                ...c,
                source: key,
                name: c.name || `Canal de ${key.toUpperCase()}`,
                id: c.id || `${key}_${Math.random()}`,
                number: (c.id || `${key}_${Math.random()}`).substring(0, 3),
                displayableName: c.displayableName || c.name
            })));
            hasBackup = true;
        }
    }
    if (allBackupChannels.length > 0) {
        const newChannels = mergeChannels(allBackupChannels);
        state.channelsData = newChannels;
        processChannelNames();
        renderTVChannels();
        return true;
    }
    return false;
}

async function fetchAndProcessSource(sourceName, url, processor, backupKey) {
    let channels = null;
    let message = '';
    let contentHash = null;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener el contenido de la fuente");
        const infoContent = await response.text();

        contentHash = await hashContent(infoContent);

        const backup = loadBackup(backupKey);

        if (backup && backup.contentHash === contentHash) {
            channels = backup.data;
            message = `Canales de ${sourceName} cargados (Sin cambios).`;
            console.log(`[${sourceName}] Contenido sin cambios. Usando backup local.`);
        } else {
            channels = await processor(infoContent);
            saveBackup(channels, backupKey, contentHash);
            message = `Canales de ${sourceName} cargados y actualizados.`;
            console.log(`[${sourceName}] Contenido actualizado o nuevo. Procesado y guardado.`);
        }

    } catch (error) {
        console.error(`Fallo al cargar de ${sourceName}:`, error);

        const backup = loadBackup(backupKey);
        if (backup && backup.data) {
            channels = backup.data;
            message = `Fallo de ${sourceName}. Mostrando canales del historial.`;
        } else {
            message = `Fallo de ${sourceName}. Sin historial disponible.`;
        }
    }

    return {
        name: sourceName,
        channels,
        message
    };
}

async function loadInitialChannels() {
    const tvChannelsGrid = document.getElementById("tvChannelsGrid");
    document.getElementById('tvStatusMessageContainer').innerHTML = '';
    const isShowingBackup = loadAndRenderBackupChannels();
    const temporaryLoadMessage = isShowingBackup ? "Mostrando historial. Obteniendo datos en tiempo real..." : "Cargando datos en tiempo real...";
    showStatusMessage(temporaryLoadMessage, "warning");
    const results = await Promise.allSettled([
        fetchAndProcessSource('events', EVENTS_URL, loadEventsSource, BACKUP_KEYS.events),
        fetchAndProcessSource('era', ERA_URL, loadEraChannels, BACKUP_KEYS.era),
        fetchAndProcessSource('gist', GIST_URL, loadGistChannels, BACKUP_KEYS.gist),
        fetchProxyContentAndProcess('shickat', SHICKAT_URL, processShickatData, BACKUP_KEYS.shickat),
        fetchProxyContentAndProcess('elcano', ELCANO_URL, processElcanoDataFromHtml, BACKUP_KEYS.elcano)
    ]);
    let allChannels = [];
    let hasFallback = false;
    let hasOnlineSuccess = false;
    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.channels) {
            if (result.value.message.includes('historial')) {
                hasFallback = true;
                allChannels = allChannels.concat(result.value.channels);
            } else {
                allChannels = allChannels.concat(result.value.channels);
                hasOnlineSuccess = true;
            }
        }
    });
    const statusElement = document.querySelector("#tvStatusMessageContainer .status-message");
    if (allChannels.length > 0) {
        const newChannels = mergeChannels(allChannels);
        state.channelsData = newChannels;
        processChannelNames();
        renderTVChannels();
        cleanObsoleteRatings();
        if (statusElement) statusElement.remove();
        if (hasOnlineSuccess) {
            if (hasFallback) {
                showStatusMessage("Canales actualizados (algunos con historial).", "warning");
            } else {
                showStatusMessage("Canales actualizados correctamente.", "success");
            }
        } else if (isShowingBackup) {
            showStatusMessage("Fallo al actualizar canales. Se sigue mostrando el historial.", "error");
        } else {
            tvChannelsGrid.innerHTML = ` <div class="no-results"><div class="no-results-icon">📡</div><div class="no-results-text">Error al cargar los canales.</div><div class="no-results-hint">No se han conseguido cargar los canales (modo offline/sin historial).</div><button class="retry-button" onclick="loadInitialChannels()">Reintentar</button></div> `;
            showStatusMessage("Error al cargar canales. Sin historial disponible.", "error");
        }
    } else if (isShowingBackup) {
        if (statusElement) statusElement.remove();
        showStatusMessage("Fallo al actualizar canales. Se sigue mostrando el historial.", "error");
    } else {
        if (statusElement) statusElement.remove();
        tvChannelsGrid.innerHTML = ` <div class="no-results-container"><div class="no-results"><div class=\"no-results-icon\">📡</div><div class=\"no-results-text\">Error al cargar los canales.</div><div class=\"no-results-hint\">No se han conseguido cargar los canales (modo offline/sin historial).</div><button class=\"retry-button\" onclick=\"loadInitialChannels()\">Reintentar</button></div></div> `;
        showStatusMessage("Error al cargar canales. Sin historial disponible.", "error");
    }
}

function normalizeChannelName(name) {
    if (name.includes('Eurosport 1')) {
        return '★EUROSPORT 1';
    } else if (name.includes('Eurosport 2')) {
        return '★EUROSPORT 2';
    } else if (name.includes('Eurosport')) {
        return '★EUROSPORT 1';
    } else if (name.includes('Teledeporte')) {
        return 'Teledeporte';
    }
    return name;
}

async function loadGistChannels(infoContent) {
    return processGistData(infoContent);
}

async function loadEraChannels(infoContent) {
    return processGistData(infoContent).map(c => ({
        ...c,
        source: 'era',
        name: c.name
    }));
}

function processGistData(infoCanales) {
    const numberedChannels = [];
    const lines = infoCanales.split('\n').filter(line => line.trim() !== '');
    const channelMappings = {
        'Movistar': 'M+',
        'DAZN LA LIGA 1': 'DAZN La Liga',
        'LALIGA': 'La Liga',
        'Premier': 'Premier League',
        'Eurosport': '★EUROSPORT',
        'HYPERMOTION': 'La Liga Hypermotion',
        'LIGA DE CAMPEONES': 'M+ Liga de Campeones',
        'PLUS': 'Plus',
        'VAMOS': 'Vamos',
        'Deportes': 'Deportes'
    };
    for (let i = 0; i < lines.length; i += 2) {
        const nameLine = lines[i].trim();
        const idLine = lines[i + 1] ? lines[i + 1].trim() : '';
        if (nameLine.includes('-->') && idLine.length > 0) {
            let namePart = nameLine.split('-->')[0].trim().toUpperCase();
            const acestreamId = idLine.replace(/p$/, '');
            if (acestreamId.length === 40) {
                let quality = 'SD';
                let multiAudio = false;
                if (namePart.includes('FHD')) {
                    quality = 'FHD';
                    namePart = namePart.replace('FHD', '').trim();
                } else if (namePart.includes('4K')) {
                    quality = '4K';
                    namePart = namePart.replace('4K', '').trim();
                } else if (namePart.includes('HD')) {
                    quality = 'HD';
                    namePart = namePart.replace('HD', '').trim();
                } else if (namePart.includes('SD')) {
                    quality = 'SD';
                    namePart = namePart.replace('SD', '').trim();
                }
                if (namePart.includes('MULTI')) {
                    multiAudio = true;
                    namePart = namePart.replace('MULTI', '').trim();
                }
                namePart = namePart.replace(/\(ES\)|\(Es\)/g, '', ).trim();
                let simplifiedName = namePart;
                for (const key in channelMappings) {
                    if (simplifiedName.includes(key)) {
                        simplifiedName = simplifiedName.replace(key, channelMappings[key]);
                    }
                }
                simplifiedName = normalizeChannelName(simplifiedName);
                numberedChannels.push({
                    id: acestreamId,
                    number: acestreamId.substring(0, 3),
                    name: simplifiedName,
                    quality: quality,
                    multiAudio: multiAudio,
                    isKnown: true,
                    source: 'gist'
                });
                trackFirstSeen(acestreamId);
            }
        }
    }
    return numberedChannels;
}

async function fetchProxyContentAndProcess(sourceName, url, processor, backupKey) {
    let lastError;
    let content = null;
    let finalMessage = '';

    for (const proxy of PROXIES) {
        try {
            const proxyUrl = proxy + encodeURIComponent(url);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(proxyUrl, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`Proxy ${proxy} responded with ${response.status}`);

            content = await response.text();

            const contentHash = await hashContent(content);

            const backup = loadBackup(backupKey);

            if (backup && backup.contentHash === contentHash) {
                finalMessage = `Canales de ${sourceName} cargados (Sin cambios).`;
                console.log(`[${sourceName}] Contenido sin cambios. Usando backup local.`);
                return {
                    name: sourceName,
                    channels: backup.data,
                    message: finalMessage
                };
            } else {
                const channels = await processor(content);
                saveBackup(channels, backupKey, contentHash);
                finalMessage = `Canales de ${sourceName} cargados y actualizados.`;
                console.log(`[${sourceName}] Contenido actualizado o nuevo. Procesado y guardado.`);
                return {
                    name: sourceName,
                    channels,
                    message: finalMessage
                };
            }

        } catch (error) {
            lastError = error;
            console.warn(`Proxy ${proxy} falló para ${sourceName}:`, error);
            continue;
        }
    }

    const backup = loadBackup(backupKey);
    if (backup && backup.data) {
        finalMessage = `Fallo de ${sourceName}. Mostrando canales del historial.`;
        return {
            name: sourceName,
            channels: backup.data,
            message: finalMessage
        };
    } else {
        finalMessage = `Fallo de ${sourceName}. Sin historial disponible.`;
        throw lastError || new Error(`Todos los proxies fallaron para la fuente ${sourceName}.`);
    }
}

async function loadElcanoSource(htmlContent) {
    return processElcanoDataFromHtml(htmlContent);
}

function processElcanoDataFromHtml(htmlContent) {
    const jsonMatch = htmlContent.match(/const linksData\s*=\s*({[\s\S]*?});/);
    if (!jsonMatch) throw new Error("No se encontró linksData o el formato HTML ha cambiado.");
    let jsonString = jsonMatch[1];
    jsonString = jsonString.replace(/\s*\/\/.*(?:\n|$)/g, '');
    jsonString = jsonString.replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
    const linksData = JSON.parse(jsonString);
    if (!linksData || !linksData.links || !Array.isArray(linksData.links)) {
        throw new Error("Estructura de linksData incorrecta o falta el array 'links'.");
    }
    return processElcanoData(linksData.links);
}

async function loadEventsSource(htmlContent) {
    return processEventsData(htmlContent);
}

async function loadShickatChannels(htmlContent) {
    return processShickatData(htmlContent);
}

function processShickatData(htmlContent) {
    const numberedChannels = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const cards = doc.querySelectorAll('article.canal-card');
    const nameMappings = {
        'Ellas Vamos': 'Ellas',
        'Movistar': 'M+',
        'Clasicos': 'Clásicos',
        'Accion': 'Acción',
        'Deportes': 'Deportes',
        'Plus': 'Plus',
        'M+ Liga de Campeones': 'M+ Liga de Campeones',
        'Golf': 'Golf'
    };
    cards.forEach(card => {
        const nameElement = card.querySelector('.canal-nombre');
        const acestreamLinkElement = card.querySelector('.acestream-link');
        if (nameElement && acestreamLinkElement) {
            const rawName = nameElement.textContent.trim();
            const acestreamId = acestreamLinkElement.textContent.trim();
            if (acestreamId.length === 40) {
                let quality = '720p';
                let simplifiedName = rawName;
                if (rawName.includes('(HD)')) {
                    quality = '720p';
                    simplifiedName = rawName.replace('(HD)', '').trim();
                } else if (rawName.includes('(FHD)')) {
                    quality = '1080p';
                    simplifiedName = simplifiedName.replace('(FHD)', '').trim();
                }
                const multiAudio = simplifiedName.includes('MultiAudio');
                for (const key in nameMappings) {
                    if (simplifiedName.includes(key)) {
                        simplifiedName = simplifiedName.replace(key, nameMappings[key]);
                        break;
                    }
                }
                if (simplifiedName.includes('M. LaLiga')) {
                    simplifiedName = simplifiedName.replace('M. LaLiga', 'M+ La Liga');
                } else if (simplifiedName.includes('Movistar')) {
                    simplifiedName = simplifiedName.replace('Movistar', 'M+');
                }
                if (simplifiedName.includes('LaLiga')) {
                    simplifiedName = simplifiedName.replace('LaLiga', 'La Liga');
                }
                simplifiedName = normalizeChannelName(simplifiedName);
                numberedChannels.push({
                    id: acestreamId,
                    number: acestreamId.substring(0, 3),
                    name: simplifiedName,
                    quality: quality,
                    multiAudio: multiAudio,
                    isKnown: true,
                    source: 'shickat'
                });
                trackFirstSeen(acestreamId);
            }
        }
    });
    return numberedChannels;
}

function processElcanoData(links) {
    const numberedChannels = [];
    const nameMap = {
        'M. LaLiga': 'M+ La Liga',
        'LaLiga Smartbank': 'La Liga Hypermotion',
        'LaLiga': 'La Liga',
        'MovistarPlus': 'M+ Plus',
        'Vamos': 'M+ Vamos',
        'Deporte': 'M+ Deportes',
        'Dedporte': 'M+ Deportes',
        'Dazn': 'DAZN',
        'Campeones': 'M+ Liga de Campeones'
    };
    links.forEach(link => {
        if (link.url && link.url.startsWith('acestream://')) {
            const acestreamId = link.url.split('://')[1];
            let quality = '720p';
            let multiAudio = false;
            if (link.name.includes('1080')) quality = '1080p';
            if (link.name.includes('720')) quality = '720p';
            if (link.name.includes('UHD')) quality = 'UHD';
            multiAudio = link.name.includes('MultiAudio') || link.name.includes('Multi Audio') || link.name.toLowerCase().includes('multi');
            let simplifiedName = link.name
                .replace(/1080P|1080|720|UHD|MultiAudio|Multi Audio|\(.*?\)/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            for (const key in nameMap) {
                if (simplifiedName.includes(key)) {
                    simplifiedName = simplifiedName.replace(key, nameMap[key]);
                    break;
                }
            }
            simplifiedName = normalizeChannelName(simplifiedName);
            numberedChannels.push({
                id: acestreamId,
                number: acestreamId.substring(0, 3),
                name: simplifiedName,
                quality: quality,
                multiAudio: multiAudio,
                isKnown: true,
                source: 'elcano'
            });
            trackFirstSeen(acestreamId);
        }
    });
    return numberedChannels;
}

function calculateDuration(sportName) {
    const normalizedName = normalizeText(sportName);

    // --- Lógica Específica para F1/Motorsport ---
    if (normalizedName.includes('formula 1') || normalizedName.includes('f1')) {
        if (normalizedName.includes('practice') || normalizedName.includes('entrenamiento')) {
            // Ejemplo: Free Practice / Práctica Libre -> 1 hora y 5 minutos
            return 65;
        } else if (normalizedName.includes('qualifying') || normalizedName.includes('clasificacion')) {
            // Ejemplo: Qualifying / Clasificación -> 1 hora y 30 minutos
            return 90;
        } else if (normalizedName.includes('race') || normalizedName.includes('carrera') || normalizedName.includes('gp')) {
            // Ejemplo: Race / Carrera (incluye el previo/post de 1 hora)
            return 180;
        }
        return 180; // Default para F1 si no se especifica el tipo de evento
    }

    // --- Lógica General de Deportes ---
    if (normalizedName.includes('futbol')) return 120; // 90 min + 30 min (previo/descanso/post)
    if (normalizedName.includes('baloncesto') || normalizedName.includes('nba')) return 150; // 48 min de juego + pausas y extras
    if (normalizedName.includes('tenis')) return 300; // La duración es muy variable (5 horas)
    if (normalizedName.includes('motor')) return 120; // 2 horas para otros deportes de motor
    if (normalizedName.includes('ciclismo')) return 180;
    if (normalizedName.includes('boxeo')) return 120;

    // Valor por defecto para otros eventos no clasificados (1 hora y 45 minutos)
    return 105;
}

function getEventTime(dateString, timeString) {
    const now = new Date();
    const date = parseDateString(dateString, now);
    if (date.getTime() === now.getTime()) {
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const eventTime = new Date(date);
    eventTime.setHours(hours, minutes, 0, 0);
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();
    if (dateString.toLowerCase() === 'hoy' || (eventTime.getDate() === todayDate && eventTime.getMonth() === todayMonth && eventTime.getFullYear() === todayYear)) {
        return eventTime;
    }
    return eventTime;
}

function processEventsData(htmlContent) {
    const numberedChannels = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const table = doc.querySelector('table');
    if (!table) {
        console.warn("No se encontró la tabla de eventos");
        return numberedChannels;
    }
    const rows = table.querySelectorAll('tbody tr');
    const channelMappings = {
        'Movistar': 'M+',
        'DAZN LA LIGA 1': 'DAZN La Liga',
        'LALIGA': 'La Liga',
        'Premier': 'Premier League',
        'Eurosport': '★EUROSPORT',
        'HYPERMOTION': 'La Liga Hypermotion',
        'LIGA DE CAMPEONES': 'M+ Liga de Campeones',
        'PLUS': 'Plus',
        'VAMOS': 'Vamos',
        'Deportes': 'Deportes'
    };
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            const date = cells[0].textContent.trim();
            const time = cells[1].textContent.trim();
            const sportName = cells[2].textContent.trim();
            const competition = cells[3].textContent.trim();
            const match = cells[4].textContent.trim();
            const canalesCell = cells[5];
            const links = canalesCell.querySelectorAll('a[href^="acestream://"]');
            if (links.length > 0) {
                // Concatenamos el nombre del deporte, competición y partido para un cálculo de duración más robusto
                const durationString = `${sportName} ${competition} ${match}`;
                const eventStartTime = getEventTime(date, time);
                const durationMinutes = calculateDuration(durationString);
                let sportEmoji = '❓';
                const normalizedSport = normalizeText(sportName);
                if (normalizedSport.includes('futbol')) {
                    sportEmoji = '⚽';
                } else if (normalizedSport.includes('handball') || normalizedSport.includes('handball')) {
                    sportEmoji = '🤾‍♂️';
                } else if (normalizedSport.includes('baloncesto') || normalizedSport.includes('basket') || normalizedSport.includes('nba')) {
                    sportEmoji = '🏀';
                } else if (normalizedSport.includes('tenis')) {
                    sportEmoji = '🎾';
                } else if (normalizedSport.includes('motogp') || normalizedSport.includes('motos')) {
                    sportEmoji = '🏍️';
                } else if (normalizedSport.includes('paddle') || normalizedSport.includes('padel')) {
                    sportEmoji = '🥎';
                } else if (normalizedSport.includes('triatlon') || normalizedSport.includes('triathlon')) {
                    sportEmoji = '🏊🚴🏃';
                } else if (normalizedSport.includes('motor') || normalizedSport.includes('rally')) {
                    sportEmoji = '🚗';
                } else if (normalizedSport.includes('f1') || normalizedSport.includes('formula')) {
                    sportEmoji = '🏎️';
                } else if (normalizedSport.includes('boxeo') || normalizedSport.includes('lucha')) {
                    sportEmoji = '🥊';
                } else if (normalizedSport.includes('ciclismo') || normalizedSport.includes('tour')) {
                    sportEmoji = '🚴';
                } else if (normalizedSport.includes('beisbol') || normalizedSport.includes('baseball')) {
                    sportEmoji = '⚾';
                } else if (normalizedSport.includes('golf')) {
                    sportEmoji = '⛳';
                } else if (normalizedSport.includes('voleibol') || normalizedSport.includes('voley')) {
                    sportEmoji = '🏐';
                } else if (normalizedSport.includes('hockey')) {
                    sportEmoji = '🏑';
                } else if (normalizedSport.includes('rugby')) {
                    sportEmoji = '🏉';
                } else if (normalizedSport.includes('natacion') || normalizedSport.includes('agua')) {
                    sportEmoji = '🏊';
                } else if (normalizedSport.includes('atletismo') || normalizedSport.includes('pista')) {
                    sportEmoji = '🏃';
                } else if (normalizedSport.includes('gimnasia')) {
                    sportEmoji = '🤸';
                } else if (normalizedSport.includes('esqui') || normalizedSport.includes('nieve')) {
                    sportEmoji = '⛷️';
                } else if (normalizedSport.includes('surf')) {
                    sportEmoji = '🏄';
                } else if (normalizedSport.includes('e-sports') || normalizedSport.includes('esports')) {
                    sportEmoji = '🎮';
                } else if (normalizedSport.includes('ajedrez')) {
                    sportEmoji = '♟️';
                } else if (normalizedSport.includes('dardos')) {
                    sportEmoji = '🎯';
                } else if (normalizedSport.includes('billares') || normalizedSport.includes('pool')) {
                    sportEmoji = '🎱';
                } else if (normalizedSport.includes('patinaje') || normalizedSport.includes('roller')) {
                    sportEmoji = '⛸️';
                } else if (normalizedSport.includes('criquet') || normalizedSport.includes('cricket')) {
                    sportEmoji = '🏏';
                }
                const eventEndTime = new Date(eventStartTime.getTime() + durationMinutes * 60000);
                links.forEach(link => {
                    const acestreamId = link.href.split('://')[1];
                    let channelName = link.textContent.trim();
                    for (const key in channelMappings) {
                        const regex = new RegExp(key, 'gi');
                        channelName = channelName.replace(regex, channelMappings[key]);
                    }
                    let simplifiedName = channelName
                        .replace(/Estable|New Era II|New Loop|New Era VI|FHD|4K|HD|UHD|MultiAudio|SD|\(.*?\)|-->.*$/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                    let quality = '720p';
                    if (channelName.includes('1080') || channelName.includes('FHD')) quality = '1080p';
                    if (channelName.includes('UHD') || channelName.includes('4K')) quality = 'UHD';
                    if (channelName.includes('SD') && !channelName.includes('FHD')) quality = 'SD';
                    const multiAudio = channelName.includes('Multi') || channelName.includes('multi');
                    simplifiedName = normalizeChannelName(simplifiedName);
                    numberedChannels.push({
                        id: acestreamId,
                        number: acestreamId.substring(0, 3),
                        name: simplifiedName,
                        quality: quality,
                        multiAudio: multiAudio,
                        isKnown: true,
                        source: 'events',
                        event: {
                            time,
                            competition,
                            match,
                            date,
                            sportEmoji,
                            sportName,
                            startTime: eventStartTime.getTime(),
                            endTime: eventEndTime.getTime()
                        }
                    });
                    trackFirstSeen(acestreamId);
                });
            }
        }
    });
    return numberedChannels;
}

function processChannelNames() {
    const brands = [{
        name: 'M+',
        class: 'movistar'
    }, {
        name: '★Eurosport',
        class: 'eurosport'
    }, {
        name: 'DAZN',
        class: 'dazn'
    }, {
        name: 'F1',
        class: 'f1'
    }, {
        name: 'Acción',
        class: 'action'
    }, {
        name: 'Deportes',
        class: 'sports'
    }, {
        name: 'Clásicos',
        class: 'cinema-red'
    }, {
        name: 'Vamos',
        class: 'vamos'
    }, {
        name: 'Copa del Rey',
        class: 'copadelrey'
    }, {
        name: 'Liga de Campeones',
        class: 'champions'
    }, {
        name: 'La Liga',
        class: 'liga'
    }, {
        name: 'Hypermotion',
        class: 'hypermotion'
    }, {
        name: 'Golf',
        class: 'golf'
    }, {
        name: '★EUROSPORT\\d+',
        class: 'eurosport-number',
        regex: true
    }, {
        name: 'Smartbank',
        class: 'smartbank'
    }, {
        name: 'Plus',
        class: 'plus'
    }, {
        name: 'Western',
        class: 'western'
    }, {
        name: 'Documentales',
        class: 'documentary'
    }, {
        name: 'Originales',
        class: 'originals'
    }, {
        name: 'Hits',
        class: 'cinema-red'
    }, {
        name: 'Estrenos',
        class: 'cinema-red'
    }, {
        name: 'Indie',
        class: 'cinema-red'
    }, {
        name: 'Cine Español',
        class: 'cinema-red'
    }, {
        name: 'Drama',
        class: 'cinema-red'
    }, {
        name: 'Ellas',
        class: 'ellas'
    }, {
        name: 'Series',
        class: 'series'
    }];
    state.channelsData.forEach(channel => {
        let result = channel.name;
        brands.forEach(brand => {
            if (brand.regex) {
                const regex = new RegExp(`(${brand.name})`, 'gi');
                result = result.replace(regex, `<span class="${brand.class}">$1</span>`);
            } else {
                const escapedName = brand.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp(`(${escapedName})`, 'gi');
                result = result.replace(regex, `<span class="${brand.class}">$1</span>`);
            }
        });
        const comediaRegex = /(comedia)/gi;
        result = result.replace(comediaRegex, '<span class="degradado-comedia">Comedia</span>');
        channel.displayableName = result;
    });
}

function compareChannelsForSort(a, b) {
    const channelA = state.channelsData.find(c => c.id === a.id) || a;
    const channelB = state.channelsData.find(c => c.id === b.id) || b;

    const ratingA = state.channelRatings[channelA.id] !== undefined ? state.channelRatings[channelA.id] : 2.5;
    const ratingB = state.channelRatings[channelB.id] !== undefined ? state.channelRatings[channelB.id] : 2.5;

    if (ratingA !== ratingB) {
        return ratingB - ratingA;
    }

    const qualityMap = {
        'UHD': 6,
        '4K': 5,
        'FHD': 4,
        'HD': 3,
        'SD': 2,
        'N/A': 1
    };
    const qualityA = qualityMap[standardizeQuality(channelA.quality)] || 0;
    const qualityB = qualityMap[standardizeQuality(channelB.quality)] || 0;
    if (qualityB !== qualityA) {
        return qualityB - qualityA;
    }

    return channelA.name.localeCompare(channelB.name);
}

function getBestChannelInSubgroup(channels) {
    if (!channels || channels.length === 0) return null;

    const mainChannelName = channels[0].name.trim().toLowerCase();
    const lastPlayedId = state.lastPlayedByChannel[mainChannelName];

    if (lastPlayedId) {
        const lastPlayedChannel = channels.find(c => c.id === lastPlayedId);
        if (lastPlayedChannel) {
            const rating = state.channelRatings[lastPlayedId] !== undefined ? state.channelRatings[lastPlayedId] : 2.5;
            if (rating >= 3) {
                const others = channels.filter(c => c.id !== lastPlayedId);
                return [lastPlayedChannel, ...others].sort(compareChannelsForSort)[0];
            }
        }
    }

    const sortedChannels = [...channels].sort((a, b) => {
        const ratingA = state.channelRatings[a.id] !== undefined ? state.channelRatings[a.id] : 2.5;
        const ratingB = state.channelRatings[b.id] !== undefined ? state.channelRatings[b.id] : 2.5;
        if (ratingA !== ratingB) {
            return ratingB - ratingA;
        }
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        const qualityMap = {
            'UHD': 6,
            '4K': 5,
            'FHD': 4,
            'HD': 3,
            'SD': 2,
            'N/A': 1
        };
        const qualityA = qualityMap[standardizeQuality(a.quality)] || 0;
        const qualityB = qualityMap[standardizeQuality(b.quality)] || 0;
        if (qualityB !== qualityA) {
            return qualityB - qualityA;
        }
        const sourcePriorityMap = {
            'gist': 4,
            'era': 3,
            'events': 2,
            'shickat': 1,
            'elcano': 0,
            'history': -1
        };
        const sourceA = sourcePriorityMap[a.source] || 0;
        const sourceB = sourcePriorityMap[b.source] || 0;
        if (sourceB !== sourceA) {
            return sourceB - sourceA;
        }
        return a.name.localeCompare(b.name);
    });
    return sortedChannels[0];
}

function getGroupedChannels() {
    const filteredChannels = filterChannels();
    const allEventChannels = state.channelsData.filter(c => c.source === 'events');
    filteredChannels.forEach(channel => {
        channel.isLive = isChannelLive(channel, allEventChannels);
    });
    const sortedChannels = [...filteredChannels].sort((a, b) => {
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        const aIsOff = a.name.includes('(OFF)');
        const bIsOff = b.name.includes('(OFF)');
        if (aIsOff && !bIsOff) return 1;
        if (!aIsOff && bIsOff) return -1;
        const nameNumberA = getChannelNumberFromName(a.name);
        const nameNumberB = getChannelNumberFromName(b.name);
        if (nameNumberA !== nameNumberB) {
            return nameNumberA - nameNumberB;
        }
        const qualityMap = {
            '4K': 5,
            'FHD': 4,
            'HD': 3,
            'SD': 2,
            'N/A': 1,
            'UHD': 6
        };
        const qualityA = qualityMap[standardizeQuality(a.quality)] || 0;
        const qualityB = qualityMap[standardizeQuality(b.quality)] || 0;
        if (qualityB !== qualityA) {
            return qualityB - qualityA;
        }
        const sourcePriorityMap = {
            'gist': 4,
            'era': 3,
            'events': 2,
            'shickat': 1,
            'elcano': 0,
            'history': -1
        };
        const sourceA = sourcePriorityMap[a.source] || 0;
        const sourceB = sourcePriorityMap[b.source] || 0;
        if (sourceB !== sourceA) {
            return sourceB - sourceA;
        }
        return a.name.localeCompare(b.name);
    });
    const groups = {};
    const eventGroupKeysByChannelName = new Map();
    sortedChannels.forEach(channel => {
        let groupName;
        let isEventGroup = false;

        // Nueva Lógica de Agrupación: Si el filtro es 'all', agrupamos por marca y forzamos ocultar detalles de evento
        if (state.tvCurrentFilter === 'all') {
            groupName = determineBrandGroup(channel);
            isEventGroup = false;
        }
        // Si el filtro es 'events_only', agrupamos por evento y mostramos detalles
        else if (state.tvCurrentFilter === 'events_only' && channel.source === 'events' && channel.event) {
            groupName = `${channel.event.date}###${channel.event.competition}###${channel.event.match}`;
            isEventGroup = true;
        }
        // Lógica original para otros filtros (incluyendo Live, Favorites, Marcas, y Eventos fuera del filtro 'events_only' o 'all')
        else if (channel.source === 'events' && channel.event) {
            groupName = `${channel.event.date}###${channel.event.competition}###${channel.event.match}`;
            isEventGroup = true;
            const normalizedChannelName = normalizeText(channel.name);
            if (!eventGroupKeysByChannelName.has(normalizedChannelName)) {
                eventGroupKeysByChannelName.set(normalizedChannelName, new Set());
            }
            eventGroupKeysByChannelName.get(normalizedChannelName).add(groupName);
        } else {
            groupName = determineBrandGroup(channel);
            const normalizedChannelName = normalizeText(channel.name);
            if (!state.hideEventDetails && eventGroupKeysByChannelName.has(normalizedChannelName)) {
                const eventGroupKeys = eventGroupKeysByChannelName.get(normalizedChannelName);
                for (const eventGroupKey of eventGroupKeys) {
                    const eventGroup = groups[eventGroupKey];
                    if (eventGroup) {
                        eventGroup.channels.push(channel);
                        return;
                    }
                }
            }
        }

        if (!groups[groupName]) {
            groups[groupName] = {
                name: groupName,
                channels: [],
                isEvent: isEventGroup,
                time: isEventGroup ? channel.event.time : null,
                date: isEventGroup ? channel.event.date : null,
                sportEmoji: isEventGroup ? channel.event.sportEmoji : null,
                sportName: isEventGroup ? channel.event.sportName : null,
                competition: isEventGroup ? channel.event.competition : null,
                match: isEventGroup ? channel.event.match : null,
                hasLive: channel.isLive
            };
        } else {
            if (channel.isLive) {
                groups[groupName].hasLive = true;
            }
        }
        groups[groupName].channels.push(channel);
    });
    Object.values(groups).forEach(group => {
        const subGroups = {};
        group.channels.forEach(channel => {
            let subGroupName = channel.name.trim();
            if (group.name === 'Otros') {
                const normalizedChannelName = normalizeText(channel.name);
                let foundSubGroup = null;
                for (const subGroupKey of OTHER_SUBGROUPS) {
                    const normalizedSubGroupKey = normalizeText(subGroupKey);
                    if (normalizedChannelName.includes(normalizedSubGroupKey)) {
                        foundSubGroup = subGroupKey;
                        break;
                    }
                }
                subGroupName = foundSubGroup || subGroupName;
            }
            if (subGroupName.includes('DAZN') && subGroupName.includes('BAR')) {
                subGroupName = subGroupName.replace(' BAR', '').trim();
            }
            if (!subGroups[subGroupName]) {
                subGroups[subGroupName] = [];
            }
            subGroups[subGroupName].push(channel);
        });
        group.subGroups = subGroups;
    });
    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
        const groupA = groups[a];
        const groupB = groups[b];
        const aHasLive = groupA.channels.some(c => c.isLive);
        const bHasLive = groupB.channels.some(c => c.isLive);
        if (aHasLive && !bHasLive) return -1;
        if (!aHasLive && bHasLive) return 1;
        if (groupA.isEvent && groupB.isEvent) {
            const dateCompare = compareEventDates(groupA, groupB);
            if (dateCompare !== 0) return dateCompare;
            return a.localeCompare(b);
        }
        if (groupA.isEvent && !groupB.isEvent) return -1;
        if (!groupA.isEvent && groupB.isEvent) return 1;
        const indexA = groupOrder.indexOf(a);
        const indexB = groupOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) {
            return a.localeCompare(b);
        }
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
    if (groups['Otros']) {
        sortedGroupKeys.push(sortedGroupKeys.splice(sortedGroupKeys.indexOf('Otros'), 1)[0]);
    }
    return {
        groups,
        sortedGroupKeys
    };
}

function filterChannels() {
    let filteredChannels = state.channelsData;
    const searchTerm = state.tvSearchTerm.trim().toLowerCase();
    state.searchTerm = state.tvSearchTerm.trim();

    if (searchTerm) {
        filteredChannels = filteredChannels.filter(channel => {
            const normalizedSearchTerm = normalizeText(searchTerm);
            const nameMatches = normalizeText(channel.name).includes(normalizedSearchTerm);
            const idMatches = channel.id && channel.id.toLowerCase().includes(normalizedSearchTerm.replace('#', ''));
            let eventDetailsMatch = false;
            if (channel.event) {
                const {
                    time,
                    competition,
                    match,
                    date,
                    sportName
                } = channel.event;
                eventDetailsMatch = normalizeText(time || '').includes(normalizedSearchTerm) || normalizeText(sportName || '').includes(normalizedSearchTerm) || normalizeText(competition || '').includes(normalizedSearchTerm) || normalizeText(match || '').includes(normalizedSearchTerm) || normalizeText(date || '').includes(normalizedSearchTerm);
            }
            return nameMatches || idMatches || eventDetailsMatch;
        });
    }

    let currentFilter = state.tvCurrentFilter;
    let currentSportFilter = state.tvSportFilter;

    if (currentSportFilter !== 'all') {
        currentFilter = 'all';
    }

    if (currentFilter === 'events_only') {
        filteredChannels = filteredChannels.filter(c => c.source === 'events');
    } else if (currentFilter === 'favorites') {
        filteredChannels = filteredChannels.filter(c => state.favorites.includes(c.id));
    } else if (currentFilter === 'live') {
        filteredChannels = filteredChannels.filter(c => {
            const allEventChannels = state.channelsData.filter(ch => ch.source === 'events');
            return isChannelLive(c, allEventChannels);
        });
    } else if (currentFilter !== 'all' && currentFilter !== 'events_only' && currentFilter !== 'live' && currentFilter !== 'favorites') {
        filteredChannels = filteredChannels.filter(channel => normalizeText(channel.name).includes(normalizeText(currentFilter.replace('+', ''))));
    }

    if (currentSportFilter !== 'all') {
        const normalizedSportFilter = normalizeText(currentSportFilter);
        const sportSearchTerms = {
            'futbol': ['futbol', 'soccer', 'Hypermotion', 'copa del rey', 'premier league', 'bundesliga', 'serie a'],
            'baloncesto': ['baloncesto', 'basket', 'nba', 'euroliga'],
            'tenis': ['tenis', 'wimbledon', 'roland garros', 'us open', 'atp', 'wta'],
            'motorsport': ['gp', 'motogp', 'dakar', 'rally', 'wrc', 'nascar', 'motor'],
            'f1': ['f1', 'fórmula 1', 'formula 1', 'formulaone', 'fórmulaone']
        };
        let targetTerms = sportSearchTerms[normalizedSportFilter] || [normalizedSportFilter];
        if (normalizedSportFilter === 'motorsport' && sportSearchTerms['f1']) {
            targetTerms = targetTerms.concat(sportSearchTerms['f1']);
        }
        filteredChannels = filteredChannels.filter(channel => {
            const normalizedName = normalizeText(channel.name);
            const eventDetailsMatch = channel.event && (
                normalizeText(channel.event.sportName || '').includes(normalizedSportFilter) ||
                targetTerms.some(term => normalizeText(channel.event.competition || '').includes(term)) ||
                targetTerms.some(term => normalizeText(channel.event.match || '').includes(term))
            );
            const nameMatch = targetTerms.some(term => normalizedName.includes(term));
            return eventDetailsMatch || nameMatch;
        });
    }

    return filteredChannels;
}

function standardizeQuality(quality) {
    if (!quality) return 'SD';
    quality = quality.toLowerCase();
    if (quality.includes('uhd') || quality.includes('4k')) {
        return '4K';
    }
    if (quality.includes('1080') || quality.includes('fhd')) {
        return 'FHD';
    }
    if (quality.includes('720') || quality.includes('hd')) {
        return 'HD';
    }
    return 'SD';
}

function getChannelNumberFromName(name) {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
}

function formatEventDate(dateString) {
    const normalizedDate = dateString.toLowerCase();
    const today = new Date();

    // 1. Manejar "Hoy", "Mañana", "Ayer" (Devolver solo el día)
    if (normalizedDate === 'hoy' || normalizedDate === 'mañana' || normalizedDate === 'ayer') {
        const date = parseDateString(dateString, today);
        const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Si es "Hoy" o "Mañana", devolvemos la palabra en español para la conjugación correcta (Eventos de Hoy)
        if (normalizedDate === 'hoy' || normalizedDate === 'mañana') {
            return normalizedDate.charAt(0).toUpperCase() + normalizedDate.slice(1);
        }

        // Si es "Ayer", devolvemos el día de la semana para una mejor UX
        return weekdays[date.getDay()];
    }

    // 2. Manejar formato de fecha DD/MM/YY o DD/MM/YYYY (Devolver "el [Día] [fecha]")
    const parts = dateString.split('/');
    if (parts.length >= 2 && parts.length <= 3) {
        const date = parseDateString(dateString, today);
        const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Devuelve el día y la fecha original (ej: "el Sábado 13/7/25")
        return `el ${weekdays[date.getDay()]} ${dateString}`;
    }

    // 3. Fallback: Devolver la cadena original
    return dateString;
}

function compareEventDates(eventA, eventB) {
    const today = new Date();
    const dateStringA = eventA.date.toLowerCase();
    const dateStringB = eventB.date.toLowerCase();

    const isTodayA = dateStringA === 'hoy';
    const isTodayB = dateStringB === 'hoy';
    const isTomorrowA = dateStringA === 'mañana';
    const isTomorrowB = dateStringB === 'mañana';
    const isYesterdayA = dateStringA === 'ayer';
    const isYesterdayB = dateStringB === 'ayer';

    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    if (isTodayA && isTodayB) return eventA.time.localeCompare(eventB.time);

    if (isTomorrowA && !isTomorrowB) return -1;
    if (!isTomorrowA && isTomorrowB) return 1;
    if (isTomorrowA && isTomorrowB) return eventA.time.localeCompare(eventB.time);

    if (isYesterdayA && !isYesterdayB) return -1;
    if (!isYesterdayA && isYesterdayB) return 1;
    if (isYesterdayA && isYesterdayB) return eventA.time.localeCompare(eventB.time);

    const dateA = parseDateString(eventA.date, today);
    const dateB = parseDateString(eventB.date, today);

    if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
    }
    return eventA.time.localeCompare(eventB.time);
}

function parseDateString(dateString, today) {
    const normalizedDate = dateString.toLowerCase();
    if (normalizedDate === 'mañana') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    }
    if (normalizedDate === 'ayer') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday;
    }
    const parts = dateString.split('/');
    if (parts.length >= 2 && parts.length <= 3) {
        // Asume formato DD/MM/YY o DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mes es 0-indexado
        let year = parts[2] ? parseInt(parts[2], 10) : today.getFullYear();

        if (parts.length === 2) {
            year = today.getFullYear(); // Si falta el año, usa el actual
        }

        if (year < 100) {
            year = year + 2000;
        }

        const date = new Date(year, month, day);

        // Validación básica para evitar fechas inválidas que JS pueda interpretar
        if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
            return today;
        }

        return date;
    }
    return today;
}

function isChannelLive(channel, allEventChannels) {
    if (channel.source !== 'events' || !channel.event) {
        return false;
    }
    const now = new Date().getTime();
    const event = channel.event;
    const liveStartTime = event.startTime - (15 * 60 * 1000);
    const liveEndTime = event.endTime;
    const isTimeframeLive = now >= liveStartTime && now <= liveEndTime;
    if (!isTimeframeLive) {
        return false;
    }
    const isConflicted = findConflictingSiblings(channel, allEventChannels);
    if (isConflicted) {
        return false;
    }
    return true;
}

function findConflictingSiblings(currentChannel, allEventChannels) {
    const currentChannelName = normalizeText(currentChannel.name);
    const currentStartTime = currentChannel.event.startTime;
    const conflictingSibling = allEventChannels.find(sibling => {
        if (sibling.id === currentChannel.id || sibling.source !== 'events' || !sibling.event) {
            return false;
        }
        const siblingChannelName = normalizeText(sibling.name);
        const siblingStartTime = sibling.event.startTime;
        const isSameChannelName = siblingChannelName === currentChannelName;
        const isScheduledLater = siblingStartTime > currentStartTime;
        if (isSameChannelName && isScheduledLater) {
            const now = new Date().getTime();
            const siblingLiveStartTime = siblingStartTime - (15 * 60 * 1000);
            if (now >= siblingLiveStartTime) {
                return true;
            }
        }
        return false;
    });
    return !!conflictingSibling;
}
const groupOrder = [
    'DAZN F1',
    'DAZN',
    'DAZN La Liga',
    'DAZN Baloncesto',
    'M+ La Liga',
    'Liga de Campeones',
    'La Liga Hypermotion',
    'M+ Vamos',
    'M+ Deportes',
    'M+ Plus',
    'M+ Golf',
    'M+ Cine y Series',
    '★EUROSPORT'
];
const groupRegexes = {
    'DAZN F1': /DAZN F1/i,
    'DAZN Baloncesto': /DAZN Baloncesto/i,
    'DAZN La Liga': /DAZN La Liga/i,
    'DAZN': /DAZN(?!.*F1|.*La Liga|.*Baloncesto)/i,
    'Liga de Campeones': /Liga de Campeones/i,
    'La Liga Hypermotion': /La Liga Hypermotion/i,
    'M+ La Liga': /M\+ La Liga/i,
    'M+ Vamos': /M\+ Vamos/i,
    'M+ Deportes': /M\+ Deportes/i,
    'M+ Plus': /M\+ Plus/i,
    'M+ Golf': /M\+ Golf/i,
    'M+ Cine y Series': /M\+(?!.*La Liga|.*Vamos|.*Deportes|.*Plus|.*Golf|.*Liga de Campeones)/i,
    '★EUROSPORT': /★EUROSPORT/i,
};

function determineBrandGroup(channel) {
    const channelName = channel.name;
    const normalizedName = normalizeText(channelName);

    if (channelName.includes('Ellas')) {
        return 'M+ Vamos';
    }

    if (channelName.includes('★EUROSPORT') && channelName.includes('(')) {
        return 'Otros';
    }
    if (groupRegexes['DAZN'] && groupRegexes['DAZN'].test(channelName)) {
        if (normalizedName.includes('eventos') || normalizedName.includes('eleven')) {
            return 'Otros';
        }
    }
    for (const groupName of groupOrder) {
        if (groupRegexes[groupName] && groupRegexes[groupName].test(channelName)) {
            return groupName;
        }
    }
    return 'Otros';
}

function playChannel(acestreamId) {
    const acestreamUrl = `acestream://${acestreamId}`;
    const newWindow = window.open(acestreamUrl, '_blank');
    setTimeout(() => {
        if (newWindow && newWindow.closed) {} else {}
    }, 500);
}

function handleChannelPlay(channelToPlay) {
    if (state.lastChannelPlay) {
        updateChannelRating(state.lastChannelPlay.channelId, channelToPlay.id);
    }

    const now = new Date().getTime();
    state.lastChannelPlay = {
        channelId: channelToPlay.id,
        timestamp: now
    };
    localStorage.setItem('lastChannelPlay', JSON.stringify(state.lastChannelPlay));

    state.lastPlayedByChannel[channelToPlay.name.trim().toLowerCase()] = channelToPlay.id;
    localStorage.setItem('lastPlayedByChannel', JSON.stringify(state.lastPlayedByChannel));

    playChannel(channelToPlay.id);
}

function updateChannelRating(previousChannelId, currentChannelId) {
    const now = new Date().getTime();
    const previousChannelData = state.channelsData.find(c => c.id === previousChannelId);

    if (!previousChannelData) return;

    const duration = (now - state.lastChannelPlay.timestamp) / 1000;
    let rating = state.channelRatings[previousChannelId] !== undefined ? state.channelRatings[previousChannelId] : 2.5;
    let newRating = rating;

    const previousName = previousChannelData.name.toLowerCase().trim();
    const currentChannelData = state.channelsData.find(c => c.id === currentChannelId);
    const currentName = currentChannelData ? currentChannelData.name.toLowerCase().trim() : '';

    if (previousChannelId !== currentChannelId && previousName === currentName) {
        if (duration >= (30 * 60)) {
            newRating += 1.5;
        } else if (duration >= (15 * 60)) {
            newRating += 0.5;
        } else if (duration >= (5 * 60)) {
            newRating -= 1;
        } else if (duration >= 10) {
            newRating -= 1.5;
        } else {
            newRating -= 2;
        }
    } else if (previousChannelId !== currentChannelId && previousName !== currentName) {
        if (duration >= (30 * 60)) {
            newRating += 1.5;
        } else {
            newRating = rating;
        }
    } else if (previousChannelId === currentChannelId) {
        return;
    }

    state.channelRatings[previousChannelId] = Math.max(1, Math.min(5, newRating));
    saveRatings();

    renderTVChannels();
}

function showCopyModal(acestreamId) {
    const acestreamUrl = `acestream://${acestreamId}`;
    const copyModal = document.getElementById('copyModal');
    const copyAceStreamBtn = document.getElementById('copyAceStreamBtn');
    const urlDisplayAceStream = document.getElementById('copyUrlDisplayAceStream');
    urlDisplayAceStream.textContent = acestreamUrl;
    copyAceStreamBtn.onclick = () => copyUrlToClipboard(acestreamUrl, 'AceStream');
    copyModal.classList.add('active');
}

async function copyAcestreamDirectly(acestreamId) {
    const acestreamUrl = `acestream://${acestreamId}`;
    try {
        await navigator.clipboard.writeText(acestreamUrl);
        showCopySuccessMessage('AceStream');
    } catch (err) {
        console.error('Error al copiar el texto: ', err);
        alert('No se pudo copiar la URL. Por favor, hazlo manualmente.');
    }
}

function hideCopyModal() {
    document.getElementById('copyModal').classList.remove('active');
}

function showCopySuccessMessage(format = 'AceStream') {
    const messageElement = document.getElementById('copyMessage');
    messageElement.textContent = `${format} URL copiada con éxito!`;
    messageElement.classList.add('show');
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 2000);
}

async function copyUrlToClipboard(urlToCopy, format) {
    try {
        await navigator.clipboard.writeText(urlToCopy);
        hideCopyModal();
        showCopySuccessMessage(format);
    } catch (err) {
        console.error('Error al copiar el texto: ', err);
        alert('No se pudo copiar la URL. Por favor, hazlo manualmente.');
    }
}

function changePrimaryColor(color) {
    state.primaryColor = color;
    const rgb = hexToRgb(color);
    document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', color === '#2563eb' ? '#1e50c7' : color);
    updatePrimaryLightColor();
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.color-option[data-color="${color}"]`).classList.add('active');
    localStorage.setItem('primaryColor', color);
    renderTVChannels();
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {
        r,
        g,
        b
    };
}

function updatePrimaryLightColor() {
    const rgb = hexToRgb(state.primaryColor);
    const isDarkMode = true;
    document.documentElement.style.setProperty('--primary-light', isDarkMode ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
}

function cleanObsoleteRatings() {
    const activeChannelIds = new Set(state.channelsData.map(c => c.id));
    const ratingsToKeep = {};
    for (const channelId in state.channelRatings) {
        if (activeChannelIds.has(channelId)) {
            ratingsToKeep[channelId] = state.channelRatings[channelId];
        }
    }
    state.channelRatings = ratingsToKeep;
    saveRatings();
    console.log("Puntuaciones de canales obsoletas limpiadas.");
}

function saveRatings() {
    localStorage.setItem('channelRatings', JSON.stringify(state.channelRatings));
}

function resetRatings() {
    if (confirm('¿Estás seguro de que quieres restablecer todas las puntuaciones de los canales?')) {
        localStorage.removeItem('channelRatings');
        state.channelRatings = {};
        renderTVChannels();
        showStatusMessage("Puntuaciones de canales restablecidas.", "success");
        document.getElementById('settingsModal').classList.remove('modal--active');
    }
}

function getStarRating(score) {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
        stars += '<span class="half-star">★</span>';
    }
    const emptyStars = '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return `<span style="color: var(--primary);">${stars}</span><span style="color: gray;">${emptyStars}</span>`;
}

function restoreTVFilterUI() {
    clearAllTVFilterVisuals();

    if (state.tvSportFilter !== 'all') {
        const sportBtn = document.querySelector(`.tv-nav-link[data-sport-key="${state.tvSportFilter}"]`);
        if (sportBtn) {
            sportBtn.classList.add('tv-sidebar-link-focused');
        }
    } else {
        const brandLink = document.querySelector(`.tv-nav-link[data-filter="${state.tvCurrentFilter}"]`);
        if (brandLink) {
            brandLink.classList.add('tv-sidebar-link-focused');
        }
    }
}

const createTVChannelCard = (channel, allOptionsJson = '[]') => {
    const logoInfo = getPlaceholderInfo(channel.name);
    const isLiveClass = '';
    let bgColor = 'var(--card-bg)';
    let backgroundImageStyle = '';
    let logoClass = '';
    let nameStyle = 'white';

    let channelNameHTML = `<h3 style="font-size: 0.6rem; font-weight: 700; color: ${nameStyle}; white-space: normal; text-align: center;">${channel.displayableName}</h3>`;

    let liveIndicator = '';
    if (channel.isLive) {
        liveIndicator = `<span style="color: var(--primary); font-weight: 700; animation: soft-blink 1.5s infinite ease-in-out;">🔴 EN VIVO</span>`;
    }

    if (logoInfo) {
        const fullUrl = LOGOPEDIA_BASE_URL + logoInfo.url;
        const proxiedUrl = proxyImage(fullUrl);
        backgroundImageStyle = `background-image: url('${proxiedUrl}');`;
        logoClass = logoInfo.class;

        channelNameHTML = `<h3 style="font-size: 0.6rem; font-weight: 700; color: ${nameStyle}; white-space: normal; text-align: center; opacity: 0;">${channel.displayableName}</h3>`;

    } else {
        if (channel.name.includes('DAZN') && !channel.name.includes('F1')) bgColor = '#353535';
        else if (channel.name.includes('DAZN F1')) bgColor = '#353535';
        else if (channel.name.includes('M+')) bgColor = '#0085C1';
        else if (channel.name.includes('EUROSPORT')) bgColor = '#5e17eb';
        backgroundImageStyle = `background: linear-gradient(to top, rgba(0,0,0,0.6) 100%, rgba(0,0,0,0) 100%), ${bgColor};`;

        channelNameHTML = `<div style="position: absolute; bottom: 5px; left: 5px; right: 5px; text-align: center;"><h3 style="font-size: 0.6rem; font-weight: 700; color: ${nameStyle}; white-space: normal; margin: 0;">${channel.displayableName}</h3></div>`;
    }

    const rating = state.channelRatings[channel.id] !== undefined ? state.channelRatings[channel.id] : 2.5;
    const ratingStars = getStarRating(rating);
    const optionsButton = `<button class="tv-link-button" data-channel-id="${channel.id}" title="Ver opciones alternativas">+</button>`;

    return ` <div class="tv-card ${isLiveClass} ${logoClass}" data-channel-id="${channel.id}" data-all-options='${allOptionsJson}' style="${backgroundImageStyle}" tabindex="0" role="button" aria-label="Ver canal ${channel.name}"> ${optionsButton} ${channelNameHTML}</div> `;
};

function createTVChannelsHTML(groups, sortedGroupKeys) {
    if (sortedGroupKeys.length === 0) {
        // Nuevo HTML para el mensaje de no resultados, envuelto en el nuevo div para centrar
        return `
                    <div class="no-results-container">
                        <div class="no-results">
                            <div class="no-results-icon">📡</div>
                            <div class="no-results-text">No se encontraron canales</div>
                            <div class="no-results-hint">Prueba con otros filtros o términos de búsqueda</div>
                        </div>
                    </div>
                `;
    }

    let html = '';
    let lastDateRendered = null;
    const isEventMode = state.tvCurrentFilter === 'events_only';
    const isAllMode = state.tvCurrentFilter === 'all';

    for (const groupKey of sortedGroupKeys) {
        const group = groups[groupKey];
        const subGroups = group.subGroups;
        if (group.isEvent) {
            const formattedDate = formatEventDate(group.date);
            if (formattedDate !== lastDateRendered) {

                let prefix = 'Eventos del ';
                let coloredDateHtml = formattedDate;
                const parts = formattedDate.split(' ');
                const firstWord = parts[0].toLowerCase();

                if (firstWord === 'hoy' || firstWord === 'mañana' || firstWord === 'ayer' || firstWord === 'el') {
                    prefix = 'Eventos de ';

                    // Si empieza con 'el', la estructura es "el [Día] [fecha]". Coloreamos el día y la fecha.
                    if (firstWord === 'el') {
                        const dayOfWeek = parts[1]; // Ejemplo: "Sábado"
                        const datePart = parts.slice(2).join(' '); // Ejemplo: "13/7/25"
                        coloredDateHtml = `el <span style="color: var(--primary);">${dayOfWeek} ${datePart}</span>`;
                    }
                    // Si es 'Hoy', 'Mañana', o 'Ayer', coloreamos solo esa palabra
                    else {
                        coloredDateHtml = `<span style="color: var(--primary);">${formattedDate}</span>`;
                    }
                } else {
                    // Caso donde formattedDate es solo la fecha (ej. "13/7/25"). Coloreamos la fecha completa.
                    coloredDateHtml = `<span style="color: var(--primary);">${formattedDate}</span>`;
                }

                // Construimos el encabezado con el prefijo y la fecha coloreada
                html += `<h2 class="tv-date-header">${prefix}${coloredDateHtml}</h2>`;
                lastDateRendered = formattedDate;
            }
        } else {
            lastDateRendered = null;
        }
        let groupTitle = group.name;
        let groupTitleStyle = '';

        if (group.isEvent) {
            // Esta sección se ejecuta para CUALQUIER grupo de evento (isEvent: true)
            const liveTimeClass = group.hasLive ? 'live-time-blink' : '';

            // MODIFICACIÓN CLAVE: Aplicar estilo al nombre de la competición (group.competition)
            const competitionHtml = `<span style="color: var(--primary);">${group.competition}</span>`;

            groupTitle = `<span class="${liveTimeClass}" style="margin-right: 7.5px;">${group.time}</span> ${group.sportEmoji} ${competitionHtml} - ${group.match}`;

            const isFirstGroupAfterDateHeader = !lastDateRendered || (group.date && formatEventDate(group.date) === lastDateRendered);
            if (isFirstGroupAfterDateHeader) {
                groupTitleStyle = 'margin-top: 0;';
            }
        } else if (group.name.includes('###')) {
            // Si el nombre del grupo contiene '###' (grupo de evento renderizado bajo filtro de marca o All)
            if (isAllMode) {
                // En modo 'all', omitimos los grupos de evento para evitar duplicidad de canales
                continue;
            }

            // Lógica para mostrar eventos con formato completo (independientemente del filtro)
            const parts = group.name.split('###');
            if (parts.length >= 3) {
                // El formato es: Date###Competition###Match
                const competition = parts[1];
                const match = parts[2];
                const eventInfo = group.channels[0]?.event;
                const sportEmoji = eventInfo?.sportEmoji || '❓';
                const time = eventInfo?.time || ''; // <--- Hora del evento
                const competitionHtml = `<span style="color: var(--primary);">${competition}</span>`;

                // Se muestra la hora, emoji, competición y el partido
                groupTitle = `<span style="margin-right: 7.5px;">${time}</span> ${sportEmoji} ${competitionHtml} - ${match}`;
            } else {
                // Fallback por si el formato es inesperado
                groupTitle = group.name.replace(/###/g, ' - ');
            }
        }
        html += ` <div class="tv-group"><header class="tv-group-header"><h2 class="tv-group-title" style="${groupTitleStyle}">${groupTitle}</h2></header> `;
        let cardsHTML = '';
        const sortedSubGroupNames = Object.keys(subGroups).sort((a, b) => {
            const aHasLive = subGroups[a].some(c => c.isLive);
            const bHasLive = subGroups[b].some(c => c.isLive);
            if (aHasLive && !bHasLive) return -1;
            if (!aHasLive && bHasLive) return 1;
            return a.localeCompare(b);
        });

        sortedSubGroupNames.forEach(subGroupName => {
            const channels = subGroups[subGroupName];
            const bestChannel = getBestChannelInSubgroup(channels);
            if (!bestChannel) return;

            const allOptions = channels.map(c => ({
                id: c.id,
                name: c.displayableName,
                quality: standardizeQuality(c.quality),
                multiAudio: c.multiAudio,
                source: c.source,
                rating: state.channelRatings[c.id] !== undefined ? state.channelRatings[c.id] : 2.5
            }));
            const allOptionsJson = JSON.stringify(allOptions);

            cardsHTML += createTVChannelCard(bestChannel, allOptionsJson);
        });

        if (cardsHTML) {
            html += `<div class="tv-subgroup-content">${cardsHTML}</div>`;
        }

        html += `</div>`;
    }
    return html;
}

function renderTVChannels() {
    const tvGrid = document.getElementById('tvChannelsGrid');
    if (!tvGrid) return;

    const statusContainer = document.getElementById('tvStatusMessageContainer');
    if (statusContainer) {
        statusContainer.innerHTML = '';
    }

    const previouslyFocusedElement = state.tvFocusManager ? state.tvFocusManager.currentFocus : null;

    restoreTVFilterUI();

    const {
        groups,
        sortedGroupKeys
    } = getGroupedChannels();
    tvGrid.innerHTML = createTVChannelsHTML(groups, sortedGroupKeys);

    // Añadir/eliminar la clase de centrado si no hay canales
    if (sortedGroupKeys.length === 0) {
        tvGrid.classList.add('no-channels');
    } else {
        tvGrid.classList.remove('no-channels');
    }

    attachTVCardEvents();

    if (state.tvFocusManager) {
        state.tvFocusManager.updateFocusableElements();

        const tvSearch = document.getElementById('tvSearch');

        // Prioridad 1: Mantener el foco si el usuario estaba escribiendo en la búsqueda.
        if (previouslyFocusedElement === tvSearch || (tvSearch && document.activeElement === tvSearch)) {
            state.tvFocusManager.setFocus(tvSearch);
            return;
        }

        // Prioridad 2: Mantener el foco si estaba en un elemento aún presente (e.g., botón de ajustes).
        if (previouslyFocusedElement && document.body.contains(previouslyFocusedElement)) {
            state.tvFocusManager.setFocus(previouslyFocusedElement);
            return;
        }

        // Prioridad 3 (NUEVO): Enfocar el filtro activo en la barra lateral.
        let elementToFocus = null;
        const activeSportFilterLink = document.querySelector(`.tv-nav-link.sport-filter.tv-sidebar-link-focused`);
        const activeBrandLink = document.querySelector(`.tv-nav-link[data-filter="${state.tvCurrentFilter}"].tv-sidebar-link-focused`);

        elementToFocus = activeSportFilterLink || activeBrandLink;

        if (elementToFocus) {
            state.tvFocusManager.setFocus(elementToFocus);
            return;
        }

        // Fallback: Enfocar 'Todos'
        state.tvFocusManager.setFocus(document.querySelector('.tv-nav-link[data-filter="all"]'));
    }
}
const attachTVCardEvents = () => {
    const cards = document.querySelectorAll('.tv-card');
    cards.forEach(card => {
        card.removeEventListener('click', handleTVCardPlay);
        card.addEventListener('click', handleTVCardPlay);
        const optionsButton = card.querySelector('.tv-link-button');
        // IMPORTANTE: Aseguramos que el evento del botón SIEMPRE esté asociado
        if (optionsButton) {
            optionsButton.removeEventListener('click', handleTVCardOptionsClick);
            optionsButton.addEventListener('click', handleTVCardOptionsClick);
        }

        // Si el botón está oculto, asociamos el evento de opciones al clic de la tarjeta, 
        // pero SÓLO si el clic no es un "play" normal (e.g., el clic en la esquina inferior derecha)
        if (state.hideOptionsButton) {
            card.removeEventListener('auxiliaryclick', handleTVCardOptionsClick);
            // Usamos un nombre de evento auxiliar o una comprobación de coordenadas, 
            // pero para simplificar y cumplir con el requisito de "sigue funcionando si pulsas" en el área del botón:
            // Dejamos que el clic principal dispare play (handleTVCardPlay)
            // y la funcionalidad del botón la asociamos con un clic secundario (por ejemplo, doble clic o clic derecho, si no usáramos un control remoto).
            // Para el propósito del TV-Mode (navegación con flechas/Enter), el botón sigue siendo seleccionable, y el clic principal de la tarjeta es para "Play".

            // Si el requisito es que la tarjeta haga Play en cualquier lado, pero el clic **en el área del botón** abra las opciones:
            // Necesitaríamos una lógica de coordenadas. Para el modo TV, lo más sencillo es que el **Enter** en la tarjeta haga Play, y un **botón dedicado** haga Opciones.
            // Ya que el botón existe (`.tv-link-button`), y se hace invisible con CSS, si el botón tiene un `click` listener, este se disparará si el usuario logra hacer clic exactamente en el área *invisible* del botón.

            // La solución más simple y robusta para este caso de uso (botón invisible con funcionalidad) es dejar que el evento del botón se capture *solamente* por el botón.
            // Si el usuario hace clic en el área visible de la tarjeta, se dispara `handleTVCardPlay`.
            // Si el usuario logra hacer clic exactamente en el área invisible del botón, se dispara `handleTVCardOptionsClick` (porque el botón tiene `visibility: hidden`, no `display: none`).

            // Ya que `handleTVCardPlay` tiene `if (e.target.closest('.tv-link-button')) { return; }`, 
            // si el botón es clicado, el evento se propaga al botón, se dispara `handleTVCardOptionsClick`, y `handleTVCardPlay` se detiene.

            // Con `visibility: hidden` aplicado por CSS, la funcionalidad es correcta sin más cambios en JS.
        }
    });
};

const handleTVCardPlay = (e) => {
    if (e.target.closest('.tv-link-button')) {
        // Si se hace clic en el botón de opciones, no hacer play
        return;
    }
    const card = e.currentTarget;
    const channelId = card.getAttribute('data-channel-id');
    const channel = state.channelsData.find(c => c.id === channelId);

    if (!channel) return;

    const optionsJson = card.getAttribute('data-all-options');
    let allOptions = [];
    try {
        allOptions = JSON.parse(optionsJson);
    } catch (error) {
        console.error("Error al parsear opciones para TV Card:", error);
        handleChannelPlay(channel);
        return;
    }

    const now = new Date().getTime();
    const RECENT_FAILURE_THRESHOLD_MS = 40 * 60 * 1000;
    let channelToPlay = channel;
    let statusMessage = '';

    if (state.lastChannelPlay &&
        state.lastChannelPlay.channelId === channel.id &&
        (now - state.lastChannelPlay.timestamp) < RECENT_FAILURE_THRESHOLD_MS) {

        const sortedOptions = allOptions
            .map(opt => state.channelsData.find(c => c.id === opt.id))
            .filter(c => c)
            .sort(compareChannelsForSort);

        const alternativeChannel = sortedOptions[1];

        if (alternativeChannel) {
            channelToPlay = alternativeChannel;

            statusMessage = `❌ Fallo detectado en ${channel.name}. Abriendo alternativa: ${alternativeChannel.name} (${standardizeQuality(alternativeChannel.quality)}).`;
            showStatusMessage(statusMessage, 'error');

        } else {
            statusMessage = `⚠️ ${channel.name} ha fallado de nuevo. Sin alternativas. Reintentando...`;
            showStatusMessage(statusMessage, 'warning');
        }
    }

    handleChannelPlay(channelToPlay);
}

const handleTVCardOptionsClick = (e) => {
    e.stopPropagation();
    const card = e.currentTarget.closest('.tv-card');
    const channelId = card.getAttribute('data-channel-id');
    const optionsJson = card.getAttribute('data-all-options');
    const channel = state.channelsData.find(c => c.id === channelId);
    if (channel && optionsJson) {
        try {
            const allOptions = JSON.parse(optionsJson);
            showTvOptionsModal(channel.name, allOptions);
        } catch (error) {
            console.error("Error al parsear las opciones del canal:", error);
            handleChannelPlay(channel);
        }
    }
};

function showTvOptionsModal(mainChannelName, optionsList) {
    const modal = document.getElementById('tvChannelOptionsModal');
    const nameSpan = document.getElementById('tvModalChannelName');
    const listDiv = document.getElementById('tvModalChannelList');
    nameSpan.innerHTML = state.channelsData.find(c => c.name === mainChannelName)?.displayableName || mainChannelName;
    listDiv.innerHTML = '';

    const lastPlayedId = state.lastPlayedByChannel[mainChannelName.trim().toLowerCase()];

    const renderOptionItem = (option) => {
        const isFavorite = state.favorites.includes(option.id);
        const favoriteIcon = isFavorite ? '★' : '☆';
        const favoriteClass = isFavorite ? 'is-favorite' : 'is-not-favorite';

        const isLastViewed = option.id === lastPlayedId;
        const lastViewedIndicator = isLastViewed ? '<span class="last-viewed-indicator" title="Último AceStream reproducido para este canal">👁️</span>' : '';

        const ratingStars = getStarRating(option.rating);
        let sourceBadgeText = '';
        let sourceBadgeClass = '';
        switch (option.source) {
            case 'gist':
                sourceBadgeClass = 'gist-badge';
                sourceBadgeText = 'NE';
                break;
            case 'era':
                sourceBadgeClass = 'era-badge';
                sourceBadgeText = 'ER';
                break;
            case 'elcano':
                sourceBadgeClass = 'elcano-badge';
                sourceBadgeText = 'EC';
                break;
            case 'events':
                sourceBadgeClass = 'events-badge';
                sourceBadgeText = 'EV';
                break;
            case 'shickat':
                sourceBadgeClass = 'shickat-badge';
                sourceBadgeText = 'SH';
                break;
        }
        const sourceBadge = `<span class="${sourceBadgeClass}" style="font-size: 0.35rem; font-weight: 700; padding: 1px 2.5px; border-radius: 1.5px; color: white;">${sourceBadgeText}</span>`;

        const item = document.createElement('div');
        item.className = 'channel-option-item';
        item.setAttribute('data-id', option.id);
        const channelDisplayName = option.name;

        item.innerHTML = `
                    <div class="channel-option-name-container">
                        <button class="favorite-toggle-btn ${favoriteClass}" data-id="${option.id}" title="Marcar como favorito">${favoriteIcon}</button>
                        ${lastViewedIndicator}
                        <span class="channel-option-name">${channelDisplayName}</span>
                    </div>
                    <div class="channel-option-details">
                        ${ratingStars}
                        ${option.quality}
                        ${option.multiAudio ? '🎧' : ''}
                        <span class="channel-number-display" style="font-weight: 700; color: var(--channel-number-color);">${option.id.substring(0, 3)}</span>
                        ${sourceBadge}
                    </div>
                `;

        item.onclick = (e) => {
            if (e.target.closest('.favorite-toggle-btn')) {
                return;
            }
            const fullChannel = state.channelsData.find(c => c.id === option.id);
            if (fullChannel) {
                handleChannelPlay(fullChannel);
            }
            hideTvOptionsModal();
        };

        item.querySelector('.favorite-toggle-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            const channelIdToToggle = this.getAttribute('data-id');

            toggleFavorite(channelIdToToggle);

            const isNowFavorite = state.favorites.includes(channelIdToToggle);
            this.textContent = isNowFavorite ? '★' : '☆';
            this.classList.toggle('is-favorite', isNowFavorite);
            this.classList.toggle('is-not-favorite', !isNowFavorite);

            showStatusMessage(`Canal ${isNowFavorite ? 'añadido' : 'eliminado'} de favoritos.`, 'info');

        });

        listDiv.appendChild(item);
    };

    optionsList
        .map(option => {
            const channel = state.channelsData.find(c => c.id === option.id);
            const rating = channel ? (state.channelRatings[channel.id] || 2.5) : 2.5;
            const qualityMap = {
                'UHD': 6,
                '4K': 5,
                'FHD': 4,
                'HD': 3,
                'SD': 2,
                'N/A': 1
            };
            const qualityScore = channel ? (qualityMap[standardizeQuality(channel.quality)] || 0) : 0;

            return { ...option,
                rating,
                qualityScore,
                isLastViewed: option.id === lastPlayedId
            };
        })
        .sort((a, b) => {
            if (a.isLastViewed && !b.isLastViewed) return -1;
            if (!a.isLastViewed && b.isLastViewed) return 1;

            if (b.rating !== a.rating) return b.rating - a.rating;

            if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;

            return a.name.localeCompare(b.name);
        })
        .forEach(renderOptionItem);


    modal.classList.add('modal--active');
}

function hideTvOptionsModal() {
    document.getElementById('tvChannelOptionsModal').classList.remove('modal--active');
}

function initializeTVNavigation() {
    if (state.tvFocusManager) {
        document.removeEventListener('keydown', state.tvFocusManager.handleKeyDown);
    }
    const tvNavigation = {
        currentFocus: null,
        focusableElements: [],
        init: function() {
            this.updateFocusableElements();
            if (document.activeElement.id === 'tvSearch') {
                this.setFocus(document.getElementById('tvSearch'));
            } else if (this.focusableElements.length > 0) {
                // Al inicio, restaurar el filtro activo si existe, o ir a 'todos'
                const activeFilterLink = document.querySelector(`.tv-nav-link[data-filter="${state.tvCurrentFilter}"]`);
                const activeSportFilterLink = document.querySelector(`.tv-nav-link[data-sport-key="${state.tvSportFilter}"]`);

                this.setFocus(activeSportFilterLink || activeFilterLink || document.querySelector('.tv-nav-link[data-filter="all"]'));
            }
            this.handleKeyDown = this.handleKeyDown.bind(this);
            document.addEventListener('keydown', this.handleKeyDown);
        },
        removeFocusClasses: function() {
            document.querySelectorAll('.tv-card-focused').forEach(el => el.classList.remove('tv-card-focused'));
            document.querySelectorAll('.tv-sidebar-link-focused').forEach(el => el.classList.remove('tv-sidebar-link-focused'));
        },
        updateFocusableElements: function() {
            const searchElement = document.getElementById('tvSearch');
            const sidebarLinks = Array.from(document.querySelectorAll('.tv-nav-link'));
            const allCards = Array.from(document.querySelectorAll('.tv-card'));
            const settingsModeBtn = document.getElementById('settingsModeBtn');
            this.focusableElements = [searchElement, ...sidebarLinks, settingsModeBtn, ...allCards].filter(el => el && el.offsetParent !== null);
        },
        setFocus: function(element) {
            if (!element) return;
            this.removeFocusClasses();
            this.currentFocus = element;

            if (element.id === 'tvSearch') {
                element.focus();
            } else if (element.id === 'settingsModeBtn') {
                element.focus();
                element.classList.add('tv-sidebar-link-focused');
            } else {
                element.focus();
                element.classList.add(element.classList.contains('tv-card') ? 'tv-card-focused' : 'tv-sidebar-link-focused');
            }
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        },
        handleKeyDown: function(e) {
            let nextElement = null;
            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    e.preventDefault();
                    nextElement = this.moveFocus(e.key);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.selectFocused();
                    return;
                case 'Escape':
                case 'Backspace':
                    e.preventDefault();
                    if (document.getElementById('settingsModal').classList.contains('modal--active')) {
                        document.getElementById('settingsModal').classList.remove('modal--active');
                        return;
                    }
                    if (document.getElementById('tvChannelOptionsModal').classList.contains('modal--active')) {
                        hideTvOptionsModal();
                        return;
                    }
                    if (this.currentFocus.id === 'tvSearch' && this.currentFocus.value.length > 0) {
                        this.currentFocus.value = '';
                        state.tvSearchTerm = '';
                        renderTVChannels();
                        return;
                    }
                    if (this.currentFocus.classList.contains('tv-card') || this.currentFocus.classList.contains('tv-nav-link')) {
                        applyTVFilter('all', 'brand');
                        this.setFocus(document.querySelector('.tv-nav-link[data-filter="all"]'));
                        return;
                    }

                    if (this.currentFocus === document.querySelector('.tv-nav-link[data-filter="all"]')) {
                        this.setFocus(document.getElementById('tvSearch'));
                        return;
                    }

                    if (this.currentFocus.id === 'settingsModeBtn') {
                        this.setFocus(document.querySelector('.tv-nav-link[data-filter="all"]'));
                        return;
                    }

                    return;
            }
            if (nextElement) {
                this.setFocus(nextElement);
            }
        },
        moveFocus: function(direction) {
            this.updateFocusableElements();
            const allCards = Array.from(document.querySelectorAll('.tv-card'));
            const sidebarElements = Array.from(document.querySelectorAll('#tvSearch, .tv-nav-link, #settingsModeBtn'));
            const focusedIndex = sidebarElements.indexOf(this.currentFocus);

            if (sidebarElements.includes(this.currentFocus)) {
                if (direction === 'ArrowDown' && focusedIndex < sidebarElements.length - 1) {
                    return sidebarElements[focusedIndex + 1];
                } else if (direction === 'ArrowUp' && focusedIndex > 0) {
                    return sidebarElements[focusedIndex - 1];
                } else if (direction === 'ArrowRight' && allCards.length > 0) {
                    return allCards[0];
                }
            } else if (allCards.includes(this.currentFocus)) {
                const currentRow = this.currentFocus.closest('.tv-subgroup-content');
                if (!currentRow) return null;
                const cardsInCurrentRow = Array.from(currentRow.querySelectorAll('.tv-card'));
                const indexInRow = cardsInCurrentRow.indexOf(this.currentFocus);
                const allRows = Array.from(document.querySelectorAll('.tv-subgroup-content'));
                const currentRowIndex = allRows.indexOf(currentRow);

                if (direction === 'ArrowRight') {
                    if (indexInRow < cardsInCurrentRow.length - 1) {
                        return cardsInCurrentRow[indexInRow + 1];
                    }
                } else if (direction === 'ArrowLeft') {
                    if (indexInRow > 0) {
                        return cardsInCurrentRow[indexInRow - 1];
                    } else {
                        return document.getElementById('settingsModeBtn');
                    }
                } else if (direction === 'ArrowDown') {
                    if (currentRowIndex < allRows.length - 1) {
                        const nextRow = allRows[currentRowIndex + 1];
                        const cardsInNextRow = Array.from(nextRow.querySelectorAll('.tv-card'));
                        return cardsInNextRow[Math.min(indexInRow, cardsInNextRow.length - 1)];
                    }
                } else if (direction === 'ArrowUp') {
                    if (currentRowIndex > 0) {
                        const prevRow = allRows[currentRowIndex - 1];
                        const cardsInPrevRow = Array.from(prevRow.querySelectorAll('.tv-card'));
                        return cardsInPrevRow[Math.min(indexInRow, cardsInPrevRow.length - 1)];
                    } else {
                        return null;
                    }
                }
            }
            return null;
        },
        selectFocused: function() {
            if (this.currentFocus) {
                if (this.currentFocus.classList.contains('tv-card')) {
                    this.currentFocus.click();
                } else if (this.currentFocus.classList.contains('tv-nav-link')) {
                    this.currentFocus.click();
                } else if (this.currentFocus.id === 'tvSearch') {
                    this.currentFocus.focus();
                } else if (this.currentFocus.id === 'settingsModeBtn') {
                    document.getElementById('settingsModal').classList.add('modal--active');
                    setTimeout(() => {
                        document.getElementById('closeSettingsBtn').focus();
                    }, 100);
                }
            }
        }
    };
    state.tvFocusManager = tvNavigation;
    tvNavigation.init();
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('dark-mode');
    document.body.classList.add('tv-mode-active');

    // Inicialización del nuevo ajuste
    document.body.classList.toggle('hide-options-button-active', state.hideOptionsButton);

    initializeTVNavigation();
    loadInitialChannels();

    document.getElementById('fullScreenOnClickCheckbox').checked = state.fullScreenOnClick;
    document.getElementById('hideOptionsButtonCheckbox').checked = state.hideOptionsButton; // Establecer estado inicial del nuevo switch

    const copyModal = document.getElementById('copyModal');
    const cancelCopyBtn = document.getElementById('cancelCopyBtn');
    cleanupOldFirstSeenRecords();

    if (cancelCopyBtn) {
        cancelCopyBtn.addEventListener('click', hideCopyModal);
    }
    document.getElementById('closeTvOptionsBtn').addEventListener('click', hideTvOptionsModal);
    window.addEventListener('click', (event) => {
        if (event.target === copyModal) {
            hideCopyModal();
        }
    });

    // Event Listener de Pantalla Completa al Clic
    document.body.addEventListener('click', (e) => {
        if (state.fullScreenOnClick &&
            !e.target.closest('.modal') &&
            !e.target.closest('#tvSidebar') &&
            e.target.id !== 'tvSearch') {
            requestFullScreen();
        }
    });

    document.getElementById('settingsModeBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('modal--active');
    });

    document.querySelectorAll('#tvSidebar .tv-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (TV_BRAND_FILTER_KEYS.includes(this.dataset.filter)) {
                applyTVFilter(this.dataset.filter, 'brand');
            } else if (TV_SPORT_FILTER_KEYS.includes(this.dataset.sportKey)) {
                applyTVFilter(this.dataset.sportKey, 'sport');
            }
            if (state.tvFocusManager) {
                state.tvFocusManager.setFocus(this);
            }
        });
    });

    let tvSearchTimeout;
    document.getElementById('tvSearch').addEventListener('input', function(e) {
        clearTimeout(tvSearchTimeout);
        tvSearchTimeout = setTimeout(() => {
            state.tvSearchTerm = e.target.value;
            renderTVChannels();
        }, 300);
    });
    document.getElementById('fullScreenOnClickCheckbox').addEventListener('change', toggleFullScreenOnClick);
    // NUEVO EVENT LISTENER para el nuevo switch
    document.getElementById('hideOptionsButtonCheckbox').addEventListener('change', toggleHideOptionsButton);
    document.getElementById('closeSettingsBtn').addEventListener('click', () => document.getElementById('settingsModal').classList.remove('modal--active'));
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => changePrimaryColor(btn.dataset.color));
    });
    changePrimaryColor(state.primaryColor);

    document.addEventListener('click', (e) => {
        if (e.target.closest('.channel-number-badge-button')) {
            const button = e.target.closest('.channel-number-badge-button');
            e.stopPropagation();
            const channelId = button.dataset.id;
            copyAcestreamDirectly(channelId);
        }
    });

    setInterval(() => {
        renderTVChannels();
    }, 60000);
});
