

class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
        this.collision2D = []; // Declare collision2D as a property
        this.encounter2D = []; // Declare encounter2D as a property
        this.island2D = []; // Declare encounter2D as a property
        this.fishingSurfing2D = []; // Declare encounter2D as a property
        this.keyboardEnabled = true; // Flag to control keyboard input
        this.playerTileX = 0; // Initialize with default value
        this.playerTileY = 0; // Initialize with default value
        this.pokemonSprite = null;
        this.dialogueBoxManager=null;
        this.newDialogueBox = null;
        // this.steps = 0;
        this.dialogueBoxCooldown = false;
        this.dialogueBoxCooldownTime = 300; // milliseconds

        this.buttonCooldown = false;
        this.buttonCooldownTime = 300;

        this.locked2=false;


        //dialogueboxvariables
        this.locked = false
        this.kbEnabled = false;
        this.dialogueBox=null;
        this.text = null;
        this.currentPage = 0;
        this.endString = null;
        this.lines=[];
        this.completeIterations = 0;
        this.lineLength = 50;
        this.totalLength = 0; //message.length
        this.completeIterations = Math.floor(this.totalLength / this.lineLength) + 1;
        this.remainder = this.totalLength % this.lineLength;
       
        this.trainer=null;
        this.trainerSprite=null;
        

        // //starterpokemonvariables
        // this.starterPokemon = [
        //     { key: globals.starterPokemon[0].key, x: 72, y: 56, sprite: null, pokemon:globals.starterPokemon[0]  }, 
        //     { key: globals.starterPokemon[1].key, x: 75, y: 56, sprite: null, pokemon:globals.starterPokemon[1] }, 
        //     { key: globals.starterPokemon[2].key, x: 74, y: 58, sprite: null, pokemon:globals.starterPokemon[2] }];


              //starterpokemonvariables
        this.starterPokemon = [
            { key: globals.starterPokemon[0], x: 72, y: 56, sprite: null, pokemon: new Monster(globals.starterPokemon[0], 5)  }, 
            { key: globals.starterPokemon[1], x: 75, y: 56, sprite: null, pokemon: new Monster(globals.starterPokemon[1], 5)  }, 
            { key: globals.starterPokemon[2], x: 74, y: 58, sprite: null, pokemon: new Monster(globals.starterPokemon[2], 5)  }];





        ///////tooltips////
        this.tooltipRoute = new Array(7).fill(false);




        //bicycle
        this.currentFrame = null;


       


        this.quest = null;

        this.sprite = null;
    

        this.trees = [];


        this.isInShop = false;


        this.computers = {
            pc1: {
                x: 12,
                y: 186,
                
            },
            pc2: {
                x: 53,
                y: 185,
                
            }
        }
        //(12, 186)

       

        // this.virtualJoystick = null;
        //////////////////////

        this.joystickCenterX = 300;
        this.joystickCenterY = 250;
        this.joystickRadius = 10;
        this.pointerDown = false;
        this.directionX = 0;
        this.directionY = 0;
        this.joystick = null;




        this.pointToMoveEnabled=true;




        //virtual keyboard

         // Declare your variables here
         this.startButtonPressed = false;
         this.selectButtonPressed = false;
         this.aButtonPressed = false;
         this.bButtonPressed = false;
         this.upButtonPressed = false;
         this.downButtonPressed = false;
         this.leftButtonPressed = false;
         this.rightButtonPressed = false;


         this.bondLevels = ['unfriendly', 'friendly', 'very friendly', 'best buddy', 'loyal companion'];



       // this.mainMenuOpened = false; // Flag to track if MainMenuScene has been opened
    }

    init(data) {
        // Initialize player's position from globals.characterPosition
        this.playerTileX = globals.characterPosition.x;
        this.playerTileY = globals.characterPosition.y;
    }

   
    preload() {
        this.load.image('map', 'images/newmap15.png');
        this.load.spritesheet('male', 'images/player4.png', { frameWidth: 160, frameHeight: 200 });
        this.load.spritesheet('female', 'images/femaleplayer.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('female2', 'images/femaleplayer2new.png', { frameWidth: 56.25, frameHeight: 56.25 });
        
        this.load.spritesheet('red', 'images/red3.png', { frameWidth: 25.75, frameHeight: 29.75 }); //bike
        this.load.spritesheet('fishing', 'images/fishing.png', { frameWidth: 40, frameHeight: 40 });

       
        this.load.image('collision', 'images/collision.png'); // Load the collision image
        


        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(pokemon.key + 'Faceset', `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/Faceset.png`);
        });

        
        for (const pokemonType in globals.pokemonTypeColor) {
            const color = globals.pokemonTypeColor[pokemonType];
            const key = pokemonType + 'explosion';
            const imagePath = `images/Orb/${color}explosion.png`;
            const frameWidth = 256;
            const frameHeight = 256;
            this.load.spritesheet(color + 'orb', imagePath, { frameWidth, frameHeight, color });

        }
        
        


        this.load.spritesheet('HeartHealth', 'images/hearts2.png', { frameWidth: 64, frameHeight: 64 });



        this.load.spritesheet('trainer1', 'images/trainer.png', { frameWidth: 32, frameHeight: 48 });

        this.load.spritesheet('eggboy', 'images/NinjaAdventure/Actor/Characters/EggBoy/SpriteSheet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('eggboyFaceset', 'images/NinjaAdventure/Actor/Characters/EggBoy/Faceset.png');





        // Loop through NPCs and load spritesheet and faceset
        Object.keys(globals.npcIdle).forEach(npcKey => {
            const npc = globals.npcIdle[npcKey]; // Get the NPC object
            const spriteSheetPath = `images/NinjaAdventure/Actor/Characters/${npc.path}/SpriteSheet.png`;
            const facesetPath = `images/NinjaAdventure/Actor/Characters/${npc.path}/Faceset.png`;

            // Load spritesheet
            this.load.spritesheet(npc.key, spriteSheetPath, { frameWidth: 16, frameHeight: 16 });

            // Load faceset image
            this.load.image(npc.key + 'Faceset', facesetPath);
        });



        this.load.spritesheet('quest', 'images/NinjaAdventure/HUD/Dialog/DialogInfo.png', { frameWidth: 20, frameHeight: 16 });

        
        this.load.spritesheet('trees', 'images/trees/tree001.png', {frameWidth:16, frameHeight: 32});

        this.load.spritesheet('chests', 'images/NinjaAdventure/Items/Treasure/BigTreasureChest.png', {frameWidth:16, frameHeight: 14});
        
        this.load.image('dialogBox', 'images/NinjaAdventure/HUD/Dialog/DialogueBoxSimple.png');


        globals.characterList.forEach(character => {
            this.load.spritesheet(character, `images/NinjaAdventure/Actor/Characters/${character}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(character + 'Faceset', `images/NinjaAdventure/Actor/Characters/${character}/Faceset.png`);

        });


    }

    create(data) {
      
    
        // if (!restarted)
        // throw new Error("Intentional crash in create method");
        this.dialogueBoxManager=globals.dialogueBoxManager;
        this.dialogueBoxManager.cleanUpAll();
        // console.error('Error object:', error);

        console.log('setting keys to false');
        this.startButtonPressed = false;
        this.selectButtonPressed = false;
        this.aButtonPressed = false;
        this.bButtonPressed = false;
        this.upButtonPressed = false;
        this.downButtonPressed = false;
        this.leftButtonPressed = false;
        this.rightButtonPressed = false;




        
            this.stepCounter = 0;
            this.statusSteps = 10; // Total number of status effect applications
        
            globals.partyPokemonData.forEach(pokemon => {
                if (pokemon.status === 'Burn' || pokemon.status === 'Poison') {
                    // console.log('setting steps in create');
                    pokemon.remainingStatusSteps = this.statusSteps;
                }
            });
        
        


            // console.log('party pokemon data length: ' + globals.partyPokemonData.length);

        if (globals.partyPokemonData.length != 0 && globals.partyPokemonData && globals.partyPokemonData.every(pokemon => pokemon.currentHp === 0))
        {
            if(globals.characterPosition.spawn === 'home')
            {
                this.setCharacterPosition(65, 45);
            }
            else{
                this.setCharacterPosition(150, 117);
            }

            globals.monsterManager.healPartyMonsters();

        }
        


        const map = this.add.image(0, 0, 'map');
        this.textures.get('map').setFilter(Phaser.Textures.FilterMode.NEAREST); // Ensure pixel sharpness for this texture


        map.setOrigin(0, 0);
        //map.setScale(3);


        // Import the collision and encounter data
        const collisionData = collision; // Your 1D collision array from collision.js
        const encounterData = encounter; // Your 1D encounter array from encounter.js
        const islandData = island; // Your 1D encounter array from encounter.js
        const fishingSurfingData = fishingSurfing; // Your 1D encounter array from encounter.js


        // Convert the 1D array to a 2D array with 200 rows and 200 columns
        const rows = 200;
        const cols = 400;


        for (let i = 0; i < rows; i++) {
            const row = collisionData.slice(i * cols, (i + 1) * cols);
            this.collision2D.push(row);
        }

        for (let i = 0; i < rows; i++) {
            const row = encounterData.slice(i * cols, (i + 1) * cols);
            this.encounter2D.push(row);
        }

        for (let i = 0; i < rows; i++) {
            const row = islandData.slice(i * cols, (i + 1) * cols);
            this.island2D.push(row);
        }

        for (let i = 0; i < rows; i++) {
            const row = fishingSurfingData.slice(i * cols, (i + 1) * cols);
            this.fishingSurfing2D.push(row);
        }

        // playerTileX = globals.characterPosition.x;
        // playerTileY = globals.characterPosition.y;

        //globals.isRunning = false;
        // if (globals.player.male.active)
        // {
        //     console.log('setting male player in create');
        //     // this.setMalePlayer();
        //     this.setPlayer('male');
          


        // }
        // else if (globals.player.female.active)
        // {
        //     console.log('setting female player in create');
        //     // this.setFemalePlayer();
        //     this.setPlayer('female');
        // }
        // else if (globals.player.female2.active)
        // {
        //     console.log('setting female2 player in create');
        //     // this.setFemalePlayer2();
        //     this.setPlayer('female2');
        // }
        // else if (globals.player.red.active)
        // {
        //     console.log('setting red player in create');
        //     // this.setBike();
        //     globals.isRunning = true;
        //     this.setPlayer('red');
        // }
        // else {
        //     console.log('setting ' + globals.selectedCharacter + ' player in create');

        //     this.setPlayer(globals.selectedCharacter);
        // }
        if (globals.selectedCharacter === 'red') globals.isRunning = true;

        this.setPlayer(globals.selectedCharacter);


        player.setDepth(1);
        // player = this.physics.add.sprite(globals.characterPosition.x*12 + 6, globals.characterPosition.y*12 + 6, 'player'); // Set starting position
        // player.setScale(0.1);
        this.physics.world.setBounds(0, 0, 4800, 2400);
        player.setCollideWorldBounds(true);

        const frameRate = 15;

        




        this.cameras.main.setBounds(0, 0, 4800, 2400);
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(3);


        
        //draws red collision tile for testing
        // for (let y = 0; y < this.collision2D.length; y++) {
        //     for (let x = 0; x < this.collision2D[y].length; x++) {
        //         if (this.collision2D[y][x] !== 0) { // Assuming non-zero value represents collision
        //             const collisionTile = this.add.image(x * tileSize, y * tileSize, 'collision'); // Use 'collision' texture
        //             collisionTile.setAlpha(0); // Set alpha to 50% (0.5)
        //             collisionTile.setOrigin(0, 0);
        //             collisionTile.setScale(tileSize / collisionTile.width, tileSize / collisionTile.height);
        //         }
        //     }
        // }
        // //draws red encounter tile for testing
        // for (let y = 0; y < this.encounter2D.length; y++) {
        //     for (let x = 0; x < this.encounter2D[y].length; x++) {
        //         if (this.encounter2D[y][x] !== 0) { // Assuming non-zero value represents encounter
        //             const encounterTile = this.add.image(x * tileSize, y * tileSize, 'collision'); // Use 'collision' texture
        //             encounterTile.setAlpha(0); // Set alpha to 50% (0.5)
        //             encounterTile.setOrigin(0, 0);
        //             encounterTile.setScale(tileSize / encounterTile.width, tileSize / encounterTile.height);
        //         }
        //     }
        // }


        /////////////////////////////
        console.log('if following pokemon', globals.characterPosition.followingPokemon);
        if (globals.characterPosition.followingPokemon)
        {
            // globals.characterPosition.followingPokemon = globals.partyPokemonData[0];
            globals.characterPosition.followingPokemon = globals.monsterManager.partyMonsters[0];



            // Create the Axolot sprite
            if (globals.monsterManager.partyMonsters.length > 0)
            {

                if (globals.characterPosition.followingPokemonX == 0 || globals.characterPosition.followingPokemonY == 0 )
                {
                    globals.characterPosition.followingPokemonX = this.playerTileX;
                    globals.characterPosition.followingPokemonY = this.playerTileY - 1;
                }
                // console.log('pokemonposition is '+globals.characterPosition.followingPokemonX + ', '+globals.characterPosition.followingPokemonY)


                this.pokemonSprite = this.physics.add.sprite(globals.characterPosition.followingPokemonX*12 + 6, globals.characterPosition.followingPokemonY*12 + 6, globals.characterPosition.followingPokemon.key);
                this.pokemonSprite.setScale(1); // Adjust the scale as needed
                
                //console.log(this.pokemonSprite);
                
                
                if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_down')) {
                    this.anims.create({
                        key: globals.characterPosition.followingPokemon.key + '_walk_down',
                        frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [0, 4, 8, 12] }),
                        frameRate: 10,
                        repeat: -1 // Repeat the animation indefinitely
                    });
                    }
        
                    if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_up')) {
                        this.anims.create({
                            key: globals.characterPosition.followingPokemon.key + '_walk_up',
                            frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [1, 5, 9, 13] }),
                            frameRate: 10,
                            repeat: -1 // Repeat the animation indefinitely
                        });
                    }
        
                    if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_left')) {
                        this.anims.create({
                            key: globals.characterPosition.followingPokemon.key + '_walk_left',
                            frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [2, 6, 10, 14] }),
                            frameRate: 10,
                            repeat: -1 // Repeat the animation indefinitely
                        });
                    }
        
                    if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_right')) {
                        this.anims.create({
                            key: globals.characterPosition.followingPokemon.key + '_walk_right',
                            frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [3, 7, 11, 15] }),
                            frameRate: 10,
                            repeat: -1 // Repeat the animation indefinitely
                        });
                    }
                
                  
                
        
                switch (globals.characterPosition.followingPokemonFacing) {
                    case 'up':
                        this.pokemonSprite.setFrame(1); // Assuming frame 1 is for facing up
                        break;
                    case 'left':
                        this.pokemonSprite.setFrame(2); // Assuming frame 2 is for facing down
                        break;
                    case 'right':
                        this.pokemonSprite.setFrame(3); // Assuming frame 3 is for facing left
                        break;
                    case 'down':
                        this.pokemonSprite.setFrame(0); // Assuming frame 0 is for facing right
                        break;
                    default:
                        break;

                }


            
            
            }
            else{
                this.pokemonSprite = null;
            }
        
            
        }

        if (!globals.npc.trainer6.defeated)
        {
            this.trainerSprite = this.physics.add.sprite(73*12 + 6, 65*12 + 6, 'Dragon');
            this.trainerSprite.setScale(1); // Adjust the scale as needed
        }
  
        for (const trainerKey in globals.npc) {
            const trainer = globals.npc[trainerKey];
            const initialFrame = trainer[trainer.facing]; // Get the initial frame based on facing direction
            trainer.sprite = this.add.sprite(trainer.x * 12 + 6, trainer.y * 12 + 6, trainer.key, initialFrame);
            trainer.sprite.setScale(trainer.scale);
        
            // Create animations for each direction
            const directions = ['down', 'left', 'right', 'up'];
            directions.forEach(direction => {
                const animationKey = trainer.key + '_walk_' + direction;
                const frames = [trainer[direction], trainer[direction] + 1, trainer[direction] + 2, trainer[direction] + 3];
                // console.log('frames: ', frames);
                if (!this.anims.exists(animationKey)) {
                    this.anims.create({
                        key: animationKey,
                        frames: this.anims.generateFrameNumbers(trainer.key, { frames: frames }),
                        frameRate: frameRate,
                        repeat: -1
                    });
                }
            });
        }
        
      

      

        for (const trainerKey in globals.npcIdle) {
            const trainer = globals.npcIdle[trainerKey];
            trainer.sprite = this.add.sprite(trainer.x * 12 + 6, trainer.y * 12 + 6, trainer.key, trainer.frame);
            trainer.sprite.setScale(1);
            trainer.sprite.setTexture(trainer.key, trainer.frame);
        }
        



        if (globals.monsterManager.partyMonsters.length ===0) { //globals.partyPokemonData.length === 0
            this.starterPokemon.forEach((pokemon, index) => {
                pokemon.sprite = this.add.sprite(pokemon.x * 12 + 6, pokemon.y * 12 + 6, pokemon.key, 0);
                pokemon.sprite.setScale(1);
                pokemon.sprite.setTexture(pokemon.key, 0);
                
                if (!this.anims.exists(pokemon.key)) {
                    this.anims.create({
                        key: pokemon.key,
                        frames: this.anims.generateFrameNumbers(pokemon.key, { frames: [0, 4, 8, 12] }),
                        frameRate: frameRate,
                        repeat: -1
                    });
                    
                }
                pokemon.sprite.anims.play(pokemon.key);

                // console.log('created pokemon sprite for : ', pokemon.key);
            });
        }


        ///////////////trees////////////////////

        // Constants for the sine wave
        const amplitude = 5; // Amplitude of the sine wave
        const frequency = 0.04; // Frequency of the sine wave (adjust as needed)
        const phase = Math.PI / 2; // Phase shift of the sine wave


        // Function to calculate y-coordinate based on x-coordinate using a sine wave
        function calculateY(x) {
            return 120 + amplitude * Math.sin(2 * Math.PI * frequency * x + phase) * (Math.random()*2); //goes from 110 to 129 )difference of 27
        }

        //const forest = [];


        if (this.trees.length === 0) {
            // Create new trees and add them to the trees array
            for (let x = 0; x < 6; x++) {
                
                this.trees.push(this.createTree.call(this, 220 + x, 108, 'trees', 'tree' + x));
                
            }
            for (let x = 0; x < 2; x++) {
                
                this.trees.push(this.createTree.call(this, 181, 118 + x * 2, 'trees', 'tree[2]' + x));
                
            }

            let indexForest = 0;
            for (let x = 183; x <= 262; x += 5) { // Adjust step size as needed
                const y = Math.round(calculateY(x));
                this.trees.push(this.createTree.call(this, x, y, 'trees', 'tree[3]' + indexForest));
                indexForest++;

            }

        } else {
            // Destroy existing sprites
            this.trees.forEach(tree => {
                if (tree.sprite) {
                    tree.sprite.destroy();
                }
            });
        
            // Update horiztonal trees
            for (let x = 0; x < this.trees.length; x++) {
                const tree = this.trees[x];
                if (tree.key === 'tree' + x && !tree.destroy) {
                    tree.sprite = this.createTree.call(this, 220 + x, 108, 'trees', 'tree' + x).sprite;
                }
            }
        
            // Update vertical trees
            this.trees
                .filter(tree => tree.key.includes('tree[2]'))
                .forEach((tree, index) => {
                    if (!tree.destroy) {
                    tree.sprite = this.createTree.call(this, 181, 118 + index * 2, 'trees', 'tree[2]' + index).sprite;
                    }
                });

            //update forest
            this.trees
                .filter(tree => tree.key.includes('tree[3]'))
                .forEach((tree, index) => {
                    if (!tree.destroy) {
                        //console.log(index + '.' + ' ' + tree.key);
                        tree.sprite = this.createTree.call(this, tree.x, tree.y, 'trees', 'tree[3]' + index).sprite;
                    }
                });
        }
        
        // ///////////////////loot/////////////////////////

        if (globals.chests.length===0)
        {
            //console.log('creating items');
            //this.items=[];

            let index = 0;
            for (let x = 185; x <= 262; x+=5)
            {   
                let y = Math.round(calculateY(x));
                // let newSprites=[index];
                
                const newItem = {
                    x: x,
                    y: y,
                    sprite: null, // Will be set later
                    opened: false
                };
                const newItemSprite = this.add.sprite(x * 12 + 6, y * 12 + 6, 'chests', 0);
                newItemSprite.setScale(1);
                newItemSprite.setTexture('chests', 0);
                
                newItem.sprite = newItemSprite;
                //console.log('attempting to push newItem into globals');
                globals.chests.push(newItem);

                index++;
            }

            for (let x = 92; x <= 137; x+=10)
            {   
                let y = Math.floor(Math.random() * (129 - 110)) + 110;
                // let newSprites=[index];
                // console.log('x: ' + x + ' y: ' + y);
                const newItem = {
                    x: x,
                    y: y,
                    sprite: null, // Will be set later
                    opened: false
                };
                const newItemSprite = this.add.sprite(x * 12 + 6, y * 12 + 6, 'chests', 0);
                newItemSprite.setScale(1);
                newItemSprite.setTexture('chests', 0);
                
                newItem.sprite = newItemSprite;
                //console.log('attempting to push newItem into globals');
                globals.chests.push(newItem);

                index++;
            }

            for (let y = 74; y <= 118; y+=10)
            {   
                let x = Math.floor(Math.random() * (90 - 77)) + 77;
                // let newSprites=[index];
                // console.log('x: ' + x + ' y: ' + y);
                const newItem = {
                    x: x,
                    y: y,
                    sprite: null, // Will be set later
                    opened: false
                };
                const newItemSprite = this.add.sprite(x * 12 + 6, y * 12 + 6, 'chests', 0);
                newItemSprite.setScale(1);
                newItemSprite.setTexture('chests', 0);
                
                newItem.sprite = newItemSprite;
                //console.log('attempting to push newItem into globals');
                globals.chests.push(newItem);

                index++;
            }


      
        }
        else
        {

            
            globals.chests.forEach(item => {
        
                if (this.encounter2D[item.y][item.x] !== 0)
                {
                
                    item.sprite = this.add.sprite(item.x * 12 + 6, item.y * 12 + 6, 'chests', 0);
                    item.sprite.setScale(1);
                    //set sprite
                    if (item.opened)
                    {
                        item.sprite.setTexture('chests', 1);
                    }
                    else
                    {
                        item.sprite.setTexture('chests', 0);
                    }

                }
                else{
                   
                }

                
            });
            
        }
   
        /////////////////////////////////////////////
        if (data)
        {
            console.log('data' , data.condition);

        }

        if (data && data.condition != 'giveAxe')
        {
            if (!this.scene.isActive('MainMenuScene')) {
                this.setKeyboardEnabled(false); // Disable keyboard input initially
                setTimeout(() => {
                    this.setKeyboardEnabled(true); // Enable keyboard input after the delay
                }, 500); // Adjust the duration as needed
            }
        }
       
        

        this.graphics = this.add.graphics();
        this.drawJoystick();

        ///////////////////virtual keyboard/////////////////////

       




if (data && data.condition) {
    switch (data.condition) {
        case 'giveAxe':
            data.condition = null;
            this.dialogueBoxManager.createDialogueBox(
                this, 
                'Here is an axe for your travels. Press spacebar when facing a tree to chop it down! Acquired! 1 Axe.'
            );
            break;

        case 'feinted':
            data.condition = null;
            setTimeout(() => {
                this.setKeyboardEnabled(false); 
            }, 550); 
            this.dialogueBoxManager.createDialogueBox(
                this, 
                'You have spawned at your checkpoint and your monsters have healed. Please be more careful! Remember you can buy potions in the shop!', 
                [
                    () => {
                        this.setKeyboardEnabled(true);
                    }
                ]
            );
            break;

        case 'starter':
            console.log('running starter');
            data.condition = null;
            this.dialogueBoxManager.createDialogueBox(
                this, 
                'Now let’s fight! Your nemesis would like to start his journey.', 
                () => { this.handleGameEvent('battle'); }
            );
            setTimeout(() => {
                this.setKeyboardEnabled(false);
            }, 550);
            break;

        case 'finishTutorial':
            data.condition = null;
            this.dialogueBoxManager.createDialogueBox(
                this, 
                'Be more careful! Remember to use potions and try leveling up.'
            );
            setTimeout(() => {
                this.setKeyboardEnabled(false); 
            }, 550);
            break;

        case 'finishTutorial2':
            data.condition = null;
            this.pokemonSprite.x = (this.playerTileX - 1) * 12 + 6;
            this.pokemonSprite.y = this.playerTileY * 12 + 6;
            globals.characterPosition.followingPokemonX = this.playerTileX - 1;
            globals.characterPosition.followingPokemonY = this.playerTileY;
            this.dialogueBoxManager.createDialogueBox(
                this, 
                'Time to level up your monsters!', 
                () => { this.handleGameEvent('finishTutorial2'); }
            );
            setTimeout(() => {
                this.setKeyboardEnabled(false);
            }, 550);
            break;

        default:
            // Handle unknown conditions if needed
            console.log('Unknown condition:', data.condition);
            break;
    }
}






        if (globals.characterPosition.starter && !globals.characterPosition.starterCaught)
        {
            globals.characterPosition.starterCaught = true;
            // console.log('good job');
            this.dialogueBoxManager.createDialogueBox(this, 'Now that you have caught a pal its time to level up!');
        }
        
        
        


 
        if (!globals.progress.intro)
        {
            console.log('setting keyboard enabled to false');
            this.setKeyboardEnabled(false);
      
            this.dialogueBoxManager.createDialogueBox(this, 'Press A to continue, Welcome to the world of Monster Trainer. Here you will be able to catch monsters and explore. Let me know if you have any suggestions...', () => { globals.progress.intro=true; this.setKeyboardEnabled(true);})
        }
        



    }
   





    openMainMenu()
    {
        console.log('Escape key pressed in MapScene');
        this.setKeyboardEnabled(false);
        globals.sceneManager.transitionTo('MainMenuScene');
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////


returnToMapScene() {
    this.setKeyboardEnabled(true);
    console.log('setting keys to false');
    this.startButtonPressed = false;
    this.selectButtonPressed = false;
    this.aButtonPressed = false;
    this.bButtonPressed = false;
    this.upButtonPressed = false;
    this.downButtonPressed = false;
    this.leftButtonPressed = false;
    this.rightButtonPressed = false;

    // if (!globals.npc.trainer6.defeated) {
    //     this.scene.start('MapScene', { condition: 'starter' });
    // } else {
    //     this.scene.switch('MapScene');
    // }
    // this.scene.switch('MapScene');

    globals.sceneManager.transitionTo('MapScene');
    globals.sceneManager.stop('PokemonDetailsScene');
    console.log('returning to map scene');
    console.log(globals.characterPosition.starter);
    console.log(globals.characterPosition.starterCaught);
    if (!globals.characterPosition.starter) //        this.createDialogueBox('Now walk around this patch of grass to level up and catch monsters. I recommend going to the shop to get potions and maxpp. Good luck! Oh one more thing, you can interact with your pokemon by hitting spacebar (A). The heart represents the monsters health. if hes hurt you can feed him food.', false, 'starter');

    {
        this.dialogueBoxManager.createDialogueBox(this, 
        'Now walk around this patch of grass to level up and catch monsters. I recommend going to the shop to get potions and maxpp. Good luck! Oh one more thing, you can interact with your pal by hitting spacebar (A). The heart represents the monsters health. if hes hurt you can feed him food.', 
            [
                () => {
                    this.setKeyboardEnabled(false);

                    globals.sceneManager.transitionTo('BattleScene', { condition: 'starter'});
                }
            ]
        );
    }

   
}


destroyNewDialogueBox()
{

    if (this.newDialogueBox)
    {
        this.newDialogueBox.cleanupDialogue();
    }
}






selectStarter(starter, targetFacing, targetX, targetY)
{
    this.setKeyboardEnabled(false);
    console.log('talking to pokemon sprite ' + starter.key);


    // starter.pokemon = this.scene.get('BattleScene').setPokemonStats(starter.pokemon, 4);//4



    console.log('setting starter pokemon');
    globals.partyPokemonData.push(starter.pokemon);
    globals.characterPosition.followingPokemon=starter.pokemon;

    globals.monsterManager.add(starter.pokemon);


    for (const pokemon of this.starterPokemon) {
        pokemon.sprite.destroy();
    }

    globals.characterPosition.followingPokemonFacing = targetFacing;


    globals.characterPosition.followingPokemonX = targetX;
    globals.characterPosition.followingPokemonY = targetY;
    console.log('setting following pokemon');
    this.switchFollowingPokemon(globals.characterPosition.followingPokemon);

    starter.sprite = this.pokemonSprite;
    starter.sprite.x = targetX;
    starter.sprite.y = targetY;
    starter.sprite.setTexture(starter.key, starter.key + '_walk_' + globals.characterPosition.facing)
    

    this.pokemonSprite.x = targetX*12 + 6;
    this.pokemonSprite.y = targetY* 12 + 6;



    globals.sceneManager.transitionTo('PokemonDetailsScene', { 
        pokemon: starter.pokemon, 
        originScene: this.scene.key,
        onClose: () => this.returnToMapScene(),
        action: 'caught'
    }, true);

}







update() {


    if (this.dialogueBoxManager.activeDialogueBox && this.dialogueBoxManager.activeDialogueBox.timer)
    {
        const cameraX = this.cameras.main.scrollX;
        const cameraY = this.cameras.main.scrollY;
    
        const absoluteX = cameraX + 300;
        const absoluteY = cameraY + 330;
        
        // this.dialogueBox = this.add.image(absoluteX, absoluteY, 'dialogBox');
        // this.dialogueBox.scaleX = 0.6;
        // this.dialogueBox.scaleY = 0.8;
        // this.dialogueBox.setOrigin(0.5, 1);
        // this.newDialogueBox.x = absoluteX;
        // this.newDialogueBox.y = absoluteY;
        this.dialogueBoxManager.activeDialogueBox.updatePosition(absoluteX, absoluteY);

        // this.text.x = this.dialogueBox.x + 5;
        // this.text.y = this.dialogueBox.y - this.dialogueBox.height + 45;

    }

    // if (!this.dialogueBox)
    // {
        
    //     this.time.delayedCall(500, () => {
    //         this.setKeyboardEnabled(true);
    //     });
    // }
    // console.log(this.newDialogueBox);
   //(!this.newDialogueBox || this.newDialogueBox.isClosed)  && 
  
    if (!this.dialogueBoxManager.shouldLockKeyboard() && this.keyboardEnabled && !moving && !globals.sceneManager.isTransitioning && globals.sceneManager.mainCurrentScene === 'MapScene') {// && !this.dialogueBox
        
        // Handle keyboard input only when enabled
        let moveX = 0;
        let moveY = 0;

        if (this.leftButtonPressed) { // || this.aKey.isDown this.cursors.left.isDown || 
            moveX = -1;
        } else if (this.rightButtonPressed ) { //|| this.dKey.isDown this.cursors.right.isDown || 
            moveX = 1;
        } else if ( this.upButtonPressed) { // || this.wKey.isDown  || this.cursors.up.isDown 
            moveY = -1;
        } else if (this.downButtonPressed) { // || this.sKey.isDown this.cursors.down.isDown || 
            moveY = 1;
        }
        
        if (moveX !== 0 || moveY !== 0) {
            this.movePlayer(moveX, moveY);
            //this.updatePokemonPositionAndAnimation(moveX, moveY);
        }

        // Check if the spacebar is pressed and the player is facing the Pokémon
        if ((this.aButtonPressed )) { //Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE')) || 
            console.log('a button presssed');
            // if ( this.aButtonPressed )
            // {
            //     console.log('space button triggered with a button');
            //     setTimeout(() => {
            //         this.aButtonPressed=false; // Reset the button state
            //     }, 200); // Adjust

            //     //this.aButtonPressed=false;
            // }
            console.log('globals: ' + globals.npc.trainer1.up);

            let targetX = null;
            let targetY = null;
            let targetX2 = null;
            let targetY2 = null;
            let targetFacing = null;
            console.log('facing: ' + globals.characterPosition.facing)

            if (globals.characterPosition.facing === 'right')
            {
                targetX = this.playerTileX + 1;
                targetY = this.playerTileY;

                targetX2 = this.playerTileX + 2;
                targetY2 = this.playerTileY;


                targetFacing = 'left'
                console.log('facing left');
            } else  
            if (globals.characterPosition.facing === 'left')
            {
                targetX = this.playerTileX - 1;
                targetY = this.playerTileY;

                targetX2 = this.playerTileX - 2;
                targetY2 = this.playerTileY;


                targetFacing = 'right'
                console.log('facing right');
            } else  if (globals.characterPosition.facing === 'down')
            {
                targetX = this.playerTileX;
                targetY = this.playerTileY + 1;

                targetX2 = this.playerTileX;
                targetY2 = this.playerTileY + 2;

                targetFacing = 'up'
                console.log('facing up');
            } else  if (globals.characterPosition.facing === 'up')
            {
                targetX = this.playerTileX;
                targetY = this.playerTileY - 1;

                targetX2 = this.playerTileX;
                targetY2 = this.playerTileY - 2;

                targetFacing = 'down'
                console.log('facing down');
            }  


            if (!this.pokemonSprite )
            {
                for (const starter of this.starterPokemon)
                {

                    if(starter.x === targetX && starter.y === targetY )
                    {   

                  
                        this.dialogueBoxManager.createDialogueBox(this, 'Do you want to pick ' + starter.key + '?', 
                            [], 
                            false, 
                            false,
                            {
                                yes: { 
                                    text: "Yes", 
                                    callback: () => {
                                        this.selectStarter(starter, targetFacing, targetX, targetY);
                                    }
                                },
                                no: { 
                                    text: "No", 
                                    callback: () => this.destroyNewDialogueBox() 
                                }
                            }, 
                            '#000000',
                            starter.key + 'Faceset'

                        )




                    }
                }
            }

            

            
            //surf and fish
            if (this.fishingSurfing2D[targetY2][targetX2] > 0 && globals.items.some(item => item.key === 'fishingrod' && item.quantity > 0) && this.pokemonSprite)
            {

                this.setKeyboardEnabled(false);

                console.log('you are interacting with water');

                if (player && player instanceof Phaser.GameObjects.Sprite) {
                    // If it exists, destroy it
                    player.destroy();
                }
            
                //console.log('setting male player');
                player = this.physics.add.sprite(globals.characterPosition.x*12 + 6, globals.characterPosition.y*12 + 6, 'fishing'); // Set starting position
                player.setScale(0.8);
                //this.physics.world.setBounds(0, 0, 2400, 2400);
                //player.setCollideWorldBounds(true);
            
                //this.cameras.main.setBounds(0, 0, 4800, 2400);
                this.cameras.main.startFollow(player);
                //this.cameras.main.setZoom(3);
            
            
            
                const frameRate = 15;

                //let col = 4;
            
                if (!this.anims.exists('down')) {
                    this.anims.create({
                        key: 'down',
                        frames: this.anims.generateFrameNumbers('fishing', { frames: [1, 5, 9, 13] }),
                        frameRate: frameRate,
                        repeat: 0
                    });
                }
            
                if (!this.anims.exists('up')) {
                    this.anims.create({
                        key: 'up',
                        frames: this.anims.generateFrameNumbers('fishing', { frames: [2, 6, 10, 14] }),
                        frameRate: frameRate,
                        repeat: 0
                    });
                }
            
                if (!this.anims.exists('left')) {
                    this.anims.create({
                        key: 'left',
                        frames: this.anims.generateFrameNumbers('fishing', { frames: [0, 4, 8, 12] }),
                        frameRate: frameRate,
                        repeat: 0
                    });
                }
            
                if (!this.anims.exists('right')) {
                    this.anims.create({
                        key: 'right',
                        frames: this.anims.generateFrameNumbers('fishing', { frames: [3, 7, 11, 15] }),
                        frameRate: frameRate,
                        repeat: 0
                    });
                }
            
            
                //player.setTexture('player', 1);
                player.setTexture(globals.selectedCharacter, {
                    left: 0, // Example frame number for facing left
                    right: 2, // Example frame number for facing right
                    up: 3, // Example frame number for facing up
                    down: 1 // Example frame number for facing down
                }[globals.characterPosition.facing]);

                player.anims.play(globals.characterPosition.facing);

                console.log('testing fishing');

                // Delayed action after 5 seconds
                setTimeout(() => {
                    // Action to be performed after 5 seconds
                    console.log('Performing action after 5 seconds');
                    
                    // Add your action here

                    console.log('5 seconds elapsed');
                    globals.fishing = true;
                    this.setKeyboardEnabled(true);

                    // if (globals.player.red.active)
                    if (globals.selectedCharacter === 'red')
                    {
                        // this.setBike();
                        this.setBike();

                    }
                    else
                    {
                        // this.setMalePlayer();
                        this.setPlayer(globals.selectedCharacter) ;
                    }
                    
                    const randomNumber = Math.floor(Math.random() * 100);
                    if (randomNumber < 20)
                    {
                        console.log('you caught a fish!');
                        globals.sceneManager.start('BattleScene');

                    }
                    else
                    {
                        console.log('you failed to catch a fish');
                        globals.fishing=false;
                    }
                    


                }, 5000); // 5000 milliseconds = 5 seconds
                        

                
                    
            
            }

            


            for (const npcName in globals.npcIdle) {
                if (this.locked) {
                    setTimeout(() => {
                        this.locked=false; // Enable keyboard input after the delay
                    }, 500); // Adjust the duration as needed
                    return;
                };
                const npc = globals.npcIdle[npcName];
                if (targetX === npc.x && targetY === npc.y) {
                    switch (npcName) {
                        case 'kid':
         

                     
                            // this.dialogueBoxManager.createDialogueBox(this, 'Walking in your house heals you! You can also be healed by walking into the shop in the next town and that also gives you a checkpoint', [], false, false,null, '#000000', npc.key + 'Faceset');
                        this.dialogueBoxManager.createDialogueBox(this, 'Walking in your house heals you! You can also be healed by walking into the shop in the next town and that also gives you a checkpoint', [], false, false,null, '#000000', npc.key + 'Faceset');
                            break;
                        case 'kid2':
                          
                            this.dialogueBoxManager.createDialogueBox(this, 'The leader will give you an axe to chop down trees. Use spacebar or A to chop down trees. ', [], false, false,null, '#000000', npc.key + 'Faceset');
                            // Your logic for interacting with the kid2 NPC
                            break;
                        case 'oldman3':
                            
                            this.dialogueBoxManager.createDialogueBox(this, 'Try walking in the grass! By the way, Monsters to the north and east are level 10-15, where the monsters in the town range from 3-10. I recommend starting out in the lower area.', [], false, false,null, '#000000', npc.key + 'Faceset');
                            // Your logic for interacting with the kid2 NPC
                            break;
                        case 'redoldman':
                         
                            this.dialogueBoxManager.createDialogueBox(this, 'Try buying items in here so you can survive!', [], false, false,null, '#000000', npc.key + 'Faceset');
                            // Your logic for interacting with the kid2 NPC
                            break;
                        case 'samurai':
                     
                            this.dialogueBoxManager.createDialogueBox(this, 'Lost? Press M for map!', [], false, false,null, '#000000', npc.key + 'Faceset');
                            // Your logic for interacting with the kid2 NPC
                            break;
                        case 'women':
                          
                            this.dialogueBoxManager.createDialogueBox(this, 'Tired? Here I will heal your monsters.', [], false, false,null, '#000000', npc.key + 'Faceset');
                            // Your logic for interacting with the kid2 NPC
                            globals.monsterManager.healPartyMonsters();

                            break;
                        case 'wife':
                      
                                this.dialogueBoxManager.createDialogueBox(this, 'Hi! Have you caught any monsters yet?.', [], false, false,null, '#000000', npc.key + 'Faceset');
                                // Your logic for interacting with the kid2 NPC
                         
                                break;
                        case 'villager':
                      
                                this.dialogueBoxManager.createDialogueBox(this, 'Enter (select) is the menu, and escape (start) is the main menu, dont get them mixed up! You can view your monsters and items in the menu. ', [], false, false,null, '#000000', npc.key + 'Faceset');
                                // Your logic for interacting with the kid2 NPC
                             
                                break;
                        case 'mage':
                                if (globals.items[globals.items.findIndex(item => item.key === 'eye')].quantity >=1)
                                {
                                    this.dialogueBoxManager.createDialogueBox(this, 'Kill monsters throughout the map to gather orbs', [], false, false,null, '#000000', npc.key + 'Faceset');

                                }
                                else{
                              
                                    this.dialogueBoxManager.createDialogueBox(this, 'Here is an eye of truesight. You may now collect orbs from monsters throughout the map', [], false, false,null, '#000000', npc.key + 'Faceset');
                                    globals.items[globals.items.findIndex(item => item.key === 'eye')].quantity += 1;
                                    // Your logic for interacting with the kid2 NPC
                              
                                }
                               
                                break;
                        case 'villager2':
                         
                                    this.dialogueBoxManager.createDialogueBox(this, 'Every route has unique monsters. Try to catch one of each kind! You can store your pals in the PC so dont worry about catching too many!', [], false, false,null, '#000000', npc.key + 'Faceset');

                            
                               
                                break;
                                case 'villager3':
                                 
                                    this.dialogueBoxManager.createDialogueBox(this, 'Get a fishing rod to fish in the water!. You simply walk up to the shore and press spacebar when you have a fishing rod.', [], false, false,null, '#000000', npc.key + 'Faceset');

                            
                               
                                break;


                                case 'oldman1':
                                    this.dialogueBoxManager.createDialogueBox(this, `Do you want to buy something from ${npc.name}?`, [], false, false, {
                                        yes: {
                                            text: "Yes",
                                            callback: () => {
                                                this.setKeyboardEnabled(false);
                                                globals.sceneManager.launch('OldManScene', { superPotionAvailable: true, hyperPotionAvailable: true });
                                            }
                                        },
                                        no: {
                                            text: "No",
                                            callback: () => this.destroyNewDialogueBox()
                                        }
                                    }, '#000000', npc.key + 'Faceset');
                                    break;
                                case 'oldman2':
                                    this.dialogueBoxManager.createDialogueBox(this, `${npc.name} would like to trade.`, [], false, false, {
                                        yes: {
                                            text: "Yes",
                                            callback: () => {
                                                this.setKeyboardEnabled(false);
                                                globals.sceneManager.launch('OldManScene', { superPotionAvailable: true });
                                            }
                                        },
                                        no: {
                                            text: "No",
                                            callback: () => this.destroyNewDialogueBox()
                                        }
                                    }, '#000000', npc.key + 'Faceset');
                                    break;
                                case 'teacher':
                                    this.dialogueBoxManager.createDialogueBox(this, `Do you want to learn new moves from ${npc.name}?`, [], false, false, {
                                        yes: {
                                            text: "Yes",
                                            callback: () => {
                                                this.setKeyboardEnabled(false);
                                                globals.sceneManager.launch('MoveListScene');
                                            }
                                        },
                                        no: {
                                            text: "No",
                                            callback: () => this.destroyNewDialogueBox()
                                        }
                                    }, '#000000', npc.key + 'Faceset');
                                    break;
                                case 'renamer':
                                    this.dialogueBoxManager.createDialogueBox(this, `Do you want to rename your Pokémon with the help of ${npc.name}?`, [], false, false, {
                                        yes: {
                                            text: "Yes",
                                            callback: () => {
                                                this.setKeyboardEnabled(false);
                                                globals.sceneManager.launch('PartyScene', {
                                                    originScene: this.scene.key,
                                                    action: 'Rename'
                                                });
                                            }
                                        },
                                        no: {
                                            text: "No",
                                            callback: () => this.destroyNewDialogueBox()
                                        }
                                    }, '#000000', npc.key + 'Faceset');
                                    break;
                                case 'breeder':
                                    this.dialogueBoxManager.createDialogueBox(this, `${npc.name} asks: "Do you want to breed your Pokémon?"`, [], false, false, {
                                        yes: {
                                            text: "Yes",
                                            callback: () => {
                                                this.setKeyboardEnabled(false);
                                                globals.sceneManager.launch('BreederScene', {
                                                    originScene: this.scene.key,
                                                    action: 'Breed'
                                                });
                                            }
                                        },
                                        no: {
                                            text: "No",
                                            callback: () => this.destroyNewDialogueBox()
                                        }
                                    }, '#000000', npc.key + 'Faceset');
                                    break;
                                

                        default:
                          
                     
                            break;
                    }
            
                    // switch (targetFacing) {
                    //     case 'left':
                    //         npc.sprite.setFrame(npc.left);
                    //         break;
                    //     case 'right':
                    //         npc.sprite.setFrame(npc.right);
                    //         break;
                    //     case 'up':
                    //         npc.sprite.setFrame(npc.up);
                    //         break;
                    //     case 'down':
                    //         npc.sprite.setFrame(npc.down);
                    //         break;
                    //     default:

                    //     // Default behavior when no specific direction is determined
                    //         console.log('default');
                    //         npc.sprite.setFrame(npc.left); // You can set the default frame here
                    //         break;
                    // }


                    switch (targetFacing) {
                        case 'up':
                            npc.sprite.setFrame(1); // Frame number for facing up
                            break;
                        case 'down':
                            npc.sprite.setFrame(0); // Frame number for facing down
                            break;
                        case 'left':
                            npc.sprite.setFrame(2); // Frame number for facing left
                            break;
                        case 'right':
                            npc.sprite.setFrame(3); // Frame number for facing right
                            break;
                        default:
                            // Default behavior when no specific direction is determined
                            console.log('default');
                            npc.sprite.setFrame(0); // Default frame (down)
                            break;
                    }
                    


                    
                    const frameRate = 7;


                    this.quest = this.add.sprite(npc.x * 12 + 6, (npc.y-1) * 12 + 6, 'quest');
                    this.quest.setScale(0.9); 
                
                    if (!this.anims.exists('scroll')) {
                        this.anims.create({
                            key: 'scroll',
                            frames: this.anims.generateFrameNumbers('quest', { frames: [0, 1, 2, 3] }),
                            frameRate: frameRate,
                            repeat: -1
                        });
                    }
                
                
                    //player.setTexture('player', 1);
                    this.quest.setTexture('quest', 0);

                    this.quest.anims.play('scroll');

                    console.log('quest');





                }
            }
            

            



            for (const npcName in globals.npc) {
                const npc = globals.npc[npcName];
                if (targetX === npc.x && targetY === npc.y) {
                    console.log(`Talking to ${npcName}`);
                    switch (targetFacing) {
                        case 'left':
                            if(npc.sprite)
                            {
                                npc.sprite.setFrame(npc.left);
                            }
                            break;
                        case 'right':
                            if(npc.sprite)
                            {
                                npc.sprite.setFrame(npc.right);

                            }
                            break;
                        case 'up':
                            if(npc.sprite)
                            {
                                npc.sprite.setFrame(npc.up);
                            }
                            break;
                        case 'down':
                            if (npc.sprite)
                            {
                                npc.sprite.setFrame(npc.down);

                            }
                            break;
                        default:
                            console.log('default');
                            if (npc.sprite)
                            {
                                npc.sprite.setFrame(npc.left); // You can set the default frame here

                            }
                            break;
                    }
                    let dialogBox = null;
                    // Create dialogue box for each NPC
                    switch (npcName) {
                        case 'trainer1':
                            // this.createDialogueBox('You cant pass unless you beat me!');
                            this.dialogueBoxManager.createDialogueBox(this, 'You cant pass unless you beat me!');
                            break;
                        case 'trainer2':
                            // this.createDialogueBox('You cant pass unless you beat me!');
                            this.dialogueBoxManager.createDialogueBox(this, 'You cant pass unless you beat me!', [], false, false,null, '#000000', npc.key + 'Faceset');

                            break;
                        case 'trainer3':
                            // this.createDialogueBox('You cant pass unless you beat me!');
                            this.dialogueBoxManager.createDialogueBox(this, 'You cant pass unless you beat me!', [], false, false,null, '#000000', npc.key + 'Faceset');

                            break;
                        case 'trainer4':
                            // this.createDialogueBox('You cant pass unless you beat me!');
                            this.dialogueBoxManager.createDialogueBox(this, 'You cant pass unless you beat me!', [], false, false,null, '#000000', npc.key + 'Faceset');

                            break;
                        case 'trainer5':
                            // this.createDialogueBox('Use that axe to chop down the tree with spacebar.');
                            this.dialogueBoxManager.createDialogueBox(this, 'You cant pass unless you beat me!', [], false, false,null, '#000000', npc.key + 'Faceset');

                            break;
                        // Add cases for other NPCs as needed
                        default:
                            console.log(`No dialogue defined for ${npcName}`);
                            break;
                    }
                }
            }
            
                

            


            
            
            if (this.pokemonSprite) {
            
                // Calculate the tile position of the Pokémon
                const pokemonTileX = Math.floor(this.pokemonSprite.x / tileSize);
                const pokemonTileY = Math.floor(this.pokemonSprite.y / tileSize);
                console.log('pokemonx='+pokemonTileX+'pokemony='+pokemonTileY+
                'playerx='+this.playerTileX+'playery='+this.playerTileY);
                console.log('last direction:' + ' = ' + globals.characterPosition.facing);
                // Check if the player is facing the Pokémon
                const playerFacingPokemon =
                    (globals.characterPosition.facing === 'left' && this.playerTileX === pokemonTileX + 1 && this.playerTileY === pokemonTileY) || // Player facing left
                    (globals.characterPosition.facing === 'right' && this.playerTileX === pokemonTileX - 1 && this.playerTileY === pokemonTileY) || // Player facing right
                    (globals.characterPosition.facing === 'up' && this.playerTileY === pokemonTileY + 1 && this.playerTileX === pokemonTileX) || // Player facing up
                    (globals.characterPosition.facing === 'down' && this.playerTileY === pokemonTileY - 1 && this.playerTileX === pokemonTileX); // Player facing down


                   





                if (playerFacingPokemon && !this.dialogueBox&& globals.characterPosition.starterCaught) {
                    console.log('Player is facing the Pokémon!');
                    if (this.heart){
                        this.heart.destroy();
                        this.heart=null;
                    }
                    // Create the heart sprite
                    this.heart = this.physics.add.sprite(pokemonTileX * 12 + 6, pokemonTileY*12 + 6 -12, 'HeartHealth');
                    this.heart.setDepth(1);
                ///////////////////////////////////////////

                if (globals.characterPosition.followingPokemon && globals.partyPokemonData.length > 0) {
                    // Find the following Pokémon data
                    // const followingPokemonData = globals.partyPokemonData.find(pokemon => pokemon.key === globals.characterPosition.followingPokemon);
                    const followingPokemonData = globals.characterPosition.followingPokemon;
                    console.log('entering if statement for heart');


                    // if (!this.dialogueBox)
                    // {
                        if (globals.characterPosition.followingPokemon ) {
                            // Calculate the health percentage
                            const healthPercentage = (followingPokemonData.currentHp / followingPokemonData.maxHp) * 100;
                            // Set the frame of the heart sprite based on the health percentage
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
                            this.setKeyboardEnabled(false);
                            globals.sceneManager.launch('InteractWithPokemonScene');
                        }
                    // }
                   
                }

           
                ///////////////////////////////////////////
                    //this.heart.setFrame(0); // Set the frame to the first frame of the sprite sheet
                    this.heart.setScale(.3); // Adjust scale as needed
                    //console.log('created heart at ' + this.heart.x + ', ' + this.heart.y);
                    

                    // Show the heart
                    this.heart.setVisible(true);
                    this.heart.x=pokemonTileX * 12 + 6;
                    this.heart.y=pokemonTileY*12 + 6 -12;
                    //console.log('heart, x: ' + this.heart.x + ' y: ' + this.heart.y);
                    //console.log('your position is ' + globals.characterPosition.x + ', ' + globals.characterPosition.y)

                }
                
            }


            for (const key in this.computers) {
                const computer = this.computers[key];

                ////////computer////// (12, 186)
                const playerFacingComputer =
                (globals.characterPosition.facing === 'left' && this.playerTileX === computer.x + 1 && this.playerTileY === computer.y) || // Player facing left
                (globals.characterPosition.facing === 'right' && this.playerTileX === computer.x - 1 && this.playerTileY === computer.y) || // Player facing right
                (globals.characterPosition.facing === 'up' && this.playerTileY === computer.y + 1 && this.playerTileX === computer.x) || // Player facing up
                (globals.characterPosition.facing === 'down' && this.playerTileY === computer.y - 1 && this.playerTileX === computer.x); // Player facing down
                ////////////////////
                if (playerFacingComputer)
                    {
                        console.log('you are using the computer');
                        this.setKeyboardEnabled(false);
                        // game.scene.start('ComputerScene');
                        globals.sceneManager.transitionTo('ComputerScene', {}, true);
                    }

            }


            

              ///////////orb//////// (72, 186)

                const playerFacingOrb =
                (globals.characterPosition.facing === 'up' && this.playerTileY === 187 && this.playerTileX === 72); // Player facing down
               
                if (playerFacingOrb) {
                    console.log('Facing the orb');
                



                    for (const type in globals.pokemonTypeColor) {
                        const color = globals.pokemonTypeColor[type];
                       
                 
                        if (globals.characterPosition.followingPokemon.type === type) {
                            console.log('Following Pokémon type:', type);
                            console.log('Color:', color);
                            console.log('About to initiate sprites');
                            


                            const foundItem = globals.items.find(item => item.name === color + 'orb');


                            let moveFound = null;
                            let moveMax = 0;
                            let numProjectiles = 0;

                            for (const move of globals.characterPosition.followingPokemon.moves) {
                                // Check if the move name ends with 'beam'
                                if (move.name.toLowerCase().endsWith('beam')) {
                                    console.log('Updating move:', move.name);
                                    moveFound = move;
                                    // numProjectiles = Math.ceil(Math.sqrt(move.count));
                                    // moveMax = Math.ceil(Math.pow(numProjectiles, 2));
                                    
                                }
                            }





                            if (foundItem && moveFound) {
                                console.log('Found item:', foundItem);
                                if (foundItem.quantity > 0) {
                                    console.log('Quantity is greater than 0, can perform action');
                     

                                    foundItem.quantity-=1;
        
        
               
        
                                  
                                    moveFound.count +=1;

                                    numProjectiles = Math.ceil(Math.sqrt(moveFound.count));
                                    moveMax = Math.ceil(Math.pow(numProjectiles, 2));
                                    
                                    this.sprite = null;

                                    this.sprite = this.add.sprite(this.playerTileX * 12 + 6, this.playerTileY * 12 + 6 - 12, color + 'orb', 5);
                                    this.sprite.setScale(0.1);
                                    console.log(this.sprite.scale);
                                    console.log('created sprite');
                                    this.sprite.setDepth(1);


                                    //sprite.sprite.setTexture(trainer.name, trainer.frame);
                            
                                    if (!this.anims.exists(color + 'explosion')) {
                                        this.anims.create({
                                            key: color + 'explosion',
                                            frames: this.anims.generateFrameNumbers(color + 'orb', { start: 4, end: 9 }),
                                            frameRate: 10,
                                            repeat: -1
                                        });
                                    }
                                    this.sprite.anims.play(color+'explosion', true);

                                    this.dialogueBoxManager.createDialogueBox(this, 'Behold! I shall upgrade your monsters offensive ability!' + ' Your ' + moveFound.name + ' has the power of ' + numProjectiles + '[' + moveFound.count + '/' + moveMax + ']')


                                    break;


                                } else {
                                    console.log('Quantity is 0, cannot perform action');
                                    this.dialogueBoxManager.createDialogueBox(this, 'You inspect the shrine. You notice a slot that can old some kind of orb? Interesting.')
                                }
                            } else {
                                if (!moveFound)
                                
                                {
                                    this.dialogueBoxManager.createDialogueBox(this, 'Your following monster needs to be level 30 to interact with this.');
                                }
                                else
                                {
                                    this.dialogueBoxManager.createDialogueBox(this, 'You inspect the shrine. You notice a slot that can old some kind of orb? Interesting.');

                                }
                            }


                           

                            
                        }
                    
                    }


                }
                
                /////////trees///////////
                
                
                
                // const playerTreeTile = ( this.playerTileY === 109 && this.playerTileX <=  220 && this.playerTileX >= 205);
                

                // for (let x = 0; x < 6; x++) {
                    if (this.trees.length > 0) {
                        // Iterate over each tree in the trees array
                        this.trees.forEach((tree, index) => {
                            // Check if the current tree should not be destroyed
                            if (!tree.destroy) {
                                // Check if the tree is in front of the character
                                // let inFrontOfCharacter = false;
                                //for (let x = 0; x < this.trees.length; x++)
                                //{

                                   // console.log(tree)
                                    // inFrontOfCharacter = ((globals.characterPosition.facing === 'up' || globals.characterPosition.facing === 'down') && (this.playerTileY === tree.y+2 || this.playerTileY === tree.y+3) && this.playerTileX === tree.x);
                                    //console.log('targetX = ' + targetX + 'targetY = ' + targetY);
                                    if (targetX === tree.x && ( targetY === tree.y-1 ||targetY === tree.y || targetY === tree.y+1))
                                    {
                                        if (globals.npc.trainer5.defeated)
                                        {
                                            console.log('gym is defeated allowed to use cut');

                                            tree.sprite.destroy();
                                            tree.destroy = true;


                                        }
                                        else {
                                            console.log('beat the gym');
                                        }
                                        
                                        console.log('Player interacting with tree#' + index);
                                        console.log('Tree sprite: ' + tree.sprite);
                                        



                                    }
                                    
                                  
                            }
                            else
                            {
                                console.log('no tree');
                            }
                        });
                    } else {
                        console.log('No trees');
                    }
                // }  

      
                ////////////chests//////////

                globals.chests.forEach((item) => {
                    if (targetX === item.x &&  targetY === item.y && !item.opened)
                    {
                        console.log('player interacting with item.');
                        item.sprite.setTexture('chests', 1);
                        

                        // Filter out items containing 'orb'
                        const filteredItems = globals.items.filter(item => !item.key.includes('orb') && !item.key.includes('fishingrod') && !item.key.includes('bicycle')&& !item.key.includes('eye'));

                        // console.log(filteredItems);
                        // Check if there are items left after filtering
                        // if (filteredItems.length > 0) {
                        // Select a random index
                        const randomIndex = Math.floor(Math.random() * filteredItems.length);

                        // Increase the quantity of the selected item by 1
                        filteredItems[randomIndex].quantity += 1;
                        this.dialogueBoxManager.createDialogueBox(this, 'You received the item ' + filteredItems[randomIndex].name + '!');
                        // Log the updated item
                        console.log('Randomly selected item:', filteredItems[randomIndex]);
                        // } else {
                        //     console.log('No eligible items available.');
                        // }
                        item.opened = true;
                    }
                });

      

                }


                if (this.selectButtonPressed ) {//||(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SHIFT'))) && globals.items.some(item => item.key === 'bicycle' && item.quantity > 0)) && !this.buttonCooldown


             this.useBike();
            


        }


        if (this.startButtonPressed) { //Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ENTER')) || 
          



            console.log('starting menu scene with the start button, startbuttonpresssed');
            // game.scene.start('MenuScene');

            // Instead of game.scene.start('MenuScene');
            globals.sceneManager.launch('MenuScene');
            this.setKeyboardEnabled(false);
        }





        if (this.input.activePointer.isDown&&this.pointToMoveEnabled&&!this.virtualKeyboard()) {
            // Update joystick position
            this.pointerDown = true;
            this.updateJoystickPosition();
            this.handlePointerMove(this.input.activePointer);
        } else {
            this.pointerDown = false;
            this.directionX = 0;
            this.directionY = 0;
        }



    }

    

    if (this.dialogueBoxManager.shouldLockKeyboard && this.aButtonPressed&&!this.dialogueBoxCooldown)
    {
        console.log('a button pressed in dialogueboxmanager');

        this.dialogueBoxManager.handleEvent(true);
        this.dialogueBoxCooldown = true;

        this.time.delayedCall(this.dialogueBoxCooldownTime, () => {
            this.dialogueBoxCooldown = false;
        });
    }
    else if (this.dialogueBoxManager.shouldLockKeyboard && this.bButtonPressed&&!this.dialogueBoxCooldown)
    {
        console.log('b button pressed in dialogueboxmanager');
        this.dialogueBoxManager.handleEvent(false);
        this.dialogueBoxCooldown = true;

        this.time.delayedCall(this.dialogueBoxCooldownTime, () => {
            this.dialogueBoxCooldown = false;
        });
    }

    
}


useBike() {
    // If bicycle is available and cooldown is not active, exit early
    if (globals.items.some(item => item.key === 'bicycle' && item.quantity > 0) && !this.buttonCooldown) {
        // return; // Prevent rapid firing if cooldown is active
    

    // Set the cooldown flag to true to prevent further button presses during the cooldown
    this.buttonCooldown = true;

    // Reset the cooldown after a specified delay
    this.time.delayedCall(this.buttonCooldownTime, () => {
        this.buttonCooldown = false;
    });

    console.log('shift pressed');
    globals.isRunning = !globals.isRunning;

    

    // Check player status and set bike accordingly
    // if (globals.player.red.active)
      if (  globals.selectedCharacter === 'red')
         {
        this.setPlayer('male');
    } else 
    // if (globals.player.male.active)
        if (globals.selectedCharacter === 'male')
    {
        this.setBike();

    } else 
    {
        console.log('running shoes applied.');
    }
}
}




handleGameEvent(event)
{

    switch (event)
                    {
                        case 'battle' :


                     
                        // this.movePlayer(75, 65, 'Time to battle!', 'battle2');
                        // globals.characterPosition.followingPokemon = globals.partyPokemonData[0];

                        this.updatePokemonPositionAndAnimation(0, 0, false, 74, 65, 'none', true, 300) 

                        moving=true;


                        
                        // if(globals.player.male.active)
                            if (globals.selectedCharacter=== 'male')
                        {
                            this.playerTexture='male'
                            this.walk='walk_';
                            this.left= 7;
                            this.right = 10;
                            this.up = 4;
                            this.down = 1;
                            //console.log('player is male');
                        }
                        else 
                        // if (globals.player.female.active)
                            if (globals.selectedCharacter === 'female')

                        {
                            this.playerTexture='female'
                            this.walk='female_walk_';
                            this.left= 4;
                            this.right = 8;
                            this.up = 12;
                            this.down = 0;
                            //console.log('player is female');
                        }
                        else 
                        // if (globals.player.female2.active)
                            if (globals.selectedCharacter==='female2')
                        {
                            this.playerTexture='female2'
                            this.walk='female2_walk_';
                            this.left= 4;
                            this.right = 8;
                            this.up = 12;
                            this.down = 0;
                            //console.log('player is female');
                        }
                        else 
                        // if (globals.player.red.active)
                            if (globals.selectedCharacter==='red')

                        {
                            this.playerTexture='red'
                            this.walk='red_walk_';
                            this.left= 0;
                            this.right = 4;
                            this.up = 8;
                            this.down = 12;
                            //console.log('player is female');
                        }
                        else
                        {
                            this.playerTexture=globals.selectedCharacter;
                            this.walk=globals.selectedCharacter + '_walk_';
                            this.left= 2;
                            this.right = 3;
                            this.up = 1;
                            this.down = 0;
                        }



                        console.log('running battle');
                        const targetTileX = 75;
                        const targetTileY = 65;

                       
                        
                        
                        // Calculate the distance to move in the x and y directions
                        const deltaX = (targetTileX - this.playerTileX) ;
                        const deltaY = (targetTileY - this.playerTileY) ;
                        
                    
                        const speed = 300; // Adjust as needed
                        
                        

                        player.anims.play(this.walk + 'right', true);


                        // Tween to the target position
                        this.tweens.add({
                            targets: player,
                            x: (player.x) + (deltaX*12),
                            y:player.y,
                            duration: deltaX*speed,
                            ease: 'Linear',
                            onComplete: () => {
                                // Player has reached the target position
                                // Update playerTileX and playerTileY if needed
                                player.anims.stop();
                                console.log('moving y now');

                                player.anims.play(this.walk + 'down', true);    

                                this.tweens.add({
                                    targets: player,
                                    x: player.x,
                                    y: player.y + deltaY*12,
                                    duration: deltaY*speed,
                                    ease: 'Linear',
                                    onComplete: () => {
                                        console.log('completed movement');
                                        player.anims.stop();
                                        player.setFrame(this.left)
                                        // Player has reached the target position
                                        // Update playerTileX and playerTileY if needed
                                        moving=false;
                                        this.dialogueBoxManager.createDialogueBox(this, 'Time to battle!',  () => {
                                            this.handleGameEvent('battle2')
                                        });
                                        globals.npc.trainer6.active=true;
                                        this.playerTileX = targetTileX;
                                        this.playerTileY = targetTileY;
                                        globals.characterPosition.x = this.playerTileX;
                                        globals.characterPosition.y = this.playerTileY;


                                        
                                        
                                    }
                                });
                            }
                        });


                        
                        break;
                        


                        //sequence of events is very confusing.
                       
                    case 'battle2' :
                        console.log('starting battle');
                        // this.scene.start('BattleScene', {condition: 'battle'});
                        this.setKeyboardEnabled(false);

                        globals.sceneManager.transitionTo('BattleScene', { condition: 'battle'});

                        
                        break;
                    case 'finishTutorial2':
                                
                        moving=true;


                        

                        console.log('running battle');
                        const x = 84;
                        const y = 68;

                
                        this.trainer = globals.npc.trainer6;

                        
                        // Calculate the distance to move in the x and y directions
                        const dx = (x - globals.npc.trainer6.x) ;
                        const dy = (y - globals.npc.trainer6.y) ;
                        
                    
                        const s = 300; // Adjust as needed
                        
                        

                        // this.trainer.anims.play(this.walk + 'right', true);
                        console.log('moving y now');
                        this.trainer.sprite.setFrame(0)

                        this.trainer.sprite.anims.play(this.trainer.key + '_walk_' + 'down', true); 

                        // Tween to the target position
                        this.tweens.add({
                            targets: this.trainer.sprite,
                            x: this.trainer.sprite.x,// (this.trainer.x) + (dx*12)
                            y:this.trainer.sprite.y + dy*12,//this.trainer.y
                            duration: dy*s,
                            ease: 'Linear',
                            onComplete: () => {
                                // Player has reached the target position
                                // Update playerTileX and playerTileY if needed
                                // this.trainer.anims.stop();
                                console.log('moving y now');
                                this.trainer.sprite.anims.stop();
                                this.trainer.sprite.setFrame(8)

                                this.trainer.sprite.anims.play(this.trainer.key + '_walk_' + 'right', true);    

                                this.tweens.add({
                                    targets: this.trainer.sprite,
                                    x: (this.trainer.sprite.x) + (dx*12),//this.trainer.x,
                                    y: this.trainer.sprite.y,//this.trainer.y + dy*12
                                    duration: dx*s,
                                    ease: 'Linear',
                                    onComplete: () => {
                                        console.log('completed movement');
                                        this.trainer.sprite.anims.stop();
                                        this.trainer.sprite.destroy();
                                        this.trainer.sprite=null;
                                  
                                        moving=false;
                                        this.trainer.x = 0;
                                        this.trainer.y = 0;
                                       this.setKeyboardEnabled(true);
                                    }
                                });
                            }
                        });
                        /////////////pokemon sprite/////////////

                        console.log('running battle');
                        // const x = 84;
                        // const y = 68;
                        this.trainerSprite.destroy();
                        this.trainerSprite=null;
                                        
                        break;




                    case 'starter' :
                        
                        this.setKeyboardEnabled(false);

                        globals.sceneManager.transitionTo('BattleScene', { condition: 'starter'});


                    default:
                        break;

                    }

}






walkSprite(sprite, x, y)
{
    
    // if (position)
    // {

        console.log('moving pokemon');

        const targetTileX = x; //x 74
        const targetTileY = y; //y 65


        
        // Calculate the distance to move in the x and y directions
        const deltaX = (targetTileX - globals.characterPosition.followingPokemonX) ;
        const deltaY = (targetTileY -globals.characterPosition.followingPokemonY) ;
        
        console.log('deltax', deltaX);
        console.log('deltay', deltaY);
        // const speed = speed; // Adjust as needed
        
        // globals.characterPosition.followingPokemon = globals.partyPokemonData[0];
        // this.playerTileX -  deltaX; 
        console.log('following pokemon', globals.characterPosition.followingPokemon);
        sprite.anims.play(globals.characterPosition.followingPokemon.key + '_walk_' + globals.characterPosition.followingPokemonFacing, true);


            // Tween to the target position
            this.tweens.add({
                targets: sprite,
                x: (sprite.x) + (deltaX*12),
                y:this.sprite.y,
                duration: deltaX*speed,
                ease: 'Linear',
                onComplete: () => {
                    // Player has reached the target position
                    // Update playerTileX and playerTileY if needed
                    sprite.anims.stop();
                    console.log('moving y now');
                    globals.characterPosition.followingPokemonFacing = 'down';
                    sprite.anims.play(globals.characterPosition.followingPokemon.key + '_walk_' + globals.characterPosition.followingPokemonFacing, true);   
                    //animationKey = globals.characterPosition.followingPokemon.key + '_walk_right'; 

                    this.tweens.add({
                        targets: sprite,
                        x: sprite.x,
                        y: sprite.y + deltaY*12,
                        duration: deltaY*speed,
                        ease: 'Linear',
                        onComplete: () => {
                            console.log('completed movement');
                            sprite.anims.stop();
                            globals.followingPokemonX=x;
                            globals.followingPokemonY=y;
                            // this.pokemonSprite.setFrame(this.left)
                            // Player has reached the target position
                            // Update playerTileX and playerTileY if needed
                            // moving=false;
                            // this.createDialogueBox('Time to battle!');
                        }
                    });
                }
            });
            // return;
}


createTree(x, y, spriteKey, key) {
    const newTree = this.add.sprite(x * 12 + 6, y * 12 + 6, spriteKey, 0);
    newTree.setScale(1);
    return {
        key,
        x,
        y,
        destroy: false,
        sprite: newTree
    };
}


setHeart()
{
    if (this.heart)
    {
        // Calculate the health percentage
        const healthPercentage = (globals.characterPosition.followingPokemon.currentHp / globals.characterPosition.followingPokemon.maxHp) * 100;
        // Set the frame of the heart sprite based on the health percentage
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
    }
}



addButtonEventListeners(button, action) {
    // Variable to track whether the button is currently pressed
    let isButtonPressed = false;


    const isTouchInsideButton = (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    };


    // Function to check if the mouse pointer is within the boundaries of the button
    const isPointerInsideButton = (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    };

    // Event listener for mouse down
    button.addEventListener('mousedown', (event) => {
        console.log(`${action} button pressed`);
        isButtonPressed = true;
        this[`${action}ButtonPressed`] = true;
        event.preventDefault(); // Prevent default action
    });

    // Event listener for mouse up
    button.addEventListener('mouseup', (event) => {
        console.log(`${action} button released`);
        isButtonPressed = false;
        this[`${action}ButtonPressed`] = false;
        event.preventDefault(); // Prevent default action
    });

    // Event listener for touch start
    button.addEventListener('touchstart', (event) => {
        console.log(`${action} button touched`);
        isButtonPressed = true;
        this[`${action}ButtonPressed`] = true;
        event.preventDefault(); // Prevent default action
    }, { passive: false });

    // Event listener for touch end
    button.addEventListener('touchend', (event) => {
        console.log(`${action} button touch ended`);
        isButtonPressed = false;
        this[`${action}ButtonPressed`] = false;
        event.preventDefault(); // Prevent default action
    }, { passive: false });

    // Event listener for mouse move on the document
    document.addEventListener('mousemove', (event) => {
        if (!isPointerInsideButton(event) && isButtonPressed) {
            // Simulate a mouseup event if the mouse pointer is outside the button boundaries
            console.log(`${action} button released (outside boundaries)`);
            isButtonPressed = false;
            this[`${action}ButtonPressed`] = false;
            // Dispatch a 'mouseup' event on the button
            button.dispatchEvent(new MouseEvent('mouseup'));
        }
    });

    // Event listener for touch move on the document
    document.addEventListener('touchmove', (event) => {
        if (!isButtonPressed) retButtonPressedurn;
        if (!isTouchInsideButton(event)) {
            console.log(`${action} button released (outside boundaries)`);
            isButtonPressed = false;
            this[`${action}`] = false;
            button.dispatchEvent(new MouseEvent('touchend'));
        }
    });
}





setPlayer(type) {



    const specificCharacters = ['male', 'female', 'female2', 'red'];


    if (!specificCharacters.includes(type)) {


        console.log('Setting sprite of ' + type);
        
        // Destroy existing player sprite if it exists
        if (player && player instanceof Phaser.GameObjects.Sprite) {
            player.destroy();
        }
        console.log('x y and type: ', globals.characterPosition.x, globals.characterPosition.y, type);
        player = this.physics.add.sprite(globals.characterPosition.x * 12 + 6, globals.characterPosition.y * 12 + 6, type); // Set starting position
        player.setScale(1); // Adjust the scale as needed
        
        //console.log(this.pokemonSprite);
        




        this.cameras.main.setBounds(0, 0, 4800, 2400);
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(3);
    

         // Default frames for walk animations
            const defaultFrames = {
                down: [0, 4, 8, 12],
                up: [1, 5, 9, 13],
                left: [2, 6, 10, 14],
                right: [3, 7, 11, 15]
            };
            
            this.createDefaultPlayerAnimations(type, type, defaultFrames, 10);
            // Set the correct texture based on the facing direction for default characters
            player.setTexture(type, {
                left: defaultFrames.left[0],
                right: defaultFrames.right[0],
                up: defaultFrames.up[0],
                down: defaultFrames.down[0]
            }[globals.characterPosition.facing]);



    }


    else
    {


        console.log('setting sprite of ' + type);
        // Check if the player sprite exists
        if (player && player instanceof Phaser.GameObjects.Sprite) {
            // If it exists, destroy it
            player.destroy();
        }
    
        // Get character properties from the globals player object
        const character = globals.player[type];
    
        // Create a new player sprite
        player = this.physics.add.sprite(globals.characterPosition.x * 12 + 6, globals.characterPosition.y * 12 + 6, character.sprite); // Set starting position
        player.setScale(character.scale);
        
        // Set camera bounds and follow the player
        this.cameras.main.setBounds(0, 0, 4800, 2400);
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(3);
    
      
    
    
    
        const frameRate = 15;
        const framesStart = {
            male: { down: [0, 2], left: [6, 8], right: [9, 11], up: [3, 5] },
            female: { down: [0, 3], left: [4, 7], right: [8, 11], up: [12, 15] },
            female2: { down: [0, 3], left: [4, 7], right: [8, 11], up: [12, 15] },
            red: { down: [12, 15], left: [0, 3], right: [4, 7], up: [8, 11] }
        };
    
        this.createPlayerAnimations(type, character.sprite, framesStart[type], frameRate);
    
    
    
        // Set the correct texture based on facing direction
        player.setTexture(character.sprite, {
            left: framesStart[type].left[0],   // Frame number for facing left
            right: framesStart[type].right[0], // Frame number for facing right
            up: framesStart[type].up[0],       // Frame number for facing up
            down: framesStart[type].down[0]    // Frame number for facing down
        }[globals.characterPosition.facing]);
    
        // Set active status for each character type
        // Object.keys(globals.player).forEach(key => {
        //     globals.player[key].active = (key === type);
        // });
        globals.selectedCharacter===type;
    }
    }



createPlayerAnimations(type, spriteKey, framesStart, frameRate) {
    const directions = ['down', 'left', 'right', 'up'];

    directions.forEach(direction => {
        if (!this.anims.exists(`${type}_walk_${direction}`)) {
            this.anims.create({
                key: `${type}_walk_${direction}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { start: framesStart[direction][0], end: framesStart[direction][1] }),
                frameRate: frameRate,
                repeat: -1
            });
        }
    });
}



// Helper function to create animations
createDefaultPlayerAnimations(type, spriteKey, frames, frameRate) {
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(direction => {
        if (!this.anims.exists(type + '_walk_' + direction)) {
            this.anims.create({
                key: type + '_walk_' + direction,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: frames[direction] }),
                frameRate: frameRate,
                repeat: -1 // Repeat the animation indefinitely
            });
        }
    });
}



toggleRun()
{


}


setBike()
{
    //console.log('setting male player');
this.setPlayer('red');
   
}




setPointToMoveEnabled(enabled)
{
    this.pointToMoveEnabled=enabled;

}

getPointToMoveEnabled()
{
    return this.pointToMoveEnabled;

}




drawJoystick() {
    if (!this.joystick) {
        this.joystick = this.add.graphics();
    }

    // Draw the virtual joystick
    this.updateJoystickPosition();
}

updateJoystickPosition() {
    // Get camera position
    const cameraX = this.cameras.main.scrollX;
    const cameraY = this.cameras.main.scrollY;

    // Calculate absolute position of the joystick center relative to the camera
    const absoluteX = cameraX + this.joystickCenterX;
    const absoluteY = cameraY + this.joystickCenterY;

    // Clear previous graphics
    this.joystick.clear();
    // if(joystick)
    // {
    //     this.joystick.destroy();
    // }

    // Draw the virtual joystick at the absolute position
    // this.graphics.fillStyle(0xffffff, 0);
    // this.graphics.fillCircle(absoluteX, absoluteY, this.joystickRadius);
    // Update the position of the joystick graphics
    this.joystick.setX(absoluteX);
    this.joystick.setY(absoluteY);
}

handlePointerMove(pointer) {
    if (this.pointerDown) {
        // Calculate distance between pointer and joystick center
        const distanceX = pointer.x - this.joystickCenterX;
        const distanceY = pointer.y - this.joystickCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // If pointer is within joystick radius, set direction
        if (distance <= this.joystickRadius) {
            this.directionX = distanceX / this.joystickRadius;
            this.directionY = distanceY / this.joystickRadius;
        } else {
            // If pointer is outside joystick radius, set direction towards pointer
            this.directionX = distanceX / distance;
            this.directionY = distanceY / distance;
        }


        // Determine whether to prioritize horizontal or vertical movement
        if (Math.abs(this.directionX) > Math.abs(this.directionY)) {
            // Prioritize horizontal movement
            this.directionY = 0;
        } else {
            // Prioritize vertical movement
            this.directionX = 0;
        }


        // Clamp direction values between -1 and 1
        this.directionX = Phaser.Math.Clamp(this.directionX, -1, 1);
        this.directionY = Phaser.Math.Clamp(this.directionY, -1, 1);

        // Adjust direction values based on specified ranges
        // Adjust directionX values based on specified ranges
        if (this.directionX >= -1 && this.directionX < -0.5) {
            this.directionX = -1;
        } else if (this.directionX >= 0.5) {
            this.directionX = 1;
        } else {
            this.directionX = 0;
        }

        // Adjust directionY values based on specified ranges
        if (this.directionY >= -1 && this.directionY < -0.5) {
            this.directionY = -1;
        } else if (this.directionY >= 0.5) {
            this.directionY = 1;
        } else {
            this.directionY = 0;
        }




        if (!moving&&this.keyboardEnabled===true&&!(this.directionX===0&&this.directionY===0)) { //&&!this.scene.get('MainMenuScene').data.get('mainMenuActive')
            this.movePlayer(this.directionX, this.directionY);
            //console.log('x=' + this.directionX + 'y=' + this.directionY);
        }
     
    }
}

virtualKeyboard()
{
    if (this.aButtonPressed || this.bButtonPressed || this.selectButtonPressed || this.startButtonPressed)
    {
        return true;
    }
    else{
        return false;
    }
}



switchFollowingPokemon(newPokemon)
{
    // if (this.followingPokemon) {
    //     this.followingPokemon.destroy();
    //     this.followingPokemon = null;
    // }
    if (this.pokemonSprite) {this.pokemonSprite.destroy(); this.pokemonSprite = null;}
    

    // Create the Axolot sprite
    globals.characterPosition.followingPokemon=newPokemon;

    

    this.pokemonSprite = this.physics.add.sprite(globals.characterPosition.followingPokemonX*12 + 6, globals.characterPosition.followingPokemonY*12 + 6, globals.characterPosition.followingPokemon.key);
    //console.log(this.playerTileX*12 + 6 + ' & ' +  this.playerTileY*12 + 6);
    // Define the scale of the sprite
    this.pokemonSprite.setScale(1); // Adjust the scale as needed


   

    if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_down')) {
        this.anims.create({
            key: globals.characterPosition.followingPokemon.key + '_walk_down',
            frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [0, 4, 8, 12] }),
            frameRate: 10,
            repeat: -1 // Repeat the animation indefinitely
        });
        }

        if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_up')) {
            this.anims.create({
                key: globals.characterPosition.followingPokemon.key + '_walk_up',
                frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [1, 5, 9, 13] }),
                frameRate: 10,
                repeat: -1 // Repeat the animation indefinitely
            });
        }

        if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_left')) {
            this.anims.create({
                key: globals.characterPosition.followingPokemon.key + '_walk_left',
                frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [2, 6, 10, 14] }),
                frameRate: 10,
                repeat: -1 // Repeat the animation indefinitely
            });
        }

        if (!this.anims.exists(globals.characterPosition.followingPokemon.key + '_walk_right')) {
            this.anims.create({
                key: globals.characterPosition.followingPokemon.key + '_walk_right',
                frames: this.anims.generateFrameNumbers(globals.characterPosition.followingPokemon.key, { frames: [3, 7, 11, 15] }),
                frameRate: 10,
                repeat: -1 // Repeat the animation indefinitely
            });
        }



    // Start with the default animation (e.g., walking down)
    this.pokemonSprite.anims.play(globals.characterPosition.followingPokemon.key + '_walk_down', true);




}



updatePokemonPositionAndAnimation(moveX, moveY, instant = false, x = 0, y = 0, facing = 'up', position = false, speed = 75) {
    
    if (position)
    {

        console.log('moving pokemon');

        const targetTileX = x; //x 74
        const targetTileY = y; //y 65


        
        // Calculate the distance to move in the x and y directions
        const deltaX = (targetTileX - globals.characterPosition.followingPokemonX) ;
        const deltaY = (targetTileY -globals.characterPosition.followingPokemonY) ;
        
        console.log('deltax', deltaX);
        console.log('deltay', deltaY);
        // const speed = speed; // Adjust as needed
        
        // globals.characterPosition.followingPokemon = globals.partyPokemonData[0];
        // this.playerTileX -  deltaX; 
        console.log('following pokemon', globals.characterPosition.followingPokemon);
        this.pokemonSprite.anims.play(globals.characterPosition.followingPokemon.key + '_walk_' + globals.characterPosition.followingPokemonFacing, true);

    

            // Tween to the target position
            this.tweens.add({
                targets: this.pokemonSprite,
                x: (this.pokemonSprite.x) + (deltaX*12),
                y:this.pokemonSprite.y,
                duration: deltaX*speed,
                ease: 'Linear',
                onComplete: () => {
                    // Player has reached the target position
                    // Update playerTileX and playerTileY if needed
                    this.pokemonSprite.anims.stop();
                    console.log('moving y now');
                    globals.characterPosition.followingPokemonFacing = 'down';
                    this.pokemonSprite.anims.play(globals.characterPosition.followingPokemon.key + '_walk_' + globals.characterPosition.followingPokemonFacing, true);   
                    //animationKey = globals.characterPosition.followingPokemon.key + '_walk_right'; 

                    this.tweens.add({
                        targets: this.pokemonSprite,
                        x: this.pokemonSprite.x,
                        y: this.pokemonSprite.y + deltaY*12,
                        duration: deltaY*speed,
                        ease: 'Linear',
                        onComplete: () => {
                            console.log('completed movement');
                            this.pokemonSprite.anims.stop();
                            globals.followingPokemonX=x;
                            globals.followingPokemonY=y;
                            // this.pokemonSprite.setFrame(this.left)
                            // Player has reached the target position
                            // Update playerTileX and playerTileY if needed
                            // moving=false;
                            // this.createDialogueBox('Time to battle!');
                        }
                    });
                }
            });
            return;

    }








    if (x != 0 && y != 0)
    {

    
        let targetX = x * 12 + 6;
        let targetY = y * 12 + 6;

        globals.characterPosition.followingPokemonX = x;
        globals.characterPosition.followingPokemonY = y;


        globals.characterPosition.followingPokemonFacing = facing;
        if (this.pokemonSprite === null)
        {
            this.pokemonSprite = this.physics.add.sprite(targetX, targetY, globals.characterPosition.followingPokemon.key);
            this.pokemonSprite.setScale(1);
        }

        // Move the sprite instantaneously
        this.pokemonSprite.x = targetX;
        this.pokemonSprite.y = targetY;
    
        // Update the Pokémon's position to follow the player
        

        return;

    }


    if (moveX !== 0 || moveY !== 0) {

       




        if (instant)
        {

            // Update the Pokémon's position to follow the player
            let targetX = this.playerTileX * 12 + 6;
            let targetY = this.playerTileY * 12 + 6;

            globals.characterPosition.followingPokemonX = this.playerTileX;
            globals.characterPosition.followingPokemonY = this.playerTileY;


            if (moveX < 0) {
                // animationKey = globals.characterPosition.followingPokemon.key + '_walk_left';
                globals.characterPosition.followingPokemonFacing = 'left';
                //targetX += 12;
            } else if (moveX > 0) {
                // animationKey = globals.characterPosition.followingPokemon.key + '_walk_right';
                globals.characterPosition.followingPokemonFacing = 'right';
                //targetX -= 12;
            } else if (moveY < 0) {
                // animationKey = globals.characterPosition.followingPokemon.key + '_walk_up';
                globals.characterPosition.followingPokemonFacing = 'up';
                //targetY += 12;
            } else if (moveY > 0) {
                // animationKey = globals.characterPosition.followingPokemon.key + '_walk_down';
                globals.characterPosition.followingPokemonFacing = 'down';
                //targetY -= 12;
            }
            if (this.pokemonSprite === null)
            {
                this.pokemonSprite = this.physics.add.sprite(this.playerTileX*12 + 6, this.playerTileY*12 + 6, globals.characterPosition.followingPokemon.key);
                this.pokemonSprite.setScale(1);
            }

            // Move the sprite instantaneously
            this.pokemonSprite.x = targetX;
            this.pokemonSprite.y = targetY;


        }
        else
        {
            // Update the Pokémon's position to follow the player
            let targetX = this.playerTileX * 12 + 6;
            let targetY = this.playerTileY * 12 + 6;

            
            globals.characterPosition.followingPokemonX = this.playerTileX;
            globals.characterPosition.followingPokemonY = this.playerTileY;

            //console.log('setting pokemon x and y: ' + globals.characterPosition.followingPokemonX + ', ' + globals.characterPosition.followingPokemonY)



            // Determine the appropriate animation based on the player's movement direction
            let animationKey;
            if (moveX < 0) {
                animationKey = globals.characterPosition.followingPokemon.key + '_walk_left';
                globals.characterPosition.followingPokemonFacing = 'left';
                //targetX += 12;
            } else if (moveX > 0) {
                animationKey = globals.characterPosition.followingPokemon.key + '_walk_right';
                globals.characterPosition.followingPokemonFacing = 'right';
                //targetX -= 12;
            } else if (moveY < 0) {
                animationKey = globals.characterPosition.followingPokemon.key + '_walk_up';
                globals.characterPosition.followingPokemonFacing = 'up';
                //targetY += 12;
            } else if (moveY > 0) {
                animationKey = globals.characterPosition.followingPokemon.key + '_walk_down';
                globals.characterPosition.followingPokemonFacing = 'down';
                //targetY -= 12;
            }




            // Play the animation
            if (this.pokemonSprite === null)
            {
                this.pokemonSprite = this.physics.add.sprite(this.playerTileX*12 + 6, this.playerTileY*12 + 6, globals.characterPosition.followingPokemon.key);
                this.pokemonSprite.setScale(1);
            }







            // this.pokemonSprite.anims.play(animationKey, true);

            // Check if the animation is paused, resume it; otherwise, play the new animation
            if (this.pokemonSprite.anims.isPaused && this.pokemonSprite.anims.currentAnim && this.pokemonSprite.anims.currentAnim.key === animationKey) {
                this.pokemonSprite.anims.resume();
            } else if (!this.pokemonSprite.anims.isPlaying || this.pokemonSprite.anims.currentAnim.key !== animationKey) {
                this.pokemonSprite.anims.play(animationKey, true);
            }






            let duration = 150;
            if (globals.player.red.active || globals.isRunning)
            {
                duration = 75;
            }

            // Create a tween to slide the sprite to the new destination
            this.tweens.add({
                targets: this.pokemonSprite,
                x: targetX,
                y: targetY,
                duration: duration, // Adjust the duration as needed for the desired speed
                ease: 'Linear', // Use linear easing for constant speed
                onComplete: () => {
                    // Stop the animation when the tween completes
                    // this.pokemonSprite.anims.stop();
                    this.pokemonSprite.anims.pause();

                }
            });
        }


        
    }
}



// healPokemon()
// {
//     if (globals.partyPokemonData)
//     {
//         for (const pokemon of globals.partyPokemonData) {
//             //sets all pokemon to full hp
//             pokemon.currentHp = pokemon.maxHp;
//             for (const move of pokemon.moves) {
//                 move.currentPP = move.maxPP;
//             }
//             pokemon.status='none';
//         }
//     }
// }

movePlayer(x, y) {
    // Check if the player is already moving
    



    // if(globals.player.male.active)
    if (globals.selectedCharacter === 'male')
    {
        this.playerTexture='male'
        this.walk='male_walk_';
        this.left= 7;
        this.right = 10;
        this.up = 4;
        this.down = 1;
        //console.log('player is male');
    }
    else 
    // if (globals.player.female.active)
    if (globals.selectedCharacter === 'female')


    {
        this.playerTexture='female'
        this.walk='female_walk_';
        this.left= 4;
        this.right = 8;
        this.up = 12;
        this.down = 0;
        //console.log('player is female');
    }
    else 
    // if (globals.player.female2.active)
    if (globals.selectedCharacter === 'female2')


    {
        this.playerTexture='female2'
        this.walk='female2_walk_';
        this.left= 4;
        this.right = 8;
        this.up = 12;
        this.down = 0;
        //console.log('player is female');
    }
    else 
    // if (globals.player.red.active)
    if (globals.selectedCharacter === 'red')


    {
        this.playerTexture='red';
        this.walk='red_walk_';
        this.left= 0;
        this.right = 4;
        this.up = 8;
        this.down = 12;
        //console.log('player is female');
    }

    else
    {
        this.playerTexture=globals.selectedCharacter;
        this.walk=globals.selectedCharacter + '_walk_';
        this.left= 2;
        this.right = 3;
        this.up = 1;
        this.down = 0;
    }
   



    if (moving) return;
    moving = true;
    
    // Calculate the target position
    const targetTileX = this.playerTileX + x;
    const targetTileY = this.playerTileY + y;

    // Determine the new direction based on input
    let newDirection = null;
    if (x < 0) {
        newDirection = 'left';
    } else if (x > 0) {
        newDirection = 'right';
    } else if (y < 0) {
        newDirection = 'up';
    } else if (y > 0) {
        newDirection = 'down';
    }
    
    // Get the previous direction
    let previousDirection = globals.characterPosition.facing;

    // Update the player's facing direction
    globals.characterPosition.facing = newDirection;
    

    // Play turning animation or set frame to face the new direction without walking
    

    
    ///////collision with objects///////
    
    let object = false;
    let newObject=false;
    //for (let x = 0; x < 6; x++) {
    if (this.trees.length > 0) {
        // Iterate over each tree in the trees array
        this.trees.forEach((tree) => {
            // Check if the current tree should not be destroyed
            if (!tree.destroy) {
                    //console.log('checking trees');
                    newObject = ((targetTileY === tree.y-1 ||targetTileY === tree.y || targetTileY === tree.y+1) && targetTileX === tree.x);
                    if (newObject) {
                            console.log('setting boolean collision with object to true ');
                            object = newObject;
                            console.log(this.trees);
                    } 
            }
        });
    } 

   
    // Iterate over each tree in the chests array
    // globals.chests.forEach((item) => {

    for (let i = 0; i < globals.chests.length; i++) {
        const item = globals.chests[i];
        //console.log('checking chests');
        newObject = (targetTileY === item.y && targetTileX === item.x);
        if (newObject) {
                console.log('setting boolean collision with object to true ');
                object = newObject;
                // console.log(this.trees);
        }        
    // });
    }
    // console.log(globals.npc[0].name)
    // console.log(globals.chests[0])
    // console.log(globals.npcIdle[0].name)

    // for (let i = 0; i < globals.npcIdle.length; i++) {
    //     const item = globals.npcIdle[i];

    for (const key in globals.npcIdle) {
        const item = globals.npcIdle[key];
        // console.log(item);
        // console.log(globals.npcIdle[i].name)
        newObject = (targetTileY === item.y && targetTileX === item.x);
        if (newObject) {
                console.log('setting boolean collision with object to true ');
                object = newObject;
                // console.log(this.trees);
        }        
    // });
    }

 
       // Iterate over each tree in the chests array
    //    globals.npc.forEach((item) => {
        for (const key in globals.npc) {
            const item = globals.npc[key];
        //console.log('checking chests');
        newObject = (targetTileY === item.y && targetTileX === item.x);
        if (newObject) {
                console.log('setting boolean collision with object to true ');
                object = newObject;
                // console.log(this.trees);
        }        
    // });

        }


        if (!globals.characterPosition.followingPokemon && 
            (
                (targetTileX === this.starterPokemon[0].x && targetTileY === this.starterPokemon[0].y) ||
                (targetTileX === this.starterPokemon[1].x && targetTileY === this.starterPokemon[1].y) ||
                (targetTileX === this.starterPokemon[2].x && targetTileY === this.starterPokemon[2].y)
            )
        ) {
            object = true;
        }


    
 
    /////////////////////////////////////


    // If the new direction is different from the old direction, just turn without moving
    if (newDirection !== previousDirection) {
        // // Play walking animation for a short duration (just for turning)
        player.anims.play(this.walk + newDirection, true);
        setTimeout(() => {
            player.anims.stop();
            player.setTexture(this.playerTexture, {
                left: this.left, // Example frame number for facing left
                right: this.right, // Example frame number for facing right
                up: this.up, // Example frame number for facing up
                down: this.down // Example frame number for facing down
            }[newDirection]);
            globals.characterPosition.facing = newDirection;
            //console.log('turning player and not moving.');
            //console.log('old direction=' + previousDirection + 'new direction=' + newDirection);
            moving=false;
            return;


        }, 100); // Adjust the duration as needed
        

        
        // moving=false;
        //console.log('turning player and not moving.');
        //console.log('old direction=' + previousDirection + 'new direction=' + newDirection);
        return;
    }else 
    if ((targetTileX >= 0 
        && targetTileX < this.collision2D[0].length 
        && targetTileY >= 0 && targetTileY < this.collision2D.length 
        && this.collision2D[targetTileY][targetTileX] === 0) 
        && (newDirection === previousDirection) 
  
        //&& !(targetTileX === 31 && targetTileY === 188)
        //&& !(targetTileX === 52 && targetTileY === 188)
        //&& !(targetTileX === 79 && targetTileY === 126)
        //&& !(targetTileX === 91 && targetTileY === 66)
        //&& !(targetTileX === 161 && targetTileY === 110)
        && !object
        ) {
        // Set the player as moving
        
        // player.anims.play(this.walk + newDirection, true);
        const currentAnimationKey = this.walk + newDirection;

       
    if (player.anims.isPaused && player.anims.currentAnim && player.anims.currentAnim.key === currentAnimationKey) {
        // If the animation is paused and it's the correct animation, resume it
        player.anims.resume();
    } else if (!player.anims.isPlaying || !player.anims.currentAnim || player.anims.currentAnim.key !== currentAnimationKey) {
        // Play the new animation if it's not already playing or if it's a different animation
        player.anims.play(currentAnimationKey, true);
    }
    
     

        if (globals.partyPokemonData.length > 0)
        {
            this.updatePokemonPositionAndAnimation(x, y);
        }

        // Update the player's tile position
        this.playerTileX = targetTileX;
        this.playerTileY = targetTileY;

        // Calculate the target position for the player sprite
        let targetX = (this.playerTileX + 0.5) * tileSize; // Assuming tileSize is defined
        let targetY = (this.playerTileY + 0.5) * tileSize;


        // Check if the target tile is a door and handle teleportation
        let teleport = false;

        const door = {
            door1: { x:65, y:44, x1:11, y2:193, name : 'enterhome' },
            door2: { x:11, y:194, x1:65, y2:45, name : 'exithome' },
            door3: { x:73, y:44, x1:31, y2:193, name : 'entershop' },
            door4: { x:31, y:194, x1:73, y2:45, name : 'exitshop' },
            door5: { x:80, y:125, x1:51, y2:193, name : 'entershop' },
            door6: { x:51, y:194, x1:80, y2:126, name : 'exitshop' },
            door7: { x:150, y:116, x1:51, y2:193, name : 'entershop2' },
            door8: { x:51, y:194, x1:150, y2:117, name : 'exitshop2' },
            door9: { x:223, y:48, x1:72, y2:189, name : 'enterhut' },
            door10: { x:72, y:190, x1:223, y2:49, name : 'exithut' },
            door11: { x:81, y:44, x1:94, y2:192, name : 'enteroldmanhouse' },
            door12: { x:94, y:193, x1:81, y2:45, name : 'exitoldmanhouse' },
            door13: { x:48, y:31, x1:146, y2:193, name : 'enterlibrary' },
            door14: { x:146, y:194, x1:48, y2:32, name : 'exitlibrary' },
        };

        //this.previousTileX = null;
        //this.previousTileY = null;
        
        //console.log('targetTileX = ' + targetTileX);
        //console.log('targetTileY = ' + targetTileY);
        let spawn = false;
        for (const key in door) {
            const doorCoords = door[key];
            //console.log('doorcoordsx of ' + doorCoords.name + ' = ' + doorCoords.x);
            //console.log('doorcoordsy of ' + doorCoords.name + ' = ' + doorCoords.y);
            if (targetTileX === doorCoords.x && targetTileY === doorCoords.y) {

                console.log('Player entered door');

                if (doorCoords.name === 'entershop' || doorCoords.name === 'entershop2') {

                    globals.characterPosition.previousTileX = this.playerTileX;
                    globals.characterPosition.previousTileY = this.playerTileY + 1;
                    if (doorCoords.name === 'entershop2')
                    {
                      
                    }
                    console.log('setting this.previousTileX: ' + globals.characterPosition.previousTileX + ' and this.previousTileY: ' + globals.characterPosition.previousTileY);
                }
                

                if (doorCoords.name === 'exitshop' || doorCoords.name === 'exitshop2')
                {
                    console.log('loading this.previousTileX: ' + globals.characterPosition.previousTileX + ' and this.previousTileY: ' + globals.characterPosition.previousTileY);
                    this.isInShop = false;
                    console.log('setting this isinshop to false ');
                    this.playerTileX = globals.characterPosition.previousTileX;
                    this.playerTileY = globals.characterPosition.previousTileY;
                    targetX = (this.playerTileX + 0.5) * tileSize; // Assuming tileSize is defined
                    targetY = (this.playerTileY + 0.5) * tileSize;
                    teleport = true;
                    console.log('exiting shop');
                    
                }
                else {
                    console.log('teleporting');
                    this.playerTileX = doorCoords.x1;
                    this.playerTileY = doorCoords.y2;
                    targetX = (this.playerTileX + 0.5) * tileSize; // Assuming tileSize is defined
                    targetY = (this.playerTileY + 0.5) * tileSize;
                    teleport = true;
                    //console.log('teleporting');
                }
                if (doorCoords.name === 'enterhome' ||doorCoords.name === 'entershop2' )
                {
                    console.log('healing pokemon');
                   


                    globals.monsterManager.healPartyMonsters();

                    // if (globals.partyPokemonData)
                    // {
                    //     for (const pokemon of globals.partyPokemonData) {
                    //         //sets all pokemon to full hp
                    //         pokemon.currentHp = pokemon.maxHp;
                    //         for (const move of pokemon.moves) {
                    //             move.currentPP = move.maxPP;
                    //         }
                    //     }
                    // }
                }
                if (doorCoords.name === 'enterhome')
                {
                    globals.characterPosition.spawn = 'home';
                    // this.createDialogueBox('Your pokemon have been healed. Checkpoint Updated!')
                    console.log('setting spawn to home');
                    spawn = true;
                }
                if (doorCoords.name === 'entershop2')
                {
                    spawn = true;
                    globals.characterPosition.spawn = 'shop';
                    // this.createDialogueBox('Your pokemon have been healed. Checkpoint Updated!')
                    console.log('setting spawn to shop');
                    this.isInShop = true;
                    console.log('setting this isinshop true ');
                }

                //break; // Exit loop once a matching door is found
            }
        }





        // If teleporting, set the player's position instantly without tween
        if (teleport) {
            player.x = targetX;
            player.y = targetY;
            if (globals.partyPokemonData.length > 0)
            {
                this.updatePokemonPositionAndAnimation(x, y);
            }
            // // Move the camera instantly to the player's new position
            // this.cameras.main.scrollX = player.x - this.cameras.main.width / 2;
            // this.cameras.main.scrollY = player.y - this.cameras.main.height / 2;
            setTimeout(() => {
                        //blackScreen.destroy(); // Remove the black screen rectangle
                        moving = false; // Reset moving flag
                        player.anims.stop();
                        player.setTexture(this.playerTexture, {
                            left: this.left, // Example frame number for facing left
                            right: this.right, // Example frame number for facing right
                            up: this.up, // Example frame number for facing up
                            down: this.down // Example frame number for facing down
                        }[newDirection]);

                        if (spawn)
                        {
                            this.dialogueBoxManager.createDialogueBox(this, 'Your pals have been healed. Checkpoint Updated! Tip: You can use the PC (A or spacebar)')
                        }
                        
                       
                    }, 100); // Duration in milliseconds
            //moving = false;



        } 
    
        else {
            // Create a tween for smooth movement to the target position
            if (player.anims.isPaused) {
                player.anims.resume(); // Resume the paused animation
            }

            let duration = 150
            // if (globals.player.red.active || globals.isRunning)
            if (globals.selectedCharacter === 'red' || globals.isRunning)
            {
                duration = 75;
            }

            // let currentFrameIndex = null; 

            this.tweens.add({
                targets: player,
                x: targetX,
                y: targetY,
                duration: duration,
                ease: 'Linear',
                // onStart: () => {
                //     // Store the current frame index when the tween starts
                //     if (player.anims.currentAnim && player.anims.currentFrame) {
                //         currentFrameIndex = player.anims.currentFrame.index;
                //     }
                // },
                onComplete: () => {

                    
                    player.anims.pause();

          

                    if (player && player instanceof Phaser.GameObjects.Sprite) {
                        // console.log('Player texture before check:', this.playerTexture);
                        // console.log('Context of this:', this);
                        // Check if current texture differs from desired texture
                        if (this.playerTexture !== player.texture.key) {
                            player.setTexture(this.playerTexture, {
                                left: this.left,
                                right: this.right,
                                up: this.up,
                                down: this.down
                            }[newDirection]);
                        }
                        else
                        {
                            // console.log('not setting texture for ' + this.playerTexture);
                        }
                    }




                    

                    


                  


                    let trainerCanSeePlayer = false;
                    let defeated = false;
                    let selectedTrainer = false;

                    for (const x in globals.npc) {

                        // let allTrainersCanSeePlayer = true; // Assume all trainers can see the player initially

                        selectedTrainer = globals.npc[x];

                        const sightRange = selectedTrainer.sightRange;


                        
                        if (selectedTrainer.facing === 'left') {
                            trainerCanSeePlayer = 
                                this.playerTileX <= selectedTrainer.x && 
                                this.playerTileX >= selectedTrainer.x - sightRange && 
                                this.playerTileY === selectedTrainer.y;
                        } else if (selectedTrainer.facing === 'up') {
                            trainerCanSeePlayer = 
                                this.playerTileX === selectedTrainer.x &&
                                this.playerTileY >= selectedTrainer.y - sightRange &&
                                this.playerTileY <= selectedTrainer.y;
                        } else if (selectedTrainer.facing === 'right') {
                            trainerCanSeePlayer = 
                                this.playerTileX >= selectedTrainer.x &&
                                this.playerTileX <= selectedTrainer.x + sightRange && 
                                this.playerTileY === selectedTrainer.y;
                        } else if (selectedTrainer.facing === 'down') {
                            trainerCanSeePlayer = 
                                this.playerTileX === selectedTrainer.x &&
                                this.playerTileY >= selectedTrainer.y &&
                                this.playerTileY <= selectedTrainer.y + sightRange;
                        }
                        
                        
                        

                       if (trainerCanSeePlayer)
                    
                       {
                            if (selectedTrainer.defeated)
                            {
                                defeated = selectedTrainer.defeated;
                            }


                            break;
                       }
                       

                        
                    }






                    if (trainerCanSeePlayer&&!defeated) {



                        if(selectedTrainer.arena)
                        {
                            console.log('player is an arena.')
                            moving=false;
                            globals.characterPosition.x = this.playerTileX;
                            globals.characterPosition.y = this.playerTileY;
                            // this.scene.start('BattleScene');
                            // this.createDialogueBox('You are about to battle your nemesis.')
                            console.log('action');
                            return;
                        }



                        if (globals.partyPokemonData.length === 0) {
                            //this.setKeyboardEnabled(false);
                            //game.scene.start('StarterPokemonScene');
                        //} 
                            globals.characterPosition.facing='up';
                            this.playerTileY-=1;
                            let playerTargetX = (this.playerTileX + 0.5) * tileSize; // Assuming tileSize is defined
                            let playerTargetY = (this.playerTileY + 0.5) * tileSize;
                            //player.anims.play(this.playerTexture, true);
                            player.anims.play(this.walk + 'up', true);

                            this.tweens.add({
                                targets: player,
                                x: playerTargetX,
                                y: playerTargetY,
                                duration: 150,
                                ease: 'Linear',
                                onComplete: () => {
                                    // Stop the walking animation when the tween completes
                                    player.anims.stop();
                                    player.setTexture(this.playerTexture, this.up);
                                    player.y = playerTargetY;
                                    moving=false;
                                    
                                }
                            });
                            globals.characterPosition.x = this.playerTileX;
                            globals.characterPosition.y = this.playerTileY;
                            return;
        
                        }
                    
                        else{
                            ///////////////start of backup///////////////
                        


                            // Handle trainer battle

                            // Calculate the target position for the trainer sprite
                            const trainerTargetX = (this.playerTileX+0.5) * tileSize; // Assuming tileSize is defined
                            const trainerTargetY = (this.playerTileY+0.5) * tileSize; // Assuming tileSize is defined
                            this.setKeyboardEnabled(false);

                            let duration = 2;
                            let xdif = 0;
                            let ydif = 0;
                            if (selectedTrainer.facing === 'up')
                            {
                                xdif = 0;
                                ydif = 12;
                                duration = (selectedTrainer.y - this.playerTileY) * 150;
                                console.log('duration is: ' + duration);

                            }
                            else if (selectedTrainer.facing === 'left')
                            {
                                xdif = 12;
                                ydif = 0;
                                duration = (selectedTrainer.x - this.playerTileX) * 150;
                                console.log('duration is: ' + duration);
                            }


                            selectedTrainer.sprite.anims.play(selectedTrainer.key + '_walk_' + selectedTrainer.facing, true);
                            
                            moving = false;
                            console.log('you encountered a trainer battle');
                            this.tweens.add({
                                targets: selectedTrainer.sprite,
                                x: trainerTargetX + xdif,
                                y: trainerTargetY + ydif,
                                duration: duration, // Adjust the duration as needed
                                ease: 'Linear',
                                onComplete: () => {
                                    
                                    
                                    
                                    // Trainer reached the player, start the battle or any other actions
                                    console.log('Trainer reached the player');
                                    selectedTrainer.sprite.anims.stop();
                                    selectedTrainer.sprite.setTexture(selectedTrainer.key, selectedTrainer.frame);
                                    selectedTrainer.active=true;
                                    // game.scene.start('BattleScene');
                                    globals.sceneManager.start('BattleScene');
                                    // Start the battle or perform other actions here
                                }

                            });


                            ///////////////end of backup///////////////
                        }


                        // Code for trainer battle goes here
                    } 

                    
                    else
                    // Check if the target tile is an encounter tile
                    if (this.encounter2D && this.encounter2D[targetTileY][targetTileX] !== 0 && !globals.repel.active) {
                        
                        if (targetTileX > 69 && targetTileY > 52 && targetTileX < 78 && targetTileY < 61)
                        {
                            //route 1
                            if (!globals.progress.tooltipStarter && !globals.characterPosition.tooltip){
                                globals.progress.tooltipStarter=true;
                                globals.progress.tooltipStarter2=true;
                                globals.characterPosition.tooltip=true;
                                this.dialogueBoxManager.createDialogueBox(this, 'Which monster do you want? Press Spacebar or A to select');
                            }
                        }
                        else
                        {
                            if (globals.characterPosition.tooltip)
                            {
                                globals.progress.tooltipStarter=true;
                                globals.progress.tooltipStarter2=true;
                            }
                            if (!globals.progress.tooltipStarter2){
                                globals.progress.tooltipStarter2=true;
                                this.dialogueBoxManager.createDialogueBox(this, 'Wrong patch of grass! Look in the small patch of grass below your house');
                            }
                            

                        }

                   
                        /////////////////////////////

                        let levelMin = 0;
                        let levelMax = 0;
                        if (this.playerTileX < 60) {
                            globals.characterPosition.route = 0;
                            // console.log('route: 0');
                            levelMin=5;
                            levelMax = 10;
                        } else if (this.playerTileX < 84 && this.playerTileY < 32) {
                            globals.characterPosition.route = 1;
                            // console.log('route: 1');
                            levelMin=10;
                            levelMax = 15;
                        } else if (this.playerTileX < 129 && this.playerTileY < 49) {
                            globals.characterPosition.route = 2;
                            // console.log('route: 2');
                            levelMin=10;
                            levelMax = 15;
                        } else if (this.playerTileX < 78 && this.playerTileY < 61) {
                            globals.characterPosition.route = 3;
                            // console.log('route: 3'); //
                            levelMin = 3;
                            levelMax = 3;
                        } else if (this.playerTileX < 140 && this.playerTileY < 130) {
                            globals.characterPosition.route = 4;
                            // console.log('route: 4'); //level 0
                            levelMin=15;
                            levelMax = 20;
                        } else if (this.playerTileX < 163 && this.playerTileY < 100)  {
                            globals.characterPosition.route = 5;
                            // console.log('route: 5'); //level 15-20
                            levelMin=20;
                            levelMax = 30;
                        } else if (this.playerTileX < 256 && this.playerTileY < 58) {
                            globals.characterPosition.route = 6;
                            // console.log('route: 6');
                            levelMin=40;
                            levelMax = 50;
                        } else if (this.playerTileX < 263 && this.playerTileY < 130) {
                            globals.characterPosition.route = 7;
                            // console.log('route: 7');
                            levelMin=30;
                            levelMax =40;
                        }
                        




                        if (globals.progress.tooltipStarter && !this.dialogueBox)
                        {
                            console.log('you have completed the beginner tooltip');
                            if (!this.tooltipRoute[globals.characterPosition.route]) //making sure i havent walked in the grass yet
                            {
                                if (this.pokemonSprite) //making sure i have a pokemon
                                {



                         
                                    const sumLevels = globals.partyPokemonData.reduce((sum, pokemon) => sum + pokemon.level, 0);
                                    // const averageLevel = sumLevels / globals.partyPokemonData.length;

                                    let color;
                                    if (sumLevels>= levelMin && sumLevels <= levelMax) {
                                        color = '#FF8C00'; // Black
                                    } else if (sumLevels > levelMax) {
                                        color = '#006400'; // Green
                                    } else if (sumLevels < levelMin) {
                                        color = '#8B0000'; // Red
                                    }





                                    // console.log('creating dialogue box');
                                    this.tooltipRoute[globals.characterPosition.route] = true;
                                    // this.createDialogueBox('Route ' + globals.characterPosition.route + ' Levels: ' + levelMin + ' - ' + levelMax, true, null, color);
                                    this.dialogueBoxManager.createDialogueBox(this, 'Route ' + globals.characterPosition.route + ' Levels: ' + levelMin + ' - ' + levelMax, [], true, false, null, color);
                                //    constructor(scene, message, endCallbacks = [], timer = false, short = false, confirmationActions = null, color = '#000000') {

                                }
                                else
                                {
                                    // console.log('dont create the route info box because no pokemon yet')
                                }

                               }
                            else
                            {
                                // console.log('tooltiproute flag is true already triggered');
                            }
                        }
                        
                        
                        
                        const randomChance = Math.floor(Math.random() * 10);
                        if (randomChance === 0) {
                            if (globals.partyPokemonData.length === 0) {
                                // this.setKeyboardEnabled(false);
                                // game.scene.start('StarterPokemonScene');
                            } 
                            else {
                              
                                moving=false;
                                this.setKeyboardEnabled(false);
                                // game.scene.start('BattleScene');
                                if (this.dialogueBox) {
                                    console.log('dialoguebox is existing');
                                    this.dialogueBox.destroy();
                                    this.dialogueBox=null;
                                }
                                if (this.newDialogueBox)
                                {
                                    this.newDialogueBox.shutdown();
                                    // this.newDialogueBox = null;
                                }
                                globals.sceneManager.start('BattleScene');
                            }
                        }
                    }
                    //if 
                    else if (globals.repel.active)
                    {   
                        globals.repel.count-=1;
                        // console.log(globals.repel.count);
                        if (globals.repel.count <= 0)
                        {
                            globals.repel.active=false;
                            
                        }
                    }
                    else{
                        // console.log('clearing tooltiproute');
                        this.tooltipRoute.fill(false);
                    
                    }

                    // Whenever the character moves one step
                    this.stepCounter++;

                    if (this.stepCounter >= 5) {
                        this.stepCounter = 0; // Reset the counter

                        if (globals.characterPosition.followingPokemon) {
                            const pokemon = globals.characterPosition.followingPokemon;
                            pokemon.bondLevel += 0.1;
                            
                            // Check if the bond level has reached 1
                            if (pokemon.bondLevel >= 1) {
                                pokemon.bondLevel = 0; // Reset bond level

                                // Check the current bond and update accordingly
                                const currentBondIndex = this.bondLevels.indexOf(pokemon.bond);
                                if (currentBondIndex < this.bondLevels.length - 1) {
                                    pokemon.bond = this.bondLevels[currentBondIndex + 1];
                                    this.dialogueBoxManager.createDialogueBox(this, 'Your Pals bond level increased! Congratulations! You are now: ' + pokemon.bond, [], true);
                                } else {
                                    // If already at max bond, inform the player
                                    // const dialogueBox = new DialogueBox(this, 'Your Pokémon’s bond level is already at the highest level: ' + pokemon.bond);
                                }
                            }

                        }

                        this.applyStatusEffects();
                    }
                                        

                    // Reset moving flag
                    moving = false;
                }

                //}
                
            });
            //moving=false;
        }
        
    } else {
        player.anims.play(this.walk + newDirection, true);
    setTimeout(() => {
        player.anims.stop();
        player.setTexture(this.playerTexture, {
            left: this.left, // Example frame number for facing left
            right: this.right, // Example frame number for facing right
            up: this.up, // Example frame number for facing up
            down: this.down // Example frame number for facing down
        }[newDirection]);
        //console.log('Player on collision tile, animation played for 0.25 seconds.');
        moving = false; // Set moving to false after the animation duration
    }, 250); // Duration in milliseconds
        
        
        // If the target tile is a collision tile, just turn the player without moving
       // moving = false;
        //console.log('you are hitting a collision tile');
        
    }

    // Update global character position
    globals.characterPosition.x = this.playerTileX;
    globals.characterPosition.y = this.playerTileY;
    

}

applyStatusEffects() {
    globals.partyPokemonData.forEach(pokemon => {
        if (pokemon.remainingStatusSteps > 0 && (pokemon.status === "Burn" || pokemon.status === "Poison") && pokemon.currentHp > 0) {
            pokemon.currentHp -= 10;
            pokemon.currentHp = Math.max(0, pokemon.currentHp);
            pokemon.remainingStatusSteps--;


            // Get the camera's position
            const cameraX = this.cameras.main.scrollX;
            const cameraY = this.cameras.main.scrollY;

            const centerX = cameraX + game.config.width / 2;
            const centerY = cameraY + game.config.height / 2;

            // Determine flash color based on status
            const flashColor = pokemon.status === "Burn" ? 0xff0000 : 0x800080; // Red for Burn, Purple for Poison

            // Create a colored rectangle that covers the entire screen
            const flashRect = this.add.rectangle(centerX, centerY, game.config.width, game.config.height, flashColor);

            // Set its alpha to 1 (fully opaque)
            flashRect.setAlpha(1);

            // Tween the alpha from 1 to 0 to make it disappear gradually
            this.tweens.add({
                targets: flashRect,
                alpha: 0,
                duration: 500, // Adjust the duration as needed
                onComplete: () => {
                    // Remove the rectangle once the tween is complete
                    flashRect.destroy();
                }
            });



            
            if (pokemon.remainingStatusSteps === 0) {
                pokemon.status = 'none';
                
            }

            if (globals.partyPokemonData.every(pokemon => pokemon.currentHp === 0)) {
                console.log('all pokemon fainted teleporting home.');
                if (globals.characterPosition.spawn === 'home') {
                    this.setCharacterPosition(65, 45);
                } else {
                    this.setCharacterPosition(150, 117);
                }
                globals.monsterManager.healPartyMonsters();
            }
        }
    });
}



// Function to enable/disable keyboard input externally
setKeyboardEnabled(enabled) {


    this.keyboardEnabled = enabled;

    
}
setEmiiter(enabled)

{
    if (enabled) {
        // Enable the keyboard emitter
        this.keyboardEmitter.on('keydown', this.handleKeyDown, this);
        this.keyboardEmitter.on('keyup', this.handleKeyUp, this);
    } else {
        // Disable the keyboard emitter
        this.keyboardEmitter.off('keydown', this.handleKeyDown, this);
        this.keyboardEmitter.off('keyup', this.handleKeyUp, this);
    }
}

setCharacterPosition(x, y)
{
    globals.characterPosition.x = x;
    globals.characterPosition.y = y;
    this.playerTileX = x;
    this.playerTileY = y;
    globals.characterPosition.followingPokemonX = x;
    globals.characterPosition.followingPokemonY = y;
    if (this.pokemonSprite)
    {
        this.pokemonSprite.x = globals.characterPosition.followingPokemonX;
        this.pokemonSprite.y = globals.characterPosition.followingPokemonY;
    }
    if (player)
    {
        player.x=x*12+6;
        player.y=y*12+6;
    }
    

}

}


