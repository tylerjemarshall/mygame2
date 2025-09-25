class OldManScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OldManScene' });





        this.shopItems = [
            { name: 'Potion', price: 50, key: 'potion' },
            { name: 'Pokeball', price: 50, key: 'pokeball' },
            { name: 'Revive', price: 100, key: 'revive' },
            { name: 'Food', price: 20, key: 'food' },
            { name: 'Max PP', price: 10, key: 'maxpp' },
            { name: 'Antidot', price: 50, key: 'antidot' },
            { name: 'Burn Heal', price: 50, key: 'burnheal' },
            { name: 'Escape Rope', price: 50, key: 'escaperope' },
            { name: 'Repel', price: 200, key: 'repel' },
            { name: 'Rare Candy', price: 1000, key: 'rarecandy' },
            { name: 'Fishing Rod', price: 1000, key: 'fishingrod' },
            { name: 'Bicycle', price: 1000, key: 'bicycle' },
            { name: 'Super Potion', price: 200, key: 'superpotion' },
            { name: 'Hyper Potion', price: 500, key: 'hyperpotion' }
        ];

        this.shopButtons = [];
    }


    init(data) {
        // Check if data.superPotionAvailable is undefined and assign false if it is
        this.superPotionAvailable = data.superPotionAvailable !== undefined ? data.superPotionAvailable : false;
        this.hyperPotionAvailable = data.hyperPotionAvailable !== undefined ? data.hyperPotionAvailable : false;

    }
    


    preload() {
        // Preload assets here if needed
    }

    create() {




        
        // Background
        const background = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000);
        background.setOrigin(0);
        background.setAlpha(0.8);

        // Title
        const shopText = this.add.text(this.sys.game.config.width / 2, 50, 'Welcome to the Shop!', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
        shopText.setOrigin(0.5);

        this.nextYPosition = 100;
        // Access the passed parameter
        //const superPotionAvailable = data.superPotionAvailable;

        // Create the shop UI elements...

        // Check if super potion is available and create its buy button
        

        // Create the shop UI elements

        /////////////creating pages////////////////////

        // Initialize variables for paging
        this.currentPage = 1;
        this.itemsPerPage = 9; // Adjust as needed
        this.totalPages = Math.ceil(this.shopItems.length / this.itemsPerPage);

        // Display items for the current page
        this.displayItemsForPage(this.currentPage);

        // Create navigation buttons
        this.createNavigationButtons();







        ////////////////////////////////////////////////
    
    // Initialize Y position for the first button
    
        



        //backup//



    // // Create buy buttons for different items
    // this.createBuyButton('Buy Potion', 50, 'potion');
    // this.createBuyButton('Buy Pokeball', 50, 'pokeball');
    // this.createBuyButton('Buy Revive', 100, 'revive');
    // this.createBuyButton('Buy Food', 20, 'food');
    // this.createBuyButton('Buy Max PP', 10, 'maxpp');
    // this.createBuyButton('Buy Escape Rope', 50, 'escaperope');
    // this.createBuyButton('Buy Repel', 200, 'repel');
    // this.createBuyButton('Buy Rare Candy', 1000, 'rarecandy');
    // if (this.superPotionAvailable) {this.createBuyButton('Buy Super Potion', 200, 'superpotion');}

    //     // Create buy buttons for different items
    // if (this.hyperPotionAvailable && this.superPotionAvailable) {
    //     this.createBuyButton('Buy Hyper Potion', 500, 'hyperpotion');
    //     this.createBuyButton('Buy Super Potion', 200, 'superpotion');
    // } else if (this.superPotionAvailable) {
    //     this.createBuyButton('Buy Super Potion', 200, 'superpotion');
    // } else {
    //     this.createBuyButton('Buy Potion', 50, 'potion');
    // }
    // this.createBuyButton('Buy Pokeball', 50, 'pokeball');
    // this.createBuyButton('Buy Revive', 100, 'revive');
    // this.createBuyButton('Buy Food', 20, 'food');
    // this.createBuyButton('Buy Max PP', 10, 'maxpp');
    // this.createBuyButton('Buy Escape Rope', 50, 'escaperope');
    // this.createBuyButton('Buy Repel', 200, 'repel');
    // this.createBuyButton('Buy Rare Candy', 1000, 'rarecandy');
    // this.createBuyButton('Buy Fishing Rod', 1000, 'fishingrod');
    // this.createBuyButton('Buy Bicycle', 1000, 'bicycle');
    // if (this.hyperPotionAvailable && !this.superPotionAvailable) {
    //     this.createBuyButton('Buy Hyper Potion', 500, 'hyperpotion');
    // }



    // end backup //
    //////////////////////////////adding pages//////////////






    ////////////////////////////////////////////////////////



    // Close Button
    const closeButton = this.add.text(this.sys.game.config.width - 30, 30, 'X', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
    closeButton.setOrigin(0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
        // Close the shop scene when the close button is clicked
        globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);
        // this.scene.start('MapScene');
        globals.sceneManager.transitionTo('MapScene');
    });

    // Money Display
    this.moneyDisplay = this.add.text(this.sys.game.config.width - 20, this.sys.game.config.height - 20, `Money: ${globals.characterPosition.money}`, { fontFamily: 'Arial', fontSize: '20px', fill: '#ffffff' });
    this.moneyDisplay.setOrigin(1, 1);



        // // Create the shop UI elements
        
        // // Background
        // const background = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000);
        // background.setOrigin(0);
        // background.setAlpha(0.8);

        // // Title
        // const shopText = this.add.text(this.sys.game.config.width / 2, 50, 'Welcome to the Shop!', { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
        // shopText.setOrigin(0.5);

        // // Buy Potion Button
        // const buyPotionButton = this.add.text(this.sys.game.config.width / 2, 150, 'Buy Potion - 50$', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        // buyPotionButton.setOrigin(0.5);
        // buyPotionButton.setInteractive();
        // buyPotionButton.on('pointerdown', () => {
            
        //     if(globals.characterPosition.money >=50){
            
        //         // Handle buying potion
        //         console.log('Buying potion');
        //         globals.characterPosition.money-=50;
        //         moneyDisplay.setText(`Money: ${globals.characterPosition.money}`);

        //         // Handle buying potion
        //         const potionItem = globals.items.find(item => item.name === 'potion');
        //         if (potionItem) {
        //             potionItem.quantity += 1; // Increment the quantity of potion by 1
        //         } else {
        //             // Handle the case where potion item is not found
        //             console.log('Potion item not found.');
        //         }
        //     }
        //     else
        //     {
        //         console.log('insufficient funds');
        //     }

        // });

        // // Buy Pokeball Button
        // const buyPokeballButton = this.add.text(this.sys.game.config.width / 2, 200, 'Buy Pokeball - 50$', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        // buyPokeballButton.setOrigin(0.5);
        // buyPokeballButton.setInteractive();
        // buyPokeballButton.on('pointerdown', () => {
        //     // Handle buying pokeball

        //     if(globals.characterPosition.money >=50){
        //         console.log('Buying pokeball');
        //         globals.characterPosition.money-=50;
        //         moneyDisplay.setText(`Money: ${globals.characterPosition.money}`);
                
        //         // Handle buying pokeball
        //         const pokeballItem = globals.items.find(item => item.name === 'pokeball');
        //         if (pokeballItem) {
        //             pokeballItem.quantity += 1; // Increment the quantity of pokeball by 1
        //         } else {
        //             // Handle the case where pokeball item is not found
        //             console.log('Pokeball item not found.');
        //         }
        //     }
        //     else
        //     {
        //         console.log('insufficient funds');
        //     }
        // });


        // // Buy Revive Button
        // const buyReviveButton = this.add.text(this.sys.game.config.width / 2, 250, 'Buy Revive - 100$', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        // buyReviveButton.setOrigin(0.5);
        // buyReviveButton.setInteractive();
        // buyReviveButton.on('pointerdown', () => {
        //     // Handle buying pokeball

        //     if(globals.characterPosition.money >=100){
        //         console.log('Buying revive');
        //         globals.characterPosition.money-=100;
        //         moneyDisplay.setText(`Money: ${globals.characterPosition.money}`);
                
        //         // Handle buying pokeball
        //         const reviveItem = globals.items.find(item => item.name === 'revive');
        //         if (reviveItem) {
        //             reviveItem.quantity += 1; // Increment the quantity of pokeball by 1
        //         } else {
        //             // Handle the case where pokeball item is not found
        //             console.log('Pokeball item not found.');
        //         }
        //     }
        //     else
        //     {
        //         console.log('insufficient funds');
        //     }


            

        // });



        // // Buy Pokeball Button
        // const buyFoodButton = this.add.text(this.sys.game.config.width / 2, 300, 'Buy Food - 20$', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        // buyFoodButton.setOrigin(0.5);
        // buyFoodButton.setInteractive();
        // buyFoodButton.on('pointerdown', () => {
        //     // Handle buying pokeball

        //     if(globals.characterPosition.money >=20){
        //         console.log('Buying food');
        //         globals.characterPosition.money-=20;
        //         moneyDisplay.setText(`Money: ${globals.characterPosition.money}`);
                
        //         // Handle buying pokeball
        //         const foodItem = globals.items.find(item => item.name === 'food');
        //         if (foodItem) {
        //             foodItem.quantity += 1; // Increment the quantity of food by 1
        //         } else {
        //             // Handle the case where food item is not found
        //             console.log('Food item not found.');
        //         }
        //     }
        //     else
        //     {
        //         console.log('insufficient funds');
        //     }
        // });



        // // Close Button
        // const closeButton = this.add.text(this.sys.game.config.width - 30, 30, 'X', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        // closeButton.setOrigin(0.5);
        // closeButton.setInteractive();
        // closeButton.on('pointerdown', () => {
        //     // Close the shop scene when the close button is clicked
        //     this.scene.get('MapScene').setKeyboardEnabled(true);
        //     this.scene.start('MapScene');
        // });

        // // Money Display
        // const moneyDisplay = this.add.text(this.sys.game.config.width - 20, this.sys.game.config.height - 20, `Money: ${globals.characterPosition.money}`, { fontFamily: 'Arial', fontSize: '20px', fill: '#ffffff' });
        // moneyDisplay.setOrigin(1, 1);

    }

    /////////////////////////////////////


    displayItemsForPage(pageNumber) {
        // Calculate the start and end indices for the items to be displayed on the current page
        const startIndex = (pageNumber - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.shopItems.length);
        
        this.nextYPosition = 100;


        // Display items based on the current page
        for (let i = startIndex; i < endIndex; i++) {
            const item = this.shopItems[i];
            // const yOffset = (i - startIndex) * 50; // Adjust as needed
            this.createBuyButton(`Buy ${item.name}`, item.price, item.key);
        }
    }
    
    createNavigationButtons() {
        // Previous page button
        const prevButton = this.add.text(50, this.sys.game.config.height / 2, '< Prev', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        prevButton.setOrigin(0.5);
        prevButton.setInteractive();
        prevButton.on('pointerdown', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.clearShopButtons();
                this.displayItemsForPage(this.currentPage);
            }
        });
    
        // Next page button
        const nextButton = this.add.text(this.sys.game.config.width - 50, this.sys.game.config.height / 2, 'Next >', { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        nextButton.setOrigin(0.5);
        nextButton.setInteractive();
        nextButton.on('pointerdown', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.clearShopButtons();
                this.displayItemsForPage(this.currentPage);
            }
        });
    }

    clearShopButtons() {
        // Loop through each button in the shopButtons array
        this.shopButtons.forEach(button => {
            // Destroy the button
            button.destroy();
        });
    
        // Clear the shopButtons array
        this.shopButtons = [];
    }










    ////////////////////////////////

    createBuyButton(text, cost, itemName) {
        const button = this.add.text(this.sys.game.config.width / 2, this.nextYPosition, `${text} - ${cost}$`, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
        button.setOrigin(0.5);
        button.setInteractive();
        button.on('pointerdown', () => {
            // Handle buying item
            if (globals.characterPosition.money >= cost) {
                console.log(`Buying ${itemName}`);
                
                // Find the item in the global items array
                // const item = globals.items.find(item => item.key === itemName);
                const item = globals.itemManager.getItem(itemName);
    
                // Check if the item already exists and its quantity
                if ((itemName === 'fishingrod' || itemName === 'bicycle') && item && item.quantity > 0) {
                    console.log(`You already have a ${itemName}`);
                } else {
                    globals.characterPosition.money -= cost;
                    this.moneyDisplay.setText(`Money: ${globals.characterPosition.money}`);
    
                    // Increment the quantity of the item by 1 or add it if it doesn't exist
                    // if (item) {
                    //     item.quantity += 1;
                    // } else {
                    //     globals.items.push({ name: itemName, quantity: 1 });
                    // }
                    globals.itemManager.add(itemName);
                }
            } else {
                console.log('Insufficient funds');
            }
        });
        this.shopButtons.push(button);
        this.nextYPosition += 35; // Increment Y position for the next button
    }
}

//     createBuyButton(text, cost, itemName) {
//         const button = this.add.text(this.sys.game.config.width / 2, this.nextYPosition, `${text} - ${cost}$`, { fontFamily: 'Arial', fontSize: '24px', fill: '#ffffff' });
//         button.setOrigin(0.5);
//         button.setInteractive();
//         button.on('pointerdown', () => {
//             // Handle buying item
//             if (globals.characterPosition.money >= cost) {
//                 console.log(`Buying ${itemName}`);
//                 globals.characterPosition.money -= cost;
//                 this.moneyDisplay.setText(`Money: ${globals.characterPosition.money}`);
                
//                 // Find the item in the global items array
//                 const item = globals.items.find(item => item.name === itemName);
//                 if (item) {

//                     if (item.name==='bicycle' && item.quantity > 1)
//                     {
//                         console.log('you already have a bicycle')
//                         globals.characterPosition.money += cost; //refund
//                     } else if (item.name==='fishingrod' && item.quantity > 1)
//                     {
//                         console.log('you already have a fishing rod')
//                         globals.characterPosition.money += cost; //refund
//                     }


//                     item.quantity += 1; // Increment the quantity of the item by 1
//                 } else {
//                     // Handle the case where the item is not found
//                     console.log(`${itemName} not found.`);
//                 }
//             } else {
//                 console.log('Insufficient funds');
//             }
//         });
//         this.nextYPosition += 40; // Increment Y position for the next button
//     }
// }
