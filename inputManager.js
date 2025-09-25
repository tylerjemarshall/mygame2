

class InputManager {
    constructor() {
        this.currentScene = null;
        this.keyBindings = {};
        this.keyListeners = {};
        this.listenersActive = false;
        // this.lastKeyPressTime = 0;
        // this.keyPressDelay = 10; // 100ms delay between key presses
        this.keyPressDelay = 50; // Default delay in ms for action keys
        this.lastKeyPressTimes = {}; // Store last press time for each key

    }

    // init(game) {
        
    //     this.game = game;
    //     document.addEventListener('keydown', (event) => this.handleKeydown(event));
    // }

    init(game) {
        this.game = game;
        document.addEventListener('keydown', (event) => this.handleKeyEvent(event));
        document.addEventListener('keyup', (event) => this.handleKeyEvent(event));
    }
    getCurrentSceneInputs() {
        return this.game.sceneManager.getSceneInputs(this.currentScene);
    }



    handleKeyEvent(event) {
        const key = event.key;
        const isKeyDown = event.type === 'keydown';


     
        // Return early if the control panel is visible or clickable
        if (globals.controlPanelOpen) {
            return;
        }


        if (!this.listenersActive) {
            // console.log('Listeners not active');
            return;
        }

        // Get current time and check the last time this specific key was pressed
        const currentTime = Date.now();
        const lastPressTime = this.lastKeyPressTimes[key] || 0;

        // Allow immediate typing for character keys
        if (key.length === 1 && isKeyDown) {
            // this.handleCharacterInput(event);
            this.lastKeyPressTimes[key] = currentTime; // Update the last press time for this key
            // return;
        }

        // Apply delay for non-character keys or action keys (like Enter, Backspace, etc.)
        if (isKeyDown && currentTime - lastPressTime < this.keyPressDelay) {
            // console.log('Ignoring rapid press of ' + key);
            return; // Ignore rapid presses of non-character keys
        }

        this.lastKeyPressTimes[key] = currentTime; // Update last press time

        // console.log(`${isKeyDown ? 'Pressed' : 'Released'} ${key} in scene ${globals.sceneManager.getCurrentScene()}`);

        // Handle specific key listeners
        if (this.keyListeners[key]) {
            if (isKeyDown && this.keyListeners[key].down) {
                this.keyListeners[key].down(event);
            } else if (!isKeyDown && this.keyListeners[key].up) {
                this.keyListeners[key].up(event);
            }
        }

        // Handle 'any' key listener for any keypress (down only for typing)
        if (isKeyDown && this.keyListeners['any']) {
            this.keyListeners['any'].down(event);
        }

        // Handle keyBindings for backward compatibility
        if (isKeyDown && this.keyBindings[key]) {
            this.keyBindings[key]();
        }
    }

    
    addGamepadButtonListener(buttonIndex, callback, eventType = 'down') {
        if (this.game.input && this.game.input.gamepad) {
            this.game.input.gamepad.on(`${eventType}_${buttonIndex}`, (pad, button, value) => {
                if (this.listenersActive) callback(value);
            });
        }
    }
    
    addGamepadAxisListener(axisIndex, callback) {
        if (this.game.input && this.game.input.gamepad) {
            this.game.input.gamepad.on(`axis${axisIndex}change`, (pad, value) => {
                if (this.listenersActive) callback(value);
            });
        }
    }
  

    setSceneInputs(sceneName, inputs) {
        this.clearAllListeners();  // Clear all previous listeners
        this.currentScene = sceneName;
    
        // Immediately activate listeners for 'MainMenuScene'
        if (this.currentScene === 'MainMenuScene') {
            this.listenersActive = true; 
        } else {
            this.listenersActive = false; // Deactivate listeners
            setTimeout(() => {
                this.listenersActive = true;
                console.log('Listeners activated for scene:', sceneName);
            }, 500); // Delay activation for other scenes
        }
    
        // Set up new inputs for the scene
        for (const [key, action] of Object.entries(inputs)) {
            // Handle 'keyboard' inputs
            if (key === 'keyboard' && typeof action === 'object') {
                for (const [keyCode, keyAction] of Object.entries(action)) {
                    if (keyCode === 'numpad' || typeof keyAction === 'object') {
                        // Handle complex key actions (objects with down/up callbacks)
                        if (keyAction.down && typeof keyAction.down === 'function') {
                            this.addKeyDownListener(keyCode, this.createDelayedCallback(keyAction.down));
                        }
                        if (keyAction.up && typeof keyAction.up === 'function') {
                            this.addKeyUpListener(keyCode, this.createDelayedCallback(keyAction.up));
                        }
                        if (keyAction.callback && typeof keyAction.callback === 'function') {
                            this.addKeyListener(keyCode, this.createDelayedCallback(keyAction.callback));
                        }
                    } else if (typeof keyAction === 'function') {
                        // Direct function action for keyCode (treat as keydown)
                        this.addKeyDownListener(keyCode, this.createDelayedCallback(keyAction));
                    }
                }
            }
            /////////adding controller setup
            // else if (key === 'controller')
            // {
            //     for (const [button, action] of Object.entries(action)) {
            //         if (button.startsWith('button_')) {
            //             const buttonIndex = parseInt(button.split('_')[1]);
            //             this.addGamepadButtonListener(buttonIndex, action);
            //         } else if (button.startsWith('axis_')) {
            //             const axisIndex = parseInt(button.split('_')[1]);
            //             this.addGamepadAxisListener(axisIndex, action);
            //         }
            //     }
            // }
            /////controller setup


            // // Handle generic 'num' case
            // if (key === 'num') {
            //     // Add numeric keys to the listener
            //     this.addKeyListener('any', (event) => {
            //         const key = event.key;
            //         const numKeyRegex = /^[1-9]$/; // Matches numbers 1-9
            //         console.log("Key pressed: ", key);  // Debug log to see the key pressed

            //         if (numKeyRegex.test(key)) {
            //             // Only handle numeric keys 1 to 9
            //             console.log("Valid num key detected: ", key); // Debug log for valid num key
            //             action(event); // Pass the event to the defined callback
            //         }
            //     });
            // }




            // Set up new inputs
                for (const [key, callback] of Object.entries(inputs)) {
                    if (key === 'any') {
                        this.addKeyListener('any', this.createDelayedCallback(callback.callback));
                    } else if (typeof callback === 'function') {
                        this.addAction(key, this.createDelayedCallback(callback));
                    } else if (typeof callback === 'object' && callback.callback) {
                        this.addKeyListener(key, this.createDelayedCallback(callback.callback));
                    }
                }



        }




    }
    



    addKeyDownListener(key, callback) {
        this.keyListeners[key] = this.keyListeners[key] || {};
        this.keyListeners[key].down = callback;
    }
    
    addKeyUpListener(key, callback) {
        this.keyListeners[key] = this.keyListeners[key] || {};
        this.keyListeners[key].up = callback;
    }
    addAction(key, callback) {
        this.keyBindings[key] = callback;
    }

    clearBindings() {
        this.keyBindings = {};
    }

   
    addKeyListener(key, callback) {
        this.keyListeners[key] = callback;
    }

    removeKeyListener(key) {
        if (this.keyListeners[key]) {
            document.removeEventListener('keydown', this.keyListeners[key]);
            delete this.keyListeners[key];
        }
    }


   
    // clearAllListeners() {
    //     this.keyBindings = {};
    //     this.keyListeners = {};
    //     document.removeEventListener('keydown', this.handleKeydown);
    //     document.addEventListener('keydown', (event) => this.handleKeydown(event));
    // }



    clearAllListeners() {

        this.simulateKeyupForAllPressedKeys();
        this.keyBindings = {};
        this.keyListeners = {};
        

        

        // Remove existing listeners
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('keyup', this.handleKeyup);
        
        // Add new listeners
        document.addEventListener('keydown', (event) => this.handleKeyEvent(event));
        document.addEventListener('keyup', (event) => this.handleKeyEvent(event));


        //gamepad listeners

        // Clear gamepad listeners
        if (this.game.input && this.game.input.gamepad) {
            // Remove all gamepad button listeners
            for (let i = 0; i < 16; i++) { // Assuming standard gamepad with 16 buttons
                this.game.input.gamepad.off(`down_${i}`);
                this.game.input.gamepad.off(`up_${i}`);
            }

            // Remove all gamepad axis listeners
            for (let i = 0; i < 4; i++) { // Assuming 4 axes (2 joysticks)
                this.game.input.gamepad.off(`axis${i}change`);
            }
        }

        // Clear any stored gamepad bindings
        this.gamepadBindings = {};
        //////////////////////////////
    }


    simulateKeyupForAllPressedKeys() {
        // Create a custom keyup event
        const createKeyupEvent = (key) => new KeyboardEvent('keyup', { key: key, bubbles: true });
    
        // Simulate keyup for all keys in keyListeners
        for (const key in this.keyListeners) {
            if (this.keyListeners.hasOwnProperty(key) && key !== 'any') {
                const event = createKeyupEvent(key);
                this.handleKeyEvent(event);
            }
        }

        // Also simulate keyup for keys in keyBindings
        for (const key in this.keyBindings) {
            if (this.keyBindings.hasOwnProperty(key)) {
                const event = createKeyupEvent(key);
                this.handleKeyEvent(event);
            }
        }
        // Clear the lastKeyPressTimes
        this.lastKeyPressTimes = {};
    }    


    disableListeners() {
        this.listenersActive = false;
        this.clearAllListeners();
    }

    createDelayedCallback(callback) {
        return (...args) => {
            if (this.listenersActive) {
                callback(...args);
            } else {
                // console.log('Action ignored: listeners not yet active');
            }
        };
    }
     



    handleButtonInput(button, isDown, source = 'keyboard', event = null) {
        const currentTime = Date.now();
        if (currentTime - this.lastInputTime < this.inputCooldown) {
            return; // Ignore input if it's too soon after the last one
        }
        this.lastInputTime = currentTime;
    
        // const currentScene = this.game.scene.getScenes(true)[0];

        // const currentScene = globals.sceneManager.getCurrentScene();
        const currentScene = globals.sceneManager.currentScene;

        const sceneInputs = globals.sceneManager.getSceneInputs(currentScene);
    
        // Handle keyboard inputs
        if (source === 'keyboard' && sceneInputs.keyboard && sceneInputs.keyboard[button]) {
            if (typeof sceneInputs.keyboard[button] === 'function') {
                sceneInputs.keyboard[button]();
            }
        }
        
        // Handle button inputs
        if (source === 'button' && sceneInputs.button && sceneInputs.button[button]) {
            if (isDown && sceneInputs.button[button].down) {
                sceneInputs.button[button].down();
            } else if (!isDown && sceneInputs.button[button].up) {
                sceneInputs.button[button].up();
            }
        }
    
        // console.log(`Button ${button} ${isDown ? 'pressed' : 'released'} from ${source} in ${currentScene}`);
    }
    



    handleInput(inputType, button, isDown, source = 'keyboard', event = null) {
        const currentTime = Date.now();
        if (currentTime - this.lastInputTime < this.inputCooldown) {
            return; // Ignore input if it's too soon after the last one
        }
        this.lastInputTime = currentTime;
    
        // const currentScene = globals.sceneManager.getCurrentScene();
        const currentScene = globals.sceneManager.currentScene;

        const sceneInputs = globals.sceneManager.getSceneInputs(currentScene);
        
        // Get the relevant input mapping (keyboard or button) from the scene
        const inputMap = sceneInputs[inputType] && sceneInputs[inputType][button];
    
        if (inputMap) {
            // If it's a function, call it directly
            if (typeof inputMap === 'function') {
                inputMap();
            } 
            // If it's an object (for button handling), check if it's a 'down' or 'up' action
            else if (inputType === 'button') {
                if (isDown && inputMap.down) {
                    inputMap.down();
                } else if (!isDown && inputMap.up) {
                    inputMap.up();
                }
            }
        }
        
        // console.log(`${inputType.charAt(0).toUpperCase() + inputType.slice(1)} ${button} ${isDown ? 'pressed' : 'released'} from ${source} in ${currentScene}`);
    }
    

}
