// Intent Parser - Extracts commands from speech text
class IntentParser {
    constructor() {
        this.commandPatterns = {
            // Camera zoom commands
            zoomIn: [
                /zoom\s+in/i,
                /closer/i,
                /move\s+in/i,
                /get\s+closer/i
            ],
            zoomOut: [
                /zoom\s+out/i,
                /farther/i,
                /move\s+(away|back)/i,
                /get\s+farther/i,
                /further/i
            ],
            
            // Camera orbit commands
            orbitLeft: [
                /(orbit|rotate|move|pan)\s+(left|counterclockwise)/i,
                /turn\s+left/i,
                /go\s+left/i
            ],
            orbitRight: [
                /(orbit|rotate|move|pan)\s+(right|clockwise)/i,
                /turn\s+right/i,
                /go\s+right/i
            ],
            orbitUp: [
                /(orbit|move|pan)\s+up/i,
                /go\s+up/i,
                /higher/i,
                /move\s+higher/i
            ],
            orbitDown: [
                /(orbit|move|pan)\s+down/i,
                /go\s+down/i,
                /lower/i,
                /move\s+lower/i
            ],
            
            // Scale commands
            scaleUp: [
                /(make|scale)\s+(bigger|larger)/i,
                /increase\s+size/i,
                /bigger/i,
                /grow/i
            ],
            scaleDown: [
                /(make|scale)\s+(smaller|tiny)/i,
                /decrease\s+size/i,
                /smaller/i,
                /shrink/i
            ],
            
            // Speed commands
            speedUp: [
                /(speed|rotate|spin)\s+(up|faster)/i,
                /faster/i,
                /increase\s+speed/i
            ],
            speedDown: [
                /(speed|rotate|spin)\s+(down|slower)/i,
                /slower/i,
                /decrease\s+speed/i,
                /slow\s+down/i
            ],
            
            // Reset command
            reset: [
                /reset/i,
                /default/i,
                /reset\s+(camera|everything)/i,
                /go\s+back\s+to\s+start/i
            ],
            
            // Stop rotation
            stop: [
                /stop/i,
                /freeze/i,
                /pause/i,
                /halt/i
            ]
        };
    }

    parse(text) {
        const normalized = text.toLowerCase().trim();
        
        // Check each command pattern
        for (const [command, patterns] of Object.entries(this.commandPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(normalized)) {
                    return {
                        command: command,
                        originalText: text,
                        confidence: 1.0
                    };
                }
            }
        }

        // Try to extract numeric values for direct control
        const numericCommand = this.parseNumericCommand(normalized);
        if (numericCommand) {
            return numericCommand;
        }

        return {
            command: 'unknown',
            originalText: text,
            confidence: 0
        };
    }

    parseNumericCommand(text) {
        // Check for distance commands like "distance 10" or "set distance to 5"
        const distanceMatch = text.match(/(?:distance|zoom)\s+(?:to\s+)?(\d+(?:\.\d+)?)/i);
        if (distanceMatch) {
            return {
                command: 'setDistance',
                value: parseFloat(distanceMatch[1]),
                originalText: text,
                confidence: 1.0
            };
        }

        // Check for rotation angle commands like "rotate 45 degrees"
        const rotationMatch = text.match(/rotate?\s+(?:to\s+)?(\d+)\s*(?:degrees?)?/i);
        if (rotationMatch) {
            return {
                command: 'setRotation',
                value: parseFloat(rotationMatch[1]),
                originalText: text,
                confidence: 1.0
            };
        }

        // Check for scale commands like "scale 2" or "size 1.5"
        const scaleMatch = text.match(/(?:scale|size)\s+(?:to\s+)?(\d+(?:\.\d+)?)/i);
        if (scaleMatch) {
            return {
                command: 'setScale',
                value: parseFloat(scaleMatch[1]),
                originalText: text,
                confidence: 1.0
            };
        }

        return null;
    }

    getCommandDescription(command) {
        const descriptions = {
            zoomIn: 'Zoom camera in',
            zoomOut: 'Zoom camera out',
            orbitLeft: 'Orbit camera left',
            orbitRight: 'Orbit camera right',
            orbitUp: 'Orbit camera up',
            orbitDown: 'Orbit camera down',
            scaleUp: 'Increase object size',
            scaleDown: 'Decrease object size',
            speedUp: 'Increase rotation speed',
            speedDown: 'Decrease rotation speed',
            reset: 'Reset to default',
            stop: 'Stop rotation',
            setDistance: 'Set camera distance',
            setRotation: 'Set camera rotation',
            setScale: 'Set object scale',
            unknown: 'Unknown command'
        };
        return descriptions[command] || command;
    }
}
