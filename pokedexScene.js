class PokedexScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PokedexScene' }); // Assign a key to identify the scene
        this.pokedexBackground = null;
       
    }


    preload()
    {

        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
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



    create(data) {

    // // Initialize InputManager
    // this.inputManager = globals.inputManager;
    // this.inputManager.init(this);

    // // Clear all existing listeners
    // this.inputManager.clearAllListeners();

    // // Set the current scene without adding new listeners
    // this.inputManager.setSceneInputs('PokedexScene', {});


        this.scene.bringToTop('PokedexScene');
        this.originScene = data.originScene;

        this.pokedex();


    }

    pokedex(){

        // this.clearMenu();

        // Check and set background if not already set
        // if (!this.pokedexBackground) {
            this.pokedexBackground = this.add.image(0, 0, 'background').setOrigin(0, 0);
            this.pokedexBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
            this.pokedexBackground.setDepth(1);
        // }

        const textConfig = { fontFamily: 'Arial', fontSize: '18px', fill: '#000000' };
        const pokemonData = globals.originalPokemonData;

        const containerWidth = 400;
        const containerHeight = this.cameras.main.height - 144;
        const containerX = 88;
        const containerY = 77;

        // Create the main panel for the Pokedex list
        this.mainPanel = this.add.image(containerX, containerY, 'panel');
        this.mainPanel.setOrigin(0, 0);
        this.mainPanel.setDisplaySize(containerWidth, containerHeight);
        this.mainPanel.setDepth(1);

        this.pokedexContainer = this.add.container(containerX, containerY);
        this.pokedexContainer.setDepth(2);
        this.pokedexContainer.setSize(containerWidth, containerHeight);

        for (let i = 0; i < pokemonData.length; i++) {
            const pokemon = pokemonData[i];
            const nameColor = globals.pokemonTypes[pokemon.type]; // Default to white if type color is not found

            const button = new Button(this, 200, i * 60 + 30, containerWidth - 20, 50, pokemon.name, () => {
                // this.scene.launch('PokemonDetailsScene', { 
                //     pokemon: pokemon, 
                //     originScene: this.scene.key 
                // });
                // this.scene.pause(); // Pause the Pokedex scene
                globals.sceneManager.transitionTo('PokemonDetailsScene', { 
                    pokemon: pokemon, 
                    originScene: this.scene.key 
                }, true);
            });

            const typeRect = this.add.rectangle(-100, 0, 35, 35, nameColor);
            button.add(typeRect);

            const pokemonSprite = this.add.sprite(-100, 0, pokemon.key);
            pokemonSprite.setScale(1.5);

            // Add sprite animation
            if (!this.anims.exists(pokemon.key)) {
                this.anims.create({
                    key: pokemon.key,
                    frames: this.anims.generateFrameNumbers(pokemon.key, { frames: [0, 4, 8, 12] }),
                    frameRate: 10,
                    repeat: -1 // Repeat the animation indefinitely
                });
            }
            pokemonSprite.anims.play(pokemon.key, true);

            const typeText = this.add.text(70, 0, pokemon.type, {
                fontFamily: 'Arial',
                fontSize: '14px',
                fill: '0x000000'
            }).setOrigin(0.5);

            const routes = globals.getPokemonRoute(pokemon.name);
            const route = this.add.text(130, 0, routes, {
                fontFamily: 'Arial',
                fontSize: '14px',
                fill: '0x000000'
            }).setOrigin(0.5);

            button.add(typeText);
            button.add(route);
            button.add(pokemonSprite);

            this.pokedexContainer.add(button);
        }

        this.backButton = new Button(this, this.cameras.main.width - 50, 50, 40, 40, 'X', [
            // () => this.cleanupPokedex(),
            // () => this.scene.get('MenuScene').setKeyboardEnabled(true),
            // () => this.scene.start('MenuScene'), // Change scene to main menu,
            () => this.closePokedexWindow()
        ]);
        this.backButton.setDepth(4);

        this.slider = new Slider(this, this.pokedexContainer);
    }

    closePokedexWindow()
    {
        console.log('originScene: ', this.originScene);
        globals.sceneManager.transitionTo(this.originScene); // {}, true

    }

    // // Cleanup Pokedex
    // cleanupPokedex(keepBackground = false) {
    //     console.log('Back button clicked');
    //     if (!keepBackground && this.pokedexBackground) {
    //         this.pokedexBackground.destroy();
    //         this.pokedexBackground = null;
    //     }

    //     this.slider.cleanup();
    //     if (this.mainPanel) {
    //         this.mainPanel.destroy();
    //     }
    // }

    // // Clear any existing menu options
    // clearMenu() {
    //     if (this.backButton) this.backButton.destroy();
    //     if (this.pokedexBackground) this.pokedexBackground.destroy();
    //     if (this.mainPanel) this.mainPanel.destroy();
    //     if (this.pokedexContainer) this.pokedexContainer.destroy();
    //     if (this.slider) this.slider.cleanup();
    // }
}
