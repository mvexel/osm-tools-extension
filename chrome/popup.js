// Default tools configuration
const defaultTools = {
    'Rapid Editor': {
        url: 'https://rapideditor.org/edit#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'OSM Inspector': {
        url: 'https://tools.geofabrik.de/osmi/?view=geometry&lon={lon}&lat={lat}&zoom={zoom}&baselayer=Geofabrik%20Standard',
        enabled: true
    },
    'MapCompare': {
        url: 'https://mc.bbbike.org/mc/?zoom={zoom}&lat={lat}&lon={lon}',
        enabled: true
    },
    'New uMap here': {
        url: 'https://umap.openstreetmap.fr/en/map/new/#{zoom}/{lat}/{lon}',
        enabled: true
    },
    'Americana Map': {
        url: 'https://americanamap.org/#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenTrailMap': {
        url: 'https://opentrailmap.us/#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenSkiMap': {
        url: 'https://openskimap.org/#{zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenWhateverMap': {
        url: 'https://openwhatevermap.xyz/#{zoom}/{lat}/{lon}',
        enabled: true
    },
    'OpenStreetBrowser': {
        url: 'https://openstreetbrowser.org/#map={zoom}/{lat}/{lon}',
        enabled: true
    },
    'Mapillary': {
        url: 'https://www.mapillary.com/app/?lat={lat}&lng={lon}&z={zoom}',
        enabled: true
    }
};

// Initialize storage with default values if empty
function initializeDefaultSettings() {
    chrome.storage.sync.get(['tools', 'order'], (result) => {
        if (!result.tools || !result.order) {
            chrome.storage.sync.set({
                tools: defaultTools,
                order: Object.keys(defaultTools)
            });
        }
    });
}

// Generate links based on coordinates
async function generateLinks(lat, lon, zoom) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['tools', 'order'], (result) => {
            const tools = result.tools || defaultTools;
            const order = result.order || Object.keys(defaultTools);

            const list = order
                .filter(name => {
                    if (!tools[name]) return false;
                    return typeof tools[name] === 'object' ? 
                        tools[name].enabled !== false : true;
                })
                .map(name => {
                    const url = typeof tools[name] === 'object' ? tools[name].url : tools[name];
                    const formattedUrl = url
                        .replace('{zoom}', zoom)
                        .replace('{lat}', lat)
                        .replace('{lon}', lon);
                    return `<li class="tool-item"><a href="${formattedUrl}" target="_blank" class="tool-link">${name}</a></li>`;
                })
                .join('');

            resolve(`<ul class="tool-list">${list}</ul>`);
        });
    });
}

// Update popup content
function updatePopup() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        try {
            const url = tabs[0].url;
            const coordMatch = url.match(/#?map=([0-9.]+)\/([-0-9.]+)\/([-0-9.]+)/);

            if (coordMatch) {
                const [_, zoom, lat, lon] = coordMatch;
                generateLinks(lat, lon, zoom)
                    .then(html => {
                        document.getElementById('content').innerHTML = html;
                    })
                    .catch(error => {
                        console.error('Error generating links:', error);
                        document.getElementById('content').innerHTML = 
                            "Error generating tool links";
                    });
            } else {
                document.getElementById('content').innerHTML = 
                    "No OSM coordinates detected in current URL";
            }
        } catch (error) {
            console.error('Error processing tab:', error);
            document.getElementById('content').innerHTML = 
                "Error processing current tab";
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings
    initializeDefaultSettings();

    // Initial load
    updatePopup();

    // Settings button click
    document.getElementById('settings-btn').addEventListener('click', () => {
        const settingsUrl = chrome.runtime.getURL('settings.html');
        const newTab = window.open(settingsUrl, 'osm_tools_settings');
        if (newTab) {
            newTab.focus();
        }
    });

    // Close popup when a link is clicked
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tool-link')) {
            window.close();
        }
    });
});

// Refresh popup content when storage changes
chrome.storage.onChanged.addListener(() => {
    updatePopup();
});
