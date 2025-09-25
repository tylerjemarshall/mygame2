class MonsterManager {
    constructor() {
        this.partyMonsters = []; // Array to hold party Pokémon
        this.pcMonsters = []; // Array to hold PC Pokémon
        this.maxPartySize = 6; // Maximum party size
        this.pokemonQueue = []; // To queue Pokémon learning moves



    }


  // Function to heal all party monsters
  healPartyMonsters() {
    this.partyMonsters.forEach(monster => {
        monster.currentHp = monster.maxHp; // Heal to max HP
           
        // Loop through each move and set currentPP to maxPP
        monster.moves.forEach(move => {
            move.currentPP = move.maxPP; // Restore PP for all moves
        });
    });
}

resetEffects() {
    this.partyMonsters.forEach(monster => {
        monster.resetEffects();
    });
}
  // Convert all monsters to serializable format
  toSerializableObject() {
    const serialized =  {
        partyMonsters: this.partyMonsters.map(monster => monster.toSerializableObject()),
        pcMonsters: this.pcMonsters.map(monster => monster.toSerializableObject())
    };
    // console.log('Monster Manager: Serialized: ', serialized)
    return serialized;
}


fromSerializableObject(data) {
    const manager = new MonsterManager();
    manager.partyMonsters = data.partyMonsters.map(monsterData => Monster.fromSerializableObject(monsterData));
    manager.pcMonsters = data.pcMonsters.map(monsterData => Monster.fromSerializableObject(monsterData));
    return manager;
}

    // Add an existing monster to the party or PC
    add(monster) {
        if (!(monster instanceof Monster)) {
            throw new Error("The provided object is not a valid Monster instance.");
        }

        if (this.partyMonsters.length < this.maxPartySize) {
            // If party is not full, add monster to party
            this.partyMonsters.push(monster);
            console.log(`${monster.name} added to party.`);
        } else {
            // If party is full, transfer monster to PC
            this.pcMonsters.push(monster);
            console.log(`${monster.name} transferred to PC.`);
        }
    }


    // Set Pokémon stats and learn moves
    setPokemonStats(pokemon, level = 1, isPlayerPokemon = true) {
        console.log('Setting stats for Pokémon: ' + pokemon.name);
        const modifier = 10;
        const oldLevel = pokemon.level;
        pokemon.level += level;

        // Calculate new stats based on the level
        pokemon.maxHp = pokemon.baseMaxHp + (modifier * (pokemon.level - 1));
        pokemon.currentHp = Math.min(pokemon.currentHp + modifier * level, pokemon.maxHp); // Ensure current HP doesn't exceed max
        pokemon.attack = pokemon.baseAttack + (modifier * (pokemon.level - 1));
        pokemon.defense = pokemon.baseDefense + (modifier * (pokemon.level - 1));
        pokemon.speed = pokemon.baseSpeed + (modifier * (pokemon.level - 1));

        // Learn moves for each level gained
        for (let i = oldLevel + 1; i <= pokemon.level; i++) {
            console.log('Learning move for ' + pokemon.name + ' at level: ' + i);
            this.learnMovesAtLevel(pokemon, i, isPlayerPokemon);
        }

        console.log(pokemon);
        return pokemon;
    }


    async levelUp(xp, battleScene) {
        // Determine which Pokémon fought in the battle
        const nonFeintedPokemon = this.getFoughtPokemon(battleScene); // Fetch Pokémon that fought

        // Calculate the number of non-fainted Pokémon
        const totalNonFeinted = nonFeintedPokemon.length;

        // Share XP among all non-fainted Pokémon
        const xpPerPokemon = totalNonFeinted > 0 ? xp / totalNonFeinted : 0;

        for (const pokemon of nonFeintedPokemon) {
            // Calculate the required XP for the next level
            let nextLevelXP = this.calculateNextLevelXP(pokemon);

            // Grant the XP to the Pokémon
            pokemon.xp += xpPerPokemon;


  
            const pokemonEntry = battleScene.battleUI.pkmDetailsBox.playerMonsters.find(
                entry => entry && entry.monster === pokemon
            );

     
                let monster, xpBar, missingXPBar, x;

                if (pokemonEntry) {
                    ({ monster, xpBar, missingXPBar, x } = pokemonEntry); 
                } 
                const isInBattle = battleScene.playerMonsters.indexOf(pokemon) !== -1;
                // Handle the Pokémon currently in the field with animations
                if (isInBattle) { //battleScene.currentPokemonData === pokemon || battleScene.currentPokemonData2 === pokemon
                    while (pokemon.xp >= nextLevelXP) {
                        await battleScene.battleUI.animateXPBar(monster, xpBar, missingXPBar, x, pokemonEntry, pokemon.xp, nextLevelXP); // Animate XP bar
                        pokemon.xp -= nextLevelXP;
                        nextLevelXP = this.calculateNextLevelXP(pokemon);
                    }
                    // Handle remaining XP after level-up(s)
                    await battleScene.battleUI.animateXPBar(monster, xpBar, missingXPBar, x, pokemonEntry, pokemon.xp, nextLevelXP);

                } else {
                    // For off-field Pokémon: Level up without animations
                    while (pokemon.xp >= nextLevelXP) {
                        pokemon.xp -= nextLevelXP;
                        this.setPokemonStats(pokemon); // Set stats after level-up
                        nextLevelXP = this.calculateNextLevelXP(pokemon);
                    }
                }
            // }

        }

        // Update the names and levels of all party Pokémon
        battleScene.battleUI.createOrUpdatePokemonNamesAndTypeBackground();
        
        // Update health bars after XP changes
        await battleScene.battleUI.updateHealthBars(true); // Update health bars in BattleScene
    }

    getFoughtPokemon(battleScene) {
        // Replace this with your logic to get the Pokémon that fought in the current battle
        return battleScene.pokemonFaught.filter(pokemon => pokemon.currentHp > 0);
    }


    // Learn moves at a specific level
    learnMovesAtLevel(pokemon, currentLevel, isPlayerPokemon) {
        const moves = globals.pokemonMoves[pokemon.key];
        if (moves && moves.length > 0) {
            const newMoveDataArray = moves.filter(move => move.level === currentLevel);
            
            newMoveDataArray.forEach(newMoveData => {
                const newMove = new Move({ data: newMoveData }); // Create Move instance

                if (pokemon.moves.length < 4) {
                    // If less than 4 moves, just add the new move
                    pokemon.moves.push(newMove);
                    console.log(`${pokemon.name} learned ${newMove.name} at level ${currentLevel}`);
                } else if (isPlayerPokemon) {
                    // Queue for the player to choose a move
                    this.queuePokemonForLevelUp(pokemon, newMove);
                } else {
                    // For enemy Pokémon, automatically replace the worst move
                    const worstMove = this.findWorstMove(pokemon.moves);
                    if (this.compareMoves(newMove, worstMove) > 0) {
                        const index = pokemon.moves.indexOf(worstMove);
                        pokemon.moves[index] = newMove;
                        console.log(`${pokemon.name} forgot ${worstMove.name} and learned ${newMove.name} at level ${currentLevel}`);
                    }
                }
            });
        }
    }

    // Learn moves at a specific level
    learnMovesAtLevelOld(pokemon, currentLevel, isPlayerPokemon) {
        const moves = globals.pokemonMoves[pokemon.key];
        if (moves && moves.length > 0) {
            const newMoves = moves.filter(move => move.level === currentLevel);
            newMoves.forEach(newMove => {
                if (pokemon.moves.length < 4) {
                    // If less than 4 moves, just add the new move
                    pokemon.moves.push(newMove);
                    console.log(`${pokemon.name} learned ${newMove.name} at level ${currentLevel}`);
                } else if (isPlayerPokemon) {
                    // Queue for the player to choose a move
                    this.queuePokemonForLevelUp(pokemon, newMove);
                } else {
                    // For enemy Pokémon, automatically replace the worst move
                    const worstMove = this.findWorstMove(pokemon.moves);
                    if (this.compareMoves(newMove, worstMove) > 0) {
                        const index = pokemon.moves.indexOf(worstMove);
                        pokemon.moves[index] = newMove;
                        console.log(`${pokemon.name} forgot ${worstMove.name} and learned ${newMove.name} at level ${currentLevel}`);
                    }
                }
            });
        }
    }

    // Function to queue Pokémon for learning moves
    queuePokemonForLevelUp(pokemon, newMove) {
        if (!this.pokemonQueue) {
            this.pokemonQueue = [];
        }

        this.pokemonQueue.push({ pokemon, newMove });

        // If this is the only Pokémon in the queue, start the learning process
        if (this.pokemonQueue.length === 1) {
            this.processNextPokemonInQueue();
        }
    }

    // Process the next Pokémon in the queue
    processNextPokemonInQueue() {
        if (this.pokemonQueue.length > 0) {
            const { pokemon, newMove } = this.pokemonQueue[0]; // Get the first Pokémon in the queue
            console.log('Processing learning for ' + pokemon.name + ' of move ' + newMove.name);
            // Launch the PokemonDetailsScene for learning a new move
            globals.sceneManager.relaunch('PokemonDetailsScene', {
                originScene: 'BattleScene',
                pokemon, // Current Pokémon leveling up
                action: 'Learn', // The action to replace a move
                move: newMove, // New move being learned
                onClose: this.onPokemonDetailsClose.bind(this) // Pass the onClose callback
            });
        }
    }

   // Close handler for when learning a move is finished
    onPokemonDetailsClose() { // Accept battleScene as a parameter
        console.log('on close before shift ', this.pokemonQueue.length);
        this.pokemonQueue.shift();
        console.log('on close after shift ', this.pokemonQueue.length);

        if (this.pokemonQueue.length > 0) {
            this.processNextPokemonInQueue();
        } else {
            const controlPanelScene = globals.controlPanelGameInstance.scene.getScene('ControlPanelScene');
            if (controlPanelScene.admin) {
                globals.sceneManager.start('MapScene');
                controlPanelScene.admin = false;
            } else {
                console.log('resuming battlescene');
                // globals.sceneManager.transitionTo('BattleScene');
                globals.sceneManager.stop('PokemonDetailsScene');
            }
        }
    }

    // Calculate the XP required for the next level
    calculateNextLevelXP(pokemon) {
        return Math.floor(10 * pokemon.level); // Adjust the base XP value as needed
    }

    // Function to find the worst move
    findWorstMove(moves) {
        return moves.reduce((worst, current) => {
            return this.compareMoves(worst, current) < 0 ? worst : current;
        });
    }

    // Simple comparison of moves based on damage
    compareMoves(move1, move2) {
        const power1 = move1.damage || 0;
        const power2 = move2.damage || 0;
        return power1 - power2;
    }
}

