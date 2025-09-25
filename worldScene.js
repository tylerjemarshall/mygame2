
class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });

       
    }

    preload()
    {
        this.load.image('map', 'images/newmap15.png');

    }

    create(data)
    {

this.scene.bringToTop('WorldScene');
   
        this.originScene = data.originScene;
        this.sceneManager = globals.sceneManager;
    
        


        this.teleport = [
            { x: 65, y: 45, name: 'Home', rect: null },
            { x: 80, y: 126, name: 'Shop In Woods', rect: null },
            { x: 150, y: 117, name: 'Town 2' , rect: null},
            { x: 223, y: 49, name: 'Hut' , rect: null}
        ];


        const width = this.sys.game.config.width;
const height = this.sys.game.config.height;

// Load the image and set its position to the center of the screen
const backgroundRect = this.add.graphics();
backgroundRect.fillStyle(0x000000); // Black color
backgroundRect.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

const backgroundImage = this.add.image(0, 0, 'map');
backgroundImage.setOrigin(0.15, 0.2);

// Add the 'x' button
const closeButton = this.add.text(width - 30, 30, 'X', { fontFamily: 'Arial', fontSize: '24px', fill: '#FF0000' }).setOrigin(0.5);
closeButton.setInteractive();
closeButton.on('pointerdown', () => {
    console.log('Close button clicked');
    // this.scene.get('MapScene').setKeyboardEnabled(true);
    // this.scene.start('MapScene');
    this.escape();
});

// Calculate the player's position relative to the displayed map
let playerX = globals.characterPosition.x * 12 + 6;
let playerY = globals.characterPosition.y * 12 + 6;

// Set the initial position of the map image
const initialX = width / 2; // Center horizontally
const initialY = height / 2; // Center vertically
backgroundImage.setPosition(initialX, initialY);

// Calculate the new origin of the map image based on the player's position
const originX = playerX / backgroundImage.displayWidth;
const originY = playerY / backgroundImage.displayHeight;
backgroundImage.setOrigin(originX, originY);

// Draw the player character
const player = this.add.rectangle(
    playerX,
    playerY,
    12, // Width of the player rectangle
    12, // Height of the player rectangle
    0xFF0000 // Red color
);

// Set the player's depth to ensure it's above the map
player.setDepth(1);



            playerX = (globals.characterPosition.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
            playerY = (globals.characterPosition.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);


            player.x=playerX;
            player.y=playerY;

            console.log(player.x);
            console.log(player.y);

            player.width = 12 * backgroundImage.scaleX;
            player.height = 12 * backgroundImage.scaleY;

            player.setOrigin(0.5);


        //////////////////

        this.teleport.forEach(destination => {
            // Access properties of each destination
            console.log(`Destination: ${destination.name}, Coordinates: (${destination.x}, ${destination.y})`);
            destination.rect = this.add.rectangle(
                    (destination.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX),
                    (destination.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY),
                    12, // Width of the player rectangle
                    12, // Height of the player rectangle
                    0x000000 // Red color
                );
            // console.log('created rectangle');

            // destination.rect.setInteractive();
            destination.rect.setInteractive(new Phaser.Geom.Rectangle(-24, -24, 36, 36), Phaser.Geom.Rectangle.Contains);


            // Add pointer events to the rectangle
            destination.rect.on('pointerdown', () => {
            globals.gameInstance.scene.getScene('MapScene').setCharacterPosition(destination.x, destination.y);
            console.log(`Clicked on ${destination.name}`);
            // this.scene.get('MapScene').setKeyboardEnabled(true);
            // this.scene.start('MapScene');
            this.escape();
            
            // Add your logic for handling the click event here
    });
        });
           
  

        //////zoom////////



        // Set initial scale
        let scale = 1;

        // Function to handle zooming
    


        const handleZoom = (pointer, currentlyOver, deltaX, deltaY, deltaZ) => {
            // Adjust scale based on zoom direction
            const zoomFactor = 0.001; // Adjust to make zooming less sensitive
            const zoomSpeed = 1;
            // console.log('pointer length: ',pointer.manager.pointers.length);

            if (deltaX === null && deltaY === null)
            {
                deltaX = 0;
                deltaY = 0;   
            }

            // Calculate the total delta with flipped sign to change zoom direction
            const totalDelta = -(deltaX + deltaY + deltaZ);

            // Update scale based on total delta
            scale += totalDelta * zoomFactor * zoomSpeed;


            

            // Ensure scale doesn't become negative
            scale = Math.max(scale, 0.1);
        
            // Get the pointer position relative to the background image
            const pointerX = pointer.x - backgroundImage.x;
            const pointerY = pointer.y - backgroundImage.y;
        
            // Calculate the new scale of the background image
            let newScaleX = backgroundImage.scaleX + totalDelta * zoomFactor * zoomSpeed;
            let newScaleY = backgroundImage.scaleY + totalDelta * zoomFactor * zoomSpeed;
        
            // Ensure the image cannot be smaller than the window
            const minWidthScale = width / backgroundImage.width;
            const minHeightScale = height / backgroundImage.height;
        
            newScaleX = Math.max(newScaleX, minWidthScale);
            newScaleY = Math.max(newScaleY, minHeightScale);
        



            // Calculate the new position of the background image after zooming
            const newPointerX = (pointerX / backgroundImage.scaleX) * newScaleX;
            const newPointerY = (pointerY / backgroundImage.scaleY) * newScaleY;
        
            // Adjust the position of the background image based on the pointer's position
            backgroundImage.x += pointerX - newPointerX;
            backgroundImage.y += pointerY - newPointerY;
        
            // Update scale based on total delta
            backgroundImage.scaleX = newScaleX;
            backgroundImage.scaleY = newScaleY;


            // console.log(backgroundImage.scaleX);
            // console.log(backgroundImage.scaleY);
            // console.log(this.cameras.main.zoom);



            // Calculate the player's position relative to the displayed map with consideration of the scale
            playerX = (globals.characterPosition.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
            playerY = (globals.characterPosition.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);

                
            // });
            this.teleport.forEach(destination => {
                // Access properties of each destination
                if (destination.rect)
                {
                    console.log(`Destination: ${destination.name}, Coordinates: (${destination.x}, ${destination.y})`);
                    destination.rect.x = (destination.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
                    destination.rect.y = (destination.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);
                    destination.rect.width = 12*backgroundImage.scaleX;
                    destination.rect.height = 12*backgroundImage.scaleY;
                    destination.rect.setOrigin(0.5);

                }
                {
                    // console.log('no rectangle');
                }
                
            });
            // this.updateRectanglesPosition();

            player.x=playerX;
            player.y=playerY;

            console.log(player.x);
            console.log(player.y);

            player.width = 12 * backgroundImage.scaleX;
            player.height = 12 * backgroundImage.scaleY;

            player.setOrigin(0.5);
        };
        
        ///////////////////////////////////////////


        //////////////////////////////////////


        // Add event listener for mouse wheel scroll
       // Add event listener for mouse wheel scroll
        this.input.on('wheel', (pointer, currentlyOver, deltaX, deltaY, deltaZ) => {
            handleZoom(pointer, currentlyOver, deltaX, deltaY, deltaZ);
        });


        ///////zoom//////




        //////////dragable////////

        // Enable input on the image
        backgroundImage.setInteractive();


        this.input.addPointer(3)

        // Set up pointer events for dragging
        this.input.setDraggable(backgroundImage);

        // Add event listener for when dragging starts
        this.input.on('dragstart', function (pointer, gameObject) {
            //gameObject.setTint(0xff0000); // Change tint when dragging starts
        });

        // Add event listener for when dragging ends
        this.input.on('dragend', function (pointer, gameObject) {
            //gameObject.clearTint(); // Clear tint when dragging ends
        });


 


        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            // Now, inside this arrow function, `this` refers to the enclosing lexical context, likely your `WorldScene` instance
            // console.log('pointer length: ',pointer.manager.pointers.length);
            const activePointers = this.input.manager.pointers.filter(p => p.isDown).length;
            console.log('Active Pointers: ', activePointers);

            gameObject.x = dragX;
            gameObject.y = dragY;
        

            playerX = (globals.characterPosition.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
            playerY = (globals.characterPosition.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);

            // Check if `this.teleport` exists and iterate over its destinations
            
        
            player.x = playerX;
            player.y = playerY;

            // this.updateRectanglesPosition();
            this.teleport.forEach(destination => {
                // Access properties of each destination
                if (destination.rect)
                {
                    // console.log(`Destination: ${destination.name}, Coordinates: (${destination.x}, ${destination.y})`);
                    destination.rect.x = (destination.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
                    destination.rect.y = (destination.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);
                    destination.rect.width = 12*backgroundImage.scaleX;
                    destination.rect.height = 12*backgroundImage.scaleY;
                    destination.rect.setOrigin(0.5);

                }
                {
                    // console.log('no rectangle');
                }
                
            });


        });




        
        let initialDistance = null; // To store the initial distance between two fingers
        let zoomFactor = 0.005; // Adjust zoom sensitivity
        
        this.input.on('pointermove', (pointer) => {
            const activePointers = this.input.manager.pointers.filter(p => p.isDown);
        
            // If two pointers are down, calculate pinch-to-zoom
            if (activePointers.length === 2) {
                const pointer1 = activePointers[0];
                const pointer2 = activePointers[1];
        
                // Calculate the distance between the two pointers
                const distX = pointer1.x - pointer2.x;
                const distY = pointer1.y - pointer2.y;
                const distance = Math.sqrt(distX * distY + distY * distY);
        
                // If it's the first time two fingers are detected, set the initial distance
                if (!initialDistance) {
                    initialDistance = distance;
                } else {
                    // Calculate zoom based on change in distance
                    const zoomChange = (distance - initialDistance) * zoomFactor;
        
                    // Update the background image scale based on zoom change
                    backgroundImage.scaleX += zoomChange;
                    backgroundImage.scaleY += zoomChange;
        
                    // Ensure scale stays within a range (so it doesn't get too small or large)
                    backgroundImage.scaleX = Phaser.Math.Clamp(backgroundImage.scaleX, 0.5, 2); // Adjust limits as needed
                    backgroundImage.scaleY = Phaser.Math.Clamp(backgroundImage.scaleY, 0.5, 2);
        
                    // Update `initialDistance` for the next frame
                    initialDistance = distance;

                    //////////adding update item positions///////////


                            
                    playerX = (globals.characterPosition.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
                    playerY = (globals.characterPosition.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);

                    // Check if `this.teleport` exists and iterate over its destinations
                    
                
                    player.x = playerX;
                    player.y = playerY;

                    // this.updateRectanglesPosition();
                    this.teleport.forEach(destination => {
                        // Access properties of each destination
                        if (destination.rect)
                        {
                            // console.log(`Destination: ${destination.name}, Coordinates: (${destination.x}, ${destination.y})`);
                            destination.rect.x = (destination.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
                            destination.rect.y = (destination.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);
                            destination.rect.width = 12*backgroundImage.scaleX;
                            destination.rect.height = 12*backgroundImage.scaleY;
                            destination.rect.setOrigin(0.5);

                        }
                        {
                            // console.log('no rectangle');
                        }
                        
                    });






                    ///////////////////////////////////////////////

                }
            }
        
            // If only one pointer is active, reset initialDistance (no more pinch)
            if (activePointers.length < 2) {
                initialDistance = null;
            }
        });
      
        








// Add event listener for the 'arrow key' press
this.input.keyboard.on('keydown', (event) => {
    const speed = 10; // Adjust the speed as needed
    switch (event.code) {
        case 'ArrowLeft':
            playerX += speed; // Move right (add speed)
            backgroundImage.x += speed; // Move the background image right
            break;
        case 'ArrowRight':
            playerX -= speed; // Move left (subtract speed)
            backgroundImage.x -= speed; // Move the background image left
            break;
        case 'ArrowDown':
            playerY -= speed; // Move up (subtract speed)
            backgroundImage.y -= speed; // Move the background image up
            break;
        case 'ArrowUp':
            playerY += speed; // Move down (add speed)
            backgroundImage.y += speed; // Move the background image down
            break;
    }

    // Update the player's position
    player.x = playerX;
    player.y = playerY;

    // Check if `this.teleport` exists and iterate over its destinations
    if (this.teleport) {
        // console.log('teleport exists as it should');
        this.teleport.forEach(destination => {
            // Access properties of each destination
            if (destination.rect) {
                // console.log(`Destination: ${destination.name}, Coordinates: (${destination.x}, ${destination.y})`);
                if (event.code === 'ArrowLeft') {
                    destination.rect.x += speed; // Move right (add speed)
                } else if (event.code === 'ArrowRight') {
                    destination.rect.x -= speed; // Move left (subtract speed)
                } else if (event.code === 'ArrowDown') {
                    destination.rect.y -= speed; // Move up (subtract speed)
                } else if (event.code === 'ArrowUp') {
                    destination.rect.y += speed; // Move down (add speed)
                }
            } else {
                // console.log('no rectangle');
            }
        });
    } else {
        // console.log('teleport does not exist');
        // console.log(this.teleport);
    }
});



        /////////dragable////////////


        // Add event listener for the 'm' key press
        this.input.keyboard.on('keydown-M', function(event) {
            console.log('M key pressed');
            // Load the desired scene when 'm' key is pressed
            // this.scene.get('MapScene').setKeyboardEnabled(true);
            // this.scene.start('MapScene');
            // globals.sceneManager.transitionTo('MapScene');
            this.escape();
        }, this); // Passing 'this' context to maintain scope





    



    }



    escape() {
        console.log('escaping');

        if (this.originScene) console.log('originscene: ', this.originScene);
        // this.scene.stop('WorldScene');
        if (this.originScene === 'MenuScene') {
            // this.scene.stop('WorldScene');
            // this.scene.start('MenuScene');
            this.sceneManager.transitionTo('MenuScene', { fromWorld: true });
        } else {
            // Assuming you want to keep the MapScene keyboard enabled logic
            globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);
            // this.sceneManager.transitionTo('MapScene', { fromWorld: true });
            // this.scene.start('MapScene');
            this.sceneManager.start('MapScene', { fromWorld: true });
            

        }
    }



    updateRectanglesPosition() {
        
            this.teleport.forEach(destination => {
                // Access properties of each destination
                if (destination.rect)
                {
                    console.log(`Destination: ${destination.name}, Coordinates: (${destination.x}, ${destination.y})`);
                    destination.rect.x = (destination.x * 12 + 6) * backgroundImage.scaleX + (backgroundImage.x - backgroundImage.displayWidth * backgroundImage.originX);
                    destination.rect.y = (destination.y * 12 + 6) * backgroundImage.scaleY + (backgroundImage.y - backgroundImage.displayHeight * backgroundImage.originY);
                    destination.rect.width = 12*backgroundImage.scaleX;
                    destination.rect.height = 12*backgroundImage.scaleY;
                    destination.rect.setOrigin(0.5);

                }
                {
                    console.log('no rectangle');
                }
                
            });
    

}

}
