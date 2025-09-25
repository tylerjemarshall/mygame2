class PartyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PartyScene' });
        this.selectionRectangles = [];
    }

    preload()
    {


        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        });

        this.load.image('background', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');
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


    create(data) {


        
     
        this.sceneManager = globals.sceneManager;




        this.escapeKeyListener = null; // To hold the listener reference

        this.locked=false;
        this.scene.bringToTop('PartyScene');
        this.originScene = data.originScene;
        this.currentPokemonData = data.currentPokemonData;
        this.action = data.action; // 'switch' or 'useItem'
        this.selectedMove = data.selectedMove;
        this.slot = data.slot;
        this.onSelect = data.onSelect;
        this.from = data.from;
        this.defender = data.defender ? data.defender : null;
        // this.scene = data.scene;

        if (this.action === 'withdraw')
        {
            this.pokemonData = globals.pc; //pc
            this.pokemonData = globals.monsterManager.pcMonsters;
        }
        else
        {
            this.pokemonData = globals.partyPokemonData;
            this.pokemonData = globals.monsterManager.partyMonsters;

        }
        this.selectedPokemonIndex = null;
        this.selectedItem = data.selectedItem;
        // this.item = item;
        this.healthBars = {};
        console.log('creating party window');
        console.log(this);

        this.createPartyWindow();

        console.log('origin scene:', this.originScene);
        console.log(this);
    }


    updatePokemonName(pokemon) {
        const pokemonIndex = this.pokemonData.indexOf(pokemon);
        if (pokemonIndex !== -1) {
            const button = this.partyWindowContainer.list[pokemonIndex];
            if (button) {
                const text = button.list.find(item => item instanceof Phaser.GameObjects.Text);
                if (text) {
                    text.setText(`${pokemon.name} (HP: ${pokemon.currentHp}/${pokemon.maxHp})`);
                }
            }
        }
    }
  
    createPartyWindow() {
        console.log('creating party window');
     
        if (this.slider) {
            this.slider.cleanup();
            this.slider = null;
        }
        // Add background image to fill the entire scene
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setDepth(0);
      
        const containerWidth = 400;
        const containerHeight = 400;
        this.partyWindowContainer = this.add.container(this.cameras.main.width / 2 - containerWidth / 2, this.cameras.main.height / 3 - containerHeight / 2 + 100);
        this.partyWindowContainer.setSize(containerWidth, containerHeight);
        
        // this.partyWindowContainer.initialY=this.partyWindowContainer.y;
        // Add Pokémon list
        this.pokemonData.forEach((pokemon, index) => {
          const pokemonButton = this.createPokemonButton(pokemon, index, containerWidth);
          this.partyWindowContainer.add(pokemonButton);
        });
      
    
        this.slider = new Slider(this, this.partyWindowContainer);
        

        const closeButton = this.createButton(this.cameras.main.width - 50, 50, 40, 40, 'X',  () => this.closePartyWindow());
    

        if (this.currentPokemonData && this.currentPokemonData.currentHp === 0)
        {
            console.log('disabling interactive of close button because hp is 0 need to swap');
            closeButton.getAt(0).disableInteractive();
        }
      }
      
      createPokemonButton(pokemon, index, containerWidth) {
        const button = this.add.container(10, index * 60);
        const selectionRect = this.add.rectangle(-2, -2, containerWidth - 16, 54, 0xFF0000);
        selectionRect.setOrigin(0, 0);
        selectionRect.setStrokeStyle(3, 0xFF0000);
        selectionRect.setVisible(false);
        button.add(selectionRect);
        this.selectionRectangles[index] = selectionRect;



        // Add panel behind everything
        const panel = this.add.image(0, 0, 'panel');
        panel.setDisplaySize(containerWidth - 20, 50);
        panel.setOrigin(0, 0);
        button.add(panel);
      
        // Add panel2 behind the Pokémon sprite
        const panel2 = this.add.image(5, 5, 'panel2');
        panel2.setDisplaySize(40, 40);
        panel2.setOrigin(0, 0);
        button.add(panel2);
      
        // Add Pokémon sprite
        const sprite = this.add.sprite(25, 25, pokemon.key);
        sprite.setScale(2);
        button.add(sprite);
      
        // Add Pokémon name and HP
        const text = this.add.text(50, 10, `${pokemon.name} (HP: ${pokemon.currentHp}/${pokemon.maxHp})`, { fill: '#ffffff' });
        button.add(text);
      
    

        this.healthBars[index] = this.createHealthBar(50, 35, containerWidth - 80, 5, pokemon);
        // this.updateHealthBar(healthBar, pokemon, true);
        button.add(this.healthBars[index]);

   
        console.log('origin scene for party scene is ' + this.originScene);
        console.log('action for party scene is ' + this.action);
 
    
        let buttonText;
        switch (this.originScene) {
            case 'ComputerScene':
                buttonText = this.action === 'withdraw' ? 'Withdraw' : 'Deposit';
                break;
            case 'ItemsScene':
                buttonText = 'Use';
                break;
            case 'BreederScene':
                buttonText = 'Breed';
                break;
            default:
                switch (this.action) {
                    case 'useItem':
                        buttonText = 'Use';
                        break;
                    case 'switch':
                        buttonText = 'Switch';
                        break;
                    case 'Learn':
                        buttonText = 'Learn';
                        break;
                    case 'Rename':
                        buttonText = 'Rename';
                        break;
                    case 'Breed':
                        buttonText = 'Breed';
                        break;
                    default:
                        buttonText = 'Action'; // Default text if no condition is met
                }
        }

        const switchButton = this.createButton(containerWidth - 120, 15, 57, 20, buttonText, async  () =>  { await this.buttonAction(pokemon)});
        button.add(switchButton);

      
        // Add Details button
        const detailsButton = this.createButton(containerWidth - 50, 15, 57, 20, 'Details', () => {
   
            globals.sceneManager.launch('PokemonDetailsScene', {
                pokemon: pokemon,
                originScene: 'PartyScene'
            });
        });
        button.add(detailsButton);

        button.setSize(containerWidth - 20, 50);
    
        return button;
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
            .on('pointerdown', async () => {
                button.setTexture('button_selected');
                await callback();
            })
            .on('pointerup', () => button.setTexture('button_hover'));
    
        return this.add.container(0, 0, [button, buttonText]);
    }
      

    withdrawPokemon(pokemon) {
        if (globals.partyPokemonData.length < 6) {
            globals.partyPokemonData.push(pokemon);
            globals.pc.splice(globals.pc.indexOf(pokemon), 1);
            this.closePartyWindow();
        } else {
            console.log('Party is full, cannot withdraw');
        }
    }
    
    depositPokemon(pokemon) {
        if (globals.partyPokemonData.length > 1) {
            globals.pc.push(pokemon);
            globals.partyPokemonData.splice(globals.partyPokemonData.indexOf(pokemon), 1);
            this.closePartyWindow();
        } else {
            console.log('You must have at least one Pokémon in your party');
        }
    }
    





    //   showPokemonDetails(pokemon) {
    //     // Implement logic to show detailed information about the Pokémon
    //     console.log('Showing details for', pokemon.name);
    //     // You can create a new scene or a popup to display detailed information
    // }
    
    createHealthBar(x, y, width, height, pokemon) {
        const healthBar = this.add.graphics();
        healthBar.x = x;
        healthBar.y = y;
        healthBar.width = width;
        healthBar.height = height;
        
        // Calculate initial health percentage
        const healthPercentage = pokemon.currentHp / pokemon.maxHp;
        const currentWidth = width * healthPercentage;
        healthBar.previousWidth = currentWidth;
        healthBar.fullWidth = width;
        healthBar.width = currentWidth;

        // Draw the health bar
        this.updateHealthBar(healthBar, pokemon, true);
    
        // Store the current width for future updates
    
        return healthBar;
    }
    
    async updateHealthBar(healthBar, pokemon, instant = false) {
        console.log('updating healthbar');
        const healthPercentage = pokemon.currentHp / pokemon.maxHp;
        const targetWidth = healthBar.fullWidth * healthPercentage;
    
        if (healthBar.width === healthBar.previousWidth)
        {
            console.log('previouswidth the same as current width');  
        }
        const drawBar = (width) => {
            healthBar.clear();
            // Draw background (red part)
            healthBar.fillStyle(0xff0000);
            healthBar.fillRect(0, 0, healthBar.fullWidth, healthBar.height);
            // Draw current health (green part)
            healthBar.fillStyle(0x00ff00);
            healthBar.fillRect(0, 0, width, healthBar.height);
            // Draw border
            healthBar.lineStyle(1, 0x000000);
            healthBar.strokeRect(0, 0, healthBar.fullWidth, healthBar.height);
        };
    
        if (instant) {
            healthBar.previousWidth = targetWidth;
            drawBar(targetWidth);
            console.log('setting bar instantly');
        } else {
            console.log('setting health bar slowly');

            return new Promise((resolve) => { // Create a new promise
    
                this.tweens.add({
                    targets: { value: healthBar.width },
                    value: targetWidth,
                    duration: 500,
                    ease: 'Sine.easeInOut',
                    onUpdate: (tween) => {
                        const newWidth = tween.getValue();
                        drawBar(newWidth);
                        // console.log('drawing bar at: ', newWidth);
                    },
                    onComplete: () => {
                        healthBar.previousWidth = targetWidth;
                        resolve();
                    }
                });
            });
        }
    }
    


    // buttonAction(pokemon) {

    //     console.log('action=', this.action);
    //     console.log('selected item=', this.selectedItem);
    //     console.log('originScene=', this.originScene);
    //     console.log('locked: ', this.locked);
    //     if (this.locked) return;
    //     const isHealingItem = ['potion', 'superpotion', 'food', 'hyperpotion'].includes(this.selectedItem?.key.toLowerCase());

    //     if (this.originScene === 'ComputerScene') {
    //         if (this.action === 'withdraw') {
    //             this.withdrawPokemon(pokemon);
    //         } else {
    //             this.depositPokemon(pokemon);
    //         }
    //     } else if (this.action === 'switch' && this.originScene === 'ItemsScene') { //this.originScene === 'BattleScene'
    //         if (pokemon !== this.currentPokemonData && pokemon.currentHp > 0) {
    //             console.log('Switching to: ' + pokemon.name);
    //             this.scene.get('BattleScene').switchPokemon(pokemon);
    //             this.closePartyWindow();
    //         }
    //     } 
    //     else if (this.originScene === 'ItemsScene' || this.originScene === 'BattleScene' || this.originScene === 'MenuScene') {
    //         if (this.action === 'switch') {
    //             if (pokemon !== this.currentPokemonData && pokemon.currentHp > 0) {
    //                 console.log('Switching to: ' + pokemon.name);
    //                 this.scene.get('BattleScene').switchPokemon(pokemon);
    //                 this.closePartyWindow();
    //             }
    //             else {
    //                 console.log('Cannot switch to: ' + pokemon.name);
    //             }
    //         } else if (this.action === 'useItem' && this.selectedItem) {
    //             if (this.selectedItem.name === 'revive' && pokemon.currentHp !== 0)
    //             {
    //                 console.log('can only revive feinted pokemon');
    //                 return;
    //             }    
    //             if ((pokemon.currentHp === pokemon.maxHp && isHealingItem) || (pokemon.currentHp === 0 && isHealingItem))
    //             {
    //                 console.log('pokemon max hp or is feinted');
                  
    //                 return;
    //             }
    //             // this.useItemOnPokemon(pokemon, this.selectedItem);
    //             // console.log('closed party scene');
    //             // this.scene.get('BattleScene').updateHealthBars();
    //             // this.closePartyWindow();
    //             // this.scene.get('ItemsScene').closeItemWindow(); // Close the ItemScene
    //             // console.log('closed item scene');
    //             // this.scene.get('BattleScene').setDefeated(false);
    //             // this.scene.get('BattleScene').enemyAttack();
    //             console.log('using item');
    //             this.useItemOnPokemon(pokemon, this.selectedItem);
    //         console.log('Used item on Pokemon');
    //         // this.scene.get('BattleScene').updateHealthBars();
    //         // Check if BattleScene is active before updating health bars

    //         const battleScene = this.scene.get('BattleScene');
    //         if (battleScene.scene.isPaused() || this.scene.isActive('BattleScene')) { //battleScene && 
    //             // Perform your action here, e.g., using an item
    //             console.log('updating health bars');
    //             battleScene.updateHealthBars();
          
    //         } else {
    //             console.log('BattleScene does not exist');
    //         }

    //         // this.updateHealthBar(this.healthBars[this.pokemonData.indexOf(pokemon)], pokemon);
    //         const pokemonIndex = this.pokemonData.indexOf(pokemon);
    //         if (pokemonIndex !== -1) {
    //             this.updateHealthBar(this.healthBars[pokemonIndex], pokemon);
    //         } else {
    //             console.error('Pokemon not found in pokemonData array');
    //         }
    //         if (isHealingItem || this.selectedItem.name==='revive') {
    //             this.locked=true;

    //             this.time.delayedCall(500, () => {
    //                 this.locked=false;
    //                 this.closePartyWindow();
    //                 this.scene.get('ItemsScene').closeItemWindow();
    //                 console.log('Closed party and item scenes');
    //                 if (battleScene.scene.isPaused() || this.scene.isActive('BattleScene')) { //battlescene
    //                     battleScene.setDefeated(false);
    //                     battleScene.enemyAttack();
    //                 }
    //                 else
    //                 {
    //                     console.log('skipping actions since no battlescene detected');
    //                 }
                 
    //             });
    //         } else {
    //             this.closePartyWindow();
    //             console.log('closing item window');
    //             console.log('action: ', this.action);
    //             this.scene.get('ItemsScene').closeItemWindow();
    //             console.log('Closed party and item scenes');
    //             this.scene.get('BattleScene').setDefeated(false);
    //             this.scene.get('BattleScene').enemyAttack();
    //         }
    //         }
    //     }
    //     else if (this.originScene === 'MenuScene') {
    //         if (this.selectedPokemonIndex === null) {
    //             // First Pokémon selected
    //             this.selectedPokemonIndex = this.pokemonData.indexOf(pokemon);



    //             this.selectionRectangles.forEach((rect, i) => {
    //                 rect.setVisible(i === this.selectedPokemonIndex);
    //             });

    //             console.log(`First Pokémon selected: ${pokemon.name}`);
    //         } else {
    //             // Second Pokémon selected, perform the swap
    //             const firstIndex = this.selectedPokemonIndex;
    //             const secondIndex = this.pokemonData.indexOf(pokemon);
    //             const temp = this.pokemonData[firstIndex];
    //             this.pokemonData[firstIndex] = this.pokemonData[secondIndex];
    //             this.pokemonData[secondIndex] = temp;
    
    //             console.log(`Swapped ${this.pokemonData[secondIndex].name} with ${this.pokemonData[firstIndex].name}`);
    
    //             // Reset selection and redraw the party window
    //             this.selectedPokemonIndex = null;

    //             this.selectionRectangles.forEach((rect, i) => {
    //                 rect.setVisible(i === null);
    //             });

    //             this.createPartyWindow();
    
    //             // Update the following Pokémon if the first Pokémon was swapped
    //             if (firstIndex === 0 || secondIndex === 0) {
    //                 this.scene.get('MapScene').switchFollowingPokemon(this.pokemonData[0]);
    //             }
    //         }
    //     } else if (this.originScene === 'ItemsScene' && this.selectedItem) {
    //         if (pokemon.currentHp === pokemon.maxHp && isHealingItem)
    //             {
    //                 console.log('pokemon max hp');
           
    //                 return;
    //             }
    //         // Use the item on the selected Pokémon
    //         this.useItemOnPokemon(pokemon, this.selectedItem);
    //         // this.updateHealthBar(this.healthBars[this.pokemonData.indexOf(pokemon)], pokemon);
    //         const pokemonIndex = this.pokemonData.indexOf(pokemon);
    //         if (pokemonIndex !== -1) {
    //             this.updateHealthBar(this.healthBars[pokemonIndex], pokemon);
    //         } else {
    //             console.error('Pokemon not found in pokemonData array');
    //         }
    //         // this.closePartyWindow();
    //         if (isHealingItem || this.selectedItem.key==='revive') {
    //             this.locked=true;

    //             // Add a delay for healing items
    //             this.time.delayedCall(500, () => {
    //                 this.locked=false;
    //                 this.closePartyWindow();
    //             });
    //         } else {
    //             // For non-healing items, close immediately
    //             this.closePartyWindow();
    //         }
    //     }
    //     else if (this.action === 'Learn')
    //     {
    //         console.log('selected learn ' + pokemon.name + ' the move ' + this.selectedMove.name);
    //         if (pokemon.moves.length < 4)
    //         {

                

                
    //             const isSpecialMove = this.selectedMove.name.includes('Beam');

    //             this.selectedMove.currentPP = this.selectedMove.maxPP;
    //             if (isSpecialMove)
    //             {
    //                 this.selectedMove.count = 2
    //             }
    //             else
    //             {
    //                 this.selectedMove.count = undefined;
    //             }
                
    //             pokemon.moves.push(this.selectedMove);

    //             this.closePartyWindow();
    //         }else
    //         {
    //             this.turnOffListener();
    //             this.scene.stop('PartyScene');
    //             this.scene.launch('PokemonDetailsScene', {
    //                 originScene: this.originScene,
    //                 pokemon: pokemon,  // assuming you have this data
    //                 action: 'Learn',  // or 'useItem', depending on what action the player is taking
    //                 move: this.selectedMove
    //             });
    //         }
          
    //     }
    //     else if (this.action === 'Rename')
    //     {
    //         console.log('selected rename ' + pokemon.name);
    //         this.turnOffListener();
    //         // this.scene.stop('PartyScene');
    //         // // this.closePartyWindow();
    //         // this.scene.launch('RenamePokemonScene', {
    //         //     originScene: 'PartyScene',
    //         //     pokemon: pokemon,  // assuming you have this data
    //         //     action: 'Rename',  // or 'useItem', depending on what action the player is taking
                
    //         // });
    //         globals.sceneManager.transitionTo('RenamePokemonScene', {
    //             originScene: 'PartyScene',
    //             pokemon: pokemon,  // assuming you have this data
    //             action: 'Rename',  // or 'useItem', depending on what action the player is taking
                
    //         }, true);
    //     }
    //     else if (this.action === 'Breed')
    //     {
    //         console.log('pokemon selected is ', pokemon.name);
    //         // Pass the selected Pokémon back to the BreederScene
    //         this.onSelect(this.slot, pokemon);
    //         this.scene.stop();
            
    //     }
    // }
    async buttonAction(pokemon) {
        console.log('action=', this.action);
        console.log('selected item=', this.selectedItem);
        console.log('originScene=', this.originScene);
        console.log('locked: ', this.locked);
        console.log('pokemon: ', pokemon);

    
        if (this.locked) return;
    
        // const isHealingItem = ['potion', 'superpotion', 'food', 'hyperpotion', 'berry'].includes(this.selectedItem?.key.toLowerCase());

     
        const isHealingItem = [
            'potion', 'superpotion', 'food', 'hyperpotion', 
            'normal berry', 'fire berry', 'water berry', 'grass berry', 
            'electric berry', 'ice berry', 'poison berry', 'psychic berry', 
            'bug berry', 'rock berry', 'ghost berry', 'dark berry'
        ].includes(this.selectedItem?.name.toLowerCase());


        const battleScene = globals.gameInstance.scene.getScene('BattleScene');
    
        switch (this.originScene) {
            case 'ComputerScene':
                if (this.action === 'withdraw') {
                    this.withdrawPokemon(pokemon);
                } else {
                    this.depositPokemon(pokemon);
                }
                break;
    
            case 'ItemsScene':
            case 'BattleScene':
            // case 'MenuScene':
            // console.log('selecting battlescene');
                switch (this.action) {
                    case 'switch':
                        

                        if (!battleScene.playerMonsters.includes(pokemon) && pokemon.currentHp > 0 )
                        { 
                            // console.log('defender: ' , this.defender);
                            if (this.defender)
                            {
                                // battleScene.switchPokemon(pokemon);
                                // console.log('partyqueue', battleScene.partyQueue);
                                await battleScene.battleUI.switchPokemon(pokemon, this.defender );
                                battleScene.partyQueue = battleScene.partyQueue.filter(entry => entry.defender !== this.defender);
                                this.closePartyWindow();
                                if (battleScene.partyQueue.length > 0 && 
                                    globals.monsterManager.partyMonsters.some(pokemon => 
                                        pokemon && pokemon.currentHp > 0 && 
                                        !battleScene.playerMonsters.includes(pokemon))) {
                                    console.log(battleScene.partyQueue);
                                    battleScene.setCurrentTurn(battleScene.partyQueue[0].defender);
                                    battleScene.showPartyWindow(battleScene.partyQueue[0].defender);
                                }
                                else
                                {
                                    battleScene.resetPlayerTurn();
                                }
                            }
                            else
                            {
                                // battleScene.switchPokemon(pokemon);
                                battleScene.createMove3('switch',battleScene.currentTurn, pokemon);
                                this.closePartyWindow();
                            }
                          
                        }
                        
                        // else
                        // if (pokemon !== this.currentPokemonData && pokemon.currentHp > 0 && !battleScene.double) {
                            
                            
                        //         battleScene.battleUI.switchPokemon(battleScene.currentTurn, pokemon);
                        
                            
                        //     this.closePartyWindow();
                        // } 
                        break;
    
                    case 'useItem':
                    case 'berries':
                        console.log('using itemmanager in party scene');
                        await globals.itemManager.useItem(this, this.selectedItem, pokemon, this.defender);
                        break;
                        if (this.selectedItem) {
                            if ((this.selectedItem.name === 'revive' && pokemon.currentHp !== 0) ||
                                ((pokemon.currentHp === pokemon.maxHp || pokemon.currentHp === 0) && isHealingItem)) {
                                console.log('Cannot use item on this Pokemon');
                                return;
                            }
    
                            console.log('using item');
                            this.useItemOnPokemon(pokemon, this.selectedItem);
                            console.log('Used item on Pokemon');
    
                            if (battleScene.scene.isPaused() || globals.gameInstance.scene.isActive('BattleScene')) {
                                console.log('updating health bars');
                                battleScene.battleUI.updateHealthBars();
                            } else {
                                console.log('BattleScene does not exist');
                            }
    
                            const pokemonIndex = this.pokemonData.indexOf(pokemon);
                            if (pokemonIndex !== -1) {
                                this.updateHealthBar(this.healthBars[pokemonIndex], pokemon);
                            } else {
                                console.error('Pokemon not found in pokemonData array');
                            }
    
                            if (isHealingItem || this.selectedItem.name === 'Revive') {
                                this.locked = true;
                                this.time.delayedCall(500, () => {
                                    this.locked = false;
                                    this.closePartyWindow();
                                    globals.controlGameInstance.scene.getScene('ItemsScene').closeItemWindow();
                                    console.log('Closed party and item scenes');
                                    if (battleScene.scene.isPaused() || globals.gameInstance.scene.isActive('BattleScene')) {
                                        battleScene.defeated=false;
                                        // battleScene.enemyAttack();
                                    } else {
                                        console.log('skipping actions since no battlescene detected');
                                    }
                                });
                            } else {
                                this.closePartyWindow();
                                console.log('closing item window');
                                console.log('action: ', this.action);
                                globals.controlGameInstance.scene.getScene('ItemsScene').closeItemWindow();
                                console.log('Closed party and item scenes');
                                battleScene.defeated=false;
                                // battleScene.enemyAttack();
                            }
                        }
                        break;
                }
                break;
    
            case 'MenuScene':
                if (this.selectedPokemonIndex === null) {
                    this.selectedPokemonIndex = this.pokemonData.indexOf(pokemon);
                    this.selectionRectangles.forEach((rect, i) => {
                        rect.setVisible(i === this.selectedPokemonIndex);
                    });
                    console.log(`First Pokémon selected: ${pokemon.name}`);
                } else {
                    const firstIndex = this.selectedPokemonIndex;
                    const secondIndex = this.pokemonData.indexOf(pokemon);
                    [this.pokemonData[firstIndex], this.pokemonData[secondIndex]] = [this.pokemonData[secondIndex], this.pokemonData[firstIndex]];
                    console.log(`Swapped ${this.pokemonData[secondIndex].name} with ${this.pokemonData[firstIndex].name}`);
                    this.selectedPokemonIndex = null;
                    this.selectionRectangles.forEach(rect => rect.setVisible(false));
                    this.createPartyWindow();
                    if (firstIndex === 0 || secondIndex === 0) {
                        globals.gameInstance.scene.getScene('MapScene').switchFollowingPokemon(this.pokemonData[0]);
                    }
                }
                break;
            case 'MapScene':
                switch(this.action)
                {
                    case 'Rename':
                        console.log('selected rename ' + pokemon.name);
                        this.turnOffListener();
                        globals.sceneManager.transitionTo('RenamePokemonScene', {
                            originScene: 'PartyScene',
                            pokemon: pokemon,  // assuming you have this data
                            action: 'Rename',  // or 'useItem', depending on what action the player is taking
                            
                        }, true);

                        break;
              
                }
                break;
            case 'MoveListScene':
            // case 'Learn':
                        
                    console.log('selected learn ' + pokemon.name + ' the move ' + this.selectedMove.name);
                    if (pokemon.moves.length < 4)

                    {
                        console.log('less than 4 moves');
                        const isSpecialMove = this.selectedMove.name.includes('Beam');
                        this.selectedMove.currentPP = this.selectedMove.maxPP;
                        if (isSpecialMove)
                        {   this.selectedMove.count = 2
                            console.log('setting count to 2 for ' + this.selectedMove.name);
                        }
                        else

                        { 
                            console.log('pushing new move');
                            this.selectedMove.count = undefined;
                        
                        }

                            const newMove = new Move({ data: this.selectedMove }); // Create Move instance


                        pokemon.moves.push(newMove);//this.selectedMove

                        // this.closePartyWindow();
                        globals.sceneManager.transitionTo('PokemonDetailsScene', 
                            {
                                originScene: this.originScene,
                                pokemon: pokemon,
                                action: 'View',
                                from: 'PartyScene',
                                move: this.selectedMove
                            }
                        )
                    }else
                    {
                        globals.sceneManager.transitionTo('PokemonDetailsScene', 
                            {
                                originScene: this.originScene,
                                pokemon: pokemon,
                                action: 'Learn',
                                move: this.selectedMove,
                                from: 'MoveListScene'
                            }
                        )
                        
                    }
                    break;
                case 'BreederScene':
                    console.log('pokemon selected is ', pokemon.name);
                        // Pass the selected Pokémon back to the BreederScene
                        this.onSelect(this.slot, pokemon);
                        // this.scene.stop();
                        globals.sceneManager.transitionTo('BreederScene');
                    
                    break;
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
    
    turnOnListener()
    {
        // Add an event listener for the Escape key
        this.escapeKeyListener = (event) => {
        if (event.key === 'Escape') {
            this.closePartyWindow();
        }
        };
        document.addEventListener('keydown', this.escapeKeyListener);
    }

    cancel()
    {


        console.log('origin scene = ', this.originScene.key);
        console.log('action = ', this.action);
        if (this.action === 'Rename')
        {
            globals.sceneManager.start('MapScene', { });
            this.scene.get('MapScene').setKeyboardEnabled(true);
            return;
        }

        if (this.action === 'Learn')
        {
            globals.transitionTo(this.originScene.key);
            return;
        }


        // Check if BattleScene is paused or active
        const isBattleScenePaused = this.scene.isPaused('BattleScene');
        const isBattleSceneActive = this.scene.isActive('BattleScene');
        

        if (isBattleSceneActive || isBattleScenePaused)
        {
            this.originScene = 'BattleScene';
        }
        else
        {
            this.originScene = 'MenuScene';
        }


        if (this.action === 'useItem')
        {
            globals.sceneManager.transitionTo('ItemsScene', { originScene: this.originScene, fromParty: true });

        }
        else
        {
            globals.sceneManager.transitionTo(this.originScene, { fromParty: true });

        }

    }




    closePartyWindow() {
        console.log('closing party window!');
        console.log('origin scene:', this.originScene);
        console.log('action:', this.action);
        console.log('from:', this.from);
    
        if (this.originScene === 'ItemsScene') {
            this.scene.get('ItemsScene').events.emit('updateItemList');
        }
    
        this.turnOffListener();

        
    
        switch (this.action) {
            case 'Learn':
                globals.sceneManager.transitionTo(this.originScene);
                break;
            case 'Rename':
                console.log('going to map scene');
                // this.scene.stop();
                globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);
                globals.sceneManager.transitionTo('MapScene');
                break;
            case 'useItem':
            case 'berries':
                console.log('transitioning to battlescene and cleaning up scenes.');
                console.log('from: ', this.from);
                if (this.from === 'MenuScene')
                {
                    globals.sceneManager.relaunch('ItemsScene', {originScene:'MenuScene'});
                    globals.sceneManager.stop('PartyScene');
                    // globals.controlGameInstance.scene.bringToTop('ItemsScene');

                }
                else
                {
                    globals.sceneManager.transitionTo(this.from, { fromParty: true });
                    this.scene.get('ItemsScene').scene.stop();

                }
                break;
            default:
                if (this.originScene === 'MenuScene') {
                    console.log('starting menuscene instead of transitionto');
                    globals.sceneManager.transitionTo('MenuScene', { fromParty: true });
                } else {
                    if (this.originScene === 'BattleScene')
                    {
                        globals.sceneManager.stop('PartyScene');
                    }
                    else
                    {
                        console.log('transitioning to: ' + this.originScene + ' with action: ' + this.action);
                        globals.sceneManager.transitionTo(this.originScene, { fromParty: true, action: this.action });
    
                    }
                  
                }
                break;
        }
    }
    
    // closePartyWindow() {
    //     console.log('closing party window!');
    //     console.log('origin scene: ', this.originScene);
    //     console.log('action: ', this.action);
    //     console.log('from: ', this.from);

    //     // // Check if BattleScene is paused or active
    //     // const isBattleScenePaused = this.scene.isPaused('BattleScene');
    //     // const isBattleSceneActive = this.scene.isActive('BattleScene');


    //     // if (isBattleSceneActive || isBattleScenePaused)
    //     // {
    //     //     this.originScene = 'BattleScene';
    //     // }
    //     // else
    //     // {
    //     //     this.originScene = 'MenuScene';
    //     // }



    //     if (this.originScene === 'ItemsScene') {
    //         // Update the item quantity in the global items array
           
    
    //         // Notify the ItemsScene to update its display
    //         this.scene.get('ItemsScene').events.emit('updateItemList');
    //     }
    
    //     // this.scene.stop();
    //     if (this.action === 'Learn' || this.action === 'Rename')
    //     {
    //         this.scene.stop();
    //         this.scene.get('MapScene').setKeyboardEnabled(true);
    //         this.scene.start('MapScene');
    //     }
        
       
    //     console.log('resuming: ' + this.originScene);
    //     this.turnOffListener();

    //     if (this.originScene === 'MenuScene')
    //     {   
    //         // console.log('turning on listener');
    //         // this.scene.start(this.originScene);
    //         // this.scene.get('MenuScene').setKeyboardEnabled(true);

    //         globals.sceneManager.transitionTo('MenuScene', { fromParty: true });

    //     }
    //     else
    //     {
    //         // this.scene.resume(this.originScene);
    //         if (this.action === 'useItem')
    //         {


    //             console.log('transitioning to battlescene and cleaning up scenes.');
    //             globals.sceneManager.transitionTo('BattleScene', { fromParty: true });
    //             this.scene.get('ItemsScene').scene.stop();

    //         }
    //         else
    //         {
    //             globals.sceneManager.transitionTo(this.originScene, { fromParty: true });
    //         }
            

    //     }
    // }
      showPokemonDetails(pokemon) {
        // Clear any existing details
        if (this.detailsContainer) {
            this.detailsContainer.destroy();
        }
        // if (this.partyWindowContainer) {
        //     this.partyWindowContainer.destroy();
        //     this.partyWindowContainer = null;
        // }
        if (this.slider) {
            this.slider.cleanup();
            this.slider = null;
        }


        // Create a new container for the details
        this.detailsContainer = this.add.container();
   
    
        const textConfig = { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' };
        const xOffset = 50;
        const yOffset = 50;
    
        // Pokémon name with type color background
        const nameColor = globals.pokemonTypes[pokemon.type];
        const nameBackground = this.add.rectangle(xOffset - 10, yOffset - 10, 200, 35, nameColor);
        nameBackground.setOrigin(0);
        const nameText = this.add.text(xOffset, yOffset, `Name: ${pokemon.name}`, textConfig);
        this.detailsContainer.add([nameBackground, nameText]);
    
        // Pokémon type
        const typeText = this.add.text(xOffset, yOffset + 30, `Type: ${pokemon.type}`, textConfig);
        this.detailsContainer.add(typeText);
    
        // Pokémon stats
        const statsTexts = [
            `Level: ${pokemon.level}`,
            `HP: ${pokemon.currentHp}/${pokemon.maxHp}`,
            `Attack: ${pokemon.attack}`,
            `Defense: ${pokemon.defense}`,
            `Speed: ${pokemon.speed}`
        ].map((stat, index) => {
            return this.add.text(xOffset, yOffset + 60 + index * 30, stat, textConfig);
        });
        this.detailsContainer.add(statsTexts);
    
        // Pokémon moves
        const moves = pokemon.moves;
        const moveTexts = moves.map((move, index) => {
            return this.add.text(xOffset, yOffset + 210 + index * 30, 
                `- ${move.name} (${move.type}) - Damage: ${move.damage} - Speed: ${move.speed}`, 
                textConfig);
        });
        this.detailsContainer.add(moveTexts);
    
        // Pokémon sprite
        const pokemonSprite = this.add.sprite(400, 100, pokemon.key);
        pokemonSprite.setScale(6);
        if (!this.anims.exists(pokemon.key)) {
            this.anims.create({
                key: pokemon.key,
                frames: this.anims.generateFrameNumbers(pokemon.key, { frames: [0, 4, 8, 12] }),
                frameRate: 10,
                repeat: -1
            });
        }
        pokemonSprite.play(pokemon.key);
        this.detailsContainer.add(pokemonSprite);
    
        // Back button
        const backButton = this.add.text(xOffset, this.cameras.main.height - 50, 'Back', textConfig);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.detailsContainer.destroy();
            this.createPartyWindow();
        });
        this.detailsContainer.add(backButton);
    }
    
    // useItemOnPokemon(pokemon, item, potionQuantity = 1) {
    //     console.log(`Using ${item.name} on ${pokemon.name}`);
    
        
    //     // Apply item effects to the Pokémon
    //     switch (item.name.toLowerCase()) {
    //         case 'potion':
    //             if (pokemon.currentHp !== 0 && item.quantity > 0 && pokemon.currentHp != pokemon.maxHp) {
    //                 if (potionQuantity > 1) {
    //                     const maxHealAmount = Math.min(40 * potionQuantity, pokemon.maxHp - pokemon.currentHp);
    //                     if (maxHealAmount <= 0) {
    //                         console.log('No healing needed or no potions available.');
    //                         return;
    //                     }
    //                     const potionsUsed = Math.ceil(maxHealAmount / 40);
    //                     pokemon.currentHp += maxHealAmount;
    //                     item.quantity -= potionsUsed;
    //                     console.log(`Healed Pokémon by ${maxHealAmount} using ${potionsUsed} potions.`);
    //                     console.log(`Remaining potions: ${item.quantity}`);
    //                 } else {
    //                     const healAmount = Math.min(40, pokemon.maxHp - pokemon.currentHp);
    //                     pokemon.currentHp += healAmount;
    //                     item.quantity -= 1;
    //                     console.log(`Pokemon healed by ${healAmount}`);
    //                 }
    //             } else {
    //                 console.log('Can\'t heal fainted pokemon or out of potions or pokemon is at max hp');
    //             }
    //             break;
    //         case 'pokeball':
    //             console.log('No action for using a pokeball');
    //             break;
    //         case 'revive':
    //             if (pokemon.currentHp === 0 && item.quantity > 0) {
    //                 const healAmount = Math.min(50, pokemon.maxHp);
    //                 pokemon.currentHp = healAmount;
    //                 item.quantity -= 1;
    //                 console.log(`Revived pokemon with ${healAmount} HP`);
    //             } else {
    //                 console.log('Can only heal fainted pokemon or out of revives');
    //             }
    //             break;
    //         case 'food':
    //             if (pokemon.currentHp !== 0 && item.quantity > 0 && pokemon.currentHp != pokemon.maxHp) {
    //                 const healAmount = Math.min(20, pokemon.maxHp - pokemon.currentHp);
    //                 pokemon.currentHp += healAmount;
    //                 item.quantity -= 1;
    //                 console.log(`Pokemon healed by ${healAmount}`);
    //             } else {
    //                 console.log('Can\'t heal fainted pokemon or out of potions or pokemon is at max hp');
    //             }
    //             break;
    //         case 'maxpp':
    //             if (item.quantity > 0) {
    //                 item.quantity -= 1;
    //                 pokemon.moves.forEach(move => {
    //                     move.currentPP = move.maxPP;
    //                 });
    //                 console.log('Restored all PP to max');
    //             } else {
    //                 console.log('No items left of Max PP');
    //             }
    //             break;
    //         case 'superpotion':
    //             if (pokemon.currentHp !== 0 && item.quantity > 0 && pokemon.currentHp != pokemon.maxHp) {
    //                 const healAmount = Math.min(100, pokemon.maxHp - pokemon.currentHp);
    //                 pokemon.currentHp += healAmount;
    //                 item.quantity -= 1;
    //                 console.log(`Pokemon healed by ${healAmount}`);
    //             } else {
    //                 console.log('Can\'t heal fainted pokemon or out of potions or pokemon is at max hp');
    //             }
    //             break;
    //         case 'rarecandy':
    //             this.setPokemonStats(pokemon, 1);
    //             item.quantity -= 1;
    //             console.log('Leveled up pokemon');
    //             break;
    //         case 'hyperpotion':
    //             if (pokemon.currentHp !== 0 && item.quantity > 0 && pokemon.currentHp != pokemon.maxHp) {
    //                 const healAmount = Math.min(300, pokemon.maxHp - pokemon.currentHp);
    //                 pokemon.currentHp += healAmount;
    //                 item.quantity -= 1;
    //                 console.log(`Pokemon healed by ${healAmount}`);
    //             } else {
    //                 console.log('Can\'t heal fainted pokemon or out of potions or pokemon is at max hp');
    //             }
    //             break;
    //         case 'antidot':
    //             if (pokemon.status === 'Poison' && item.quantity > 0) {
    //                 pokemon.status = 'none';
    //                 item.quantity -= 1;
    //                 console.log('Pokemon cured of poison');
    //             } else {
    //                 console.log('Pokemon not poisoned or out of antidotes');
    //             }
    //             break;
    //         case 'burnheal':
    //             if (pokemon.status === 'Burn' && item.quantity > 0) {
    //                 pokemon.status = 'none';
    //                 item.quantity -= 1;
    //                 console.log('Pokemon cured of burn');
    //             } else {
    //                 console.log('Pokemon not burned or out of burn heals');
    //             }
    //             break;
    //         default:
    //             console.log(`Unknown item: ${item.name}`);
    //     }
    
    //     // Update the UI to reflect changes
    //     this.updatePokemonUI(pokemon);
    // }

   
    useItemOnPokemon(pokemon, item, potionQuantity = 1) {
        console.log(`Using ${item.name} on ${pokemon.name}`);


         // Define a map of healing items with their healing amounts
        const healingItems = new Map([
            ['potion', 100],
            ['superpotion', 200],
            ['hyperpotion', 300],
            ['food', 20],
            ['normal berry', 40],
            ['fire berry', 60],
            ['water berry', 60],
            ['grass berry', 60],
            ['electric berry', 60],
            ['ice berry', 60],
            ['poison berry', 60],
            ['psychic berry', 60],
            ['bug berry', 60],
            ['rock berry', 60],
            ['ghost berry', 60],
            ['dark berry', 60]
        ]);



        const itemName = item.name.toLowerCase();

        switch (itemName) {
            case 'potion':
            case 'superpotion':
            case 'hyperpotion':
            case 'food':
            case 'normal berry':
            case 'fire berry':
            case 'water berry':
            case 'grass berry':
            case 'electric berry':
            case 'ice berry':
            case 'poison berry':
            case 'psychic berry':
            case 'bug berry':
            case 'rock berry':
            case 'ghost berry':
            case 'dark berry':
                if (pokemon.currentHp !== 0 && item.quantity > 0 && pokemon.currentHp < pokemon.maxHp) {
                    const healAmount = healingItems.get(itemName);
                    const isBerry = itemName.includes('berry');
                    
                    if (isBerry && !this.isEffectiveBerry(pokemon, item)) {
                        console.log(`This berry is not effective for ${pokemon.name}'s type.`);
                        return;
                    }

                    const totalHealAmount = potionQuantity > 1 ? healAmount * potionQuantity : healAmount;
                    const actualHealAmount = Math.min(totalHealAmount, pokemon.maxHp - pokemon.currentHp);
                    const itemsUsed = Math.ceil(actualHealAmount / healAmount);

                    pokemon.currentHp += actualHealAmount;
                    item.quantity -= itemsUsed;

                    console.log(`${pokemon.name} healed by ${actualHealAmount} HP using ${itemsUsed} ${item.name}.`);
                    console.log(`Remaining ${item.name}: ${item.quantity}`);
                } else {
                    console.log("Can't heal fainted pokemon, out of items, or pokemon is at max HP");
                }
                break;

            case 'pokeball':
                console.log('No action for using a pokeball');
                break;

            case 'revive':
                if (pokemon.currentHp === 0 && item.quantity > 0) {
                    const healAmount = Math.floor(pokemon.maxHp / 2);
                    pokemon.currentHp = healAmount;
                    item.quantity -= 1;
                    console.log(`Revived ${pokemon.name} with ${healAmount} HP`);
                } else {
                    console.log('Can only revive fainted pokemon or out of revives');
                }
                break;

            case 'maxpp':
                if (item.quantity > 0) {
                    item.quantity -= 1;
                    pokemon.moves.forEach(move => {
                        move.currentPP = move.maxPP;
                    });
                    console.log('Restored all PP to max');
                } else {
                    console.log('No items left of Max PP');
                }
                break;

            case 'rarecandy':
                // this.setPokemonStats(pokemon, 1);
                pokemon.levelUp(1);
                item.quantity -= 1;
                console.log('Leveled up pokemon');
                break;

            case 'antidot':
                this.handleStatusCure(pokemon, item, 'Poison');
                break;

            case 'burnheal':
                this.handleStatusCure(pokemon, item, 'Burn');
                break;

            default:
                console.log(`Unknown item: ${item.name}`);
        }

        this.updatePokemonUI(pokemon);
    }

    isEffectiveBerry(pokemon, berry) {
        if (berry.name.toLowerCase() === 'normal berry') return true;
        const berryType = berry.name.replace(' Berry', '').toLowerCase();
        return pokemon.types.some(type => type.toLowerCase() === berryType);
    }

    handleStatusCure(pokemon, item, status) {
        if (pokemon.status === status && item.quantity > 0) {
            pokemon.status = 'none';
            item.quantity -= 1;
            console.log(`${pokemon.name} cured of ${status.toLowerCase()}`);
        } else {
            console.log(`${pokemon.name} not affected by ${status.toLowerCase()} or out of ${item.name}`);
        }
    }

        
    
    updatePokemonUI(pokemon) {
        // Update the UI to reflect changes in the Pokémon's stats
        // This might involve updating health bars, level displays, etc.
        console.log(`Updated UI for ${pokemon.name}`);
    }
    


    setPokemonStats(pokemon, level = 1) {
        // Create a copy of the pokemon object to avoid modifying the original
        //const updatedPokemon = { ...pokemon };
        const modifier = 10;
        pokemon.level+=level;
         // Calculate new stats based on the level
         pokemon.maxHp = pokemon.baseMaxHp + (modifier * (pokemon.level-1));
         pokemon.currentHp+=modifier*level;
         pokemon.attack = pokemon.baseAttack + (modifier * (pokemon.level-1));
         pokemon.defense = pokemon.baseDefense + (modifier * (pokemon.level-1));
         pokemon.speed = pokemon.baseSpeed + (modifier * (pokemon.level-1));
         // Add more stats as needed
     
    
        // Learn moves at specific levels
        this.learnMovesAtLevel(pokemon);
    
    
         // Set the level
         //pokemon.level = level;
        console.log(pokemon);
        return pokemon;
    }
        
    
        learnMovesAtLevel(pokemon) {
            const moves = globals.pokemonMoves[pokemon.name];
            if (moves && moves.length > 0) {
                if (pokemon.moves.length >= 4) {
                    moves.forEach(move => {
                        if (move.level === pokemon.level && !pokemon.moves.find(existingMove => existingMove.name === move.name)) {
                            // If the move's level requirement is met and it's not already known by the Pokémon, create the move menu
                            this.openMoveMenu(pokemon.moves, move);
                        }
                    });
                } else {
                    // If the Pokémon has less than 4 moves, directly learn all moves available at or below its level
                    moves.forEach(move => {
                        if (move.level === pokemon.level && !pokemon.moves.find(existingMove => existingMove.name === move.name)) {
                            pokemon.moves.push(move);
                            console.log(`Learned new move: ${move.name}`);
                        }
                    });
                }
            } else {
                console.log("No moves defined for this Pokemon.");
            }
        }
        
        openMoveMenu(currentMoves, newMove) {
            const moveMenuWidth = 200;
            const moveMenuHeight = 200;
            const moveMenuX = this.cameras.main.centerX - moveMenuWidth / 2;
            const moveMenuY = this.cameras.main.centerY - moveMenuHeight / 2;
        
            const moveMenu = this.add.container(moveMenuX, moveMenuY);
        
            const background = this.add.rectangle(0, 0, moveMenuWidth, moveMenuHeight, 0x000000, 0.8);
            background.setOrigin(0);
            moveMenu.add(background);
        
            const moveText = this.add.text(moveMenuWidth / 2, 20, 'Learned ' + newMove.name + ' select move to replace', { fontFamily: 'Arial', fontSize: '20px', fill: '#ffffff' });
            moveText.setOrigin(0.5);
            moveMenu.add(moveText);
        
            let optionY = 50;
            currentMoves.forEach(move => {
                const optionText = this.add.text(moveMenuWidth / 2, optionY, move.name + '(' + move.currentPP + '/' + move.maxPP + ')', { fontFamily: 'Arial', fontSize: '16px', fill: move.currentPP > 0 ? '#ffffff' : '#888888' });
                optionText.setOrigin(0.5);
                optionText.setInteractive(); // Enable interaction only if currentPP is greater than 0
                optionText.on('pointerdown', () => {
                    // Replace the move with the new move
                    this.replaceMove(currentMoves, move, newMove);
                    moveMenu.destroy();
                });
                moveMenu.add(optionText);
                optionY += 30;
            });
        
            return moveMenu;
        }
        
        replaceMove(currentMoves, oldMove, newMove) {
            const index = currentMoves.indexOf(oldMove);
            if (index !== -1) {
                currentMoves.splice(index, 1, newMove);
                console.log(`Replaced move: ${oldMove.name} with ${newMove.name}`);
            }
        }
        
        


}