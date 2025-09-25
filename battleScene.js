class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
        this.moveQueue = [];
    
        this.battleUI = null;
        this.currentTurn=null;

        this.battleSize=6;
        this.playerMonsters = new Array(3).fill(null);
        this.enemyMonsters = new Array(3).fill(null);
        this.partyQueue = [];
        this.battleResultsQueue = [];
        this.accumulatedXP = [];


        this.giveAxe = false;

        this.dialogueContainer = null;
       

        this.tutorial = false;
        this.finishTutorial = false;

        this.dialogueBox= null;
      
        this.text = null;
      
        
     
        this.locked=false;
        this.locked2=false;
        this.feinted=false;
        this.defeated=false;
        this.playerDefeated=false;

        this.selectedNPC = null;

        this.pokemonFaught = [];
        this.defeatedMonsters = [];

        let scale = 2;
        this.moves = [
            { key: 'Fireblast', name: 'Fireblast', scale: scale },
            { key: 'Poison', name: 'Poison', scale: scale },
            { key: 'Storm', name: 'Storm', scale: scale },
            { key: 'Plasma', name: 'Plasma', scale: scale },
            { key: 'Darkness', name: 'Darkness', scale: scale },
            { key: 'Blast', name: 'Blast', scale: scale },
            { key: 'Arrow', name: 'Arrow', scale: scale },
            { key: 'Mountain', name: 'Mountain', scale: scale },
            { key: 'Hydra', name: 'Hydra', scale: scale },
            { key: 'Tornado', name: 'Tornado', scale: scale }
        ];
    }

    preload() {

        this.load.image('dialogBox', 'images/NinjaAdventure/HUD/Dialog/DialogueBoxSimple.png');

        // Load assets for the battle scene
        this.load.image('battleBackground', 'images/battleBg.png');
 

        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
            this.load.image(pokemon.key + 'Faceset', `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/Faceset.png`);
        });


        this.moves.forEach((move) => {
            this.load.spritesheet(move.key, `images/elements.png`, { frameWidth: 64, frameHeight: 64 });
        });

        // Load the pokemoves spritesheets
        this.load.spritesheet('Fireball', 'images/NinjaAdventure/FX/Projectile/Fireball.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('EnergyBall', 'images/NinjaAdventure/FX/Projectile/EnergyBall.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('Rock', 'images/NinjaAdventure/FX/Projectile/Rock.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('Rain', 'images/NinjaAdventure/FX/Particle/Rain.png', { frameWidth: 8, frameHeight: 8 });
        this.load.spritesheet('RazorLeaf', 'images/NinjaAdventure/FX/Elemental/Plant/SpriteSheet.png', { frameWidth: 40, frameHeight: 28 });
        this.load.spritesheet('CanonBall', 'images/NinjaAdventure/FX/Projectile/CanonBall.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('Thunder', 'images/NinjaAdventure/FX/Elemental/Thunder/SpriteSheet.png', { frameWidth: 20, frameHeight: 28 });


        //pokeball 28 pokeballs 64x64 each 32 frames for each
        this.load.spritesheet('Pokeball', 'images/pokeballs.png', {frameWidth: 64, frameHeight: 64});



        for (const pokemonType in globals.pokemonTypeColor) {
            const color = globals.pokemonTypeColor[pokemonType];
            const key = pokemonType + 'explosion';
            const imagePath = `images/Orb/${color}explosion.png`;
            const frameWidth = 256;
            const frameHeight = 256;
            this.load.spritesheet(color + 'orb', imagePath, { frameWidth, frameHeight, color });
        }
        


    }

    create(data) {
        this.battleButtonScene = globals.controlGameInstance.scene.getScene('BattleButtonsScene')
        // this.dialogueBoxManager = new DialogueBoxManager(this);
        this.dialogueBoxManager = globals.dialogueBoxManager;

        this.playerMonsters = new Array(3).fill(null);
        this.enemyMonsters = new Array(3).fill(null);

    

        this.generateMonsterData();
      

       
        if (!globals.characterPosition.starter)
        {

            this.dialogueBoxManager.createDialogueBox(this,'Try to catch the monster! Throw a capture sphere! Click items and select the capture sphere.');

        }



        this.battleUI = new BattleUI(this, this.playerMonsters, this.enemyMonsters); //, this.currentPokemonData, this.randomPokemonData, this.currentPokemonData2, this.randomPokemonData2



        this.battleUI.createBackground();
       
     
     
        this.setCurrentTurn(this.playerMonsters[0]); 

       
        this.finishTutorial = false;
        
        if (data.condition === 'battle') {
            this.tutorial = true;
            this.finishTutorial = true;
        }
            




    }

    generateMonsterData() { //isDoubleBattle = false
        this.pokemonData = globals.monsterManager.partyMonsters;
        const availablePokemon = this.pokemonData.filter(pokemon => pokemon.currentHp > 0);
        this.originalPokemonData = globals.originalPokemonData;
   

        for (let i = 0; i < 3; i++) {
            if (availablePokemon[i]) {
                this.playerMonsters[i] = availablePokemon[i];
                this.pokemonFaught.push(availablePokemon[i]);
            }
        }



        if (this.loadTrainerPokemon()) return;
   
          let count = Math.floor(Math.random() * 3) + 1;
        
        if (!globals.characterPosition.starter)
        {
            count = 1;
        }



      


        for (let i = 0; i < count; i++) {
            this.enemyMonsters[i] = this.getRandomPokemon();
        }

      

        
    }
    
    getRandomPokemon() {
        let randomPokemonData;
        
        if (globals.fishing) {
            // Handle fishing logic
            const waterTypePokemon = this.originalPokemonData.filter(pokemon => pokemon.type === 'Water');
            if (waterTypePokemon.length > 0) {
                this.randomIndex = Phaser.Math.RND.integerInRange(0, waterTypePokemon.length - 1);
                const name = JSON.parse(JSON.stringify(waterTypePokemon[this.randomIndex])).name;
                const level = Phaser.Math.RND.integerInRange(20, 25);
                randomPokemonData = new Monster(name, level);
            } else {
                randomPokemonData = this.getRandomPokemonFromOriginal();
            }
        } else {
            const currentRouteName = 'route' + globals.characterPosition.route;
            const routeData = globals.routes[currentRouteName];
            const routePokemonData = this.originalPokemonData.filter(pokemon => routeData.pokemon.includes(pokemon.key));
    
            if (routePokemonData.length > 0) {
                this.randomIndex = Phaser.Math.RND.integerInRange(0, routePokemonData.length - 1);
                const name = JSON.parse(JSON.stringify(routePokemonData[this.randomIndex])).name;
                const minLevel = routeData.levelRange[0];
                const maxLevel = routeData.levelRange[1];
                const level = Phaser.Math.RND.integerInRange(minLevel, maxLevel);
                randomPokemonData = new Monster(name, level + 1);
            } else {
                console.error("No Pokémon found in the current route:", globals.characterPosition.route);
            }
        }
    
        return randomPokemonData;
    }
    
    getRandomPokemonFromOriginal() {
        this.randomIndex = Phaser.Math.RND.integerInRange(0, this.originalPokemonData.length - 1);
        const name = JSON.parse(JSON.stringify(this.originalPokemonData[this.randomIndex])).name;
        const level = Phaser.Math.RND.integerInRange(20, 25);
        return new Monster(name, level);
    }
    

    loadTrainerPokemon() {
        for (const key in globals.npc) {
            const npc = globals.npc[key];
            if (npc.active) {
                console.log(`${key} is active`);
                this.selectedNPC = npc;
    
                // Create Monster instances for each of the trainer's Pokémon
                this.trainerPokemonData = npc.pokemon.map(pokemonName => {
                    return new Monster(pokemonName, npc.level + 1);
                });
    
            
                const maxPokemon = Math.min(3, this.trainerPokemonData.length);
                for (let i = 0; i < maxPokemon; i++) {
                    this.enemyMonsters[i] = (this.trainerPokemonData[i]);
                    console.log(`Loaded NPC's Pokémon ${i + 1}:`, this.enemyMonsters[i]);
                 
                }
                return true;
              
            }
        }
        return false;
    }

   
handleMoveSelected(move, target= null) {
    // Check if the game is locked
    if (this.isGameLocked()) {
        return; // Don't proceed if locked
    }

    // Prompt to click items if in tutorial mode
    if (!globals.characterPosition.starter) {
        this.dialogueBoxManager.createDialogueBox(this, 'Click Items');
        return; // Prevent move selection during tutorial
    }

    // Check if move is usable
    if (move.currentPP <= 0) {
        console.log('Out of PP');
        return; // Don't proceed if out of PP
    }

    // Handle move selection if conditions allow
    console.log('Running move:', move.name);
    this.defeated = false;

    if (target)
    {
        console.log('running move 3, current turn: ', this.currentTurn.name);;
        this.createMove3(move, this.currentTurn, target); // Execute the move

    }
    else
    {  console.log('running move 2');
        this.createMove2(move, true); // Execute the move
    }
    
    move.currentPP -= 1; // Deduct PP from the move
}

handleEnter() { // Party
    // Check if the game is locked
    if (this.isGameLocked()) {
        return;
    }

  
    // Prompt to click items if in tutorial mode
    if (!globals.characterPosition.starter) {
        this.dialogueBoxManager.createDialogueBox(this, 'Click Items');
        return; // Prevent opening party during tutorial
    }

    // Removed party window logic
    // console.log(this.playerMonsters[0]);
    // console.log('Party window logic removed');
      globals.sceneManager.relaunch('PartyScene', { 
            originScene: 'BattleScene', 
            currentPokemonData: this.playerMonsters[0], //this.currentPokemonData
            action: 'switch',
            from: 'BattleScene',
            // double: this.currentTurn
        });
    
    
    
}

handleShift() { // Items
    // Check if the game is locked
    if (this.isGameLocked()) {
        return;
    }

    globals.sceneManager.transitionTo('ItemsScene', { originScene: 'BattleScene', action: 'useItem', from: 'BattleScene', selectedPokemon: this.currentTurn}, true);  // Pauses the current scene
    
    
    
}

runAway() {
    // Check if the game is locked
    if (this.isGameLocked()) {
        return;
    }

    // Prompt to click items if in tutorial mode
    if (!globals.characterPosition.starter) {
        this.dialogueBoxManager.createDialogueBox(this, 'Click Items');
        return;
    }

    // If starter is false and it's not a trainer battle, attempt to escape
    if (!this.selectedNPC && this.playerMonsters.some(pokemon => pokemon.currentHp > 0)) {
        const averageLevelDifference = this.calculateAverageLevelDifference();

        // Calculate escape probability based on the average level difference
        const escapeSuccessRate = this.calculateEscapeSuccessRate(averageLevelDifference);
        const escapeChance = Math.random();

        // Check if the escape attempt is successful
        if (escapeChance <= escapeSuccessRate) {
            console.log('Successfully escaped');
            globals.sceneManager.transitionTo('MapScene');
        } else {
            console.log('Failed to escape, initiating battle move');
            this.defeated = false;
            // this.enemyAttack();
        }
    } else if (this.selectedNPC) {
        this.dialogueBoxManager.createDialogueBox(this, 'You cant run from a trainer battle!');
    }
}




calculateAverageLevelDifference() {
    const playerAverageLevel = this.playerMonsters
        .filter(pokemon => pokemon && pokemon.level != null) // Filter out null or undefined Pokémon
        .reduce((sum, pokemon) => sum + pokemon.level, 0) / 
        this.playerMonsters.filter(pokemon => pokemon && pokemon.level != null).length;

    const enemyAverageLevel = this.enemyMonsters
        .filter(pokemon => pokemon && pokemon.level != null) // Filter out null or undefined Pokémon
        .reduce((sum, pokemon) => sum + pokemon.level, 0) / 
        this.enemyMonsters.filter(pokemon => pokemon && pokemon.level != null).length;

    return playerAverageLevel - enemyAverageLevel;
}


isGameLocked() {
    const locked = this.locked;
    const inDialogue = this.dialogueContainer;
    const hasActiveDialogue = globals.dialogueBoxManager.hasActiveDialogue();
    const notInBattleScene = globals.sceneManager.currentScene !== 'BattleScene';
    const isDefeated = this.defeated;
    // console.log('locked: ', this.locked, 'defeated: ', this.defeated);
    // console.log('not in battle scene: ', notInBattleScene)
   

    return locked || inDialogue || hasActiveDialogue || notInBattleScene || isDefeated;
}


// Function to calculate escape success rate based on level difference
calculateEscapeSuccessRate(levelDifference) {
    // Base escape success rate
    let baseSuccessRate = 0.5;
    let percentperlevel = 0.1;

    // Modify the base success rate based on the level difference
    // You can adjust the success rate modifier based on your game's balance
    if (levelDifference > 0) {
        baseSuccessRate += levelDifference * percentperlevel; // For each level higher, increase success rate by 10%
    } else if (levelDifference < 0) {
        baseSuccessRate -= Math.abs(levelDifference) * percentperlevel; // For each level lower, decrease success rate by 10%
    }

    // Ensure the success rate is within bounds
    baseSuccessRate = Math.max(0.1, Math.min(baseSuccessRate, 0.9)); // Clamp between 0.1 and 0.9

    return baseSuccessRate;
}







shutdown() {
    console.log('running shutdown');
    if (this.dialogueBoxManager) {
        this.dialogueBoxManager.cleanUpAll();
        // this.dialogueBoxManager = null;
    }
    if(this.dialogueContainer)
    {
        this.dialogueContainer.destroy();
        this.dialogueContainer = null;
    }
    

    this.locked=false;
    this.locked2=false;
    this.feinted=false;
    this.defeated=false;
    this.playerDefeated=false;
    this.selectedNPC = false;
    this.pokemonFaught = [];
    this.defeatedMonsters = [];
    this.moveQueue=[];

     // Reset all active NPCs
     Object.values(globals.npc).forEach(npc => {
        if (npc.active) npc.active = false;
    });

    
}  


async pokeball(target) {
    this.locked = true;
    
    const targetEnemy = target;
    const currentPlayer = this.currentTurn;
    console.log('pokeball coming from ' + this.currentTurn.name + ' and going to ' + target.name);
    
    const x = currentPlayer.sprite.x;
    const y = currentPlayer.sprite.y;
    const targetX = targetEnemy.sprite.x;
    const targetY = targetEnemy.sprite.y;
    
    // Create and animate the Pokeball throw
    let moveSprite = this.physics.add.sprite(x, y, 'Pokeball');
    moveSprite.setScale(4);
    moveSprite.anims.play('PokeballThrow');
    this.physics.moveTo(moveSprite, targetX, targetY, 500);

    // Wait for the Pokeball to reach the target
    await new Promise(resolve => {
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                if (moveSprite.y <= targetY) {
                    resolve();
                    this.time.removeAllEvents();
                }
            }
        });
    });

    moveSprite.destroy();

    if (this.selectedNPC) {
        this.dialogueBoxManager.createDialogueBox(this, "You can't catch a trainer's pokemon");
        this.locked = false;
        return;
    }

    // Animate Pokeball roll
    moveSprite = this.physics.add.sprite(targetX, targetY, 'Pokeball');
    moveSprite.setScale(4);
    targetEnemy.sprite.destroy();
    
    await new Promise(resolve => {
        moveSprite.anims.play('PokeballRoll');
        moveSprite.on('animationcomplete', resolve);
    });

    // Calculate catch chance
    let playerLevel = currentPlayer.level;
    let pokemonLevel = targetEnemy.level;
    let baseCatchRate = 0.75;
    let levelDifference = playerLevel - pokemonLevel;
    
    // ... (rest of your catch rate calculation logic)

    
    if (levelDifference > 0) {
        baseCatchRate += levelDifference * 0.05; // Decrease catch rate for higher-level Pokémon
        console.log('base catch rate is : ', baseCatchRate)
    } else if (levelDifference < 0) {
        baseCatchRate -= Math.abs(levelDifference) * 0.05; // Increase catch rate for lower-level Pokémon
        console.log('base catch rate is : ', baseCatchRate)
    }

    baseCatchRate = Math.max(0.1, Math.min(0.95, baseCatchRate));

    const chanceToCatch = baseCatchRate + (1 - (targetEnemy.currentHp / targetEnemy.maxHp)) * 0.25;
    const randomNumber = Math.random();


    console.log('catch rate = ' + randomNumber + '>' +chanceToCatch);
    
    // Check if the catch is successful
    let catchSuccessful = randomNumber < chanceToCatch;

    if (!globals.characterPosition.starterCaught)
    {
        globals.characterPosition.starterCaught=true;
        catchSuccessful = true;
        // globals.characterPosition.starter=true;
    }
    

    // let catchSuccessful = Math.random() < chanceToCatch;

    // if (!globals.characterPosition.starterCaught) {
    //     globals.characterPosition.starterCaught = true;
    //     catchSuccessful = true;
    // }

    if (catchSuccessful) {
        await new Promise(resolve => {
            moveSprite.anims.play('PokeballCaught');
            moveSprite.on('animationcomplete', resolve);
        });

        globals.monsterManager.add(targetEnemy);
        
       // Assuming monsterToRemove is the monster object you want to remove
        const indexToRemove = this.enemyMonsters.findIndex(monster => monster === targetEnemy);

        if (indexToRemove !== -1) {
            // Update enemyMonsters array
            this.enemyMonsters[indexToRemove] = null;

            // Update pkmDetailsBox
            if (this.pkmDetailsBox && this.pkmDetailsBox.enemyMonsters && this.pkmDetailsBox.enemyMonsters[indexToRemove]) {
                this.pkmDetailsBox.enemyMonsters[indexToRemove].monster = null;
                this.pkmDetailsBox.enemyMonsters[indexToRemove].lastMonster = targetEnemy;
            }
            await this.battleUI.updateHealthBars(true);
           
            console.log(`Monster removed from index ${indexToRemove}`);
        } else {
            console.log("Monster not found in the enemyMonsters array");
        }
        globals.characterPosition.starter = true;
        this.battleResultsQueue.push({ type: 'pokemon', parameter: targetEnemy });
        console.log('push after adding pokeball', this.battleResultsQueue);
    } else {
        await new Promise(resolve => {
            moveSprite.anims.play('PokeballRelease');
            moveSprite.on('animationcomplete', resolve);
        });

        targetEnemy.sprite = this.battleUI.loadPokemonSprite(450, 200, this.targetEnemy.key, 5, 'down');
        console.log('You failed to catch the pokemon');
    }

    moveSprite.destroy();
    this.locked = false;
    this.defeated = false;
}


async pokeball2(target) {
    this.locked = true;
    
    // Find the first alive enemy monster
    // const targetEnemy = this.enemyMonsters.find(monster => monster.currentHp > 0);
    const targetEnemy=target;
    // const currentPlayer =  this.playerMonsters.find(monster => monster.currentHp > 0);
    const currentPlayer = this.currentTurn;
    console.log('pokeball coming from ' + this.currentTurn.name + ' and going to ' + target.name);
    const x = currentPlayer.sprite.x;
    const y = currentPlayer.sprite.y;
    const targetX = targetEnemy.sprite.x;
    const targetY = targetEnemy.sprite.y;
    // Create a new move sprite with physics enabled
    let moveSprite = this.physics.add.sprite(x, y, 'Pokeball');
    moveSprite.setScale(4);
    moveSprite.anims.play('PokeballThrow');

    // Move the move sprite towards the target
    this.physics.moveTo(moveSprite, targetX, targetY, 500);

    // Listen for the animation complete event
    moveSprite.on('animationcomplete', () => {
        moveSprite.destroy(); // Destroy move sprite after animation completes
    });

    let isEventProcessed = false;
    // Check the position of the fireball continuously
    this.time.addEvent({
        delay: 100, // Check every 100 milliseconds
        loop: true,
        callback: () => {

            if (!isEventProcessed && (moveSprite.y <= targetY)) {

                //console.log('Pokeball collided with pokemon');
                isEventProcessed = true;
                moveSprite.destroy();
                moveSprite = null;
                // this.time.addEvent({
                //     delay: 500,
                //     callback: () => {
                        //moveSprite.body.stop();
                //console.log('Stopping the Pokeball');
                if (this.selectedNPC)
                {   
                    this.dialogueBoxManager.createDialogueBox(this, 'You cant catch a trainer pokemon');
                    this.locked=false;
                    return;
                }
            
                moveSprite = this.physics.add.sprite(targetX, targetY, 'Pokeball');
                moveSprite.setScale(4);
                moveSprite.anims.play('PokeballRoll');
                targetEnemy.sprite.destroy();
                moveSprite.on('animationcomplete', () => {
                    // Calculate the chance to run the action
                    
                    
                    ////////
                    let playerLevel = currentPlayer.level;
                    let pokemonLevel = targetEnemy.level;

                    let baseCatchRate = 0.75; // Base catch rate for low-level Pokémon
                    let levelDifference = playerLevel - pokemonLevel;
                    console.log('level difference', levelDifference);

                    if (levelDifference > 0) {
                        baseCatchRate += levelDifference * 0.05; // Decrease catch rate for higher-level Pokémon
                        console.log('base catch rate is : ', baseCatchRate)
                    } else if (levelDifference < 0) {
                        baseCatchRate -= Math.abs(levelDifference) * 0.05; // Increase catch rate for lower-level Pokémon
                        console.log('base catch rate is : ', baseCatchRate)
                    }

                    baseCatchRate = Math.max(0.1, Math.min(0.95, baseCatchRate));

                    const chanceToCatch = baseCatchRate + (1 - (targetEnemy.currentHp / targetEnemy.maxHp)) * 0.25;
                    const randomNumber = Math.random();


                    console.log('catch rate = ' + randomNumber + '>' +chanceToCatch);

                    // Check if the catch is successful
                    let catchSuccessful = randomNumber < chanceToCatch;

                    if (!globals.characterPosition.starterCaught)
                    {
                        globals.characterPosition.starterCaught=true;
                        catchSuccessful = true;
                        // globals.characterPosition.starter=true;
                    }
                    
             
                    if (catchSuccessful) {//randomNumber < chanceToRunAction
                        // Run the action
                        // Your action code here

                        moveSprite.anims.play('PokeballCaught');
                        moveSprite.on('animationcomplete', () => {
                            moveSprite.anims.stop(); // Stop the animation

                         
                            globals.monsterManager.add(targetEnemy);
                            this.locked=false;
                            //this.pokemonData.push(this.randomPokemonData);
                            console.log('setting starter to true');
                            globals.characterPosition.starter = true;
                            // this.scene.get('MapScene').setKeyboardEnabled(true);
                            // if (!globals.npc.trainer6.defeated)
                            // {

                            // this.caughtPokemonQueue.push(targetEnemy);
                            this.battleResultsQueue.push({ type: 'pokemon', parameter: targetEnemy });
                            console.log('push after adding pokeball', this.battleResultsQueue);


                            // try {
                            //     this.battleResultsQueue.push({ type: 'pokemon', parameter: targetEnemy });
                            //     console.log('push after adding pokeball', this.battleResultsQueue);
                            //   } catch (error) {
                            //     console.error('Error occurred:', error);
                            //   }
                            /*
                            globals.sceneManager.start('PokemonDetailsScene', { 
                                pokemon: targetEnemy, 
                                originScene: this.scene.key,
                                onClose: () => this.returnToMapScene(),
                                action: 'caught',
                                from: 'BattleScene'
                            });
                            */
                          
                        })
                    }
                    else{
                        moveSprite.anims.play('PokeballRelease');
                        moveSprite.on('animationcomplete', () => {
                            moveSprite.anims.stop(); // Stop the animation

                            targetEnemy.sprite = this.battleUI.loadPokemonSprite(450, 200, this.targetEnemy.key, 5, 'down');
                            moveSprite.destroy();


                            console.log('You failed to catch the pokemon'); 
                            this.locked=false;
                            this.defeated=false;
                     
                            // this.enemyAttack();
                        })  
                        
                                            
                    } 
                });
            }
}
});
}


/*
    dialogueContainer.destroy();
    this.dialogueContainer = null; // Reset the dialogue container reference
    this.shutdown();
    let condition = null;
    if (this.giveAxe) {
        condition = 'giveAxe';
        this.giveAxe = false;
    } else if (this.feinted) {
        condition = 'feinted';
        this.feinted = false;
    }
    
    if (condition) {
        globals.sceneManager.start('MapScene', { condition: condition });
    } else {
        this.scene.get('MapScene').setKeyboardEnabled(true);
        globals.sceneManager.start('MapScene');
    }*/

finalizeBattle(parameter = '') {


    console.log('running onclose (finalize battle)');
    setTimeout(() => {

        this.scene.get('MapScene').setKeyboardEnabled(true);
        console.log('returning to map scene');
        if (!globals.npc.trainer6.defeated) {
            console.log('starter is true');
            // this.scene.start('MapScene', { condition: 'starter' });
            globals.sceneManager.start('MapScene', { condition: 'starter' });
        } else if (this.finishTutorial)
            {
                globals.sceneManager.start('MapScene', {condition: 'finishTutorial2'});

            } 
        else {

            // console.log('switching (transitioning');
            // // this.scene.switch('MapScene');
            // globals.sceneManager.start('MapScene');







            if (parameter === 'Enemy Defeated' || 'Player Defeated')
                {
                     let condition = null
                    if (this.giveAxe) {
                        condition = 'giveAxe';
                        this.giveAxe = false;
                    } else if (this.feinted) {
                        condition = 'feinted';
                        this.feinted = false;
                    }
                    
                    if (condition) {
                        globals.sceneManager.start('MapScene', { condition: condition });
                    } else {
                        this.scene.get('MapScene').setKeyboardEnabled(true);
                        globals.sceneManager.start('MapScene');
                    }
                }
                else if (parameter === 'finishTutorial')
                {
                    globals.sceneManager.start('MapScene', {condition: 'finishTutorial'}); 
            
                }
            globals.sceneManager.syncSecondGameWindow();
                



        }
    }, 50);


    




}


endBattle(type = null, parameter = null) {
    console.log('running endbattle: ', type, parameter);
    // Other end battle logic...
    console.log('before if statement for endballe.. ', this.battleResultsQueue);
    if (type === 'battle'  && this.battleResultsQueue.length > 0 && this.battleResultsQueue[0].type==='pokemon')
    {
        console.log('pushing battle');
        console.log('queue before push', this.battleResultsQueue)
        this.battleResultsQueue.push({ type: type, parameter: parameter});
        console.log('after shift', this.battleResultsQueue);
    }
    else if (type === 'battle' && this.battleResultsQueue.length > 0 && this.battleResultsQueue[0].type==='battle')
    {
        this.finalizeBattle(parameter);
        return;
        
    }
//     if (this.battleResultsQueue>0 && type === 'pokemon')
//    {
//         this.processNextCaughtPokemon();

//    }
   
   this.processNextCaughtPokemon();

    

}
processNextCaughtPokemon() {
    console.log('battleresultsqueue before shift: ', this.battleResultsQueue)

    if (this.battleResultsQueue.length > 0) {
        console.log('battleresultsqueue before shift: ', this.battleResultsQueue)
        
        const currentResult = this.battleResultsQueue.shift();
        let nextResult = this.battleResultsQueue[0];
        console.log('battleresultsqueue after shift: ', this.battleResultsQueue)
        // const nextPokemon = this.caughtPokemonQueue.shift();
        globals.sceneManager.start('PokemonDetailsScene', { 
            pokemon: currentResult.parameter, 
            originScene: this.scene.key,
            onClose: () => this.endBattle(nextResult.type, nextResult.parameter),
            action: 'caught',
            from: 'BattleScene'
        });
    } else {
        this.finalizeBattle();
    }
}


returnToMapScene() {
    console.log('running onclose');
    setTimeout(() => {

        this.scene.get('MapScene').setKeyboardEnabled(true);
        console.log('returning to map scene');
        if (!globals.npc.trainer6.defeated) {
            console.log('starter is true');
            // this.scene.start('MapScene', { condition: 'starter' });
            globals.sceneManager.start('MapScene', { condition: 'starter' });
        } else {
            console.log('switching (transitioning');
            // this.scene.switch('MapScene');
            globals.sceneManager.start('MapScene');
        }
    }, 50);
}
runEnemyDefeatExit(){
    if (this.finishTutorial) {
        this.dialogueBoxManager.createDialogueBox(this, 'Good Job you have won!', () => {
            this.shutdown();
            globals.sceneManager.start('MapScene', {condition: 'finishTutorial2'});
        });
    } else {
        const eyeQuantity = globals.items.find(item => item.key === 'eye')?.quantity || 0;
        const dialogueText = `You defeated the ${this.isTrainerBattle() ? 'trainer' : 'enemy'}!\nYou now have ${globals.characterPosition.money}$. (+ ${moneyGained}$)`;
        this.dialogueContainer = this.displayDialogue(dialogueText, eyeQuantity >= 1);
    }
}

runPlayerDefeatExit()
{
      // Set character position based on spawn point
      const spawnPosition = globals.characterPosition.spawn === 'home' ? {x: 65, y: 45} : {x: 150, y: 117};
      this.scene.get('MapScene').setCharacterPosition(spawnPosition.x, spawnPosition.y);
  
     
      // Display appropriate dialogue
      if (this.finishTutorial) {
          this.dialogueBoxManager.createDialogueBox(this, 'You have failed. Respawning!', () => {
              this.shutdown();
              this.endBattle('battle', 'finishTutorial')
              return;
              globals.sceneManager.start('MapScene', {condition: 'finishTutorial'}); 
            
          });
      }
       else {
          this.dialogueContainer = this.displayDialogue('Your monsters all fainted!');
      }
}



createItemWindow()
{
    globals.sceneManager.transitionTo('ItemsScene', { originScene: 'BattleScene', action: 'useItem', from: 'BattleScene'}, true);  // Pauses the current scene
}



    displayDialogue(message, emblem = false , type = null) {
        // Disable interaction with other game objects
        this.input.stopPropagation();

        const dialogueContainer = this.add.container(0, 0);
        

        const invisibleRectangle = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0);
        invisibleRectangle.setDepth(1);
        
        invisibleRectangle.setOrigin(0);
        invisibleRectangle.setInteractive(); // Make the rectangle interactive
        dialogueContainer.add(invisibleRectangle); // Add the rectangle to the dialogue container
    
        // Background for the dialogue box
        const background = this.add.rectangle(0, 0, 400, 100, 0x000000, 0.8);
        background.setOrigin(0);
        dialogueContainer.add(background);
    
        // Text for the message
        let text = this.add.text(200, 50, message, { fontFamily: 'Arial', fontSize: '16px', fill: '#ffffff' });
        text.setOrigin(0.5);
        dialogueContainer.add(text);


        if (emblem) {
         
            const typeCounts = {};

            // Count the occurrences of each type
            for (const monster of this.defeatedMonsters) {
                if (typeCounts[monster.type]) {
                    typeCounts[monster.type]++;
                } else {
                    typeCounts[monster.type] = 1;
                }
            }
            // Now create orbs for each type, considering the count
            for (const type in typeCounts) {
                if (globals.pokemonTypeColor.hasOwnProperty(type)) {
                    const color = globals.pokemonTypeColor[type];
                    // if (this._pokemonTypeColor.hasOwnProperty(type)) {
                        // Check if the current type matches the randomPokemonData.type
                        if (type === this.randomPokemonData.type) {
                            // Get the color associated with the type
                            const color = globals.pokemonTypeColor[type];
                            const count = typeCounts[type];
            
                            // Create and display the sprite with the appropriate color
                            let sprite = this.add.sprite(440, 240, color + 'orb', 4);
                            sprite.setScale(0.4);
                            sprite.setDepth(1);

                            text.setText(text.text + `\n You gained ${count} ${color} orb(s)`);
                            
                            for (const item of globals.items)
                            {
                                // console.log('item is: ' + item.name)
                                if (item.name === color + 'orb')
                                {
                                    // console.log('Items found')
                                    item.quantity+=count;

                                }


                            }


                            // Create animation for the sprite
                            const explosionKey = color + 'explosion';
                            if (!this.anims.exists(explosionKey)) {
                                this.anims.create({
                                    key: explosionKey,
                                    frames: this.anims.generateFrameNumbers(color + 'orb', { start: 4, end: 9 }),
                                    frameRate: 10,
                                    repeat: -1
                                });
                            }
                            sprite.anims.play(explosionKey, true);
        
                            break;
                        }
                    }
            }
        }
        
 
    
        // Set the size of the container
        dialogueContainer.setSize(400, 100);
    
        // Make the dialogue box interactive
        dialogueContainer.setInteractive();
    
        // Handle pointer down event on the invisible rectangle
        invisibleRectangle.on('pointerdown', () => {
            // this.finalizeBattle();
            

            dialogueContainer.destroy();
            this.dialogueContainer = null; // Reset the dialogue container reference


         
          


            this.shutdown();

            this.endBattle('battle', type);

            return;
            if(this.giveAxe)
            {
                    this.giveAxe = false;
                    // this.scene.start('MapScene', { condition: 'giveAxe' });
                    globals.sceneManager.start('MapScene', { condition: 'giveAxe' });

                    return;
            }
            if (this.feinted)
            {   

     
                this.feinted = false;
                // this.scene.start('MapScene', { condition: 'feinted' });
                globals.sceneManager.start('MapScene', { condition: 'feinted' });

            
            }
            else
            {
                this.scene.get('MapScene').setKeyboardEnabled(true);
                // this.scene.switch('MapScene');

                globals.sceneManager.start('MapScene');
            }
  
        });
    
        // Position the dialogue box in the center of the screen
        dialogueContainer.setPosition(this.cameras.main.centerX - 200, this.cameras.main.centerY - 50);
    
        // Return the dialogue box container
        return dialogueContainer; // No need to return if you don't use the returned value
    }
    

    //battle logic

    handlePlayerPokemonDefeat() {
        this.feinted = true;
     
        this.playerDefeated = true;
        this.handleTotalDefeat();
    
    }
    
    handleTotalDefeat() {
        globals.monsterManager.resetEffects();
        globals.monsterManager.healPartyMonsters();
        
        // Reset all active NPCs
        Object.values(globals.npc).forEach(npc => {
            if (npc.active) npc.active = false;
        });
    
        //this.endBattle('Player Defeated');

        //return;
        // Set character position based on spawn point
        const spawnPosition = globals.characterPosition.spawn === 'home' ? {x: 65, y: 45} : {x: 150, y: 117};
        this.scene.get('MapScene').setCharacterPosition(spawnPosition.x, spawnPosition.y);
    
       
        // Display appropriate dialogue
        if (this.finishTutorial) {
            this.dialogueBoxManager.createDialogueBox(this, 'You have failed. Respawning!', () => {

                this.shutdown();
                this.endBattle('battle' , 'finishTutorial');
                // globals.sceneManager.start('MapScene', {condition: 'finishTutorial'}); 
              
            });
        } else {
            this.dialogueContainer = this.displayDialogue('Your monsters all fainted!', false, 'Player Defeated');
        }
    }
 
   
    async awardExperiencePointsOld(defeatedPokemon) {
        let xpModifier = this.getXPModifierBasedOnDifficulty();
        console.log('Running levelup');
        await globals.monsterManager.levelUp(defeatedPokemon.level * xpModifier, this);
    }
    async awardExperiencePoints(defeatedPokemons) {
        let xpModifier = this.getXPModifierBasedOnDifficulty();
        let totalXP = 0;
    
        // Calculate total XP from all defeated Pokémon
        for (let defeatedPokemon of defeatedPokemons) {
            totalXP += defeatedPokemon.level * xpModifier;
            console.log('totalxp at: ', totalXP);
        }
    
        console.log('Running levelup with total XP:', totalXP);
        await globals.monsterManager.levelUp(totalXP, this);
    }
    
    getXPModifierBasedOnDifficulty() {
        switch(globals.difficulty) {
            case 'easy': return 20;
            case 'medium': return 10;
            case 'hard': return 5;
            default: return 10;
        }
    }
    
    isTrainerBattle() {
        return !!this.selectedNPC;
    }
    
    
    
    getNextAvailablePokemon() {
        return this.trainerPokemonData.find(pokemon => 
            pokemon.currentHp > 0 && !this.enemyMonsters.includes(pokemon)
        );
    }
    
  
    
    
    
   
    
  
    
    hasRemainingTrainerPokemon() {
          // Check if trainerPokemonData is initialized
        if (!this.trainerPokemonData || this.trainerPokemonData.length === 0) {
            return false;  // Return false if the trainer has no Pokémon data
        }
        // Filter out null values from enemyMonsters
        const activeEnemyMonsters = this.enemyMonsters.filter(pokemon => pokemon !== null);
    
        // Check if the trainer has any Pokémon left with HP > 0 that aren't already in enemyMonsters
        return this.trainerPokemonData.some(pokemon => 
            pokemon && pokemon.currentHp > 0 && !activeEnemyMonsters.includes(pokemon)
        );
    }
    
    

    /*
    async handleEnemyPokemonDefeat() {
        this.defeated = true;
        if (this.feinted)
        {
            // console.log('weird, enemy died when you are defeated...');
        }
        // Handle defeat of enemy's Pokémon
        // Example:

        // Check if any Pokémon in the player's party are remaining
       
        // this.currentPokemonData = this.levelUp(this.currentPokemonData, this.randomPokemonData.level*10)

        let xpModifier = 10;
        

        if (globals.difficulty === 'easy')
        {
            // console.log('difficulty easy')
            xpModifier = 20
        }
        else if (globals.difficulty === 'medium')
        {
            // console.log('difficulty medium')
            xpModifier = 10;
        }
        else if (globals.difficulty === 'hard')
        {
            // console.log('difficulty hard');
            xpModifier = 5;
        }

        // await this.levelUp(this.randomPokemonData.level*xpModifier);
        console.log('running levelup');
        // await globals.monsterManager.levelUp(this.randomPokemonData.level*xpModifier, this);


        //handle levelup somewhere else.





        if (this.selectedNPC) {
            // Trainer's Pokémon defeated
            // console.log('Switching trainer Pokémon');
            let nextPokemon = null;
    
            // Find the next Pokémon with HP greater than 0
            this.trainerPokemonData.forEach(pokemon => {
                if (pokemon.currentHp > 0 && !nextPokemon) {
                    nextPokemon = pokemon;
                    // console.log('found next pokemon');
                }
            });
    
            if (!nextPokemon) {
                globals.monsterManager.resetEffects();
                // All trainer's Pokémon are fainted. Ending battle...
                // console.log('All trainer\'s Pokémon are fainted. Ending battle...');
                // globals.npc.trainer1.defeated = true;
                // globals.npc.trainer1.active = false;
                if (globals.npc.trainer5.active)
                {
                    this.giveAxe = true;
                }
                console.log(this.selectedNPC.name);
                this.selectedNPC.defeated = true;
                this.selectedNPC.active=false;
                this.selectedNPC = null;
                // this.giveAxe = true;

            


                console.log('update health bars');
                globals.characterPosition.money += 500;
                this.randomPokemon.destroy();
                this.battleUI.updateHealthBars();

                if(this.finishTutorial)
                {
                    this.dialogueBoxManager.createDialogueBox(this, 'Good Job you have won!', () => {globals.sceneManager.start('MapScene', {condition: 'finishTutorial2'});});
                }
                else
                {
                    this.dialogueContainer = this.displayDialogue('You defeated the trainer!\nHere is 500$.');

                }

                

            } else {
                // Switch to the next Pokémon
                await this.switchEnemyPokemon(nextPokemon);
                this.defeated=false;
                this.battleUI.updateHealthBars();
                // console.log('switching enemy pokemon');
                // console.log('defeated: ' + this.defeated);
            }
        } else {

            globals.monsterManager.resetEffects();
            // Enemy Pokémon defeated
            console.log('updating health bars');
            this.battleUI.updateHealthBars();
            const moneyGained = ((globals.characterPosition.route * 100) + 100)
            globals.characterPosition.money += moneyGained;
            this.randomPokemon.destroy();

            // console.log('globals.items:', globals.items);
            const eyeIndex = globals.items.findIndex(item => item.key === 'eye');
            // console.log('eyeIndex:', eyeIndex);
            
            const quantity = globals.items[eyeIndex]?.quantity;
            // console.log('quantity:', quantity);


            
            if(this.finishTutorial)
            {
                this.dialogueBoxManager.createDialogueBox(this, 'Good Job you have won!', () => {globals.sceneManager.start('MapScene', {condition: 'finishTutorial2'});});
            }
            else{
                 //this._items.findIndex(item => item.name === 'eye');
            if (quantity >= 1)//globals.characterPosition.route === 5
            {
                // console.log('you have an eye');
                this.dialogueContainer = this.displayDialogue('You defeated the enemy!\nYou now have ' + globals.characterPosition.money + '$. (+ ' + moneyGained + '$)', true);

            }
            else
            {
                // console.log('you dont have an eye');
                this.dialogueContainer = this.displayDialogue('You defeated the enemy!\nYou now have ' + globals.characterPosition.money + '$. (+ ' + moneyGained + '$)');
            }

            }


        }
    }

    */


    async handleEnemyPokemonDefeat() {
        console.log('running enemy defeat');
        this.defeated = true;
        globals.monsterManager.resetEffects();
    
        // Calculate and award money
        const moneyGained = this.isTrainerBattle() ? 500 : ((globals.characterPosition.route * 100) + 100);
        globals.characterPosition.money += moneyGained;
    
        // Handle trainer defeat
        if (this.isTrainerBattle()) {
            this.selectedNPC.defeated = true;
            this.selectedNPC.active = false;
            this.selectedNPC = null;
            if (globals.npc.trainer5.active) {
                this.giveAxe = true;
            }
        }
    
        // Update UI and display dialogue
        this.battleUI.updateHealthBars();

        await this.awardExperiencePoints(this.defeatedMonsters);




        if (this.finishTutorial) {
                this.shutdown();

                this.dialogueBoxManager.createDialogueBox(this, 'Good Job you have won!', () => {
                this.endBattle('battle', 'finishTutorial2');
                return;
                globals.sceneManager.start('MapScene', {condition: 'finishTutorial2'});
            });
        } else {
            const eyeQuantity = globals.items.find(item => item.key === 'eye')?.quantity || 0;
            const dialogueText = `You defeated the ${this.isTrainerBattle() ? 'trainer' : 'enemy'}!\nYou now have ${globals.characterPosition.money}$. (+ ${moneyGained}$)`;
            this.dialogueContainer = this.displayDialogue(dialogueText, eyeQuantity >= 1, 'Enemy Defeated');
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // Helper function to check if a monster is in the field
    isMonsterInField(monster) {
        return this.enemyMonsters.includes(monster) || this.playerMonsters.includes(monster);
    }

    // Helper function to check if both attacker and target are in the field
    areBothMonstersInField(attacker, target) {
        return this.isMonsterInField(attacker) && this.isMonsterInField(target);
    }
    async createMove3(attack, attacker, target, item=null) {
        console.log('moveQueue: ', this.moveQueue)
        let partyOpen = false;
        let moveObject;
        this.partyQueue = [];
        
        if (attack === 'item')
        {
            moveObject = {
                type: 'item',
                attacker: attacker,
                target: target,
                item: item
            }
        }
        else if (attack === 'switch') {
            moveObject = {
                type: 'switch',
                oldPokemon: attacker,
                newPokemon: target,
                // speed: newPokemon.speed // Switches typically happen at the start of the turn
            };
        } else{

            moveObject = {
                type: 'attack',
                attacker: attacker,
                target: target,
                move: attack,
                speed: attacker.speed + attack.speed,
                // defender: this.currentTurn
        };
    }
    
        // Add the move to the queue
        this.moveQueue.push(moveObject);
    
    
        this.rotatePlayerTurn();
      
     
        // globals.sceneManager.relaunch('BattleButtonsScene');
        this.battleButtonScene.showMenu();
        const validPlayerMonsters = this.playerMonsters.filter(pokemon => pokemon !== null);

        // this.battleButtonScene.showBattleLog();
        // If all moves have been selected (4 moves for 2v2 battle)
        if (this.moveQueue.length === validPlayerMonsters.length) {

            this.battleButtonScene.showBattleLog();
            // Assuming this.randomPokemonData is an array of enemy Pokémon
            // const availablePokemon = this.enemyMonsters.filter(pokemon => pokemon.currentHp > 0);
            const availablePokemon = this.enemyMonsters.filter(pokemon => pokemon && pokemon.currentHp > 0);
    
            availablePokemon.forEach(pokemon => {
                const randomMove = pokemon.getRandomMove(); // Get a random move for the Pokémon

                // Create a move object for the current Pokémon
                const moveObject = {
                    type: 'attack',
                    attacker: pokemon, // The current Pokémon
                    target: this.chooseTarget(), // Implement this method to choose a target
                    move: randomMove, // The random move chosen
                    speed: pokemon.speed + randomMove.speed // Calculate speed

                };

                // Add the move to the queue
                this.moveQueue.push(moveObject);
            });

             // Separate attacks and switches
            const attacks = this.moveQueue.filter(action => action.type === 'attack');
            const switches = this.moveQueue.filter(action => action.type === 'switch');
            const items = this.moveQueue.filter(action => action.type === 'item');

            // Sort attacks based on speed
            attacks.sort((a, b) => b.speed - a.speed);


            this.moveQueue = [...attacks, ...items, ...switches];

            for (const move of this.moveQueue) { //this.moveQueue

                if (move.type === 'attack')
                {
                    // console.log('defeated? ', this.defeated)
                    if (move.target.currentHp > 0 && move.attacker.currentHp > 0 && !this.playerDefeated && this.areBothMonstersInField(move.attacker, move.target) && !this.defeated) 
                    {   
                        this.setCurrentTurn(move.attacker);

                        await this.executeMove(move.attacker, move.target, move.attacker.sprite, move.target.sprite, move.move);
                        await this.delay(500);
                        
                    }
                }
                else if (move.type === 'item')
                {       
                    // console.log('running items');
                    await this.setCurrentTurn(move.attacker);

                    if (!this.defeated)
                    {
                        await move.attacker.useItem(this, move.item, move.target);
                        await this.checkDefeat();

                    }
                    await this.delay(500);

                }
                else if (move.type === 'switch')
                {
                    // console.log('switch phase triggered');
                    if (!this.defeated)
                    {
                        this.setCurrentTurn(move.oldPokemon);
                        partyOpen=true;
                        await this.battleUI.switchPokemon(move.newPokemon, move.oldPokemon);
                    }
                   
                }
               


            }
           


            this.moveQueue = [];
            // console.log('defeated? ', this.defeated);
            if (this.defeated) return;
            await this.applyStatusEffectsToAllMonsters();
            this.resetPlayerTurn();
            // console.log('checking defeat');

        }
        // else if (this.moveQueue.length > validPlayerMonsters.length)
        // {
        //     this.moveQueue = []
        //     this.resetPlayerTurn();
        //     console.log('error move queue exceeded the valid players');
        // }

        if (this.partyQueue && this.partyQueue.length > 0)
        {
            // console.log('party queue detected: ', this.partyQueue);
            this.setCurrentTurn(this.partyQueue[0].defender)
            this.showPartyWindow(this.partyQueue[0].defender);
        }
        else
        {
            if (!partyOpen)
            {
                // globals.sceneManager.relaunch('BattleButtonsScene');
                // console.log('showing menu');
                // this.battleButtonScene.showMenu();
            } 
        }
      

    }
   


    async applyStatusEffectsToAllMonsters() {
        const allMonsters = [...this.playerMonsters, ...this.enemyMonsters].filter(monster => monster && monster.currentHp > 0);
        
     
        for (const monster of allMonsters) {
            
            this.setCurrentTurn(monster);
            const { effectApplied, monsterDefeated} = await monster.applyStatusEffects(this);
            if (monsterDefeated) return;
            if (effectApplied)
            {
                await this.delay(500); 
            }
        

    
        }
    
    }
    rotatePlayerTurn() {
        const alivePokemon = this.playerMonsters.filter(pokemon => pokemon && pokemon.currentHp > 0);
        
        if (alivePokemon.length === 0) {
            this.currentTurn = null;
            return;
        }
        const currentIndex = alivePokemon.indexOf(this.currentTurn);
        const nextIndex = (currentIndex + 1) % alivePokemon.length;
        this.setCurrentTurn( alivePokemon[nextIndex])
    }
    
    resetPlayerTurn() {
        const alivePokemon = this.playerMonsters.filter(pokemon => pokemon && pokemon.currentHp > 0);
        
        if (alivePokemon.length === 0) {
            this.currentTurn = null;
            return
        }
        
        this.setCurrentTurn(alivePokemon[0]);
    }
    
    chooseTarget() {
        const validTargets = this.playerMonsters.filter(pokemon => pokemon);  // Remove null or undefined values
    
        if (validTargets.length === 0) {
            throw new Error('No valid Pokémon to choose from');
        }
    
        return validTargets[Math.floor(Math.random() * validTargets.length)];
    }
    


    getEnemyMonsters() {
        return [this.randomPokemonData, this.randomPokemonData2].filter(Boolean);
    }

   
    async setCurrentTurn(monster) {
        // Clear any previous turn indicator
        if (this.currentTurn === monster && this.battleUI.turnIndicator)
        {
            return;
        }
        this.battleUI.clearTurnIndicator();
    
        this.currentTurn = monster;
        this.battleUI.showTurnIndicator(monster);  // Show red circle under the current turn monster
        console.log('set current turn to: ' + monster.name);
    }
    checkBattleEnd() {
        const playerTeamDefeated = this.playerMonsters.every(pokemon => pokemon.currentHp <= 0);
        const enemyTeamDefeated = this.enemyMonsters.every(pokemon => pokemon.currentHp <= 0);
        return playerTeamDefeated || enemyTeamDefeated;
    }
/*
    async createMove2(attack, yourTurn = true) {
        

        const randomMove = this.randomPokemonData.getRandomMove();
        this.locked = true;
    
        const playerPokemon = this.currentPokemonData;
        const enemyPokemon = this.randomPokemonData;
        
        // Helper function to get the attacker order based on speed
        const { firstAttacker, secondAttacker, firstMove, secondMove } = this.getFirstAttacker(playerPokemon, enemyPokemon, attack, randomMove);
    
        // Enemy’s turn if it’s not your turn
        if (!yourTurn) {
            await this.executeMove(enemyPokemon, playerPokemon, enemyPokemon.sprite, playerPokemon.sprite, randomMove);
            // Handle duplicate for the second attacker if necessary
            if (enemyPokemon.sprite.duplicate && randomMove.name !== 'Mirror Image' && playerPokemon.currentHp > 0) {
                await this.executeMove(enemyPokemon, playerPokemon, enemyPokemon.sprite.duplicate, playerPokemon.sprite, randomMove);
            }

        } else {
            // Execute the first attack
            await this.executeMove(firstAttacker, secondAttacker, firstAttacker.sprite, secondAttacker.sprite, firstMove);
    
            // Handle duplicate if necessary
            if (firstAttacker.sprite.duplicate && firstMove.name !== 'Mirror Image' && secondAttacker.currentHp > 0) {
                await this.executeMove(firstAttacker, secondAttacker, firstAttacker.sprite.duplicate, secondAttacker.sprite, firstMove);
            }
    
            // Execute second attack if the second attacker is still able to attack
            if (secondAttacker.currentHp > 0 && !this.feinted) {
                await this.executeMove(secondAttacker, firstAttacker, secondAttacker.sprite, firstAttacker.sprite, secondMove);
    
                // Handle duplicate for the second attacker if necessary
                if (secondAttacker.sprite.duplicate && secondMove.name !== 'Mirror Image' && firstAttacker.currentHp > 0) {
                    await this.executeMove(secondAttacker, firstAttacker, secondAttacker.sprite.duplicate, firstAttacker.sprite, secondMove);
                }
            }
        }
    
        // Apply status effects and remove duplicates
        await playerPokemon.applyStatusEffects(this);
        await enemyPokemon.applyStatusEffects(this);
        this.removeDuplicate(playerPokemon.sprite);
        this.removeDuplicate(enemyPokemon.sprite);
    
        this.locked = false;
    }
  */  
    // Helper function to determine who goes first

    /*
    getFirstAttacker(playerPokemon, enemyPokemon, playerMove, enemyMove) {
        const playerSpeed = playerPokemon.speed + playerMove.speed;
        const enemySpeed = enemyPokemon.speed + enemyMove.speed;
    
        if (playerSpeed >= enemySpeed) {
            return {
                firstAttacker: playerPokemon,
                secondAttacker: enemyPokemon,
                firstMove: playerMove,
                secondMove: enemyMove
            };
        } else {
            return {
                firstAttacker: enemyPokemon,
                secondAttacker: playerPokemon,
                firstMove: enemyMove,
                secondMove: playerMove
            };
        }
    }
        */
    removeDuplicate(sprite) {
        //removing duplicate image
        if (sprite && sprite.duplicate) {
            if (sprite.duplicate.count <= 0) {
                sprite.duplicate.destroy();
                sprite.duplicate = null;
            }
            else {
                sprite.duplicate.count--;
            }
        }
    }


    async executeMove(attacker, defender, attackerSprite, defenderSprite, move) {
        // Get the type color for the move, ensuring the type is in lowercase
        const moveTypeColor = globals.pokemonTypeColor[move.type].toLowerCase();
        console.log(
            `%c${attacker.name}%c attacking %c${defender.name}%c with %c${move.name}%c %cDmg: ${move.damage}`,
            `color: ${globals.pokemonTypeColor[attacker.type]}; font-weight: bold;`,
            'color: white; font-weight: normal;',
            `color: ${globals.pokemonTypeColor[defender.type]}; font-weight: bold;`,
            'color: white; font-weight: normal;',
            `color: ${globals.pokemonTypeColor[move.type]}; font-style: italic;`,
            'color: white; font-weight: normal;',
            'color: red; font-weight: bold;'
        );
        
        this.battleButtonScene.battleLogSlider.addTextItem2('battle', [
            `%c${attacker.name}%c attacking %c${defender.name}%c with %c${move.name}%c %cDmg: ${move.damage}`,
            `color: ${globals.pokemonTypeColor[attacker.type]}; font-weight: bold;`,
            'color: white; font-weight: normal;',
            `color: ${globals.pokemonTypeColor[defender.type]}; font-weight: bold;`,
            'color: white; font-weight: normal;',
            `color: ${globals.pokemonTypeColor[move.type]}; font-style: italic;`,
            'color: white; font-weight: normal;',
            'color: red; font-weight: bold;'
        ], '', 'BattleScene');
       



        if (!await attacker.triggerStatusEffect(this)) return false;
        await move.executeMove(attackerSprite, defenderSprite, attacker, defender, this);
    }

 
    
    async applyDamageAndEffects(attacker, defender, move, defenderSprite) {

        if (move.buff) {
            attacker.applyBuff(move.buff.stat, move.buff.amount);
            // this.dialogueBoxManager.createDialogueBox(this, `${attacker.name}'s ${move.buff.stat} increased!`);
            
            console.log(
                `%c${attacker.name}%c's %c${move.buff.stat}%c increased by %c${move.buff.amount}%c!`,
                `color: ${globals.pokemonTypeColor[attacker.type]}; font-weight: bold;`,
                'color: white; font-weight: normal;',
                'color: cyan; font-style: italic;',
                'color: white; font-weight: normal;',
                'color: green; font-weight: bold;',
                'color: white; font-weight: normal;'
            );




            this.battleButtonScene.battleLogSlider.addTextItem2('battle', [
                `%c${attacker.name}%c's %c${move.buff.stat}%c increased by %c${move.buff.amount}%c!`,
                `color: ${globals.pokemonTypeColor[attacker.type]}; font-weight: bold;`,
                'color: white; font-weight: normal;',
                'color: cyan; font-style: italic;',
                'color: white; font-weight: normal;',
                'color: green; font-weight: bold;',
                'color: white; font-weight: normal;'
            ], '', 'BattleScene');
            
            return true; // Return early after applying buff
        }
        if (move.debuff) {
            defender.applyDebuff(move.debuff.stat, move.debuff.amount);
            // this.dialogueBoxManager.createDialogueBox(this, `${defender.name}'s ${move.debuff.stat} decreased!`);
            
            
            console.log(
                `%c${defender.name}%c's %c${move.debuff.stat}%c decreased by %c${move.debuff.amount}%c!`,
                `color: ${globals.pokemonTypeColor[defender.type]}; font-weight: bold;`,
                'color: white; font-weight: normal;',
                'color: cyan; font-style: italic;',
                'color: white; font-weight: normal;',
                'color: red; font-weight: bold;',
                'color: white; font-weight: normal;'
            );
            
            this.battleButtonScene.battleLogSlider.addTextItem2('battle', [
                `%c${defender.name}%c's %c${move.debuff.stat}%c decreased by %c${move.debuff.amount}%c!`,
                `color: ${globals.pokemonTypeColor[defender.type]}; font-weight: bold;`,
                'color: white; font-weight: normal;',
                'color: cyan; font-style: italic;',
                'color: white; font-weight: normal;',
                'color: red; font-weight: bold;',
                'color: white; font-weight: normal;'
            ], '', 'BattleScene');
            
            return true; // Return early after applying debuff
        }
        
        await defender.applyMoveStatusEffect(move, this);
       
        const { damage, isCritical, effectiveness } = defender.applyDamage(attacker, move, this);


        // Add effectiveness text
        if (effectiveness !== 1) {
            let effectivenessText;
            let effectivenessColor;

            if (effectiveness > 1) {
                effectivenessText = "It's super effective!";
                effectivenessColor = 'green';
            } else if (effectiveness < 1) {
                effectivenessText = "It's not very effective...";
                effectivenessColor = 'red';
            }

            if (effectivenessText) {
                this.battleButtonScene.battleLogSlider.addTextItem2('battle', [
                    `%c${effectivenessText}`,
                    `color: ${effectivenessColor}; font-weight: bold;`
                ], '', 'BattleScene');
            }
        }




        if (move.heal) attacker.heal(move.heal);
        await this.battleUI.updateHealthBars();
    
        return this.checkDefeat(defender); 
    }
 
    async checkDefeat(defender = null) {
       console.log('defeated? ', this.defeated);
        if (this.defeated) return false;
        if (this.enemyMonsters.every(monster => monster === null)) {
            await this.handleEnemyPokemonDefeat();
            return false; // All enemy Pokemon defeated or captured
        }

        if (defender === null) return true;

        if (defender.currentHp <= 0) {
          
            if (this.playerMonsters.includes(defender)) {
                // defender.sprite.destroy();

                await this.battleUI.removePokemon(defender);
                
               
                this.pokemonFaught = this.pokemonFaught.filter(pokemon => pokemon !== defender);


                // Check if there are any remaining Pokémon in the party
                const remainingPokemon = this.pokemonData.filter(pokemon => 
                    !this.playerMonsters.includes(pokemon) && pokemon.currentHp > 0
                );
                
                if (remainingPokemon.length > 0) {
                    // this.partyWindow = true;
                    console.log('pushing to party queue');
                    this.partyQueue.push({ defender: defender });
                    // this.showPartyWindow(defender);
                    return false; // Battle continues
                } else if (this.playerMonsters.every(pokemon => pokemon === null)) {  // Check if all entries are `null`
                    await this.handlePlayerPokemonDefeat();
                    return false; // All player Pokémon defeated
                }
                return true;
            }

        
            else if (this.enemyMonsters.includes(defender)) {
                // defender.sprite.destroy();
           
                await this.battleUI.removePokemon(defender);
                this.defeatedMonsters.push(defender);
                // await this.battleUI.removePokemon(defender);
                // Award experience points

                //await this.awardExperiencePoints(defender);
                
                // Check for trainer battle and switch Pokemon if available
                if (this.isTrainerBattle() && this.hasRemainingTrainerPokemon()) {
                    const nextPokemon = this.getNextAvailablePokemon();
                    if (nextPokemon) {
                        // await this.switchEnemyPokemon(nextPokemon, defender);
                        await this.battleUI.switchPokemon(nextPokemon, defender);
                        return false; // Battle continues
                    }
                }
            
                // Check if all enemy Pokemon are defeated (ignoring null entries)
                const remainingEnemies = this.enemyMonsters.filter(pokemon => pokemon !== null);
                if (remainingEnemies.length === 0 && !this.hasRemainingTrainerPokemon()) {
                    await this.handleEnemyPokemonDefeat();
                    return false; // All enemy Pokemon defeated
                }

                return false;
            }
            
        }
        return true; // Defender is still alive or battle continues
    }
    



    showPartyWindow(defender=null)
    {
        
      
        globals.sceneManager.relaunch('PartyScene', { 
            originScene: 'BattleScene', 
            currentPokemonData: defender,
            action: 'switch',
            from: 'BattleScene',
            defender:defender
            // double: currentTurn
        });
    }
    


   
    
    
}
