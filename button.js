class Button extends Phaser.GameObjects.Container {

    
        constructor(scene, x, y, width, height, text, callbacks, fontSize = '12px', textColor = 'black') {

        super(scene, x, y);
        this.scene = scene;
        
        // Create button image
        this.buttonImage = scene.add.image(0, 0, 'button_normal');
        this.buttonImage.setDisplaySize(width, height);

  

        // Create button text
        this.buttonText = scene.add.text(0, 0, text, { fontSize: fontSize, fill: textColor }); //'#000'
        this.buttonText.setOrigin(0.5);

        // Add components to the container
        this.add([this.buttonImage, this.buttonText]);

        // Set the size of the container
        this.setSize(width, height);
        this.setInteractive();

        // Store callbacks for action
        this.callbacks = callbacks;


        // Custom data storage (like `setData`)
        this.customData = {};  // Object to hold key-value pairs

        // Add interaction events
        this.setupInteractions();

        // Add the button container to the scene
        scene.add.existing(this);
    }


    preload()
    {
        this.load.image('button_normal', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_normal.png');
        this.load.image('button_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_hover.png');
        this.load.image('button_selected', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_pressed.png');
        
        
    }
    setupInteractions() {
        // Pointer over - hover state
        this.buttonImage.setInteractive()
            .on('pointerover', () => {
                this.buttonImage.setTexture('button_hover');
            })
            .on('pointerout', () => {
                this.buttonImage.setTexture('button_normal');
            })
            .on('pointerdown', () => {
                this.buttonImage.setTexture('button_selected');
                this.executeCallbacks();
            })
            .on('pointerup', () => {
                this.buttonImage.setTexture('button_hover');
            });
    }

    executeCallbacks() {
        if (Array.isArray(this.callbacks)) {
            this.callbacks.forEach(callback => callback());
        } else if (typeof this.callbacks === 'function') {
            this.callbacks();
        }
    }

    // Method to mimic `setData` (renamed to avoid conflict)
    setCustomData(key, value) {
        this.customData[key] = value;  // Store data with key-value pairs
    }

    // Method to mimic `getData` (renamed to avoid conflict)
    getCustomData(key) {
        return this.customData[key];  // Retrieve data based on key
    }
}
