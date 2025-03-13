// Default tools configuration
const defaultTools = {
    'Rapid Editor': {
        url: `https://rapideditor.org/edit#map={zoom}/{lat}/{lon}`,
        enabled: true
    },
    'OSM Inspector': {
        url: `https://tools.geofabrik.de/osmi/?view=geometry&lon={lon}&lat={lat}&zoom={zoom}&baselayer=Geofabrik%20Standard`,
        enabled: true
    },
    'MapCompare': {
        url: `https://mc.bbbike.org/mc/?zoom={zoom}&lat={lat}&lon={lon}`,
        enabled: true
    },
    'New uMap here': {
        url: `https://umap.openstreetmap.fr/en/map/new/#{zoom}/{lat}/{lon}`,
        enabled: true
    },
    'Americana Map': {
        url: `https://americanamap.org/#map={zoom}/{lat}/{lon}`,
        enabled: true
    },
    'OpenTrailMap': {
        url: `https://opentrailmap.us/#map={zoom}/{lat}/{lon}`,
        enabled: true
    },
    'OpenSkiMap': {
        url: `https://openskimap.org/#{zoom}/{lat}/{lon}`,
        enabled: true
    },
    'OpenWhateverMap': {
        url: `https://openwhatevermap.xyz/#{zoom}/{lat}/{lon}`,
        enabled: true
    },
    'OpenStreetBrowser': {
        url: `https://openstreetbrowser.org/#map={zoom}/{lat}/{lon}`,
        enabled: true
    },
    'Mapillary': {
        url: `https://www.mapillary.com/app/?lat={lat}&lng={lon}&z={zoom}`,
        enabled: true
    }
};

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['tools', 'order'], (result) => {
        console.log("Loading settings:", result);
        const tools = result.tools || defaultTools;
        const order = result.order || Object.keys(tools);
        renderTools(tools, order);
    });
}

// Render tools list
function renderTools(tools, order) {
    const list = document.getElementById('tools-list');
    list.innerHTML = '';
    
    order.forEach(name => {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool-item';
        toolDiv.draggable = true;
        
        // Handle both old and new format
        const tool = tools[name];
        const isEnabled = tool ? 
            (typeof tool === 'object' ? tool.enabled !== false : true) : 
            false;
        
        toolDiv.innerHTML = `
            <label>
                <input type="checkbox" ${isEnabled ? 'checked' : ''}>
                ${name}
            </label>
        `;
        
        toolDiv.querySelector('input').addEventListener('change', (e) => {
            if (!tools[name]) {
                // If tool doesn't exist, create it
                tools[name] = {
                    url: defaultTools[name] ? defaultTools[name].url : '',
                    enabled: e.target.checked
                };
            } else if (typeof tools[name] === 'string') {
                // Convert old format to new format
                const url = tools[name];
                tools[name] = {
                    url: url,
                    enabled: e.target.checked
                };
            } else {
                // Update existing tool
                tools[name].enabled = e.target.checked;
            }
            
            console.log(`Tool ${name} enabled: ${e.target.checked}`);
            
            // Auto-save after checkbox change
            saveSettings(false);
            
            // Show visual feedback
            showSavedFeedback();
        });
        
        toolDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', name);
        });
        
        toolDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
            const rect = toolDiv.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            toolDiv.style.borderTop = e.clientY < midY ? '2px solid #1a73e8' : '';
            toolDiv.style.borderBottom = e.clientY >= midY ? '2px solid #1a73e8' : '';
        });
        
        toolDiv.addEventListener('dragleave', () => {
            toolDiv.style.borderTop = '';
            toolDiv.style.borderBottom = '';
        });
        
        toolDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            toolDiv.style.borderTop = '';
            toolDiv.style.borderBottom = '';
            
            const draggedName = e.dataTransfer.getData('text/plain');
            const draggedIndex = order.indexOf(draggedName);
            const targetIndex = order.indexOf(name);
            
            if (draggedIndex !== -1 && targetIndex !== -1) {
                order.splice(draggedIndex, 1);
                order.splice(targetIndex, 0, draggedName);
                renderTools(tools, order);
                
                // Auto-save after drag and drop
                saveSettings(false);
                
                // Show visual feedback
                showSavedFeedback();
            }
        });
        
        list.appendChild(toolDiv);
    });
}

// Add new tool
document.getElementById('add-tool-btn').addEventListener('click', () => {
    const name = document.getElementById('tool-name').value.trim();
    const url = document.getElementById('tool-url').value.trim();
    
    if (name && url && url.includes('{zoom}') && url.includes('{lat}') && url.includes('{lon}')) {
        chrome.storage.sync.get(['tools', 'order'], (result) => {
            const tools = result.tools || defaultTools;
            const order = result.order || Object.keys(tools);
            
            tools[name] = {
                url: url,
                enabled: true
            };
            
            if (!order.includes(name)) {
                order.push(name);
            }
            
            chrome.storage.sync.set({ tools, order }, () => {
                console.log("Added new tool:", name);
                loadSettings();
                document.getElementById('tool-name').value = '';
                document.getElementById('tool-url').value = '';
            });
        });
    } else {
        alert('Please enter a valid tool name and URL with {zoom}, {lat}, and {lon} placeholders');
    }
});

// Function to show saved feedback
function showSavedFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = 'Settings saved!';
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.right = '20px';
    feedback.style.backgroundColor = '#4CAF50';
    feedback.style.color = 'white';
    feedback.style.padding = '10px';
    feedback.style.borderRadius = '4px';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s';
    
    document.body.appendChild(feedback);
    
    // Fade in
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

// Save settings function
function saveSettings(showAlert = true) {
    chrome.storage.sync.get(['tools', 'order'], (result) => {
        let tools = result.tools || defaultTools;
        // Get the current order from the DOM
        const order = Array.from(document.querySelectorAll('.tool-item'))
            .map(item => {
                const name = item.querySelector('label').textContent.trim();
                const isChecked = item.querySelector('input[type="checkbox"]').checked;
                
                // Update the enabled state in the tools object
                if (tools[name]) {
                    if (typeof tools[name] === 'string') {
                        // Convert old format to new format
                        const url = tools[name];
                        tools[name] = {
                            url: url,
                            enabled: isChecked
                        };
                    } else {
                        // Update existing tool
                        tools[name].enabled = isChecked;
                    }
                }
                
                return name;
            });
        
        console.log("Saving order and enabled states:", order, tools);
        
        // Save both the order and the updated tools with enabled states
        chrome.storage.sync.set({ tools, order }, () => {
            console.log("Settings saved:", { tools, order });
            if (showAlert) {
                showSavedFeedback();
            }
        });
    });
}

// Save button now just shows feedback
document.getElementById('save-btn').addEventListener('click', () => {
    saveSettings(true);
});

// Initialize
loadSettings();
