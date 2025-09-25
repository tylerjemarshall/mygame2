class Monster {
    constructor(name, level) {
        // Find the original Pokémon data based on the name
        const originalData = globals.originalPokemonData.find(pokemon => pokemon.key === name);
        
        if (!originalData) {
            throw new Error(`Monster with name "${name}" not found in original data.`);
        }

        // Deep copy the original data
        Object.assign(this, JSON.parse(JSON.stringify(originalData)));

        // Initialize additional properties directly on the instance
        this.happiness = 0.5; // Random value between 0 and 1
        this.mood = 'Happy'; // Default mood
        this.bond = 'unfriendly'; // Default bond
        this.bondLevel = 0;
        this.hunger = 'hungry'; // Default hunger
        
        this.level = level; // Set the level
        this.moves = []; // Initialize moves array
        this.status = 'none';

        this.statusDuration = 0;
        this.sprite = null; // Store the sprite reference

        this.buffs = {};
        this.debuffs = {};

      
        // Set stats and learn moves upon initialization
        this.setMonsterStats(level);
        this.learnInitialMoves(level);
    }

    learnInitialMoves(level) {
        const availableMoves = globals.pokemonMoves[this.name] || [];
        
        // Filter moves that can be learned up to the current level
        const newMovesData = availableMoves.filter(move => move.level <= level);
        
        newMovesData.forEach(newMoveData => {
            const move = new Move({ data: newMoveData }); // Create Move instance from move data
            if (this.moves.length < 4) {
                // If less than 4 moves, just add the new move
                this.moves.push(move);
                // console.log(`${this.name} learned ${move.name} at level ${level}`);
            } else {
                // Replace the weakest move with the new one if it's stronger
                const weakestMove = this.findWeakestMove();
                if (this.compareMoves(move, weakestMove) > 0) {
                    const index = this.moves.indexOf(weakestMove);
                    this.moves[index] = move;
                    // console.log(`${this.name} forgot ${weakestMove.name} and learned ${move.name} at level ${level}`);
                }
            }
        });
    }
    
    learnInitialMovesOld(level) {
        const availableMoves = globals.pokemonMoves[this.name] || [];
        
        // Filter moves that can be learned up to the current level
        const newMoves = availableMoves.filter(move => move.level <= level);
        
        newMoves.forEach(newMove => {
            if (this.moves.length < 4) {
                // If less than 4 moves, just add the new move
                this.moves.push(newMove);
                console.log(`${this.name} learned ${newMove.name} at level ${level}`);
            } else {
                // Replace the weakest move with the new one if it's stronger
                const weakestMove = this.findWeakestMove();
                if (this.compareMoves(newMove, weakestMove) > 0) {
                    const index = this.moves.indexOf(weakestMove);
                    this.moves[index] = newMove;
                    console.log(`${this.name} forgot ${weakestMove.name} and learned ${newMove.name} at level ${level}`);
                }
            }
        });
    }


    setMonsterStats(level) {
        const modifier = 10; // Base stat increase per level
        this.maxHp = this.baseMaxHp + (modifier * (level - 1));
        this.currentHp = this.maxHp; // Start with full health
        this.attack = this.baseAttack + (modifier * (level - 1));
        this.defense = this.baseDefense + (modifier * (level - 1));
        this.speed = this.baseSpeed + (modifier * (level - 1));

        // console.log(`Stats for ${this.name} set at level ${level}:`, {
        //     maxHp: this.maxHp,
        //     currentHp: this.currentHp,
        //     attack: this.attack,
        //     defense: this.defense,
        //     speed: this.speed,
        // });
    }

    // learnMovesAtLevel(level) {
    //     const availableMoves = globals.pokemonMoves[this.name] || [];
        
    //     // Filter moves that can be learned at the current level
    //     const newMoves = availableMoves.filter(move => move.level <= level);
        
    //     newMoves.forEach(newMove => {
    //         if (this.moves.length < 4) {
    //             // If less than 4 moves, just add the new move
    //             this.moves.push(newMove);
    //             console.log(`${this.name} learned ${newMove.name} at level ${level}`);
    //         } else {
    //             // Replace the weakest move with the new one if it's stronger
    //             const weakestMove = this.findWeakestMove();
    //             if (this.compareMoves(newMove, weakestMove) > 0) {
    //                 const index = this.moves.indexOf(weakestMove);
    //                 this.moves[index] = newMove;
    //                 console.log(`${this.name} forgot ${weakestMove.name} and learned ${newMove.name} at level ${level}`);
    //             }
    //         }
    //     });
    // }


    levelUp(levels = 1) {
        const oldLevel = this.level;
        this.level += levels;

        // Update stats
        const modifier = 10; // Base stat increase per level
        this.maxHp += modifier * levels;
        this.attack += modifier * levels;
        this.defense += modifier * levels;
        this.speed += modifier * levels;

        // Learn new moves for each level gained
        for (let i = oldLevel + 1; i <= this.level; i++) {
            this.learnMovesAtLevel(i, true);
        }


        // Get the BattleButtonsScene
        const battleButtonsScene = globals.controlGameInstance.scene.getScene('BattleButtonsScene');

        // Check if the BattleButtonsScene is active
        if (battleButtonsScene && battleButtonsScene.scene.isActive()) {


            console.log(`${this.name} leveled up to level ${this.level}!`);
            battleButtonsScene.battleLogSlider.addTextItem2('battle', [
                `%c${this.name}%c leveled up to level %c${this.level}%c!`,
                'color: blue; font-weight: bold;', // Name color
                'color: white; font-weight: normal;', // Normal text color
                'color: blue; font-weight: bold;', // Level color
                'color: white; font-weight: normal;' // Normal text color
            ], '', 'BattleScene');
        }
    }

    learnMovesAtLevel(level, allowManualSelection = false) {
        const availableMoves = globals.pokemonMoves[this.name] || [];
        
        // Filter moves that can be learned at the current level
        const newMoveDataArray = availableMoves.filter(move => move.level === level);
        
        newMoveDataArray.forEach(newMoveData => {
            const newMove = new Move({ data: newMoveData }); // Create Move instance
    
            if (this.moves.length < 4) {
                // If less than 4 moves, just add the new move
                this.moves.push(newMove);
                // console.log(`${this.name} learned ${newMove.name} at level ${level}`);
            } else if (allowManualSelection) {
                // Queue the move for manual selection
                globals.monsterManager.queuePokemonForLevelUp(this, newMove);
            } else {
                // Automatically replace the weakest move if the new one is stronger
                const weakestMove = this.findWeakestMove();
                if (this.compareMoves(newMove, weakestMove) > 0) {
                    const index = this.moves.indexOf(weakestMove);
                    this.moves[index] = newMove;
                    // console.log(`${this.name} forgot ${weakestMove.name} and learned ${newMove.name} at level ${level}`);
                }
            }
        });
    }
    
    learnMovesAtLevelOld(level, allowManualSelection = false) {
        const availableMoves = globals.pokemonMoves[this.name] || [];
        
        // Filter moves that can be learned at the current level
        const newMoves = availableMoves.filter(move => move.level === level);
        
        newMoves.forEach(newMove => {
            if (this.moves.length < 4) {
                // If less than 4 moves, just add the new move
                this.moves.push(newMove);
                console.log(`${this.name} learned ${newMove.name} at level ${level}`);
            } else if (allowManualSelection) {
                // Queue the move for manual selection
                globals.monsterManager.queuePokemonForLevelUp(this, newMove);
            } else {
                // Automatically replace the weakest move if the new one is stronger
                const weakestMove = this.findWeakestMove();
                if (this.compareMoves(newMove, weakestMove) > 0) {
                    const index = this.moves.indexOf(weakestMove);
                    this.moves[index] = newMove;
                    console.log(`${this.name} forgot ${weakestMove.name} and learned ${newMove.name} at level ${level}`);
                }
            }
        });
    }

    findWeakestMove() {
        return this.moves.reduce((weakest, current) => {
            return this.compareMoves(weakest, current) < 0 ? weakest : current;
        });
    }

    compareMoves(move1, move2) {
        const power1 = move1.damage || 0;
        const power2 = move2.damage || 0;
        return power1 - power2;
    }


     // Serialize this Monster instance to a plain object
     toSerializableObject() {
        const serialized =  {
            key: this.key,
            name: this.name,
            type: this.type,
            baseMaxHp: this.baseMaxHp,
            baseAttack: this.baseAttack,
            baseDefense: this.baseDefense,
            baseSpeed: this.baseSpeed,
            maxHp: this.maxHp,
            currentHp: this.currentHp,
            attack: this.attack,
            defense: this.defense,
            speed: this.speed,
            level: this.level,
            xp: this.xp,
            // moves: this.moves.map(move => ({...move})), // Deep copy of moves
            moves: this.moves.map(move => move.toSerializableObject()), // Serialize each move

            // moves: this.moves,
            status: this.status,
            happiness: this.happiness,
            mood: this.mood,
            bond: this.bond,
            bondLevel: this.bondLevel,
            hunger: this.hunger
        };
        // console.log(`Monster: Serialized ${this.name}:`, serialized);

        return serialized;
    }


    static fromSerializableObject(data) {
        const monster = new Monster(data.name, data.level);
        monster.maxHp = data.maxHp;
        monster.currentHp = data.currentHp;
        monster.attack = data.attack;
        monster.defense = data.defense;
        monster.speed = data.speed;
        monster.xp = data.xp;
        // monster.moves = data.moves; // You may want to restore moves more deeply if needed
        // monster.moves = data.moves.map(move => ({...move})); // Deep copy of moves
        monster.moves = data.moves.map(moveData => Move.fromSerializableObject(moveData)); // Restore each move as an instance

        monster.status = data.status;
        monster.happiness = data.happiness;
        monster.mood = data.mood;
        monster.bond = data.bond;
        monster.bondLevel = data.bondLevel;
        monster.hunger = data.hunger;

        return monster;
    }


    ////////////////////////////////////////////////////////////////


    
    setSprite(sprite) {
        this.sprite = sprite;
    }

    async applyStatus(status, duration = 3) {
        if (this.status === status) return; // Don't reapply the same status

        this.status = status;
        this.statusDuration = duration;

        const statusColors = {
            'Burn': 0xFFA500,
            'Poison': 0x800080,
            'Paralyze': 0xFFFF00,
            'Confusion': 0xA52A2A,
            'Hypnosis': 0x0000FF
        };

        if (this.sprite && statusColors[status]) {
            await this.flashSprite(this.sprite, 300, 3, statusColors[status]);
        }

        return `${this.name} is now ${status}ed!`;
    }

    async useItem(scene, item, target = null)
    {
        await globals.itemManager.useItem(scene, item, target, this );
    }

    async triggerStatusEffect(scene) {
        if (!this.status) return true; // No status effect, can move
    
        let message = null;
        let damage = 0;
        let color = null;
        let canMove = true;
    
        switch (this.status) {
         
            case 'Paralyze':
                if (Math.random() < 0.25) {
                    message = `${this.name} is paralyzed and can't move!`;
                    color = 0xFFFF00;
                    canMove = false;
                } else {
                    message = `${this.name} managed to move!`;
                }
                break;
    
            case 'Confusion':
                if (Math.random() < 0.50) {
                    message = `${this.name} managed to attack!`;
                } else {
                    damage = 40;
                    message = `${this.name} hurt itself in confusion!`;
                    canMove = false;
                }
                color = 0xA52A2A;
                break;
    
            case 'Hypnosis':
                message = `${this.name} is fast asleep.`;
                canMove = false;
                break;
    
            default:
                return true; // Default case, if no status effects prevent moving
        }
    
        // Display the status effect message
        // scene.dialogueBoxManager.createDialogueBox(scene, message);
        scene.battleButtonScene.battleLogSlider.addTextItem2('battle', [message], '', 'BattleScene');
    
        // Apply damage if applicable
        if (damage > 0) {
            this.currentHp -= damage;
            this.currentHp = Math.max(0, this.currentHp); // Prevent HP from going negative
            await scene.battleUI.updateHealthBars(); // Update health bar UI
    
            // Display damage message
            scene.dialogueBoxManager.createDialogueBox(scene, `${this.name} took ${damage} damage!`);

            console.log(
                `%c${this.name}%c took %c${damage}%c damage!`,
                `color: ${globals.pokemonTypeColor[this.type]}; font-weight: bold;`,
                'color: white; font-weight: normal;',
                'color: red; font-weight: bold;',
                'color: white; font-weight: normal;'
            );
            
            scene.battleButtonScene.battleLogSlider.addTextItem2('battle', [
                `%c${this.name}%c took %c${damage}%c damage!`,
                `color: ${globals.pokemonTypeColor[this.type]}; font-weight: bold;`,
                'color: white; font-weight: normal;',
                'color: red; font-weight: bold;',
                'color: white; font-weight: normal;'
            ], '', 'BattleScene');
        }
    
        // // Check for defeat if current HP is 0
        // if (this.currentHp <= 0) {
        //     if (this === scene.currentPokemonData) {
        //         scene.handlePlayerPokemonDefeat(); // Handle player's Pokémon defeat
        //     } else {
        //         scene.handleEnemyPokemonDefeat(); // Handle enemy Pokémon defeat
        //     }
        //     return false; // Fainted, can't move
        // }
    
        if (!scene.checkDefeat(this)) return false; // Return the result of the defeat check

        return canMove; // Return whether the Pokémon can move
    }
    



    applyBuff(stat, amount) {
        console.log('applying buff: ' +  stat + ' to ' + this.name);
        scene.battleButtonScene.battleLogSlider.addTextItem2('battle', ['Applying buff: ' +  stat + ' to ' + this.name], '', 'BattleScene');

        this.buffs[stat] = (this.buffs[stat] || 0) + amount;
    }

    applyDebuff(stat, amount) {
        scene.battleButtonScene.battleLogSlider.addTextItem2('battle', ['Applying debuff: ' +  stat + ' to ' + this.name], '', 'BattleScene');

        this.debuffs[stat] = (this.debuffs[stat] || 0) + amount;
    }

    // getEffectiveStat(stat) {
    //     const baseStat = this[stat];
    //     const buffModifier = 1 + (this.buffs[stat] || 0);
    //     const debuffModifier = 1 - (this.debuffs[stat] || 0);
    //     return Math.max(1, Math.floor(baseStat * buffModifier * debuffModifier));
    // }

    getEffectiveStat(stat) {
        const baseStat = this[stat];  // Get the base stat (e.g., defense)
        const buffAmount = this.buffs[stat] || 0;  // Get the total buff amount for the stat
        const debuffAmount = this.debuffs[stat] || 0;  // Get the total debuff amount for the stat
        
        // Calculate effective stat
        const effectiveStat = baseStat + buffAmount - debuffAmount;
        
        return Math.max(1, effectiveStat);  // Ensure it doesn't go below 1
    }
    

    resetEffects() {
        this.buffs = {};
        this.debuffs = {};
    }


     // Function to reset stats after battle
     resetStats() {
        if (this.originalStats) {
            this.speed = this.originalStats.speed;
            this.accuracy = this.originalStats.accuracy;
            this.defense = this.originalStats.defense;
            delete this.originalStats;  // Clean up backup after resetting
        }
    }

    
    // This method applies the status effect from the move to the monster
    async applyMoveStatusEffect(move, scene) {
        // Check if the move applies a status effect
        if (move.status && this.status !== move.status && Math.random() < 0.75) {
            console.log('Applying status ' + move.status + ' to ' + this.name);
            scene.battleButtonScene.battleLogSlider.addTextItem2('battle', ['Applying status ' + move.status + ' to ' + this.name], '', 'BattleScene');

            // Apply the status effect
            this.status = move.status;
            let color;
    
            switch (move.status) {
                case 'Burn':
                    color = 0xFFA500; // Orange for burn
                    break;
                case 'Poison':
                    color = 0x800080; // Purple for poison
                    break;
                case 'Paralyze':
                    color = 0xFFFF00; // Yellow for paralysis
                    break;
                case 'Confusion':
                    color = 0xA52A2A; // Brown for confusion
                    break;
                case 'Hypnosis':
                    color = 0x0000FF; // Blue for hypnosis
                    break;
                default:
                    return; // No valid status effect to apply
            }

            // Flash sprite to indicate the status effect
            await scene.battleUI.flashSprite(this.sprite, 300, 3, color);
        }
    }

    // This method applies ongoing status effects at the start of the monster's turn
    async applyStatusEffects(scene) {
        // console.log('applying status effects for ' + this.name);
        // if (this.currentHp <= 0 || this.status === null) return;  // No effects if fainted or no status


        if (this.currentHp <= 0 || this.status === null) {
            return { effectApplied: false, monsterDefeated: false };
        }


        let message = null;
        let effectApplied = false;
        let damage = 0;

        switch (this.status) {
            case 'Burn':
            case 'Poison': {
                console.log('applying poison or burn damage to ' + this.name);
                damage = 20;
                const color = this.status === 'Burn' ? 0xFFA500 : 0x800080;

                // Apply damage
                this.currentHp -= damage;
                this.currentHp = Math.max(0, this.currentHp);  // Prevent HP from going negative
                
                // Flash sprite and update health bar UI
                await scene.battleUI.flashSprite(this.sprite, 300, 3, color);
                await scene.battleUI.updateHealthBars();

                message = `${this.name} suffered 20 damage from ${this.status}`;
                effectApplied = true;
                break;
            }
            default:
                message = null;  // No status effect or invalid status
                break;
        }

        // If there's a message (status effect applied), show it in the dialogue box
        if (message) {
            // scene.dialogueBoxManager.createDialogueBox(scene, message);
            scene.battleButtonScene.battleLogSlider.addTextItem2('battle', [message], '', 'BattleScene');

        }

  
        // if (!scene.checkDefeat(this)) return false; // Return the result of the defeat check
        const monsterDefeated = !scene.checkDefeat(this);
        
        return { 
            effectApplied, 
            monsterDefeated
        };

    }


    //attacking logic


    applyDamage(attacker, move, scene) {
        // Calculate damage and effects
        const { damage, isCritical, effectiveness } = this.calculateDamage(attacker, move);
        this.currentHp -= damage;
        this.currentHp = Math.max(0, this.currentHp); // Ensure HP doesn't go below 0

        // Call battle UI to handle animations
        if (isCritical) {
            scene.battleUI.showCriticalHitAnimation(this.sprite); // Assuming each monster has a sprite
        }
        if (damage > 0) {
            scene.battleUI.flashSprite(this.sprite, 300, 3);
        } else {
            scene.battleUI.animateDodge(this.sprite);
        }

        return { damage, isCritical, effectiveness };
    }

    calculateDamage(attacker, move) {
        const defenseModifier = 0.5;
        const attackModifier = this.getAttackModifier(globals.difficulty);
        const effectiveness = this.getTypeEffectiveness(move.type, this.type);
        const stab = move.type === attacker.type ? 1.5 : 1;
        const isCritical = Math.random() < 0.2;
        const critical = isCritical ? 2 : 1;
        const dodge = Math.random() < 0.1 ? 0 : 1;
        const randomFactor = Phaser.Math.Between(85, 100) / 100;

        // Calculate effective defense considering buffs and debuffs
        const effectiveDefense = this.getEffectiveStat('defense');
        // console.log('defense: ', this.defense, 'effctive defense: ', effectiveDefense);
        let damage = (move.damage + attacker.attack) - (effectiveDefense * defenseModifier); //this.defense
        damage = (damage * attackModifier) * effectiveness;
        damage = damage * critical * dodge;
    
        return {
            damage: Math.max(1, Math.floor(damage)) * dodge,
            isCritical: isCritical,
            effectiveness: effectiveness
        };
    }

    getAttackModifier(difficulty) {
        switch (difficulty) {
            case 'easy': return 0.4;
            case 'medium': return 0.3;
            case 'hard': return 0.2;
            default: return 0.3;
        }
    }

    getTypeEffectiveness(moveType, defenderType) {
        if (moveType in globals.typeEffectiveness && globals.typeEffectiveness[moveType].includes(defenderType)) {
            return 2; // Super effective
        }
        for (const type in globals.typeEffectiveness) {
            if (globals.typeEffectiveness[type].includes(moveType) && type === defenderType) {
                return 0.5; // Not very effective
            }
        }
        return 1; // Normal effectiveness
    }
    
    // Method to get a random move
    getRandomMove() {
        const randomIndex = Phaser.Math.Between(0, this.moves.length - 1);
        return this.moves[randomIndex];
    }

    heal(amount)
    {
        this.currentHp+=amount;
        if (this.currentHp > this.maxHp) 
        {
            this.currentHp = this.maxHp;
        }
    }
    damage(amount)
    {
        this.currentHp-=amount;
        if (this.currentHp < 0) 
        {
            this.currentHp = 0;
        }
    }


}
