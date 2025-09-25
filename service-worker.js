// console.log('service worker file being executed');
// sendMessageToGame('service worker file being executed');
const basePath = self.location.pathname.replace('service-worker.js', '');
sendMessageToGame('basepath: ' + basePath);
console.log('basePath: ', basePath);


const CACHE_NAME = 'monsterRPGCache';


self.addEventListener('install', (event) => {
    // console.log('firing install');
    sendMessageToGame('firing install');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // console.log('Caching files');
            sendMessageToGame('caching files');

            // return cache.addAll([
                const filesToCache = [
                "manifest.json",
                basePath,
                "battleButtonsScene.js",
                "battleScene.js",
                "battleUI.js",
                "breederScene.js",
                "button.js",
                "computerScene.js",
                "controlPanelScene.js",
                "controlScene.js",
                "dialogueBox.js",
                "dialogueBoxManager.js",
                "eventManager.js",
                "globals.js",
                "index.html",
                "index.js",
                "initializeGame.js",
                "inputManager.js",
                "interactWithPokemonScene.js",
                "item.js",
                "itemManager.js",
                "itemsScene.js",
                "mainMenuScene.js",
                "mapScene.js",
                "menuScene.js",
                "monster.js",
                "monsterManager.js",
                "move.js",
                "moveListScene.js",
                "oldManScene.js",
                "partyScene.js",
                "pokedexScene.js",
                "pokemonDetailsScene.js",
                "renamePokemonScene.js",
                "sceneManager.js",
                "selectCharacterScene.js",
                "slider.js",
                "starterPokemonScene.js",
                "transitionScene.js",
                "worldScene.js",
                "data/collision.js",
                "data/encounter.js",
                "data/fishingSurfing.js",
                "data/island.js",
                "images/A.png",
                "images/arrow.png",
                "images/B.png",
                "images/battleBg.png",
                "images/circle.png",
                "images/collision.png",
                "images/colors.png",
                "images/down.png",
                "images/elements.png",
                "images/elementsicons.png",
                "images/femaleplayer.png",
                "images/femaleplayer2.png",
                "images/femaleplayer2new.png",
                "images/First Asset pack.png",
                "images/fishing.png",
                "images/grass.jpg",
                "images/hearts.png",
                "images/hearts2.png",
                "images/left.png",
                "images/newmap15.png",
                "images/player.png",
                "images/player2.png",
                "images/player3.png",
                "images/player4.png",
                "images/pokeballs.png",
                "images/quest.png",
                "images/red2.png",
                "images/red3.png",
                "images/right.png",
                "images/Select.png",
                "images/settings.png",
                "images/stardew.png",
                "images/Start Select.png",
                "images/Start.png",
                "images/trainer.png",
                "images/trainer2.png",
                "images/trees.png",
                "images/up.png",
                "images/NinjaAdventure/Actor/Characters/BlackNinjaMage/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/BlackNinjaMage/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/BlackSorcerer/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/BlackSorcerer/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/BlueNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/BlueNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/BlueSamurai/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/BlueSamurai/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Boy/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Boy/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Cavegirl/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Cavegirl/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Cavegirl2/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Cavegirl2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Caveman/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Caveman/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Caveman/SeparateAnim/Attack.png",
                "images/NinjaAdventure/Actor/Characters/Caveman2/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Caveman2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Child/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Child/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/DarkNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/DarkNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/EggBoy/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/EggBoy/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/EggGirl/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/EggGirl/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Eskimo/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Eskimo/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/EskimoNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/EskimoNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/FlameMan/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/FlameMan/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/GoldKnight/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/GoldKnight/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/GrayNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/GrayNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/GreenCamouflage/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/GreenCamouflage/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/GreenDemon/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/GreenDemon/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Greenman/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Greenman/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/GreenNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/GreenNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Inspector/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Inspector/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Knight/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Knight/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Lion/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Lion/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/LionOrange/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/LionOrange/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/LionYellow/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/LionYellow/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/MaskedNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/MaskedNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/MaskFrog/Dead14.png",
                "images/NinjaAdventure/Actor/Characters/MaskFrog/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/MaskFrog/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Master/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Master/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Monk/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Monk/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Monk2/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Monk2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Noble/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Noble/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Noble/SeparateAnim/Walk.png",
                "images/NinjaAdventure/Actor/Characters/OldMan/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/OldMan/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/OldMan2/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/OldMan2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/OldMan3/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/OldMan3/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/OldWoman/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/OldWoman/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/OrangeNinjaMage/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/OrangeNinjaMage/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/OrangeSorcerer/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/OrangeSorcerer/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Princess/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Princess/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/RedCamouflage/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/RedCamouflage/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/RedDemon/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/RedDemon/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/RedFighter/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/RedFighter/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/RedNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/RedNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/RedNinja2/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/RedNinja2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/RedSamurai/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/RedSamurai/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Samurai/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Samurai/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Samurai/SeparateAnim/Walk.png",
                "images/NinjaAdventure/Actor/Characters/Skeleton/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Skeleton/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Spirit/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Spirit/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Villager/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Villager/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Villager2/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Villager2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Villager3/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Villager3/SpriteSheet.png",,
                "images/NinjaAdventure/Actor/Characters/Villager4/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Villager4/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/WhiteFighter/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/WhiteFighter/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/Woman/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/Woman/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Characters/YellowNinja/Faceset.png",
                "images/NinjaAdventure/Actor/Characters/YellowNinja/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Axolot/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Axolot/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/AxolotBlue/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/AxolotBlue/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Bamboo/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Bamboo/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/BambooYellow/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/BambooYellow/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Bat/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Bat/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Bat/SpriteSheet2.png",
                "images/NinjaAdventure/Actor/Monsters/Bear/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Bear/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Bear/SpriteSheet2.png",
                "images/NinjaAdventure/Actor/Monsters/Beast/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Beast/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Beast2/Beast2.png",
                "images/NinjaAdventure/Actor/Monsters/Beast2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Butterfly/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Butterfly/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/ButterflyBlue/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/ButterflyBlue/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Cyclope/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Cyclope/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Cyclope2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Cyclope2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Dino/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Dino/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Dragon/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Dragon/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/DragonYellow/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/DragonYellow/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Eye/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Eye/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Eye2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Eye2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Fish/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Fish/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/FishRed/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/FishRed/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Flam2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Flam2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Flame/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Flame/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/GoldRacoon/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/GoldRacoon/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Heart/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Heart/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Heart/SpriteSheet2.png",
                "images/NinjaAdventure/Actor/Monsters/HeartGreen/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/HeartGreen/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Kappa/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Kappa/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Kappa/SpriteSheet2.png",
                "images/NinjaAdventure/Actor/Monsters/KappaRed/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/KappaRed/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Lantern/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Lantern/SpriteSheet - Copy.png",
                "images/NinjaAdventure/Actor/Monsters/Lantern/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Lantern/SpriteSheet2.png",
                "images/NinjaAdventure/Actor/Monsters/LanternGreen/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/LanternGreen/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Larva/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Larva/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Larva2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Larva2/Larva2.png",
                "images/NinjaAdventure/Actor/Monsters/Lizard/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Lizard/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Lizard2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Lizard2/Lizard2.png",
                "images/NinjaAdventure/Actor/Monsters/Mole/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mole/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Mole2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mole2/Mole2.png",
                "images/NinjaAdventure/Actor/Monsters/Mollusc/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mollusc/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Mollusc2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mollusc2/Mollusc2.png",
                "images/NinjaAdventure/Actor/Monsters/Mouse/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mouse/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/MouseBlack/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/MouseBlack/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Mushroom/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mushroom/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Mushroom2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Mushroom2/mushroom2.png",
                "images/NinjaAdventure/Actor/Monsters/Octopus/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Octopus/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Octopus2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Octopus2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Owl/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Owl/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Owl2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Owl2/Owl2.png",
                "images/NinjaAdventure/Actor/Monsters/Panda/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Panda/SpriteSheet - Copy.png",
                "images/NinjaAdventure/Actor/Monsters/Panda/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Panda/SpriteSheet3.png",
                "images/NinjaAdventure/Actor/Monsters/Panda/SpriteSheet5.png",
                "images/NinjaAdventure/Actor/Monsters/Racoon/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Racoon/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Reptile2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Reptile2/Reptile2.png",
                "images/NinjaAdventure/Actor/Monsters/Skull/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Skull/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/SkullBlue/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/SkullBlue/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Slime/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Slime/Slime.png",
                "images/NinjaAdventure/Actor/Monsters/Slime2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Slime2/Slime2.png",
                "images/NinjaAdventure/Actor/Monsters/Slime3/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Slime3/Slime3.png",
                "images/NinjaAdventure/Actor/Monsters/Slime4/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Slime4/Slime4.png",
                "images/NinjaAdventure/Actor/Monsters/Snake/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Snake/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Snake2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Snake2/Snake2.png",
                "images/NinjaAdventure/Actor/Monsters/Snake3/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Snake3/Snake3.png",
                "images/NinjaAdventure/Actor/Monsters/Snake4/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Snake4/Snake4.png",
                "images/NinjaAdventure/Actor/Monsters/Spider/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Spider/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/SpiderYellow/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/SpiderYellow/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Spirit/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Spirit/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/Spirit2/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/Spirit2/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/TRex/Faceset.png",
                "images/NinjaAdventure/Actor/Monsters/TRex/SpriteSheet.png",
                "images/NinjaAdventure/Actor/Monsters/TRex/SpriteSheet2.png",
                "images/NinjaAdventure/FX/Elemental/Flame/Preview.gif",
                "images/NinjaAdventure/FX/Elemental/Flame/SpriteSheet.png",
                "images/NinjaAdventure/FX/Elemental/Ice/Preview.gif",
                "images/NinjaAdventure/FX/Elemental/Ice/SpriteSheet.png",
                "images/NinjaAdventure/FX/Elemental/Ice/SpriteSheetB.png",
                "images/NinjaAdventure/FX/Elemental/Ice/SpriteSheetFlake.png",
                "images/NinjaAdventure/FX/Elemental/Plant/Preview.gif",
                "images/NinjaAdventure/FX/Elemental/Plant/SpriteSheet.png",
                "images/NinjaAdventure/FX/Elemental/Plant/SpriteSheetB.png",
                "images/NinjaAdventure/FX/Elemental/Rock/Preview.gif",
                "images/NinjaAdventure/FX/Elemental/Rock/SpriteSheet.png",
                "images/NinjaAdventure/FX/Elemental/Rock/SpriteSheetB.png",
                "images/NinjaAdventure/FX/Elemental/Thunder/Preview.gif",
                "images/NinjaAdventure/FX/Elemental/Thunder/SpriteSheet.png",
                "images/NinjaAdventure/FX/Particle/AllPreview.png",
                "images/NinjaAdventure/FX/Particle/Bamboo.png",
                "images/NinjaAdventure/FX/Particle/Clouds.png",
                "images/NinjaAdventure/FX/Particle/Fire.png",
                "images/NinjaAdventure/FX/Particle/Grass.png",
                "images/NinjaAdventure/FX/Particle/Leaf.png",
                "images/NinjaAdventure/FX/Particle/LeafPink.png",
                "images/NinjaAdventure/FX/Particle/Rain.png",
                "images/NinjaAdventure/FX/Particle/RainOnFloor.png",
                "images/NinjaAdventure/FX/Particle/Rock.png",
                "images/NinjaAdventure/FX/Particle/RockGray.png",
                "images/NinjaAdventure/FX/Particle/Snow.png",
                "images/NinjaAdventure/FX/Particle/Spark.png",
                "images/NinjaAdventure/FX/Particle/Vase.png",
                "images/NinjaAdventure/FX/Particle/Wood.png",
                "images/NinjaAdventure/FX/Projectile/AllPreview.png",
                "images/NinjaAdventure/FX/Projectile/Arrow.png",
                "images/NinjaAdventure/FX/Projectile/BigEnergyBall.png",
                "images/NinjaAdventure/FX/Projectile/BigKunai.png",
                "images/NinjaAdventure/FX/Projectile/BigShuriken.png",
                "images/NinjaAdventure/FX/Projectile/CanonBall.png",
                "images/NinjaAdventure/FX/Projectile/EnergyBall.png",
                "images/NinjaAdventure/FX/Projectile/Fireball.png",
                "images/NinjaAdventure/FX/Projectile/IceSpike.png",
                "images/NinjaAdventure/FX/Projectile/Kunai.png",
                "images/NinjaAdventure/FX/Projectile/PlantSpike.png",
                "images/NinjaAdventure/FX/Projectile/Rock.png",
                "images/NinjaAdventure/FX/Projectile/Shuriken.png",
                "images/NinjaAdventure/FX/Projectile/ShurikenMagic.png",
                "images/NinjaAdventure/HUD/Arrow.png",
                "images/NinjaAdventure/HUD/Heart.png",
                "images/NinjaAdventure/HUD/Kunai.png",
                "images/NinjaAdventure/HUD/LifeBarMiniProgress.png",
                "images/NinjaAdventure/HUD/LifeBarMiniUnder.png",
                "images/NinjaAdventure/HUD/Shuriken.png",
                "images/NinjaAdventure/HUD/Tuto.png",
                "images/NinjaAdventure/HUD/Dialog/ChoiceBox.png",
                "images/NinjaAdventure/HUD/Dialog/DialogBox.png",
                "images/NinjaAdventure/HUD/Dialog/DialogBoxFaceset.png",
                "images/NinjaAdventure/HUD/Dialog/DialogInfo.png",
                "images/NinjaAdventure/HUD/Dialog/DialogueBoxSimple.png",
                "images/NinjaAdventure/HUD/Dialog/FacesetBox.png",
                "images/NinjaAdventure/HUD/Dialog/NoButton.png",
                "images/NinjaAdventure/HUD/Dialog/YesButton.png",
                "images/NinjaAdventure/HUD/Font/font24x30.png",
                "images/NinjaAdventure/HUD/Font/font8x8.png",
                "images/NinjaAdventure/HUD/NinePathRect/DialogueBubble.png",
                "images/NinjaAdventure/HUD/NinePathRect/FacesetBox.png",
                "images/NinjaAdventure/Items/AllPreview.png",
                "images/NinjaAdventure/Items/WeaponPreview2.png",
                "images/NinjaAdventure/Items/Food/Beaf.png",
                "images/NinjaAdventure/Items/Food/Calamari.png",
                "images/NinjaAdventure/Items/Food/Fish.png",
                "images/NinjaAdventure/Items/Food/FortuneCookie.png",
                "images/NinjaAdventure/Items/Food/Honey.png",
                "images/NinjaAdventure/Items/Food/Noodle.png",
                "images/NinjaAdventure/Items/Food/Nut.png",
                "images/NinjaAdventure/Items/Food/Nut2.png",
                "images/NinjaAdventure/Items/Food/Octopus.png",
                "images/NinjaAdventure/Items/Food/Onigiri.png",
                "images/NinjaAdventure/Items/Food/Seed1.png",
                "images/NinjaAdventure/Items/Food/Seed2.png",
                "images/NinjaAdventure/Items/Food/Seed3.png",
                "images/NinjaAdventure/Items/Food/SeedBig1.png",
                "images/NinjaAdventure/Items/Food/SeedBig2.png",
                "images/NinjaAdventure/Items/Food/SeedBig3.png",
                "images/NinjaAdventure/Items/Food/SeedLarge.png",
                "images/NinjaAdventure/Items/Food/SeedLargeWhite.png",
                "images/NinjaAdventure/Items/Food/Shrimp.png",
                "images/NinjaAdventure/Items/Food/Sushi.png",
                "images/NinjaAdventure/Items/Food/Sushi2.png",
                "images/NinjaAdventure/Items/Food/TeaLeaf.png",
                "images/NinjaAdventure/Items/Food/Yakitori.png",
                "images/NinjaAdventure/Items/Other/Letter.png",
                "images/NinjaAdventure/Items/Other/Letter2.png",
                "images/NinjaAdventure/Items/Other/Letter3.png",
                "images/NinjaAdventure/Items/Other/Stamp.png",
                "images/NinjaAdventure/Items/Potion/EmptyPot.png",
                "images/NinjaAdventure/Items/Potion/Hear.png",
                "images/NinjaAdventure/Items/Potion/LifePot.png",
                "images/NinjaAdventure/Items/Potion/Medipack.png",
                "images/NinjaAdventure/Items/Potion/MilkPot.png",
                "images/NinjaAdventure/Items/Potion/WaterPot.png",
                "images/NinjaAdventure/Items/Scroll/ScrollEmpty.png",
                "images/NinjaAdventure/Items/Scroll/ScrollFire.png",
                "images/NinjaAdventure/Items/Scroll/ScrollIce.png",
                "images/NinjaAdventure/Items/Scroll/ScrollPlant.png",
                "images/NinjaAdventure/Items/Scroll/ScrollRock.png",
                "images/NinjaAdventure/Items/Scroll/ScrollThunder.png",
                "images/NinjaAdventure/Items/Treasure/BigTreasureChest.png",
                "images/NinjaAdventure/Items/Treasure/Coin2.png",
                "images/NinjaAdventure/Items/Treasure/Coin2Preview.gif",
                "images/NinjaAdventure/Items/Treasure/GoldCoin.png",
                "images/NinjaAdventure/Items/Treasure/GoldCup.png",
                "images/NinjaAdventure/Items/Treasure/GoldKey.png",
                "images/NinjaAdventure/Items/Treasure/LittleTreasureChest.png",
                "images/NinjaAdventure/Items/Treasure/SilverCoin.png",
                "images/NinjaAdventure/Items/Treasure/SilverCup.png",
                "images/NinjaAdventure/Items/Treasure/SilverKey.png",
                "images/NinjaAdventure/Ui/Arrow.png",
                "images/NinjaAdventure/Ui/Kunai.png",
                "images/NinjaAdventure/Ui/LifeBarMiniProgress.png",
                "images/NinjaAdventure/Ui/LifeBarMiniUnder.png",
                "images/NinjaAdventure/Ui/Shuriken.png",
                "images/NinjaAdventure/Ui/Tuto.png",
                "images/NinjaAdventure/Ui/Dialog/ChoiceBox.png",
                "images/NinjaAdventure/Ui/Dialog/DialogBox.png",
                "images/NinjaAdventure/Ui/Dialog/DialogBoxFaceset.png",
                "images/NinjaAdventure/Ui/Dialog/DialogInfo.png",
                "images/NinjaAdventure/Ui/Dialog/DialogueBoxSimple.png",
                "images/NinjaAdventure/Ui/Dialog/FacesetBox.png",
                "images/NinjaAdventure/Ui/Dialog/NoButton.png",
                "images/NinjaAdventure/Ui/Dialog/YesButton.png",
                "images/NinjaAdventure/Ui/Emote/emote1.png",
                "images/NinjaAdventure/Ui/Emote/emote10.png",
                "images/NinjaAdventure/Ui/Emote/emote11.png",
                "images/NinjaAdventure/Ui/Emote/emote12.png",
                "images/NinjaAdventure/Ui/Emote/emote13.png",
                "images/NinjaAdventure/Ui/Emote/emote14.png",
                "images/NinjaAdventure/Ui/Emote/emote15.png",
                "images/NinjaAdventure/Ui/Emote/emote16.png",
                "images/NinjaAdventure/Ui/Emote/emote17.png",
                "images/NinjaAdventure/Ui/Emote/emote18.png",
                "images/NinjaAdventure/Ui/Emote/emote19.png",
                "images/NinjaAdventure/Ui/Emote/emote2.png",
                "images/NinjaAdventure/Ui/Emote/emote20.png",
                "images/NinjaAdventure/Ui/Emote/emote21.png",
                "images/NinjaAdventure/Ui/Emote/emote22.png",
                "images/NinjaAdventure/Ui/Emote/emote23.png",
                "images/NinjaAdventure/Ui/Emote/emote24.png",
                "images/NinjaAdventure/Ui/Emote/emote25.png",
                "images/NinjaAdventure/Ui/Emote/emote26.png",
                "images/NinjaAdventure/Ui/Emote/emote27.png",
                "images/NinjaAdventure/Ui/Emote/emote28.png",
                "images/NinjaAdventure/Ui/Emote/emote29.png",
                "images/NinjaAdventure/Ui/Emote/emote3.png",
                "images/NinjaAdventure/Ui/Emote/emote30.png",
                "images/NinjaAdventure/Ui/Emote/emote4.png",
                "images/NinjaAdventure/Ui/Emote/emote5.png",
                "images/NinjaAdventure/Ui/Emote/emote6.png",
                "images/NinjaAdventure/Ui/Emote/emote7.png",
                "images/NinjaAdventure/Ui/Emote/emote8.png",
                "images/NinjaAdventure/Ui/Emote/emote9.png",
                "images/NinjaAdventure/Ui/Font/font24x30.png",
                "images/NinjaAdventure/Ui/Font/font8x8.png",
                "images/NinjaAdventure/Ui/LifeReceptacle/heart.png",
                "images/NinjaAdventure/Ui/LifeReceptacle/heart_2.png",
                "images/NinjaAdventure/Ui/LifeReceptacle/heart_3.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_1.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_10.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_11.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_12.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_2.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_3.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_4.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_5.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_6.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_7.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_7_streched.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_8.png",
                "images/NinjaAdventure/Ui/Theme/nine_path_9.png",
                "images/NinjaAdventure/Ui/Theme/preview.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/button_disabled.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/button_hover.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/button_normal.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/button_pressed.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/checked.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/checked_disabled.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/h_slidder_grabber.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/h_slidder_grabber_disabled.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/h_slidder_grabber_hover.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched_square.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched_square.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_focus.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/nine_path_panel.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/pause_menu.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/pause_menu2.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/pause_menu4.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/slider_progress.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/slider_progress_hover.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_disabled.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_hover.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_normal.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/stretched_button_pressed.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/ThemePreview.gif",
                "images/NinjaAdventure/Ui/Theme/Theme1/unchecked.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/unchecked_disabled.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_disabled.png",
                "images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_hover.png",
                "images/Orb/blackexplosion.png",
                "images/Orb/blueexplosion.png",
                "images/Orb/blueexplosion2.png",
                "images/Orb/greenexplosion.png",
                "images/Orb/orangeexplosion.png",
                "images/Orb/pinkexplosion.png",
                "images/Orb/purpleexplosion.png",
                "images/Orb/purpleexplosion2.png",
                "images/Orb/redexplosion.png",
                "images/Orb/whiteexplosion.png",
                "images/trees/bush 0011.png",
                "images/trees/bush 0021.png",
                "images/trees/bush 0031.png",
                "images/trees/bush 0041.png",
                "images/trees/bush 0051.png",
                "images/trees/bush left1.png",
                "images/trees/bush middle1.png",
                "images/trees/bush right1.png",
                "images/trees/Tree Full spritesheet1.png",
                "images/trees/tree001.png",
                "images/trees/tree002.png",
                "images/trees/tree003.png",
                "images/trees/tree004.png",
                "monsterrpgicon.png",
                "images/screenshot1.png",
                "phaser.js"
            ];


            // const cachePromises = filesToCache.map((file) => {
            //     return cache.add(file).catch((error) => {

            //         console.error(`Failed to cache ${file}:`, error);
            //         sendMessageToGame(`Failed to cache ${file}: ${error.message}`);
            //     });
            // });

            const cachePromises = filesToCache.map((file, index) => {
                return cache.add(file).then(() => {
                    // If it's the first file, log detailed information about it
                    if (index === 0) {
                        // Log file URL
                        console.log('Caching file:', file);
                        // You can also log detailed information like headers and metadata:
                        fetch(file).then((response) => {
                            // console.log('File Details for Caching:');
                            // console.log('URL:', response.url);
                            // console.log('Status:', response.status);
                            // console.log('Status Text:', response.statusText);
                            // console.log('Headers:', [...response.headers.entries()]);
                            // If you want to inspect the response body, you can clone it for further inspection
                           
                        }).catch((error) => {
                            console.error('Error fetching file for detailed log:', error);
                        });
                    }
                }).catch((error) => {
                    console.error(`Failed to cache ${file}:`, error);
                    sendMessageToGame(`Failed to cache ${file}: ${error.message}`);
                });
            });
            




            return Promise.all(cachePromises).then(() => {
                console.log('Finished caching all files.');
                sendMessageToGame('Finished caching all files');
            });
        })
    );
});


self.addEventListener('fetch', (event) => {
    console.log('fetch firing');
    // let requestUrl = event.request.url;

    // // If the request URL ends with '/' or the root is requested, serve `index.html`
    // if (requestUrl.endsWith('/')) {
    //     requestUrl += 'index.html';
    // }
    // sendMessageToGame('fetch firing');
    event.respondWith(
        caches.match(event.request.url)
            .then((response) => {
                if (response) {
                    // console.log('Cache hit for:', event.request.url);
                    // sendMessageToGame('Cache hit for:', event.request.url);
                    return response;
                }
                console.log('Cache miss for:', event.request.url);
                sendMessageToGame('Cache miss for:', event.request.url);

                // // // Log the request details for the cache miss
                // console.log('Missed Request Method:', event.request.method);
                // console.log('Missed Request Headers:', [...event.request.headers.entries()]);


                return fetch(event.request)
                    .then(networkResponse => {
                        console.log('Network fetch successful for:', event.request.url);
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Network fetch failed for:', event.request.url, error);
                        // return new Response('Network error', { status: 500, statusText: 'Failed to fetch' });
                        return new Response('Network error: ' + event.request.url + ', ' + error.message, {
                            status: 500,
                            statusText: 'Failed to fetch'
                        });
                    });
            })
            .catch(error => {
                console.error('Error in cache matching for:', event.request.url, error);
                return fetch(event.request)
                    .then(networkResponse => {
                        console.log('Fallback network fetch successful for:', event.request.url);
                        return networkResponse;
                    })
                    .catch(networkError => {
                        console.error('Fallback network fetch failed for:', event.request.url, networkError);
                        return new Response('Cache and network error', { status: 500, statusText: 'Failed to fetch from cache and network' });
                    });
            })
    );
});


self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName); // Clean up old caches
                        }
                    })
                );
            }),
            self.clients.claim().then(() => {
                console.log('[Service Worker] Claiming clients');
            })
        ]).then(() => {
            console.log('[Service Worker] Activate completed');
        })
    );
});



function sendMessageToGame(message, maxRetries = 5, delay = 5000) {
    let retries = 0;
    
    function attempt() {
      self.clients.matchAll().then(clients => {
        if (clients.length > 0) {
          clients.forEach(client => client.postMessage(message));
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(attempt, delay);
        } else {
          console.log('Failed to send message after max retries');
        }
      });
    }
    
    attempt();
  }