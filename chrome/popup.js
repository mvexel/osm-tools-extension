// defaultTools is now imported from defaults.js

// Initialize storage with default values if empty
function initializeDefaultSettings() {
    chrome.storage.sync.get(['tools', 'order'], (result) => {
        if (!result.tools || !result.order) {
            chrome.storage.sync.set({
                tools: defaultTools,
                order: Object.keys(defaultTools)
            });
        } else {
            // Check if we need to update existing settings with new tool types
            let needsUpdate = false;
            const updatedTools = {...result.tools};
            
            // Add any missing tools from defaultTools
            Object.keys(defaultTools).forEach(name => {
                if (!updatedTools[name]) {
                    updatedTools[name] = defaultTools[name];
                    needsUpdate = true;
                } else if (!updatedTools[name].type && defaultTools[name].type) {
                    // Update existing tools with type if missing
                    updatedTools[name].type = defaultTools[name].type;
                    needsUpdate = true;
                }
            });
            
            // Update order to include any new tools
            const updatedOrder = [...result.order];
            Object.keys(defaultTools).forEach(name => {
                if (!updatedOrder.includes(name)) {
                    updatedOrder.push(name);
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                chrome.storage.sync.set({
                    tools: updatedTools,
                    order: updatedOrder
                });
            }
        }
    });
}

// Generate links based on coordinates
async function generateCoordinateLinks(lat, lon, zoom) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['tools', 'order'], (result) => {
            const tools = result.tools || defaultTools;
            const order = result.order || Object.keys(defaultTools);

            const list = order
                .filter(name => {
                    if (!tools[name]) return false;
                    if (!tools[name].type || tools[name].type === 'coordinate') {
                        return typeof tools[name] === 'object' ? 
                            tools[name].enabled !== false : true;
                    }
                    return false;
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

// Generate links based on changeset ID
async function generateChangesetLinks(changesetId) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['tools', 'order'], (result) => {
            const tools = result.tools || defaultTools;
            const order = result.order || Object.keys(defaultTools);

            const list = order
                .filter(name => {
                    if (!tools[name]) return false;
                    if (tools[name].type === 'changeset') {
                        return typeof tools[name] === 'object' ? 
                            tools[name].enabled !== false : true;
                    }
                    return false;
                })
                .map(name => {
                    const url = typeof tools[name] === 'object' ? tools[name].url : tools[name];
                    const formattedUrl = url.replace('{changesetId}', changesetId);
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
            const changesetMatch = url.match(/(?:openstreetmap\.org\/changeset\/|osmcha\.org\/changesets\/)([0-9]+)/);

            if (coordMatch) {
                const [_, zoom, lat, lon] = coordMatch;
                generateCoordinateLinks(lat, lon, zoom)
                    .then(html => {
                        document.getElementById('content').innerHTML = 
                            '<h3>Map Tools</h3>' + html;
                    })
                    .catch(error => {
                        console.error('Error generating coordinate links:', error);
                        document.getElementById('content').innerHTML = 
                            "Error generating tool links";
                    });
            } else if (changesetMatch) {
                const changesetId = changesetMatch[1];
                generateChangesetLinks(changesetId)
                    .then(html => {
                        document.getElementById('content').innerHTML = 
                            '<h3>Changeset Tools</h3>' + html;
                    })
                    .catch(error => {
                        console.error('Error generating changeset links:', error);
                        document.getElementById('content').innerHTML = 
                            "Error generating changeset tool links";
                    });
            } else {
                document.getElementById('content').innerHTML = 
                    "No OSM coordinates or changeset detected in current URL";
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
