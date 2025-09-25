class ItemsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ItemsScene' });
        this.escapeKeyListener = null; // Declare the listener variable

    }


    preload()
    {



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


        this.scene.bringToTop('ItemsScene');
        this.originScene = data.originScene;
        this.currentPokemonIndex = data.currentBattlePokemonIndex;
        this.pokemonData = globals.partyPokemonData;
        this.selectedPokemonIndex = null; // Add this line to track the first selected Pokémon
        this.action = data.action; // 'useInBattle' or undefined for normal use
        this.selectedPokemon = data.pokemon;
        this.from = data.from;

        this.createItemWindow();
        this.events.on('updateItemList', this.updateItemList, this);



      }
      updateItemList() {
       
        console.log(this.containerWidth);
        if (this.itemListContainer) {
            this.itemListContainer.removeAll(true);
            this.itemListContainer.clearMask();
            this.itemListContainer = null;
        }
        this.slider.slider.destroy();
        this.slider.sliderBg.destroy();
        this.slider.slider=null;
        this.slider.sliderBg=null;
        

        if (this.mask) {
            this.mask.destroy();
            this.mask = null;
        }
        if (this.maskShape) {
            this.maskShape.destroy();
            this.maskShape = null;
        }

    
        // Recreate the item list with updated quantities
        this.displayItemList(400);
    }

      createItemWindow() {
        // Add background image to fill the entire scene
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        background.setDepth(2);
        
    
        const containerWidth = 500;
        const containerHeight = 300;
        this.itemWindowContainer = this.add.container(this.cameras.main.width / 2 - containerWidth / 2, this.cameras.main.height / 3 - containerHeight / 2);
    
        // Add item list
        this.displayItemList(containerWidth);
    
        // Add close button
        // const closeButton = this.createButton(this.cameras.main.width - 50, 50, 40, 40, 'X', () => this.closeItemWindow());
        const closeButton = new Button(this,this.cameras.main.width - 50,50,40,40,'X',() => this.closeItemWindow(),'12px', '#000');
        
        
        closeButton.setDepth(3);


        this.itemWindowContainer.setDepth(10);
        // document.addEventListener('keydown', this.escapeKeyListener);


    }
    

    

  

    displayItemList(containerWidth) {
     
        this.itemHeight = 100;
        // let itemList = globals.items.filter(item => item.quantity > 0);
        let itemList = globals.itemManager.getItems();
        console.log('item list', itemList);

       if (this.action === 'orbs')
       {
        itemList = itemList.filter(item =>  item.key.includes('orb'));
       }
       else if (this.action === 'berries')
       {
        itemList = itemList.filter(item =>  item.key.includes('berry'));
       } else if (this.originScene === 'InteractWithPokemonScene') 
        {
            itemList = itemList.filter(item =>  item.key.includes('berry'));
        }
       
        const containerHeight = 350;
        const containerX = 40;
        const containerY = 70;
        this.itemListContainer = this.add.container(containerX, containerY);
        this.itemListContainer.setSize(containerWidth, containerHeight);
        // this.itemListContainer.initialY = containerY;
        this.itemListContainer.setDepth(3);
    
        // Create all item buttons
        const itemButtons = itemList.map((item, index) => this.createItemButton(item, index, containerWidth));
    
        // Add all item buttons to the container
        this.itemListContainer.add(itemButtons);
        this.itemListContainer.itemHeight=this.itemHeight;

        this.slider = new Slider(this, this.itemListContainer);
    

        // Create description area
        this.descriptionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Desciption', { fontSize: '18px', fill: '#ffffff' });
        this.descriptionText.setOrigin(0.5);
        this.descriptionText.setDepth(3);

    }
    


    
    createItemButton(item, index, containerWidth) {
        const button = this.add.container(10, index * this.itemHeight);
    
        // Add panel behind everything
        const panel = this.add.image(0, 0, 'panel');
        panel.setDisplaySize(containerWidth - 20, this.itemHeight);
        panel.setOrigin(0, 0);
        button.add(panel);
    
        // Add item name and quantity
        const text = this.add.text(10, 15, `${ item.name} (x${item.quantity})`, { fill: '#ffffff', fontSize: '30px' });
        button.add(text);
    
        // Add Use button
        const useButton = new Button(this, containerWidth - 170, 45, 60, 90, 'Use', () => globals.itemManager.useItem(this, item, this.selectedPokemon, null), '30px'); //this.useItem(item)
        button.add(useButton);
    

        
        const descriptionButton = new Button(this, containerWidth - 70, 45, 100, 90, '(i)', ( () => {
            this.descriptionText.setText(item.description);
        }), '30px');
        button.add(descriptionButton);

    
        button.setSize(containerWidth - 20, this.itemHeight);
        return button;  // Return the entire container
    }
    
    closeItemWindow() {
        console.log(globals.gameInstance.scene.getScene('MainMenu'))    ;
        console.log('transitioning to: ', this.originScene );
        this.sceneManager.transitionTo(this.originScene, { originScene: this.originScene, from: this.from});

      
    }
    useItem(item, quantity = 1) {
       
    
        if (this.originScene === 'MenuScene') {
            if ( item.key === 'bicycle' ||  item.key === 'fishingrod' ||  item.key === 'eye' ||  item.key.includes('orb')) {
                console.log('selected: ',  item.key, item.description);
                this.descriptionText.setText(item.description);
            } else if ( item.key === 'repel' ||  item.key === 'escaperope') {
                this.useNonPartyItem(item);
            } else if ( item.key === 'pokeball') {
                
                this.descriptionText.setText('Can\'t use Pokeball outside of battle');
            } else {
               
                this.launchPartyScene(item);
            }
        } else if (this.originScene === 'BattleScene') {
            if ( item.key === 'repel' ||  item.key === 'escaperope') {
                
                this.descriptionText.setText('Can\'t use that here');
            } else if ( item.key === 'pokeball') {
                
                item.quantity-=1;
                this.closeItemWindow();
                // globals.controlGameInstance.start('BattleButtonScene');
                globals.controlGameInstance.scene.getScene('BattleButtonScene').createTargetButtons(null, 'item', 'pokeball');
                // globals.gameInstance.scene.getScene('BattleScene').pokeball();


          
            } else {
                this.launchPartyScene(item);
            }
        } else if (this.originScene === 'InteractWithPokemonScene') {
            this.scene.stop();
            this.scene.resume('InteractWithPokemonScene');
            this.scene.get('InteractWithPokemonScene').useBerry(item);
        }
        else {
          
            this.launchPartyScene(item);
        }
    }
    
    launchPartyScene(item) {
        
        globals.sceneManager.transitionTo('PartyScene', {originScene: 'ItemsScene', selectedItem: item, action: this.action, from: this.from}, true);
    }
    
    

    useNonPartyItem(item) {
        if ( item.key === 'repel') {
            globals.repel.active = true;
            globals.repel.count = 30;
            item.quantity -= 1;
          
            this.scene.stop();
            this.scene.get('MenuScene').closeMainMenu();
        } else if ( item.key === 'escaperope') {
            console.log('spawn is ' + globals.characterPosition.spawn);
            if (globals.characterPosition.spawn === 'home') {
                this.scene.get('MapScene').setCharacterPosition(65, 45);
            } else if (globals.characterPosition.spawn === 'shop') {
                this.scene.get('MapScene').setCharacterPosition(150, 117);
            }
            item.quantity -= 1;
      
            this.scene.stop();
            this.scene.get('MenuScene').closeMainMenu();
        }
    }

    




}