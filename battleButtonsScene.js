class BattleButtonsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleButtonsScene' });

        this.battleLogContainer = null;
    }

    preload() {
        // Load background image and button images
        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(pokemon.key + 'Faceset', `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/Faceset.png`);
        });

        this.load.image('background', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');
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
        console.log('running create battlebutton');
        this.destroyBattleLog();
        //this.selectedPokemon =  get data from battlescene
        // Add background image to fill the entire scene
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setDepth(-30); // Ensure it is behind all other objects

        // Use your button class to create buttons
        this.createButtons();
    }

 
    destroyBattleLog() {
        // If the battle log container exists

        if (this.logBackground)
        {
            this.logBackground.destroy();
        }
        if (this.battleLogContainer) {
            // Call cleanup for the slider, if it has a cleanup function
            if (this.battleLogSlider && typeof this.battleLogSlider.cleanup === 'function') {
                this.battleLogSlider.cleanup();  // Call the cleanup method on the slider
            }
    
            // Destroy the container, which also destroys all its children (background, slider, buttons, etc.)
            this.battleLogContainer.destroy(true);  // Pass 'true' to destroy all children
    
            // Remove references to the battle log and slider for proper garbage collection
            this.battleLogContainer = null;
            this.battleLogSlider = null;
        }
    }
    

    handleAttack(move) {

      
            this.createTargetButtons(move, 'attack');
            this.hideMoveButtons2();
   
        
    }

    
    createButtons() {
        const width = 200;
        const height = 100;
        const center = this.cameras.main.centerX;
        this.attackButton = new Button(this, center, 150, 400, 200, 'Attack', this.openMoveMenu.bind(this), '32px');
        this.runButton = new Button(this, center, 420, width, height, 'Run', this.handleRun.bind(this), '24px');
        this.partyButton = new Button(this, center + center/2, 315, width, height, 'Party', this.openPartyMenu.bind(this), '24px'); // Button for PartyScene
        this.itemsButton = new Button(this, center - center/2, 315, width, height, 'Items', this.openItemsMenu.bind(this), '24px'); // Button for PartyScene

        // this.log = new Button(this, center, 450, width, height, 'log', this.openBattleLog.bind(this), '24px'); // Button for PartyScene

    }
    
    hideMenu()
    {
            // Add the buttons to the scene
            this.attackButton.setVisible(false);
            this.runButton.setVisible(false);
            this.partyButton.setVisible(false); // Add party button
            this.itemsButton.setVisible(false); // Add party button
            // this.log.setVisible(false); // Add party button
    }
    showMenu()
    {


        if (!this.attackButton)
        {
            console.log('why are attack buttons missing');
            this.createButtons();
        }
            // this.hideBattleLog();
          // Add the buttons to the scene
          this.attackButton.setVisible(true);
          this.runButton.setVisible(true);
          this.partyButton.setVisible(true); // Add party button
          this.itemsButton.setVisible(true); // Add party button
        //   this.log.setVisible(true); // Add party button
          this.hideMoveButtons3(false);
          this.hideBattleLog();
    }

    openBattleLog() {
        // Check if the battle log slider already exists
        // if (this.battleLogContainer) {
        //     // If it exists, make it visible again
        //     console.log('showing the battlelog');
        //     this.hideMenu();
        //     this.battleLogContainer.setVisible(true);
        //     return;
        // }
        console.log('creating the battlelog');
    
        // If it doesn't exist, create a new one
        this.createBattleLog();
    }

    showBattleLog() {
        // Check if the battle log exists, if not, create it
        this.hideMenu();
        this.hideMoveButtons3();
        if (!this.battleLogContainer) {
            // console.warn('Battle log not created. Creating now...');
            this.createBattleLog();  // Create it if it doesn't exist
        }

        // Set the container and all its children visible
        this.battleLogContainer.setVisible(true);
        
        this.logBackground.setVisible(true);
        this.returnButton.setVisible(true);

        this.battleLogSlider.show();
    }
    hideBattleLog() {
        // Check if the battle log exists
        if (this.battleLogContainer) {
            // Hide the container and all its children
            this.battleLogContainer.setVisible(false);
            this.logBackground.setVisible(false);
            this.battleLogSlider.hide();
            this.returnButton.setVisible(false);
        } else {
            // console.warn('Battle log does not exist.');
        }
    }
    

    

    // openBattleLog() {
    //     this.hideMenu();
    //     this.createBattleLogSlider();
    // }

    createBattleLog() {
        this.hideMoveButtons3();
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const reducedHeight = height - 100; // Shrink by 100 pixels

        const x = this.cameras.main.width / 2 - width / 2;
        // const y = this.cameras.main.height / 2 - height / 2;
        const y = this.cameras.main.height / 2 - reducedHeight / 2 - 50; // Adjust for new height


        // Create a container for the battle log
        this.battleLogContainer = this.add.container(x, y);
        // this.battleLogContainer.setSize(width - 40, height);
        this.battleLogContainer.setSize(width - 40, reducedHeight);


        
        // Add a background panel to the container
        this.logBackground = this.add.image(0, 0, 'panel').setOrigin(0, 0);
        this.logBackground.setDepth(-20);
        this.logBackground.setDisplaySize(width, reducedHeight);
        // this.battleLogContainer.add(panel);

        // Create the slider
        const sliderConfig = {
         
     
            itemHeight: 30,
            type: 'battlelog',
            backgroundColor: 0x000000,
            sliderColor: 0xffffff,
            textColor: 0xffffff,
           
        };

        Object.assign(this.battleLogContainer, sliderConfig);


        this.battleLogSlider = new Slider(this, this.battleLogContainer);

        // // Add a close button
        // const closeButton = new Button(this, width - 40, 20, 60, 40, 'X', () => {
        //     this.battleLogContainer.destroy();
        //     this.createButtons();
        // }, '20px');
        // this.battleLogContainer.add(closeButton);

        // Example: Add some initial log entries
        this.battleLogSlider.addTextItem2('info', 'Battle started!', '', 'BattleScene');
        // this.battleLogSlider.addTextItem2('attack', 'Pikachu used Thunderbolt!', '', 'BattleScene');
        // this.battleLogSlider.addTextItem2('effect', 'It\'s super effective!', '', 'BattleScene');


        // Create a "Return" button at the bottom of the screen (full width)
        const buttonWidth = width;
        const buttonHeight = 100;
        const buttonY = y + reducedHeight + 50; // Position the button at the bottom

        // "Return" button
        this.returnButton = new Button(
            this, 
            this.cameras.main.width / 2, // Center the button horizontally
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            'Return', 
            this.showMenu.bind(this),  // Define a callback for the button action
            '32px'
        );
    }

    

      hideMoveButtons() {
        // Hide all move buttons
        this.children.each(child => {
            if (child instanceof Button) {
                child.setVisible(false);
            }
        });
        // Add the buttons to the scene
        this.attackButton.setVisible(true);
        this.runButton.setVisible(true);
        this.partyButton.setVisible(true); // Add party button
        this.itemsButton.setVisible(true); // Add party button
    }
    hideMoveButtons2() {

          // Check if move buttons already exist and destroy them
          if (this.moveButtons && this.moveButtons.length > 0) {
            this.moveButtons.forEach(button => {
                if (button) {
                    button.destroy(); // Destroy each button
                }
            });
            this.moveButtons.length = 0; // Clear the array
        }
    }
   
    hideMoveButtons3(hideMenu   = true)
    {
        if (hideMenu)
        {
            this.hideMenu();

        }
        // Check if move buttons already exist and destroy them
        if (this.moveButtons && this.moveButtons.length > 0) {
            this.moveButtons.forEach(button => {
                if (button) {
                    button.destroy(); // Destroy each button
                }
            });
            this.moveButtons.length = 0; // Clear the array
        }

         // Check if move buttons already exist and destroy them
         if (this.targetButtons&&this.targetButtons.length > 0) {
            this.targetButtons.forEach(button => {
                if (button) {
                    button.destroy(); // Destroy each button
                }
            });
            this.targetButtons.length = 0; // Clear the array
        }

           // Check if move buttons already exist and destroy them
           if (this.partyButtons&&this.partyButtons.length > 0) {
            this.partyButtons.forEach(button => {
                if (button) {
                    button.destroy(); // Destroy each button
                }
            });
            this.targetButtons.length = 0; // Clear the array
        }
    }

    handleRun() {
        console.log('run button clicked');
        globals.gameInstance.scene.getScene('BattleScene').runAway();

    }

    openItemsMenu() {
  
        globals.gameInstance.scene.getScene('BattleScene').handleShift();


    }
    

    openPartyMenu() {
  
        globals.gameInstance.scene.getScene('BattleScene').handleEnter();


    }
    

    openMoveMenu() {
        
        this.createMoveButtons();
        this.hideMenu();
        
    }
    selectTarget(move = null, target, action, item = null) {
        const battleScene = globals.gameInstance.scene.getScene('BattleScene');


        this.hideMoveButtons3();
        this.showMenu();
        
        if (action === 'attack')
        {
            battleScene.handleMoveSelected(move, target);
        }

        else if (action === 'item')
        {
            battleScene.createMove3('item', battleScene.currentTurn, target, item);
        }


     
    }

    
    createTargetButtons(move = null, action = null, item = null) {

        this.hideMoveButtons3();
        // this.moveButtons=[];
        this.targetButtons=[];
        // const enemyMonsters = globals.gameInstance.scene.getScene('BattleScene').enemyMonsters;
        // const enemyMonsters = globals.gameInstance.scene.getScene('BattleScene').enemyMonsters.filter(monster => monster !== null && monster !== undefined);
        const enemyMonsters = globals.gameInstance.scene.getScene('BattleScene').enemyMonsters;
        console.log('enemymonsters: ', enemyMonsters);
        const buttonWidth = 150;
        const buttonHeight = 100;
        const startY = 150;
        const spacing = 150;
    
        enemyMonsters.forEach((monster, index) => {
            if (monster === null || monster === undefined) return;
            let i = enemyMonsters.length - index - 1;
            const button = new Button(
                this,
                (150 + spacing * i), //this.cameras.main.width - 
                //this.cameras.main.centerX,
                this.cameras.main.centerY / 2,
                //startY + (spacing * index),
                buttonWidth,
                buttonHeight,
                '',//monster.name
                () => this.selectTarget(move, monster, action, item),
                '24px'
            );
    
            // Add monster faceset image to the button
            const faceset = this.add.image(
                0 - buttonWidth/2 + 70,
                0,
                monster.key + 'Faceset'
            ).setOrigin(0.5).setDisplaySize(60, 60);
    
            button.add(faceset);


            this.targetButtons.push(button);
        });
    
        // Add a 'Back' button
        const backButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            buttonWidth,
            buttonHeight,
            'Back',[
                this.hideMoveButtons3.bind(this),
                this.createMoveButtons.bind(this),
            ],
            '24px'
        );
        this.targetButtons.push(backButton);
    }
 

    createPartySelectionButtons() {
        this.hideMoveButtons3(); // Hide any previous buttons
        this.partyButtons = []; // Initialize an array for party buttons
    
        const playerMonsters = this.playerMonsters;  // Get player's Pokémon
        const buttonWidth = 200;
        const buttonHeight = 100;
        const startY = 150;
        const spacing = 120;
    
        // Loop through playerMonsters and create a button for each one
        playerMonsters.forEach((monster, index) => {
            const button = new Button(
                this,
                this.cameras.main.centerX,
                startY + (spacing * index),
                buttonWidth,
                buttonHeight,
                monster.name,
                () => this.selectPartyMember(monster),  // Callback for selecting the party Pokémon
                '24px'
            );
    
            // Add monster faceset image to the button
            const faceset = this.add.image(
                0 - buttonWidth / 2 + 30,
                0,
                monster.key + 'Faceset'  // Assuming you have faceset images for each player monster
            ).setOrigin(0.5).setDisplaySize(60, 60);
    
            button.add(faceset);
    
            this.partyButtons.push(button);  // Add the button to the list of party buttons
        });
    
        // Add a 'Back' button
        const backButton = new Button(
            this,
            this.cameras.main.centerX,
            startY + (spacing * playerMonsters.length),
            buttonWidth,
            buttonHeight,
            'Back',
            this.openPartyMenu.bind(this),  // Bind back button to openPartyMenu
            '24px'
        );
        this.partyButtons.push(backButton);
    }


    createMoveButtons() {

        // let moveMenu = globals.currentPokemonData.moves; // Get moves from globals
        // if (globals.gameInstance.scene.getScene('BattleScene').double ) //& globals.gameInstance.scene.getScene('BattleScene').currentTurn
        // {
        const moveMenu= globals.gameInstance.scene.getScene('BattleScene').currentTurn.moves;
        // }
    
        const width = 200;
        const height = 130;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY / 1.5;
    
        // Define the grid offsets for the 4 buttons
        const offsets = [
            [-width / 2, -height / 2],  // Top-left
            [width / 2, -height / 2],   // Top-right
            [-width / 2, height / 2],   // Bottom-left
            [width / 2, height / 2]     // Bottom-right
        ];
    
        // Array to store move buttons for easy management

    
        // Check if move buttons already exist and destroy them
        if (this.moveButtons && this.moveButtons.length > 0) {
            this.moveButtons.forEach(button => button.destroy());
            this.moveButtons = []; // Clear the array
        }
        this.moveButtons = [];
        moveMenu.forEach((move, index) => {
            if (index < 4) { // Limit to 4 buttons
                const moveTextColor = globals.pokemonTypeColor[move.type] || 'black'; // Default to black if type not found
    
                const [xOffset, yOffset] = offsets[index]; // Get the offset for the current button
                const moveButton = new Button(
                    this,
                    centerX + xOffset,
                    centerY + yOffset,
                    width, 
                    height,
                    move.name + '\n(' + move.currentPP + '/' + move.maxPP + ')\n' + move.type,
                    () => this.handleAttack(move), 
                    '24px',
                    moveTextColor
                );
    
                // this.add.existing(moveButton);
                this.moveButtons.push(moveButton); // Add the button to the array
            }
        });
    
        // Create Cancel button at the center bottom
        const cancelButton = new Button(this,
            centerX,
            centerY + height + 100,  // 50px below the grid
            width, 
            height,
            'Cancel',
            [
            () => this.hideMoveButtons3(false),
            () => this.showMenu()
            ],
            '24px'
        );
        // this.add.existing(cancelButton);
        this.moveButtons.push(cancelButton); // Add the cancel button to the array
    }
    


    

}

