class ItemManager {
    constructor() {
        this.items = []; // Array to hold items
       
        // this.initializeItems();
    }

  

initializeItems() {
    for (const itemInfo of globals.itemData) {
        this.items.push(new Item(itemInfo.key)); // This will use the quantity from itemData
    }
    // console.log('items: ' + this.items);
}

getItems() {
    return this.items.filter(item => item.quantity > 0);
}

// Add or update item quantity
add(itemKey, quantity = 1) {
    const existingItem = this.items.find(item => item.key === itemKey);

    if (!existingItem) {
        // Add new item if it doesn't already exist
        this.items.push(new Item(itemKey, quantity));
        console.log('added new item: ', this.getItem(itemKey))
        this.items.sort((a, b) => a.name.localeCompare(b.name));

    } else {
        // Increment quantity if item exists
        existingItem.quantity += quantity;
        console.log('now have ' + existingItem.quantity + ' ' + existingItem.name)
    }
}

// Load items from save data and overwrite quantities
loadFromSave(saveData) {
    // Reset quantities based on save data
    this.items.forEach(item => {
        const savedItem = saveData.find(saved => saved.key === item.key);
        item.quantity = savedItem ? savedItem.quantity : 0;
    });
}

getItem(itemKey) {
    return this.items.find(item => item.key === itemKey) || null; // Update to search the array
}

toSerializableObject() {
    return this.items
        .filter(item => item.quantity > 0)  // Only save items with quantity > 0
        .map(item => item.toSerializableObject());
}





// Update the fromSerializableObject method
static fromSerializableObject(data) {
    const manager = new ItemManager();
    
    manager.items = data.map(itemData => Item.fromSerializableObject(itemData));
        return manager;
    

}





    async useItem(scene, item, target = null, user = null) {
        console.log('using item: ', item.name)
        console.log('target: ', target, 'user: ', user);
        if (!item || item.quantity <= 0) {
            console.error(`Item '${item.key}' not found in inventory or out of stock.`);
            return false;
        }

       

        const currentScene = scene.scene.key;
        console.log('current scene: ', currentScene);
        switch (currentScene) {
            case 'ItemsScene':
                return await this.handleItemsScene(scene, item, user);
            case 'PartyScene':
                return await this.handlePartyScene(scene, item, target);
            case 'BattleButtonScene':
                return this.handleBattleButtonScene(scene, item, target, user);
            case 'BattleScene':
                return await this.handleBattleScene(scene, item,  target, user);
            // case 'InteractWithPokemonScene':
            //     return this.handleInteractScene(scene, item, itemData, target);
            default:
                // return this.handleDefaultScene(scene, item, itemData);
        }
    }


    async handleItemsScene(scene, item, user = null) {
        const originScene = scene.originScene;
        const battleScene = globals.gameInstance.scene.getScene('BattleScene');
        if (originScene === 'MenuScene') {
            if (item.key === 'bicycle' || item.key === 'fishingrod' || item.key === 'eye' || item.key.includes('orb')) {
                scene.descriptionText.setText(item.description);
                return true;
            } else if (item.key === 'repel' || item.key === 'escaperope') {
                return this.useFieldItem(scene, item);
            } else if (item.key === 'pokeball') {
                scene.descriptionText.setText("Can't use Pokeball outside of battle");
                return false;
            } else {
                console.log('launching party scene with item: ', item.name);
                this.launchPartyScene(scene, item);
                return true;
            }
        } else if (originScene === 'BattleScene') {
            if (item.key === 'repel' || item.key === 'escaperope') {
                scene.descriptionText.setText("Can't use that here");
                return false;
            } else if (item.key === 'pokeball') {
                item.quantity--;


                // scene.closeItemWindow();
                //globals.sceneManager.start('BattleButtonsScene');
                globals.sceneManager.stop('ItemsScene');
                globals.controlGameInstance.scene.getScene('BattleButtonsScene').createTargetButtons(null, 'item', item);
                return true;
            } else {
                console.log('trying to use item in bttlescene.. originscene: ', originScene, 'item: ', item.name);
                console.log(user);
              
                
                battleScene.createMove3('item', battleScene.currentTurn, null, item);

                
                //is in battle so will use currentturn
                // this.handlePartyScene(scene, item, battleScene.currentTurn);



                // this.launchPartyScene(scene, item);
                return true;
            }
        } else {


            this.launchPartyScene(scene, item);
            return true;
        }
    }
    launchPartyScene(scene, item) {
        console.log('from: ', scene.from, 'ation: ', scene.action);
        scene.scene.launch('PartyScene', { originScene: 'ItemsScene', selectedItem: item, from: scene.from, action: scene.action });
        scene.scene.pause();
    }

    useFieldItem(scene, item) {
        const mainMenu = globals.gameInstance.scene.getScene('MainMenu');
        console.log(scene);
        console.log(mainMenu);
        if (item.key === 'repel') {
            globals.repel.active = true;
            globals.repel.count = 30;
            item.quantity--;
            // scene.scene.stop();
            // mainMenu.closeMainMenu();
            scene.closeItemWindow();
            return true;
        } else if (item.key === 'escaperope') {
            // Implement escape rope logic here
            item.quantity--;
            // scene.scene.stop();
            // mainMenu.closeMainMenu();
            scene.closeItemWindow();

            return true;
        }
        return false;
    }

/////////////////////////////////////////////////////////////////////
    handleBattleButtonScene(scene, item, target, user)
    {
        if (item.key === 'pokeball')
        {

            //globals.gameInstance.scene.getScene('BattleScene').pokeball(target, user);

        }
    }
//////////////////////////////////////////////////////////////////
async handleBattleScene(scene, item, target, user)
    {
        if (item.key === 'pokeball')
        {
            console.log('using pokeball in item manager');
            console.log('target: ', target.name, 'user' , user.name);
            await scene.pokeball(target, user);
            item.quantity--;
            

        }
        else
        {
            console.log('user: ', user.name);
            await this.handlePartyScene(scene, item, user);
        }

    }
//////////////////////////////////////////////////////////////////


    async handlePartyScene(scene, item, pokemon) {
        const isHealingItem = item.type === 'healing' || item.type === 'food' || item.type === 'berry';
        const battleScene = globals.gameInstance.scene.getScene('BattleScene');

        if ((item.name === 'revive' && pokemon.currentHp !== 0) || 
            ((pokemon.currentHp === pokemon.maxHp || pokemon.currentHp === 0) && isHealingItem)) {
            console.log('Cannot use item on this Pokemon');
            return false;
        }

        console.log('using item ', item.name, ' on ' , pokemon.name);
        this.useItemOnPokemon(scene, item, pokemon);
        console.log('Used item on Pokemon');
        
        if (battleScene.scene.isPaused() || globals.gameInstance.scene.isActive('BattleScene')) {
            console.log('updating health bars');
            await battleScene.battleUI.updateHealthBars();
        } else {
            console.log('BattleScene does not exist');
        }

        if (scene.scene.key === 'PartyScene')
        {
            console.log('updating healthbar and stoping partyscene');
            await scene.updateHealthBar(scene.healthBars[globals.monsterManager.partyMonsters.indexOf(pokemon)], pokemon);
            // globals.sceneManager.stop('PartyScene');
            // globals.sceneManager.relaunch('ItemsScene', {originScene: 'MainMenu'});
            scene.closePartyWindow();
        }
        /*
        const pokemonIndex = scene.pokemonData.indexOf(pokemon);
        if (pokemonIndex !== -1) {
            scene.updateHealthBar(scene.healthBars[pokemonIndex], pokemon);
        } else {
            console.error('Pokemon not found in pokemonData array');
        }
        */
        /*
        if (isHealingItem || item.name === 'Revive') { 
            scene.locked = true;
            scene.time.delayedCall(500, () => {
                scene.locked = false;
                scene.closePartyWindow();
                globals.controlGameInstance.scene.getScene('ItemsScene').closeItemWindow();
                console.log('Closed party and item scenes');
                if (battleScene.scene.isPaused() || globals.gameInstance.scene.isActive('BattleScene')) {
                    battleScene.defeated = false;
                } else {
                    console.log('skipping actions since no battlescene detected');
                }
            });
        } else {
            scene.closePartyWindow();
            console.log('closing item window');
            console.log('action: ', scene.action);
            globals.controlGameInstance.scene.getScene('ItemsScene').closeItemWindow();
            console.log('Closed party and item scenes');
            battleScene.defeated = false;
        }
        */
        // scene.closeItemWindow();
        return true;
    }

    useItemOnPokemon(scene, item, pokemon, potionQuantity = 1) {
    
      

  

        console.log(`Using ${item.name} on ${pokemon.name}`);

        switch (item.type) {
            case 'healing':
            case 'food':
            case 'berry':
                this.useHealingItem(scene, item, pokemon, potionQuantity);
                break;

            case 'pokeball':
                console.log('No action for using a pokeball');
                break;

            case 'revive':
                this.useReviveItem(scene, item, pokemon);
                break;

            case 'maxpp':
                this.useMaxPPItem(scene, item, pokemon);
                break;

            case 'rarecandy':
                this.useRareCandyItem(scene, item, pokemon);
                break;

            case 'status':
                this.useStatusCureItem(scene, item, pokemon);
                break;

            default:
                console.log(`Unknown item type: ${item.type}`);
        }

        // scene.updatePokemonUI(pokemon);
    }


   



    useStatusCureItem(scene, item,  pokemon) {
        if (item.quantity > 0 && pokemon.status === item.effect.curesStatus) {
            pokemon.status = null;
            item.quantity -= 1;
            console.log(`Cured ${pokemon.name}'s ${item.effect.curesStatus} status`);
            // scene.updatePokemonUI(pokemon);
            return true;
        } else {
            console.log(`Can't use ${item.name} on ${pokemon.name}`);
            return false;
        }
    }

    ///////////////////////////////////////////////////////
    useRareCandyItem(scene, item, pokemon) {
        if (item.quantity > 0) {
            pokemon.levelUp(item.effect.levelIncrease);
            item.quantity -= 1;
            console.log(`Leveled up ${pokemon.name} by ${item.effect.levelIncrease}`);
            // scene.updatePokemonUI(pokemon);
            return true;
        } else {
            console.log('No Rare Candies left');
            return false;
        }
    }
    /////////////////////////////////////////////////////////
    useMaxPPItem(scene, item, pokemon) {
        if (item.quantity > 0) {
            item.quantity -= 1;
            pokemon.moves.forEach(move => {
                move.currentPP = move.maxPP;
            });
            console.log('Restored all PP to max');
            // scene.updatePokemonUI(pokemon);
            return true;
        } else {
            console.log('No items left of Max PP');
            return false;
        }
    }
/////////////////////////////////////////////////////////

useReviveItem(scene, item,  pokemon) {
    if (pokemon.currentHp === 0 && item.quantity > 0) {
        const healAmount = Math.floor(pokemon.maxHp * itemData.effect.reviveAmount);
        pokemon.currentHp = healAmount;
        item.quantity -= 1;
        console.log(`Revived ${pokemon.name} with ${healAmount} HP`);
        // scene.updatePokemonUI(pokemon);
        return true;
    } else {
        console.log('Can only revive fainted pokemon or out of revives');
        return false;
    }
}
////////////////////////////////////////////////////
    useHealingItem(scene, item, pokemon, quantity) {
        if (pokemon.currentHp !== 0 && item.quantity > 0 && pokemon.currentHp < pokemon.maxHp) {
            const healAmount = item.effect.healAmount;
            const totalHealAmount = quantity > 1 ? healAmount * quantity : healAmount;
            const actualHealAmount = Math.min(totalHealAmount, pokemon.maxHp - pokemon.currentHp);
            const itemsUsed = Math.ceil(actualHealAmount / healAmount);

            pokemon.currentHp += actualHealAmount;
            item.quantity -= itemsUsed;

            console.log(`${pokemon.name} healed by ${actualHealAmount} HP using ${itemsUsed} ${item.name}.`);
            console.log(`Remaining ${item.name}: ${item.quantity}`);
            // scene.updatePokemonUI(pokemon);
            return true;
        } else {
            console.log("Can't heal fainted pokemon, out of items, or pokemon is at max HP");
            return false;
        }
    }
 
    ///////////////////////////////

    


}