class BreederScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BreederScene' });
        this.selectedPokemon1 = null; // First selected Pokémon
        this.selectedPokemon2 = null; // Second selected Pokémon
        this.pokemonSlot1=null;
        this.pokemonSlot2=null;
        this.name1 = null;
        this.name2 = null;
    }



    preload()
    {


        globals.pokemonData.forEach(pokemon => {
            // Load the spritesheet using template literals
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        
            // Load the Face image with the correct dynamic key using template literals
            this.load.image(`${pokemon.key}Face`, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/Faceset.png`);
            
            // Log the correct key to ensure it's working
            console.log(`${pokemon.key}Face`);
            console.log(this.textures.exists(pokemon.key + 'Face'));

        });
        
        this.load.image('background', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');
        this.load.image('button_normal', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_normal.png');
        this.load.image('button_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_hover.png');
        this.load.image('button_selected', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_pressed.png');
        this.load.image('dialogBox', 'images/NinjaAdventure/HUD/Dialog/DialogueBoxSimple.png');

    }

    create(data)
    {

        if (this.name1)
            console.log(this.name1.text);
        if (this.name2)
            console.log(this.name2.text);
        // this.pokemonSlot1=null;
        // this.pokemonSlot2=null;
        // this.name1 = null;
        // this.name2 = null;

        this.action = data.action;
        this.originScene = data.originScene;
        this.onClose = data.onClose;


        globals.pokemonData.forEach(pokemon => {
            console.log(`${pokemon.key}Face loaded:`, this.textures.exists(`${pokemon.key}Face`));
          });

        this.run();
    }

    run()
    {


      
          // Add background image to fill the entire scene
          const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
          background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
          background.setDepth(0);




          this.breedButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height - 100, 100, 50, 'Breed', () => this.breedPokemon());
          // Create buttons for selecting Pokémon
          const selectButton1 = this.createButton(130, this.cameras.main.height - 150, 120, 50, 'Select Left', () => this.selectPokemon(1));
          const selectButton2 = this.createButton(this.cameras.main.width - 150, this.cameras.main.height - 150, 120, 50, 'Select Right', () => this.selectPokemon(2));
      

          const closeButton = this.createButton(this.cameras.main.width - 50, 50, 40, 40, 'X', () => this.closePartyWindow());

    }



    // Function to handle Pokémon selection
    selectPokemon(slot) {
        // Launch PartyPokemon scene with action = breed and slot information
        // this.scene.launch('PartyScene', {
        //     action: 'Breed',
        //     originScene: 'BreederScene',
        //     slot: slot, // Pass which slot is being selected (1 = left, 2 = right)
        //     onSelect: (selectedSlot, selectedPokemon) => this.receiveSelectedPokemon(selectedSlot, selectedPokemon)
        // });
        globals.sceneManager.launch('PartyScene', {
            action: 'Breed',
            originScene: 'BreederScene',
            slot: slot, // Pass which slot is being selected (1 = left, 2 = right)
            onSelect: (selectedSlot, selectedPokemon) => this.receiveSelectedPokemon(selectedSlot, selectedPokemon)
        });
    }



    receiveSelectedPokemon(slot, selectedPokemon) {
        console.log('slot and selected pokemon: ' + selectedPokemon.key + ' and ' + slot);
        
        if (slot === 1) {
            this.selectedPokemon1 = selectedPokemon;
    
            if (this.pokemonSlot1 === null) {
                // Create animated Pokémon sprite
                this.pokemonSlot1 = this.add.sprite(150, this.cameras.main.height / 2 - 50, selectedPokemon.key);
                this.pokemonSlot1.setScale(10);
                
                // Add Pokémon name text above the sprite
                this.name1 = this.add.text(150, this.cameras.main.height / 2 - 150, selectedPokemon.name, { fontSize: '20px', fill: '#000' });
                this.name1.setOrigin(0.5); // Center the text above the sprite
    
                // Animation setup...
                if (!this.anims.exists(selectedPokemon.key + 'Animate')) {
                    this.anims.create({
                        key: selectedPokemon.key + 'Animate',
                        frames: this.anims.generateFrameNumbers(selectedPokemon.key, { frames: [0, 3, 7, 11] }),
                        frameRate: 10,
                        repeat: -1
                    });
                }
                this.pokemonSlot1.play(selectedPokemon.key + 'Animate');
            } else {
                this.pokemonSlot1.destroy();
                // Create animated Pokémon sprite again
                this.pokemonSlot1 = this.add.sprite(150, this.cameras.main.height / 2 - 50, selectedPokemon.key);
                this.pokemonSlot1.setScale(10);
    
                // Add Pokémon name text above the sprite
                this.name1.text = selectedPokemon.name;
                // nameText1.setOrigin(0.5); // Center the text above the sprite
    
                // Animation setup...
                if (!this.anims.exists(selectedPokemon.key + 'Animate')) {
                    this.anims.create({
                        key: selectedPokemon.key + 'Animate',
                        frames: this.anims.generateFrameNumbers(selectedPokemon.key, { frames: [0, 3, 7, 11] }),
                        frameRate: 10,
                        repeat: -1
                    });
                }
                this.pokemonSlot1.play(selectedPokemon.key + 'Animate');
            }
        } else if (slot === 2) {
            this.selectedPokemon2 = selectedPokemon;
    
            if (this.pokemonSlot2 === null) {
                // Create animated Pokémon sprite
                this.pokemonSlot2 = this.add.sprite(450, this.cameras.main.height / 2 - 50, selectedPokemon.key);
                this.pokemonSlot2.setScale(10);
                
                // Add Pokémon name text above the sprite
                this.name2 =  this.add.text(450, this.cameras.main.height / 2 - 150, selectedPokemon.name, { fontSize: '20px', fill: '#000' });
                this.name2.setOrigin(0.5); // Center the text above the sprite
    
                // Animation setup...
                if (!this.anims.exists(selectedPokemon.key + 'Animate')) {
                    this.anims.create({
                        key: selectedPokemon.key + 'Animate',
                        frames: this.anims.generateFrameNumbers(selectedPokemon.key, { frames: [0, 3, 7, 11] }),
                        frameRate: 10,
                        repeat: -1
                    });
                }
                this.pokemonSlot2.play(selectedPokemon.key + 'Animate');
            } else {
                this.pokemonSlot2.destroy();
                // Create animated Pokémon sprite again
                this.pokemonSlot2 = this.add.sprite(450, this.cameras.main.height / 2 - 50, selectedPokemon.key);
                this.pokemonSlot2.setScale(10);
    
                // Add Pokémon name text above the sprite
                this.name2.text = selectedPokemon.name;
                // nameText2.setOrigin(0.5); // Center the text above the sprite
    
                // Animation setup...
                if (!this.anims.exists(selectedPokemon.key + 'Animate')) {
                    this.anims.create({
                        key: selectedPokemon.key + 'Animate',
                        frames: this.anims.generateFrameNumbers(selectedPokemon.key, { frames: [0, 3, 7, 11] }),
                        frameRate: 10,
                        repeat: -1
                    });
                }
                this.pokemonSlot2.play(selectedPokemon.key + 'Animate');
            }
        }
    
        // Show breed button if two Pokémon are selected
        if (this.selectedPokemon1 && this.selectedPokemon2) {
            this.breedButton.visible = true;
        }
    }
    






    // // Function to handle Pokémon breeding logic
    // breedPokemon() {
    //     if (this.selectedPokemon1 === this.selectedPokemon2)
    //     {
    //         const dialogueBox = new DialogueBox(this, 'Cant breed pokemon with itself.');
    //     }
    //     if (this.selectedPokemon1 && this.selectedPokemon2&& (this.selectedPokemon1 != this.selectedPokemon2)) {
    //         // Add your breeding logic here, such as creating a new Pokémon

    //         console.log(`Breeding ${this.selectedPokemon1.name} with ${this.selectedPokemon2.name}`);
    //         // After breeding, reset the scene or return to the previous scene
    //         // this.scene.start('MapScene'); // Example of going back to MapScene

    //         const dialogueBox = new DialogueBox(this, 'Breeding ' + this.selectedPokemon1.name + ' with ' + this.selectedPokemon2.name, [() => { console.log('Dialogue ended!'); }]);
    //     }
    // }

    breedPokemon() {
        if (this.selectedPokemon1 === this.selectedPokemon2) {
            const dialogueBox = new DialogueBox(this, 'Cannot breed Pokémon with itself.');
            return;
        }
    
        // Check happiness and mood
        if (this.selectedPokemon1.happiness > 0.5 && (this.selectedPokemon1.mood === 'Happy' || this.selectedPokemon1.mood === 'Very Happy') &&
        this.selectedPokemon2.happiness > 0.5 && (this.selectedPokemon2.mood === 'Happy' || this.selectedPokemon2.mood === 'Very Happy')) {
        // Continue with the logic if both Pokémon are happy or very happy


            
            // Add your breeding logic here
            console.log(`Breeding ${this.selectedPokemon1.name} with ${this.selectedPokemon2.name}`);
    
            // Randomly create a new Pokémon
            const parentPokemon = Math.random() < 0.5 ? this.selectedPokemon1 : this.selectedPokemon2;
    
            // Find the original data of the selected parent Pokémon
            // const originalPokemonData = globals.originalPokemonData.find(pokemon => pokemon.key === parentPokemon.key);
                    
            // Create a new Pokémon by deep copying the original Pokémon data
            // const newPokemon = JSON.parse(JSON.stringify(originalPokemonData));

            const tackleMove = Object.values(globals.moves).find(move => move.name === 'Tackle'); // Get the move named 'Tackle'
            tackleMove.currentPP =  tackleMove.maxPP;

            // newPokemon = this.scene.get('BattleScene').setPokemonStats(newPokemon, 0);
            // newPokemon.moves.push(tackleMove);
            
            const newMonster = new Monster(parentPokemon.key, 1);
            newMonster.moves.push(tackleMove);
            globals.monsterManager.add(newMonster);
           

     
            // if (globals.partyPokemonData.length < 6) {
            //     globals.partyPokemonData.push(newPokemon); // Add to party
            //     const dialogueBox = new DialogueBox(this, `${newPokemon.name} has been added to your party!`, [
            //         () => {
            //             globals.sceneManager.launch('PokemonDetailsScene', { action: 'rename', pokemon: newPokemon, originScene:'PokemonDetailsScene' });
            //         }
            //     ]);
            // } else {
            //     // Send to PC
            //     globals.pc.push(newPokemon); // Assuming you have a PC array to store Pokémon
            //     const dialogueBox = new DialogueBox(this, `${newPokemon.name} has been sent to the PC!`, [
            //         () => {
            //             globals.sceneManager.launch('PokemonDetailsScene', { action: 'rename' });
            //         }
            //     ]);
            // }
            globals.dialogueBoxManager.createDialogueBox(this, `${newMonster.name} has been added to your party!`, [
                () => {
                    globals.sceneManager.launch('PokemonDetailsScene', { action: 'rename', pokemon: newMonster, originScene:'PokemonDetailsScene' });
                }
            ]);


    
        } else {
            const dialogueBox = new DialogueBox(this, 'Breeding conditions not met: Ensure both Pokémon are happy and have sufficient happiness.');
        }
    }
    
    
    createButton(x, y, height, width, text, callback) {
        const button = this.add.image(x, y, 'button_normal');
        button.setScale(0.5); // Adjust scale as needed
        button.setDisplaySize(height, width);
    
        const buttonText = this.add.text(x, y, text, { fontSize: '12px', fill: '#000' });
        buttonText.setOrigin(0.5);
    
        button.setInteractive()
            .on('pointerover', () => button.setTexture('button_hover'))
            .on('pointerout', () => button.setTexture('button_normal'))
            .on('pointerdown', () => {
                button.setTexture('button_selected');
                callback();
            })
            .on('pointerup', () => button.setTexture('button_hover'));
    
        return this.add.container(0, 0, [button, buttonText]);
    }
    closePartyWindow()
    {

        globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);

        globals.sceneManager.start('MapScene');
    // this.scene.start('MapScene');
    //     this.scene.stop();
        // if (this.onClose) this.onClose();

    }
    // onClose()
    // {
    //     this.scene.stop();

    //     this.onClose();
      
    // }

}