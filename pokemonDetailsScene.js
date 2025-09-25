class PokemonDetailsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PokemonDetailsScene' });
        this.enterKeyListener = null;
    }

    preload()
    {
        // Load sprite sheets for each Pokémon
        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        });
        
        this.load.image('menubackground', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu4.png');
        this.load.image('menubackground2', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');

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

    create(data)
    {
        console.log('running create pokemondetailsscene');
        this.scene.bringToTop('PokemonDetailsScene');

        this.pokemon = data.pokemon;
       
        this.originScene = data.originScene;
        this.onClose = data.onClose;
        this.action = data.action;
        this.move = data.move;
        this.from = data.from;
        
        this.displayNewPokemonDetails(this.pokemon);
        console.log('origin scene in pokemon details scene is ', this.originScene);
    }

displayNewPokemonDetails(pokemon) {
    console.log('displaynewpokemondetails');
    // this.clearMenu();
    // this.cleanupPokedex(true);


    // if (!this.pokedexBackground) {
    this.pokedexBackground = this.add.image(0, 0, 'menubackground2').setOrigin(0, 0);
    this.pokedexBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.pokedexBackground.setDepth(0);
    // }


    this.pokemonSprites = [];
    this.pokemonTexts = [];

    const textConfig = { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' };
    const xOffset = 50;
    const yOffset = 50;

    // Display Pokemon name and other details as before
    // ...

    // Display Pokémon name
    const nameColor = globals.pokemonTypes[pokemon.type]; // Default to white if type color is not found
    const nameBackground = this.add.rectangle(xOffset - 10, yOffset - 10, 200, 35, nameColor);
    nameBackground.setOrigin(0);
    this.pokemonNameText = this.add.text(xOffset, yOffset, `Name: ${pokemon.name}`, textConfig);
    this.pokemonTexts.push(nameBackground);
    this.pokemonTexts.push(this.pokemonNameText);



    const routes = globals.getPokemonRoute(pokemon.name);


    
    console.log(routes);
    const text7 = this.add.text(xOffset + 200, yOffset, routes);
    this.pokemonTexts.push(text7);

    // Display Pokémon type
    const text2 = this.add.text(xOffset, yOffset + 30, `Type: ${pokemon.type}`, textConfig);
    this.pokemonTexts.push(text2);

    // Display Pokémon stats
    const text3 = this.add.text(xOffset, yOffset + 60, `HP: ${pokemon.currentHp}/${pokemon.maxHp}`, textConfig);
    this.pokemonTexts.push(text3);
    const text4 = this.add.text(xOffset, yOffset + 90, `Attack: ${pokemon.attack}`, textConfig);
    this.pokemonTexts.push(text4);
    const text5 = this.add.text(xOffset, yOffset + 120, `Defense: ${pokemon.defense}`, textConfig);
    this.pokemonTexts.push(text5);
    const text6 = this.add.text(xOffset, yOffset + 150, `Speed: ${pokemon.speed}`, textConfig);
    this.pokemonTexts.push(text6);

    if (this.originScene === 'PartyScene' || this.originScene === 'ItemsScene' || this.originScene === 'BattleScene' || this.originScene === 'MoveListScene' || this.action === 'Learn') {
    const text8 = this.add.text(xOffset, yOffset + 180, `Level: ${pokemon.level}`, textConfig);
    this.pokemonTexts.push(text8);
    }





    // Display Pokemon Sprite
    const pokemonSprite = this.add.sprite(450, 100, pokemon.key);
    pokemonSprite.setScale(6);
    // Animation setup as before
    // ...
    if (!this.anims.exists(pokemon.key)) {
        this.anims.create({
            key: pokemon.key,
            frames: this.anims.generateFrameNumbers(pokemon.key, { frames: [0, 4, 8, 12] }),
            frameRate: 10,
            repeat: -1 // Repeat the animation indefinitely
        });
    }
    pokemonSprite.anims.play(pokemon.key, true);

    this.pokemonSprites.push(pokemonSprite);


    // Create moves list container
    const movesContainerWidth = 200;
    const movesContainerHeight = 170;
    const movesContainerX = xOffset;
    const movesContainerY = yOffset + 200;

    this.movesContainer = this.add.container(movesContainerX, movesContainerY);
    this.movesContainer.setSize(movesContainerWidth, movesContainerHeight);

    // Add moves to the container
    // const moves = globals.pokemonMoves[pokemon.key];
    console.log(this.originScene);
    let moves = null;
    if (this.originScene === 'MenuScene' || this.originScene === 'PokedexScene')
    {
        moves = globals.pokemonMoves[pokemon.key];
    }
    else
    {
        moves = pokemon.moves;

    }

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const button = this.createButton(90, i * 60 + 30, movesContainerWidth - 20, 50, move.name, () => this.displayMoveDetails(move));

        // const moveButton = this.add.text(0, i * 40, move.name, textConfig)
        //     .setInteractive()
        //     .on('pointerdown', () => this.displayMoveDetails(move));
        this.movesContainer.add(button);
    }




    // Create and add slider for moves list
    this.moveSlider = new Slider(this, this.movesContainer);



    // Create move details box
    this.moveDetailsBox = this.add.container(movesContainerX + movesContainerWidth + 20, movesContainerY);
    this.moveDetailsBox.setSize(280, 150);


    this.detailsBackground = this.add.rectangle(
        280 / 2,  // Center the rectangle horizontally
        150 / 2, // Center the rectangle vertically
        280,
        150,
        0x000000,
        0.5
    );




    this.moveDetailsBox.add(this.detailsBackground);

    // Add initial text to the move details box
    this.moveDetailsText = this.add.text(10, 10, 'Select a move to see\ndetails', textConfig);
    this.moveDetailsBox.add(this.moveDetailsText);

    // // Add an event listener for the Escape key
    // this.escapeKeyListener = (event) => {
    //     if (event.key === 'Escape') {
    //         this.exitDetailsScene();
    //     }
    // };
    // document.addEventListener('keydown', this.escapeKeyListener);



    this.backButton = this.add.text(xOffset, this.cameras.main.height - 50, 'Back', textConfig)
    .setInteractive()
    .on('pointerdown', () => {
        // this.scene.stop('PokemonDetailsScene');
    this.exitDetailsScene();
        // if (this.onClose) this.onClose();
        // this.game.scene.getScene('MapScene').setKeyboardEnabled(true);
        // globals.sceneManager.transitionTo('MapScene');
    });


    if (this.action === 'Learn') {
        this.newMoveText = this.add.text(200, 190, 
            `Select a new move to replace \nwith ` + this.move.name, 
            { fontFamily: 'Arial', fontSize: '24px', fill: '#ff0000' }  // Red color
        );
    }

    console.log('action: ' + this.action);
    console.log('originscene: ' + this.originScene);

    if (this.action === 'caught' || this.action === 'rename')
    {
        console.log('running renamepokemonscene');
        // Launching the scene when a Pokémon is caught
        // this.scene.launch('RenamePokemonScene', { pokemon: this.pokemon });
        // this.scene.bringToTop('RenamePokemonScene');
        globals.sceneManager.launch('RenamePokemonScene', { pokemon: this.pokemon, originScene: this.scene.key, from: this.originScene, onClose: this.onClose});
    }
    if (this.action === 'renamed')
        {
            console.log('running onclose');
            if (this.onClose) this.onClose();
            // globals.sceneManager.queueTransition('MapScene', {onClose: this.onClose}, false, true);
            // Launching the scene when a Pokémon is caught
            // this.scene.launch('RenamePokemonScene', { pokemon: this.pokemon });
            // this.scene.bringToTop('RenamePokemonScene');
            console.log('origin scene: ', this.originScene);
            if (globals.sceneManager.isTransitioning)
            {
                console.log('still transitioning...');
            }
            // globals.sceneManager.start('MapScene', );
        }
        

}

turnOffListener()
{
      // Remove the Escape key listener
      if (this.escapeKeyListener) {
        document.removeEventListener('keydown', this.escapeKeyListener);
        this.escapeKeyListener = null; // Clear the reference
        console.log('turned off escape listener');
    }
}


// exitDetailsScene()
// {
//     this.turnOffListener()
//     console.log('origin scene: ', this.originScene);
//     if (this.action === 'Learn') { 
//         if (this.originScene === 'BattleScene')
//         {
//             console.log('resuming ' + this.originScene);
//             // this.scene.resume('BattleScene');
//             // this.scene.bringToTop('BattleScene');
//             console.log('running onclose for battlescene');
//             this.onClose();
//             // this.scene.stop('PokemonDetailsScene');

//         }
         
//         else
//         {
//             console.log('resuming origin scene from pokemondetailsscene');
//             this.scene.stop('PokemonDetailsScene');
//             this.scene.resume(this.originScene);
//             this.scene.get('MapScene').setKeyboardEnabled(true);
//             this.scene.start('MapScene');
//         }

//     }
//     if (this.originScene === 'PartyScene')
//     {
//         this.scene.stop('PokemonDetailsScene');
//         console.log('launching party again');
//         this.scene.launch('PartyScene');
//         this.scene.get('PartyScene').turnOnListener();
//     }  
//     else

//     {
        
//         console.log('resuming ' + this.originScene);
//         // this.scene.stop('PokemonDetailsScene');
//         // this.scene.resume(this.originScene);
//         globals.sceneManager.transitionTo(this.originScene);
//         this.scene.stop('PokemonDetailsScene');

//         if (this.onClose) 
//             {
//                 console.log('running on close');
//                 this.onClose();
//             }

//     }

// }

exitDetailsScene() {
    this.turnOffListener();
    console.log('origin scene: ', this.originScene);
    console.log('action: ', this.action);

    switch (this.originScene) {
        case 'BattleScene':
            if (this.action === 'Learn') {
                console.log('resuming ' + this.originScene);
                console.log('running onclose for battlescene');
                // this.scene.stop('PokemonDetailsScene');
                this.onClose();
            }
            else if (this.action === 'caught' || this.action === 'renamed')
            {
                // globals.sceneManager.transitionTo('MapScene');
                // this.scene.stop('PokemonDetailsScene');
                if (this.onClose)
                {
                    console.log('running onclose');
                    this.onClose();
                }
                else
                {   console.log('no onclose in pokemondetails so transitioning to mapscene');
                    globals.sceneManager.transitionTo('MapScene');

                }
                console.log('exiting details scene??');


            }
            // else if (this.action === 'renamed')
            // {

            // }
            break;

        case 'PartyScene':
            console.log('launching party again');
            globals.sceneManager.transitionTo('PartyScene');
            // this.scene.stop('PokemonDetailsScene');
            // this.scene.get('PartyScene').turnOnListener();
            break;

        case 'MoveListScene':
            console.log('transitioning to party scene from movelistscene...')
            globals.sceneManager.transitionTo('PartyScene', {from: this.from, originScene: this.originScene, action: 'Learn', selectedMove: this.move});
            break;
        default:
            if (this.action === 'Learn') {
                console.log('resuming origin scene from pokemondetailsscene');
                globals.sceneManager.transitionTo(this.originScene);
                // this.scene.stop('PokemonDetailsScene');
                this.scene.get('MapScene').setKeyboardEnabled(true);
                globals.sceneManager.transitionTo('MapScene');
            } else {
                console.log('resuming ' + this.originScene);
                globals.sceneManager.transitionTo(this.originScene);
                // this.scene.stop('PokemonDetailsScene');
                if (this.onClose) {
                    console.log('running on close');
                    this.onClose();
                }
            }
            break;
    }
}


renamePokemonName(name)
{
    this.pokemonNameText.text = name;
}

displayMoveDetails(move) {


    // Clear previous details text
    if (this.moveDetailsText) {
        this.moveDetailsText.destroy();
    }

    // Create new details text
    const detailsConfig = { fontFamily: 'Arial', fontSize: '18px', fill: '#ffffff' };
    // const details = [
    //     `Name: ${move.name}`,
    //     `Type: ${move.type}`,
    //     `Damage: ${move.damage}`,
    //     `Speed: ${move.speed}`,
    //     `PP: ${move.maxPP}`,
    //     `Level Learned: ${move.level}`,
    //     //`Level Learned: ${move.level}`
    // ];

    const details = [
        `Name: ${move.name}`,
        `Type: ${move.type}`,
        `Damage: ${move.damage}`,
        `Speed: ${move.speed}`
    ];
    
    if (this.originScene === 'MenuScene') {
        details.push(`PP: ${move.maxPP}`);
        details.push(`Level Learned: ${move.level}`);
    } else {
        details.push(`PP: ${move.currentPP}/${move.maxPP}`);
    }

    this.moveDetailsText = this.add.text(10, 10, details.join('\n'), detailsConfig);
    this.moveDetailsBox.add(this.moveDetailsText);
    if (this.action === 'Learn')
    {
        const button = this.createButton(220, 120, 100, 50,  'Learn', () => this.learnNewMove(move));
        this.moveDetailsBox.add(button);
    }
    // const button = this.createButton(220, 120, 100, 50, 'Learn', this.learnNewMove.bind(this, move));

    



}


learnNewMove(move)
{






    console.log('replacing move ' + this.move.name + ' with ' + move.name + ' for ' + this.pokemon.name);
    // this.scene.get('BattleScene').replaceMove(move, this.move, this.pokemon);
   


    const isSpecialMove = this.move.name.includes('Beam');

    this.move.currentPP = this.move.maxPP;
    if (isSpecialMove)
    {
        console.log('setting move beam count');
        this.move.count = 2
    }
    else
    {
        this.move.count = undefined;
    }
    
    const newMove = new Move({ data: this.move });

    const index = this.pokemon.moves.indexOf(move);
    if (index !== -1) {
        this.pokemon.moves.splice(index, 1, newMove); //this.move
        console.log('Move replaced successfully:', this.pokemon.moves);

    }
    else
    {
        console.log('Move not found to replace:', move.name);

    }
 

    console.log('origin scene is ' + this.originScene)
    if (this.originScene === 'BattleScene')
    {
        
        console.log('about to run this on close');
        // this.scene.stop('PokemonDetailsScene');
        this.onClose();
       
    }
  
    else
    {
        console.log('running map scene and closing details scene');
        // this.scene.stop('PokemonDetailsScene');
        globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);
        // this.scene.start('MapScene');
        globals.sceneManager.start('MapScene');
    }
    
   

   

}



createButton(x, y, width, height, text, callbacks) {
    const button = this.add.image(0, 0, 'button_normal');
    button.setDisplaySize(width, height);

    const buttonText = this.add.text(0, 0, text, { fontSize: '12px', fill: '#000' });
    buttonText.setOrigin(0.5);

   
    button.setInteractive()
        .on('pointerover', () => {
            button.setTexture('button_hover');
            // this.isPointerOverMask = true;
        })
        .on('pointerout', () => {
            button.setTexture('button_normal');
            // this.isPointerOverMask = false;
        })
        .on('pointerdown', () => {
            button.setTexture('button_selected');
            if (Array.isArray(callbacks)) {
                callbacks.forEach(callback => callback());
            } else if (typeof callbacks === 'function') {
                callbacks();
            }
        })
        .on('pointerup', () => button.setTexture('button_hover'));

    const container = this.add.container(x, y, [button, buttonText]);
    container.setSize(width, height);
    // container.setOrigin(0.5, 0.5);

    return container;
}


shutdown() {
    console.log('shutdown being triggered');
    this.pokemonSprites.forEach(sprite => sprite.destroy());
    this.pokemonTexts.forEach(text => text.destroy());
    if (this.moveSlider) this.moveSlider.cleanup();
    if (this.movesContainer) this.movesContainer.destroy();
    if (this.moveDetailsBox) this.moveDetailsBox.destroy();
    if (this.pokedexBackground) {this.pokedexBackground.destroy(), this.pokedexBackground = null};
    // ... clean up any other created objects
}
// Inside the PokemonDetailsScene when the scene closes
onClose() {
  
    console.log('running onclose');
    // Call the passed onClose callback (which is from BattleScene)
    if (this.onClose) {
        console.log('Executing onClose callback');
        
        this.onClose();  // Execute the callback passed in the data
        // this.scene.stop('PokemonDetailsScene');
    } else {
        console.log('onClose callback is not found');
    }

    // Stop the scene after the callback runs
    console.log('Stopping PokemonDetailsScene');

    // Close the current scene
    this.scene.destroy('PokemonDetailsScene');
}


}