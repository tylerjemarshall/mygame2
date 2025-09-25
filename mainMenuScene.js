class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        //this.mainMenuActive = true;
        //this.mainMenuActive = false;
        // Define an object to store slot text objects
        this.slotTextObjects = {};
        this.menuElements = [];
        this.menuElements2 = [];
        this.currentSelection = 0;
        this.selector = null;

    }

    create() {


        this.loadMenu();
/*
        this.scene.bringToTop('MainMenuScene');

      
        // Add background
        // Add a black background
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
        background.setOrigin(0);
    
        // Add title text
        const titleText = this.add.text(this.cameras.main.width / 2, 100, 'Main Menu', { fontFamily: 'Arial', fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
    
        this.scene.get('MapScene').setKeyboardEnabled(false);

        
        //this.setKeyboardEnabled(false); // Disable keyboard input initially
        setTimeout(() => {
            this.scene.get('MapScene').setKeyboardEnabled(false); // Enable keyboard input after the delay
        }, 500); // Adjust the duration as needed
    
         // Add play button
         const newGameButton = this.add.text(this.cameras.main.width / 2, 150, 'New Game', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
         newGameButton.setInteractive();
         newGameButton.on('pointerdown', () => {
             //const saveExists = this.checkSaveExists();
             //this.mainMenuActive = false;
             // this.scene.get('MapScene').setKeyboardEnabled(true);
             // this.scene.start('MapScene');
             console.log('loading new game');
             this.loadGameData(-1); // Load the saved game data

             this.scene.get('MapScene').setKeyboardEnabled(true);
             // this.scene.start('MapScene');
             if (globals.isNewGame)
             {
                 globals.sceneManager.start('SelectCharacterScene');

             }
             else
             {
                 globals.sceneManager.start('MapScene');

             }
             // globals.eventManager.emit('updateButtonPositions', globals.buttonConfigs);
             if (globals.buttonConfigs)
             {
                 globals.controlGameInstance.scene.getScene('ControlScene').updateButtomPositions(globals.buttonConfigs);

             }
             console.log('updated button positions');
         });



    
        // Add play button
        const playButton = this.add.text(this.cameras.main.width / 2, 200, 'Resume', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            //const saveExists = this.checkSaveExists();
            //this.mainMenuActive = false;
            // this.scene.get('MapScene').setKeyboardEnabled(true);
            // this.scene.start('MapScene');

            this.handleEscapeKey();
        });
    
        // Add load button
        const loadButton = this.add.text(this.cameras.main.width / 2, 250, 'Load/Save', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        loadButton.setInteractive();
        loadButton.on('pointerdown', () => {
            // Handle loading multiple save files
            //this.scene.start('LoadScene');
            this.openLoadWindow();
        });
    
        // Add options button
        const options = this.add.text(this.cameras.main.width / 2, 300, 'Options', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        options.setInteractive();
        options.on('pointerdown', () => {
            // Handle options button click
            this.showOptions();
        });


        
        // Add options button
        const controls = this.add.text(this.cameras.main.width / 2, 350, 'Controls', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        controls.setInteractive();
        controls.on('pointerdown', () => {
            // Handle options button click
            this.showControls();
        });


        
        // Add options button
        const selectCharacter = this.add.text(this.cameras.main.width / 2, 400, 'Select Character', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        selectCharacter.setInteractive();
        selectCharacter.on('pointerdown', () => {
            // Handle options button click
            globals.sceneManager.start('SelectCharacterScene');
        });
*/





    }

    loadMenu() {
        this.scene.bringToTop('MainMenuScene');
        this.scene.get('MapScene').setKeyboardEnabled(false);

        // Add background
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
        background.setOrigin(0);
        this.menuElements2.push(background);

        // Add title text
        const titleText = this.add.text(this.cameras.main.width / 2, 100, 'Main Menu', { fontFamily: 'Arial', fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
        this.menuElements2.push(titleText);

        const buttonY = 150;
        const buttonSpacing = 50;
        const buttonConfig = [
            { text: 'New Game', action: () => this.startNewGame() },
            { text: 'Resume', action: () => this.handleEscapeKey() },
            { text: 'Load/Save', action: () => this.openLoadWindow() },
            { text: 'Options', action: () => this.showOptions() },
            { text: 'Controls', action: () => this.showControls() },
            { text: 'Select Character', action: () => globals.sceneManager.start('SelectCharacterScene') }
        ];

        buttonConfig.forEach((config, index) => {
            const button = this.add.text(this.cameras.main.width / 2, buttonY + index * buttonSpacing, config.text, 
                { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
            button.setInteractive();
            button.on('pointerdown', config.action);
            this.menuElements.push(button);
        });

        // Add selector
        this.selector = this.add.text(this.cameras.main.width / 2 - 140, buttonY, '>', 
            { fontFamily: 'Arial', fontSize: '32px', fill: '#ffff00' }).setOrigin(0.5);
        this.menuElements2.push(this.selector);

        setTimeout(() => {
            this.scene.get('MapScene').setKeyboardEnabled(false);
        }, 500);

        this.updateSelectorPosition();
    }

    loadMenu2() {
        this.scene.bringToTop('MainMenuScene');
        this.scene.get('MapScene').setKeyboardEnabled(false);

        // Add background
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
        background.setOrigin(0);
        this.menuElements.push(background);

        // Add title text
        const titleText = this.add.text(this.cameras.main.width / 2, 100, 'Main Menu', { fontFamily: 'Arial', fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
        this.menuElements.push(titleText);

        // New Game button
        const newGameButton = this.add.text(this.cameras.main.width / 2, 150, 'New Game', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        newGameButton.setInteractive();
        newGameButton.on('pointerdown', () => {
            console.log('loading new game');
            this.loadGameData(-1);
            this.scene.get('MapScene').setKeyboardEnabled(true);
            if (globals.isNewGame) {
                globals.sceneManager.start('SelectCharacterScene');
            } else {
                globals.sceneManager.start('MapScene');
            }
            if (globals.buttonConfigs) {
                globals.controlGameInstance.scene.getScene('ControlScene').updateButtomPositions(globals.buttonConfigs);
            }
            console.log('updated button positions');
        });
        this.menuElements.push(newGameButton);

        // Resume button
        const playButton = this.add.text(this.cameras.main.width / 2, 200, 'Resume', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => this.handleEscapeKey());
        this.menuElements.push(playButton);

        // Load/Save button
        const loadButton = this.add.text(this.cameras.main.width / 2, 250, 'Load/Save', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        loadButton.setInteractive();
        loadButton.on('pointerdown', () => this.openLoadWindow());
        this.menuElements.push(loadButton);

        // Options button
        const options = this.add.text(this.cameras.main.width / 2, 300, 'Options', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        options.setInteractive();
        options.on('pointerdown', () => this.showOptions());
        this.menuElements.push(options);

        // Controls button
        const controls = this.add.text(this.cameras.main.width / 2, 350, 'Controls', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        controls.setInteractive();
        controls.on('pointerdown', () => this.showControls());
        this.menuElements.push(controls);

        // Select Character button
        const selectCharacter = this.add.text(this.cameras.main.width / 2, 400, 'Select Character', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        selectCharacter.setInteractive();
        selectCharacter.on('pointerdown', () => globals.sceneManager.start('SelectCharacterScene'));
        this.menuElements.push(selectCharacter);

        setTimeout(() => {
            this.scene.get('MapScene').setKeyboardEnabled(false);
        }, 500);
    }
   
        
        clearMenu() {
            this.menuElements.forEach(element => {
                if (element.removeAllListeners) {
                    element.removeAllListeners();
                }
                element.destroy();
            });
            this.menuElements2.forEach(element => {
                if (element.removeAllListeners) {
                    element.removeAllListeners();
                }
                element.destroy();
            });
            this.menuElements = [];
            this.menuElements2 = [];
            this.selector = null;
            this.currentSelection = 0;
        }


        navigateMenu(direction) {
            const maxIndex = this.menuElements.length-1; // Subtract background, title, and selector
            this.currentSelection += direction;
            if (this.currentSelection < 0) this.currentSelection = maxIndex;
            if (this.currentSelection > maxIndex) this.currentSelection = 0;
            this.updateSelectorPosition();
        }
        updateSelectorPosition() {
            if (this.selector) {
                const targetY = 150 + this.currentSelection * 50;
                this.selector.setY(targetY);
            }
        }
        selectCurrentOption() {
            const selectedButton = this.menuElements[this.currentSelection]; // +2 to skip background and title
            if (selectedButton && selectedButton.emit) {
                selectedButton.emit('pointerdown');
            }
        }

        startNewGame() {
            this.clearMenu();
            console.log('loading new game');
            this.loadGameData(-1);
            this.scene.get('MapScene').setKeyboardEnabled(true);
            if (globals.isNewGame) {
                globals.sceneManager.start('SelectCharacterScene');
            } else {
                globals.sceneManager.start('MapScene');
            }
            if (globals.buttonConfigs) {
                globals.controlGameInstance.scene.getScene('ControlScene').updateButtomPositions(globals.buttonConfigs);
            }
            console.log('updated button positions');
        }

    handleKeydown(event) {
        
        const currentScene = this.scene.manager.getScenes(true)[0];
        console.log('current scene when pressing key:',currentScene.scene.key )
        if (currentScene) {
            globals.sceneManager.handleInput(currentScene.scene.key, event);
        }
    }
    handleEscapeKey() {
        this.clearMenu();
        console.log('isnewgame: ', globals.isNewGame)

        if (globals.isNewGame)
        {
            globals.sceneManager.start('SelectCharacterScene');

        }
        else
        {
            
            globals.sceneManager.start('MapScene');
            this.scene.stop('MainMenuScene');
            globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);

        }


     

    }


    showControls() {
        // Create a black background
        this.clearMenu();
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
        background.setOrigin(0);
    
        // Add title text
        const titleText = this.add.text(this.cameras.main.width / 2, 100, 'Controls', { fontFamily: 'Arial', fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
    
        // Add control instructions
        const controlInstructions = [
            { key: 'Space', action: 'Interact' },
            { key: 'Up Arrow', action: 'Up' },
            { key: 'Left Arrow', action: 'Left' },
            { key: 'Right Arrow', action: 'Right' },
            { key: 'Down Arrow', action: 'Down' },
            { key: 'Enter', action: 'Menu' },
            { key: 'Escape', action: 'Main Menu' },
            { key: 'M', action: 'Map' },
            { key: 'Shift', action: 'Bicycle' }
        ];
    
        const startX = 250;
        let startY = 140;
        const spacingY = 30;
    
        const instructionTexts = []; // Array to store instruction text objects
    
        // Add control instructions text
        controlInstructions.forEach(instruction => {
            const instructionText = this.add.text(this.cameras.main.width / 2, startY, `${instruction.key} = ${instruction.action}`, { fontFamily: 'Arial', fontSize: '22px', fill: '#ffffff' }).setOrigin(0.5);
            
            instructionText.setInteractive();
            instructionText.on('pointerdown', () => {
                // Handle options button click
                console.log(instruction.key);
            });


            
            instructionTexts.push(instructionText); // Store the text object in the array
            startY += spacingY;
        });
    
        // Add back button
        const backButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 90, 'Back', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            // Close controls window and return to main menu
            background.destroy();
            titleText.destroy();
            instructionTexts.forEach(instructionText => instructionText.destroy()); // Destroy all instruction text objects
            backButton.destroy();
            this.loadMenu();
        });
    }
    



showOptions() {
    // Define the optionsData with actions
      // Create a black background
      this.clearMenu();
      const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
      background.setOrigin(0);
const optionsData = [
    {
        label: 'Controls',
        options: [
            { text: 'Joystick', actions: [() => console.log('Joystick selected')] },




            { 
                text: 'Point to Move', 
                actions: [
                    () => console.log('Point to Move selected'),
                    () => this.scene.get('MapScene').setPointToMoveEnabled(true)
                ]
            },



            { 
                text: 'None', 
                actions: [
                    () => console.log('None selected'),
                    () => this.scene.get('MapScene').setPointToMoveEnabled(false)
                ]
            }
        ]
    },
    // {
    //     label: 'Gender',
    //     options: [
    //         { 
    //             text: 'Male', 
    //             actions: [
    //                 () => console.log('Male selected'),
    //                 // () => this.scene.get('MapScene').setMalePlayer(),

                    
    //                 globals.player.male.active=true,
    //                 globals.player.female.active=false,
    //                 globals.player.female2.active=false,
    //                 globals.player.red.active=false,
    //             ]
    //         },
    //         { 
    //             text: 'Female 1', 
    //             actions: [
    //                 () => console.log('Female 1 selected'),
    //                 // () => this.scene.get('MapScene').setFemalePlayer(),

                    
    //                 () =>  globals.player.male.active=false,
    //                 () => globals.player.female.active=true,
    //                 () => globals.player.female2.active=false,
    //                 () => globals.player.red.active=false,
    //             ]
    //         },
    //         { 
    //             text: 'Female 2', 
    //             actions: [
    //                 () => console.log('Female 2 selected'),
    //                 // () => this.scene.get('MapScene').setFemalePlayer2(),

                    
    //                 () => globals.player.male.active=false,
    //                 () => globals.player.female.active=false,
    //                 () => globals.player.female2.active=true,
    //                 () => globals.player.red.active=false,
    //             ]
    //         }
    //     ]
    // },
    {
        label: 'Difficulty',
        options: [
            { 
                text: 'Easy', 
                actions: [
                    () => console.log('Easy selected'),
                    () => globals.difficulty = 'easy'
                ]
            },
            { 
                text: 'Medium', 
                actions: [
                    () => console.log('Medium selected'),
                    () => globals.difficulty = 'medium'
                ]
            },
            { 
                text: 'Hard', 
                actions: [
                    () => console.log('Hard selected'),
                    () => globals.difficulty = 'hard'
                ]
            }
        ]
    },
    {
        label: 'Edit\nControls',
        options: [
            { text: 'Editing', actions: [() =>         globals.eventManager.emit('toggleEditMode', true) // true = edit mode
            ] },
            { text: 'Locked', actions: [() =>         globals.eventManager.emit('toggleEditMode', false) // true = edit mode
            ] },
            { text: '', actions: [() => console.log('Empty selected')] }
        ]
    },
  
];

// Starting position and spacing for the grid
const startX = 200; // Starting x position for options
let yPos = 100; // Starting y position for the first label
const verticalSpacing = 30; // Space between labels and options vertically
const spacingX = 120; // Horizontal space between options (columns)
const itemsPerRow = 3; // Number of options per row


const destroyList = [background];

// Loop through each section (label and options)
optionsData.forEach((section) => {
    // Add label text
    
    // Move position down for options after the label
    yPos += verticalSpacing;
    const label = this.add.text(startX - 100, yPos, section.label, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    destroyList.push(label); // Add label to destroy list

    // Loop through options and create the grid layout
    section.options.forEach((option, index) => {
        // Calculate y-position based on row
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;

        const optionXPos = startX + col * spacingX; // X position based on column
        const optionYPos = yPos + row * verticalSpacing; // Y position based on row

        // Create option text button with calculated positions
        const optionText = this.add.text(optionXPos, optionYPos, option.text, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        optionText.setInteractive();

        // Add action when option is selected
        optionText.on('pointerdown', () => {
            // Call all actions associated with this option
            option.actions.forEach(action => action());

            // Highlight the selected option
            this.highlightOption(optionText);
        });

        destroyList.push(optionText); // Add option button to destroy list


        // Highlight the currently selected option based on game variables
        if (section.label === 'Gender') {
            if (globals.player.male.active && option.text === 'Male') {
                optionText.setColor('#ff0000');
            } else if (globals.player.female.active && option.text === 'Female 1') {
                optionText.setColor('#ff0000');
            } else if (globals.player.female2.active && option.text === 'Female 2') {
                optionText.setColor('#ff0000');
            }
        }

        if (section.label === 'Difficulty') {
            if (globals.difficulty === 'easy' && option.text === 'Easy') {
                optionText.setColor('#ff0000');
            } else if (globals.difficulty === 'medium' && option.text === 'Medium') {
                optionText.setColor('#ff0000');
            } else if (globals.difficulty === 'hard' && option.text === 'Hard') {
                optionText.setColor('#ff0000');
            }
        }


    });

    // Adjust the y-position after the options grid
    yPos += (Math.ceil(section.options.length / itemsPerRow)) * verticalSpacing; // Account for multiple rows of options
});




     // Add close button
     const closeButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Close', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
     closeButton.setInteractive();
     destroyList.push(closeButton); // Add close button to destroy list
     closeButton.on('pointerdown', () => {
         // Destroy all objects in the destroyList
         destroyList.forEach(obj => obj.destroy());
         this.loadMenu();
     });

    }

// Function to highlight an option when selected
highlightOption(optionText) {
    // Reset all option colors (optional: add logic for resetting other highlights)
    this.children.list.forEach(child => {
        if (child.setColor) child.setColor('#ffffff');
    });

    // Highlight the selected option
    optionText.setColor('#ff0000');
}



// showOptions2() {
//     // Create a black background
//     const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
//     background.setOrigin(0);

//     // Add title text
//     const titleText = this.add.text(this.cameras.main.width / 2, 100, 'Options', { fontFamily: 'Arial', fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

//     // Add controls label
//     const controlsLabel = this.add.text(80, 150, 'Controls:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

//     const genderLabel = this.add.text(80, 200, 'Gender:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

//     // Add difficulty label
//     const difficultyLabel = this.add.text(80, 250, 'Difficulty:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);


//    const screenSizeLabel = this.add.text(80, 300, 'Canvas:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
//    const controlVisibilityLabel = this.add.text(80, 350, 'Control:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
//    const control2VisibilityLabel = this.add.text(80, 400, 'Control:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

//     // Define options
//     const options = ['Joystick', 'Point to Move', 'None', 
//         'Male', 'Female 1', 'Female 2', 
//         'Easy', 'Medium', 'Hard', 
//         'Small', 'Medium', 'Large',
//         'Show', 'Hide', '',
//         'Small', 'Medium', 'Large'
//     ]; 

//     // Add option buttons
//     const optionButtons = [];
//     const startX = 80;
//     const startY = 150;
//     const startYIncrement = 50; // Increment in Y for each option
//     const spacingX = 150;

//     for (let i = 0; i < options.length; i++) {
//         // const yPos = startY + i * startYIncrement;
//         const yPos = startY + Math.floor(i / 3) * startYIncrement; // Calculate y-position using modulo operator
//         const xPos = startX + spacingX + (i % 3) * spacingX; // Calculate x-position using modulo operator
//         const optionButton = this.add.text(xPos, yPos, options[i], { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        

//         // const optionButton = this.add.text(this.cameras.main.width - startX - (i < 6 ? i : (i - 6)) * spacingX, yPos, options[i], { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        
//         // const optionButton = this.add.text(this.cameras.main.width - startX - (i < 3 ? i : (i - 3)) * spacingX, startY + (i >= 3 ? 100 : 0), options[i], { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

        
        
//         optionButton.setInteractive();
//         optionButton.setData('index', i);
//         optionButton.on('pointerdown', () => {
//             // Handle logic based on button index
//             switch (i) {
//                 case 0:
//                     console.log('Selected Joystick');
//                     this.resetButtons(optionButtons);
//                     break;
//                 case 1:
//                     console.log('Selected Point to Move');
//                     this.scene.get('MapScene').setPointToMoveEnabled(true);
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 2:
//                     console.log('Selected None');
//                     this.scene.get('MapScene').setPointToMoveEnabled(false);
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 3:
//                     console.log('Selected Male');
//                     this.scene.get('MapScene').setMalePlayer();
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 4:
//                     console.log('Selected Female');
//                     this.scene.get('MapScene').setFemalePlayer();
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 5:
//                     console.log('Selected Female2');
//                     this.scene.get('MapScene').setFemalePlayer2();
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 6:
//                     console.log('Selected Easy');
//                     // Handle easy difficulty
//                     globals.difficulty = 'easy';
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 7:
//                     console.log('Selected Medium');
//                     globals.difficulty = 'medium';
//                     // Handle medium difficulty
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 8:
//                     console.log('Selected Hard');
//                     globals.difficulty = 'hard';
//                     // Handle hard difficulty
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 9:
//                     console.log('Selected Small');
//                     //globals.difficulty = 'hard';
//                     // Handle hard difficulty
//                     this.setCanvasSize(500, 300)


//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 10:
//                     console.log('Selected Medium');

//                     this.setCanvasSize(600, 800)
//                     //globals.difficulty = 'hard';
//                     // Handle hard difficulty
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 11:
//                     console.log('Selected Large');
//                     //globals.difficulty = 'hard';

//                     this.setCanvasSize(700, 900)
//                     // Handle hard difficulty
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                     // ... existing cases ...
//                 case 12: // Show Controls
//                     console.log('Showing Controls');
//                     document.getElementById('control-canvas').style.display = 'block';
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 13: // Hide Controls
//                     console.log('Hiding Controls');
//                     document.getElementById('control-canvas').style.display = 'none';
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 14:
//                     break; 
//                 case 15: // Small Game
//                     console.log('Small Game Size');
//                     this.setGameSize(400, 300);
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 16: // Medium Game
//                     console.log('Medium Game Size');
//                     this.setGameSize(600, 400);
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 case 17: // Large Game
//                     console.log('Large Game Size');
//                     this.setGameSize(800, 600);
//                     this.resetButtons(optionButtons);
//                     optionButton.setColor('#ff0000');
//                     break;
//                 default:
//                     break;
//             }
//         });
//         optionButtons.push(optionButton);
//     }

//     // Show current Point to Move status
//     optionButtons[this.scene.get('MapScene').getPointToMoveEnabled() ? 1 : 2].setColor('#ff0000');

//     // Show current gender selection
//     let characterGender = null;
//     if (globals.player.male.active) {
//         characterGender = 3;
//     } else if (globals.player.female.active) {
//         characterGender = 4;
//     } else if (globals.player.female2.active) {
//         characterGender = 5;
//     }
//     else if (globals.player.red.active)
//     {
//         characterGender = 3;
//     }
//     optionButtons[characterGender].setColor('#ff0000');

//     //show current difficulty selection
//     let difficulty = 'medium';
//     if (globals.difficulty === 'easy') {
//         difficulty = 6;
//     } else if (globals.difficulty === 'medium') {
        
//         difficulty = 7;
//     } else if (globals.difficulty === 'hard') {
//         difficulty = 8;
//     }
//     optionButtons[difficulty].setColor('#ff0000');

//     // Add close button
//     const closeButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Close', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
//     closeButton.setInteractive();
//     closeButton.on('pointerdown', () => {
//         // Close options window
//         background.destroy();
//         titleText.destroy();
//         controlsLabel.destroy();
//         genderLabel.destroy();
//         difficultyLabel.destroy(); // Remove the difficulty label
//        screenSizeLabel.destroy();
//         optionButtons.forEach(button => button.destroy());
//         closeButton.destroy();
//     });
// }

// setCanvasSize(width, height) {
//     const gameCanvas = document.getElementById('gameCanvas');
//     gameCanvas.style.width = `${width}px`;
//     gameCanvas.style.height = `${height}px`;

//     const buttonsContainer = document.getElementById('buttonsContainer');
//     buttonsContainer.style.width = `${width}px`;
//     buttonsContainer.style.height = `${height}px`;
//     //game.scale.resize(width, height);
// }



setGameSize(width, height) {
    // Resize the main game
    this.scale.resize(width, height);
    this.cameras.main.setViewport(0, 0, width, height);

    // Adjust the control area
    const controlCanvas = document.getElementById('control-canvas');
    if (controlCanvas) {
        controlCanvas.style.width = `${width}px`;
        controlCanvas.style.top = `${height}px`;
    }

    // Adjust the container size
    const container = document.getElementById('game-container');
    if (container) {
        container.style.width = `${width}px`;
        container.style.height = `${height + 400}px`; // 100 is the height of the control area
    }
}


setCanvasSize(width, height) {
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.style.width = `${width}px`;
    gameCanvas.style.height = `${height}px`;

    const buttonsContainer = document.getElementById('buttonsContainer');
    buttonsContainer.style.width = `${width}px`;
    buttonsContainer.style.height = `${height}px`;
    // Update left and top properties based on canvas size
    buttonsContainer.style.left = `${width}px`; // Adjust as needed
    buttonsContainer.style.top = `${height}px`; // Adjust as needed
    //game.scale.resize(width, height);
}




resetButtons(optionButtons)
{
    optionButtons.forEach(button => {
                button.setColor('#ffffff');
            });

    optionButtons[this.scene.get('MapScene').getPointToMoveEnabled() ? 1 : 2].setColor('#ff0000');
    // Show current Point to Move status
    // const pointToMoveEnabled = this.scene.get('MapScene').getPointToMoveEnabled();
    // this.updateOptionButtons(optionButtons, pointToMoveEnabled ? 1 : 2);

    // Show current gender selection
    let characterGender = null;
    if (globals.player.male.active) {
        characterGender = 3;
    } else if (globals.player.female.active) {
        characterGender = 4;
    } else if (globals.player.female2.active) {
        characterGender = 5;
    }
    optionButtons[characterGender].setColor('#ff0000');
    


    //show current difficulty selection
    let difficulty = 'medium';
    if (globals.difficulty === 'easy') {
        difficulty = 6;
    } else if (globals.difficulty === 'medium') {
        
        difficulty = 7;
    } else if (globals.difficulty === 'hard') {
        difficulty = 8;
    }
    optionButtons[difficulty].setColor('#ff0000');

}
// handleGenderSelection(optionButtons, selectedIndex) {
//     // Reset all buttons
//     optionButtons.forEach(button => {
//         button.setColor('#ffffff');
//     });

//     // Set selected button color to red
//     optionButtons[selectedIndex].setColor('#ff0000');
// }

// updateOptionButtons(optionButtons, selectedIndex) {
//     // Reset all buttons
//     optionButtons.forEach(button => {
//         button.setColor('#ffffff');
//     });

//     // Set selected button color to red
//     optionButtons[selectedIndex].setColor('#ff0000');
// }



    

    // // Function to set the value of mainMenuActive
    // setMainMenuActive(active) {
    //     mainMenuActive = active;
    // }
    
    // // Function to get the value of mainMenuActive
    // isMainMenuActive() {
    //     return mainMenuActive;
    // }


    
    // Function to delete the saved game cookie
    deleteSavedGameCookie() {
        document.cookie = 'globalsData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    



// Function to save the Globals data as a cookie
saveGlobalsAsCookie() {
    // Convert the current globals object to a JSON string
    const globalsJSON = JSON.stringify(globals);

    // Set the JSON string as a cookie
    document.cookie = `globalsData=${globalsJSON}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`;
}

// Function to load the Globals data from a cookie
loadGlobalsFromCookie() {
    // Get the cookie value
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)globalsData\s*=\s*([^;]*).*$)|^.*$/, "$1");

    // If the cookie value exists
    if (cookieValue) {
        // Parse the JSON string back to an object
        const globalsData = JSON.parse(cookieValue);

        // Assign the loaded data to the existing globals object
        Object.assign(globals, globalsData);

        // Now, the 'globals' object contains the data loaded from the cookie
        console.log('Globals data loaded from cookie:', globals);
    } else {
        console.error('Globals data not found in cookie!');
    }
}

checkSaveExists() {
    // Get the cookie value
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)globalsData\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // If the cookie value exists, a save file exists
    return !!cookieValue;
}



// // Function to update the text for a specific slot
// updateSaveSlotText(index, newText) {
//     const textObject = this.slotTextObjects[index];
//     if (textObject) {
//         textObject.setText(newText);
//     } else {
//         console.error('Text object not found for index:', index);
//     }
// }

// Function to update the text for a specific slot and its corresponding load button
updateSaveSlotText(index, newText) {
    const textObject = this.slotTextObjects[index];
    const loadButton = this.loadButtonObjects[index]; // Access the load button

    if (textObject) {
        textObject.setText(newText); // Update slot text
    } else {
        console.error('Text object not found for index:', index);
    }

    if (loadButton) {
        // Change the load button text to "New Game" if the slot is empty
        const isNewGame = newText.includes('New Save');
        loadButton.setText(isNewGame ? 'New Game' : 'Load'); // Update the button text
        loadButton.setStyle({ fill: isNewGame ? '#00ff00' : '#ffff00' }); // Change color accordingly
    } else {
        console.error('Load button not found for index:', index);
    }
}

// Function to initialize the save window
openLoadWindow() {
    this.clearMenu();
    const saveSlots = JSON.parse(localStorage.getItem('saveSlots')) || [];
    const autosave = JSON.parse(localStorage.getItem('autosave')) || null;


    // Add black background
    const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
    background.setOrigin(0);

    // Create a group for all elements
    const loadElementsGroup = this.add.group([background]);
    this.loadButtonObjects = {};
    // this.save = null;
    // Display save slots
    const slotSize = 50;
    const slotX = 150;
    let slotY = 100;

    for (let index = 0; index < 3; index++) {
        
        // this.save = saveSlots[index];
        const slotText = saveSlots[index] ? `${index + 1}: ${saveSlots[index].name}` : `${index + 1}: New Save`;
        const slot = this.add.text(slotX, slotY, slotText, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        slot.setInteractive();

        // Save button
        const saveButton = this.add.text(slotX + 200, slotY, 'Save', { fontFamily: 'Arial', fontSize: '24px', fill: '#00ff00' }).setOrigin(0.5);
        saveButton.setInteractive();
        saveButton.on('pointerdown', () => {
            const saveName = prompt('Enter a name for the save:');
            if (saveName) {
                this.saveGameData(index, globals); // Save the game data with the entered name
                saveSlots[index] = { name: saveName };
                localStorage.setItem('saveSlots', JSON.stringify(saveSlots));
                // Update slot text after saving
                this.updateSaveSlotText(index, `${index + 1}: ${saveName}`);
            }
        });

        // Load button
        const loadButtonLabel = saveSlots[index] ? 'Load' : 'New Game';
        const loadButton = this.add.text(slotX + 300, slotY, loadButtonLabel, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffff00' }).setOrigin(0.5);
        loadButton.setInteractive();
        loadButton.on('pointerdown', () => {
            if (saveSlots[index]) {
                this.loadGameData(index); // Load the saved game data
                this.scene.get('MapScene').setKeyboardEnabled(true);
                // this.scene.start('MapScene');
                console.log('is there a save file? : ', globals.isNewGame);
                
                globals.sceneManager.start('MapScene');
                globals.eventManager.emit('updateButtonPositions', globals.buttonConfigs);
            }
            else
            {
                console.log('loading new game');
                this.loadGameData(-1); // Load the saved game data

                this.scene.get('MapScene').setKeyboardEnabled(true);
                // this.scene.start('MapScene');
                if (globals.isNewGame)
                {
                    globals.sceneManager.start('SelectCharacterScene');

                }
                else
                {
                    globals.sceneManager.start('MapScene');

                }
                // globals.eventManager.emit('updateButtonPositions', globals.buttonConfigs);
                if (globals.buttonConfigs)
                {
                    globals.controlGameInstance.scene.getScene('ControlScene').updateButtomPositions(globals.buttonConfigs);

                }
                console.log('updated button positions');
            }
        });

        // Delete button
        const deleteButton = this.add.text(slotX + 400, slotY, 'Delete', { fontFamily: 'Arial', fontSize: '24px', fill: '#ff0000' }).setOrigin(0.5);
        deleteButton.setInteractive();
        deleteButton.on('pointerdown', () => {
            // Delete the save data from the specified slot
            this.deleteGameData(index);
            saveSlots[index] = null;
            localStorage.setItem('saveSlots', JSON.stringify(saveSlots));
            // Update slot text after deletion
            this.updateSaveSlotText(index, `${index + 1}: New Save`);
        });
        this.loadButtonObjects[index] = loadButton;

        loadElementsGroup.add(slot, saveButton, loadButton, deleteButton, loadButtonLabel, slotText);

        // Store slot text object in the associative array
        this.slotTextObjects[index] = slot;
        //this.loadButtonObjects[index]; // Access the load button


        slotY += slotSize;
    }

    // // Add close button
    // const closeButton = this.add.text(this.cameras.main.width / 2, slotY + 150, 'Close', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    // closeButton.setInteractive();

    // closeButton.on('pointerdown', () => {
    //     // Remove all elements from the group and return to main menu
    //     loadElementsGroup.clear(true, true);
    //     this.scene.restart();
    // });

    // // Attach close button to the group
    // loadElementsGroup.add(closeButton);

    // Autosave slot (can only be loaded, no save or delete options)
    const autosaveSlotText = autosave ? 'Autosave: Available' : 'Autosave: No Data';
    const autosaveSlot = this.add.text(slotX, slotY, autosaveSlotText, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    autosaveSlot.setInteractive();

    // Load button for autosave
    const autosaveLoadButton = this.add.text(slotX + 300, slotY, 'Load', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffff00' }).setOrigin(0.5);
    autosaveLoadButton.setInteractive();
    autosaveLoadButton.on('pointerdown', () => {
        if (autosave) {
            this.loadGameData('autosave'); // Load the autosave data
            globals.sceneManager.start('MapScene');
            globals.eventManager.emit('updateButtonPositions', globals.buttonConfigs);
        } else {
            console.log('No autosave data available');
        }
    });

    loadElementsGroup.add(autosaveSlot, autosaveLoadButton, autosaveSlotText);

    // Add close button
    const closeButton = this.add.text(this.cameras.main.width / 2, slotY + 150, 'Close', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
        loadElementsGroup.getChildren().forEach(child => {
            child.removeAllListeners();
            child.destroy();
        });
        loadElementsGroup.clear(true, true);
        // this.scene.restart();
        this.loadMenu();
    });
    loadElementsGroup.add(closeButton);




}



deleteGameData(slotIndex) {
    // Remove the game data from localStorage for the specified slot
    localStorage.removeItem(`save_${slotIndex}`);

    // Retrieve the current save slots from localStorage
    const saveSlots = JSON.parse(localStorage.getItem('saveSlots')) || [];

    // Set the specified slot to null to indicate it's empty
    saveSlots[slotIndex] = null;

    // Save the updated save slots array back to localStorage
    localStorage.setItem('saveSlots', JSON.stringify(saveSlots));

    // Optionally, update the UI or perform other actions as needed
    // For example, update the slot text to indicate the slot is now empty
    // this.updateSaveSlotText(slotIndex, `${slotIndex + 1}: New Save`);
}







saveGameData(slotIndex) {
    try {
        const dataToSave = globals.toSerializableObject();
        const jsonData = JSON.stringify(dataToSave);
        localStorage.setItem(`save_${slotIndex}`, jsonData);
        console.log(`Data saved successfully to slot ${slotIndex}`);
    } catch (error) {
        console.error('Error saving data:', error.message);
    }
}



// loadGameData(slotIndex) {

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

loadGameData(slotIndex) {
    let jsonData;

    if (slotIndex === -1) {
        // Load from the backup if slotIndex is -1
        try {
            const backupData = JSON.parse(JSON.stringify(globals.backup)); // Deep clone using JSON
            console.log("Loaded data from backup:", backupData);
            
            globals.fromSerializableObject(backupData);

            console.log('Data loaded successfully from backup.');
            return backupData;
        } catch (error) {
            console.error('Error loading data from backup:', error.message);
            return null;
        }
    } else if (slotIndex === 'autosave') {
        // Load from autosave slot
        jsonData = localStorage.getItem('autosave');
        if (jsonData) {
            try {
                const loadedData = JSON.parse(jsonData); // Parse the loaded JSON data
                console.log("Loaded data from autosave:", loadedData); // Log the data being loaded

                globals.fromSerializableObject(loadedData);

                console.log('Data loaded successfully from autosave.');
                return loadedData;
            } catch (error) {
                console.error('Error parsing autosave data:', error.message);
                return null;
            }
        } else {
            console.log('No autosave data found');
            return null;
        }
    } else {
        // Load from the specified save slot
        jsonData = localStorage.getItem(`save_${slotIndex}`);
        if (jsonData) {
            try {
                const loadedData = JSON.parse(jsonData); // Parse the loaded JSON data
                console.log("Loaded data:", loadedData); // Log the data being loaded

                globals.fromSerializableObject(loadedData);

                console.log(`Data loaded successfully from slot ${slotIndex}`);
                return loadedData;
            } catch (error) {
                console.error('Error parsing loaded data:', error.message);
                return null;
            }
        } else {
            console.log(`No save data found in slot ${slotIndex}`);
            return null;
        }
    }
}




deepCopy(value) {
    if (Array.isArray(value)) {
        return value.map(item => this.deepCopy(item));
    } else if (value && typeof value === 'object') {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = this.deepCopy(value[key]);
            return acc;
        }, {});
    }
    return value;
}




// Function to load game data using the unique identifier
// loadGameData(identifier) {
//     // Retrieve all cookies
//     const cookies = document.cookie.split(';');
//     // Find the cookie with the corresponding identifier
//     for (let cookie of cookies) {
//         cookie = cookie.trim();
//         if (cookie.startsWith(`save_${identifier}=`)) {
//             // Extract the JSON data from the cookie
//             const jsonData = cookie.substring(`save_${identifier}=`.length);
//             // Parse the JSON data
//             const loadedData = JSON.parse(jsonData);
//             // Overwrite the existing globals with the loaded data
//             Object.assign(globals, loadedData);
//             // Return the loaded data
//             console.log(globals);
//             return loadedData;
//         }
//     }
//     // Return null if the save file doesn't exist
//     return null;
// }

loadGameData4(slotIndex) {
    try {
        const jsonData = localStorage.getItem(`save_${slotIndex}`);
        if (jsonData) {
            const savedData = JSON.parse(jsonData);
            Object.assign(globals, savedData);
            console.log(`Data loaded successfully from slot ${slotIndex}`);
        } else {
            console.log(`No save data found in slot ${slotIndex}`);
        }
    } catch (error) {
        console.error('Error loading data:', error.message);
    }
}



loadGameData3(slotIndex) {
    try {
        // Load the data from localStorage
        const jsonData = localStorage.getItem(`save_${slotIndex}`);
        if (jsonData) {
            const savedData = JSON.parse(jsonData);

            // Restore data back to your globals using setters
            // Using a utility function to ensure deep copies if necessary
            globals.npcIdle = this.deepCopy(savedData.npcIdle);
            globals.fishing = this.deepCopy(savedData.fishing);
            globals.difficulty = this.deepCopy(savedData.difficulty); // Uncomment if needed
            globals.chests = this.deepCopy(savedData.chests);
            globals.repel = this.deepCopy(savedData.repel); // Uncomment if needed
            // globals.typeEffectiveness = deepCopy(savedData.typeEffectiveness); // Uncomment if needed
            // globals.pokemonTypeColor = deepCopy(savedData.pokemonTypeColor); // Uncomment if needed
            // globals.pokemonTypes = deepCopy(savedData.pokemonTypes); // Uncomment if needed
            // globals.pokemonMoves = deepCopy(savedData.pokemonMoves); // Uncomment if needed
            globals.player = this.deepCopy(savedData.player);
            // globals.starterPokemon = deepCopy(savedData.starterPokemon); // Uncomment if needed
            globals.items = this.deepCopy(savedData.items);
            globals.pc = this.deepCopy(savedData.pc);
            globals.npc = this.deepCopy(savedData.npc);
            globals.characterPosition = this.deepCopy(savedData.characterPosition);
            // globals.pokemonData = this.deepCopy(savedData.pokemonData);
            // globals.originalPokemonData = deepCopy(savedData.originalPokemonData); // Uncomment if needed
            globals.partyPokemonData = this.deepCopy(savedData.partyPokemonData);
            // globals.routes = deepCopy(savedData.routes); // Uncomment if needed

            console.log(`Data loaded successfully from slot ${slotIndex}`);
        } else {
            console.log(`No save data found in slot ${slotIndex}`);
        }
    } catch (error) {
        console.error('Error loading data:', error.message);
    }
}


loadGameDataold(slotIndex) {
    try {
        // Load the data from localStorage
        const jsonData = localStorage.getItem(`save_${slotIndex}`);
        if (jsonData) {
            const savedData = JSON.parse(jsonData);

            // Restore data back to your globals using setters
            // globals.moves = savedData.moves; // Use setter
            globals.npcIdle = savedData.npcIdle; // Use setter
            globals.fishing = savedData.fishing; // Use setter
            // globals.difficulty = savedData.difficulty; // Use setter
            globals.chests = savedData.chests; // Use setter
            globals.repel = savedData.repel; // Use setter
            // globals.typeEffectiveness = savedData.typeEffectiveness; // Use setter
            // globals.pokemonTypeColor = savedData.pokemonTypeColor; // Use setter
            // globals.pokemonTypes = savedData.pokemonTypes; // Use setter
            // globals.pokemonMoves = savedData.pokemonMoves; // Use setter
            globals.player = savedData.player; // Use setter
            // globals.starterPokemon = savedData.starterPokemon; // Use setter
            globals.items = savedData.items; // Use setter
            globals.pc = savedData.pc; // Use setter
            globals.npc = savedData.npc; // Use setter
            globals.characterPosition = savedData.characterPosition; // Use setter
            globals.pokemonData = savedData.pokemonData; // Use setter
            // globals.originalPokemonData = savedData.originalPokemonData; // Use setter
            globals.partyPokemonData = savedData.partyPokemonData; // Use setter
            // globals.routes = savedData.routes; // Use setter

            console.log(`Data loaded successfully from slot ${slotIndex}`);
        } else {
            console.log(`No save data found in slot ${slotIndex}`);
        }
    } catch (error) {
        console.error('Error loading data:', error.message);
    }
}








////////backup////////////
loadGameData2(slotIndex) {
    // Retrieve the JSON data from localStorage
    const jsonData = localStorage.getItem(`save_${slotIndex}`);
    if (jsonData) {
        // Parse the JSON data
        let loadedData = JSON.parse(jsonData);
        // Overwrite the existing globals with the loaded data

        // this.synchronizeGlobals(loadedData, globals);

        Object.assign(globals, loadedData);
        // Return the loaded data
        console.log(globals);
        return loadedData;
    }
    // Return null if the save file doesn't exist
    return null;
}



deepCopy2(value) {
    if (Array.isArray(value)) {
        return value.map(item => this.deepCopy(item)); // Recursively copy each item
    } else if (value && typeof value === 'object') {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = this.deepCopy(value[key]); // Recursively copy each property
            return acc;
        }, {});
    }
    return value; // For primitives
}


synchronizeGlobals(loadedData, globals, visited = new Set()) {
    // Generate a unique identifier for the current object
    const objectId = JSON.stringify(globals);

    // If the current object has been visited before, return
    if (visited.has(objectId)) {
        return;
    }

    // Add the current object's identifier to the set of visited objects
    visited.add(objectId);

    for (const key in globals) {
        if (Array.isArray(globals[key])) {
            loadedData[key] = [...globals[key]]; // Deep copy arrays
        } else if (typeof globals[key] === 'object' && globals[key] !== null) {
            if (visited.has(JSON.stringify(globals[key]))) {
                // Skip synchronization if the object has a circular reference
                continue;
            }
            loadedData[key] = loadedData[key] || {}; // Ensure loadedData[key] exists
            this.synchronizeGlobals(loadedData[key], globals[key], visited); // Recursively synchronize nested objects
        } else {
            loadedData[key] = globals[key]; // Assign non-array, non-object values directly
        }
    }
}


    

// synchronizeGlobals(loadedData, globals) {
//     // Update the provided loadedData with the values from globals
//     for (const key in globals) {
//         if (Array.isArray(globals[key])) {
//             // Handle arrays by assigning them directly
//             loadedData[key] = globals[key];
//         } else if (
//             typeof globals[key] === 'object' &&
//             !Array.isArray(globals[key]) &&
//             loadedData.hasOwnProperty(key)
//         ) {
//             // Synchronize recursively for non-array objects
//             loadedData[key] = loadedData[key] || {}; // Ensure loadedData[key] exists
//             this.synchronizeGlobals(loadedData[key], globals[key]);
//         } else if (!loadedData.hasOwnProperty(key)) {
//             // If the property doesn't exist in loadedData, assign the value from globals
//             loadedData[key] = globals[key];
//         }
//     }
// }

}
// const globals = new Globals();

// const config = {
//     type: Phaser.AUTO,
//     width: 600,
//     height: 500,
//     // parent: 'gameCanvas', // Specify the ID of the canvas element
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 0 },
//             debug: false,
//         },
//     },
//     scene: [MapScene, BattleScene, MenuScene, StarterPokemonScene, InteractWithPokemonScene, MainMenuScene], // Add all your scene classes here
//     globals: globals // Pass the globals instance as part of the game configuration
// };



// const game = new Phaser.Game(config);

// // game.scene.start('MapScene');
// game.scene.start('MainMenuScene');
