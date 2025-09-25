
class SceneManager {
    constructor(game, controlGame, controlPanelGame, inputManager) {
        this.game = game;
        this.inputManager = inputManager;
        this.currentScene = '';
        this.controlCurrentScene = 'ControlScene';
        this.controlPanelGame = controlPanelGame;
        this.mainCurrentScene = '';
        this.isTransitioning = false
        // this.sceneManager = game.scene;
        // this.setupGlobalInputHandler();
        this.fadeTime = 1000;
        this.controlGame = controlGame; // Second game instance (control window)


         // Populate scenes from both games
         this.mainGameScenes = this.getScenesInGame(this.game);
         this.controlGameScenes = this.getScenesInGame(this.controlGame);

        //  console.log('Main Game Scenes:', this.mainGameScenes);
        //  console.log('Control Game Scenes:', this.controlGameScenes);
         this.transitionQueue = [];


    }


       // Add a transition request to the queue
       queueTransition(newSceneName, data = {}, pauseCurrent = false, start = false, restart = false, relaunch = false) {
        this.transitionQueue.push({ newSceneName, data, pauseCurrent, start, restart, relaunch });
        this.processQueue();
    }

        // Process the transition queue
        processQueue() {
            if (this.isTransitioning || this.transitionQueue.length === 0) {
                return;
            }

            const { newSceneName, data, pauseCurrent, start, restart, relaunch } = this.transitionQueue.shift();
            this.transitionTo(newSceneName, data, pauseCurrent, start, restart, relaunch);
        }



    getCurrentScene(instance) {

        if (instance.name === 'Game')

            {

                return this.game.scene.getScenes(true)[0].scene.key; //this.currentScene || 
            }

        else
        {
            return this.controlGame.scene.getScenes(true)[0].scene.key; //this.controlCurrentScene || 
        }
    }
    
    // init() {
    //     console.log('Initializing SceneManager');
    //     this.inputManager.init(this.game);
        
    //     // Set up inputs for the initial scene after a short delay
    //     this.game.time.delayedCall(100, () => {
    //         const initialSceneName = 'MainMenuScene'; // or whatever your initial scene is
    //         console.log('Setting up inputs for initial scene:', initialSceneName);
    //         const initialInputs = this.getSceneInputs(initialSceneName);
    //         this.inputManager.setSceneInputs(initialSceneName, initialInputs);
    //     });
    // }


    // Initializes the scene manager
    init() {
        // console.log('Initializing SceneManager');
        this.inputManager.init(this.game);   // Initialize inputs for the main game instance
        // this.inputManager.init(this.controlGame); // Initialize inputs for the second game instance

        // Set up inputs for the initial scene after a short delay
        this.game.time.delayedCall(100, () => {
            const initialSceneName = 'MainMenuScene'; // or whatever your initial scene is
            // console.log('Setting up inputs for initial scene:', initialSceneName);
            const initialInputs = this.getSceneInputs(initialSceneName);
            this.inputManager.setSceneInputs(initialSceneName, initialInputs);
        });
    }
    start(newSceneName,  data = {})
    {
        this.transitionTo(newSceneName, data, false, true, false, false)
    }
    launch(newSceneName,  data = {})
    {
        this.transitionTo(newSceneName, data, true, false, false, false)
    }



    restart(newSceneName,  data = {})
    {
        this.transitionTo(newSceneName, data, false, false, true, false)

    }

    relaunch(newSceneName,  data = {})
    {
        this.transitionTo(newSceneName, data, false, false, false, true)

    }


    getScenesInGame(gameInstance) {
        return gameInstance.scene.scenes.map(scene => scene.scene.key);
    }


    //  // Determine which game instance a scene belongs to
    //  getGameInstanceForScene(sceneName) {
    //     if (this.mainGameScenes.includes(sceneName)) {
    //         return this.game;
    //     } else if (this.controlGameScenes.includes(sceneName)) {
    //         return this.controlGame;
    //     } else {
    //         return null;
    //     }
    // }
    // Determine which game instance a scene belongs to
getGameInstanceForScene(sceneName) {
    // console.log(`Checking scene: ${sceneName}`); // Log the scene being checked

    if (this.mainGameScenes.includes(sceneName)) {
        // console.log(`Scene "${sceneName}" belongs to Main Game`); // Log when a scene is found in mainGameScenes
        return this.game;
    } else if (this.controlGameScenes.includes(sceneName)) {
        // console.log(`Scene "${sceneName}" belongs to Control Game`); // Log when a scene is found in controlGameScenes
        return this.controlGame;
    } else {
        // console.log(`Scene "${sceneName}" does not belong to any known game instance`); // Log when a scene is not found
        return null;
    }
}


    stop(scene)
    {
        // console.log('Stopping:', scene);
        //replacing targetgameinstance with currentgameinstance
        this.getGameInstanceForScene(scene).scene.stop(scene);
        //replacing the old scene of the target instance.
        //replacing targetgameinstance with currentgameinstance
        const runningScenes = this.getGameInstanceForScene(scene).scene.getScenes(true);
        // console.log('Running scenes:', runningScenes.map(scene => scene.scene.key));
    }










    reboot() {
        try{
            // Get all running scenes in both game and control game instances
            const runningScenes = this.game.scene.getScenes(); // true returns only active scenes
            const controlRunningScenes = this.controlGame.scene.getScenes();
        
            // Stop all running scenes in the main game instance
            runningScenes.forEach(scene => {
                console.log(`Stopping scene: ${scene.key}`);
                this.game.scene.stop(scene.key);
            });
        
            // Stop all running scenes in the control game instance
            controlRunningScenes.forEach(scene => {
                console.log(`Stopping control scene: ${scene.key}`);
                this.controlGame.scene.stop(scene.key);
            });
                    
          

            // Start ControlScene and MainMenuScene
            // console.log('Starting ControlScene and MainMenuScene');
            this.controlGame.scene.start('ControlScene');
            this.game.scene.start('MainMenuScene');

            this.mainCurrentScene = 'MainMenuScene';
            this.currentScene = 'MainMenuScene';
            this.controlCurrentScene = 'ControlScene';

            this.isTransitioning=false;

            const inputs = this.getSceneInputs('MainMenuScene');
            // console.log('Setting inputs for', 'MainMenuScene', ':', inputs);
            this.inputManager.setSceneInputs('MainMenuScene', inputs);


            console.log(this.game.input.enabled);  // Logs whether input is enabled
            console.log(this.controlGame.input.enabled);  // Logs whether input is enabled
            console.log(this.controlPanelGame.input.enabled);  // Logs whether input is enabled

            // console.log('Reboot completed successfully');

        }
        catch{
            console.error('Error during reboot:', error);

        }


    }
    

    //replaced this.currentscene with oldscene2
    transitionTo(newSceneName, data = {}, pauseCurrent = false, start = false, restart = false, relaunch = false) { //, cleanup = false
        this.isTransitioning = true;
        this.inputManager.clearAllListeners();
        let fade = false;


        const targetGameInstance = this.getGameInstanceForScene(newSceneName);
        const currentGameInstance = this.getGameInstanceForScene(this.currentScene);
        const controlCurrentGameInstance = this.getGameInstanceForScene(this.controlCurrentScene);
        const mainGameInstance = this.getGameInstanceForScene(this.mainCurrentScene);
       

        

        // // Log the game instances and the scene names
        // console.log(`Transitioning to scene: ${newSceneName}`);
        // console.log(`Current scene: ${this.currentScene}`);
        // console.log(`Control Current scene: ${this.controlCurrentScene}`);

        // console.log(`Target game instance for ${newSceneName}:`, targetGameInstance.name);
        // console.log(`Current game instance for ${this.currentScene}:`, currentGameInstance.name);
        // console.log(`Current control game instance for ${this.controlCurrentScene}:`, controlCurrentGameInstance.name);
        // console.log(`Current main game instance for ${this.mainCurrentScene}:`, mainGameInstance.name);

       

        // let oldScene2;
        if (targetGameInstance.name === 'Control Game')
        {
            // oldScene2 = this.controlCurrentScene;
            targetGameInstance.oldScene = this.controlCurrentScene
        }
        else
        {
            // oldScene2 = this.currentScene;
            targetGameInstance.oldScene = this.currentScene
        }

        //checking if the same
        if (targetGameInstance === mainGameInstance)
            {
                // console.log('target and main current game instance is the same');
            }

        // if (targetGameInstance.name === 'Control Game')
        // {

        //     console.log('launching scene the control game instance');
        //     console.log('controlcurrentscene: ', this.controlCurrentScene);
        //     if (newSceneName === 'ItemsScene')
        //     {
        //         this.controlGame.scene.start(newSceneName);
        //     }
        //     return;
        // }






        if(newSceneName === 'BattleScene' && this.currentScene==='MapScene')
        {
            fade = true;
            // console.log('running transition from battle to mapscene animation');
            this.fadeTime = 2000;
            this.game.scene.run('TransitionScene', {transitionType : 'checkerboard'}); //, fadeTime:this.fadeTime
            // this.game.scene.getScene('TransitionScene').fadeOut(this.fadeTime);
            this.game.scene.getScene('TransitionScene').checkerboardOut(this.fadeTime);
                        // Listen for the 'create' event to make sure the scene is fully initialized
            // this.game.scene.getScene('TransitionScene').events.once('create', () => {
            //     // Now it's safe to call methods on the scene, like 'checkerboardOut'
            //     this.game.scene.getScene('TransitionScene').checkerboardOut(this.fadeTime);
            // });
            this.game.scene.bringToTop('TransitionScene');
        }
        else
        {
            this.fadeTime = 0
        }


      


       
        const scenes = this.controlGame.scene.getScenes(true);
        console.log(scenes); // Check what scenes contains
        // const newSceneInstance = this.game.scene.getScene(newSceneName);

        // Check if the scene exists
        // const runningScenes = this.game.scene.getScenes(true);
        const runningScenes = this.game.scene.getScenes(true).map(scene => scene.scene.key);
        const controlRunningScenes = this.controlGame.scene.getScenes(true).map(scene => scene.scene.key);

        // console.log('Running scenes:', runningScenes.map(scene => scene.scene.key));
        // console.log('Running scenes:',runningScenes);
        // console.log('control Running scenes:',controlRunningScenes);




            // Close lingering scenes before transitioning to MapScene or BattleScene
        if (newSceneName === 'MapScene' || newSceneName === 'BattleScene' || (newSceneName === 'MenuScene' )) { //&& this.mainCurrentScene === 'MapScene'
            const scenesToKeep = [ 'TransitionScene', 'MapScene', this.currentScene];  //'MapScene', 'BattleScene', 
            console.log('Scene to keep: currentScene: ', this.currentScene);
            runningScenes.forEach(scene => {
                if (!scenesToKeep.includes(scene)) {
                    // console.log(`Stopping lingering scene: ${scene}`);
                    this.game.scene.stop(scene);
                }
            });
            const controlScenesToKeep = ['ControlScene'];  // Add other critical scenes if needed //this.controlCurrentScene
            controlRunningScenes.forEach(scene => {
                if (!controlScenesToKeep.includes(scene)) {
                    // console.log(`Stopping lingering scene: ${scene}`);
                    this.controlGame.scene.stop(scene);
                }
            });
            this.controlCurrentScene === 'ControlScene';

            // targetGameInstance.oldScene = this.controlCurrentScene;


        }

      
        //this.mainCurrentScene


        //trying to replace targetgameinstance.oldscene with this.maincurrentscene
        if ((newSceneName === this.mainCurrentScene ) && relaunch === false && restart === false && start === false){ //replaced this.currentScene with targetGameInstance.oldScene
            // console.log('cant switch to the same scene: and restart, relaunch and start is all false', this.mainCurrentScene);//targetGameInstance.oldScene
            // console.log('relaunch, restart and start: ', relaunch, restart, start);
      


            if (targetGameInstance.name === 'Game')
            {
                this.currentScene = newSceneName;

            }
            else
            {
                this.controlCurrentScene = newSceneName;

            }
            // this.game.scene.bringToTop(newSceneName);
            targetGameInstance.scene.bringToTop(newSceneName);
            // this.currentScene = newSceneName;
            this.mainCurrentScene = newSceneName;
            this.isTransitioning=false;

            // if (this.mainCurrentScene === 'PokemonDetailsScene') 
            // {

            // }


            this.processQueue();

            return;
        }
        
        // const oldScene= this.currentScene;
        
        const oldScene = targetGameInstance.oldScene;
        const mainOldScene = this.mainCurrentScene;
        

        if (this.newSceneName === 'MapScene')
        {
            globals.eventManager.removeAllListeners();

        }

        setTimeout(() => {
            // this.game.scene.bringToTop(newSceneName);
        
        



          //replacing oldscene with mainoldscene
        if (mainOldScene === null && targetGameInstance.name === 'Game')
            {
                this.game.scene.start(newSceneName, data);
                this.game.scene.bringToTop(newSceneName);
                const inputs = this.getSceneInputs(newSceneName);
                // console.log('Setting inputs for', newSceneName, ':', inputs);
                this.inputManager.setSceneInputs(newSceneName, inputs);
                // console.log('not disabling listeners in main menu scene because null');
                this.isTransitioning = false;

                this.processQueue();
                return;
            }
            else
            
            {
                this.inputManager.disableListeners();
    
            }
        // console.log('transitioning from ' + mainOldScene + ' to ' + newSceneName);
   
      
            //replacing this.game with targetGameInstance
            //replacing oldscene with maincurrentscene
        if (this.mainCurrentScene && (!pauseCurrent && !relaunch) || start) {
            // console.log('Stopping:', this.mainCurrentScene);
            //replacing targetgameinstance with currentgameinstance
            mainGameInstance.scene.stop(this.mainCurrentScene);
            //replacing the old scene of the target instance.
            //replacing targetgameinstance with currentgameinstance
            const runningScenes = mainGameInstance.scene.getScenes(true);
            // console.log('Running scenes:', runningScenes.map(scene => scene.scene.key));

        }



    

            setTimeout(() => {
                if (this.fadeTime != 0)
                {
                    this.game.scene.getScene('TransitionScene').checkerboardIn(this.fadeTime);

                }
                //replacing this.game with targetGameInstance in all instances
                const isSceneActive = targetGameInstance.scene.isActive(newSceneName);
                // const isScenePaused = runningScenes.length > 0 && runningScenes[0].scene && runningScenes[0].scene.isPaused(newSceneName);
                const isScenePaused = targetGameInstance.scene.getScenes(true).some(scene => scene.scene.key === newSceneName && scene.scene.isPaused());

                if (start || restart || relaunch) { //adding relaunch
                    // console.log('Starting new scene:', newSceneName);
                    targetGameInstance.scene.start(newSceneName, data);
                }
                else
                if (isSceneActive || isScenePaused) {
                    // console.log('Resuming:', newSceneName);
                    targetGameInstance.scene.resume(newSceneName);
                    // this.game.scene.bringToTop(newSceneName);
                }
        
                else if (pauseCurrent) {
                    // console.log('Launching new scene:', newSceneName);
                    
                    //replacing oldscene with newscenename so its in the same context
                    // console.log('oldscene is: ',  oldScene);
                    // console.log('maincurrentscene: ', this.mainCurrentScene);
                    let launchScene = oldScene;
                

                    if (targetGameInstance.scene.isActive(oldScene))
                    {
                        // console.log('launching ' + newSceneName);
                        targetGameInstance.scene.getScene(oldScene).scene.launch(newSceneName, data); //this.getCurrentScene(targetGameInstance)

                    }
                    else
                    {
                        // console.log('starting ' + newSceneName);

                        targetGameInstance.scene.start(newSceneName, data);

                    }




                    // targetGameInstance.scene.getScene(oldScene).scene.launch(newSceneName, data); //this.getCurrentScene(targetGameInstance)


                 



            } else {
                    // console.log('Starting new scene:', newSceneName);
                    targetGameInstance.scene.start(newSceneName, data);
                }
        

                this.game.scene.bringToTop('TransitionScene');


                // console.log('is newscenename active? : ', targetGameInstance.scene.isActive(newSceneName));
                // if (!targetGameInstance.scene.isActive(newSceneName))
                // {
                //     this.isTransitioning=false;
                //     throw new Error(newSceneName + ' is not active');
                // }


                if (this.fadeTime === 0)
                {
                    // console.log('bringing to top: ', newSceneName);
                    // this.game.scene.bringToTop(newSceneName);
                    targetGameInstance.scene.bringToTop(newSceneName);

                }
               if (targetGameInstance.name === 'Control Game')
               {
                    this.controlCurrentScene = newSceneName;
                    // console.log('updating controlcurrentscene to: ', newSceneName);
               }
               else
               {
                    this.currentScene = newSceneName;
                    // console.log('updating currentscene to: ', newSceneName);

               }
               this.mainCurrentScene = newSceneName;
                // this.currentScene = newSceneName;
                // console.log(`Transitioned to new scene: ${newSceneName}`);
                this.syncSecondGameWindow(newSceneName);

                // Set up new input listeners with a delay
                setTimeout(() => {
                    if (targetGameInstance.name === 'Control Game')
                    {
                        // console.log('no inputs to set');
                    }
                    else
                    {
                        const inputs = this.getSceneInputs(newSceneName);
                        // console.log('Setting inputs for', newSceneName, ':', inputs);
                        this.inputManager.setSceneInputs(newSceneName, inputs);
                    }
                    // const inputs = this.getSceneInputs(newSceneName);
                    // console.log('Setting inputs for', newSceneName, ':', inputs);
                    // this.inputManager.setSceneInputs(newSceneName, inputs);
                    const newSceneInstance = this.game.scene.getScene(newSceneName);

                    // Check if the scene exists
                    //replacing this.game with targetGameInstance again
                    // const runningScenes = this.game.scene.getScenes(true);
                    const runningScenes = targetGameInstance.scene.getScenes(true);
                    // console.log('Running scenes:', runningScenes.map(scene => scene.scene.key));
        
    
                    if (this.fadeTime!=0)
                    {
                        // this.game.scene.getScene('TransitionScene').fadeIn(this.fadeTime);

                        
                        setTimeout(() => {
                            // this.game.scene.bringToTop(newSceneName);
                            targetGameInstance.scene.bringToTop(newSceneName);
                            this.game.scene.stop('TransitionScene'); // Stop the TransitionScene after fade out

                            this.isTransitioning=false;
                            this.processQueue();
                        }, this.fadeTime);
                    }
                    else
                    {
                        this.isTransitioning=false;
                        this.processQueue();

                    }
                }, (this.fadeTime/2) + 200);
            }, this.fadeTime + 25);  
        }, this.fadeTime)   
            

      
    }
    
    syncSecondGameWindow(newSceneName, oldSceneName = null) {
        const secondGameInstance = this.getSecondGameInstance();
        
        if (newSceneName === 'MapScene') {
            // console.log('Ensuring control scene is visible on second window for MapScene');
            secondGameInstance.scene.stop('BattleButtonsScene');  // Start BattleButtonsScene

            secondGameInstance.scene.start('ControlScene'); // Ensure control UI is active
            // secondGameInstance.scene.start('MapScene'); // Resume the MapScene in the second instance
        } else if (newSceneName === 'BattleScene') {
            // console.log('BattleScene transition, syncing second window');
            secondGameInstance.scene.stop('ControlScene'); // Pause or hide control UI if needed
            
            // Now load the BattleButtonsScene in the second game instance when transitioning to BattleScene
            if (secondGameInstance.scene.isActive('BattleButtonsScene')) {
                secondGameInstance.scene.stop('BattleButtonsScene'); // Stop the scene if it is already active
            }
            
            secondGameInstance.scene.start('BattleButtonsScene'); // Start or restart the scene
            this.controlCurrentScene = 'BattleButtonsScene';
        } 
        
        // else if (newSceneName === 'RenamePokemonScene' || newSceneName === 'PokemonDetailsScene')
        // {
        //     if (secondGameInstance.scene.isActive('BattleButtonsScene')) {
        //         secondGameInstance.scene.stop('BattleButtonsScene'); // Stop the scene if it is already active
        //     }
        //     secondGameInstance.scene.start('ControlScene'); // Ensure control UI is active
        //     console.log('setting the controlcurrentscene to controlscene...');
        //     this.controlCurrentScene = 'ControlScene';

        // }
    }
    
     // Method to access the second game instance
     getSecondGameInstance() {
        return this.controlGame;
    }

    // Function to cleanup scenes
    cleanupScenes(currentScene = this.currentScene) {
        const activeScenes = this.game.scene.getScenes(true); // Get all active scenes
        activeScenes.forEach(scene => {
            if (scene.key !== currentScene) {
                // console.log(`Stopping scene: ${scene.key}`);

                this.game.scene.stop(scene); // Stop the scene if it's not the current one
               
            }
        });
    }
    // In your SceneManager class
    getSceneInputs(sceneName) {

        const inputs = {
            MenuScene: {
                'keyboard': {
                    'ArrowDown': () => this.game.scene.getScene('MenuScene').navigateMenu(1),
                    's': () => this.game.scene.getScene('MenuScene').navigateMenu(1),
                    'ArrowUp': () => this.game.scene.getScene('MenuScene').navigateMenu(-1),
                    'w': () => this.game.scene.getScene('MenuScene').navigateMenu(-1),
                    'Enter': () => this.game.scene.getScene('MenuScene').confirmSelection(),
                    // 'numpad': {
                    //     callback: (event) => {
                    //         const menuScene = this.game.scene.getScene('MenuScene');
                    //         const key = event.key;
                    //         if (key >= '1' && key <= menuScene.menuOptions.length.toString()) {
                    //             const optionIndex = parseInt(key) - 1;
                    //             if (menuScene.menuOptions[optionIndex] && menuScene.menuOptions[optionIndex].action) {
                    //                 menuScene.menuOptions[optionIndex].action.forEach(action => action());
                    //             }
                    //         }
                    //     }
                    // },
                    // Handle number keys (both main keyboard and numpad)
                    'any': (event) => {
                            const menuScene = this.game.scene.getScene('MenuScene');
                            const key = event.key;  // This will be the key pressed

                            // Check if the key is a number between '1' and the length of the menu options
                            const keyAsNumber = Number(key);  // Convert the key to a number
                            if (!isNaN(keyAsNumber) && keyAsNumber >= 1 && keyAsNumber <= menuScene.menuOptions.length) {
                                const optionIndex = keyAsNumber - 1;  // Convert the key to the index

                                // Execute the action for the selected menu option
                                if (menuScene.menuOptions[optionIndex] && menuScene.menuOptions[optionIndex].action) {
                                    menuScene.menuOptions[optionIndex].action.forEach(action => action());
                                }
                            }
                        },

                    'Escape': () => {
                            // console.log('escaping from menu');
                            this.game.scene.getScene('MenuScene').closeMainMenu();
                        },
                }
                ,
                'button': {
                    'down': {
                        down: () => this.game.scene.getScene('MenuScene').navigateMenu(1),
                        up: () => {} // Add any logic for the 'up' release if necessary
                    },
                    'up': {
                        down: () => this.game.scene.getScene('MenuScene').navigateMenu(-1),
                        up: () => {} // Add any logic for the 'up' release if necessary
                    },
                    'start': {
                        down: () => this.game.scene.getScene('MenuScene').confirmSelection(),
                        up: () => {} // Add any logic for the 'start' button release if necessary
                    },
                    'b': {
                        down: () => {
                            // console.log('escaping from menu');
                            this.game.scene.getScene('MenuScene').closeMainMenu();
                            // this.game.scene.getScene('MapScene').setKeyboardEnabled(true);

                        },
                        up: () => {} // Add any logic for the 'b' button release if necessary
                    },
                    'a': {
                        down: () => this.game.scene.getScene('MenuScene').confirmSelection(),
                        up: () => {} // Add any logic for the 'a' button release if necessary
                    }
                },
                // 'controller':
                // {
                //     'button_0': { // A button (Xbox) or X button (PlayStation)
                //         down: () => this.game.scene.getScene('MenuScene').confirmSelection(),
                //         up: () => {} // Add any logic for button release if necessary
                //     },
                //     'button_1': { // B button (Xbox) or Circle button (PlayStation)
                //         down: () => this.game.scene.getScene('MenuScene').closeMainMenu(),
                //         up: () => {}
                //     },
                // }
            },
            
            WorldScene: {
                'keyboard': {    
                    'Escape': () => {
                        // console.log('Escape key pressed in WorldScene');
                        this.game.scene.getScene('WorldScene').escape();
                    },
                },
                'button': {
                    'b': {
                        down: () => this.game.scene.getScene('WorldScene').escape(),
                    },
                }
                    // ... other inputs
            },
            PartyScene: {
                'keyboard': {    
                    'Escape': () => {
                        // console.log('Escape key pressed in PartyScene');
                        this.game.scene.getScene('PartyScene').closePartyWindow();
                    },
                    
                },
                'button': {
                    'a': {
                        // down: () => this.game.scene.getScene('PartyScene').closePartyWindow(),
                        // up: () => this.game.scene.getScene('MapScene').aButtonPressed = false
                    },
                    'b': {
                        down: () => this.game.scene.getScene('PartyScene').closePartyWindow(),
                        // up: () => this.game.scene.getScene('MapScene').bButtonPressed = false
                    },
                    'start': {
                        // down: () =>  {
                        //             globals.sceneManager.launch('MenuScene');
                        //             this.game.scene.getScene('MapScene').setKeyboardEnabled(false);
                        //         },
                                    
                        // up: () => {}
                    },
                    'select': {
                        // down: () => this.game.scene.getScene('MapScene').selectButtonPressed = true,
                        // up: () => this.game.scene.getScene('MapScene').selectButtonPressed = false
                    },
                }
                // ... other inputs closeItemWindow
            },
            ItemsScene: {
                'keyboard': {    
                    'Escape': () => {
                        // console.log('Escape key pressed in ItemsScene');
                        this.game.scene.getScene('ItemsScene').closeItemWindow();
                    },
                    
                }
                // ... other inputs closeItemWindow
            },
            PokedexScene: {
                'keyboard': {    
                    'Escape': () => {
                        // console.log('Escape key pressed in PokedexScene');
                        this.game.scene.getScene('PokedexScene').closePokedexWindow();
                    },
                }
                    
                // ... other inputs closeItemWindow
            },
            MainMenuScene: {
                'keyboard': {    
                    'Escape': () => {
                        // console.log('Escape key pressed in MainMenuScene');
                        this.game.scene.getScene('MainMenuScene').handleEscapeKey();
                    },
                    'ArrowUp': () => {
                        console.log('ArrowUp key pressed in MainMenuScene');
                        this.game.scene.getScene('MainMenuScene').navigateMenu(-1);
                    },
                    'ArrowDown': () => {
                        console.log('ArrowDown key pressed in MainMenuScene');
                        this.game.scene.getScene('MainMenuScene').navigateMenu(1);
                    }
                    ,'Enter': () => {
                        console.log('Enter key pressed in MainMenuScene');
                        this.game.scene.getScene('MainMenuScene').selectCurrentOption();
                    },
                },
                'button': {
                    'a': {
                        down: () => this.game.scene.getScene('MainMenuScene').selectCurrentOption(),
                       
                    },
                    'b': {
                        down: () => this.game.scene.getScene('MainMenuScene').handleEscapeKey(),
                       
                    },
                    'start': {
                        down: () =>  {
                            this.game.scene.getScene('MainMenuScene').selectCurrentOption();
                                    
                                },
                                    
                        
                    },
                    'select': {
                        down: () =>this.game.scene.getScene('MainMenuScene').selectCurrentOption(),
                      
                    },
                    'up': {
                        down: () => this.game.scene.getScene('MainMenuScene').navigateMenu(-1),
                        
                    },
                    'down': {
                        down: () => this.game.scene.getScene('MainMenuScene').navigateMenu(1),
                      
                        }
                    }
                },
            MapScene: {
                'keyboard': {
                   'Enter': () => {
                        // console.log('Enter key pressed in MapScene');
                        globals.sceneManager.transitionTo('MenuScene', {}, true);
                        this.game.scene.getScene('MapScene').setKeyboardEnabled(false);
                    },
                    'Escape': () => {
                        // console.log('Escape key pressed in MapScene');
                        globals.sceneManager.transitionTo('MainMenuScene');
                        this.game.scene.getScene('MapScene').setKeyboardEnabled(false);
                    },
                    'm': () => {
                        // console.log('m key pressed in MapScene');
                        globals.sceneManager.launch('WorldScene', {from: 'MapScene', originScene : 'MapScene'});
                        this.game.scene.getScene('MapScene').setKeyboardEnabled(false);
                    },
                    'Shift': () => {
                        // console.log('Shift key pressed in MapScene');
                        this.game.scene.getScene('MapScene').useBike();
                    },
                 

                    'w': {
                        down: () => this.game.scene.getScene('MapScene').upButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').upButtonPressed = false
                    },
                    'a': {
                        down: () => this.game.scene.getScene('MapScene').leftButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').leftButtonPressed = false
                    },
                    's': {
                        down: () => this.game.scene.getScene('MapScene').downButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').downButtonPressed = false
                    },
                    'd': {
                        down: () => this.game.scene.getScene('MapScene').rightButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').rightButtonPressed = false
                    },
                    'ArrowUp': {
                        down: () => this.game.scene.getScene('MapScene').upButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').upButtonPressed = false
                    },
                    'ArrowDown': {
                        down: () => this.game.scene.getScene('MapScene').downButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').downButtonPressed = false
                    },
                    'ArrowLeft': {
                        down: () => this.game.scene.getScene('MapScene').leftButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').leftButtonPressed = false
                    },
                    'ArrowRight': {
                        down: () => this.game.scene.getScene('MapScene').rightButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').rightButtonPressed = false
                    },

                    
                    ' ': {
                        down: () => this.game.scene.getScene('MapScene').aButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').aButtonPressed = false
                    },


                },
                'button': {
                    'a': {
                        down: () => this.game.scene.getScene('MapScene').aButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').aButtonPressed = false
                    },
                    'b': {
                        down: () => this.game.scene.getScene('MapScene').bButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').bButtonPressed = false
                    },
                    'start': {
                        down: () =>  {
                                    globals.sceneManager.launch('MenuScene');
                                    this.game.scene.getScene('MapScene').setKeyboardEnabled(false);
                                },
                                    
                        up: () => {}
                    },
                    'select': {
                        down: () => this.game.scene.getScene('MapScene').selectButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').selectButtonPressed = false
                    },
                    'up': {
                        down: () => this.game.scene.getScene('MapScene').upButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').upButtonPressed = false
                    },
                    'down': {
                        down: () => this.game.scene.getScene('MapScene').downButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').downButtonPressed = false
                    },
                    'left': {
                        down: () => this.game.scene.getScene('MapScene').leftButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').leftButtonPressed = false
                    },
                    'right': {
                        down: () => this.game.scene.getScene('MapScene').rightButtonPressed = true,
                        up: () => this.game.scene.getScene('MapScene').rightButtonPressed = false
                    }
                }
            },
           
            RenamePokemonScene: {
                'keyboard': {
                    'Escape': {
                        down: () => {
                            // console.log('Escape key pressed in RenamePokemonScene');
                            this.game.scene.getScene('RenamePokemonScene').cancel();
                        }
                    },
                    'Enter': {
                        down: () => {
                            // console.log('Enter key pressed in RenamePokemonScene');
                            this.game.scene.getScene('RenamePokemonScene').confirmName();
                        }
                    },
                    'any': {
                        down: (event) => {  // Handle keydown event
                            const key = event.key;
                            const renameScene = this.game.scene.getScene('RenamePokemonScene');
                            // console.log('key pressed: ', key);
                            if (key === 'Backspace') {
                                renameScene.currentName = renameScene.currentName.slice(0, -1);  // Remove last character
                            } else if (key.length === 1 && renameScene.currentName.length < renameScene.maxNameLength) {
                                renameScene.currentName += key;  // Append new character
                            }
                            renameScene.updateNameText();  // Update displayed name
                        },
                        up: (event) => {
                            // Optional: Handle key release if needed
                            // console.log('key released: ', event.key);
                        }
                    }
                    
                },
                'button': {
                    'a': {
                        down: () => {
                            const scene = this.game.scene.getScene('RenamePokemonScene');
                            scene.confirmName();
                        }
                    },
                    'b': {
                        down: () => {
                            const scene = this.game.scene.getScene('RenamePokemonScene');
                            scene.currentName = scene.currentName.slice(0, -1);  // Remove last character
                            scene.updateNameText();  // Update displayed name

                        }
                    },
                    'start': {
                        down: () => {
                            const scene = this.game.scene.getScene('RenamePokemonScene');
                            scene.confirmName();

                        }
                    },
                    // 'select': {
                    //     down: () => {
                    //         const scene = this.game.scene.getScene('RenamePokemonScene');
                    //         scene.currentName = scene.currentName.slice(0, -1);  // Remove last character
                    //         scene.updateNameText();  // Update displayed name

                    //     }
                    // }
                }
            },
            
            ComputerScene: {
                'keyboard': {    
                    'Escape': () => {
                        console.log('Escape key pressed in ComputerScene');
                        this.game.scene.getScene('ComputerScene').exit();
                    
                    },
                }
                    
                // ... other inputs closeItemWindow
            },
            MoveListScene: {
                'keyboard': {    
                    'Escape': () => {
                        this.game.scene.getScene('MapScene').setKeyboardEnabled(true);
                        globals.sceneManager.transitionTo('MapScene');
                    
                    },
                }
                    
                // ... other inputs closeItemWindow
            },
            PokemonDetailsScene: {
                'keyboard': {        
                    'Escape': () => {
                        this.game.scene.getScene('PokemonDetailsScene').exitDetailsScene();
                        // this.game.scene.getScene('MapScene').setKeyboardEnabled(true);

                        // globals.sceneManager.transitionTo('MapScene');
                    
                    },
                   
                },
                'button': {
                    'a': {
                        down: () => {
                            this.game.scene.getScene('PokemonDetailsScene').exitDetailsScene();
                           
                        }
                    },
                    'b': {
                        down: () => {
                            this.game.scene.getScene('PokemonDetailsScene').exitDetailsScene();
                           
                        }
                    }
                }
                
                // ... other inputs closeItemWindow
            },
            BreederScene: {
                'keyboard': {
                    'Escape': () => {
                        this.game.scene.getScene('BreederScene').closePartyWindow();
                        // this.game.scene.getScene('MapScene').setKeyboardEnabled(true);

                        // globals.sceneManager.transitionTo('MapScene');
                    
                    },
                },
                'button': {
                    // 'a': {
                    //     down: () => {
                    //         this.game.scene.getScene('BreederScene').closePartyWindow();
                           
                    //     }
                    // },
                    'b': {
                        down: () => {
                            this.game.scene.getScene('BreederScene').closePartyWindow();
                           
                        }
                    }
                }
                
                // ... other inputs closeItemWindow
            },
            BattleScene: {
                'keyboard': {        
                    // 'Escape': () => {
                    //     this.game.scene.getScene('PokemonDetailsScene').exitDetailsScene();
                    //     // this.game.scene.getScene('MapScene').setKeyboardEnabled(true);

                    //     // globals.sceneManager.transitionTo('MapScene');
                    
                    // },
                    ' ': () => {
                        const scene = this.game.scene.getScene('BattleScene');


                        if (scene.dialogueBoxManager) {
                            console.log('has active dialogue', globals.dialogueBoxManager.hasActiveDialogue());
                        } else {
                            console.log('dialogueBoxManager is undefined');
                        }


                        if (globals.dialogueBoxManager.hasActiveDialogue())
                        {
                            scene.handleNextDialoguePage.call(scene);;

                        }
                        else
                        {
                            console.log('triggering spacebar');
                            scene.handleSpacebar.call(scene);
                        }
                        
                    
                    },
                    'Enter': () => {
                        const scene = this.game.scene.getScene('BattleScene');
                        if (globals.dialogueBoxManager.hasActiveDialogue())
                        {
                            scene.handleNextDialoguePage.call(scene);;

                        }
                        else
                        {
                            scene.handleEnter.call(scene);
                        }
                        
                    
                    },
                    'Shift': () => {
                        const scene = this.game.scene.getScene('BattleScene');
                        if (globals.dialogueBoxManager.hasActiveDialogue())
                        {
                            //scene.handleNextDialoguePage();;

                        }
                        else
                        {
                            scene.handleShift.call(scene);
                        }
                        
                    
                    },
                    'Escape': () => {
                        const scene = this.game.scene.getScene('BattleScene');
                        if (globals.dialogueBoxManager.hasActiveDialogue())
                        {
                            scene.handleNextDialoguePage.call(scene);;

                        }
                        else
                        {
                            scene.handleEscape.call(scene);
                        }
                        
                    
                    },
                   
                },
                'button': {
                    'a': {
                        down: () => {


                             const scene = this.game.scene.getScene('BattleScene');


                            if (scene.dialogueBoxManager) {
                                console.log('has active dialogue', globals.dialogueBoxManager.hasActiveDialogue());
                            } else {
                                console.log('dialogueBoxManager is undefined');
                            }


                            if (globals.dialogueBoxManager.hasActiveDialogue())
                            {
                                scene.handleNextDialoguePage.call(scene);;

                            }
                            else
                            {
                                console.log('triggering spacebar');
                                scene.handleSpacebar.call(scene);
                            }
                            
                        }
                    },
                    'b': {
                        down: () => {
                            
                            const scene = this.game.scene.getScene('BattleScene');


                            if (scene.dialogueBoxManager) {
                                console.log('has active dialogue', globals.dialogueBoxManager.hasActiveDialogue());
                            } else {
                                console.log('dialogueBoxManager is undefined');
                            }


                            if (globals.dialogueBoxManager.hasActiveDialogue())
                            {
                                scene.handleNextDialoguePage.call(scene);;

                            }
                            else
                            {
                                console.log('triggering spacebar');
                                scene.handleSpacebar.call(scene);
                            }
                           
                        }
                    },
                    // 'a': {
                    //     down: () => {
                    //         this.game.scene.getScene('PokemonDetailsScene').exitDetailsScene();
                           
                    //     }
                    // },
                    // 'a': {
                    //     down: () => {
                    //         this.game.scene.getScene('PokemonDetailsScene').exitDetailsScene();
                           
                    //     }
                    // }
                }
                
                // ... other inputs closeItemWindow
            },
    
          
        };
        // console.log('Inputs for', sceneName, ':', inputs[sceneName]);

        return inputs[sceneName] || {};
    }
    handleInput(sceneName, event) {
        const sceneInputs = this.getSceneInputs(sceneName);
        const key = event.key;
    
        if (sceneInputs[key]) {
            if (typeof sceneInputs[key] === 'function') {
                sceneInputs[key]();
            } else if (sceneInputs[key].callback) {
                sceneInputs[key].callback(event);
            }
        } else if (sceneName === 'RenamePokemonScene' && sceneInputs['any']) {
            sceneInputs['any'].callback(event);
        }
    }

    handleRenamePokemonInput(scene, event) {
        if (event.key === 'Backspace') {
            scene.currentName = scene.currentName.slice(0, -1);
        } else if (event.key === 'Enter') {
            scene.confirmName();
        } else if (event.key === 'Escape') {
            scene.cancel();
        } else if (scene.currentName.length < scene.maxNameLength && event.key.length === 1) {
            scene.currentName += event.key;
        }
        scene.updateNameText();
    }
    // getCurrentScene() {
    //     const activeScene = this.game.scene.getScenes(true)[0];
    //     console.log('Current active scene:', activeScene.scene.key);
    //     return activeScene.scene.key;
    // }


    isLetter(key) {
        return key.length === 1 && /^[a-zA-Z]$/.test(key); // Check if the key is a single letter
    }
}
