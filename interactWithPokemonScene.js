class InteractWithPokemonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InteractWithPokemonScene' });

        this.locked= false;


        this.happyness=null;
        this.hunger = null;
        this.mood = null;
        this.status = null;


    }

    preload()
    {

        // Load sprite sheets for each Pokémon
        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(pokemon.key + 'Face', `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/Faceset.png`, );

        });
        this.load.spritesheet('Rock', 'images/NinjaAdventure/FX/Particle/Rock.png', {frameWidth: 16, frameHeight: 16});


        //C:\xampp\htdocs\mygame2\images\NinjaAdventure\Ui\Emote
        // this.load.image('Surprised', 'images/NinjaAdventure/Ui/Emote/emote1.png');
        // this.load.image('Sour', 'images/NinjaAdventure/Ui/Emote/emote2.png' );
        // this.load.image('Hurt', 'images/NinjaAdventure/Ui/Emote/emote3.png' );
        // this.load.image('Mad', 'images/NinjaAdventure/Ui/Emote/emote4.png' );
        // this.load.image('Upset', 'images/NinjaAdventure/Ui/Emote/emote5.png' );
        // this.load.image('Very Happy', 'images/NinjaAdventure/Ui/Emote/emote6.png' );
        // this.load.image('Interested', 'images/NinjaAdventure/Ui/Emote/emote7.png' );
        // this.load.image('Winking', 'images/NinjaAdventure/Ui/Emote/emote8.png' );
        // this.load.image('Stern', 'images/NinjaAdventure/Ui/Emote/emote9.png' );
        // this.load.image('Frown', 'images/NinjaAdventure/Ui/Emote/emote10.png' );
        // this.load.image('Happy', 'images/NinjaAdventure/Ui/Emote/emote11.png' );
        // this.load.image('Silly', 'images/NinjaAdventure/Ui/Emote/emote12.png' );
        // this.load.image('Sad', 'images/NinjaAdventure/Ui/Emote/emote13.png' );
        // this.load.image('Weird', 'images/NinjaAdventure/Ui/Emote/emote14.png' );
        // this.load.image('Dead', 'images/NinjaAdventure/Ui/Emote/emote15.png' );
        // this.load.image('Very Sad', 'images/NinjaAdventure/Ui/Emote/emote16.png' );
        // this.load.image('Very Sad2', 'images/NinjaAdventure/Ui/Emote/emote17.png' );
        // this.load.image('Happy2', 'images/NinjaAdventure/Ui/Emote/emote18.png' );
        // this.load.image('Fangs', 'images/NinjaAdventure/Ui/Emote/emote19.png' );
        // this.load.image('...', 'images/NinjaAdventure/Ui/Emote/emote20.png' );
        // this.load.image('!', 'images/NinjaAdventure/Ui/Emote/emote21.png' );
        // this.load.image('Red!', 'images/NinjaAdventure/Ui/Emote/emote22.png' );
        // this.load.image('?', 'images/NinjaAdventure/Ui/Emote/emote23.png' );
        // this.load.image('Person', 'images/NinjaAdventure/Ui/Emote/emote24.png' );
        // this.load.image('Red?', 'images/NinjaAdventure/Ui/Emote/emote25.png' );
        // this.load.image('Broken Heart', 'images/NinjaAdventure/Ui/Emote/emote26.png' );
        // this.load.image('HeartEmoji', 'images/NinjaAdventure/Ui/Emote/emote27.png' );
        // this.load.image('ZZZ', 'images/NinjaAdventure/Ui/Emote/emote28.png' );
        // this.load.image('Star', 'images/NinjaAdventure/Ui/Emote/emote29.png' );
        // this.load.image('Cross', 'images/NinjaAdventure/Ui/Emote/emote30.png' );

        const emojiNames = ['Surprised', 'Sour', 'Hurt', 'Mad', 'Upset', 'Very Happy', 'Interested', 'Winking', 'Stern', 'Frown', 'Happy', 'Silly', 'Sad', 'Weird', 'Dead', 'Very Sad', 'Very Sad2', 'Happy2', 'Fangs', '...', '!', 'Red!', '?', 'Person', 'Red?', 'Broken Heart', 'HeartEmoji', 'ZZZ', 'Star', 'Cross'];
        emojiNames.forEach(name => this.load.image(name, `images/NinjaAdventure/Ui/Emote/emote${emojiNames.indexOf(name) + 1}.png`));
    


        this.load.image('background', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');
        this.load.image('button_normal', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_normal.png');
        this.load.image('button_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_hover.png');
        this.load.image('button_selected', 'images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_pressed.png');
        


        this.load.image('dialogBox', 'images/NinjaAdventure/HUD/Dialog/DialogueBoxSimple.png');


        this.load.spritesheet('heart', 'images/hearts2.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('panel', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched_square.png');


    }


    create() {
        // Create the initial menu
        // this.createMainMenu();


        // Create background
        // this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setDepth(0);
        // Create the heart
        this.heart = this.add.sprite(150, 75, 'heart').setScale(2);
        this.setHeart(); 

        // Create animated Pokémon sprite
        const pokemonSprite = this.add.sprite(150, this.cameras.main.height / 2, globals.characterPosition.followingPokemon.key);
        pokemonSprite.setScale(10);

        if (!this.anims.exists(globals.characterPosition.followingPokemon.key + 'Animate')) {
            this.anims.create({
                key: globals.characterPosition.followingPokemon.key + 'Animate',
                frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [0, 3, 7, 11] }),
                frameRate: 10,
                repeat: -1
            });
        }
        pokemonSprite.play(globals.characterPosition.followingPokemon.key + 'Animate');

        // Create action buttons using createButton
        this.createActionButtons();

        const panelX = 280;
        const panelY = 140;
        const panelWidth = 270;
        const panelHeight = 210
        // Add panel behind everything
        const panel = this.add.image(panelX, panelY, 'panel');
        panel.setDisplaySize(panelWidth, panelHeight);
        panel.setOrigin(0, 0);
       
        // Initialize stats display
        const happinessPercentage = Math.floor(globals.characterPosition.followingPokemon.happiness * 100);

        // this.happinessText.setText('Happiness: ' + happinessPercentage + '%');


        this.moodText = this.add.text(panelX + panelWidth / 2, panelY + 30, 'Mood: ' + globals.characterPosition.followingPokemon.mood, { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        this.happinessText = this.add.text(panelX + panelWidth / 2, panelY + 70, 'Happiness: ' + happinessPercentage + '%', { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        this.hungerText = this.add.text(panelX + panelWidth / 2, panelY + 110, 'Hunger: ' + globals.characterPosition.followingPokemon.hunger, { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        this.statusText = this.add.text(panelX + panelWidth / 2, panelY + 150, 'Status: ' + globals.characterPosition.followingPokemon.status, { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        this.bondText = this.add.text(panelX + panelWidth / 2, panelY + 190, 'Bond: ' + globals.characterPosition.followingPokemon.bond, { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
    
        this.emoji = this.add.image(this.cameras.main.width / 2 + 120, this.cameras.main.height / 2 - 160, globals.characterPosition.followingPokemon.mood).setScale(8);



    }

    createActionButtons() {
        const buttonWidth = 120;
        const buttonHeight = 40;

        // Create "Feed" button
        this.createButton(100, this.cameras.main.height - 100, buttonWidth, buttonHeight, 'Feed', () => this.feed());

        // Create "Groom" button
        this.createButton(300, this.cameras.main.height - 100, buttonWidth, buttonHeight, 'Groom', () => this.groom());

        // Create "Play" button
        this.createButton(500, this.cameras.main.height - 100, buttonWidth, buttonHeight, 'Play', () => this.playWithPokemon());

        this.createButton(300, this.cameras.main.height - 50, buttonWidth, buttonHeight, 'Exit', () => { 
            // this.scene.stop('InteractWithPokemonScene');
            // this.scene.start('MapScene');
            globals.sceneManager.start('MapScene');
            globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);
        });

    }

// Modified feed method

feed()

{
    this.scene.launch('ItemsScene', {
        originScene: 'InteractWithPokemonScene',
        pokemon: globals.characterPosition.followingPokemon,  // assuming you have this data
        action: 'feed',  // or 'useItem', depending on what action the player is taking
        
    });

}


useBerry(berry) {
    const currentPokemon = globals.characterPosition.followingPokemon;

    const berryItem = berry;
    
    if (berryItem && berryItem.quantity > 0 && (currentPokemon.hunger === 'hungry' || currentPokemon.currentHp < currentPokemon.maxHp)) {//currentPokemon.currentHp != currentPokemon.maxHp && currentPokemon.currentHp != 0
        berryItem.quantity -= 1;
        currentPokemon.mood = 'Happy';
        // Adjust healing and mood/happiness boost based on the Pokémon's type
        let hpHeal = 40; // Default HP heal
        let happinessBoost = 0.1; // Default happiness boost
        if (berryItem.name.includes(currentPokemon.type.toLowerCase())) {
            hpHeal = 60; // Example: fire-types get extra healing from fireberry
            happinessBoost = 0.15;
            currentPokemon.mood = 'Very Happy';
        }

        if (currentPokemon.hunger === 'hungry')
        {
            currentPokemon.hunger = 'full';
        }

        currentPokemon.currentHp += hpHeal;
        currentPokemon.happiness += happinessBoost;
        

        // Ensure HP does not exceed max
        if (currentPokemon.currentHp > currentPokemon.maxHp) {
            currentPokemon.currentHp = currentPokemon.maxHp;
        }

        this.setHeart();
        this.updateStats();

        const dialoguebox = new DialogueBox(this, currentPokemon.name + ' ate a ' + berryItem.name + ' and healed for ' + hpHeal + ' HP!');
    } 

    else if (currentPokemon.currentHp === 0) {
        const dialoguebox = new DialogueBox(this, currentPokemon.name + ' is knocked out and cannot eat.');
    }
    else if (currentPokemon.hunger === 'full' && currentPokemon.currentHp === currentPokemon.maxHp) {
        const dialoguebox = new DialogueBox(this, currentPokemon.name + ' is full and full health and can not eat.');
    } 
}



  



    groom() {
        console.log('Groom clicked');
        this.updateEmoji('Very Happy');
        globals.characterPosition.followingPokemon.happiness += 0.2; // Increase happiness
        globals.characterPosition.followingPokemon.mood = 'Very Happy'; // Update mood
        this.updateStats();
        const dialoguebox = new DialogueBox(this, 'You groomed ' + globals.characterPosition.followingPokemon.name + '. He really enjoyed that.');
    }

    playWithPokemon() {
        console.log('Play clicked');
        this.updateEmoji('Silly');
        globals.characterPosition.followingPokemon.happiness += 0.2; // Increase happiness
        globals.characterPosition.followingPokemon.mood = 'Excited'; // Update mood
        this.updateStats();
        const dialoguebox = new DialogueBox(this, 'You played with ' + globals.characterPosition.followingPokemon.name + '. He really enjoyed that.');

    }

    updateEmoji(emojiKey) {
     
        this.emoji.setTexture(emojiKey);
    }

    setHeart() {
        if (this.heart) {
            const healthPercentage = (globals.characterPosition.followingPokemon.currentHp / globals.characterPosition.followingPokemon.maxHp) * 100;
            if (healthPercentage >= 80) {
                this.heart.setFrame(0);
            } else if (healthPercentage >= 60) {
                this.heart.setFrame(1);
            } else if (healthPercentage >= 40) {
                this.heart.setFrame(2);
            } else if (healthPercentage >= 20) {
                this.heart.setFrame(3);
            } else {
                this.heart.setFrame(4);
            }

            globals.gameInstance.scene.getScene('MapScene').setHeart();
        }
    }

    updateStats() {

        if (globals.characterPosition.followingPokemon.happiness > 1) globals.characterPosition.followingPokemon.happiness = 1;



        this.updateMood();



        // Update happiness and mood text
       // Convert happiness to a percentage (0 to 100), floor it, and format to 2 decimal places
        const happinessPercentage = Math.floor(globals.characterPosition.followingPokemon.happiness * 100);

        this.happinessText.setText('Happiness: ' + happinessPercentage + '%');
        this.moodText.setText('Mood: ' + globals.characterPosition.followingPokemon.mood);
        this.hungerText.setText('Hunger: ' + globals.characterPosition.followingPokemon.hunger);
        this.statusText.setText('Status: ' + globals.characterPosition.followingPokemon.status);
        this.bondText.setText('Bond: ' + globals.characterPosition.followingPokemon.bond);
    }



    updateMood() {
        const currentPokemon = globals.characterPosition.followingPokemon;
        
        // Check status for mood
        if (currentPokemon.status && currentPokemon.status !== 'none') {
            currentPokemon.mood = 'Hurt';
        } 
        // Check happiness for mood
        else if (currentPokemon.happiness <= 0.5) {
            currentPokemon.mood = 'Sad';
        } else if (currentPokemon.happiness > 0.5 && currentPokemon.happiness <= 0.7) {
            currentPokemon.mood = 'Happy';
        } else if (currentPokemon.happiness > 0.7) {
            currentPokemon.mood = 'Very Happy';
        }
    
        // Check if the Pokémon dislikes the berry
        if (currentPokemon.hatesBerry) { // Assuming you have a hatesBerry flag or condition
            currentPokemon.mood = 'Sour';
        }
    
        // Update the emoji display
        this.updateEmoji(currentPokemon.mood);
        
        // // Update UI elements
        // this.happinessText.setText('Happiness: ' + currentPokemon.happiness);
        // this.moodText.setText('Mood: ' + currentPokemon.mood);
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




    createMainMenu() {
        // Clear any existing menu options
        this.clearMenu();
    
        // Add background for the menu



        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const rectWidth = 240;
        const rectHeight = 110;

        const rectX = (canvasWidth - rectWidth) / 2;
        //const rectY = (canvasHeight - rectHeight) / 2;
        const rectY = 50; //0;

        // const menuBackground = this.add.rectangle(rectX, rectY, rectWidth, rectHeight, 0x000000, 0.5);
        const menuBackground = this.add.rectangle(rectX, rectY, rectWidth, rectHeight, 0xffffff);
        menuBackground.setOrigin(0);
        menuBackground.setStrokeStyle(2, 0x000000); //black border
        
        // Add menu options

        // Calculate the position offsets relative to the menuBackground
        const offsetX = rectX + 20; // Adjust as needed
        const offsetY = rectY + 20; // Adjust as needed
        const textConfig = { fontFamily: 'Arial', fontSize: '40px', fill: '#000000' }; //ffffff
        // Add menu options inside the menuBackground

        const foodItem = globals.items.find(item => item.name === 'food');

        this.feedOption = this.add.text(offsetX, offsetY, 'Feed (' + foodItem.quantity + ')', textConfig);
        // this.exitOption = this.add.text(offsetX, offsetY + 30, 'Exit', textConfig);
        this.exitOption = this.add.text(rectX + rectWidth - 30, rectY, 'X', { fontFamily: 'Arial', fontSize: '40px', fill: '#000000' });

        
        
    
        // Make menu options interactive
        this.feedOption.setInteractive();
        this.exitOption.setInteractive();
    
        // Handle menu option clicks

       
        
        
        this.feedOption.on('pointerdown', () => {
            if (foodItem.quantity > 0 && globals.characterPosition.followingPokemon.currentHp != globals.characterPosition.followingPokemon.maxHp && globals.characterPosition.followingPokemon.currentHp != 0 && !this.locked)
            {
                console.log('Feed option clicked');
                this.feed();
                foodItem.quantity -= 1;
                this.feedOption.setText('Feed (' + foodItem.quantity + ')');
            }
            
        });
        

        
    
        this.exitOption.on('pointerdown', () => {
            console.log('Exit option clicked');
            // Add logic for handling the Exit option click here
            this.scene.get('MapScene').setKeyboardEnabled(true);
            this.scene.switch('MapScene');
        });



        function handleSpaceKey() {

            
            this.scene.start('MapScene');
            this.scene.get('MapScene').setKeyboardEnabled(true);

        }


        this.input.keyboard.on('keydown-SPACE', handleSpaceKey, this);
    }
    

    clearMenu() {
        // Clear existing menu options
        if (this.feedOption) {
            this.feedOption.destroy();
        }
        if (this.exitOption) {
            this.exitOption.destroy();
        }
    }






    feed2() {
        // Get a random Pokémon from your data
        //const pokemonKey = globals.characterPosition.followingPokemon;
        //console.log('Following Pokemon:' + pokemonKey);
        //const pokemon = globals.partyPokemonData.find(p => p.key === pokemonKey);
        //console.log('Following Pokemon:' + pokemon.name);
        // Add the sprite with a larger scale

        this.locked=true;
        const pokemonSprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, globals.characterPosition.followingPokemon.key);
        pokemonSprite.setScale(10); // Set the scale to 3 (adjust as needed)
    


        if (!this.anims.exists(globals.characterPosition.followingPokemon.key + 'Animate')) 
        {
            this.anims.create({
                key: globals.characterPosition.followingPokemon.key + 'Animate',
                frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [0, 3, 7, 11] }), // Adjust start and end frames as needed
                frameRate: 10, // Adjust frame rate as needed
                repeat: 5 // Repeat indefinitely
            });
        }
    


        // Play the animation
        pokemonSprite.play(globals.characterPosition.followingPokemon.key + 'Animate');

        const food = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Rock');
        food.setScale(4);


        if (!this.anims.exists('rock')) 
        {
            this.anims.create({
                key: 'rock',
                frames: this.anims.generateFrameNumbers('Rock', { start: 0, end: 3 }), // Adjust start and end frames as needed
                frameRate: 10, // Adjust frame rate as needed
                repeat: -1 // Repeat indefinitely
            });
        }
        

        food.play('rock');


        // pokemonSprite.on('animationcomplete', () => {
        //     pokemon.currentHp+=40;
        //     // Check if the current HP exceeds the maximum HP
        //     if (pokemon.currentHp > pokemon.maxHp) {
        //         pokemon.currentHp = pokemon.maxHp; // Set the current HP to be equal to the maximum HP
        //     }
        //     pokemonSprite.destroy();
        //     food.destroy();
        
        // })
        pokemonSprite.on('animationcomplete', () => {
            globals.characterPosition.followingPokemon.currentHp += 20;
            // Check if the current HP exceeds the maximum HP
            if (globals.characterPosition.followingPokemon.currentHp > globals.characterPosition.followingPokemon.maxHp) {
                globals.characterPosition.followingPokemon.currentHp = globals.characterPosition.followingPokemon.maxHp; // Set the current HP to be equal to the maximum HP
            }
            this.scene.get('MapScene').setHeart();
            console.log("Pokemon's current HP:", globals.characterPosition.followingPokemon.currentHp); // Ensure the HP is updated
            pokemonSprite.destroy();
            food.destroy();
            this.locked=false;
        });

        // Set a timer to remove the sprite after a few seconds
        // this.time.delayedCall(3000, () => {
        //     pokemonSprite.destroy(); // Remove the sprite after 3000 milliseconds (3 seconds)
        // });
    }


}