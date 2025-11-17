const state = { 
    allChannels: [], 
    channelsData: [], 
    currentFilter: localStorage.getItem('currentFilter') || 'all', 
    searchTerm: localStorage.getItem('searchTerm') || '', 
    favorites: JSON.parse(localStorage.getItem('favorites')) || [], 
    channelHistory: JSON.parse(localStorage.getItem('channelHistory')) || {}, 
    currentChannel: null, 
    clearButtonClickCount: 0, 
    lastClearButtonClickTime: 0, 
    isOnline: navigator.onLine, 
    elcanoRetries: 0, 
    eventsRetries: 0, 
    darkMode: localStorage.getItem('darkMode') !== 'false', 
    primaryColor: localStorage.getItem('primaryColor') || '#2563eb', 
    isFavoriteMode: false, 
    channelRatings: JSON.parse(localStorage.getItem('channelRatings')) || {}, 
    lastChannelPlay: JSON.parse(localStorage.getItem('lastChannelPlay')) || null, 
    firstSeen: JSON.parse(localStorage.getItem('firstSeen')) || {}, 
    sportFilter: localStorage.getItem('sportFilter') || 'all', 
    hideEventDetails: localStorage.getItem('hideEventDetails') === 'true', 
    isTVMode: localStorage.getItem('isTVMode') === 'true', 
    tvCurrentFilter: localStorage.getItem('tvCurrentFilter') || 'all', 
    tvSearchTerm: '', 
    tvFocusManager: null, 
    playerActive: false 
}; 
const ERA_URL = "https://ipfs.io/ipns/k2k4r8oqlcjxsritt5mczkcn4mmvcmymbqw7113fz2flkrerfwfps004/data/listas/listaplana.txt";
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
const SPORT_FILTER_BUTTON_IDS = ['filterFutbol', 'filterBaloncesto', 'filterTenis', 'filterBoxeo', 'filterCiclismo', 'filterMotorsport', 'filterF1']; 
const BRAND_FILTER_BUTTON_IDS = ['filterDAZN', 'filterMovistar', 'filterEurosport', 'filterFavorites', 'clearEmojiFilters']; 
const OTHER_SUBGROUPS = [ 
    'LIGA ENDESA', 'CANAL DE TENIS', 'SUPERTENNIS', 'BUNDESLIGA', 'PRIMERA FEDERACIÓN', '1RFEF', 'ARAGON TV', 'BEIN', 'BT SPORT', 'CANAL+SPORT', 'ESPN', 'ESSPN', 'SKY', 'ESPORT 3', 'FOX', 'GOL PLAY', 'REAL MADRID TV', 'ORANGE TV', 'RALLY TV', 'MOTOR', 'NBA', 'NFL', 'PREMIER SPORTS', 'DISCOVERY CHANNEL', 'DARK', 'AMC', 'LA 1', 'LA 2', 'ANTENA 3', 'Cuatro', 'Telecinco', 'LA SEXTA', '24 HORAS', 'TELEDEPORTE', 'CAZA Y PESCA', 'CANAL COCINA', 'DECASA', 'ONETORO', 'ZIGGO', 'XTRM', 'MIXED TV','DAZN', '(DE)', '(PL)', '(RU)'
];

function normalizeText(text) { 
    if (!text) return ''; 
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); 
} 
function extractPID(enlace) { 
    if (!enlace) return ''; 
    return enlace.replace('acestream://', '').trim(); 
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
    if (state.isTVMode) { 
        renderTVChannels(); 
    } else { 
        renderResults(); 
    } 
} 
function updateFavoriteModeVisuals() { 
    const saveButton = document.getElementById('saveFavoritesButton'); 
    if (state.isFavoriteMode) { 
        saveButton.classList.add('floating-save-button--active'); 
        document.getElementById('filterFavorites').classList.add('filter-button--active'); 
    } else { 
        saveButton.classList.remove('floating-save-button--active'); 
        if (state.currentFilter !== 'favorites') { 
            document.getElementById('filterFavorites').classList.remove('filter-button--active'); 
        } 
    } 
    renderResults(); 
} 
function disableFavoriteMode() { 
    if (state.isFavoriteMode) { 
        state.isFavoriteMode = false; 
        updateFavoriteModeVisuals(); 
        showStatusMessage("Selección de favoritos guardada.", "success"); 
    } 
} 
function toggleDarkMode() { 
    state.darkMode = !state.darkMode; 
    localStorage.setItem('darkMode', state.darkMode); 
    document.body.classList.toggle('dark-mode', state.darkMode); 
    document.getElementById('darkModeCheckbox').checked = state.darkMode; 
    updatePrimaryLightColor(); 
} 
function toggleHideEventDetails() { 
    state.hideEventDetails = !state.hideEventDetails; 
    localStorage.setItem('hideEventDetails', state.hideEventDetails); 
    document.getElementById('hideEventDetailsCheckbox').checked = state.hideEventDetails; 
    document.body.classList.toggle('hide-event-details', state.hideEventDetails); 
    renderResults(); 
} 
function clearAllFilterVisuals() { 
    BRAND_FILTER_BUTTON_IDS.forEach(id => { 
        const btn = document.getElementById(id); 
        if(btn) btn.classList.remove('filter-button--active'); 
    }); 
    SPORT_FILTER_BUTTON_IDS.forEach(id => { 
        const btn = document.getElementById(id); 
        if(btn) btn.classList.remove('filter-button--active'); 
    }); 
} 
function applyFilter(filter) { 
    state.currentFilter = filter; 
    localStorage.setItem('currentFilter', filter); 
    if (filter === 'all') { 
        state.searchTerm = ''; 
        localStorage.setItem('searchTerm', ''); 
        document.getElementById('searchInput').value = ''; 
        state.sportFilter = 'all'; 
        localStorage.setItem('sportFilter', 'all'); 
    } 
    disableFavoriteMode(); 
    clearAllFilterVisuals(); 
    let targetId; 
    if (filter === 'dazn') targetId = 'filterDAZN'; 
    else if (filter === 'm+') targetId = 'filterMovistar'; 
    else if (filter === 'eurosport') targetId = 'filterEurosport'; 
    else if (filter === 'favorites') targetId = 'filterFavorites'; 
    else if (filter === 'all') targetId = 'clearEmojiFilters'; 
    if (targetId) { 
        document.getElementById(targetId).classList.add('filter-button--active'); 
    } 
    renderResults(); 
} 
function applySportFilter(sportKey) { 
    state.sportFilter = state.sportFilter === sportKey ? 'all' : sportKey; 
    localStorage.setItem('sportFilter', state.sportFilter); 
    if (state.sportFilter !== 'all') { 
        state.currentFilter = 'all'; 
        localStorage.setItem('currentFilter', 'all'); 
    } 
    disableFavoriteMode(); 
    clearAllFilterVisuals(); 
    if (state.sportFilter !== 'all') { 
        document.querySelector(`.sport-filter-button[data-sport-key="${sportKey}"]`).classList.add('filter-button--active'); 
    } else { 
        restoreFilterUI(); 
    } 
    renderResults(); 
} 
function showStatusMessage(message, type = "info") { 
    let statusElement = document.querySelector(".status-message"); 
    if (!statusElement) { 
        statusElement = document.createElement("div"); 
        statusElement.className = "status-message"; 
        const channelsGrid = document.getElementById("channelsGrid"); 
        channelsGrid.prepend(statusElement); 
    } 
    statusElement.textContent = message; 
    statusElement.className = `status-message ${type}`; 
    statusElement.classList.remove('hide'); 
    if (type === "success" || type === "info") { 
        setTimeout(() => { 
            statusElement.classList.add('hide'); 
            statusElement.addEventListener('transitionend', () => { 
                if (statusElement.classList.contains('hide')) { 
                    statusElement.remove(); 
                } 
            }, { once: true }); 
        }, 3000); 
    } 
} 
function saveBackup(data, key) { 
    try { 
        localStorage.setItem(key, JSON.stringify({ timestamp: new Date().getTime(), data })); 
    } catch (e) { 
        console.error(`Error al guardar la copia de seguridad para ${key}:`, e); 
    } 
} 
function loadBackup(key) { 
    try { 
        const backupData = localStorage.getItem(key); 
        if (backupData) { 
            const { timestamp, data } = JSON.parse(backupData); 
            const backupAgeHours = (new Date().getTime() - timestamp) / (1000 * 60 * 60); 
            if (backupAgeHours > BACKUP_EXPIRY_HOURS) { 
                localStorage.removeItem(key); 
                return null; 
            } 
            return data; 
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
        if (backup) { 
            allBackupChannels = allBackupChannels.concat(backup.map(c => ({ 
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
        if (state.isTVMode) { 
            renderTVChannels(); 
        } else { 
            renderResults(); 
        } 
        return true; 
    } 
    return false; 
} 
async function fetchAndProcessSource(sourceName, url, processor, backupKey) { 
    let channels = null; 
    let message = ''; 
    try { 
        channels = await processor(url); 
        saveBackup(channels, backupKey); 
        message = `Canales de ${sourceName} cargados.`; 
    } catch (error) { 
        console.error(`Fallo al cargar de ${sourceName}:`, error); 
        channels = loadBackup(backupKey); 
        if (channels) { 
            message = `Fallo de ${sourceName}. Mostrando canales del historial.`; 
        } else { 
            message = `Fallo de ${sourceName}. Sin historial disponible.`; 
        } 
    } 
    return { name: sourceName, channels, message }; 
} 
async function loadInitialChannels() { 
    const channelsGrid = document.getElementById("channelsGrid"); 
    const isShowingBackup = loadAndRenderBackupChannels(); 
    const temporaryLoadMessage = isShowingBackup ? "Mostrando historial. Obteniendo datos en tiempo real..." : "Cargando datos en tiempo real..."; 
    showStatusMessage(temporaryLoadMessage, "warning"); 
    const results = await Promise.allSettled([ 
        fetchAndProcessSource('events', EVENTS_URL, loadEventsSource, BACKUP_KEYS.events), 
        fetchAndProcessSource('era', ERA_URL, loadEraChannels, BACKUP_KEYS.era), 
        fetchAndProcessSource('gist', GIST_URL, loadGistChannels, BACKUP_KEYS.gist), 
        fetchAndProcessSource('shickat', SHICKAT_URL, loadShickatChannels, BACKUP_KEYS.shickat), 
        fetchAndProcessSource('elcano', ELCANO_URL, loadElcanoSource, BACKUP_KEYS.elcano) 
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
    const statusElement = document.querySelector(".status-message"); 
    if (allChannels.length > 0) { 
        const newChannels = mergeChannels(allChannels); 
        state.channelsData = newChannels; 
        processChannelNames(); 
        if (state.isTVMode) { 
            renderTVChannels(); 
        } else { 
            renderResults(); 
        } 
        cleanObsoleteRatings(); 
        if (hasOnlineSuccess) { 
            if (statusElement) statusElement.remove(); 
            if (hasFallback) { 
                showStatusMessage("Canales actualizados (algunos con historial).", "warning"); 
            } else { 
                showStatusMessage("Canales actualizados correctamente.", "success"); 
            } 
        } else if (isShowingBackup) { 
            if (statusElement) { 
                statusElement.textContent = "Fallo al actualizar canales. Se sigue mostrando el historial."; 
                statusElement.className = "status-message error"; 
            } else { 
                showStatusMessage("Fallo al actualizar canales. Se sigue mostrando el historial.", "error"); 
            } 
        } else { 
            if (statusElement) statusElement.remove(); 
            channelsGrid.innerHTML = ` 
                <div class="no-results"><div class="no-results-icon">📡</div><div class="no-results-text">Error al cargar los canales.</div><div class="no-results-hint">No se han conseguido cargar los canales (modo offline/sin historial).</div><button class="retry-button" onclick="loadInitialChannels()">Reintentar</button></div> 
            `; 
            showStatusMessage("Error al cargar canales. Sin historial disponible.", "error"); 
        } 
    } else if (isShowingBackup) { 
        if (statusElement) { 
            statusElement.textContent = "Fallo al actualizar canales. Se sigue mostrando el historial."; 
            statusElement.className = "status-message error"; 
        } else { 
            showStatusMessage("Fallo al actualizar canales. Se sigue mostrando el historial.", "error"); 
        } 
    } else { 
        if (statusElement) statusElement.remove(); 
        channelsGrid.innerHTML = ` 
            <div class="no-results"><div class="no-results-icon">📡</div><div class="no-results-text">Error al cargar los canales.</div><div class="no-results-hint">No se han conseguido cargar los canales (modo offline/sin historial).</div><button class="retry-button" onclick="loadInitialChannels()">Reintentar</button></div> 
        `; 
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
async function loadGistChannels() { 
    const infoResponse = await fetch(GIST_URL); 
    if (!infoResponse.ok) throw new Error("Error al obtener la info de canales Gist"); 
    const infoContent = await infoResponse.text(); 
    return processGistData(infoContent); 
} 
async function loadEraChannels() { 
    const infoResponse = await fetch(ERA_URL); 
    if (!infoResponse.ok) throw new Error("Error al obtener la info de canales ERA"); 
    const infoContent = await infoResponse.text(); 
    return processGistData(infoContent).map(c => ({ ...c, source: 'era', name: c.name }));
}
function processGistData(infoCanales) { 
    const numberedChannels = []; 
    const lines = infoCanales.split('\n').filter(line => line.trim() !== ''); 
    const channelMappings = { 
        'DAZN LA LIGA 1': 'DAZN La Liga', 
        'MOVISTAR': 'M+', 
        'CLASICOS': 'Clásicos', 
        'VAMOS': 'Vamos', 
        'ACCION': 'Acción', 
        'LALIGA': 'La Liga', 
        'DEPORTES': 'Deportes', 
        'PLUS': 'Plus', 
        'M.':'M+', 
        'LIGA DE CAMPEONES': 'M+ Liga de Campeones', 
        'GOLF': 'Golf', 
        'LA LIGA': 'La Liga', 
        'HYPERMOTION': 'La Liga Hypermotion', 
        'EUROSPORT': '★EUROSPORT', 
        'ELLAS':'Ellas'
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
                namePart = namePart.replace(/\(ES\)|\(Es\)/g, '').trim(); 
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
async function loadElcanoSource() { 
    let lastError; 
    for (const proxy of PROXIES) { 
        try { 
            const proxyUrl = proxy + encodeURIComponent(ELCANO_URL); 
            const controller = new AbortController(); 
            const timeoutId = setTimeout(() => controller.abort(), 15000); 
            const response = await fetch(proxyUrl, { signal: controller.signal }); 
            clearTimeout(timeoutId); 
            if (!response.ok) throw new Error(`Proxy ${proxy} responded with ${response.status}`); 
            const htmlContent = await response.text(); 
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
        } catch (error) { 
            lastError = error; 
            console.warn(`Proxy ${proxy} falló para Elcano:`, error); 
            continue; 
        } 
    } 
    throw lastError || new Error("Todos los proxies fallaron para la fuente Elcano.");
} 
async function loadEventsSource() { 
    let lastError; 
    for (const proxy of PROXIES) { 
        try { 
            const proxyUrl = proxy + encodeURIComponent(EVENTS_URL); 
            const controller = new AbortController(); 
            const timeoutId = setTimeout(() => controller.abort(), 15000); 
            const response = await fetch(proxyUrl, { signal: controller.signal }); 
            clearTimeout(timeoutId); 
            if (!response.ok) throw new Error(`Proxy ${proxy} responded with ${response.status}`); 
            const htmlContent = await response.text(); 
            return processEventsData(htmlContent); 
        } catch (error) { 
            lastError = error; 
            console.warn(`Proxy ${proxy} failed:`, error); 
            continue; 
        } 
    } 
    throw lastError || new Error("All proxies failed for events source"); 
} 
async function loadShickatChannels() { 
    let lastError; 
    for (const proxy of PROXIES) { 
        try { 
            const proxyUrl = proxy + encodeURIComponent(SHICKAT_URL); 
            const controller = new AbortController(); 
            const timeoutId = setTimeout(() => controller.abort(), 15000); 
            const response = await fetch(proxyUrl, { signal: controller.signal }); 
            clearTimeout(timeoutId); 
            if (!response.ok) throw new Error(`Proxy ${proxy} responded with ${response.status}`); 
            const htmlContent = await response.text(); 
            return processShickatData(htmlContent); 
        } catch (error) { 
            lastError = error; 
            console.warn(`Proxy ${proxy} failed:`, error); 
            continue; 
        } 
    } 
    throw lastError || new Error("All proxies failed for shickat.me"); 
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
        'Golf': 'Golf', 
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
    if (normalizedName.includes('futbol')) return 120; 
    if (normalizedName.includes('baloncesto') || normalizedName.includes('nba')) return 150; 
    if (normalizedName.includes('tenis')) return 300; 
    if (normalizedName.includes('formula 1') || normalizedName.includes('f1')) return 180; 
    if (normalizedName.includes('motor')) return 120; 
    if (normalizedName.includes('ciclismo')) return 180; 
    if (normalizedName.includes('boxeo')) return 120; 
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
        'La Liga': 'La Liga', 
        'Premier': 'Premier League', 
        'Eurosport': '★EUROSPORT', 
        'HYPERMOTION': 'La Liga Hypermotion', 
        'LIGA DE CAMPEONES': 'M+ Liga de Campeones', 
        'PLUS': 'Plus','VAMOS':'Vamos', 
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
                const eventStartTime = getEventTime(date, time); 
                const durationMinutes = calculateDuration(sportName); 
                const eventEndTime = new Date(eventStartTime.getTime() + durationMinutes * 60000); 
                links.forEach(link => { 
                    const acestreamId = link.href.split('://')[1]; 
                    let channelName = link.textContent.trim(); 
                    for (const key in channelMappings) { 
                        const regex = new RegExp(key, 'gi'); 
                        channelName = channelName.replace(regex, channelMappings[key]); 
                    } 
                    let simplifiedName = channelName 
                        .replace(/Estable|New Era II|New Loop|New Era VI|FHD|HD|UHD|MultiAudio|SD|\(.*?\)|-->.*$/g, '') 
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
    const brands = [ 
        { name: 'M+', class: 'movistar' }, 
        { name: '★Eurosport', class: 'eurosport' }, 
        { name: 'DAZN', class: 'dazn' }, 
        { name: 'F1', class: 'f1' }, 
        { name: 'Acción', class: 'action' }, 
        { name: 'Deportes', class: 'sports' }, 
        { name: 'Clásicos', class: 'cinema-red' }, 
        { name: 'Vamos', class: 'vamos' }, 
        { name: 'Copa del Rey', class: 'copadelrey' }, 
        { name: 'Liga de Campeones', class: 'champions' }, 
        { name: 'La Liga', class: 'liga' }, 
        { name: 'Hypermotion', class: 'hypermotion' }, 
        { name: 'Golf', class: 'golf' }, 
        { name: '★EUROSPORT\\d+', class: 'eurosport-number', regex: true }, 
        { name: 'Smartbank', class: 'smartbank' }, 
        { name: 'Plus', class: 'plus' }, 
        { name: 'Western', class: 'western' }, 
        { name: 'Documentales', class: 'documentary' }, 
        { name: 'Originales', class: 'originals' }, 
        { name: 'Hits', class: 'cinema-red' }, 
        { name: 'Estrenos', class: 'cinema-red' }, 
        { name: 'Indie', class: 'cinema-red' }, 
        { name: 'Cine Español', class: 'cinema-red' }, 
        { name: 'Drama', class: 'cinema-red' }, 
        { name: 'Ellas', class: 'ellas' }, 
        { name: 'Series', class: 'series' } 
    ]; 
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
function filterChannels() { 
    let filteredChannels = state.channelsData; 
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase(); 
    if (searchTerm) { 
        filteredChannels = filteredChannels.filter(channel => { 
            const normalizedSearchTerm = normalizeText(searchTerm); 
            const nameMatches = normalizeText(channel.name).includes(normalizedSearchTerm); 
            const idMatches = channel.id && channel.id.toLowerCase().includes(normalizedSearchTerm.replace('#', '')); 
            let eventDetailsMatch = false; 
            if (channel.event) { 
                const { time, competition, match, date, sportName } = channel.event; 
                eventDetailsMatch = normalizeText(time || '').includes(normalizedSearchTerm) || normalizeText(sportName || '').includes(normalizedSearchTerm) || normalizeText(competition || '').includes(normalizedSearchTerm) || normalizeText(match || '').includes(normalizedSearchTerm) || normalizeText(date || '').includes(normalizedSearchTerm); 
            } 
            return nameMatches || idMatches || eventDetailsMatch; 
        }); 
    } 
    let currentFilter = state.currentFilter; 
    if(currentFilter === 'favorites') { 
        filteredChannels = filteredChannels.filter(c => state.favorites.includes(c.id)); 
    } else if (currentFilter === 'history') { 
        const historyChannels = Object.entries(state.channelHistory).map(([number, data]) => { 
            return { id: data.id, number, name: data.names[0] || `Canal ${number}`, quality: 'N/A', multiAudio: false, isKnown: true, source: 'history' }; 
        }); 
        filteredChannels = filteredChannels.filter(c => historyChannels.some(h => h.id === c.id)); 
    } else if (currentFilter !== 'all') { 
        filteredChannels = filteredChannels.filter(channel => normalizeText(channel.name).includes(normalizeText(currentFilter)) ); 
    } 
    if (state.sportFilter !== 'all') { 
        const normalizedSportFilter = normalizeText(state.sportFilter); 
        const sportSearchTerms = { 
            'futbol': ['futbol', 'soccer', 'Hypermotion', 'copa del rey', 'premier league', 'bundesliga', 'serie a'], 
            'baloncesto': ['baloncesto', 'basket', 'nba', 'euroliga'], 
            'tenis': ['tenis', 'wimbledon', 'roland garros', 'us open', 'atp', 'wta'], 
            'boxeo': ['boxeo', 'boxing', 'lucha', 'ufc', 'mma'], 
            'ciclismo': ['ciclismo', 'tour', 'giro', 'vuelta'], 
            'motorsport': ['gp', 'motogp', 'dakar', 'rally', 'wrc', 'nascar'], 
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
    if (dateString.toLowerCase() === 'hoy') { 
        return 'Hoy'; 
    } 
    if (dateString.toLowerCase() === 'mañana') { 
        return 'Mañana'; 
    } 
    const today = new Date(); 
    const date = parseDateString(dateString, today); 
    if (isNaN(date.getTime())) { 
        return dateString; 
    } 
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']; 
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']; 
    const dayOfWeek = weekdays[date.getDay()]; 
    const dayOfMonth = date.getDate(); 
    const monthName = months[date.getMonth()]; 
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(); 
    if (isToday) { 
        return 'Hoy'; 
    } 
    return `${dayOfWeek} ${dayOfMonth} de ${monthName}`; 
} 
function compareEventDates(eventA, eventB) { 
    const today = new Date(); 
    const dateStringA = eventA.date.toLowerCase(); 
    const dateStringB = eventB.date.toLowerCase(); 
    const isTodayA = dateStringA === 'hoy'; 
    const isTodayB = dateStringB === 'hoy'; 
    const isTomorrowA = dateStringA === 'mañana'; 
    const isTomorrowB = dateStringB === 'mañana'; 
    if (isTodayA && !isTodayB) return -1; 
    if (!isTodayA && isTodayB) return 1; 
    if (isTodayA && isTodayB) return eventA.time.localeCompare(eventB.time); 
    if (isTomorrowA && !isTomorrowB) return -1; 
    if (!isTomorrowA && isTomorrowB) return 1; 
    if (isTomorrowA && isTomorrowB) return eventA.time.localeCompare(eventB.time); 
    if (isTodayA || isTodayB || isTomorrowA || isTomorrowB) { 
        const dateA = isTodayA ? today : (isTomorrowA ? new Date(today.getTime() + 86400000) : parseDateString(dateStringA, today)); 
        const dateB = isTodayB ? today : (isTomorrowB ? new Date(today.getTime() + 86400000) : parseDateString(dateStringB, today)); 
        if (dateA.getTime() !== dateB.getTime()) { 
            return dateA.getTime() - dateB.getTime(); 
        } 
        return eventA.time.localeCompare(eventB.time); 
    } 
    const dateA = parseDateString(eventA.date, today); 
    const dateB = parseDateString(eventB.date, today); 
    if (dateA.getTime() !== dateB.getTime()) { 
        return dateA.getTime() - dateB.getTime(); 
    } 
    return eventA.time.localeCompare(b.event.time); 
} 
function parseDateString(dateString, today) { 
    if (dateString.toLowerCase() === 'mañana') { 
        const tomorrow = new Date(today); 
        tomorrow.setDate(today.getDate() + 1); 
        return tomorrow; 
    } 
    const parts = dateString.split('/'); 
    if (parts.length === 3) { 
        const year = parts[2] ? parseInt(parts[2], 10) : today.getFullYear(); 
        return new Date(year, parseInt(parts[1]) - 1, parseInt(parts[0])); 
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
    'DAZN F1', 'DAZN', 'DAZN La Liga', 'M+ La Liga', 'Liga de Campeones', 'La Liga Hypermotion', 'M+ Vamos', 'M+ Deportes', 'M+ Plus', 'M+ Golf', 'M+', '★EUROSPORT' 
]; 
const groupRegexes = { 
    'DAZN F1': /DAZN F1/i, 
    'DAZN': /DAZN(?!.*F1|.*La Liga)/i, 
    'DAZN La Liga': /DAZN La Liga/i, 
    'Liga de Campeones': /Liga de Campeones/i, 
    'La Liga Hypermotion': /La Liga Hypermotion/i, 
    'M+ La Liga': /M\+ La Liga/i, 
    'M+ Vamos': /M\+ Vamos/i, 
    'M+ Deportes': /M\+ Deportes/i, 
    'M+ Plus': /M\+ Plus/i, 
    'M+ Golf': /M\+ Golf/i, 
    'M+': /M\+(?!.*La Liga|.*Vamos|.*Deportes|.*Plus|.*Golf|.*Liga de Campeones)/i, 
    '★EUROSPORT': /★EUROSPORT/i, 
}; 
function determineBrandGroup(channel) { 
    const channelName = channel.name; 
    const normalizedName = normalizeText(channelName); 
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
function renderResults() { 
    if (state.isTVMode) { 
        renderTVChannels(); 
        return; 
    } 
    const filteredChannels = filterChannels(); 
    const channelsGrid = document.getElementById('channelsGrid'); 
    document.body.classList.toggle('hide-event-details', state.hideEventDetails); 
    channelsGrid.innerHTML = ''; 
    const allEventChannels = state.channelsData.filter(c => c.source === 'events' && c.event); 
    filteredChannels.forEach(channel => { 
        channel.isLive = isChannelLive(channel, allEventChannels); 
    }); 
    const saveButton = document.getElementById('saveFavoritesButton'); 
    saveButton.classList.toggle('floating-save-button--active', state.isFavoriteMode); 
    if (filteredChannels.length === 0) { 
        channelsGrid.innerHTML = ` 
            <div class="no-results"><div class="no-results-icon">📡</div><div class="no-results-text">No se encontraron canales</div><div class="no-results-hint">Prueba con otros filtros o términos de búsqueda</div></div> 
        `; 
        return; 
    } 
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
        const qualityMap = { '4K': 5, 'FHD': 4, 'HD': 3, 'SD': 2, 'N/A': 1, 'UHD': 6 }; 
        const qualityA = qualityMap[standardizeQuality(a.quality)] || 0; 
        const qualityB = qualityMap[standardizeQuality(b.quality)] || 0; 
        if (qualityB !== qualityA) { 
            return qualityB - qualityA; 
        } 
        const sourcePriorityMap = { 'gist': 4, 'era': 3, 'events': 2, 'shickat': 1, 'elcano': 0, 'history': -1 }; 
        const sourceA = sourcePriorityMap[a.source] || 0; 
        const sourceB = sourcePriorityMap[b.source] || 0; 
        if (sourceB !== sourceA) { 
            return sourceB - sourceA; 
        } 
        return a.name.localeCompare(b.name); 
    }); 
    const groups = {}; 
    const eventGroupKeysByChannelName = new Map(); 
    const eventChannels = sortedChannels.filter(c => c.source === 'events' && c.event); 
    const otherChannels = sortedChannels.filter(c => !(c.source === 'events' && c.event)); 
    eventChannels.forEach(channel => { 
        let groupName; 
        let isEventGroup = false; 
        if (state.hideEventDetails) { 
            groupName = determineBrandGroup(channel); 
        } else { 
            const eventGroupKey = `${channel.event.date}###${channel.event.competition}###${channel.event.match}`; 
            groupName = eventGroupKey; 
            isEventGroup = true; 
            const normalizedChannelName = normalizeText(channel.name); 
            if (!eventGroupKeysByChannelName.has(normalizedChannelName)) { 
                eventGroupKeysByChannelName.set(normalizedChannelName, new Set()); 
            } 
            eventGroupKeysByChannelName.get(normalizedChannelName).add(eventGroupKey); 
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
    otherChannels.forEach(channel => { 
        let groupFound = false; 
        const normalizedChannelName = normalizeText(channel.name); 
        if (!state.hideEventDetails && eventGroupKeysByChannelName.has(normalizedChannelName)) { 
            const eventGroupKeys = eventGroupKeysByChannelName.get(normalizedChannelName); 
            for (const eventGroupKey of eventGroupKeys) { 
                const eventGroup = groups[eventGroupKey]; 
                if (eventGroup) { 
                    eventGroup.channels.push(channel); 
                    groupFound = true; 
                } 
            } 
        } 
        if (!groupFound) { 
            const groupName = determineBrandGroup(channel); 
            if (!groups[groupName]) { 
                groups[groupName] = { 
                    name: groupName, 
                    channels: [], 
                    isEvent: false, 
                    hasLive: channel.isLive 
                }; 
            } else { 
                if (channel.isLive) { 
                    groups[groupName].hasLive = true; 
                } 
            } 
            groups[groupName].channels.push(channel); 
        } 
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
    const fragment = document.createDocumentFragment(); 
    let lastDateRendered = null; 
    let separatorAdded = false; 
    let hasLiveEvents = sortedGroupKeys.some(key => groups[key].isEvent && groups[key].channels.some(c => c.isLive)); 
    let foundEndOfLiveGroups = false; 
    sortedGroupKeys.forEach(groupKey => { 
        const group = groups[groupKey]; 
        if (group.isEvent && !state.hideEventDetails) { 
            const formattedDate = formatEventDate(group.date); 
            if (formattedDate !== lastDateRendered) { 
                const dateHeaderElement = document.createElement('h3'); 
                dateHeaderElement.className = 'event-date-header'; 
                dateHeaderElement.textContent = formattedDate; 
                fragment.appendChild(dateHeaderElement); 
                lastDateRendered = formattedDate; 
            } 
        } else { 
            lastDateRendered = null; 
        } 
        const groupElement = document.createElement('div'); 
        const isEventGroup = group.isEvent ? 'event-group' : ''; 
        groupElement.className = `channel-group ${isEventGroup}`; 
        const liveTimeClass = group.hasLive ? 'live-time-blink' : ''; 
        let groupTitleContent; 
        if (group.isEvent && !state.hideEventDetails) { 
            groupTitleContent = ` 
                <div style="display: flex; flex-direction: column; width: 100%;"><div style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><div class="${liveTimeClass}" style="margin-right: 10px;">${group.time}</div><div class="marquee-container" style="flex: 1;"><div class="competition-text">${group.competition}</div></div><div style="margin-left: 10px;"> ${group.match} <span class="group-title-emoji" style="margin-left: 10px;">${group.sportEmoji}</span></div></div></div> 
            `; 
        } else { 
            groupTitleContent = `<div>${group.name}</div>`; 
        } 
        groupElement.innerHTML = ` 
            <div class="channel-group__header"><div class="channel-group__title">${groupTitleContent}</div></div><div id="group-content-${groupKey}" class="group-content-container"></div> 
        `; 
        fragment.appendChild(groupElement); 
        const subGroupContentContainer = groupElement.querySelector('.group-content-container'); 
        const sortedSubGroupNames = Object.keys(group.subGroups).sort((a, b) => { 
            const aHasLive = group.subGroups[a].some(c => c.isLive); 
            const bHasLive = group.subGroups[b].some(c => c.isLive); 
            if (aHasLive && !bHasLive) return -1; 
            if (!aHasLive && bHasLive) return 1; 
            return a.localeCompare(b); 
        }); 
        sortedSubGroupNames.forEach(subGroupName => { 
            const subGroupChannels = group.subGroups[subGroupName]; 
            subGroupChannels.sort((a, b) => { 
                const ratingA = state.channelRatings[a.id] !== undefined ? state.channelRatings[a.id] : 2.5; 
                const ratingB = state.channelRatings[b.id] !== undefined ? state.channelRatings[b.id] : 2.5; 
                if (ratingA !== ratingB) { 
                    return ratingB - ratingA; 
                } 
                if (a.isLive && !b.isLive) return -1; 
                if (!a.isLive && b.isLive) return 1; 
                const qualityMap = { 'UHD': 6, '4K': 5, 'FHD': 4, 'HD': 3, 'SD': 2, 'N/A': 1 }; 
                const qualityA = qualityMap[standardizeQuality(a.quality)] || 0; 
                const qualityB = qualityMap[standardizeQuality(b.quality)] || 0; 
                if (qualityB !== qualityA) { 
                    return qualityB - qualityA; 
                } 
                const sourcePriorityMap = { 'gist': 4, 'era': 3, 'events': 2, 'shickat': 1, 'elcano': 0, 'history': -1 }; 
                const sourceA = sourcePriorityMap[a.source] || 0; 
                const sourceB = sourcePriorityMap[b.source] || 0; 
                if (sourceB !== sourceA) { 
                    return sourceB - sourceA; 
                } 
                const aIsFavorite = state.favorites.includes(a.id); 
                const bIsFavorite = state.favorites.includes(b.id); 
                if (aIsFavorite && !bIsFavorite) return -1; 
                if (!aIsFavorite && bIsFavorite) return 1; 
                return a.name.localeCompare(b.name); 
            }); 
            let subGroupTitleHTML = ''; 
            const isSingleItem = subGroupChannels.length === 1; 
            const singleItemClass = isSingleItem ? 'subgroup-content--single-item' : ''; 
            const subGroupHTML = ` 
                ${subGroupTitleHTML} 
                <div class="subgroup-content ${singleItemClass}"> 
                    ${subGroupChannels.map(channel => createChannelCard(channel)).join('')} 
                </div> 
            `; 
            subGroupContentContainer.innerHTML += subGroupHTML; 
        }); 
        if (!separatorAdded && group.isEvent) { 
            const nextGroupIndex = sortedGroupKeys.indexOf(groupKey) + 1; 
            const nextGroupKey = sortedGroupKeys[nextGroupIndex]; 
            const nextGroup = nextGroupKey ? groups[nextGroupKey] : null; 
            const isLastEventGroup = !nextGroup || !nextGroup.isEvent; 
            if (isLastEventGroup) { 
                const separator = document.createElement('hr'); 
                separator.className = 'live-separator'; 
                fragment.appendChild(separator); 
                separatorAdded = true; 
            } 
        } 
    }); 
    channelsGrid.appendChild(fragment); 
    document.querySelectorAll('.competition-text').forEach(textElement => { 
        const container = textElement.closest('.marquee-container'); 
        setTimeout(() => { 
            if (container && textElement.scrollWidth > container.clientWidth) { 
                textElement.classList.add('is-overflowing'); 
            } else { 
                textElement.classList.remove('is-overflowing'); 
            } 
        }, 0); 
    });
} 
function createChannelCard(channel) { 
    const isFavorite = state.favorites.includes(channel.id); 
    const isLive = channel.isLive; 
    let cardClass = `channel-card ${isFavorite ? 'channel-card--favorite' : ''} ${state.isFavoriteMode ? 'channel-card--favorite-mode' : ''}`; 
    if (isLive) { 
        cardClass += ' channel-card--live'; 
    } 
    const rating = state.channelRatings[channel.id] !== undefined ? state.channelRatings[channel.id] : 2.5; 
    let sourceBadgeClass = ''; 
    let sourceBadgeText = ''; 
    switch (channel.source) { 
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
    const isNew = isChannelNew(channel.id); 
    const newIndicator = isNew ? '<div class="new-channel-indicator"></div>' : ''; 
    const displayQuality = standardizeQuality(channel.quality); 
    const sourceButton = ` 
        <button class="channel-number-badge-button ${sourceBadgeClass}" data-id="${channel.id}" title="Copiar enlace (AceStream ID: ${channel.id})"><span class="channel-number">${channel.number}</span><span class="source-initials">${sourceBadgeText}</span></button> 
    `; 
    const liveIndicator = ''; 
    return ` 
        <div class="${cardClass}" data-id="${channel.id}" data-number="${channel.number}"> 
            ${newIndicator} 
            <div class="channel-card__quality"> 
                ${displayQuality} ${channel.multiAudio ? '🎧' : ''} 
            </div><div class="channel-header"><div class="channel-name">${channel.displayableName} ${liveIndicator}</div></div> 
            ${sourceButton} 
            <div class="rating-stars">${getStarRating(rating)}</div>
        </div> 
    `; 
} 
function playChannel(acestreamId) { 
    const acestreamUrl = `acestream://${acestreamId}`; 
    const newWindow = window.open(acestreamUrl, '_blank'); 
    setTimeout(() => { 
        if (newWindow && newWindow.closed) { 
        } else { 
        } 
    }, 500); 
} 
function handleChannelPlay(channel) { 
    if (state.isTVMode) { 
        showTVPlayerModal(channel); 
        return; 
    } 
    const now = new Date().getTime(); 
    if (state.lastChannelPlay) { 
        const previousChannelId = state.lastChannelPlay.channelId; 
        const previousChannelData = state.channelsData.find(c => c.id === previousChannelId); 
        const duration = (now - state.lastChannelPlay.timestamp) / 1000; 
        let rating = state.channelRatings[previousChannelId] !== undefined ? state.channelRatings[previousChannelId] : 2.5; 
        let newRating = rating; 
        if (previousChannelId !== channel.id && previousChannelData) { 
            const previousName = previousChannelData.name.toLowerCase().trim(); 
            const currentName = channel.name.toLowerCase().trim(); 
            if (previousName === currentName) { 
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
            } else { 
                if (duration >= (30 * 60)) { 
                    newRating += 1.5; 
                } else { 
                    newRating = rating; 
                } 
            } 
        } else if (previousChannelId === channel.id) { 
            newRating = rating; 
        } 
        state.channelRatings[previousChannelId] = Math.max(1, Math.min(5, newRating)); 
        saveRatings(); 
        renderResults(); 
    } 
    state.lastChannelPlay = { channelId: channel.id, timestamp: now }; 
    localStorage.setItem('lastChannelPlay', JSON.stringify(state.lastChannelPlay)); 
    playChannel(channel.id); 
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
function handleSearchInput() { 
    state.searchTerm = document.getElementById('searchInput').value.trim(); 
    localStorage.setItem('searchTerm', state.searchTerm); 
    disableFavoriteMode(); 
    if (state.searchTerm) { 
        if (state.currentFilter === 'all' && state.sportFilter === 'all') { 
            document.getElementById('clearEmojiFilters').classList.remove('filter-button--active'); 
        } 
    } else { 
        restoreFilterUI(); 
    } 
    renderResults(); 
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
    renderResults(); 
} 
function hexToRgb(hex) { 
    const r = parseInt(hex.slice(1, 3), 16); 
    const g = parseInt(hex.slice(3, 5), 16); 
    const b = parseInt(hex.slice(5, 7), 16); 
    return { r, g, b }; 
} 
function updatePrimaryLightColor() { 
    const rgb = hexToRgb(state.primaryColor); 
    const isDarkMode = document.body.classList.contains('dark-mode'); 
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
        renderResults(); 
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
function restoreFilterUI() { 
    document.getElementById('searchInput').value = state.searchTerm; 
    clearAllFilterVisuals(); 
    let targetId; 
    if (state.searchTerm && state.currentFilter === 'all' && state.sportFilter === 'all') { 
        return; 
    } 
    if (state.sportFilter !== 'all') { 
        const sportBtn = document.querySelector(`.sport-filter-button[data-sport-key="${state.sportFilter}"]`); 
        if (sportBtn) { 
            sportBtn.classList.add('filter-button--active'); 
            return; 
        } 
    } 
    if (state.currentFilter === 'dazn') targetId = 'filterDAZN'; 
    else if (state.currentFilter === 'm+') targetId = 'filterMovistar'; 
    else if (state.currentFilter === 'eurosport') targetId = 'filterEurosport'; 
    else if (state.currentFilter === 'favorites') targetId = 'filterFavorites'; 
    else if (state.currentFilter === 'all') targetId = 'clearEmojiFilters'; 
    if (targetId) { 
        document.getElementById(targetId).classList.add('filter-button--active'); 
    } 
} 
function toggleTVMode() { 
    state.isTVMode = !state.isTVMode; 
    localStorage.setItem('isTVMode', state.isTVMode); 
    document.getElementById('tvModeCheckbox').checked = state.isTVMode; 
    if (state.isTVMode) { 
        switchToTVMode(); 
        showStatusMessage("Modo StreamTV activado. Usa las flechas del teclado para navegar.", "info"); 
    } else { 
        switchToNormalMode(); 
        showStatusMessage("Modo StreamTV desactivado.", "info");
    }
}
function switchToTVMode() { 
    if (state.isTVMode) { 
        document.body.classList.add('tv-mode-active'); 
        document.getElementById('appInterface').style.display = 'none'; 
        document.getElementById('tvInterface').style.display = 'block'; 
        renderTVChannels(); 
        initializeTVNavigation(); 
    }
}
function switchToNormalMode() { 
    if (!state.isTVMode) { 
        document.body.classList.remove('tv-mode-active'); 
        document.getElementById('tvInterface').style.display = 'none'; 
        document.getElementById('appInterface').style.display = 'block'; 
        if (state.tvFocusManager) { 
            document.removeEventListener('keydown', state.tvFocusManager.handleKeyDown); 
        } 
        renderResults(); 
    }
}
function showTVPlayerModal(channel) { 
    if (state.playerActive) return; 
    const modal = document.getElementById('tvPlayerModal'); 
    const channelNameEl = document.getElementById('playerChannelName'); 
    const isLiveText = channel.isLive ? ' (EN VIVO)' : ''; 
    channelNameEl.innerHTML = `${channel.displayableName} ${isLiveText}`; 
    modal.classList.add('active'); 
    state.playerActive = true; 
    if (state.tvFocusManager) { 
        document.removeEventListener('keydown', state.tvFocusManager.handleKeyDown); 
    } 
    document.getElementById('tvCloseBtn').focus(); 
    playChannel(channel.id);
}
function closePlayerModal() { 
    if (!state.playerActive) return; 
    const modal = document.getElementById('tvPlayerModal'); 
    modal.classList.remove('active'); 
    state.playerActive = false; 
    if (state.tvFocusManager) { 
        state.tvFocusManager.init(); 
        if (state.tvFocusManager.currentFocus) { 
            state.tvFocusManager.setFocus(state.tvFocusManager.currentFocus); 
        } else { 
            state.tvFocusManager.setFocus(document.querySelector('.tv-nav-link[data-filter="all"]')); 
        } 
    } 
}
function filterTVChannels() { 
    let filteredData = state.channelsData; 
    const allEventChannels = state.channelsData.filter(c => c.source === 'events' && c.event); 
    filteredData.forEach(channel => { 
        channel.isLive = isChannelLive(channel, allEventChannels); 
    }); 
    if (state.tvCurrentFilter === 'live') { 
        filteredData = filteredData.filter(c => c.isLive); 
    } else if (state.tvCurrentFilter === 'favorites') { 
        filteredData = filteredData.filter(c => state.favorites.includes(c.id)); 
    } 
    const searchTerm = state.tvSearchTerm.toLowerCase(); 
    if (searchTerm) { 
        filteredData = filteredData.filter(c => { 
            const normalizedSearchTerm = normalizeText(searchTerm); 
            const nameMatches = normalizeText(c.name).includes(normalizedSearchTerm); 
            const idMatches = c.id && c.id.toLowerCase().includes(normalizedSearchTerm.replace('#', '')); 
            return nameMatches || idMatches; 
        }); 
    } 
    filteredData.sort((a, b) => { 
        if (a.isLive && !b.isLive) return -1; 
        if (!a.isLive && b.isLive) return 1; 
        const ratingA = state.channelRatings[a.id] !== undefined ? state.channelRatings[a.id] : 2.5; 
        const ratingB = state.channelRatings[b.id] !== undefined ? state.channelRatings[b.id] : 2.5; 
        if (ratingA !== ratingB) { 
            return ratingB - ratingA; 
        } 
        const qualityMap = { 'UHD': 6, '4K': 5, 'FHD': 4, 'HD': 3, 'SD': 2, 'N/A': 1 }; 
        const qualityA = qualityMap[standardizeQuality(a.quality)] || 0; 
        const qualityB = qualityMap[standardizeQuality(b.quality)] || 0; 
        if (qualityB !== qualityA) { 
            return qualityB - qualityA; 
        } 
        return a.name.localeCompare(b.name); 
    }); 
    return filteredData;
}
const getChannelCategory = (channel) => { 
    const name = channel.name; 
    if (channel.isLive) return '🔴 En Vivo Ahora'; 
    if (name.includes('DAZN F1')) return '🏎️ DAZN F1'; 
    if (name.includes('DAZN')) return '⚽ DAZN'; 
    if (name.includes('La Liga') || name.includes('Hypermotion')) return '⚽ Fútbol La Liga'; 
    if (name.includes('Vamos') || name.includes('Deportes') || name.includes('Plus')) return '📺 M+ Deportes'; 
    if (name.includes('EUROSPORT')) return '★ Eurosport'; 
    if (name.includes('Cine') || name.includes('Series') || name.includes('Acción')) return '🎬 Cine y Series'; 
    if (name.includes('Documental')) return '🔬 Documentales'; 
    return 'Otros Canales';
}
const createTVChannelCard = (channel) => { 
    const isLiveClass = channel.isLive ? 'tv-card--live' : ''; 
    const liveIndicator = channel.isLive ? '<span class="tv-live-indicator">🔴 EN VIVO</span>' : ''; 
    const backgroundStyle = `background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%), var(--card-bg);`; 
    let bgColor = 'var(--card-bg)'; 
    if (channel.name.includes('DAZN')) bgColor = '#000000'; 
    else if (channel.name.includes('M+')) bgColor = '#0085C1'; 
    else if (channel.name.includes('EUROSPORT')) bgColor = '#5e17eb'; 
    const cardBgStyle = `background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%), ${bgColor};`; 
    return ` 
        <div class="tv-card ${isLiveClass}" data-channel-id="${channel.id}" style="${cardBgStyle}" tabindex="0" role="button" aria-label="Ver canal ${channel.name}">
            <div style="width: 100%; padding: 10px; border-radius: 0 0 12px 12px; text-align: left;">
                <h3 style="font-size: 1rem; margin: 0; color: white; white-space: normal;">${channel.displayableName}</h3> 
                ${liveIndicator} 
                <div style="font-size: 0.7rem; color: #ccc; margin-top: 5px;">${standardizeQuality(channel.quality)}${channel.multiAudio ? ' 🎧' : ''} - ${channel.source.toUpperCase()}</div>
            </div>
        </div> 
    `;
};
function createTVChannelsHTML(data) { 
    if (data.length === 0) { 
        return '<p style="color: #a0a0a0; padding: 20px; margin-left: 20px;">No se encontraron canales que coincidan con los criterios.</p>'; 
    } 
    const categories = data.reduce((acc, channel) => { 
        const key = getChannelCategory(channel); 
        if (!acc[key]) { 
            acc[key] = []; 
        } 
        acc[key].push(channel); 
        return acc; 
    }, {}); 
    let sortedCategories = Object.keys(categories).sort((a, b) => { 
        if (a.includes('🔴 En Vivo') && !b.includes('🔴 En Vivo')) return -1; 
        if (!a.includes('🔴 En Vivo') && b.includes('🔴 En Vivo')) return 1; 
        if (a.includes('DAZN F1')) return -1; 
        if (b.includes('DAZN F1')) return 1; 
        if (a.includes('DAZN') && !b.includes('F1')) return -1; 
        if (b.includes('DAZN') && !a.includes('F1')) return 1; 
        return a.localeCompare(b); 
    }); 
    let html = ''; 
    for (const category of sortedCategories) { 
        const channels = categories[category]; 
        html += ` 
            <div class="tv-group"><header class="tv-group-header"><h2 class="tv-group-title">${category}</h2></header><div class="tv-subgroup-content"> ${channels.map(createTVChannelCard).join('')} </div></div> 
        `; 
    } 
    return html;
}
function renderTVChannels() { 
    const tvGrid = document.getElementById('tvChannelsGrid'); 
    if (!tvGrid || !state.isTVMode) return; 
    const filteredChannels = filterTVChannels(); 
    tvGrid.innerHTML = createTVChannelsHTML(filteredChannels); 
    attachTVCardEvents(); 
    if (state.tvFocusManager) { 
        state.tvFocusManager.updateFocusableElements(); 
        if (state.tvFocusManager.currentFocus && document.body.contains(state.tvFocusManager.currentFocus)) { 
            state.tvFocusManager.setFocus(state.tvFocusManager.currentFocus); 
        } else { 
            state.tvFocusManager.setFocus(document.querySelector('.tv-nav-link[data-filter="all"]')); 
        } 
    } 
}
const attachTVCardEvents = () => { 
    const cards = document.querySelectorAll('.tv-card'); 
    cards.forEach(card => { 
        card.removeEventListener('click', handleTVCardClick); 
        card.addEventListener('click', handleTVCardClick); 
    });
};
const handleTVCardClick = (e) => { 
    const channelId = e.currentTarget.getAttribute('data-channel-id'); 
    const channel = state.channelsData.find(c => c.id === channelId); 
    if (channel) { 
        handleChannelPlay(channel); 
    }
};
function initializeTVNavigation() { 
    if (state.tvFocusManager) { 
        document.removeEventListener('keydown', state.tvFocusManager.handleKeyDown); 
    } 
    const tvNavigation = { 
        currentFocus: null, 
        focusableElements: [], 
        init: function() { 
            this.updateFocusableElements(); 
            if (this.focusableElements.length > 0) { 
                this.setFocus(document.querySelector('.tv-nav-link[data-filter="all"]')); 
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
            const normalModeBtn = document.getElementById('normalModeBtn'); 
            this.focusableElements = [searchElement, ...sidebarLinks, normalModeBtn, ...allCards].filter(el => el && el.offsetParent !== null); 
        }, 
        setFocus: function(element) { 
            if (!element) return; 
            this.removeFocusClasses(); 
            this.currentFocus = element; 
            if (element.id === 'tvSearch' || element.id === 'normalModeBtn' || element.id === 'tvCloseBtn') { 
                element.focus(); 
            } else { 
                element.focus(); 
                element.classList.add(element.classList.contains('tv-card') ? 'tv-card-focused' : 'tv-sidebar-link-focused'); 
            } 
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); 
        }, 
        handleKeyDown: function(e) { 
            if (state.playerActive) { 
                if (e.key === 'Escape' || e.key === 'Backspace') { 
                    e.preventDefault(); 
                    closePlayerModal(); 
                } 
                return; 
            } 
            if (!state.isTVMode) return; 
            if (this.currentFocus && this.currentFocus.id === 'tvSearch' && (e.key.length === 1 || e.key === 'Backspace')) { 
                return; 
            } 
            let nextElement = null; 
            switch(e.key) { 
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
                    if (this.currentFocus.id === 'tvSearch' && this.currentFocus.value) { 
                        this.currentFocus.value = ''; 
                        state.tvSearchTerm = ''; 
                        renderTVChannels(); 
                        return; 
                    } 
                    state.isTVMode = false; 
                    switchToNormalMode(); 
                    return; 
            } 
            if (nextElement) { 
                this.setFocus(nextElement); 
            } 
        }, 
        moveFocus: function(direction) { 
            this.updateFocusableElements(); 
            const allCards = Array.from(document.querySelectorAll('.tv-card')); 
            const sidebarElements = Array.from(document.querySelectorAll('#tvSearch, .tv-nav-link, #normalModeBtn')); 
            if (sidebarElements.includes(this.currentFocus)) { 
                const currentIndex = sidebarElements.indexOf(this.currentFocus); 
                if (direction === 'ArrowDown' && currentIndex < sidebarElements.length - 1) { 
                    return sidebarElements[currentIndex + 1]; 
                } else if (direction === 'ArrowUp' && currentIndex > 0) { 
                    return sidebarElements[currentIndex - 1]; 
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
                        return sidebarElements[sidebarElements.length - 1]; 
                    } 
                } else if (direction === 'ArrowDown' || direction === 'ArrowUp') { 
                    let nextRow = null; 
                    if (direction === 'ArrowDown' && currentRowIndex < allRows.length - 1) { 
                        nextRow = allRows[currentRowIndex + 1]; 
                    } else if (direction === 'ArrowUp' && currentRowIndex > 0) { 
                        nextRow = allRows[currentRowIndex - 1]; 
                    } 
                    if (nextRow) { 
                        const cardsInNextRow = Array.from(nextRow.querySelectorAll('.tv-card')); 
                        return cardsInNextRow[Math.min(indexInRow, cardsInNextRow.length - 1)]; 
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
                } else if (this.currentFocus.id === 'normalModeBtn') { 
                    this.currentFocus.click(); 
                } else if (this.currentFocus.id === 'tvCloseBtn') { 
                    this.currentFocus.click(); 
                } 
            } 
        } 
    }; 
    state.tvFocusManager = tvNavigation; 
    tvNavigation.init();
}
document.addEventListener('DOMContentLoaded', () => { 
    document.getElementById('tvModeCheckbox').checked = state.isTVMode; 
    if (state.isTVMode) { 
        switchToTVMode(); 
    } else { 
        switchToNormalMode(); 
    } 
    document.body.classList.toggle('dark-mode', state.darkMode); 
    document.getElementById('darkModeCheckbox').checked = state.darkMode; 
    document.getElementById('hideEventDetailsCheckbox').checked = state.hideEventDetails; 
    document.body.classList.toggle('hide-event-details', state.hideEventDetails); 
    const favoriteButton = document.getElementById('filterFavorites'); 
    const LONG_PRESS_THRESHOLD = 500; 
    const clearButton = document.getElementById('clearEmojiFilters'); 
    const copyModal = document.getElementById('copyModal'); 
    const cancelCopyBtn = document.getElementById('cancelCopyBtn'); 
    cleanupOldFirstSeenRecords(); 
    const setupLongPress = (btn, onLongPress, onClick) => { 
        let pressTimer = null; 
        let isLongPress = false; 
        const startPress = () => { 
            isLongPress = false; 
            pressTimer = setTimeout(() => { 
                isLongPress = true; 
                onLongPress(); 
            }, LONG_PRESS_THRESHOLD); 
        }; 
        const endPress = () => { 
            clearTimeout(pressTimer); 
            if (pressTimer && !isLongPress) { 
                onClick(); 
            } 
            pressTimer = null; 
        }; 
        btn.addEventListener('mousedown', (e) => { 
            if (e.button === 0) startPress(); 
        }); 
        btn.addEventListener('mouseup', endPress); 
        btn.addEventListener('touchstart', startPress, {passive: true}); 
        btn.addEventListener('touchend', endPress); 
        btn.addEventListener('touchmove', () => clearTimeout(pressTimer)); 
    }; 
    setupLongPress( 
        favoriteButton, 
        () => { 
            state.isFavoriteMode = !state.isFavoriteMode; 
            updateFavoriteModeVisuals(); 
            if (state.isFavoriteMode) { 
                showStatusMessage("Modo de selección de favoritos activado. Pulsa un canal para marcarlo/desmarcarlo."); 
            } else { 
                showStatusMessage("Modo de selección de favoritos desactivado.", "success"); 
            } 
        }, 
        () => applyFilter('favorites') 
    ); 
    setupLongPress( 
        clearButton, 
        () => { 
            document.getElementById('settingsModal').classList.add('modal--active'); 
        }, 
        () => applyFilter('all') 
    ); 
    if(cancelCopyBtn) { 
        cancelCopyBtn.addEventListener('click', hideCopyModal); 
    } 
    window.addEventListener('click', (event) => { 
        if (event.target === copyModal) { 
            hideCopyModal(); 
        } 
        if (state.isFavoriteMode && !event.target.closest('.channel-card') && !event.target.closest('.floating-save-button') && !event.target.closest('.search-filters')) { 
            disableFavoriteMode(); 
        } 
    }); 
    document.getElementById('tvModeCheckbox').addEventListener('change', toggleTVMode); 
    document.getElementById('normalModeBtn').addEventListener('click', () => { 
        state.isTVMode = false; 
        toggleTVMode(); 
    }); 
    document.getElementById('tvCloseBtn').addEventListener('click', closePlayerModal); 
    document.querySelectorAll('.tv-nav-link').forEach(link => { 
        link.addEventListener('click', function(e) { 
            e.preventDefault(); 
            state.tvCurrentFilter = this.dataset.filter; 
            localStorage.setItem('tvCurrentFilter', state.tvCurrentFilter); 
            document.getElementById('tvSearch').value = ''; 
            state.tvSearchTerm = ''; 
            renderTVChannels(); 
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
    document.getElementById('filterDAZN').addEventListener('click', () => applyFilter('dazn')); 
    document.getElementById('filterMovistar').addEventListener('click', () => applyFilter('m+')); 
    document.getElementById('filterEurosport').addEventListener('click', () => applyFilter('eurosport')); 
    document.querySelectorAll('.sport-filter-button').forEach(button => { 
        button.addEventListener('click', () => { 
            applySportFilter(button.dataset.sportKey); 
        }); 
    }); 
    document.getElementById('searchInput').addEventListener('input', handleSearchInput); 
    document.getElementById('darkModeCheckbox').addEventListener('change', toggleDarkMode); 
    document.getElementById('hideEventDetailsCheckbox').addEventListener('change', toggleHideEventDetails); 
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
    document.addEventListener('click', (e) => { 
        const card = e.target.closest('.channel-card'); 
        const numberButton = e.target.closest('.channel-number-badge-button'); 
        if (card && !numberButton && !state.isTVMode) { 
            const channelId = card.dataset.id; 
            const channelData = state.channelsData.find(c => c.id === channelId); 
            if (state.isFavoriteMode) { 
                e.stopPropagation(); 
                toggleFavorite(channelId); 
            } else if (channelData) { 
                handleChannelPlay(channelData); 
            } 
        } 
    }); 
    restoreFilterUI(); 
    loadInitialChannels(); 
    setInterval(() => { 
        if (state.isTVMode) { 
            renderTVChannels(); 
        } else { 
            renderResults(); 
        } 
    }, 60000); 
});
