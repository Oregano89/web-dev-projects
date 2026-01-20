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
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
