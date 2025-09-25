
class ControlPanelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlPanelScene' });
        this.admin=false;
    }


    preload()
    {
                
        this.load.image('v_slidder_grabber', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber.png');
        this.load.image('v_slidder_grabber_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_hover.png');
        this.load.image('v_slidder_grabber_disabled', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_disabled.png');

        this.load.image('nine_path_bg', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg.png');
        this.load.image('nine_path_bg_stretched', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched.png');
        this.load.image('nine_path_bg_2_stretched', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched.png');



    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create a semi-transparent background
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.5); // Black with 50% opacity
        graphics.fillRect(0, 0, width, height); // Cover the whole screen

        // Define a larger font size
        const fontSize = '60px'; // Change this to the desired size

        // Define button width and height
        const buttonWidth = 250;
        const buttonHeight = 80;



        // Starting Y position and spacing between buttons
        const startY = 40;   // Starting position (can adjust based on needs)
        const spacingY = 80;        // Spacing between buttons


        // Define button configurations in an array
        const buttons = [
            {
                text: 'Tools',
          
                action: () => {
                    // console.log('Play button clicked');
                    // this.hideScene();
                    // document.getElementById('control-panel-overlay').style.pointerEvents = 'none';
                 
                    this.renderMenu(toolsMenuButtons);
                }
            },
            {
                text: 'Play',
      
                action: () => {
                    console.log('Play button clicked');
                    this.hideScene();
                    document.getElementById('control-panel-overlay').style.pointerEvents = 'none';
                }
            },
            {
                text: 'Reset',
            
                action: () => {
                    console.log('Reset button clicked');
                    this.hideScene();
                    globals.sceneManager.reboot();
                    document.getElementById('control-panel-overlay').style.pointerEvents = 'none';
                }
            },
            {
                text: 'Reboot',
          
                action: () => {
                    console.log('Reboot button clicked');
                    this.hideScene();
                    restartGames(); // Call your custom restart function here
                    document.getElementById('control-panel-overlay').style.pointerEvents = 'none';
                }
            },
            {
                text: 'Install',
          
                action: () => {
                    console.log('Install button clicked');
                    this.installCache();
                
                }
            }
        ];



          // Tools menu buttons
        const toolsMenuButtons = [
      
            {
                text: 'Toggle Logging',
                action: () => {
                    
                    // customLoggingEnabled = !customLoggingEnabled;
                    // console.log('Custom Logging: ' + customLoggingEnabled);
                    toggleCustomLogging();
                }
            },
            {
                text: 'Clear Console',
                action: () => {
                    this.slider.clearConsole();
                }
            },
                     {
                text: 'Export Console',
                action: () => {
                 // Export slider data before rebooting
                const sliderData = this.slider.exportData();
                localStorage.setItem('sliderData', JSON.stringify(sliderData));
                console.log('Slider data saved to localStorage');
                
                
                
                
                    
                }
            },
            {
                text: 'Next',
                action: () => {
                    this.renderMenu(toolsMenuButtons2);
                }
            },
            {
                text: 'Back',
                action: () => {
                    console.log('Back to main menu');
                    this.renderMenu(buttons);  // Switch back to main menu
                }
            }
        ];

        
          // Tools menu buttons
          const toolsMenuButtons2 = [

            {
                text: 'Levelup 5',
                action: () => {

                    if (globals.characterPosition.followingPokemon)
                    {
                        this.admin=true;

                        // globals.gameInstance.scene.getScene('BattleScene').setPokemonStats(globals.partyPokemonData[0], 5);
                        globals.monsterManager.partyMonsters[0].levelUp(5);
                    }
                    else
                    {
                        console.log('cant upgrade pokemon that dont exist');
                    }
                    
                }
            },
            {
                text: 'Performance On/Off',
                action: () => {

                  this.slider.togglePerformanceStats();
                  console.log('performance enabled: ', this.slider.performanceStatsEnabled)
                    
                }
            },
            {
                text: 'Stress On/Off',
                action: () => {

                  this.slider.toggleStressTest();
                  
                    
                }
            },
            {
                text: 'Custom CSS',
                action: () => {

                    console.log('%cThis is blue text %cand this is red', 'color: blue;', 'color: red;');
                    // Example 1: Text with multiple colors
                    console.log('%cThis is blue text %cand this is red', 'color: blue;', 'color: red;');

                    // Example 2: Bold and italic text
                    console.log('%cBold text %cItalic text', 'font-weight: bold;', 'font-style: italic;');

                    // Example 3: Underlined and background color
                    console.log('%cUnderlined text %cText with background', 'text-decoration: underline;', 'background-color: yellow;');

                    // Example 4: Multiple styles combined
                    console.log('%cBold and Blue %cItalic and Red Background', 'font-weight: bold; color: blue;', 'font-style: italic; background-color: red;');

                    // Example 5: Nested CSS styles
                    console.log('%cNested styles %cBold %cItalic', 'font-weight: bold; color: green;', 'font-weight: bold;', 'font-style: italic;');

                  // Example 1: Text with multiple colors
                    console.log('%cThis is blue text %cand this is red', 'color: cyan;', 'color: orange;');

                    // Example 2: Bold and italic text
                    console.log('%cBold text %cItalic text', 'font-weight: bold; color: yellow;', 'font-style: italic; color: magenta;');

                    // Example 3: Underlined and background color
                    console.log('%cUnderlined text %cText with background', 'text-decoration: underline; color: cyan;', 'background-color: navy; color: yellow;');

                    // Example 4: Multiple styles combined
                    console.log('%cBold and Blue %cItalic and Red Background', 'font-weight: bold; color: cyan;', 'font-style: italic; background-color: maroon; color: yellow;');

                    // Example 5: Nested CSS styles
                    console.log('%cNested styles %cBold %cItalic', 'font-weight: bold; color: orange;', 'font-weight: bold; color: magenta;', 'font-style: italic; color: cyan;');
                                        
                }
            },
            {
                text: 'Back',
                action: () => {
                    console.log('Back to main menu');
                    this.renderMenu(toolsMenuButtons);  // Switch back to main menu
                }
            }
        ];



        
        // Function to render the menu dynamically
        this.renderMenu = (buttons) => {
            if (this.menuButtons) {
                this.menuButtons.forEach(button => button.destroy());
            }
            if (this.menuBackgrounds) {
                this.menuBackgrounds.forEach(background => background.destroy());
            }

            // Initialize arrays to keep track of the new buttons and backgrounds
            this.menuButtons = [];
            this.menuBackgrounds = [];

            // Render the new buttons
            this.menuButtons = buttons.map((buttonConfig, index) => {
                const buttonY = startY + (index * spacingY);

                // Add the button text
                const button = this.add.text(width / 2, buttonY, buttonConfig.text, {
                    font: fontSize,
                    fill: '#ff0000' // Red color
                }).setOrigin(0.5).setInteractive().setDepth(2);

                // Measure the text width
                const textWidth = button.getBounds().width;

                // Add the background rectangle with the same width as the text
                const buttonBackground = this.add.rectangle(width / 2, buttonY, textWidth + 20, buttonHeight, 0x000000, 1) // Add padding to the width
                    .setOrigin(0.5); // Center the rectangle

                this.menuBackgrounds.push(buttonBackground); // Store background for cleanup

                // Attach the button action on 'pointerdown'
                button.on('pointerdown', buttonConfig.action);

                return button; // Return button for cleanup
            });
        };


           // Initially render the main menu
        this.renderMenu(buttons);


        this.errorText = this.add.text(this.cameras.main.centerX, height/2 - 100, '', {
            font: '20px Arial',
            fill: '#ff0000',
            wordWrap: { width: this.cameras.main.width - 40 }
        }).setOrigin(0.5, 0);








        const containerWidth = 480;
        const containerHeight = 300;
        this.container = this.add.container(0, this.cameras.main.height /2);
        this.container.setSize(width-30, height/2);
        this.container.itemHeight = 30;
        this.container.sliderColor = 0xff0000;
        this.container.backgroundColor = 0x00FF00; //0x000000
        this.container.textColor = 0xff0000;
        this.container.type = 'console';
       
                
    
        this.slider = new Slider(this, this.container);
        
        importSliderData();

        this.hideScene();


    }

    installCache()
    {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null; // Reset the deferred prompt
                // installButton.setVisible(false); // Hide button after prompt
            });
        }
    }

    
    heartbeat() {
        // Check if the scene is actually running and not in an error state
        return this.scene.isActive('ControlPanelScene') && !this.hasError;
    }

    hideScene() {
        // Method 1: Set scene alpha to 0
        this.cameras.main.alpha = 0;
        document.getElementById('control-panel-overlay').style.pointerEvents = 'none'; // Disable pointer events after closing
       
        globals.controlPanelOpen=false;

    }
    showScene()
    {
        this.cameras.main.alpha = 1;
        document.getElementById('control-panel-overlay').style.pointerEvents = 'auto';
        
        globals.controlPanelOpen=true;



    }
    

showError(message, error) {
    const errorStack = error.stack || 'No stack available';
    const errorMessage = message;

    // Remove old background if it exists
    if (this.errorBackground) {
        this.errorBackground.destroy();
    }

    // Remove old text if it exists
    if (this.errorText) {
        this.errorText.destroy();
    }

    // Add a new text for the error message
    this.errorText = this.add.text(this.cameras.main.centerX, this.cameras.main.height / 2 - 100, message, {
        font: '20px Arial',
        fill: '#ff0000',
        wordWrap: { width: this.cameras.main.width - 40 }
    }).setOrigin(0.5, 0).setDepth(2);

    // Calculate the width and height of the text
    const textBounds = this.errorText.getBounds();

    // Add a black rectangle as the background, behind the text
    this.errorBackground = this.add.rectangle(
        textBounds.centerX,  // X position (center of text)
        textBounds.centerY,  // Y position (center of text)
        textBounds.width + 20,  // Width (with padding)
        textBounds.height + 10, // Height (with padding)
        0x000000  // Black color
    ).setOrigin(0.5); // Center the rectangle

    // Set the rectangle behind the text
    this.errorBackground.setDepth(this.errorText.depth - 1); // Ensure the background is behind the text

    // Make the text interactive to detect hover
    this.errorText.setInteractive();

    // Handle hover event to show the stack trace
    this.errorText.on('pointerover', () => {
        this.errorText.setText(`${errorMessage}\n\n${errorStack}`); // Show the full stack trace on hover

        // Recalculate the bounds and adjust the background
        const newBounds = this.errorText.getBounds();
        this.errorBackground.setSize(newBounds.width + 20, newBounds.height + 10); // Adjust background size
        this.errorBackground.setPosition(newBounds.centerX, newBounds.centerY); // Adjust background position
    });

    // Restore the error message when not hovering
    this.errorText.on('pointerout', () => {
        this.errorText.setText(errorMessage); // Show only the message when not hovering

        // Recalculate the bounds and adjust the background
        const originalBounds = this.errorText.getBounds();
        this.errorBackground.setSize(originalBounds.width + 20, originalBounds.height + 10); // Adjust background size
        this.errorBackground.setPosition(originalBounds.centerX, originalBounds.centerY); // Adjust background position
    });
}

  

    showConsole(formattedMessage) {
        if (this.slider) {
            // Extract the type, message, and fileName from the formatted message
            const { type, message, fileName, sceneName } = formattedMessage;
            
            // Pass type, message, and fileName to addTextItem
            this.slider.addTextItem2(type, message, fileName, sceneName);
        } else {
            // console.warn('Slider not available in ControlPanelScene');
        }
    }

   
   
}
