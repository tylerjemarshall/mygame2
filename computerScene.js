class ComputerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ComputerScene' });
        this.pcContainer = null;
        this.partyContainer = null;
        this.titleText = null;
    }

 
    preload()
    {

        // Load sprite sheets for each Pokémon
        globals.pokemonData.forEach(pokemon => {
            this.load.spritesheet(pokemon.key, `images/NinjaAdventure/Actor/Monsters/${pokemon.key}/SpriteSheet.png`, { frameWidth: 16, frameHeight: 16 });
        });

    }

    create() {
 
        this.displayUI();
        this.displayMenu();




        // Display the list of Pokémon from globals.pc
        //this.pcContainer = this.displayPCPokemonList(globals.pc);
    }

    // displayMenu() {

    //     this.titleText.text='Select Pokemon in PC';
    //     // Display the initial menu
    //     this.menuText = this.add.text(this.sys.game.config.width / 2, 150, 'Choose an option:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
    //     this.menuText.setOrigin(0.5);

    //     // Withdraw option
    //     this.withdrawText = this.add.text(this.sys.game.config.width / 2, 200, 'Withdraw', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
    //     this.withdrawText.setOrigin(0.5);
    //     this.withdrawText.setInteractive();
    //     this.withdrawText.on('pointerdown', () => {
    //         this.titleText.text = 'Select Pokemon to withdraw';
    //         this.pcContainer = this.displayPCPokemonList(globals.pc); //globals.originalPokemonData globals.pc
    //         this.clearMenu();
    //     });

    //     // Deposit option
    //     this.depositText = this.add.text(this.sys.game.config.width / 2, 250, 'Deposit', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
    //     this.depositText.setOrigin(0.5);
    //     this.depositText.setInteractive();
    //     this.depositText.on('pointerdown', () => {
    //         this.titleText.text = 'Select Pokemon to deposit';
    //         this.partyContainer = this.displayPokemonDataList(globals.partyPokemonData);
    //         this.clearMenu();
    //     });
    // }




    displayMenu() {

        this.titleText.text='Select Pokemon in PC';
        // Display the initial menu
        this.menuText = this.add.text(this.sys.game.config.width / 2, 150, 'Choose an option:', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        this.menuText.setOrigin(0.5);

        // Withdraw option
        this.withdrawText = this.add.text(this.sys.game.config.width / 2, 200, 'Withdraw', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        this.withdrawText.setOrigin(0.5);
        this.withdrawText.setInteractive();
        this.withdrawText.on('pointerdown', () => {
            // this.titleText.text = 'Select Pokemon to withdraw';
            // this.pcContainer = this.displayPCPokemonList(globals.pc); //globals.originalPokemonData globals.pc
            // this.clearMenu();
            this.openPartyScene('withdraw')


        });

        // Deposit option
        this.depositText = this.add.text(this.sys.game.config.width / 2, 250, 'Deposit', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        this.depositText.setOrigin(0.5);
        this.depositText.setInteractive();
        this.depositText.on('pointerdown', () => {
            // this.titleText.text = 'Select Pokemon to deposit';
            // this.partyContainer = this.displayPokemonDataList(globals.partyPokemonData);
            // this.clearMenu();
            this.openPartyScene('deposit')


        });
    }



    openPartyScene(action) {
        // this.scene.launch('PartyScene', { 
        //     originScene: 'ComputerScene', 
        //     action: action,
        //     // currentPokemonData: null // or pass the current Pokémon if needed
        // });
        // this.scene.pause();
        globals.sceneManager.transitionTo('PartyScene', {action: action, originScene: 'ComputerScene'}, true);
    }
    
    clearMenu() {
        // Remove the initial menu
        this.menuText.destroy();
        this.withdrawText.destroy();
        this.depositText.destroy();
        // if (this.partyContainer) {
        //     this.partyContainer.removeAll(true);
        //     this.partyContainer = null;
        // }
    }
    


    displayPCPokemonList(pokemonList, currentPage = 1, columnsPerPage = 2) {
        if (this.partyContainer) {
            this.partyContainer.removeAll(true);
            this.partyContainer = null;
        }
    
        const pcContainer = this.add.container();
    
        const textConfig = { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' };
        const textConfig2 = { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' };
        const offsetX = 80;
        const offsetY = 100;
        const pokemonPerColumn = 7;
        const rowHeight = 50;
        const colWidth = 250;
    
        const startIndex = (currentPage - 1) * columnsPerPage * pokemonPerColumn;
        const endIndex = Math.min(startIndex + columnsPerPage * pokemonPerColumn, pokemonList.length);
    
        for (let i = startIndex; i < endIndex; i++) {
            const pokemon = pokemonList[i];
            const indexWithinPage = i - startIndex;
            const row = indexWithinPage % pokemonPerColumn;
            const col = Math.floor(indexWithinPage / pokemonPerColumn);
            const posX = offsetX + col * colWidth;
            const posY = offsetY + row * rowHeight;
    
            // Health bar
            const healthBarWidth = 150 * (pokemon.currentHp / pokemon.maxHp);
            const healthBar = this.add.rectangle(posX, posY, healthBarWidth, 25, 0x00ff00);
            healthBar.setOrigin(0);
    
            // Missing health bar
            const missingHpWidth = 150 - healthBarWidth;
            const missingHpBar = this.add.rectangle(posX + healthBarWidth, posY, missingHpWidth, 25, 0xff0000);
            missingHpBar.setOrigin(0);
    
            const pokemonText = `${pokemon.name} [Lv.${pokemon.level}]`;
            const pokemonOption = this.add.text(posX, posY, pokemonText, textConfig);
            pokemonOption.setInteractive();
            pokemonOption.on('pointerdown', () => {
                console.log(`Selected ${pokemon.name}`);
                this.selectedPokemon = pokemon;
                //this.titleText.text = 'Pick Pokemon to withdraw';
                this.withdrawPokemon(pokemon);
                if (this.pcContainer) {
                    this.pcContainer.removeAll(true);
                    this.pcContainer = null;
                }
                if (this.partyContainer) {
                    this.partyContainer.removeAll(true);
                    this.partyContainer = null;
                }
                this.displayMenu();
                //this.partyContainer = this.displayPokemonDataList(globals.partyPokemonData);
            });
    
            // Pokémon sprite
            const pokemonSprite = this.add.sprite(posX + 25 - 50, posY + 15, pokemon.key); // Adjusted position for alignment
            pokemonSprite.setScale(2); // Adjust scale as needed
    
            pcContainer.add([healthBar, missingHpBar, pokemonOption, pokemonSprite]);
        }
        //console.log('creating next page and previous page buttons');
        // Add buttons to change page
        const nextPageButton = this.add.text(480, 450, '-->', textConfig2).setInteractive();
        nextPageButton.on('pointerdown', () => {
            const nextPage = currentPage + 1;
            if (nextPage <= Math.ceil(pokemonList.length / (columnsPerPage * pokemonPerColumn))) {
                if (this.pcContainer) {
                    this.pcContainer.removeAll(true);
                    this.pcContainer = null;
                }
                this.partyContainer = this.displayPCPokemonList(pokemonList, nextPage, columnsPerPage);
                this.clearMenu();
            }
        });

        const prevPageButton = this.add.text(50, 450, '<--', textConfig2).setInteractive();
        prevPageButton.on('pointerdown', () => {
            const prevPage = currentPage - 1;
            if (prevPage >= 1) {
                if (this.pcContainer) {
                    this.pcContainer.removeAll(true);
                    this.pcContainer = null;
                }
                this.partyContainer = this.displayPCPokemonList(pokemonList, prevPage, columnsPerPage);
                this.clearMenu();
            }
        });

        pcContainer.add([nextPageButton, prevPageButton]);


        return pcContainer;
    }
    




    // displayPCPokemonList(pokemonList) {
    //     if (this.partyContainer) {
    //         this.partyContainer.removeAll(true);
    //         this.partyContainer = null;
    //     }
    
    //     const pcContainer = this.add.container();
    
    //     const textConfig = { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' };
    //     const offsetX = 80;
    //     const offsetY = 100;
    //     const pokemonPerColumn = 7;
    //     const rowHeight = 50;
    //     const colWidth = 250;
    
    //     for (let i = 0; i < pokemonList.length; i++) {
    //         const pokemon = pokemonList[i];
    //         const row = i % pokemonPerColumn;
    //         const col = Math.floor(i / pokemonPerColumn);
    //         const posX = offsetX + col * colWidth;
    //         const posY = offsetY + row * rowHeight;
    


    //          // Health bar
    //          const healthBarWidth = 150 * (pokemon.currentHp / pokemon.maxHp);
    //          const healthBar = this.add.rectangle(posX, posY, healthBarWidth, 25, 0x00ff00);
    //          healthBar.setOrigin(0);
             
    //          // Missing health bar
    //          const missingHpWidth = 150 - healthBarWidth;
    //          const missingHpBar = this.add.rectangle(posX + healthBarWidth, posY, missingHpWidth, 25, 0xff0000);
    //          missingHpBar.setOrigin(0);

    //         const pokemonText = `${pokemon.name} [Lv.${pokemon.level}]`;
    //         const pokemonOption = this.add.text(posX, posY, pokemonText, textConfig);
    //         pokemonOption.setInteractive();
    //         pokemonOption.on('pointerdown', () => {
    //             console.log(`Selected ${pokemon.name}`);
    //             this.selectedPokemon = pokemon;
    //             //this.titleText.text = 'Pick Pokemon to withdraw';
    //             this.withdrawPokemon(pokemon);
    //             if (this.pcContainer) {
    //                 this.pcContainer.removeAll(true);
    //                 this.pcContainer = null;
    //             }
    //             this.displayMenu();
    //             //this.partyContainer = this.displayPokemonDataList(globals.partyPokemonData);
    //         });
    
           
    
    //         // Pokémon sprite
    //         const pokemonSprite = this.add.sprite(posX + 25 - 50, posY + 15, pokemon.key); // Adjusted position for alignment
    //         pokemonSprite.setScale(2); // Adjust scale as needed
            
    //         pcContainer.add([healthBar, missingHpBar, pokemonOption, pokemonSprite]);
    //     }
    
    //     return pcContainer;
    // }
    
    displayPokemonDataList(pokemonDataList) {
        if (this.pcContainer) {
            this.pcContainer.removeAll(true);
            this.pcContainer = null;
        }
    
        const partyContainer = this.add.container();
    
        const textConfig = { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' };
        const offsetX = 80;
        const offsetY = 100;
        const pokemonPerColumn = 7;
        const rowHeight = 50;
        const colWidth = 250;
    
        for (let i = 0; i < pokemonDataList.length; i++) {
            const pokemon = pokemonDataList[i];
            const row = i % pokemonPerColumn;
            const col = Math.floor(i / pokemonPerColumn);
            const posX = offsetX + col * colWidth;
            const posY = offsetY + row * rowHeight;
    


             // Health bar
             const healthBarWidth = 150 * (pokemon.currentHp / pokemon.maxHp);
             const healthBar = this.add.rectangle(posX, posY, healthBarWidth, 25, 0x00ff00);
             healthBar.setOrigin(0);
             
             // Missing health bar
             const missingHpWidth = 150 - healthBarWidth;
             const missingHpBar = this.add.rectangle(posX + healthBarWidth, posY, missingHpWidth, 25, 0xff0000);
             missingHpBar.setOrigin(0);


            const pokemonText = `${pokemon.name} [Lv.${pokemon.level}]`;
            const pokemonOption = this.add.text(posX, posY, pokemonText, textConfig);
            pokemonOption.setInteractive();
            pokemonOption.on('pointerdown', () => {
                //console.log(`Swapping ${this.selectedPokemon.name} with ${pokemon.name}`);
                this.depositPokemon(pokemon);
                //this.titleText.text = 'Select Pokemon to deposit';
                //this.pcContainer = this.displayPCPokemonList(globals.pc);
                if (this.partyContainer) {
                    this.partyContainer.removeAll(true);
                    this.partyContainer = null;
                }
                this.displayMenu();
            });
    
           
    
            // Pokémon sprite
            const pokemonSprite = this.add.sprite(posX + 25 - 50, posY + 15, pokemon.key); // Adjusted position for alignment
            pokemonSprite.setScale(2); // Adjust scale as needed
            
            partyContainer.add([healthBar, missingHpBar, pokemonOption, pokemonSprite]);
        }
    
        return partyContainer;
    }
    
    depositPokemon(pokemon)
    {

        if(globals.partyPokemonData.length > 1)
        {
            globals.pc.push(pokemon);
            globals.partyPokemonData.splice(globals.partyPokemonData.indexOf(pokemon), 1);
        }
        else
        {
            console.log('You must have a minimum of 1 pokemon');
        }
        


    }

    withdrawPokemon(pokemon)
    {
        if(globals.partyPokemonData.length < 6)
        {
            globals.partyPokemonData.push(pokemon);
            globals.pc.splice(globals.pc.indexOf(pokemon), 1);

        }
        else
        {
            console.log('Party is full cannot withdraw');
        }
        
    }

    swapPokemon(pokemon1, pokemon2) {
        // Find the index of pokemon1 in globals.pc
        const index = globals.pc.indexOf(pokemon1);
        if (index !== -1) {
            // Replace pokemon1 with pokemon2 in globals.pc
            globals.pc[index] = pokemon2;
            // Add pokemon1 to globals.PokemonData
            globals.partyPokemonData.push(pokemon1);
            // Remove pokemon2 from globals.PokemonData
            globals.partyPokemonData.splice(globals.partyPokemonData.indexOf(pokemon2), 1);
        }
    }
    // swapPokemon(pokemon1, pokemon2) {
    //     // Find the index of pokemon1 in globals.pc
    //     const index = globals.pc.indexOf(pokemon1);
    //     if (index !== -1) {
    //         // Perform deep copy of pokemon2
    //         const copiedPokemon2 = JSON.parse(JSON.stringify(pokemon2));
    
    //         // Replace pokemon1 with copiedPokemon2 in globals.pc
    //         globals.pc[index] = copiedPokemon2;
    
    //         // Add pokemon1 to globals.PokemonData (also perform deep copy)
    //         const copiedPokemon1 = JSON.parse(JSON.stringify(pokemon1));
    //         globals.pokemonData.push(copiedPokemon1);
    
    //         // Remove pokemon2 from globals.PokemonData
    //         globals.pokemonData.splice(globals.pokemonData.indexOf(pokemon2), 1);
    //     }
    // }
    

  
    
    displayUI()
    {
        // Background
        const background = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000);
        background.setOrigin(0);
        background.setAlpha(0.8);


               // Title
        this.titleText = this.add.text(this.sys.game.config.width / 2, 50, 'Select Pokemon in PC', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
        this.titleText.setOrigin(0.5);

        // Back Button
        const backButton = this.add.text(20, 20, 'Back', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        backButton.setOrigin(0);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            console.log('Back button clicked');
            //  this.pcContainer = null;
       // this.partyContainer = null;
            if (this.pcContainer || this.partyContainer)
            {
                if (this.pcContainer) {
                    this.pcContainer.removeAll(true);
                    this.pcContainer = null;
                }
                if (this.partyContainer) {
                    this.partyContainer.removeAll(true);
                    this.partyContainer = null;
                }
                this.displayMenu();
            }
            else
            {
                // this.scene.get('MapScene').setKeyboardEnabled(true);
                // this.scene.start('MapScene');
                
                this.exit();
            }


            
        });
    }


    exit()
    {
        globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);

        globals.sceneManager.transitionTo('MapScene');
    }

    // clearPokemonList(container) {
    //     // Destroy all displayed Pokémon options and related game objects in the given container
    //     if (container) {
    //         console.log('removing container')
    //         container.removeAll(true); // Removes all children from the container and destroys them
    //         container=null;
    //     }
    //     else{
    //         console.log('no container found');
    //     }
    // }
   
}
