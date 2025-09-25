class SelectCharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectCharacterScene' });
   
    }

    preload()
    {
        this.load.spritesheet('male', 'images/player4.png', { frameWidth: 160, frameHeight: 200 });
        this.load.spritesheet('female', 'images/femaleplayer.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('female2', 'images/femaleplayer2new.png', { frameWidth: 56.25, frameHeight: 56.25 });
        

        globals.characterList.forEach(character => {
            this.load.spritesheet(character, `images/NinjaAdventure/Actor/Characters/${character}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(character + 'Faceset', `images/NinjaAdventure/Actor/Characters/${character}/Faceset.png`);

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
        // Add the background image
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);  // Stretch background to fill screen

            const sliderContainer = this.add.container(50, 50); // Adjust the position as needed
            // Set the size of the slider container
            sliderContainer.setSize(500, 400); // Set width and height for the slider container

            // Set additional properties for the slider
            sliderContainer.itemHeight = 64;           // Height of each item
            sliderContainer.itemWidth = 64;            // Width of each item (optional, if needed)
            sliderContainer.type = 'grid';             // Use 'grid' type for the layout
            sliderContainer.sliderColor = 0xff0000;    // Color for the slider
            sliderContainer.backgroundColor = 0x000000; // Background color
            sliderContainer.textColor = 0xff0000;      // Text color

        // Unique players as an array
        const uniquePlayers = ['male', 'female', 'female2'];


        // Define starting x and y positions for the faceset images
        let startX = 0;
        let startY = 0;
        let rowOffset = 100; // Spacing between each row
        let colOffset = 100; // Spacing between each column
        let colCount = 5;    // Number of facesets per row


        const originalLength = globals.characterList.length;


         // Loop through the original character list and add images
        globals.characterList.forEach((character, index) => {
            let x = startX + (index % colCount) * colOffset;
            let y = startY + Math.floor(index / colCount) * rowOffset;

        const image = this.add.image(x, y, character + 'Faceset')
            .setDisplaySize(64, 64).setOrigin(0, 0);

        // Add to slider container
        sliderContainer.add(image);
        image.setInteractive();

        image.on('pointerdown', () => {
            // globals.player.male.active=false
            // globals.player.female.active=false
            //  globals.player.female2.active=false
            // globals.player.red.active=false
            this.selectedCharacter=character;
            globals.gameInstance.scene.getScene('RenamePokemonScene').displayCharacter(character);
        });
    });


        uniquePlayers.forEach((player, index) => {
            let x = startX + ((originalLength + index) % colCount) * colOffset; // Adjust position based on original length
            let y = startY + Math.floor((originalLength + index) / colCount) * rowOffset;
    
            const image = this.add.image(x, y, player) // Assuming unique players have 'Faceset' images
                .setDisplaySize(64, 64).setOrigin(0, 0);
    
            // if (player === 'player') image.setScale(0.1);
            // if (player === 'femaleplayer') image.setScale(2);
            // if (player === 'femaleplayer2') image.setScale(1.5);


            // Add to slider container
            sliderContainer.add(image);
            image.setInteractive();
    
            image.on('pointerdown', () => {
                console.log('selecting inique player: ' + player)
                this.handleUniquePlayerActions(player); // Call a function for unique player actions
            });
        });





        console.log('container length: ', sliderContainer.length);
        console.log('container x: ', sliderContainer.x);
        console.log('container y: ', sliderContainer.y);

        sliderContainer.background = background;
        // Create a new slider instance with the configured container
        this.slider = new Slider(this, sliderContainer);

        let char = globals.selectedCharacter;
        if (globals.selectedCharacter==='') char=globals.characterList[0];
        globals.sceneManager.launch('RenamePokemonScene', {
            character: char, // Pass the character object
            originScene: 'SelectCharacterScene' // Indicate the origin scene
        });
    }


    // Function to handle actions for unique players
    handleUniquePlayerActions(player) {






        // switch (player) {
        //     case 'male':
        //         // Custom action for player
        //            globals.player.male.active=true
        //           globals.player.female.active=false
        //            globals.player.female2.active=false
        //           globals.player.red.active=false
        //         break;
        //     case 'female':
        //         // Custom action for female player
        //         globals.player.male.active=false
        //         globals.player.female.active=true
        //          globals.player.female2.active=false
        //         globals.player.red.active=false
        //         break;
        //     case 'female2':
        //         // Custom action for female player 2
        //         globals.player.male.active=false
        //         globals.player.female.active=false
        //          globals.player.female2.active=true
        //         globals.player.red.active=false
        //         break;
        //     default:
        //          // Custom action for female player 2
        //          globals.player.male.active=false
        //          globals.player.female.active=false
        //           globals.player.female2.active=false
        //          globals.player.red.active=false
        //          break;

        // }
        globals.selectedCharacter = player;

        globals.gameInstance.scene.getScene('RenamePokemonScene').displayCharacter(player);

    }
}