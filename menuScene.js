class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });

        this.keyboard = false;
        // this.pokemonList = null;
        // this.itemList = null;
        this.menuBackground=null;

        this.numpadKeyListener = null;
        this.escapeKeyListener = null;
        this.selectedIndex = 0; // Keep track of the currently selected button

        this.menuOptions = [];

    }

    preload()
    {

        // Load sprite sheets for each Pokémon
        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        });
        this.load.image('menubackground', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu4.png');
        this.load.image('menubackground2', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');

        this.load.image('panel', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched_square.png');
        this.load.image('panel2', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched_square.png');
        this.load.image('panel3', 'images/NinjaAdventure/Ui/Theme/nine_path_7_streched.png');
        this.load.image('button_normal', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_normal.png');
        this.load.image('button_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_hover.png');
        this.load.image('button_selected', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_pressed.png');
        
        
        this.load.image('v_slidder_grabber', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber.png');
        this.load.image('v_slidder_grabber_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_hover.png');
        this.load.image('v_slidder_grabber_disabled', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_disabled.png');

        this.load.image('nine_path_bg', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg.png');
        this.load.image('nine_path_bg_stretched', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched.png');
        this.load.image('nine_path_bg_2_stretched', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched.png');



       
    }


    create() {
        console.log('menu created');
        // Create the initial menu
        this.originScene = 'MenuScene';
        this.createMainMenu();
    }

    


    createMainMenu() {

        this.scene.bringToTop('MenuScene');
        // Clear any existing menu options
        // this.clearMenu();
        this.keyboard = false;
        setTimeout(() => {
            this.keyboard = true;
        }, 500);
    



        const menuWidth = this.cameras.main.width / 4;
        const menuX = this.cameras.main.width - menuWidth;

        // Add background for the menu
        const background = this.add.image(menuX, 0, 'menubackground').setOrigin(0);
        background.setDisplaySize(menuWidth, this.cameras.main.height);
        // background.setVisible(false);
        // Create a container for menu items
        const menuContainer = this.add.container(menuX, 0);

 
        this.menuOptions = [
            { 
                text: 'Party', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    // this.scene.pause(); // Pause the main menu scene
                    // this.scene.launch('PartyScene', { originScene: 'MenuScene' });
                    globals.sceneManager.transitionTo('PartyScene', { originScene: 'MenuScene', from: 'MenuScene', action: 'switch' });

                }]
            },
            { 
                text: 'Items', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    // this.scene.pause(); // Pause the main menu scene
                    // this.scene.launch('ItemsScene', { originScene: 'MenuScene', action: 'useItem' });
                    globals.sceneManager.transitionTo('ItemsScene', { originScene: 'MenuScene', action: 'useItem', from: 'MenuScene' });

                }]
            },
            { 
                text: 'Monster\nDetails', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    // this.scene.pause(); // Pause the main menu scene
                    // this.scene.launch('PokedexScene', { originScene: 'MenuScene' });
                    globals.sceneManager.transitionTo('PokedexScene', { originScene: 'MenuScene'});

                }]
            },
            { 
                text: 'Map', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    // this.scene.pause(); // Pause the main menu scene
                    // this.scene.launch('WorldScene', { originScene: 'MenuScene' });
                    globals.sceneManager.launch('WorldScene', { originScene: 'MenuScene' });
                    // this.scene.start('WorldScene');
                }]
            },
            { 
                text: 'Orbs', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    // this.scene.pause(); // Pause the main menu scene
                    globals.sceneManager.transitionTo('ItemsScene', { originScene: 'MenuScene', action: 'orbs' });

                    // this.scene.launch('ItemsScene', { originScene: 'MenuScene', action: 'orbs' });
                }]
            },
            { 
                text: 'Berries', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    // this.scene.pause(); // Pause the main menu scene
                    // this.scene.launch('ItemsScene', { originScene: 'MenuScene', action: 'berries' });
                    globals.sceneManager.transitionTo('ItemsScene', { originScene: 'MenuScene', action: 'berries', from: 'MenuScene'});

                }]
            },
            { 
                text: 'Close', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    this.closeMainMenu();
            }] 
            },
            { 
                text: 'Quit', 
                action: [() => {
                    // this.setKeyboardEnabled(false);
                    globals.sceneManager.start('MainMenuScene')

            }] 
            }
        ];
            
    
       
        

        const buttonWidth = menuWidth - 88; // Leave some padding on both sides
        const buttonSpacing = 20; // Increase spacing between buttons


        console.log('menuWidth:', menuWidth, 'buttonSpacing:', buttonSpacing);


        this.menuOptions.forEach((option, index) => {
            const button = new Button(this, 75, 45 + index * buttonSpacing * 2, menuWidth - 60, buttonSpacing * 2, option.text, option.action);
            button.index = index; // Store the index in the button
            button.setCustomData('action', option.action);  // Use setCustomData instead of setData
            menuContainer.add(button);
        });
        this.menuContainer = menuContainer;



       
        // // Set up keyboard input
        // this.input.keyboard.on('keydown', (event) => {
        //     if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        //         this.navigateMenu(1); // Move down the menu
        //     } else if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        //         this.navigateMenu(-1); // Move up the menu
        //     } else if (event.key === 'Enter') {
        //         this.confirmSelection(); // Confirm the selection
        //     }
        // });


        // Highlight the first button initially
        this.updateButtonStyle(this.selectedIndex, true);



    //     // Define the numpad key listener globally
    //     this.numpadKeyListener = (event) => {
    //         const key = event.key;

    //         // Check if the key is between 1 and the length of menuOptions
    //         if (key >= '1' && key <= menuOptions.length.toString()) {
    //             const optionIndex = parseInt(key) - 1; // Convert keypress to index (1 -> 0, 2 -> 1, etc.)

    //             // Execute the action associated with the selected option
    //             if (menuOptions[optionIndex] && menuOptions[optionIndex].action) {
    //                 menuOptions[optionIndex].action.forEach(action => action());
    //             }
    //         }
    //     };


    //     // Add the numpad key listener
    //     document.addEventListener('keydown', this.numpadKeyListener);

    //     // };
    //     // this.escapeKeyListener;
    //   // Add the event listener for the Escape key
    //     this.escapeKeyListener = (event) => {
    //         if (event.key === 'Escape') {
    //             console.log('escaping');
    //             // document.removeEventListener('keydown', this.escapeKeyListener);
    //             this.closeMainMenu();
    //         }
    //     };

    //     document.addEventListener('keydown', this.escapeKeyListener);

       
        //////////////////////////////////////////////////////////////////


        //    this.inputManager = globals.inputManager;
        // this.inputManager.init(this);
    
        // // this.inputManager.setScene('MenuScene');
        // this.inputManager.clearAllListeners();


        // const menuInputs = {
        //     'ArrowDown': () => this.navigateMenu(1),
        //     's': () => this.navigateMenu(1),
        //     'ArrowUp': () => this.navigateMenu(-1),
        //     'w': () => this.navigateMenu(-1),
        //     'Enter': () => this.confirmSelection(),
        //     'numpad': {
        //         callback: (event) => {
        //             const key = event.key;
        //             if (key >= '1' && key <= menuOptions.length.toString()) {
        //                 const optionIndex = parseInt(key) - 1;
        //                 if (menuOptions[optionIndex] && menuOptions[optionIndex].action) {
        //                     menuOptions[optionIndex].action.forEach(action => action());
        //                 }
        //             }
        //         }
        //     },
        //     'Escape': {
        //         callback: () => {
        //             console.log('escaping from menu');
        //             this.closeMainMenu();
        //         }
        //     }
        // };
        
        // this.inputManager.setSceneInputs('MenuScene', menuInputs);



        this.sceneManager = globals.sceneManager;
        this.inputManager = globals.inputManager;
       









        ///////////////////////////////////////////////////////////////////






    }
    



    navigateMenu(direction) {


        if (this.isNavigating) return;
        this.isNavigating = true;
    
        // Your navigation logic here
        console.log(`Navigating menu: ${direction}`);
    
        setTimeout(() => {
            this.isNavigating = false;
        }, 100); // Adjust this delay as needed


        // Remove the highlight from the current selection
        this.updateButtonStyle(this.selectedIndex, false);

        // Update the selected index based on the direction
        this.selectedIndex += direction;

        // Wrap around the selection
        if (this.selectedIndex < 0) {
            this.selectedIndex = this.menuContainer.list.length - 1; // Go to last option
        } else if (this.selectedIndex >= this.menuContainer.list.length) {
            this.selectedIndex = 0; // Go to first option
        }

        // Highlight the new selection
        this.updateButtonStyle(this.selectedIndex, true);
    }

    updateButtonStyle(index, isSelected) {
        const button = this.menuContainer.list[index];
        const buttonText = button.getAt(1); // Get the text object from the button container
        const newFontSize = isSelected ? '16px' : '12px'; // Increase size when selected

        buttonText.setStyle({ fontSize: newFontSize, fill: isSelected ? '#ff0000' : '#000' }); // Change text color
    }

    confirmSelection() {
        const selectedButton = this.menuContainer.list[this.selectedIndex];
        if (selectedButton) {
            const actions = selectedButton.getCustomData('action'); // Directly get the action(s)
            if (Array.isArray(actions)) {
                actions.forEach(action => action()); // Call each action if it's an array
            } else if (typeof actions === 'function') {
                actions(); // Call the single action
            }
            // this.setKeyboardEnabled(false);
        }
    }
    
    setKeyboardEnabled(enabled) {
        if (enabled) {
            // Add event listeners for keyboard inputs
            document.addEventListener('keydown', this.numpadKeyListener);
            document.addEventListener('keydown', this.escapeKeyListener);
            document.addEventListener('keydown', this.arrowKeyListener);
            document.addEventListener('keydown', this.enterKeyListener);
        } else {
            // Remove event listeners for keyboard inputs
            document.removeEventListener('keydown', this.numpadKeyListener);
            document.removeEventListener('keydown', this.escapeKeyListener);
            document.removeEventListener('keydown', this.arrowKeyListener);
            document.removeEventListener('keydown', this.enterKeyListener);
        }
    }
    
    
    closeMainMenu() {
        console.log('running close main menu');
        if (this.menuContainer) {
            this.menuContainer.destroy();
        }
        // this.setKeyboardEnabled(false);
    
        // Resume keyboard input in MapScene
        this.scene.get('MapScene').setKeyboardEnabled(true);
        // this.scene.start('MapScene')
        globals.sceneManager.transitionTo('MapScene');
    }
    // handleTeleport() {
    //     let enabled = false; // You might want to set this based on some game condition
    //     if (enabled) {
    //         const x = prompt("Enter x-coordinate for character position:");
    //         const y = prompt("Enter y-coordinate for character position:");
            
    //         const xPos = parseInt(x);
    //         const yPos = parseInt(y);
            
    //         if (!isNaN(xPos) && !isNaN(yPos)) {
    //             this.scene.get('MapScene').setCharacterPosition(xPos, yPos);
    //             this.scene.get('MapScene').setKeyboardEnabled(true);
    //             this.scene.start('MapScene');
    //         } else {
    //             console.log("Invalid input. Please enter valid numbers for x and y coordinates.");
    //         }
    //     } else {
    //         console.log("Teleport is not enabled.");
    //     }
    // }
    
 
    
    
    
    // createButton(x, y, width, height, text, callbacks) {
    //     const button = this.add.image(0, 0, 'button_normal');
    //     button.setDisplaySize(width, height);
    
    //     const buttonText = this.add.text(0, 0, text, { fontSize: '12px', fill: '#000' });
    //     buttonText.setOrigin(0.5);
    
    
    //     // Store the action(s) as data on the button
    //     button.setData('action', callbacks);

    //     button.setInteractive()
    //         .on('pointerover', () => {
    //             button.setTexture('button_hover');
    //             // this.isPointerOverMask = true;
    //         })
    //         .on('pointerout', () => {
    //             button.setTexture('button_normal');
    //             // this.isPointerOverMask = false;
    //         })
    //         .on('pointerdown', () => {
    //             button.setTexture('button_selected');
    //             if (Array.isArray(callbacks)) {
    //                 callbacks.forEach(callback => callback());
    //             } else if (typeof callbacks === 'function') {
    //                 callbacks();
    //             }
    //         })
    //         .on('pointerup', () => button.setTexture('button_hover'));
    
    //     const container = this.add.container(x, y, [button, buttonText]);
    //     container.setSize(width, height);
    //     // container.setOrigin(0.5, 0.5);
    
    //     return container;
    // }
    
      

    
    // displayNewPokedex() {
    //     this.clearMenu();
    
    //     if (!this.pokedexBackground) {
    //         this.pokedexBackground = this.add.image(0, 0, 'menubackground2').setOrigin(0, 0);
    //         this.pokedexBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    //         this.pokedexBackground.setDepth(0);
    //     }
    
    //     const textConfig = { fontFamily: 'Arial', fontSize: '18px', fill: '#000000' };
    //     const pokemonData = globals.originalPokemonData;
    
    //     const containerWidth = 400;
    //     const containerHeight = this.cameras.main.height - 144;
    //     const containerX = 88;
    //     const containerY = 77;
    
    //     // Create the main panel for the Pokedex list
    //     this.mainPanel = this.add.image(containerX, containerY, 'panel');
    //     this.mainPanel.setOrigin(0, 0);
    //     this.mainPanel.setDisplaySize(containerWidth, containerHeight);
    //     this.mainPanel.setDepth(1);
    
    //     this.pokedexContainer = this.add.container(containerX, containerY);
    //     this.pokedexContainer.setDepth(2);
    //     this.pokedexContainer.setSize(containerWidth, containerHeight);
    //     // this.pokedexContainer.initialY = containerY;
    
    //     for (let i = 0; i < pokemonData.length; i++) {
    //         const pokemon = pokemonData[i];

    //         const nameColor = globals.pokemonTypes[pokemon.type]; // Default to white if type color is not found


    //         // const button = this.createButton(200, i * 60 + 30, containerWidth - 20, 50, pokemon.name, () => this.displayNewPokemonDetails(pokemon));
    //         //150
    //         const button = this.createButton(200, i * 60 + 30, containerWidth - 20, 50, pokemon.name, () => {
    //             console.log('scene is :', this.scene.key);
    //             this.scene.launch('PokemonDetailsScene', { 
    //                 pokemon: pokemon, 
    //                 originScene: this.scene.key 
    //             });
    //             this.scene.pause();
    //         });


    //         const typeRect = this.add.rectangle(-100, 0, 35, 35, nameColor);
    //         button.add(typeRect);


    //         // Add Pokemon sprite to the button
    //         const pokemonSprite = this.add.sprite(-100, 0, pokemon.key);
    //         pokemonSprite.setScale(1.5);


    //           // Animation setup as before
    //         // ...
    //         if (!this.anims.exists(pokemon.key)) {
    //             this.anims.create({
    //                 key: pokemon.key,
    //                 frames: this.anims.generateFrameNumbers(pokemon.key, { frames: [0, 4, 8, 12] }),
    //                 frameRate: 10,
    //                 repeat: -1 // Repeat the animation indefinitely
    //             });
    //             }
    //             pokemonSprite.anims.play(pokemon.key, true);


    //         button.add(pokemonSprite);
    

            



    //          // Add type text
    //         const typeText = this.add.text(70, 0, pokemon.type, {
    //             fontFamily: 'Arial',
    //             fontSize: '14px',
    //             fill: '0x000000'
    //         }).setOrigin(0.5);




    //         const routes = globals.getPokemonRoute(pokemon.name);

    //          // Add type text
    //          const route = this.add.text(130, 0, routes, {
    //             fontFamily: 'Arial',
    //             fontSize: '14px',
    //             fill: '0x000000'
    //         }).setOrigin(0.5);
    //         button.add(route);





    //         button.add(typeText)


    //         this.pokedexContainer.add(button);
    //     }
    
    //     this.backButton = this.createButton(this.cameras.main.width - 50, 50, 40, 40, 'X', [
    //         () => this.cleanupPokedex(),
    //         () => this.createMainMenu()
    //     ]);
    //     this.backButton.setDepth(4);
    
     
    //     this.slider = new Slider(this, this.pokedexContainer);
    // }
    
      
  





    // cleanupPokedex(keepBackground = false)
    // {
    //     console.log('Back button clicked');
    //     if (!keepBackground)
    //     {
    //         this.pokedexBackground.destroy();
    //         this.pokedexBackground = null;
    //         console.log('deleting background');

    //     }
     
    //     this.slider.cleanup();
    //     if (this.mainPanel)
    //     {
    //         this.mainPanel.destroy();  
    //     }

    // }
   




    // clearMenu() {
    //     // Clear existing menu options
    //     if (this.pokemonOption) {
    //         this.pokemonOption.destroy();
    //     }
    //     if (this.itemOption) {
    //         this.itemOption.destroy();
    //     }
    //     if (this.pokedexOption) {
    //         this.pokedexOption.destroy();
    //     }
    //     if (this.mapOption) {
    //         this.mapOption.destroy();
    //     }
    //     if (this.exitOption) {
    //         this.exitOption.destroy();
    //     }
    //     if (this.teleportOption) {
    //         this.teleportOption.destroy();
    //     }
    //     if (this.orbsOption) {
    //         this.orbsOption.destroy();
    //     }
      
    //     if (this.pokemonTexts) {
    //         this.pokemonTexts.forEach(text => text.destroy());
    //     }
    //     if (this.pokemonHealthBars) {
    //         this.pokemonHealthBars.forEach(bar => bar.destroy());
    //     }
    //     if (this.missingHpBars) {
    //         this.missingHpBars.forEach(bar => bar.destroy());
    //     }
    //     if (this.pokemonSprites) {
    //         this.pokemonSprites.forEach(sprite => sprite.destroy());
    //     }
    //     if (this.itemTexts) {
    //         this.itemTexts.forEach(item => item.destroy());
    //     }

       

    //     if (this.backButton)
    //     {
    //         this.backButton.destroy();
    //     }

    //     if (this.menuBackground)
    //     {
    //         this.menuBackground.destroy();
    //     }

    //     if (this.moveDetailsBox)
    //     {
    //         this.moveDetailsBox.destroy();
    //     }
    //     if (this.moveDetailsText) {
    //         this.moveDetailsText.destroy();
    //     }
    

    //     if (this.slider)
    //     {
    //         console.log('cleaning up slider');
    //         this.slider.cleanup();

    //     }
    //     if (this.moveSlider)
    //     {
    //         this.moveSlider.cleanup();
    //     }


    // }
   
    
  
}
