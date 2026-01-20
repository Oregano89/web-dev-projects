// Main application controller
let sceneManager;
let speechManager;
let intentParser;
let commandHistory = [];

// Initialize application
function init() {
    // Create scene manager
    sceneManager = new SceneManager();
    
    // Create intent parser
    intentParser = new IntentParser();
    
    // Create speech manager
    speechManager = new SpeechManager(
        handleVoiceCommand,
        updateSpeechStatus
    );
    
    // Setup UI event listeners
    setupUIListeners();
    
    // Sync UI with initial scene state
    updateUIValues();
    
    console.log('Application initialized');
}

// Setup UI event listeners
function setupUIListeners() {
    // Speech control buttons
    document.getElementById('startSpeech').addEventListener('click', () => {
        if (speechManager.start()) {
            document.getElementById('startSpeech').disabled = true;
            document.getElementById('stopSpeech').disabled = false;
        }
    });
    
    document.getElementById('stopSpeech').addEventListener('click', () => {
        if (speechManager.stop()) {
            document.getElementById('startSpeech').disabled = false;
            document.getElementById('stopSpeech').disabled = true;
        }
    });
    
    // Parameter panel - Opacity
    document.getElementById('opacitySlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setOpacity(value);
        document.getElementById('opacityValue').textContent = value.toFixed(0);
    });
    
    // Parameter panel - Threshold
    document.getElementById('thresholdSlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setThreshold(value);
        document.getElementById('thresholdValue').textContent = value.toFixed(0);
    });
    
    // Parameter panel - ISO Value
    document.getElementById('isoValueSlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setIsoValue(value);
        document.getElementById('isoValueValue').textContent = value.toFixed(0);
    });
    
    // Parameter panel - Brightness
    document.getElementById('brightnessSlider').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setBrightness(value);
        document.getElementById('brightnessValue').textContent = value.toFixed(0);
    });
    
    // Parameter panel - Colormap
    document.getElementById('colormapSelect').addEventListener('change', (e) => {
        const colormapName = e.target.value;
        sceneManager.setColormap(colormapName);
        const displayName = colormapName.charAt(0).toUpperCase() + colormapName.slice(1);
        document.getElementById('colormapName').textContent = displayName;
    });
    
    // Preset buttons
    document.getElementById('presetA').addEventListener('click', () => {
        sceneManager.loadPreset('A');
        updateUIValues();
        updatePresetButtons('A');
        addToHistory('Manual preset selection', 'Loaded Preset A');
    });
    
    document.getElementById('presetB').addEventListener('click', () => {
        sceneManager.loadPreset('B');
        updateUIValues();
        updatePresetButtons('B');
        addToHistory('Manual preset selection', 'Loaded Preset B');
    });
    
    // Camera distance slider
    document.getElementById('cameraDistance').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setCameraDistance(value);
        document.getElementById('distanceValue').textContent = value.toFixed(1);
    });
    
    // Camera rotation slider
    document.getElementById('cameraRotation').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setCameraRotation(value);
        document.getElementById('rotationValue').textContent = value.toFixed(0);
    });
    
    // Camera height slider
    document.getElementById('cameraHeight').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setCameraHeight(value);
        document.getElementById('heightValue').textContent = value.toFixed(1);
    });
    
    // Object scale slider
    document.getElementById('objectScale').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setObjectScale(value);
        document.getElementById('scaleValue').textContent = value.toFixed(1);
    });
    
    // Rotation speed slider
    document.getElementById('rotationSpeed').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sceneManager.setRotationSpeed(value);
        document.getElementById('speedValue').textContent = value.toFixed(1);
    });
    
    // Reset button
    document.getElementById('resetCamera').addEventListener('click', () => {
        sceneManager.reset();
        updateUIValues();
        updatePresetButtons('A');
        addToHistory('Manual reset', 'Reset to defaults');
    });
    
    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', () => {
        commandHistory = [];
        document.getElementById('commandHistory').innerHTML = '';
    });
}

// Handle voice commands
function handleVoiceCommand(text) {
    console.log('Voice command received:', text);
    
    // Show recognized text
    document.getElementById('recognizedText').textContent = `"${text}"`;
    
    // Parse intent
    const intent = intentParser.parse(text);
    console.log('Parsed intent:', intent);
    
    if (intent.command === 'unknown') {
        addToHistory(text, 'Command not recognized');
        return;
    }
    
    // Execute command
    executeCommand(intent);
    
    // Update UI
    updateUIValues();
}

// Execute parsed command
function executeCommand(intent) {
    const { command, value, originalText } = intent;
    let result = '';
    
    switch(command) {
        case 'zoomIn':
            sceneManager.zoomIn(1);
            result = 'Zoomed in';
            break;
            
        case 'zoomOut':
            sceneManager.zoomOut(1);
            result = 'Zoomed out';
            break;
            
        case 'orbitLeft':
            sceneManager.orbitLeft(15);
            result = 'Orbited left';
            break;
            
        case 'orbitRight':
            sceneManager.orbitRight(15);
            result = 'Orbited right';
            break;
            
        case 'orbitUp':
            sceneManager.orbitUp(1);
            result = 'Orbited up';
            break;
            
        case 'orbitDown':
            sceneManager.orbitDown(1);
            result = 'Orbited down';
            break;
            
        case 'scaleUp':
            sceneManager.setObjectScale(sceneManager.objectScale + 0.2);
            result = 'Increased size';
            break;
            
        case 'scaleDown':
            sceneManager.setObjectScale(sceneManager.objectScale - 0.2);
            result = 'Decreased size';
            break;
            
        case 'speedUp':
            sceneManager.setRotationSpeed(sceneManager.rotationSpeed + 0.5);
            result = 'Increased speed';
            break;
            
        case 'speedDown':
            sceneManager.setRotationSpeed(sceneManager.rotationSpeed - 0.5);
            result = 'Decreased speed';
            break;
            
        case 'reset':
            sceneManager.reset();
            updatePresetButtons('A');
            result = 'Reset to defaults';
            break;
            
        case 'stop':
            sceneManager.setRotationSpeed(0);
            result = 'Stopped rotation';
            break;
            
        case 'setDistance':
            sceneManager.setCameraDistance(value);
            result = `Set distance to ${value}`;
            break;
            
        case 'setRotation':
            sceneManager.setCameraRotation(value);
            result = `Set rotation to ${value}°`;
            break;
            
        case 'setScale':
            sceneManager.setObjectScale(value);
            result = `Set scale to ${value}`;
            break;
            
        // Parameter control commands
        case 'increaseOpacity':
            sceneManager.setOpacity(sceneManager.opacity + 10);
            result = `Increased opacity to ${sceneManager.opacity.toFixed(0)}%`;
            break;
            
        case 'decreaseOpacity':
            sceneManager.setOpacity(sceneManager.opacity - 10);
            result = `Decreased opacity to ${sceneManager.opacity.toFixed(0)}%`;
            break;
            
        case 'setOpacity':
            // Handle both 0-1 and 0-100 ranges
            const opacityVal = value > 1 ? value : value * 100;
            sceneManager.setOpacity(opacityVal);
            result = `Set opacity to ${sceneManager.opacity.toFixed(0)}%`;
            break;
            
        case 'increaseIsoValue':
            sceneManager.setIsoValue(sceneManager.isoValue + 20);
            result = `Increased ISO to ${sceneManager.isoValue.toFixed(0)}`;
            break;
            
        case 'decreaseIsoValue':
            sceneManager.setIsoValue(sceneManager.isoValue - 20);
            result = `Decreased ISO to ${sceneManager.isoValue.toFixed(0)}`;
            break;
            
        case 'setIsoValue':
            sceneManager.setIsoValue(value);
            result = `Set ISO value to ${sceneManager.isoValue.toFixed(0)}`;
            break;
            
        case 'increaseThreshold':
            sceneManager.setThreshold(sceneManager.threshold + 10);
            result = `Increased threshold to ${sceneManager.threshold.toFixed(0)}`;
            break;
            
        case 'decreaseThreshold':
            sceneManager.setThreshold(sceneManager.threshold - 10);
            result = `Decreased threshold to ${sceneManager.threshold.toFixed(0)}`;
            break;
            
        case 'setThreshold':
            sceneManager.setThreshold(value);
            result = `Set threshold to ${sceneManager.threshold.toFixed(0)}`;
            break;
            
        case 'increaseBrightness':
            sceneManager.setBrightness(sceneManager.brightness + 10);
            result = `Increased brightness to ${sceneManager.brightness.toFixed(0)}%`;
            break;
            
        case 'decreaseBrightness':
            sceneManager.setBrightness(sceneManager.brightness - 10);
            result = `Decreased brightness to ${sceneManager.brightness.toFixed(0)}%`;
            break;
            
        case 'setBrightness':
            sceneManager.setBrightness(value);
            result = `Set brightness to ${sceneManager.brightness.toFixed(0)}%`;
            break;
            
        case 'nextColormap':
            sceneManager.nextColormap();
            result = `Changed to ${sceneManager.currentColormap} colormap`;
            break;
            
        case 'previousColormap':
            sceneManager.previousColormap();
            result = `Changed to ${sceneManager.currentColormap} colormap`;
            break;
            
        case 'presetA':
            sceneManager.loadPreset('A');
            updatePresetButtons('A');
            result = 'Loaded Preset A';
            break;
            
        case 'presetB':
            sceneManager.loadPreset('B');
            updatePresetButtons('B');
            result = 'Loaded Preset B';
            break;
            
        default:
            result = 'Unknown command';
    }
    
    addToHistory(originalText, result);
}

// Update speech status indicator
function updateSpeechStatus(status, message) {
    const statusIndicator = document.getElementById('speechStatus');
    const statusText = statusIndicator.querySelector('.status-text');
    
    statusIndicator.className = 'status-indicator ' + status;
    statusText.textContent = message;
}

// Add command to history
function addToHistory(commandText, result) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    commandHistory.unshift({
        text: commandText,
        result: result,
        time: timeString
    });
    
    // Keep only last 20 commands
    if (commandHistory.length > 20) {
        commandHistory.pop();
    }
    
    renderHistory();
}

// Render command history
function renderHistory() {
    const historyContainer = document.getElementById('commandHistory');
    
    historyContainer.innerHTML = commandHistory.map(cmd => `
        <div class="command-item">
            <div class="command-text">${cmd.text}</div>
            <div class="command-result">${cmd.result}</div>
            <div class="command-time">${cmd.time}</div>
        </div>
    `).join('');
}

// Update UI values to match scene state
function updateUIValues() {
    // Camera controls
    document.getElementById('cameraDistance').value = sceneManager.cameraDistance;
    document.getElementById('distanceValue').textContent = sceneManager.cameraDistance.toFixed(1);
    
    document.getElementById('cameraRotation').value = sceneManager.cameraRotationAngle;
    document.getElementById('rotationValue').textContent = sceneManager.cameraRotationAngle.toFixed(0);
    
    document.getElementById('cameraHeight').value = sceneManager.cameraHeight;
    document.getElementById('heightValue').textContent = sceneManager.cameraHeight.toFixed(1);
    
    document.getElementById('objectScale').value = sceneManager.objectScale;
    document.getElementById('scaleValue').textContent = sceneManager.objectScale.toFixed(1);
    
    document.getElementById('rotationSpeed').value = sceneManager.rotationSpeed;
    document.getElementById('speedValue').textContent = sceneManager.rotationSpeed.toFixed(1);
    
    // Parameter panel controls
    document.getElementById('opacitySlider').value = sceneManager.opacity;
    document.getElementById('opacityValue').textContent = sceneManager.opacity.toFixed(0);
    
    document.getElementById('thresholdSlider').value = sceneManager.threshold;
    document.getElementById('thresholdValue').textContent = sceneManager.threshold.toFixed(0);
    
    document.getElementById('isoValueSlider').value = sceneManager.isoValue;
    document.getElementById('isoValueValue').textContent = sceneManager.isoValue.toFixed(0);
    
    document.getElementById('brightnessSlider').value = sceneManager.brightness;
    document.getElementById('brightnessValue').textContent = sceneManager.brightness.toFixed(0);
    
    document.getElementById('colormapSelect').value = sceneManager.currentColormap;
    const displayName = sceneManager.currentColormap.charAt(0).toUpperCase() + sceneManager.currentColormap.slice(1);
    document.getElementById('colormapName').textContent = displayName;
}

// Update preset button states
function updatePresetButtons(activePreset) {
    const presetA = document.getElementById('presetA');
    const presetB = document.getElementById('presetB');
    
    if (activePreset === 'A') {
        presetA.classList.add('active');
        presetB.classList.remove('active');
    } else if (activePreset === 'B') {
        presetA.classList.remove('active');
        presetB.classList.add('active');
    }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
