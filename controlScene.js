
class ControlScene extends Phaser.Scene {
    constructor() {
        super('ControlScene');

        this.buttonStates = {
            start: false,
            select: false,
            a: false,
            b: false,
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.isCooldown = false; // Global cooldown flag
        this.cooldownTime = 300; // Cooldown time in milliseconds (adjust as needed)
        this.isDragging = false; // Track if the user is dragging
        this.dragStartButton = null; // The button the user started dragging over

        this.isEditableMode = false; // Mode flag (original mode or editable mode)
        this.consoleOverrideApplied = false;


    }

    preload() {
        this.load.image('start', 'images/Start.png');
        this.load.image('select', 'images/Select.png');
        this.load.image('a', 'images/A.png');
        this.load.image('b', 'images/B.png');
        this.load.image('up', 'images/up.png');
        this.load.image('down', 'images/down.png');
        this.load.image('left', 'images/left.png');
        this.load.image('right', 'images/right.png');

        this.load.image('settingsButton', 'images/settings.png');

    }

    create() {

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
    //     if (!this.consoleOverrideApplied) {

    this.input.addPointer(3)
    

        
        globals.controlPanelGameInstance.scene.getScene('ControlPanelScene').showConsole('test');

        // this.showError('testing error message');

        if (!globals.buttonConfigs) {
            globals.buttonConfigs = [
                { key: 'start', x: width * 0.4, y: height * 0.7 },
                { key: 'select', x: width * 0.6, y: height * 0.7 },
                { key: 'a', x: width * 0.6, y: height * 0.1 },
                { key: 'b', x: width * 0.8, y: height * 0.3 },
                { key: 'up', x: width * 0.25, y: height * 0.1 },
                { key: 'down', x: width * 0.25, y: height * 0.3 },
                { key: 'left', x: width * 0.1, y: height * 0.3 },
                { key: 'right', x: width * 0.4, y: height * 0.3 }
            ];
        }


        this.buttons = {}; // Object to store the created buttons
       


        // Create the buttons based on the buttonConfigs stored in globals
        this.buttonConfigs = globals.buttonConfigs;
        this.buttonConfigs.forEach(config => {
            this.buttons[config.key] = this.createButton2(config.key, config.x, config.y);
            this.input.setDraggable(this.buttons[config.key]);
        });


            // ** Add the settings button **
            const settingsButton = this.add.image(width - 50, height - 50, 'settingsButton')  // Adjusted position for bottom-right
            .setInteractive()
            .setScale(5);  // Adjust scale if necessary

        // // Add click event to open ControlPanelOverlay
        // settingsButton.on('pointerdown', () => {
        //     // globals.controlPanelGameInstance.scene.start('ControlPanelScene');  // Launch the overlay scene
        //     globals.controlPanelGameInstance.scene.getScene('ControlPanelScene').showScene();

        //     document.getElementById('control-panel-overlay').style.pointerEvents = 'auto'; // Disable pointer events after closing

        // });

        
        // Add click event to open ControlPanelOverlay
        settingsButton.on('pointerdown', () => {
            const controlPanelScene = globals.controlPanelGameInstance.scene.getScene('ControlPanelScene');
            
            if (controlPanelScene && controlPanelScene.scene.isActive()) {
                // If the scene exists and is active, just show it
                controlPanelScene.showScene();
            } else {
                // If the scene doesn't exist or isn't active, start it
                globals.controlPanelGameInstance.scene.start('ControlPanelScene');
            }

            document.getElementById('control-panel-overlay').style.pointerEvents = 'auto';
        });
        globals.eventManager.on('toggleEditMode', this.toggleEditMode.bind(this));

        globals.eventManager.on('updateButtonPositions', this.updateButtonPositions.bind(this));
  

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.isEditableMode) {
                // Store the original position
                const originalX = gameObject.x;
                const originalY = gameObject.y;
        
                // Temporarily move the object
                gameObject.x = dragX;
                gameObject.y = dragY;
        
                // Check for collisions with other buttons
                let collision = false;
                for (const key in this.buttons) {
                    if (this.buttons[key] !== gameObject && this.checkOverlap(gameObject, this.buttons[key])) {
                        collision = true;
                        break;
                    }
                }
        
                // If there's a collision, revert to the original position
                if (collision) {
                    gameObject.x = originalX;
                    gameObject.y = originalY;
                } else {
                    // If no collision, update the position in the config
                    const key = gameObject.texture.key;
                    const config = this.buttonConfigs.find(c => c.key === key);
                    if (config) {
                        config.x = dragX;
                        config.y = dragY;
                    }
                }
        
                // Optional: Add visual feedback
                gameObject.setTint(collision ? 0xff0000 : 0x00ff00);
            }
        });
    
        this.input.on('dragstart', (pointer, gameObject) => {
            if (this.isEditableMode) {
                gameObject.setTint(0xff0000);  // Optional: tint the button when dragging starts
            }
        });
    
        this.input.on('dragend', (pointer, gameObject) => {
            if (this.isEditableMode) {
                gameObject.clearTint();  // Optional: clear the tint when dragging ends
                
                // Update the button's position in the config
                const key = gameObject.texture.key;
                const config = this.buttonConfigs.find(c => c.key === key);
                if (config) {
                    config.x = gameObject.x;
                    config.y = gameObject.y;
                }
            }
        });
        
        this.createPointerListeners2();

    }
 

    showError(message) {
        const graphics = this.add.graphics();
        const width = this.cameras.main.width;
        const height = 50;

        graphics.fillStyle(0xff0000, 1); // Red background
        graphics.fillRect(0, this.cameras.main.height - height, width, height);
        
        const textStyle = {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center'
        };

        const errorText = this.add.text(width / 2, this.cameras.main.height - height / 2, message, textStyle)
            .setOrigin(0.5, 0.5)
            .setDepth(1);

        this.time.delayedCall(20000, () => {
            graphics.destroy();
            errorText.destroy();
        });
    }

    updateButtonPositions(buttonConfigs) {
        console.log('Updating button positions');
        Object.entries(this.buttons).forEach(([key, button]) => {
            const config = buttonConfigs.find(c => c.key === key);
            if (config) {
                button.x = config.x;
                button.y = config.y;
                console.log(`Updated ${key} button to (${config.x}, ${config.y})`);
            }
        });
        // Update the stored configurations
        this.buttonConfigs = buttonConfigs;
        globals.buttonConfigs = buttonConfigs;
    }
    toggleEditMode(isEditable) {
        this.isEditableMode = isEditable;
    
        Object.values(this.buttons).forEach(button => {
            button.input.draggable = this.isEditableMode;
            console.log(`Button ${button.texture.key} draggable:`, button.input.draggable)
        });
    
        console.log('editing: ' + isEditable);

        if (!isEditable)
        {
            globals.buttonConfigs = this.buttonConfigs;

        }
    }
    handleButtonDown(key) {
        globals.inputManager.handleButtonInput(key, true, 'button');
        console.log(`${key} button pressed`);
    }

    handleButtonUp(key) {
        globals.inputManager.handleButtonInput(key, false, 'button');
        console.log(`${key} button released`);
    }





    startCooldown() {
        this.isCooldown = true;
        setTimeout(() => {
            this.isCooldown = false;
        }, this.cooldownTime);
    }
    
    createPointerListeners2() {
    // Initialize an object to hold states for each pointer
    this.pointerStates = {};

    this.input.on('pointerdown', (pointer) => {
        // Check if dragging
        if (this.isEditableMode) return; // Exit if in edit mode

        // Initialize the pointer state if it doesn't exist
        this.pointerStates[pointer.id] = {};

        // Check which button is being pressed
        this.children.each(button => {
            if (button.getBounds().contains(pointer.x, pointer.y) && button.input.enabled) {
                this.handleButtonDown(button.name); // Use the button's name as the key
                this.buttonStates[button.name] = true; // Mark button as active
                this.pointerStates[pointer.id][button.name] = true; // Track button state for this pointer
                this.isDragging = true; // Set dragging state
            }
        });
    });

    this.input.on('pointerup', (pointer) => 
        {
            this.handlePointerUp(pointer);
        // if (!this.pointerStates[pointer.id]) 
        // {   
        //     // this.isDragging = false;
        //     return; // Exit if no state for this pointer
        // }
        // // Check which button the pointer is over when released
        // this.children.each(button => {
        //     if (button.getBounds().contains(pointer.x, pointer.y) && this.pointerStates[pointer.id][button.name]) {
        //         this.handleButtonUp(button.name); // Use the button's name as the key
        //         this.buttonStates[button.name] = false; // Reset only the button state that was pressed
        //         delete this.pointerStates[pointer.id][button.name]; // Remove the button state for this pointer
        //     }
        // });

        // // Clean up the pointer state if no buttons are active for this pointer
        // if (Object.keys(this.pointerStates[pointer.id]).length === 0) {
        //     delete this.pointerStates[pointer.id];
        // }

        // this.isDragging = false; // Reset dragging state
    });

    this.input.on('pointermove', (pointer) => {
        // Check if dragging
        // if (this.isDragging) {
            if (!this.isDragging || !this.pointerStates[pointer.id]) return; // Exit if not dragging or no state
            // Iterate through all buttons and check if pointer is over any button
            this.children.each(button => {
                const isOverButton = button.getBounds().contains(pointer.x, pointer.y);

                if (isOverButton) {
                    // If the button is hovered and not already active for this pointer
                    if (!this.pointerStates[pointer.id][button.name]) {
                        this.handleButtonDown(button.name);  // Activate this button
                        this.pointerStates[pointer.id][button.name] = true; // Mark as active
                    }
                } else {
                    // If the pointer is not over the button but it was previously active, reset the state
                    if (this.pointerStates[pointer.id][button.name]) {
                        this.handleButtonUp(button.name); // Deactivate the button
                        this.pointerStates[pointer.id][button.name] = false; // Mark as inactive
                    }
                }
            });
        // }
    });
    // Add event listener for when the pointer leaves the game canvas
    this.input.on('gameout', (pointer) => {
        this.handlePointerUp(pointer);
    });
}
handlePointerUp(pointer) {
    if (!this.pointerStates[pointer.id]) {
        this.isDragging = false;
        return;
    }

    this.children.each(button => {
        if (this.pointerStates[pointer.id][button.name]) {
            this.handleButtonUp(button.name);
            this.buttonStates[button.name] = false;
            delete this.pointerStates[pointer.id][button.name];
        }
    });

    if (Object.keys(this.pointerStates[pointer.id]).length === 0) {
        delete this.pointerStates[pointer.id];
    }

    this.isDragging = false;
}
    
    createPointerListeners()
    {
    // Set up global pointer events in your scene's create method
this.input.on('pointerdown', (pointer) => {
    // Check if dragging
    if (this.isEditableMode) return; // Exit if in edit mode

    // Check which button is being pressed
    this.children.each(button => {
        if (button.getBounds().contains(pointer.x, pointer.y) && button.input.enabled) {
            this.handleButtonDown(button.name); // Use the button's name as the key
            this.buttonStates[button.name] = true; // Mark button as active
            this.isDragging = true; // Set dragging state
        }
    });
});
/*
this.input.on('pointerup', () => {
    // When the pointer is released, check for active buttons
    this.children.each(button => {
        if (this.buttonStates[button.name]) {
            this.handleButtonUp(button.name); // Use the button's name as the key
            this.buttonStates[button.name] = false; // Reset button state
        }
    });
    this.isDragging = false; // Reset dragging state
});
    
    */
    
    
    this.input.on('pointerup', (pointer) => {
    // Check which button the pointer is over when released
    this.children.each(button => {
        if (button.getBounds().contains(pointer.x, pointer.y) && this.buttonStates[button.name]) {
            this.handleButtonUp(button.name); // Use the button's name as the key
            this.buttonStates[button.name] = false; // Reset only the button state that was pressed
        }
    });
    this.isDragging = false; // Reset dragging state
});
    
    // Add this in your create method or wherever you're initializing your scene
this.input.on('pointermove', (pointer) => {
    // Check if dragging
    if (this.isDragging) {
        // Iterate through all buttons and check if pointer is over any button
        for (const key in this.buttonStates) {
            const button = this.children.getByName(key); // Adjust if using a different naming approach

            if (button && button.getBounds().contains(pointer.x, pointer.y)) {
                if (!this.buttonStates[key]) {
                /*
                    // Reset all other buttons first
                    for (const otherKey in this.buttonStates) {
                        if (otherKey !== key && this.buttonStates[otherKey]) {
                            this.handleButtonUp(otherKey);
                            this.buttonStates[otherKey] = false;
                        }
                    }
                    */
                    this.handleButtonDown(key);  // Activate this button
                    this.buttonStates[key] = true; // Mark as active
                }
                break; // Stop checking once we find the hovered button
            }
        }
    }
});
    
    };
    
    createButton2(key, x, y) {
    // Create the button image and set its position
    const button = this.add.image(x, y, key)
        .setScale(1.5)
        .setName(key); // Set the name to retrieve it later

    // Set the interactive area to be 80% of the button's original size
    button.setInteractive({
        hitArea: new Phaser.Geom.Rectangle( // Define the hit area directly
            0,  // Centered with no offset
            0,  // Centered with no offset
            button.width,  // 80% of scaled width
            button.height // 80% of scaled height
        ),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains // Check if point is within the rectangle
    });

    this.buttonStates[key] = false;

    // Register button-specific events
    button.on('pointerout', () => {
        if (this.buttonStates[key]) {
            this.handleButtonUp(key);
            this.buttonStates[key] = false;
        }
    });

    return button; // Return the created button
}


    createButton(key, x, y) {
        // const button = this.add.image(x, y, key).setInteractive();
        
        
              // Set the hit area to be 80% of the button's original size
//const scaleFactor = 0.8; // 80 percent
//const width = button.width * scaleFactor;  // 80% of width
//const height = button.height * scaleFactor; // 80% of height
        
        /*
        const button = this.add.image(x, y, key)
        .setInteractive({ draggable: false })  // Initially not draggable
        .setScale(1.5);
        // button.setScale(1.5); // Adjust scale as needed
        */
        
        // Create the button image and set its position
const button = this.add.image(x, y, key)
    .setScale(1.5); // Scale the button to 150%
    
    button.setInteractive({
        hitArea: new Phaser.Geom.Rectangle( // Define the hit area directly
            button.width*0.2, 
            button.height*0.2, 
            button.width * 0.6,  // 80% of width
            button.height * 0.6  // 80% of height
        ),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains // Callback to check if point is within the rectangle
    });
        
        
        
  

        
        
        
        
        
        

        this.buttonStates[key] = false;

     

        button.on('pointerdown', () => {

            if (this.isEditableMode) return;
            if (!this.isCooldown) {  // Only allow click in original mode
                this.handleButtonDown(key);
                this.buttonStates[key] = true;
                this.startCooldown(); // Start cooldown after pressing a button
                this.isDragging = true;
            }
        });

        button.on('pointerup', () => {
            if (this.buttonStates[key]) {
                this.handleButtonUp(key);
                this.buttonStates[key] = false;
                this.isDragging = false;
            }
        });

        button.on('pointerout', () => {
            if (this.buttonStates[key]) {
                this.handleButtonUp(key);
                this.buttonStates[key] = false;
            }
        });
        
        /*

      

        button.on('pointerover', () => {
            if (this.isEditableMode) return;

            if (this.isDragging ) {
                console.log(`Dragging over ${key}`);
                if (this.buttonStates[key]===false)
                {
                    this.handleButtonDown(key); // Update the walking direction when dragging over a button
                    this.buttonStates[key] = true;
                }
               
            }
        });
        
        */
        
button.on('pointerover', () => {
    if (this.isEditableMode) return;

    // Ensure that we're dragging and the current button isn't active yet
    if (this.isDragging && !this.buttonStates[key]) {
        // Reset all other buttons first
        for (const otherKey in this.buttonStates) {
            if (otherKey !== key && this.buttonStates[otherKey]) {
                this.handleButtonUp(otherKey);  // Stop the other button's action
                this.buttonStates[otherKey] = false;  // Reset the other button's state
            }
        }

        // Now, activate the current button
        this.handleButtonDown(key);  // Start walking in the new direction
        this.buttonStates[key] = true;  // Mark this button as active
    }
});    
        
        


        return button; // Return the created button
    }






    // Helper function to check which button is under the pointer
    getButtonUnderPointer(pointer) {
        // Check if pointer is over a button
        return this.buttonConfigs.find(config => {
            const button = this.children.getByName(config.key);
            return button && button.getBounds().contains(pointer.x, pointer.y);
        });
    }
 
    checkOverlap(buttonA, buttonB, buffer = 0) {
        const boundsA = buttonA.getBounds();
        const boundsB = buttonB.getBounds();
        
        // Manually expand bounds
        boundsA.x -= buffer;
        boundsA.y -= buffer;
        boundsA.width += buffer * 2;
        boundsA.height += buffer * 2;
        
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }


    // update() {
    //     // Simulate a crash after 5 seconds
    //     if (this.time.now > 5000) {
    //         throw new Error("Simulated game crash");
    //     }
    //     // ... rest of your update logic
    // }

    handleButtonPress(button) {
        globals.inputManager.handleButtonInput(button);
    }
}
