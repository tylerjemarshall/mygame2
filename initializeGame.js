
let player;
let tileSize = 12;
let playerTileX = 0;
let playerTileY = 0;
let cursors;
let moving = false;

let restarted=false;
let autosave = true;
let autosaveFrequency=50000; //100000
const globals = new Globals();



// function registerServiceWorker() {
//     if ('serviceWorker' in navigator) {
//         window.addEventListener('load', () => {
//             navigator.serviceWorker.register('service-worker.js')
//                 .then((registration) => {
//                     console.log('ServiceWorker registered with scope:', registration.scope);
//                 })
//                 .catch((error) => {
//                     console.error('ServiceWorker registration failed:', error);
//                 });
//         });
//     }
// }

// Add this function to handle messages from the service worker
function handleServiceWorkerMessage(event) {
    console.log('Received message from service worker:', event.data);
    // Handle the message in your game
    // You might want to dispatch this to your Phaser game scene later
}

// Add the listener for messages from the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
}

// registerServiceWorker();
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js', { scope: './' })
                .then((registration) => {
                    console.log('ServiceWorker registered with scope:', registration.scope);
                    
                    // Check if the service worker is already controlling the page
                    if (navigator.serviceWorker.controller) {
                        console.log('This page is currently controlled by:', navigator.serviceWorker.controller);
                    } else {
                        console.log('This page is not yet controlled by a service worker');
                    }

                    // Listen for the service worker becoming ready
                    return navigator.serviceWorker.ready;
                })
                .then((registration) => {
                    console.log('Service Worker ready');
                })
                .catch((error) => {
                    console.error('ServiceWorker registration failed:', error);
                });

            // Listen for changes in the controlling service worker
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker controller changed');
            });
        });
    }
}

// Call the function to register the service worker
registerServiceWorker();


// Handle the install prompt
deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // Prevent the default mini-info bar
    deferredPrompt = event; // Stash the event
});



const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 500,
    //renderType: Phaser.WEBGL, // Specify the render type here
    //canvas: document.getElementById('gameCanvas'), // Specify the canvas element
    parent: 'gameCanvas', // Specify the ID of the canvas element
    // pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    // scale: {
    //     mode: Phaser.Scale.FIT, // This will fit the game to the screen
    //     //autoCenter: Phaser.Scale.CENTER_BOTH, // This will center the game on the screen
    // },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
    ,
    input: {
        gamepad: true  // Enable gamepad input
    },
    scene: [
        // InputManager,
        MainMenuScene,
        MapScene, 
        BattleScene, 
        MenuScene, 
        // StarterPokemonScene, //i dont htink im using this anymore.
        // InteractWithPokemonScene, 
        // MainMenuScene, 
        // OldManScene, 
        // ComputerScene, 
        // WorldScene, 
        // PartyScene, 
        // ItemsScene, 
        // PokemonDetailsScene, 
        // MoveListScene,
        RenamePokemonScene,
        // BreederScene,
        // PokedexScene,
        TransitionScene,
        ], // Add all your scene classes here
    globals: globals,
    input: {
        activePointers: 3 // Set the number of pointers for multitouch
    } // Pass the globals instance as part of the game configuration
    ,
    // callbacks: {
    //     postBoot: (game) => {
    //         console.log('Game post-boot callback');
    //         globals.initGamepadSupport(game);
    //     }
    // }
   
};




let game = new Phaser.Game(config);


game.name = 'Game';
// game.events.once('ready', () => {
//     globals.initSceneManager(game);
//     globals.sceneManager.transitionTo('MainMenuScene');
//     globals.setGameInstances(game, controlGame);  // Set both game instances

// });





// New configuration for the control area
const controlConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 500, // Adjust as needed
    parent: 'control-canvas',
    scene: [ControlScene,
            BattleButtonsScene,
            ItemsScene,
            PartyScene,
            PokemonDetailsScene,
            WorldScene,
            InteractWithPokemonScene,
            OldManScene,
            ComputerScene,
            MoveListScene,
            BreederScene,
            PokedexScene,
            SelectCharacterScene,
            TransitionScene,



    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    globals: globals,
    input: {
        activePointers: 3 // Set the number of pointers for multitouch
    }
};

let controlGame = new Phaser.Game(controlConfig);



controlGame.name = 'Control Game';

/////////////adding third game instance


// New configuration for the control panel overlay
const controlPanelConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 1000, // Adjust dimensions as needed
    parent: 'control-panel-overlay', // ID of the new canvas
    backgroundColor: 'transparent', // Make the background transparent
    scene: [ControlPanelScene], // Add the scenes for the control panel
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        gamepad: true  // Enable gamepad input for the overlay if needed
    },
    transparent: true, // Ensure the game instance is transparent
    globals: globals
};

// Create the third game instance for the control panel
const controlPanelGame = new Phaser.Game(controlPanelConfig);
controlPanelGame.name = 'Control Panel Game';

//////////////////////////////////////////////////////////



let readyCount = 0;
let restartReadyCount = 0;

function onReady() {
    readyCount++;
    if (readyCount === 3) { // Both games are ready
        initializeGame();

     
        // consoleLogSetup();

        // importSliderData();
        


    }
}


function importSliderData()
{
    const savedSliderData = localStorage.getItem('sliderData');
    if (savedSliderData) {
        try {
            const sliderData = JSON.parse(savedSliderData);
            console.log('Loading saved slider data:', sliderData);

            // Assuming you have access to your control panel scene at this point
            const controlPanelScene = controlPanelGame.scene.getScene('ControlPanelScene');
            if (controlPanelScene && controlPanelScene.slider) {
                controlPanelScene.slider.importData(sliderData); // Import the saved data into the slider
                console.log('Slider data loaded successfully.');
                
            }
        } catch (error) {
            console.error('Failed to load slider data:', error);
        }
    } else {
        console.log('No saved slider data found.');
    }
}
// Function to handle game restart
function onRestartReady() {
    restartReadyCount++;
    if (restartReadyCount === 2) { // Only the game and control game are ready for restart
        initializeGame();
        // Additional setup or transition can go here if needed
    }
}


game.events.once('ready', onReady);
controlGame.events.once('ready', onReady);

//adding controlpanelgame
controlPanelGame.events.once('ready', onReady);





function initializeGame() {

    // Initialize gamepad support
    // globals.initGamepadSupport(game);

    // Any other global initializations you might need...

    // Finally, transition to the main menu scene
  
    // Initialize the scene manager
    globals.itemManager.initializeItems();
    globals.createBackup();

    if (autosave) {

    
        const autosave = JSON.parse(localStorage.getItem('autosave')) || null;
        if (autosave)
        {
            console.log('loading the autosave');
            // globals.gameInstance.scene.getScene('MainMenuScene').loadGameData('autosave'); // Load the autosave data
            loadGameData('autosave');
        }
        else
        {
            console.log('no autosave');
        }




        startAutoSave();

    }

    globals.initSceneManager(game, controlGame, controlPanelGame); 

    // Set both game instances
    globals.setGameInstances(game, controlGame, controlPanelGame);
    globals.sceneManager.transitionTo('MainMenuScene');

    

}
function loadGameData(slotIndex) {
    let jsonData;

    if (slotIndex === -1) {
        // Load from backup
        try {
            jsonData = JSON.parse(JSON.stringify(globals.backup)); // Deep clone using JSON
            console.log("Loaded data from backup:", jsonData);
        } catch (error) {
            console.error('Error loading data from backup:', error.message);
            return null;
        }
    } else if (slotIndex === 'autosave') {
        // Load from autosave
        jsonData = localStorage.getItem('autosave');
        if (!jsonData) {
            console.log('No autosave data found');
            return null;
        }
    } else {
        // Load from save slot
        jsonData = localStorage.getItem(`save_${slotIndex}`);
        if (!jsonData) {
            console.log(`No save data found in slot ${slotIndex}`);
            return null;
        }
    }

    try {
        const loadedData = JSON.parse(jsonData);


        
        globals.fromSerializableObject(loadedData);

        console.log(`Data loaded successfully from slot ${slotIndex}`);
        return loadedData;
    } catch (error) {
        console.error('Error parsing loaded data:', error.message);
        return null;
    }
}



// function loadGameData(slotIndex) {

//     if (slotIndex === -1)
//     {
//         // Load from the backup if slotIndex is -1
//         try {
//             // const backupData = globals.backup; // Use the backup stored in globals
//             const backupData = JSON.parse(JSON.stringify(globals.backup)); // Deep clone using JSON

//             console.log("Loaded data from backup:", backupData);
            
//             // Apply the backup data to the globals object
//             Object.assign(globals, backupData);
//             console.log('Data loaded successfully from backup.');
//             return backupData;
//         } catch (error) {
//             console.error('Error loading data from backup:', error.message);
//         }
//     }
//     else if (slotIndex === 'autosave') { 
//         // Load from autosave slot
//         const jsonData = localStorage.getItem('autosave');
//         if (jsonData) {
//             try {
//                 const loadedData = JSON.parse((jsonData)); //JSON.stringify
//                 console.log("Loaded data from autosave:", loadedData); // Log the data being loaded

//                 // Apply the autosave data to the globals object
//                 Object.assign(globals, loadedData);
//                 console.log('Data loaded successfully from autosave.');
//                 return loadedData;
//             } catch (error) {
//                 console.error('Error parsing autosave data:', error.message);
//             }
//         } else {
//             console.log('No autosave data found');
//         }
//         return null;
//     }

   
//     else
//     {

    

//         const jsonData = localStorage.getItem(`save_${slotIndex}`);
//         if (jsonData) {
//             try {
//                 const loadedData = JSON.parse(jsonData);
//                 console.log("Loaded data:", loadedData); // Log the data being loaded

//                 // Make sure only the saved properties are updated
//                 Object.assign(globals, loadedData);
//                 console.log(`Data loaded successfully from slot ${slotIndex}`);
//                 return loadedData;
//             } catch (error) {
//                 console.error('Error parsing loaded data:', error.message);
//             }
//         } else {


//             console.log(`No save data found in slot ${slotIndex}`);
//         }
//         return null;
//     }
// }

// Function to restart the main game and control game
function restartGames() {
    // Destroy current game instances
    game.destroy(true); // 'true' to remove the canvas
    controlGame.destroy(true);

    // Create new game instances
    game = new Phaser.Game(config);
    controlGame = new Phaser.Game(controlConfig);

    // Reset the restart count and initialize the games
    restartReadyCount = 0;

    // Listen for ready events for the newly created game instances
    game.events.once('ready', onRestartReady);
    controlGame.events.once('ready', onRestartReady);

    restarted=true;

    console.log('restart completed');

  
}





function startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
        // console.log('game saved');
        this.autoSaveGame();
    }, autosaveFrequency); // Autosave every 30 seconds //100000
}




function stopAutoSave() {
    clearInterval(this.autoSaveInterval);
    console.log('Autosave stopped');
}

// function autoSaveGame() {

//     if (globals && globals.backup)
//     {
//         try {
//             // console.log('about to serialize globals in autosave');
//             const dataToSave = globals.toSerializableObject(); // Get the game state data to save
//             const jsonData = JSON.stringify(dataToSave); // Convert the data to JSON format
//             localStorage.setItem('autosave', jsonData); // Save to the 'autosave' slot
//             // localStorage.setItem(`autosave`, jsonData);
    
//             console.log('Game autosaved successfully');
//         } catch (error) {
//             console.error('Error during autosave:', error.message);
//         }
//     }
//     else
//     {
//         console.log('no backup yet');
//     }


 
// }

function autoSaveGame() {
    if (globals && globals.backup) {
        try {
            const dataToSave = globals.toSerializableObject();
            const jsonData = JSON.stringify(dataToSave);
            
            // Calculate the size of the JSON data in bytes
            const sizeInBytes = new Blob([jsonData]).size;
            
            // Convert bytes to kilobytes (KB) for easier reading
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            
            localStorage.setItem('autosave', jsonData);
            
            console.log(`Game autosaved successfully. Save file size: ${sizeInKB} KB`);
        } catch (error) {
            console.error('Error during autosave:', error.message);
        }
    } else {
        console.log('No backup yet');
    }
}





function resizeGames() {
    const container = document.getElementById('game-container');
    if (!container) {
        return;
    }
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const gameRatio = 1 / 2;
    const controlRatio = 1 / 2;

    game.scale.resize(containerWidth, containerHeight * gameRatio);
    controlGame.scale.resize(containerWidth, containerHeight * controlRatio);

    // Resize the control panel overlay game
    controlPanelGame.scale.resize(containerWidth, containerHeight); // Overlay should cover the entire area
}




function sendToControlPanel(formattedMessage) {
    const controlPanelScene = controlPanelGame.scene.getScene('ControlPanelScene');
    if (controlPanelScene) {
        try {
            controlPanelScene.showConsole(formattedMessage);
        } catch (error) {
            // originalLog('Error while updating console in ControlPanelScene:', error);
            console.error('Error while updating console in ControlPanelScene:', error);

        }
    } else {
        // originalLog('ControlPanelScene not available.');
        console.error('ControlPanelScene not available.');

    }
}
function toggleCustomLogging()
{
    if (customLoggingEnabled)
    {
        disableCustomLogging()
    }
    else
    {
        enableCustomLogging();
    }
    console.log('custom logging is: ', customLoggingEnabled);
}

function enableCustomLogging() {
       
        originalError = window.onerror;
        originalError = console.error;
        originalLog = console.log;
        originalWarn = console.warn;
        consoleLogSetup();
        customLoggingEnabled = true;
}

function disableCustomLogging() {
        window.onerror = originalError;
        console.error = originalError;
        console.log = originalLog;
        console.warn = originalWarn;
      
        customLoggingEnabled = false;
}


let logQueue = [];


const batchSize = 10; // Process 10 messages at a time
const logProcessingDelay = 100; // Delay in milliseconds

function processLogQueue() {
    if (logQueue.length > 0) {
        const batch = logQueue.splice(0, batchSize); // Get a batch of messages
        batch.forEach(message => sendToControlPanel(message));
        if (logQueue.length > 0) {
            setTimeout(processLogQueue, logProcessingDelay);
        }
    }
}
let customLoggingEnabled = false; // Boolean to control custom error handling
let originalError = console.error;
let originalLog = console.log;
let originalWarn = console.warn;
let originalOnError = window.onerror;

function consoleLogSetup()
{
    // Console.log override
    // if (!window.consoleOverrideApplied) {
        // const originalLog = console.log;




        


        function getCircularReplacer(maxDepth = 3) {
            const seen = new WeakSet();
            return function(key, value) {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return "[Circular]";
                    }
                    seen.add(value);
                }
                if (maxDepth < 1) {
                    return typeof value === 'object' && value !== null ? '[Object]' : value;
                }
                maxDepth--;
                return value;
            };
        }
        function simplifyObject(obj, maxDepth = 2) {
            if (maxDepth < 1 || typeof obj !== 'object' || obj === null) {
                return obj;
            }
            const simplified = Array.isArray(obj) ? [] : {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    simplified[key] = simplifyObject(obj[key], maxDepth - 1);
                }
            }
            return simplified;
        }

      

        function formatLogMessage(args, type, fileName) {
            const logMessage = args.map(arg => {

                if (arg === undefined) {
                    return '[undefined]'; // Handle undefined explicitly
                }


                if (typeof arg === 'object' && arg !== null) {
                    try {
                        const simplified = simplifyObject(arg);
                        return JSON.stringify(simplified, getCircularReplacer(3));
                    } catch (error) {
                        return `[Object: ${arg.constructor.name}]`;
                    }
                }
                return String(arg);
            });//.join(' ');
        
            return { type, message: logMessage, fileName };
        }
        
        

        function getFileAndSceneName() {
            const error = new Error();
            const stack = error.stack.split('\n');
            let fileName = 'unknown';
            let sceneName = 'unknown';
        
            // Look for the first non-internal call in the stack
            for (let i = 2; i < stack.length; i++) {
                const match = stack[i].match(/\s+at\s+(.+)\s+\((.*):\d+:\d+\)/);
                
                if (match && match[2]) {
                    fileName = match[2];
                    
                    // Check if the function name contains something relevant or is an internal call
                    const funcName = match[1];
                    if (!funcName.includes('console') && !funcName.includes('phaser')) {
                        const funcNameParts = funcName.split('.');
                        if (funcNameParts.length > 1) {
                            sceneName = funcNameParts[0];
                        } else {
                            const fileNameParts = fileName.split('/');
                            sceneName = fileNameParts[fileNameParts.length - 1].replace('.js', '');
                        }
                        break;  // Break once we find the first relevant stack entry
                    }
                }
            }
        
   


            return { fileName, sceneName };
        }
        


        function getFileName() {
            const error = new Error();
            const stack = error.stack.split('\n');
            // Look for the first non-internal call in the stack
            for (let i = 2; i < stack.length; i++) {
                const match = stack[i].match(/\s+at\s+.+\s+\((.*):\d+:\d+\)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
            return 'unknown';
        }
        




         // Custom console.log
         console.log = function(...args) {
     
                originalLog.apply(console, args); // Log to the console

                const { fileName, sceneName } = getFileAndSceneName();

                const formattedMessage = formatLogMessage(args, 'log', fileName, sceneName);
                // const formattedMessage2 = `${fileName}:${sceneName} - ${formatLogMessage(args, 'log', fileName, sceneName)}`;

                // originalLog.apply(console, [formattedMessage2]);




                // sendToControlPanel(formatLogMessage(args, 'log', fileName, sceneName));
                logQueue.push(formattedMessage);
                if (logQueue.length === 1) {
                    processLogQueue();
                }


            // }
        };

        
        console.warn = function(...args) {
            originalWarn.apply(console, args);

            const { fileName, sceneName } = getFileAndSceneName();


            const formattedMessage = formatLogMessage(args, 'warn', fileName, sceneName);
            // sendToControlPanel(formatLogMessage(args, 'warn', fileName, sceneName));
            logQueue.push(formattedMessage);
            if (logQueue.length === 1) {
                processLogQueue();
            }


        };
        
        console.error = function(...args) {
            originalError.apply(console, args);

            const { fileName, sceneName } = getFileAndSceneName();


            const formattedMessage = formatLogMessage(args, 'error', fileName, sceneName);

            // sendToControlPanel(formatLogMessage(args, 'error', fileName, sceneName));
            logQueue.push(formattedMessage);
            if (logQueue.length === 1) {
                processLogQueue();
            }


        };
        
        function sendToControlPanel(formattedMessage) {
            const controlPanelScene = controlPanelGame.scene.getScene('ControlPanelScene');
            if (controlPanelScene) {
                try {
                    controlPanelScene.showConsole(formattedMessage);
                } catch (error) {
                    originalLog('Error while updating console in ControlPanelScene:', error);
                }
            } else {
                originalLog('ControlPanelScene not available.');
            }
        }








        // window.consoleOverrideApplied = true;
    // }


    // function enableCustomWindowOnError()
    // {

        // Global error handling
        window.onerror = (message, source, lineno, colno, error) => {
            
    
            

            
            const errorMessage = `Error: ${message} at ${source}:${lineno}:${colno}`;


            console.log('Error message:', errorMessage);
            //possible add error.stack to the showerror method

            if (globals && globals.sceneManager && globals.isRebooting)
            {
                console.log('rebooting so not doing actions');
                return true;
            }


            if (isControlPanelResponsive()) {
                console.log('Control panel is responsive');

                
                const controlPanelScene = controlPanelGame.scene.getScene('ControlPanelScene');


                // if (controlPanelScene) {
                controlPanelScene.showError(errorMessage, error);
                controlPanelScene.showScene();

                // }
                document.getElementById('control-panel-overlay').style.pointerEvents = 'auto';
                console.error(errorMessage);
                // Assuming globals.sceneManager is accessible here
                // if (globals.sceneManager) {
                //     globals.sceneManager.reboot();
                // }
                console.log('Exporting slider data');


                // Export slider data before rebooting
                const sliderData = controlPanelScene.slider.exportData();
                localStorage.setItem('sliderData', JSON.stringify(sliderData));
                console.log('Slider data saved to localStorage');

            }
            else
            {
                // Control panel is not responsive, log to console and localStorage
                console.error('Control panel not responsive. Error:', errorMessage);
                const storedErrors = JSON.parse(localStorage.getItem('pendingErrors') || '[]');
                storedErrors.push({ type: 'error', message: errorMessage, source, sceneName: 'ErrorScene' });
                localStorage.setItem('pendingErrors', JSON.stringify(storedErrors));
            }


                
            // Reboot the control panel if it's not responsive
            if (!isControlPanelResponsive()) {
                console.log('Initiating control panel reboot');

                rebootControlPanel();
            }

    
            // Attempt to reboot the main game if possible
            if (globals.sceneManager) {


                if (globals && !globals.isRebooting)
                {

                    console.log('running hard reboot instead of reboot');

                    restartGames();

                }
                else
                {
                    console.log('cant reboot its still rebooting');
                }
            }

            return true;
        };
    // }

    // enableCustomWindowOnError();
    function rebootControlPanel() {
        // Destroy the current control panel
        if (controlPanelGame) {
            controlPanelGame.destroy(true);
        }
    
        // Recreate the control panel
        controlPanelGame = new Phaser.Game(controlPanelConfig);
    
        // Wait for the scene to be created and then restore the slider data
        controlPanelGame.events.once('ready', () => {
            const controlPanelScene = controlPanelGame.scene.getScene('ControlPanelScene');
            if (controlPanelScene && controlPanelScene.slider) {
                const savedData = JSON.parse(localStorage.getItem('sliderData'));
                if (savedData) {
                    controlPanelScene.slider.importData(savedData);
                }
    
                // Log any pending errors that occurred while the control panel was unresponsive
                const pendingErrors = JSON.parse(localStorage.getItem('pendingErrors') || '[]');
                pendingErrors.forEach(error => {
                    controlPanelScene.slider.addTextItem(error.type, error.message, error.source, error.sceneName);
                });
                localStorage.removeItem('pendingErrors');
            }
        });
    }
    function isControlPanelResponsive() {
        console.log('Checking if control panel is responsive');
        if (!controlPanelGame || !controlPanelGame.scene) {
            console.log('Control panel game or scene not found');
            return false;
        }
    
        const controlPanelScene = controlPanelGame.scene.getScene('ControlPanelScene');
        if (!controlPanelScene) {
            console.log('Control panel scene not found');
            return false;
        }
    
        try {
            if (!controlPanelScene.scene.isActive('ControlPanelScene')) {
                console.log('Control panel scene is not active');
                return false;
            }
            if (controlPanelScene.hasError) {
                console.log('Control panel scene has an error');
                return false;
            }
            const isResponsive = controlPanelScene.heartbeat();
            console.log('Control panel heartbeat result:', isResponsive);
            return isResponsive;
        } catch (error) {
            console.error('Error checking control panel responsiveness:', error);
            return false;
        }
    }




}




window.addEventListener('resize', resizeGames);
resizeGames(); // Initial resize

let escapeKeyHeld = false;
let escapeKeyHoldTimeout = null;
 // Global event listener for detecting Escape key held for more than 5 seconds
 window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !escapeKeyHeld) {
        escapeKeyHeld = true;

        // Start a timer to check if the key is held for 5 seconds
        escapeKeyHoldTimeout = setTimeout(() => {
            // If Escape is held for 5 seconds, trigger an action
            console.log('Escape key held for 5 seconds!');

            // You can add your custom functionality here
            // For example, reboot or reset game logic
            triggerEscapeHeldAction();
        }, 5000); // 5000ms = 5 seconds
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        escapeKeyHeld = false;

        // If the key is released before 5 seconds, clear the timeout
        if (escapeKeyHoldTimeout) {
            clearTimeout(escapeKeyHoldTimeout);
            escapeKeyHoldTimeout = null;
        }
    }
});

function triggerEscapeHeldAction() {
    // Define the action that will occur when Escape is held for more than 5 seconds
    console.log('Triggering custom action because Escape was held.');
    const controlPanelScene = globals.controlPanelGameInstance.scene.getScene('ControlPanelScene');
    controlPanelScene.showScene();
    console.log('showing scene');
    // Example: restartGames() or any other custom functionality
}

window.onbeforeunload = function() {
    try {
      const controlPanelScene = globals.controlPanelGameInstance.scene.getScene('ControlPanelScene');
      console.log('backing up data before refresh');
      const sliderData = controlPanelScene.slider.exportData();
      localStorage.setItem('sliderData', JSON.stringify(sliderData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };