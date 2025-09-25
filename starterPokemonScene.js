
class StarterPokemonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StarterPokemonScene' });






    }

    preload() {
        // Load sprite sheets for each Pokémon
        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        });
    }

    // create() {
    //     // Display starter Pokémon options
    //     const startY = 50;
    //     const spacingY = 70;
    //     const textStyle = { fontFamily: 'Arial', fontSize: '16px', fill: '#ffffff' };






    //     globals.starterPokemon.forEach((pokemon, index) => {
    //         const yPos = startY + index * spacingY;

    //         // Create sprite for the Pokémon
    //         const sprite = this.add.sprite(200, yPos, pokemon.key);
    //         sprite.setScale(3); // Scale up the sprite
    //         sprite.setInteractive();

    //         // Animation for the sprite
    //         this.anims.create({
    //             key: pokemon.key + '_anim',
    //             frames: this.anims.generateFrameNumbers(pokemon.key, { start: 0, end: 7 }), // Adjust end frame number if needed
    //             frameRate: 10,
    //             repeat: -1
    //         });
    //         sprite.anims.play(pokemon.key + '_anim');

    //         // Display Pokémon name and type
    //         const text = `${pokemon.name} (${pokemon.type})`;
    //         const textObject = this.add.text(300, yPos, text, textStyle);

    //         // Handle selection when the player clicks on the Pokémon
    //         sprite.on('pointerdown', () => this.selectStarter(pokemon));
    //     });
    // }
    // create() {
    //     // Display starter Pokémon options
    //     const startY = 50;
    //     const spacingY = 70;
    //     const textStyle = { fontFamily: 'Arial', fontSize: '16px', fill: '#ffffff' };
    
    //     // Add text for selecting starter Pokemon
    //     this.add.text(this.cameras.main.centerX, 20, "Select Starter Pokemon", { ...textStyle, fontSize: '24px', align: 'center' }).setOrigin(0.5);
    
    //     globals.starterPokemon.forEach((pokemon, index) => {
    //         const yPos = startY + index * spacingY;
    
    //         // Create sprite for the Pokémon
    //         const sprite = this.add.sprite(200, yPos, pokemon.key);
    //         sprite.setScale(3); // Scale up the sprite
    //         sprite.setInteractive();
    
    //         // Animation for the sprite
    //         this.anims.create({
    //             key: pokemon.key + '_anim',
    //             frames: this.anims.generateFrameNumbers(pokemon.key, { start: 0, end: 7 }), // Adjust end frame number if needed
    //             frameRate: 10,
    //             repeat: -1
    //         });
    //         sprite.anims.play(pokemon.key + '_anim');
    
    //         // Display Pokémon name and type
    //         const text = `${pokemon.name} (${pokemon.type})`;
    //         const textObject = this.add.text(300, yPos, text, textStyle);
    
    //         // Handle selection when the player clicks on the Pokémon
    //         sprite.on('pointerdown', () => this.selectStarter(pokemon));
    //     });
    // }
    create() {
        // Display starter Pokémon options
        const startX = 200; // X position for the leftmost sprite
        const startY = 200; // Y position for all sprites
        const spacingX = 100; // Spacing between sprites
        const textStyle = { fontFamily: 'Arial', fontSize: '16px', fill: '#ff0000', align: 'center' };
    
        // Add text for selecting starter Pokemon
        this.add.text(this.cameras.main.centerX, 100, "Select Starter Pokemon", { ...textStyle, fontSize: '32px', align: 'center' }).setOrigin(0.5);
    
        globals.starterPokemon.forEach((pokemon, index) => {
            const xPos = startX + index * spacingX;
    
            // Create sprite for the Pokémon
            const sprite = this.add.sprite(xPos, startY, pokemon.key);
            sprite.setScale(3); // Scale up the sprite
            sprite.setInteractive();
    
            // Animation for the sprite
            this.anims.create({
                key: pokemon.key + '_anim',
                frames: this.anims.generateFrameNumbers(pokemon.key, { start: 0, end: 7 }), // Adjust end frame number if needed
                frameRate: 10,
                repeat: -1
            });
            sprite.anims.play(pokemon.key + '_anim');
    
            // Display Pokémon name and type
            const text = `${pokemon.name}\n(${pokemon.type})`;
            const textObject = this.add.text(xPos, startY + sprite.height * 2 + 20, text, textStyle).setOrigin(0.5);
    
            // Create a graphics object for the background
            const background = this.add.graphics();
            const padding = 5; // Adjust as needed
            const rectWidth = textObject.width + padding * 2;
            const rectHeight = textObject.height + padding * 2;
            const rectX = xPos - rectWidth / 2;
            const rectY = startY + sprite.height * 2 - rectHeight / 2 + 20;
            
            // Draw the background rectangle with 80% opacity
            background.fillStyle(0x000000, 0.8);
            background.fillRect(rectX, rectY, rectWidth, rectHeight);
            background.setDepth(-1); // Ensure the background is behind the text



            // Handle selection when the player clicks on the Pokémon
            sprite.on('pointerdown', () => this.selectStarter(pokemon));
        });
    }
    
    

    selectStarter(selectedPokemon) {
        // Initialize the selected Pokémon as the player's starter Pokémon
        //globals.playerStarterPokemon = selectedPokemon;

        selectedPokemon=this.scene.get('BattleScene').setPokemonStats(selectedPokemon, 4); 


        // Transition to the next scene or perform other actions
        globals.partyPokemonData.push(selectedPokemon);
        console.log('Selected Pokemon =' + selectedPokemon.name);
        console.log('Selected Pokemon (globals) =' + globals.partyPokemonData[0].name);
        const PokemonData = [];
        PokemonData.push(selectedPokemon);
        //this.scene.get('BattleScene').setPokemonData(PokemonData);
        globals.characterPosition.followingPokemon=selectedPokemon;
        this.scene.get('MapScene').switchFollowingPokemon(selectedPokemon);
        this.scene.get('BattleScene').setPokemonData(globals.partyPokemonData);
        this.scene.get('MapScene').setKeyboardEnabled(true);
        this.scene.switch('MapScene');
    }
}


