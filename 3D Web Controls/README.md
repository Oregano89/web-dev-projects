# Conversational 3D Controller

A web-based 3D scene controller that combines **Three.js** visualization with **Web Speech API** for voice commands. Control a 3D scene using natural language voice commands or manual sliders, including advanced rendering parameters like opacity, threshold, ISO values, and colormap controls.

## Features

- **3D Visualization**: Interactive Three.js scene with a rotating torus knot
- **Voice Control**: Use natural language to control the scene via Web Speech API
- **Intent Parsing**: Smart command parser that understands various phrasings
- **Parameter Control**: Advanced rendering parameters with voice and manual control
- **Transfer Function Presets**: Quick preset configurations for different visualization styles
- **Colormap Support**: Multiple colormap options with voice control
- **Manual Controls**: Sliders for precise adjustments
- **Command History**: Track all executed commands with timestamps
- **Real-time Feedback**: Visual status indicators for speech recognition

## Live Demo

Simply open `index.html` in a modern web browser (Chrome, Edge, or Safari recommended for best speech recognition support).

## Voice Commands

### Camera Controls
- **Zoom In/Out**: 
  - "zoom in", "closer", "move in"
  - "zoom out", "farther", "move away"
  
- **Orbit Camera**:
  - "orbit left", "turn left", "rotate left"
  - "orbit right", "turn right", "rotate right"
  - "orbit up", "move up", "higher"
  - "orbit down", "move down", "lower"

### Object Controls
- **Scale**:
  - "make bigger", "increase size", "grow"
  - "make smaller", "decrease size", "shrink"

- **Rotation Speed**:
  - "speed up", "faster", "spin faster"
  - "speed down", "slower", "slow down"
  - "stop", "freeze", "pause"

### Rendering Parameters

#### Opacity Control
- **Incremental**:
  - "increase opacity", "more opacity", "less transparent"
  - "decrease opacity", "less opacity", "more transparent"
- **Direct Setting**:
  - "opacity 50" - Set opacity to 50%
  - "set opacity to 0.75" - Set opacity to 75%

#### Threshold Control
- **Incremental**:
  - "increase threshold", "threshold up", "raise threshold"
  - "decrease threshold", "threshold down", "lower threshold"
- **Direct Setting**:
  - "threshold 50" - Set threshold to 50
  - "set threshold to 75" - Set threshold to 75

#### ISO Value Control
- **Incremental**:
  - "increase iso", "iso up", "raise iso"
  - "decrease iso", "iso down", "lower iso"
- **Direct Setting**:
  - "iso 150" - Set ISO value to 150
  - "set iso to 200" - Set ISO value to 200

#### Brightness Control
- **Incremental**:
  - "increase brightness", "brighter", "brightness up"
  - "decrease brightness", "darker", "brightness down"
- **Direct Setting**:
  - "brightness 120" - Set brightness to 120%
  - "set brightness to 80" - Set brightness to 80%

#### Colormap Control
- **Navigation**:
  - "next colormap", "change colormap", "switch colormap"
  - "previous colormap", "last colormap"
- **Available Colormaps**: Viridis, Plasma, Inferno, Magma, Rainbow, Cool, Warm

#### Transfer Function Presets
- "preset A", "load preset A", "use preset A" - Bright, high contrast configuration
- "preset B", "load preset B", "use preset B" - Soft, low contrast configuration

### Numeric Commands
- "distance 10" - Set camera distance to 10
- "rotate 45 degrees" - Set camera rotation to 45°
- "scale 2" - Set object scale to 2x
- "opacity 75" - Set opacity to 75%
- "threshold 50" - Set threshold to 50
- "iso 150" - Set ISO value to 150
- "brightness 120" - Set brightness to 120%

### Reset
- "reset", "default", "reset camera" - Reset all parameters to defaults

## Manual Controls

The control panel provides two main sections:

### 🎨 Render Parameters Panel
- **Transfer Function Presets**: Quick switch between Preset A (bright, high contrast) and Preset B (soft, low contrast)
- **Opacity Slider**: 0-100% transparency control
- **Threshold Slider**: 0-100 rendering threshold
- **ISO Value Slider**: 0-255 ISO surface value
- **Brightness Slider**: 0-200% brightness adjustment
- **Colormap Selector**: Choose from 7 different color schemes (Viridis, Plasma, Inferno, Magma, Rainbow, Cool, Warm)

### 🎮 Camera Controls
- **Camera Distance**: 2-20 units
- **Camera Rotation**: 0-360 degrees
- **Camera Height**: -10 to 10 units
- **Object Scale**: 0.1x to 3x
- **Rotation Speed**: 0 to 5x

All parameters can be controlled via voice commands or manual sliders!

## Project Structure

```
3D Web/
├── index.html              # Main HTML structure
├── styles.css              # UI styling
├── scene.js                # Three.js scene manager
├── speechRecognition.js    # Web Speech API wrapper
├── intentParser.js         # Voice command parser
├── main.js                 # Application controller
└── README.md              # This file
```

## Technical Stack

- **Three.js** (v0.158.0): 3D graphics rendering
- **Web Speech API**: Speech-to-text recognition
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients and animations

## Browser Compatibility

Best support in:
- ✅ Chrome/Edge (full support)
- ✅ Safari (good support)
- ⚠️ Firefox (limited speech recognition)

**Note**: Microphone permission is required for voice commands.

## How It Works

1. **Scene Manager** (`scene.js`): Manages the Three.js scene, camera, lighting, and 3D objects
2. **Speech Recognition** (`speechRecognition.js`): Captures voice input using Web Speech API
3. **Intent Parser** (`intentParser.js`): Converts natural language to structured commands
4. **Main Controller** (`main.js`): Coordinates all modules and updates the UI

## Usage

1. Open `index.html` in your browser
2. Click "🎤 Start Listening" to enable voice commands
3. Grant microphone permission when prompted
4. Speak commands naturally (e.g., "zoom in", "rotate right")
5. Watch the 3D scene respond to your voice
6. View command history in the panel

## Customization

### Adding New Commands

Edit `intentParser.js` to add new command patterns:

```javascript
this.commandPatterns = {
    yourCommand: [
        /your pattern/i,
        /alternative pattern/i
    ]
};
```

Then implement in `main.js`:

```javascript
case 'yourCommand':
    // Your implementation
    result = 'Command executed';
    break;
```

### Changing 3D Objects

Edit `scene.js` to replace the torus knot with your own geometry:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
this.mainObject = new THREE.Mesh(geometry, material);
```

## Performance Notes

- The scene runs at 60 FPS on modern hardware
- Speech recognition is continuous but can be stopped to save resources
- Command history is limited to the last 20 commands

## Future Enhancements

- [ ] Multiple 3D object selection
- [ ] Color change commands
- [ ] Animation presets
- [ ] Export scene state
- [ ] Mobile touch controls
- [ ] Multi-language support

## License

Free to use and modify for personal and commercial projects.

## Credits

Built with Three.js and Web Speech API to demonstrate voice-controlled 3D interactions.
