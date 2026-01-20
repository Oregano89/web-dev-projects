// Speech Recognition Manager
class SpeechManager {
    constructor(onCommandCallback, onStatusCallback) {
        this.recognition = null;
        this.isListening = false;
        this.shouldStop = false;
        this.restartTimeout = null;
        this.onCommandCallback = onCommandCallback;
        this.onStatusCallback = onStatusCallback;
        
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Speech Recognition not supported in this browser');
            this.onStatusCallback('error', 'Speech Recognition not supported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.shouldStop = false;
            this.onStatusCallback('listening', 'Listening...');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            
            // If we didn't intentionally stop, restart after a brief delay
            if (!this.shouldStop) {
                console.log('Recognition ended unexpectedly, restarting in 300ms...');
                this.restartTimeout = setTimeout(() => {
                    if (!this.shouldStop && !this.isListening) {
                        try {
                            this.recognition.start();
                        } catch (error) {
                            console.error('Error restarting recognition:', error);
                            this.onStatusCallback('stopped', 'Stopped');
                        }
                    }
                }, 300);
            } else {
                this.onStatusCallback('stopped', 'Stopped');
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            let message = 'Error: ';
            switch(event.error) {
                case 'no-speech':
                    message += 'No speech detected';
                    // Don't stop on no-speech, let it continue
                    return;
                case 'audio-capture':
                    message += 'No microphone found';
                    this.shouldStop = true;
                    break;
                case 'not-allowed':
                    message += 'Microphone permission denied';
                    this.shouldStop = true;
                    break;
                case 'network':
                    // Network errors often happen on restart, ignore them
                    console.log('Network error (likely restart issue), ignoring...');
                    return;
                case 'aborted':
                    // Aborted errors are normal when stopping
                    return;
                default:
                    message += event.error;
                    this.shouldStop = true;
            }
            
            this.onStatusCallback('error', message);
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Show interim results
            if (interimTranscript) {
                this.onStatusCallback('listening', 'Listening: ' + interimTranscript);
            }

            // Process final transcript
            if (finalTranscript) {
                this.onCommandCallback(finalTranscript);
            }
        };
    }

    start() {
        if (!this.recognition) {
            this.onStatusCallback('error', 'Speech Recognition not available');
            return false;
        }

        if (this.isListening) {
            return false;
        }

        try {
            this.shouldStop = false;
            // Clear any pending restart
            if (this.restartTimeout) {
                clearTimeout(this.restartTimeout);
                this.restartTimeout = null;
            }
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.onStatusCallback('error', 'Failed to start');
            return false;
        }
    }

    stop() {
        if (!this.recognition) {
            return false;
        }

        try {
            this.shouldStop = true;
            // Clear any pending restart
            if (this.restartTimeout) {
                clearTimeout(this.restartTimeout);
                this.restartTimeout = null;
            }
            if (this.isListening) {
                this.recognition.stop();
            }
            return true;
        } catch (error) {
            console.error('Error stopping recognition:', error);
            return false;
        }
    }

    isAvailable() {
        return this.recognition !== null;
    }
}
