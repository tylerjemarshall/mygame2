class BattleUI {
    constructor(scene, playerMonsters, enemyMonsters) { //playerMonster, enemyMonster, playerMonster2 = null, enemyMonster2 = null
       
       
        this.scene = scene;
        this.playerMonsters = playerMonsters;
        this.enemyMonsters = enemyMonsters;
        
        this.pkmDetailsBox = {
            playerMonsters: [],
            enemyMonsters: [],
            boxWidth: 100,
            boxHeight: 30,
            hbWidth: 100,
            hbHeight: 10,
            padding: 5,
        };
    
        const playerPositions = [
            {x: 75, y: 260},
            {x: 225, y: 260},
            {x: 375, y: 260}
        ];
    
        const enemyPositions = [
            {x: 400, y: 100},
            {x: 250, y: 100},
            {x: 100, y: 100}
        ];
    
        // Setup player monsters
        for (let i = 0; i < 3; i++) {
            if (this.playerMonsters[i]) {
                this.pkmDetailsBox.playerMonsters.push({
                    monster: this.playerMonsters[i],
                    isPlayer: true,
                    healthBar: null,
                    xpBar: null,
                    missingXPBar: null,
                    x: playerPositions[i].x,
                    y: playerPositions[i].y,
                    sprite: null
                });
            }
        }
    
        // Setup enemy monsters
        for (let i = 0; i < 3; i++) {
            if (this.enemyMonsters[i]) {
                this.pkmDetailsBox.enemyMonsters.push({
                    monster: this.enemyMonsters[i],
                    isPlayer: false,
                    healthBar: null,
                    xpBar: null,
                    missingXPBar: null,
                    x: enemyPositions[i].x,
                    y: enemyPositions[i].y,
                    sprite: null
                });
            }
        }




       
    


        
        this.moves = [
            { key: 'Fireblast', name: 'Fireblast', scale: 2 },
            { key: 'Poison', name: 'Poison', scale: 2 },
            { key: 'Storm', name: 'Storm', scale: 2 },
            { key: 'Plasma', name: 'Plasma', scale: 2 },
            { key: 'Darkness', name: 'Darkness', scale: 2 },
            { key: 'Blast', name: 'Blast', scale: 2 },
            { key: 'Arrow', name: 'Arrow', scale: 2 },
            { key: 'Mountain', name: 'Mountain', scale: 2 },
            { key: 'Hydra', name: 'Hydra', scale: 2 },
            { key: 'Tornado', name: 'Tornado', scale: 2 }
        ];
        this.createHealthBars();
        this.createOrUpdatePokemonNamesAndTypeBackground(); //this.playerMonster, this.enemyMonster
        this.updateHealthBars(true);  // Initialize health bars with current values


        // Create animations for Pokémon and moves
        this.createPokemonAnimations();
        this.createMoveAnimations();


        // Load Pokémon sprites
        this.loadPokemonSprites();
    }


    createBackground()
    {
        const background = this.scene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 'battleBackground');
        background.setOrigin(0.5);
        background.setScale(Math.max(this.scene.cameras.main.width / background.width, this.scene.cameras.main.height / background.height));
        background.setDepth(-10);
        
    }

  
    createHealthBars() {
        // Function to create health bars for a Pokémon
        const createHealthBar = (pokemon, offsetY) => {
            const barX = pokemon.x;
            const barY = pokemon.y + this.pkmDetailsBox.boxHeight + this.pkmDetailsBox.padding + offsetY;
    
            pokemon.missingHealthBar = this.scene.add.rectangle(barX, barY, this.pkmDetailsBox.hbWidth, this.pkmDetailsBox.hbHeight, 0xff0000);
            pokemon.healthBar = this.scene.add.rectangle(barX, barY, this.pkmDetailsBox.hbWidth, this.pkmDetailsBox.hbHeight, 0x00ff00);
            pokemon.missingHealthBar.setOrigin(0, 0);
            pokemon.healthBar.setOrigin(0, 0);
            
            return barY; // Return the Y position for further use
        };
    
   
        // Process player monsters
        this.pkmDetailsBox.playerMonsters.forEach((pokemon, index) => {
            if (pokemon && pokemon.monster) {
                const barY = createHealthBar(pokemon, 0);
                this.createXPBar(pokemon, barY);
            }
        });

        // Process enemy monsters
        this.pkmDetailsBox.enemyMonsters.forEach((pokemon, index) => {
            if (pokemon && pokemon.monster) {
                createHealthBar(pokemon, 0);
                // Note: We don't create XP bars for enemy monsters
            }
        });


       
    }
    
    // Function to create experience bars
    createXPBar(pokemon, healthBarY) {
        console.log('creating xp bar for '+ pokemon.monster.name);
        const xpBarX = pokemon.x;
        const xpBarY = healthBarY + this.pkmDetailsBox.hbHeight + this.pkmDetailsBox.padding;
    
        pokemon.xpBar = this.scene.add.rectangle(xpBarX, xpBarY, this.pkmDetailsBox.hbWidth, this.pkmDetailsBox.hbHeight / 2, 0x00008b);
        pokemon.missingXPBar = this.scene.add.rectangle(xpBarX, xpBarY, this.pkmDetailsBox.hbWidth, this.pkmDetailsBox.hbHeight / 2, 0xadd8e6);
        pokemon.xpBar.setOrigin(0, 0);
        pokemon.xpBar.setDepth(2);
        pokemon.missingXPBar.setOrigin(0, 0);
        pokemon.missingXPBar.setDepth(1);
    
        
    }
    
   

    createOrUpdatePokemonNamesAndTypeBackground() {
        ['playerMonsters', 'enemyMonsters'].forEach(monsterType => {
            this.pkmDetailsBox[monsterType].forEach((pokemonEntry, index) => {
                const { monster, x, y } = pokemonEntry;
                const key = `${monsterType}_${index}`;
    
                if (!monster) {
                    // Hide the UI elements if there's no monster in this slot
                    if (this[`${key}Name`]) {
                        this[`${key}Name`].setVisible(false);
                    }
                    if (this[`${key}Type`]) {
                        this[`${key}Type`].clear(); // Clear the background graphics
                        this[`${key}Type`].setVisible(false);
                    }
                    return; // Skip the rest of the iteration
                }
    
                const pokemonNameText = `${monster.name}[${monster.level}]`;
                const pokemonTypeColor = globals.pokemonTypes[monster.type];
    
                // Create or show graphics if they exist
                if (!this[`${key}Name`]) {
                    this[`${key}Type`] = this.scene.add.graphics();
                    this[`${key}Name`] = this.scene.add.text(
                        x + 10,
                        y + 10,
                        pokemonNameText,
                        { fill: '#ffffff' }
                    );
                } else {
                    // Update existing text
                    this[`${key}Name`].setText(pokemonNameText);
                    this[`${key}Name`].setPosition(x + 10, y + 10);
                    this[`${key}Name`].setVisible(true); // Ensure it's visible
                }
    
                // Update or show type background for the Pokémon
                this[`${key}Type`].clear(); // Clear old background
                this[`${key}Type`].fillStyle(pokemonTypeColor, 1);
                this[`${key}Type`].fillRect(x, y, this.pkmDetailsBox.boxWidth, this.pkmDetailsBox.boxHeight);
                this[`${key}Type`].setVisible(true); // Ensure it's visible
            });
        });
    }
    




    // Update the experience bar for the player's Pokémon
    updatePartyPokemonExperienceBar(monster, xpBar, missingXPBar, x, value, instant = false) {
  
    
            const currentXP = monster.xp;
            const nextLevelXP = this.calculateNextLevelXP(monster);
            // console.log('current xp: ', currentXP, 'nextLevelXP: ', nextLevelXP);
            this.animateXPBar(monster, xpBar, missingXPBar, x, value, currentXP, nextLevelXP, instant);
        
    }

// Update health bars for all Pokémon
async updateHealthBars(instant = false) {
    const healthPromises = []; // Array to hold promises for health bar updates
    const xpPromises = []; // Array to hold promises for XP bar updates

    // Update player monsters' health bars
    this.pkmDetailsBox.playerMonsters.forEach(value => {
        if (value && value.monster && value.healthBar) {
            const { monster, healthBar } = value;
            value.healthBar.setVisible(true);
            value.missingHealthBar.setVisible(true);
            healthPromises.push(this.updatePokemonHealthBar(monster, healthBar, instant));
        }else if (value && !value.monster) {
            // Hide health bar if the monster is null
            if (value.healthBar) {
                value.healthBar.setVisible(false);
            }
            if (value.missingHealthBar) {
                value.missingHealthBar.setVisible(false);
            }
        }
    });

    // Update enemy monsters' health bars
    this.pkmDetailsBox.enemyMonsters.forEach(value => {
        if (value && value.monster && value.healthBar) {
            const { monster, healthBar } = value;
            value.healthBar.setVisible(true);
            value.missingHealthBar.setVisible(true);
            healthPromises.push(this.updatePokemonHealthBar(monster, healthBar, instant));
        }else if (value && !value.monster) {
            // Hide health bar if the monster is null
            if (value.healthBar) {
                value.healthBar.setVisible(false);
            }
            if (value.missingHealthBar) {
                value.missingHealthBar.setVisible(false);
            }
        }
    });

    await Promise.all(healthPromises);  // Wait for all health bar updates to complete

    // Update player monsters' XP bars
    this.pkmDetailsBox.playerMonsters.forEach(value => {
        if (value && value.monster && value.isPlayer) { // Check if it is a player monster
            const { monster, xpBar, missingXPBar, x } = value;
            value.xpBar.setVisible(true);
            value.missingXPBar.setVisible(true);
            xpPromises.push(this.updatePartyPokemonExperienceBar(monster, xpBar, missingXPBar, x, value, instant));
        }else if (value && !value.monster) {
            // Hide XP bar if the monster is null
            if (value.xpBar) {
                value.xpBar.setVisible(false);
            }
            if (value.missingXPBar) {
                value.missingXPBar.setVisible(false);
            }
        }
    });

    await Promise.all(xpPromises);  // Wait for all XP bar updates to complete

    this.createOrUpdatePokemonNamesAndTypeBackground(); // Refresh names and types
}


    // Helper to update a Pokémon's health bar
    async updatePokemonHealthBar(pokemonData, healthBar, instant) {
        const healthPercentage = pokemonData.currentHp / pokemonData.maxHp;
        const currentWidth = this.pkmDetailsBox.hbWidth * healthPercentage;

        if (instant) {
            healthBar.width = currentWidth;
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                this.scene.tweens.add({
                    targets: healthBar,
                    width: currentWidth,
                    duration: 100,
                    ease: 'Sine.easeInOut',
                    onComplete: resolve
                });
            });
        }
    }


    //new xp bar animation

    animateXPBar(monster, xpBar, missingXPBar, x, value, currentXP, nextLevelXP, instant = false) {
   

        const pokemon = monster;
        const { hbWidth } = this.pkmDetailsBox;
    
        let xpPercentage = Math.min(currentXP / nextLevelXP, 1);
        let targetWidth = Math.min(hbWidth * xpPercentage, hbWidth);

                
        
    
        // Directly set the XP bar for the specified Pokémon
        if (instant) {
           xpBar.width = targetWidth;
            this.updateMissingXPBar(x, xpBar, missingXPBar);
            return Promise.resolve();
        }
    
        return new Promise(resolve => {
            let xpToNextLevel = nextLevelXP; // XP needed for next level
            let xpRemaining = currentXP; // Total XP accumulated
    
            // Calculate how many levels can be gained with the current XP
            let levelsGained = 0;


            
    


            while (xpRemaining >= xpToNextLevel) {
                xpRemaining -= xpToNextLevel; // Subtract XP needed for this level
                levelsGained++;
                // console.log('levelsgained++');
                xpToNextLevel = this.calculateNextLevelXP(pokemon) + (10 * levelsGained); 
            }
    
       
            // Animate level-ups one by one
            const animateNextLevel = () => {
                if (levelsGained > 0) {
                    this.scene.tweens.add({
                        targets: xpBar,
                        width: hbWidth,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onUpdate: () => this.updateMissingXPBar(x, xpBar, missingXPBar),
                        onComplete: () => {
                            pokemon.levelUp(1);
                            this.createOrUpdatePokemonNamesAndTypeBackground();
                            xpBar.width = 0; // Reset XP bar
                            levelsGained--;
                            animateNextLevel(); // Recursively animate next level-up
                        }
                    });
                } else {
                    let finalTargetWidth = Math.min(hbWidth * (xpRemaining / xpToNextLevel), hbWidth);
                    this.scene.tweens.add({
                        targets: xpBar,
                        width: finalTargetWidth,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onUpdate: () => this.updateMissingXPBar(x, xpBar, missingXPBar),
                        onComplete: resolve // Resolve when final XP animation is done
                    });
                }
            };
    
            animateNextLevel(); // Start the recursive animation process
        });
    }
    
        // Update missing XP bar
        updateMissingXPBar(x, xpBar, missingXPBar) {
            const currentWidth = Math.min(xpBar.width, this.pkmDetailsBox.hbWidth);
            missingXPBar.width = this.pkmDetailsBox.hbWidth - currentWidth;
            missingXPBar.x = x + currentWidth;
         
            // console.log('xpbar width: ', xpBar.width , ' currentWidth: ', currentWidth, ' missing xp bar width: ', missingXPBar.width, 'missingxpbarx: ', missingXPBar.x);
        }
    


    // Calculate the XP required for the next level
    calculateNextLevelXP(pokemon) {
        return Math.floor(10 * pokemon.level); // Adjust the base XP value as needed
    }
    ////////////////////////////animations///////////////////////////////

    // New method for creating Pokémon animations
    createPokemonAnimations() {
        const frames = 10; // Frame rate or duration for animations
        globals.pokemonData.forEach(pokemon => {
            this.createAnimation(`${pokemon.key}_upAnimation`, pokemon.key, frames);
            this.createAnimation(`${pokemon.key}_downAnimation`, pokemon.key, frames, 'down');
        });
    }

    createAnimation(animationKey, pokemonKey, frames, direction = 'up') {
        if (!this.scene.anims.exists(animationKey)) {
            const frameIndices = direction === 'up' ? [1, 5, 9, 13] : [0, 4, 8, 12];
            this.scene.anims.create({
                key: animationKey,
                frames: this.scene.anims.generateFrameNumbers(pokemonKey, { frames: frameIndices }),
                frameRate: frames,
                repeat: -1
            });
        }
    }

    createMoveAnimations() {

        this.moves.forEach((move) => {
            const index = this.moves.indexOf(move);
            this.createMovesAnimations(move.name, move.key, index);
        });


        this.createMoveAnimation('Fireball', { start: 0, end: 3 });
        this.createMoveAnimation('EnergyBall', { frames: [0, 1, 2, 3] });
        this.createMoveAnimation('Rock', { frames: [0, 1, 2, 3] });
        this.createMoveAnimation('Rain', { frames: [0, 1, 2] });
        this.createMoveAnimation('RazorLeaf', { start: 0, end: 5 });
        this.createMoveAnimation('CanonBall', { start: 0, end: 4 });
        this.createMoveAnimation('Thunder', { start: 0, end: 7 });

        this.createPokeballAnimations();
    }

    createPokeballAnimations() {
        const rowCount = 28; // Assuming 28 rows for the Pokeball animations

        this.createPokeballThrowAnimation(rowCount);
        this.createPokeballRollAnimation(rowCount);
        this.createPokeballReleaseAnimation(rowCount);
        this.createPokeballCaughtAnimation(rowCount);
    }

    createPokeballThrowAnimation(rowCount) {
        if (!this.scene.anims.exists('PokeballThrow')) {
            this.scene.anims.create({
                key: 'PokeballThrow',
                frames: this.scene.anims.generateFrameNumbers('Pokeball', { frames: [0, 1, 2, 3].map(frame => rowCount * frame) }), 
                frameRate: 10,
                repeat: -1
            });
        }
    }

    createPokeballRollAnimation(rowCount) {
        if (!this.scene.anims.exists('PokeballRoll')) {
            this.scene.anims.create({
                key: 'PokeballRoll',
                frames: this.scene.anims.generateFrameNumbers('Pokeball', { frames: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(frame => rowCount * frame) }), 
                frameRate: 10,
                repeat: 0
            });
        }
    }

    createPokeballReleaseAnimation(rowCount) {
        if (!this.scene.anims.exists('PokeballRelease')) {
            this.scene.anims.create({
                key: 'PokeballRelease',
                frames: this.scene.anims.generateFrameNumbers('Pokeball', { frames: [20, 21, 22, 23, 24, 25].map(frame => rowCount * frame) }), 
                frameRate: 10,
                repeat: 0
            });
        }
    }

    createPokeballCaughtAnimation(rowCount) {
        if (!this.scene.anims.exists('PokeballCaught')) {
            this.scene.anims.create({
                key: 'PokeballCaught',
                frames: this.scene.anims.generateFrameNumbers('Pokeball', { frames: [26, 27, 28, 29, 30].map(frame => rowCount * frame) }), 
                frameRate: 10,
                repeat: 0
            });
        }
    }
 

loadPokemonSprites() {
    const allMonsters = [
        { monsters: this.pkmDetailsBox.playerMonsters, isPlayer: true },
        { monsters: this.pkmDetailsBox.enemyMonsters, isPlayer: false }
    ];

    allMonsters.forEach(({ monsters, isPlayer }) => {
        monsters.forEach((value) => {
            if (value && value.monster) {
                const { monster, x, y } = value;
                const direction = isPlayer ? 'up' : 'down';
                const scale = 5; // Adjust as needed

                const sprite = this.loadPokemonSprite(x + 50, y + 100, monster.key, scale, direction);
                value.sprite = sprite;
                value.monster.sprite = sprite; // Set the sprite directly on the monster object
            }
        });
    });
}




    loadPokemonSprite(x, y, key, scale, direction = 'up') {
        const sprite = this.scene.add.sprite(x, y, key);
        sprite.setScale(scale);
        sprite.anims.play(`${key}_${direction}Animation`); // Assuming animation key is based on the Pokémon key
        return sprite;
    }

      
    

    createMoveAnimation(key, { start, end, frames }, frameRate = 10, repeat = -1) {
        // Check if the animation already exists
        if (!this.scene.anims.exists(key)) {
            let frameIndices;
    
            // Determine the frame indices based on the provided parameters
            if (frames) {
                // If an array of frames is provided, use it directly
                frameIndices = frames;
            } else if (start !== undefined && end !== undefined) {
                // Generate an array of indices from start to end (inclusive)
                frameIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
            } else {
                console.warn(`Animation ${key} is missing frame data.`);
                return; // Exit if no frames are defined
            }
    
            // Create the animation using the generated or provided frame indices
            this.scene.anims.create({
                key: key,
                frames: this.scene.anims.generateFrameNumbers(key, { frames: frameIndices }),
                frameRate: frameRate,
                repeat: repeat
            });
        }
    }
    

    createMovesAnimations(animationKey, spriteKey, index) {
        if (!this.scene.anims.exists(animationKey)) {
            const frames = [];
            let row = 13;
            let col = 10;
            for (let i = 0; i < row; i++) {
                frames.push(index + i * col); // Incrementing by 10 to move to the next column
            }
            this.scene.anims.create({
                key: animationKey,
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { frames: frames }),
                frameRate: 10,
                repeat: -1
            });
        }
    }
            /////////////////////////////handle both parties switching/////////////////


            async removePokemon(monsterToRemove) {
            
            
                const keys = ['playerMonsters', 'enemyMonsters'];
                let removedPokemon = null;
            
                for (const key of keys) {
                    const index = this.pkmDetailsBox[key].findIndex(pokemon => pokemon && pokemon.monster === monsterToRemove);
                    if (index !== -1) {
                        removedPokemon = this.pkmDetailsBox[key][index];
                        break;
                    }
                }

                if (removedPokemon) {
                       

                    let { isPlayer, x: initialX, y : initialY } = removedPokemon;
                    const oldSprite = removedPokemon.sprite;
                    initialX += 50;
                    initialY += 100;
               
            
                    const isFeinted = monsterToRemove.currentHp === 0;
            
                    const slideOutDirection = isFeinted
                        ? { y: oldSprite.y + oldSprite.displayHeight }
                        : { x: isPlayer ? -100 : +100 };
            
                    await this.slidePokemon(oldSprite, slideOutDirection, isFeinted);
            
                    oldSprite.destroy();
            
                    const monstersKey = isPlayer ? 'playerMonsters' : 'enemyMonsters';
                    const indexToRemove = this.pkmDetailsBox[monstersKey].findIndex(pokemon => pokemon && pokemon.monster === monsterToRemove);
                    
                    if (indexToRemove !== -1) {
                        this.pkmDetailsBox[monstersKey][indexToRemove].monster = null;
                        this.pkmDetailsBox[monstersKey][indexToRemove].lastMonster = monsterToRemove;
                        this.scene[monstersKey][indexToRemove] = null;
                    }
                    console.log('monsterkey: ', this.scene[monstersKey])
            
                    this.updateHealthBars(true);
            
                    if (isPlayer) {
                        this.scene.feinted = false;
                        this.scene.defeated = false;
                    }
            
                }
            }




            async switchPokemon(newPokemon, oldPokemon) {
            
                const keys = ['playerMonsters', 'enemyMonsters'];
                let pokemonToSwitch = null;
            
             
                for (const key of keys) {
                    const index = this.pkmDetailsBox[key].findIndex(pokemon => 
                        (pokemon && pokemon.monster === oldPokemon) || 
                        (pokemon && pokemon.lastMonster === oldPokemon)
                    );
                    if (index !== -1) {
                        pokemonToSwitch = this.pkmDetailsBox[key][index];
                        break;
                    }
                }
                if (pokemonToSwitch) {
                    // const pokemonToSwitch = this.pkmDetailsBox[keyToSwitch];
                    const { isPlayer } = pokemonToSwitch; // Extract isPlayer from the key
                    let { x: initialX, y: initialY } = pokemonToSwitch;
                    initialX += 50;
                    initialY += 100;
                    const oldSprite = pokemonToSwitch.sprite;
            
                    // Determine if the Pokémon has fainted based on HP
                    const isFeinted = oldPokemon.currentHp === 0;
            
                    // Determine slide out direction based on whether it's a player or enemy Pokémon
                    const slideOutDirection = isFeinted
                        ? { y: initialY - oldSprite.displayHeight }
                        : { x: isPlayer ? -100 : +100 };
            
                    // Unified slide out animation (mask enabled for fainted Pokémon)
                    await this.slidePokemon(oldSprite, slideOutDirection, isFeinted);
            
                    // Destroy the old sprite after sliding out
                    oldSprite.destroy();
            
                    // Create the new sprite off-screen (on the left for player, right for enemy)
                    const sprite = this.loadPokemonSprite(
                        isPlayer ? initialX - 100 : initialX + 100,
                        initialY, newPokemon.key, 5, isPlayer ? 'up' : 'down'
                    );
            
                    // Update pkmDetailsBox
                    const monstersKey = isPlayer ? 'playerMonsters' : 'enemyMonsters';
                    const indexToSwitch = this.pkmDetailsBox[monstersKey].findIndex(pokemon => pokemon.monster === oldPokemon || pokemon.lastMonster === oldPokemon);
            
                    this.pkmDetailsBox[monstersKey][indexToSwitch] = {
                        ...pokemonToSwitch,
                        monster: newPokemon,
                        sprite: sprite,
                        lastMonster: null
                    };
            
                    // Update scene references
                    this.scene[monstersKey][indexToSwitch] = newPokemon;
                    newPokemon.sprite = sprite;
            
            
                    // Update UI elements
                    this.createOrUpdatePokemonNamesAndTypeBackground();
            
                    // Unified slide in animation (mask not needed for incoming Pokémon)
                    await this.slidePokemon(sprite, { x: initialX, y: initialY }, false);
            
                    // Update health bars
                    this.updateHealthBars(true);
            
                    // Reset battle state flags for player side only
                    if (isPlayer) {
                        this.scene.feinted = false;
                        this.scene.defeated = false;
                        this.scene.pokemonFaught.push(newPokemon);
                    }
                }
            }
            
            // Unified slide function that can handle both sliding in and out with optional mask for fainted Pokémon
            async slidePokemon(sprite, direction, applyMask) {
                return new Promise((resolve) => {
                    let maskShape;
                    if (applyMask) {
                        maskShape = this.scene.add.graphics();
                        maskShape.fillStyle(0x000000, 0); // Color for the mask
                        const width = sprite.displayWidth;
                        const height = sprite.displayHeight;
                        
                        // Set the rectangle to start at the top-left corner, adjusted for center positioning
                        maskShape.fillRect(sprite.x - width / 2, sprite.y - height / 2, width, height);
                        
                        const mask = maskShape.createGeometryMask();
                       sprite.setMask(mask);
                    }
            
                    this.scene.tweens.add({
                        targets: sprite,
                        ...direction,
                        duration: 500, //500
                        ease: 'Power2',
                        onComplete: () => {
                            if (applyMask) {               
                                sprite.setVisible(false);
                               sprite.clearMask(); // Remove mask once animation completes
                                maskShape.destroy(); // Clean up mask shape
                            }
                            resolve();
                        }
                    });
                });
            }
            




             /////////////////////////////handle switching/////////////////////////////




async flashSprite(sprite, duration, flashes, color = 0xffffff) {
    return new Promise(resolve => {
        let flashCount = 0;
        const singleFlashDuration = duration / flashes;
        
        const flashTween = this.scene.tweens.add({
            targets: sprite,
            tint: { from: 0xffffff, to: color },
            duration: singleFlashDuration / 2,
            yoyo: true,
            repeat: flashes - 1,
            onComplete: () => {
                sprite.clearTint();
                resolve();
            }
        });
    });
}


showTurnIndicator(monster) {
    // Ensure monster has a sprite before proceeding
    if (monster && monster.sprite) {
        // Create a red circle underneath the monster's sprite
        const circleRadius = monster.sprite.displayWidth / 2;  // Slightly larger than the monster sprite
        this.turnIndicator = this.scene.add.circle(monster.sprite.x, monster.sprite.y + monster.sprite.displayHeight / 2 - 15, circleRadius, 0xff0000);

        // Set the circle behind the monster's sprite
        this.turnIndicator.setDepth(monster.sprite.depth - 1);

        // Optional: animate the circle (e.g., pulsing effect)
        this.scene.tweens.add({
            targets: this.turnIndicator,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,  // Repeat indefinitely to indicate the turn
        });
    }
}

clearTurnIndicator() {
    // Clear the previous turn indicator, if it exists
    if (this.turnIndicator) {
        this.turnIndicator.destroy();
        this.turnIndicator = null;
    }
}

//battle tweens..

async showCriticalHitAnimation(sprite) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(5, 0x000000); // Black color, 5 pixels thick

    const startX = sprite.x - sprite.displayWidth / 2;
    const startY = sprite.y - sprite.displayHeight / 2;
    const endX = sprite.x + sprite.displayWidth / 2;
    const endY = sprite.y + sprite.displayHeight / 2;

    graphics.beginPath();
    graphics.moveTo(startX, startY);
    graphics.lineTo(endX, endY);
    graphics.closePath();
    graphics.strokePath();

    graphics.setDepth(1);

    await new Promise(resolve => setTimeout(resolve, 1000));
    graphics.clear();
}


async animateDodge(sprite) {
    const xdiff = sprite === this.scene.randomPokemon ? 50 : -50;
    return new Promise(resolve => {
        this.scene.tweens.add({
            targets: sprite,
            x: sprite.x + xdiff,
            y: sprite.y,
            duration: 50,
            ease: 'Linear',
            yoyo: true,
            onComplete: resolve
        });
    });
}


}
