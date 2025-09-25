class TransitionScene extends Phaser.Scene {
    constructor() {
        super('TransitionScene');
    }


    init() {
       
    }
    // create() {
    //     this.transitionRect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
    //     this.transitionRect.setOrigin(0, 0);
    //     this.transitionRect.setAlpha(0);
    //     this.transitionRect.setDepth(1000);
    // }

    create(data) {
        this.transitionType = data.transitionType || 'fade';
        // this.fadeTime = data.fadeTime;
        // if (!this.sys.game.device.webGL) {
        //     console.warn('WebGL is not available. Falling back to Canvas renderer.');
        //     // Implement a fallback transition method here
        // }
        if (this.transitionType === 'fade') {
            this.createFadeEffect();
        } else if (this.transitionType === 'checkerboard') {
            this.createCheckerboardEffect();
        } else {
            console.warn('Unknown transition type:', this.transitionType);
            this.createFadeEffect(); // Default to fade effect
        }
    }
    
    createFadeEffect() {
        console.log('creating fade effect')
        this.transitionRect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
        this.transitionRect.setOrigin(0, 0);
        this.transitionRect.setAlpha(0);
        this.transitionRect.setDepth(1000);
    }
    
    createCheckerboardEffect() {
      
        this.graphics = this.add.graphics();
        this.graphics.setDepth(1000);

        this.rt = this.make.renderTexture({
            width: this.cameras.main.width,
            height: this.cameras.main.height
        }, true);

        // this.rt.clear();

        // this.rtImage = this.add.image(0, 0, this.rt).setOrigin(0, 0);
        // this.rtImage.setDepth(1000);


    }

    fadeOut(duration = 1000) {
        this.tweens.add({
            targets: this.transitionRect,
            alpha: 1,
            duration: duration,
            onComplete: () => {
                // this.scene.start(targetScene, data);
            }
        });
    }

    fadeIn(duration = 1000) {
        this.tweens.add({
            targets: this.transitionRect,
            alpha: 0,
            duration: duration,
            onComplete: () => {
                // this.scene.stop();
            }
        });
    }

    
    checkerboardTransition(duration = 1000, fadeOut = true) {
        const cols = 8;
        const rows = 6;
        const tileWidth = this.cameras.main.width / cols;
        const tileHeight = this.cameras.main.height / rows;
    
        let tiles = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                tiles.push({
                    x: x * tileWidth,
                    y: y * tileHeight,
                    width: tileWidth,
                    height: tileHeight
                });
            }
        }
    
        // Shuffle the tiles for a random effect
        Phaser.Utils.Array.Shuffle(tiles);
    
        if (fadeOut) {
            // Start with nothing on the screen (scene visible), add squares to cover the scene
            this.graphics.clear();
            this.rt.clear();  // Clears the render texture first
        } else {
            // Start with the screen fully covered with black squares (hide the scene)
            this.graphics.clear();
            this.graphics.fillStyle(0x000000);
            tiles.forEach(tile => {
                this.graphics.fillRect(tile.x, tile.y, tile.width, tile.height);
            });
            this.rt.clear();
            this.rt.draw(this.graphics);  // Draws the filled checkerboard on the render texture
        }
    
        return new Promise((resolve) => {
            let progress = 0;
            this.tweens.addCounter({
                from: 0,
                to: tiles.length,
                duration: duration,
                onUpdate: (tween) => {
                    const value = Math.floor(tween.getValue());
                    // const value = (tween.getValue());

                    if (value !== progress) {
                        progress = value;
                        this.graphics.clear();
    
                        if (fadeOut) {
                            // Fade-out: Add squares to cover the scene gradually
                            this.graphics.fillStyle(0x000000);
                            for (let i = 0; i < progress; i++) {
                                const tile = tiles[i];
                                this.graphics.fillRect(tile.x, tile.y, tile.width, tile.height);
                            }
                        } else {


                            // Add a flag to track whether the fade-in has just started
                            let isFirstFadeIn = true;

                            if (isFirstFadeIn) {
                                // Clear the graphics only once at the start of the fade-in
                                this.graphics.clear();  // Clears the current graphics buffer
                            
                                // Optional: If you're using a render texture and need to reset it
                                if (this.rt) {
                                    this.rt.clear(); // If using a render texture, clear it
                                }
                            
                                // Optionally, reset the render target if needed
                                if (this.rt) {
                                    this.rt.draw(this.graphics); // Draw your graphics into the render target (if applicable)
                                }
                            
                                isFirstFadeIn = false;  // Set the flag to false after the first clear
                            }
                            // Fade-in: Remove squares to reveal the scene
                            this.graphics.fillStyle(0x000000);

                   
                            for (let i = progress; i < tiles.length; i++) {
                                const tile = tiles[i];
                                this.graphics.fillRect(tile.x, tile.y, tile.width, tile.height);
                            }
                           

                        }
    
                        // Draw the updated graphics without clearing the entire texture
                        this.rt.draw(this.graphics);
                    }
                },
                onComplete: () => {
                    if (fadeOut) {
                        // Fade-out complete: fully cover the screen
                        this.graphics.clear();
                        this.rt.clear();
                    } else {
                        // Fade-in complete: fully reveal the scene, no need to clear the texture
                        this.graphics.clear();
                    }
                    resolve();
                }
            });
        });
    }
        
    
    checkerboardOut(duration = 1000) {
        return this.checkerboardTransition(duration, true);
    }

    checkerboardIn(duration = 1000) {
        return this.checkerboardTransition(duration, false);
    }



    fadeOut(duration = 1000) {
        return this.checkerboardTransition(duration, true);
    }

    fadeIn(duration = 1000) {
        return this.checkerboardTransition(duration, false);
    }

}