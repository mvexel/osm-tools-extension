// defaultTools is now imported from defaults.js

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['tools', 'order'], (result) => {
        const tools = result.tools || defaultTools;
        const order = result.order || Object.keys(tools);
        renderTools(tools, order);
    });
}

// Render tools list
function renderTools(tools, order) {
    const list = document.getElementById('tools-list');
    list.innerHTML = '';

    // Create section headers
    const coordinateHeader = document.createElement('h3');
    coordinateHeader.textContent = 'Coordinate-based Tools';
    list.appendChild(coordinateHeader);

    const coordinateList = document.createElement('div');
    coordinateList.className = 'tool-section';
    list.appendChild(coordinateList);

    const changesetHeader = document.createElement('h3');
    changesetHeader.textContent = 'Changeset Tools';
    list.appendChild(changesetHeader);

    const changesetList = document.createElement('div');
    changesetList.className = 'tool-section';
    list.appendChild(changesetList);

    order.forEach(name => {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool-item';
        toolDiv.draggable = true;

        // Handle both old and new format
        const tool = tools[name];
        const isEnabled = tool ? 
            (typeof tool === 'object' ? tool.enabled !== false : true) : 
            false;
        
        const toolType = tool && typeof tool === 'object' && tool.type ? tool.type : 'coordinate';

        toolDiv.innerHTML = `
            <label>
                <input type="checkbox" ${isEnabled ? 'checked' : ''}>
                ${name}
            </label>
            <span class="tool-type">${toolType}</span>
        `;

        // Add event listeners
        setupToolItemEvents(toolDiv, name, tools, order);

        // Add to the appropriate section
        if (toolType === 'changeset') {
            changesetList.appendChild(toolDiv);
        } else {
            coordinateList.appendChild(toolDiv);
        }
    });
}

// Setup event listeners for tool items
function setupToolItemEvents(toolDiv, name, tools, order) {
    // Checkbox change event
    toolDiv.querySelector('input').addEventListener('change', (e) => {
        updateToolEnabledState(name, e.target.checked, tools);
        saveSettings(false);
        showSavedFeedback();
    });

    // Drag and drop events
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
            saveSettings(false);
            showSavedFeedback();
        }
    });
}

// Update tool enabled state
function updateToolEnabledState(name, isEnabled, tools) {
    if (!tools[name]) {
        // If tool doesn't exist, create it
        tools[name] = {
            url: defaultTools[name] ? defaultTools[name].url : '',
            enabled: isEnabled
        };
    } else if (typeof tools[name] === 'string') {
        // Convert old format to new format
        const url = tools[name];
        tools[name] = {
            url: url,
            enabled: isEnabled
        };
    } else {
        // Update existing tool
        tools[name].enabled = isEnabled;
    }
}

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

    // Animation sequence
    setTimeout(() => {
        feedback.style.opacity = '1';
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }, 10);
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
                updateToolEnabledState(name, isChecked, tools);

                return name;
            });

        // Save both the order and the updated tools with enabled states
        chrome.storage.sync.set({ tools, order }, () => {
            if (showAlert) {
                showSavedFeedback();
            }
        });
    });
}

// Add new tool
function addNewTool() {
    const name = document.getElementById('tool-name').value.trim();
    const url = document.getElementById('tool-url').value.trim();
    const toolType = document.getElementById('tool-type').value;

    let isValid = false;
    
    if (toolType === 'coordinate') {
        isValid = name && url && url.includes('{zoom}') && url.includes('{lat}') && url.includes('{lon}');
    } else if (toolType === 'changeset') {
        isValid = name && url && url.includes('{changesetId}');
    }

    if (isValid) {
        chrome.storage.sync.get(['tools', 'order'], (result) => {
            const tools = result.tools || defaultTools;
            const order = result.order || Object.keys(tools);

            tools[name] = {
                url: url,
                enabled: true,
                type: toolType
            };

            if (!order.includes(name)) {
                order.push(name);
            }

            chrome.storage.sync.set({ tools, order }, () => {
                loadSettings();
                document.getElementById('tool-name').value = '';
                document.getElementById('tool-url').value = '';
                showSavedFeedback();
            });
        });
    } else {
        if (toolType === 'coordinate') {
            alert('Please enter a valid tool name and URL with {zoom}, {lat}, and {lon} placeholders');
        } else {
            alert('Please enter a valid tool name and URL with {changesetId} placeholder');
        }
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add tool button
    document.getElementById('add-tool-btn').addEventListener('click', addNewTool);

    // Save button
    document.getElementById('save-btn').addEventListener('click', () => {
        saveSettings(true);
    });

    // Toggle placeholder based on tool type selection
    const toolTypeSelect = document.getElementById('tool-type');
    const coordinatePlaceholder = document.getElementById('coordinate-placeholder');
    const changesetPlaceholder = document.getElementById('changeset-placeholder');
    
    toolTypeSelect.addEventListener('change', () => {
        if (toolTypeSelect.value === 'coordinate') {
            coordinatePlaceholder.style.display = 'block';
            changesetPlaceholder.style.display = 'none';
        } else {
            coordinatePlaceholder.style.display = 'none';
            changesetPlaceholder.style.display = 'block';
        }
    });

    // Initialize
    loadSettings();
});

window.name = 'osm_tools_settings';
