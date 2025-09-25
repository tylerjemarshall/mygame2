class RenamePokemonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RenamePokemonScene' });
        this.inputListener = null;  // Store the input listener reference
        this.enterKeyListener = null; // Store the listener reference
        this.escapeKeyListener = null; // Store the listener reference
        // this.inputBox=null
        this.currentName = '';
        this.maxNameLength = 12; // or whatever max length you want
        this.keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
            ['SHIFT', 'BACKSPACE', 'SPACE']
        ];
        this.isShiftActive = true;
        this.keyboardButtons = {};
        


    }

    preload()
    {

        this.load.spritesheet('male', 'images/player4.png', { frameWidth: 160, frameHeight: 200 });
        this.load.spritesheet('female', 'images/femaleplayer.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('female2', 'images/femaleplayer2new.png', { frameWidth: 56.25, frameHeight: 56.25 });
        



        // Load sprite sheets for each Pokémon
        globals.pokemonData.forEach(pokemon => {
        this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        });
        

        
        globals.characterList.forEach(character => {
            this.load.spritesheet(character, `images/NinjaAdventure/Actor/Characters/${character}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(character + 'Faceset', `images/NinjaAdventure/Actor/Characters/${character}/Faceset.png`);

        });



        this.load.image('menubackground', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu4.png');
        this.load.image('menubackground2', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');

        this.load.image('panel', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched_square.png');
        this.load.image('panel2', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched_square.png');
        this.load.image('panel3', 'images/NinjaAdventure/Ui/Theme/nine_path_7_streched.png');
        this.load.image('button_normal', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_normal.png');
        this.load.image('button_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_hover.png');
        this.load.image('button_selected', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_pressed.png');
        
    }

    init() {
      
    }

    create(data) {
        this.pokemon = data.pokemon;
        this.originScene = data.originScene;
        this.from = data.from;
        this.onClose = data.onClose;
        this.character = data.character;


        this.pokemonName = '';  // Initialize the Pokémon's name as an empty string
        // if (this.originScene === 'SelectCharacterScene')
        // {
        //     this.currentName = this.character;
        // }
        // else
        // {
        //     this.currentName = this.pokemon.name;
        // }
        this.input.addPointer(3)


        this.currentName = this.originScene === 'SelectCharacterScene' ? this.character : this.pokemon.name;

        // Create the input box for typing the name
        // this.inputBox = this.add.text(200, 100, '_', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });


        // Set the background (same as displayNewPokemonDetails)
        this.pokedexBackground = this.add.image(0, 0, 'menubackground2').setOrigin(0, 0);
        this.pokedexBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.pokedexBackground.setDepth(0);



        
        // Display a prompt for renaming
        const textConfig = { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' };
        // Display a prompt for renaming
        const renamePrompt = this.originScene === 'SelectCharacterScene' ? 'Name:' : 'Rename your Pal:';
        const renameText = this.add.text(200, 50, renamePrompt, textConfig);
        // const renameText = this.add.text(200, 50, 'Rename your Pal:', textConfig);

        // Text input box
        let inputText = '';
        this.inputBox = this.add.text(200, 100, this.currentName + '_', textConfig);

      


        // Display the initial sprite and name based on the origin scene
        if (this.originScene === 'SelectCharacterScene') {
            this.displayCharacter(this.character);
        } else {
            this.displayPokemon(this.pokemon.key);  // Use pokemon.key for Pokémon
        }


        
        // Confirm button using Button class
        const confirmButton = new Button(
            this, 
            200, 200, 
            150, 40, 
            'Confirm', 
            () => this.confirm(this.currentName)
        );
        let defaultName = '';

        if (this.originScene === 'SelectCharacterScene')
        {
            defaultName = this.character;
        }
        else
        {
            defaultName = this.pokemon.name;
        }

        // Cancel button using Button class
        const cancelButton = new Button(
            this, 
            400, 200, 
            150, 40, 
            'Cancel', 
            () => this.confirm(defaultName) //this.pokemon.name
        );

        // Add buttons to the scene
        this.add.existing(confirmButton);
        this.add.existing(cancelButton);


    
        confirmButton.buttonText.setFontSize(20); // Set font size for keyboard buttons
        cancelButton.buttonText.setFontSize(20); // Set font size for keyboard buttons




        const startX = 80;
        const startY = 280;
        const buttonWidth = 50;
        const buttonHeight = 50;
    
        this.keyboardLayout.forEach((row, rowIndex) => {
            row.forEach((key, keyIndex) => {
                const x = startX + keyIndex * buttonWidth;
                const y = startY + (rowIndex * buttonHeight);
                this.createKeyboardButton(x, y, key);
            });
        });




    }

// Function to display the character's sprite and update the input box
displayCharacter(character) {
    globals.selectedCharacter=character;

    // Remove the existing sprite if it exists
    if (this.pokemonSprite) {
        this.pokemonSprite.destroy();
    }

    // Update the current name
    this.currentName = character;

    // Create and display the new sprite

    if (character==='male' ||character==='female'||character==='female2')
    {
        this.pokemonSprite = this.add.image(100, 100, character) // Assuming unique players have 'Faceset' images
        .setDisplaySize(128, 128).setOrigin(0, 0).setOrigin(0.5, 0.5);

    }
    else
    {

        this.pokemonSprite = this.add.sprite(100, 100, character);
        this.pokemonSprite.setScale(6);

         // Create animations for the new character if they don't exist
        if (!this.anims.exists(character)) {
            this.anims.create({
                key: character,
                frames: this.anims.generateFrameNumbers(character, { frames: [0, 4, 8, 12] }),
                frameRate: 10,
                repeat: -1
            });
        }
          // Play the character's animation
        this.pokemonSprite.anims.play(character, true);
    }



    
    this.inputBox.setText(character + '_');

    // Update the input box text
    // if (globals.characterName === '')    this.inputBox.setText(this.currentName + '_'); else this.inputBox.setText(globals.characterName + '_')
}

displayPokemon(pokemon)
{
    if (this.pokemonSprite) {
        this.pokemonSprite.destroy();
    }

    this.pokemonSprite = this.add.sprite(100, 100, pokemon);
    this.pokemonSprite.setScale(6);

     // Create animations for the new character if they don't exist
    if (!this.anims.exists(pokemon)) {
        this.anims.create({
            key: pokemon,
            frames: this.anims.generateFrameNumbers(pokemon, { frames: [0, 4, 8, 12] }),
            frameRate: 10,
            repeat: -1
        });
    }
      // Play the character's animation
    this.pokemonSprite.anims.play(pokemon, true);
}


    updateName(newName) {
        if (newName === 'Backspace') {
            // Remove the last character from the Pokémon's name
            this.pokemonName = this.pokemonName.slice(0, -1);
        } else {
            // Append the new character to the Pokémon's name
            this.pokemonName += newName;
        }
        
        // Update the input box to display the new name with the underscore
        this.inputBox.setText(this.pokemonName + '_');
        
        console.log('Current Pokémon name:', this.pokemonName);  // Debug log the current name
    }

    updateNameText() {
        this.inputBox.setText(this.currentName + '_');
        console.log('current name: ', this.currentName);
    }

    confirmName() {
        console.log('Name confirmed:', this.currentName);
        this.confirm(this.currentName);
        // Add logic to save the name and exit the scene
    }

    cancel() {
        console.log('Renaming cancelled');
        this.confirm(this.pokemon.name);
        // Add logic to exit the scene without saving
    }
    

  // Method to clean up and remove the input listener
  cleanup() {
    this.input.keyboard.off('keydown', this.inputListener);
    console.log('Keyboard listener removed');

    // Remove the Enter key listener
    if (this.enterKeyListener) {
        this.input.keyboard.removeListener('keydown-ENTER', this.enterKeyListener);
        this.enterKeyListener = null; // Clear the listener reference
    }
      // Remove the Enter key listener
      if (this.escapeKeyListener) {
        this.input.keyboard.removeListener('keydown-ESC', this.escapeKeyListener);
        this.escapeKeyListener = null; // Clear the listener reference
    }
}



createKeyboardButton(x, y, key) {
    let width = 45, height = 45; // Default size for most keys
    // let scale = { x: 0.4, y: 0.9 }; // Default scale
    if (key === 'BACKSPACE' || key === 'SPACE' || key === 'SHIFT') {
        width = 100; // Wider for special keys
        // scale = { x: 1, y: 0.9 };
    }

    const button = new Button(
        this,
        x, y,
        width, height,
        key,
        () => this.handleKeyPress(key)
    );


    if (key === 'BACKSPACE') {
        button.x += 270;
    } else if (key === 'SPACE') {
        button.x += 80;
    }
    else  if ( key === 'SHIFT')
    {
        
        button.x += 25;
        // button.setScale(1, 0.9);


    }


    // button.setScale(scale.x, scale.y);



    button.buttonText.setFontSize(20); // Set font size for keyboard buttons
    // Store the button for later access
    this.keyboardButtons[key] = button;
    return button;
}





confirm(inputText) {


    if (this.originScene === 'SelectCharacterScene')
    {

        // globals.selectedCharacter=this.character;

        // Check the inputText to determine which character to activate
        if (globals.selectedCharacter === 'male') {
            globals.player.male.active = true;
            globals.player.female.active = false;
            globals.player.female2.active = false;
            globals.player.red.active = false;
        } else if (this.character === 'female') {
            globals.player.male.active = false;
            globals.player.female.active = true;
            globals.player.female2.active = false;
            globals.player.red.active = false;
        } else if (this.character === 'female1') {
            globals.player.male.active = false;
            globals.player.female.active = false;
            globals.player.female2.active = true; // Assuming female2 corresponds to female1
            globals.player.red.active = false;
        } else if (this.character === 'red') {
            globals.player.male.active = false;
            globals.player.female.active = false;
            globals.player.female2.active = false;
            globals.player.red.active = true;
        } else {
            globals.player.male.active = false;
            globals.player.female.active = false;
            globals.player.female2.active = false;
            globals.player.red.active = false;
            // console.warn('Invalid character name:', inputText);
        }

       
        console.log('selected: ', globals.selectedCharacter);
        // globals.selectedCharacter = this.character;
        globals.characterName = inputText;
        globals.isNewGame=false;
        // globals.selectedCharacter = 
        globals.sceneManager.stop('SelectCharacterScene');
        globals.sceneManager.start('MapScene');
    }

    else
    {
        this.cleanup();
        // if (inputText === '') inputText = this.pokemon.name;
        this.pokemon.name = inputText;  // Set the new name
        console.log('stopping scene renamepokemonscene');
        console.log('renamed pokemon to: ' + this.pokemon.name);
        console.log('originScene: ',this.originScene);
        // this.scene.stop('RenamePokemonScene');
        if (this.originScene === 'PartyScene') {
            console.log('resuming scene : ' + this.originScene);
    
            globals.controlGameInstance.scene.getScene('PartyScene').updatePokemonName(this.pokemon);
            // globals.sceneManager.queueTransition(this.originScene);
            globals.sceneManager.transitionTo(this.originScene, {from: this.from});
    
    
    
        } else {
            console.log('rename pokemon scene stopping');
            
            globals.controlGameInstance.scene.getScene('PokemonDetailsScene').renamePokemonName(this.pokemon.name);
            // globals.sceneManager.transitionTo(this.originScene , { pokemon: this.pokemon, originScene: 'BattleScene', action: 'renamed', onClose: this.onClose});
            globals.sceneManager.queueTransition(this.originScene , { pokemon: this.pokemon, originScene: 'BattleScene', action: 'renamed', onClose: this.onClose}, false, true);
    
    
        }
    }



 
}



handleKeyPress(key) {
    if (key === 'BACKSPACE') {
        this.currentName = this.currentName.slice(0, -1);
    } else if (key === 'SPACE') {
        if (this.currentName.length < this.maxNameLength) {
            this.currentName += ' ';
        }
    } else if (key === 'SHIFT') {
        this.isShiftActive = !this.isShiftActive;
        this.updateKeyboardCase();
    } else {
        if (this.currentName.length < this.maxNameLength) {
            this.currentName += this.isShiftActive ? key : key.toLowerCase();
        }
    }
    this.updateInputBox();
}

updateKeyboardCase() {
    Object.entries(this.keyboardButtons).forEach(([key, button]) => {
        if (key !== 'BACKSPACE' && key !== 'SPACE' && key !== 'SHIFT') {
            button.buttonText.setText(this.isShiftActive ? key.toUpperCase() : key.toLowerCase());
        }
    });
}

updateInputBox() {
    this.inputBox.setText(this.currentName + '_');
}

}
