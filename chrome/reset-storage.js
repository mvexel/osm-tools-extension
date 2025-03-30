// This script provides a way to reset the extension's storage to default values

function resetExtensionStorage() {
    chrome.storage.sync.clear(() => {
        // Re-initialize with defaults
        chrome.storage.sync.set({
            tools: defaultTools,
            order: Object.keys(defaultTools)
        }, () => {
            // Reload the popup
            window.location.reload();
        });
    });
}

// Add a reset button to the popup
document.addEventListener('DOMContentLoaded', () => {
    // Create reset button if it doesn't exist
    if (!document.getElementById('reset-btn')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-btn';
        resetBtn.textContent = 'Reset to Defaults';
        resetBtn.style.marginTop = '10px';
        resetBtn.style.padding = '5px';
        resetBtn.style.fontSize = '12px';
        resetBtn.style.backgroundColor = '#f44336';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.display = 'block';
        resetBtn.style.margin = '10px auto';
        
        resetBtn.addEventListener('click', resetExtensionStorage);
        
        // Add button to the popup
        const settingsContainer = document.querySelector('.settings-container');
        settingsContainer.appendChild(resetBtn);
    }
});
