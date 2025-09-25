class Move {
    constructor({ data }) {
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


        this.name = data.name;            // Move name
        this.key = data.key;              // Unique identifier for the move
        this.type = data.type;            // Type of the move (e.g., Normal, Fire, etc.)
        this.damage = data.damage;        // Damage value of the move
        this.level = data.level;          // Level at which the move can be learned
        this.speed = data.speed;          // Speed attribute affecting move priority
        this.maxPP = data.maxPP;          // Maximum Power Points (PP) for the move
        this.currentPP = data.currentPP || data.maxPP;  // Current PP for the move
        this.count = data.count;          // Optional: For special moves or effects
        this.status = data.status;
        this.buff = data.buff;
        this.debuff = data.debuff;
        this.heal = data.heal;
        // Add animations or other move-related properties as needed
        this.animation = this.getAnimation(this.name); // Assign the corresponding animation
    }

   

    getAnimation(name) {
        // console.log('creating animations constant');
        const animations = {
            'Double Attack': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.singleTackle(attackerSprite, defenderSprite, scene); // Pass scene here
                    const canContinue = await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                    if (!canContinue) return false; // Stop if the defender is defeated
                    return true; // Continue to the next attack
                },
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.singleTackle(attackerSprite, defenderSprite, scene); // Pass scene here
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Cut': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.cutAnimation(defenderSprite, scene);
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Tackle': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.singleTackle(attackerSprite, defenderSprite, scene); // Pass scene here
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Agility': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.singleTackle(attackerSprite, defenderSprite, scene); // Pass scene here
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Speed Up': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    return await scene.applyDamageAndEffects(attacker, defender, move, attackerSprite);
                }
            ],
            'Harden': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    return await scene.applyDamageAndEffects(attacker, defender,  move, attackerSprite);
                }
            ],
            'Shadow Attack': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.shadowAttack(attackerSprite, defenderSprite);
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Mirror Image': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.mirrorImage(attackerSprite, scene); // Assuming mirrorImage is an animation or effect
                    return true; // No damage, but the move is successfully executed
                }
            ], // No damage effect
            'Stealth Attack': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.stealthAttackAnimation(attackerSprite, defenderSprite);
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Slash': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.lineAnimation(defenderSprite);
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Ray': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.rayAttackAnimation(attackerSprite, defenderSprite, globals.pokemonTypes[attacker.type]);
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            'Siphon': [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    await this.siphonAnimation(attackerSprite, defenderSprite);
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ],
            
            // Grouped moves that apply damage and effects without animations
            ...this.getGroupedDamageMoves(),
        };
        // console.log('animation name: ', name);
        const animation = animations[name] || this.getDefaultAnimation.bind(this);
        // console.log(`Animation type:`, animation === this.getDefaultAnimation.bind(this) ? 'Default' : 'Specific');

        if (animations.hasOwnProperty(name)) {
            // console.log(`Found specific animation for: ${name}`);
            return animations[name];
        } else {
            // console.log(`Using default animation for: ${name}`);
            return this.getDefaultAnimation();
        }
    
        //return animation; // Return default with context
    }
    
    
    getGroupedDamageMoves() {
        const damageMoves = [
            'Constrict', 'Scorch', 'Nightmare', 'Haunt', 'Shock',
            'Stampede', 'Electrify', 'Sludge', 'Storm', 'Earthquake',
            'Leaf Blade', 'Acid Blast', 'Hypnosis', 'Confusion', 
            'Sting', 'Burn', 'Paralyze', 'String Shot', 'Sand Attack'
        ];
    
        return Object.fromEntries(damageMoves.map(move => [
            move, 
            [
                async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                    return await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                }
            ]
        ]));
    }
    
    
    

    getDefaultAnimation() {
        return [
            async (attackerSprite, defenderSprite, attacker, defender, move, scene) => {
                // console.log('using move: ', move.name);
                let movesLeft = Math.ceil(Math.sqrt(move.count)) || 1;
                // console.log('moves left:', movesLeft);
                while (movesLeft > 0) {
                    await this.projectileAttack(attackerSprite, defenderSprite, move, scene);
                    const canContinue = await scene.applyDamageAndEffects(attacker, defender, move, defenderSprite);
                    if (!canContinue) break; // Stop if the defender is defeated
                    movesLeft--;
                }
            }
        ];
    }
    
    
    async executeMove(attackerSprite, defenderSprite, attacker, defender, scene) {
        // console.log('Executing move:', this.name);
        let animationSequence = this.animation;

    

        if (typeof animationSequence === 'function') {
            // If it's the getDefaultAnimation method, call it
            // console.log('setting function to ()')
            animationSequence = animationSequence();
        }
    

        if (Array.isArray(animationSequence)) {
            for (const animation of animationSequence) {
                if (typeof animation === 'function') {
                    // console.log('Executing animation in sequence');
                    const canContinue = await animation(attackerSprite, defenderSprite, attacker, defender, this, scene);
                    if (canContinue === false) break;
                } else {
                    console.error(`Invalid animation in sequence for move: ${this.name}`);
                }
            }
        } else if (typeof animationSequence === 'function') {
            // console.log('Executing single animation for:', this.name);
            await animationSequence(attackerSprite, defenderSprite, attacker, defender, this, scene);
        } else {
            console.error(`Invalid animation type for move: ${this.name}`);
        }
    }
 

    toSerializableObject() {
        return {
            name: this.name,
            key: this.key,
            type: this.type,
            damage: this.damage,
            level: this.level,
            speed: this.speed,
            maxPP: this.maxPP,
            currentPP: this.currentPP,
            count: this.count,
            status: this.status,  // Include status
            buff: this.buff,      // Include buffs
            debuff: this.debuff,  // Include debuffs
            animation: this.name  // Store the name of the animation function
        };
    }
    


// Deserialize a Move from a plain object
static fromSerializableObject(data) {
    return new Move({ data }); // Pass the entire data object inside an object to match the constructor
}


//tween animations//

async singleTackle(attackerSprite, defenderSprite, scene) {
    const isAttackerOnRight = attackerSprite.x > defenderSprite.x;
    const movementDistance = 50; // Adjust as needed

    return new Promise(resolve => {
        scene.tweens.add({
            targets: attackerSprite,
            x: attackerSprite.x + (isAttackerOnRight ? -movementDistance : movementDistance),
            duration: 150,
            yoyo: true, // Move back after the attack
            onComplete: resolve // Resolve the promise after the tween completes
        });
    });
}

async stealthAttackAnimation(attackerSprite, defenderSprite, scene) {
    // Step 1: Fade out the attacker sprite
    await new Promise(resolve => {
        scene.tweens.add({
            targets: attackerSprite,
            alpha: 0, // Fade to invisible
            duration: 300, // Adjust for desired fade duration
            ease: 'Sine.easeInOut',
            onComplete: resolve
        });
    });

    // Step 2: Run the line animation on the defender with black color and single line
    await this.lineAnimation(defenderSprite, 0x000000, 1, scene);

    // Step 3: Instantly make the attacker visible again
    attackerSprite.setAlpha(1);
}

async lineAnimation(sprite, color = 0x000000, count = 1, scene) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(5 / count, color); // Adjust line thickness based on count

    const startX = sprite.x - sprite.displayWidth / 2;
    const startY = sprite.y - sprite.displayHeight / 2;
    const endX = sprite.x + sprite.displayWidth / 2;
    const endY = sprite.y + sprite.displayHeight / 2;

    // Loop to create multiple diagonal lines
    for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) * 10; // Offset lines to center them
        graphics.beginPath();
        graphics.moveTo(startX + offset, startY);
        graphics.lineTo(endX + offset, endY);
        graphics.strokePath();
    }

    graphics.setDepth(1);

    // Delay for visual effect, then clear
    await new Promise(resolve => setTimeout(resolve, 1000));
    graphics.clear();
}

async siphonAnimation(attackerSprite, defenderSprite, scene) {
    return new Promise(resolve => {
        const graphics = scene.add.graphics(); // Ensure graphics is created in the correct context
        const lineColor = 0x800080; // Purple color for the line
        const circleColor = 0x800080; // Purple color for the circle
        const circleRadius = 20; // Radius of the circle

        const startX = defenderSprite.x;
        const startY = defenderSprite.y;
        const endX = attackerSprite.x;
        const endY = attackerSprite.y;

        // Step 1: Draw the line from defender to attacker
        graphics.lineStyle(5, lineColor); // Line thickness and color
        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.lineTo(endX, endY);
        graphics.strokePath();

        // Step 2: Create a circle and animate it along the line
        const circle = scene.add.circle(startX, startY, circleRadius, circleColor); // Ensure circle is created in the correct context

        // Step 3: Calculate the distance and steps for movement
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const speed = 200; // Pixels per second
        const duration = distance / speed; // Duration to travel the full distance

       scene.tweens.add({
            targets: circle,
            x: endX,
            y: endY,
            duration: duration * 1000, // Convert to milliseconds
            ease: 'Linear',
            onComplete: () => {
                graphics.clear(); // Clear the line after the animation
                circle.destroy(); // Destroy the circle after the animation
                resolve();
            }
        });
    });
}


async rayAttackAnimation(attackerSprite, defenderSprite, color, scene) {
    return new Promise(resolve => {
        const graphics = scene.add.graphics();
        graphics.lineStyle(10, color); // Use the passed color for the ray

        const startX = defenderSprite.x;
        const startY = defenderSprite.y;
        const endX = attackerSprite.x;
        const endY = attackerSprite.y;

        // Step 1: Draw the ray (line) from defender to attacker
        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.lineTo(endX, endY);
        graphics.strokePath();
        
        // Step 2: Keep the line visible for 3 seconds, then clear it
        scene.time.delayedCall(3000, () => {
            graphics.clear(); // Remove the ray after 3 seconds
            resolve();
        });
    });
}

async cutAnimation(defenderSprite, scene) {
    return new Promise(resolve => {
        const graphics = scene.add.graphics();
        graphics.lineStyle(5, 0xFF0000);
        
        const startX = defenderSprite.x - defenderSprite.displayWidth / 2;
        const startY = defenderSprite.y - defenderSprite.displayHeight / 2;
        const endX = defenderSprite.x + defenderSprite.displayWidth / 2;
        const endY = defenderSprite.y + defenderSprite.displayHeight / 2;

        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.lineTo(endX, endY);
        graphics.strokePath();
        
        // Keep the line visible for 1 second, then clear it
        scene.time.delayedCall(1000, () => {
            graphics.clear();
            resolve();
        });
    });
}

async projectileAttack(attackerSprite, defenderSprite, move, scene) {
    let numProjectiles = 1;
    // Uncomment this if move.count is defined and necessary
    // if (move.count) {
    //     numProjectiles = Math.ceil(Math.sqrt(move.count));
    // }
    const projectileDelay = 200;

    for (let i = 0; i < numProjectiles; i++) {
        await new Promise(resolve => {
            scene.time.delayedCall(i * projectileDelay, () => {
                const projectile = scene.physics.add.sprite(attackerSprite.x, attackerSprite.y, move.key);
                projectile.setScale(4); // Default scale

                const matchedMove = this.moves.find(m => m.name === move.name);
                if (matchedMove) {
                    projectile.setScale(matchedMove.scale); // Adjust scale if found
                }

                // Flip the projectile sprite if the attacker is on the right
                projectile.setFlipX(attackerSprite.x > defenderSprite.x);

                projectile.anims.play(move.key);

                scene.tweens.add({
                    targets: projectile,
                    x: defenderSprite.x,
                    y: defenderSprite.y,
                    duration: 600,
                    ease: 'Linear',
                    onComplete: () => {
                        projectile.destroy();
                        resolve();
                    }
                });
            });
        });
    }
}

async shadowAttack(attackerSprite, defenderSprite,scene) {
    // Create a shadow sprite based on the attacker's sprite
    const shadow = scene.physics.add.sprite(attackerSprite.x, attackerSprite.y, attackerSprite.texture.key);
    
    // Set shadow properties
    shadow.setScale(attackerSprite.scale * 0.8); // Adjust scale for less depth
    shadow.setTint(0x000000); // Set color to black
    shadow.alpha = 0.5; // Set transparency for shadow effect

    // Tween the shadow towards the defender
    await new Promise(resolve => {
       scene.tweens.add({
            targets: shadow,
            x: defenderSprite.x,
            y: defenderSprite.y,
            duration: 600,
            ease: 'Linear',
            onComplete: () => {
                // Destroy the shadow sprite on impact
                shadow.destroy();
                resolve(); // Resolve the promise to indicate completion
            }
        });
    });
}
/////////


async mirrorImage(attackerSprite, scene) {
    // Step 1: Check if a duplicate already exists and destroy it
    if (attackerSprite.duplicate) {
        attackerSprite.duplicate.destroy();
        attackerSprite.duplicate = null;
    }

    // Determine the direction based on the current Pokémon
    const direction = (attackerSprite === scene.currentPokemon) ? 'up' : 'down';

    // Step 2: Create the duplicate sprite overlapping the original
    const duplicate = scene.battleUI.loadPokemonSprite(attackerSprite.x, attackerSprite.y, attackerSprite.texture.key, attackerSprite.scale, direction, scene);
    // duplicate.setScale(attackerSprite.scale); // Match the scale of the original sprite
    // duplicate.setTint(0xFFFFFF); // Optional: Set a tint if you want to differentiate
    attackerSprite.duplicate = duplicate;
    attackerSprite.duplicate.count = 2; 

    // Step 3: Tween the duplicate away from the original to create the splitting effect
    await new Promise(resolve => {
        scene.tweens.add({ // Use this.scene for the tween
            targets: duplicate,
            x: attackerSprite.x + 100, // Move to the right by 100 pixels (adjust as needed)
            y: attackerSprite.y, // Keep the same Y position
            duration: 300, // Duration of the tween
            ease: 'Sine.easeInOut',
            onComplete: () => {
                resolve(); 
            }
        });
    });


}

async criticalHitAnimation(sprite, scene) {
    const graphics = scene.add.graphics();
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

    // Keep the line visible for 1 second, then clear it
    await new Promise(resolve => scene.time.delayedCall(1000, () => {
        graphics.clear();
        resolve(); // Resolve the promise to indicate completion
    }));
}



loadPokemonSprite(x, y, key, scale, direction = 'up', scene) {
    const sprite = scene.add.sprite(x, y, key);
    sprite.setScale(scale);
    sprite.anims.play(`${key}_${direction}Animation`); // Assuming animation key is based on the Pokémon key
    return sprite;
}



}
