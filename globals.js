class Globals {
    constructor() {
        console.log('globals being created');
        this._eventManager = new EventManager();

        this._dialogueBoxManager = new DialogueBoxManager();

        this._gamepad = null;

        this._selectedCharacter = '';

        this._characterName = '';

        this._isRunning = false;

        this._monsterManager = new MonsterManager();
        this._itemManager = new ItemManager();


        this._progress = {
            intro: false,
            tooltipStarter: false,
            tooltipStarter2: false,
            tooltip: false, 
            starter: false, 
            starterCaught : false, 
            starterComplete:false,
            tutorialProgress: false,


        };


        this._characterList = [
            "BlackNinjaMage",
            "BlackSorcerer",
            "BlueNinja",
            "BlueSamurai",
            "Boy",
            "Cavegirl",
            "Cavegirl2",
            "Caveman",
            "Caveman2",
            "Child",
            "DarkNinja",
            "EggBoy",
            "EggGirl",
            "Eskimo",
            "EskimoNinja",
            "FlameMan",
            "GoldKnight",
            "GrayNinja",
            "GreenCamouflage",
            "GreenDemon",
            "Greenman",
            "GreenNinja",
            "Inspector",
            "Knight",
            "Lion",
            "LionOrange",
            "LionYellow",
            "MaskedNinja",
            "MaskFrog",
            "Master",
            "Monk",
            "Monk2",
            "Noble",
            "OldMan",
            "OldMan2",
            "OldMan3",
            "OldWoman",
            "OrangeNinjaMage",
            "OrangeSorcerer",
            "Princess",
            "RedCamouflage",
            "RedDemon",
            "RedFighter",
            "RedNinja",
            "RedNinja2",
            "RedSamurai",
            "Samurai",
            "Skeleton",
            "Spirit",
            "Villager",
            "Villager2",
            "Villager3",
            "Villager4",
            "WhiteFighter",
            "Woman",
            "YellowNinja"
        ];
        

        this._backup=false;
        this._isNewGame = true;
        this._isRebooting = false;


        this._gameInstance = null;  // To store reference to game instance
        this._controlGameInstance = null;  // To store reference to controlGame instance
        this._controlPanelGameInstance = null;  // To store reference to controlGame instance

        this._controlPanelOpen = false;

        this._events = new Phaser.Events.EventEmitter();


        this._inputManager = new InputManager();
        this._sceneManager = null;
        this._characterPosition = { x: 65 , y: 45, facing: 'down', followingPokemon: null, route: 0, money : 500, followingPokemonX : 0, followingPokemonY : 0, followingPokemonFacing : 'down', previousTileX: null, previousTileY: null, spawn: 'home', tooltip: false, starter: false, starterCaught : false, starterComplete:false, tutorialProgress: 0, running: false};
    //65, 45
        


        this._buttonConfigs = null
  
       
        this._originalPokemonData = [
            { key: 'Axolot', name: 'Axolot', type: 'Water', baseMaxHp: 50, baseAttack: 25, baseDefense: 15, baseSpeed: 20 },
            { key: 'Bamboo', name: 'Bamboo', type: 'Grass', baseMaxHp: 40, baseAttack: 30, baseDefense: 20, baseSpeed: 20 },
            { key: 'Beast', name: 'Beast', type: 'Normal', baseMaxHp: 60, baseAttack: 20, baseDefense: 30, baseSpeed: 20 },
            { key: 'Butterfly', name: 'Butterfly', type: 'Bug', baseMaxHp: 35, baseAttack: 27.5, baseDefense: 17.5, baseSpeed: 25 },
            { key: 'Cyclope', name: 'Cyclope', type: 'Psychic', baseMaxHp: 45, baseAttack: 35, baseDefense: 25, baseSpeed: 15,  },
            { key: 'Dragon', name: 'Dragon', type: 'Fire', baseMaxHp: 50, baseAttack: 35, baseDefense: 20, baseSpeed: 15 },
            { key: 'Eye', name: 'Eye', type: 'Dark', baseMaxHp: 55, baseAttack: 32.5, baseDefense: 22.5, baseSpeed: 20 },
            { key: 'Spirit', name: 'Spirit', type: 'Ghost', baseMaxHp: 55, baseAttack: 30, baseDefense: 25, baseSpeed: 20 },
            { key: 'Fish', name: 'Fish', type: 'Water', baseMaxHp: 35, baseAttack: 20, baseDefense: 15, baseSpeed: 25,  },
            { key: 'Flame', name: 'Flame', type: 'Fire', baseMaxHp: 40, baseAttack: 40, baseDefense: 10, baseSpeed: 20,  }, 
            { key: 'Skull', name: 'Skull', type: 'Dark', baseMaxHp: 60, baseAttack: 25, baseDefense: 25, baseSpeed: 20,  },
            { key: 'Mouse', name: 'Mouse', type: 'Electric', baseMaxHp: 30, baseAttack: 25, baseDefense: 15, baseSpeed: 25},
            { key: 'Snake', name: 'Snake', type: 'Poison', baseMaxHp: 45, baseAttack: 30, baseDefense: 20, baseSpeed: 20 },
            { key: 'Larva', name: 'Larva', type: 'Grass', baseMaxHp: 30, baseAttack: 20, baseDefense: 15, baseSpeed: 20, },
            { key: 'Lizard', name: 'Lizard', type: 'Normal', baseMaxHp: 35, baseAttack: 25, baseDefense: 20, baseSpeed: 25, },
            { key: 'Mole', name: 'Mole', type: 'Normal', baseMaxHp: 40, baseAttack: 30, baseDefense: 25, baseSpeed: 15,  },
            { key: 'Mollusc', name: 'Mollusc', type: 'Water', baseMaxHp: 45, baseAttack: 20, baseDefense: 25, baseSpeed: 15,  },
            { key: 'Mushroom', name: 'Mushroom', type: 'Poison', baseMaxHp: 25, baseAttack: 15, baseDefense: 20, baseSpeed: 30 },
            { key: 'Owl', name: 'Owl', type: 'Psychic', baseMaxHp: 40, baseAttack: 35, baseDefense: 20, baseSpeed: 25 },
            { key: 'Octopus', name: 'Octopus', type: 'Water', baseMaxHp: 55, baseAttack: 30, baseDefense: 25, baseSpeed: 20 },
            { key: 'Racoon', name: 'Racoon', type: 'Normal', baseMaxHp: 35, baseAttack: 30, baseDefense: 25, baseSpeed: 20 },
            { key: 'Dino', name: 'Dino', type: 'Rock', baseMaxHp: 50, baseAttack: 35, baseDefense: 20, baseSpeed: 25 },
            { key: 'Spider', name: 'Spider', type: 'Bug', baseMaxHp: 40, baseAttack: 35, baseDefense: 15, baseSpeed: 25 },
            { key: 'Kappa', name: 'Kappa', type: 'Water', baseMaxHp: 45, baseAttack: 25, baseDefense: 30, baseSpeed: 20 },
            { key: 'Heart', name: 'Heart', type: 'Normal', baseMaxHp: 50, baseAttack: 30, baseDefense: 20, baseSpeed: 20 },
            { key: 'Lantern', name: 'Lantern', type: 'Ghost', baseMaxHp: 35, baseAttack: 20, baseDefense: 30, baseSpeed: 15 },
        
            { key: 'TRex', name: 'TRex', type: 'Rock', baseMaxHp: 60, baseAttack: 40, baseDefense: 30, baseSpeed: 25 },
            { key: 'Bat', name: 'Bat', type: 'Dark', baseMaxHp: 40, baseAttack: 35, baseDefense: 20, baseSpeed: 30 },
            { key: 'Panda', name: 'Panda', type: 'Normal', baseMaxHp: 55, baseAttack: 45, baseDefense: 40, baseSpeed: 25 },
            { key: 'Bear', name: 'Bear', type: 'Normal', baseMaxHp: 70, baseAttack: 50, baseDefense: 40, baseSpeed: 20 }
                    
            
            // Add more Pokémon data as needed
        ];

        const recursiveAdd = (data, index = 0) => {
            if (index >= data.length) {
                return;
            }
        
            const pokemon = data[index];
            pokemon.maxHp = pokemon.baseMaxHp;
            pokemon.currentHp = pokemon.maxHp;
            pokemon.attack = pokemon.baseAttack;
            pokemon.defense = pokemon.baseDefense;
            pokemon.speed = pokemon.baseSpeed;
            pokemon.level = 1;
            pokemon.xp = 0;
            pokemon.moves = [];
            pokemon.status = 'none';
        
             // Add new properties
            pokemon.happiness = 0.5; // Random value between 0 and 1
            pokemon.mood = 'Happy'; // Default mood
            pokemon.bond = 'unfriendly'; // Default bond
            pokemon.bondLevel = 0;
            pokemon.hunger = 'hungry'; // Default bond


            recursiveAdd(data, index + 1);
        };
        
        recursiveAdd(this._originalPokemonData);
        
        
        
        this._routes = {
            route0: { pokemon: ['Bamboo', 'Butterfly', 'Racoon', 'Spider', 'Bat'], levelRange: [4, 9] },
            route1: { pokemon: ['Dragon', 'Flame', 'Skull', 'Heart', 'Bear'], levelRange: [9, 14] },
            route2: { pokemon: ['Mole', 'Dino', 'Owl', 'Lantern', 'Panda'], levelRange: [9, 14] },
            route3: { pokemon: ['Mouse', 'Axolot', 'Snake', 'TRex'], levelRange: [2, 2] }, // Fixed level
            route4: { pokemon: ['Mushroom', 'Fish', 'Mollusc', 'Kappa'], levelRange: [14, 19] },
            route5: { pokemon: ['Lizard', 'Larva', 'Snake'], levelRange: [19, 29] },
            route6: { pokemon: ['Octopus', 'Eye', 'Beast'], levelRange: [39, 49] },
            route7: { pokemon: ['Spirit', 'Cyclope', 'Beast'], levelRange: [29, 39] }
        };
                






        this._pokemonTypeColor = 
        {
            'Water': 'blue', // Blue
            'Grass': 'green', // Green
            'Normal': 'white', // White
            'Bug': 'green', // Dark Green
            'Psychic': 'purple', // Magenta
            'Dragon': 'purple', // Purple
            'Dark': 'black', // Black
            'Ghost': 'white', // Indigo
            'Electric': 'orange', // Yellow
            'Fire': 'red', // Orange
            'Poison': 'purple', // Purple
            'Rock': 'orange' // Brown
        }


        this._pokemonTypes = {
            'Water': 0x0000FF, // Blue
            'Grass': 0x008823, // Green
            'Normal': 0x808080, // White
            'Bug': 0x00651A, // Dark Green
            'Psychic': 0xFF00FF, // Magenta
            'Dragon': 0x800080, // Purple
            'Dark': 0x000000, // Black
            'Ghost': 0x4B0082, // Indigo
            'Electric': 0x808000, // Yellow
            'Fire': 0xFF4500, // Orange
            'Poison': 0x800080, // Purple
            'Rock': 0xA52A2A // Brown
            // Add more types and colors as needed
        };




        this._difficulty = 'medium';


        this._typeEffectiveness = {
            'Normal': [],
            'Water': ['Fire', 'Ground', 'Rock'],
            'Fire': ['Grass', 'Bug', 'Ice'],
            'Grass': ['Water', 'Ground', 'Rock'],
            'Electric': ['Water', 'Flying'],
            'Ice': ['Grass', 'Ground', 'Flying', 'Dragon'],
            'Fighting': ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'],
            'Poison': ['Grass', 'Fairy'],
            'Ground': ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'],
            'Flying': ['Grass', 'Fighting', 'Bug'],
            'Psychic': ['Fighting', 'Poison'],
            'Bug': ['Grass', 'Psychic', 'Dark'],
            'Rock': ['Fire', 'Ice', 'Flying', 'Bug'],
            'Ghost': ['Psychic', 'Ghost'],
            'Dragon': ['Dragon'],
            'Dark': ['Psychic', 'Ghost'],
            'Steel': ['Ice', 'Rock', 'Fairy'],
            'Fairy': ['Fighting', 'Dragon', 'Dark']
            // Add more type effectiveness relationships as needed
        };
     
        this._starterPokemon = ['Dragon', 'Flame', 'Eye'];



        this._pokemonData = JSON.parse(JSON.stringify(this._originalPokemonData)); // Deep copy of original data

        this._partyPokemonData = [];

        this._currentPokemonData = null;

        this._pc = [];


        this._player = {
            male: {
                active: false,
                scale: 0.1,
                width: 160,
                height: 200,
                row: 3,
                sprite: 'male'
                
            },
            female: {
                active: false,
                scale: 0.4,
                width: 64,
                height: 64,
                row: 4,
                sprite: 'female'
            },
            female2: {
                active: false,
                scale: 0.4,
                width: 64,
                height: 64,
                row: 4,
                sprite: 'female2'
            },
            red: {
                active: false,
                scale: 0.8,
                width: 25.75,
                height: 29.75,
                row: 4,
                sprite: 'red'
            }
        };

        this._fishing = false;

        this._npcIdle = {
            kid: {
                key: 'kid',
                x: 66,
                y: 45,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Boy',
                name: 'Tommy'
            },
            kid2: {
                key: 'kid',
                x: 152,
                y: 117,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Boy',
                name: 'Timmy'
            },
            oldman1: {
                key: 'oldman',
                x: 31,
                y: 188,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'OldMan',
                name: 'Shop Keeper'
            },
            oldman2: {
                key: 'oldman',
                x: 52,
                y: 188,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'OldMan',
                name: 'Elder'
            },
            oldman3: {
                key: 'oldman2',
                x: 94,
                y: 187,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Master',
                name: 'Sage'
            },
            redoldman: {
                key: 'redoldman',
                x: 74,
                y: 45,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'OldMan2',
                name: 'Crimson Elder'
            },
            samurai: {
                key: 'samurai',
                x: 91,
                y: 45,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'OldMan3',
                name: 'Ronin'
            },
            woman1: {
                key: 'women',
                x: 49,
                y: 32,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'OldWoman',
                name: 'Martha'
            },
            wife: {
                key: 'wife',
                x: 97,
                y: 185,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Woman',
                name: 'Linda'
            },
            villager: {
                key: 'villager',
                x: 62,
                y: 45,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Villager',
                name: 'Villager A'
            },
            villager2: {
                key: 'villager2',
                x: 92,
                y: 32,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Villager2',
                name: 'Villager B'
            },
            villager3: {
                key: 'villager3',
                x: 106,
                y: 57,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Villager3',
                name: 'Villager C'
            },
            mage: {
                key: 'mage',
                x: 74,
                y: 185,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'RedNinja',
                name: 'Mage'
            },
            teacher: {
                key: 'teacher',
                x: 79,
                y: 126,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'BlackNinjaMage',
                name: 'Wizard'
            },
            renamer: {
                key: 'renamer',
                x: 91,
                y: 66,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Inspector',
                name: 'Tom'
            },
            breeder: {
                key: 'breeder',
                x: 161,
                y: 110,
                sprite: null,
                facing: 'down',
                frame: 0,
                path: 'Woman',
                name: 'Linda'
            }
        };
        
        
        
        this._npc = {
            trainer1: {
                key: 'trainer1',
                path: '',
                name: '',
                pokemon: ['Dragon', 'Eye', 'Butterfly'],
                x: 90,
                y: 72,
                sprite: null,
                defeated: false,
                active: false,
                sightRange: 8, 
                facing: 'left',
                level: 14,
                scale: 0.5,
                frame: 4,
                frame1: 5,
                frame2: 6, 
                frame3: 7,
                up: 12,
                down: 0,
                left: 4,
                right: 8,
                arena:false
            },
            trainer2: {
                key: 'eggboy',
                path: '',
                name: '',
                pokemon: ['Dragon', 'Flame', 'Flame'],
                x: 152,
                y: 127,
                sprite: null,
                defeated: false,
                active: false,
                sightRange: 3, 
                facing: 'left',
                level: 29,
                scale: 1,
                frame: 2,
                frame1: 6,
                frame2: 10, 
                frame3: 14,
                up: 12,
                down: 0,
                left: 4,
                right: 8,
                arena:false
            },
            trainer3: {
                key: 'eggboy',
                path: '',
                name: '',
                pokemon: ['Dragon', 'Flame', 'Flame'],
                x: 152,
                y: 131,
                sprite: null,
                defeated: false,
                active: false,
                sightRange: 3, 
                facing: 'left',
                level: 29,
                scale: 1,
                frame: 2,
                frame1: 6,
                frame2: 10, 
                frame3: 14,
                up: 12,
                down: 0,
                left: 4,
                right: 8,
                arena:false
            },
            trainer4: {
                key: 'eggboy',
                path: '',
                name: '',
                pokemon: ['Dragon', 'Flame', 'Flame'],
                x: 152,
                y: 135,
                sprite: null,
                defeated: false,
                active: false,
                sightRange: 3, 
                facing: 'left',
                level: 29,
                scale: 1,
                frame: 2,
                frame1: 6,
                frame2: 10, 
                frame3: 14,
                up: 12,
                down: 0,
                left: 4,
                right: 8,
                arena:false
            },
            trainer5: {
                key: 'eggboy',
                path: '',
                name: '',
                pokemon: ['Dragon', 'Flame', 'Flame', 'Skull', 'Skull', 'Skull'],
                x: 150,
                y: 145,
                sprite: null,
                defeated: false,
                active: false,
                sightRange: 3, 
                facing: 'up',
                level: 34,
                scale: 1,
                frame: 0,
                frame1: 4,
                frame2: 8, 
                frame3: 12,
                up: 12,
                down: 0,
                left: 4,
                right: 8,
                arena:false
            },
            trainer6: {
                key: 'trainer1',
                path: '',
                name: '',
                pokemon: ['Dragon'],
                x: 72,
                y: 65,
                sprite: null,
                defeated: false,
                active: false,
                sightRange: 3, 
                facing: 'right',
                level: 4,
                scale: 0.5,
                frame: 8,
                frame1: 9,
                frame2: 10, 
                frame3: 11,
                up: 12,
                down: 0,
                left: 4,
                right: 8,
                arena:true
            }
        };


        this._repel = [ 
            {
                active: false,
                count: 0
            }
        ];

        
let quantity = 0;
        

        this._items = [
            { key: 'potion', name: 'Potion', quantity: 10, description: 'Heals 40 HP.' },
            { key: 'pokeball', name: 'Pokeball', quantity: 10, description: 'Catches wild Pokémon.' },
            { key: 'revive', name: 'Revive', quantity: 5, description: 'Revives a fainted Pokémon.' },
            { key: 'food', name: 'Food', quantity: 10, description: 'Heals 20 HP.' },
            { key: 'antidot', name: 'Antidot', quantity: 0, description: 'Cures poison.' },
            { key: 'burnheal', name: 'Burnheal', quantity: 0, description: 'Cures burn.' },
            { key: 'superpotion', name: 'Superpotion', quantity: 0, description: 'Heals 50 HP.' },
            { key: 'hyperpotion', name: 'Hyperpotion', quantity: 0, description: 'Heals 200 HP.' },
            { key: 'maxpp', name: 'Maxpp', quantity: 2, description: 'Restores all PP.' },
            { key: 'repel', name: 'Repel', quantity: 5, description: 'Repels wild Pokémon for 100 steps.' },
            { key: 'escaperope', name: 'Escaperope', quantity: 5, description: 'Escapes from caves or dungeons.' },
            { key: 'rarecandy', name: 'Rarecandy', quantity: 0, description: 'Increases a Pokémon\'s level by 1.' },
            { key: 'greenorb', name: 'Greenorb', quantity: 0, description: 'A mysterious green orb.' },
            { key: 'redorb', name: 'Redorb', quantity: 0, description: 'A mysterious red orb.' },
            { key: 'purpleorb', name: 'Purpleorb', quantity: 0, description: 'A mysterious purple orb.' },
            { key: 'orangeorb', name: 'Orangeorb', quantity: 0, description: 'A mysterious orange orb.' },
            { key: 'whiteorb', name: 'Whiteorb', quantity: 0, description: 'A mysterious white orb.' },
            { key: 'blackorb', name: 'Blackorb', quantity: 0, description: 'A mysterious black orb.' },
            { key: 'bicycle', name: 'Running Shoes', quantity: 0, description: 'A fast mode of transportation.' },
            { key: 'fishingrod', name: 'Fishingrod', quantity: 0, description: 'Used to catch water Pokémon.' },
            { key: 'eye', name: 'Eye', quantity: 0, description: 'A mysterious eye.' },
        
            { key: 'normalberry', name: 'Normal Berry', quantity: 5, description: 'Heals 40 HP.' },
            { key: 'fireberry', name: 'Fire Berry', quantity: 5, description: 'Heals 60 HP for Fire-type Pokémon.' },
            { key: 'waterberry', name: 'Water Berry', quantity: 5, description: 'Heals 60 HP for Water-type Pokémon.' },
            { key: 'grassberry', name: 'Grass Berry', quantity: 5, description: 'Heals 60 HP for Grass-type Pokémon.' },
            { key: 'electricberry', name: 'Electric Berry', quantity: 5, description: 'Heals 60 HP for Electric-type Pokémon.' },
            { key: 'iceberry', name: 'Ice Berry', quantity: 5, description: 'Heals 60 HP for Ice-type Pokémon.' },
            // { key: 'fightberry', name: 'Fightberry', quantity: 0, description: 'Heals 60 HP for Fighting-type Pokémon.' },
            { key: 'poisonberry', name: 'Poison Berry', quantity: 5, description: 'Heals 60 HP for Poison-type Pokémon.' },
            // { key: 'groundberry', name: 'Groundberry', quantity: 0, description: 'Heals 60 HP for Ground-type Pokémon.' },
            // { key: 'flightberry', name: 'Flightberry', quantity: 0, description: 'Heals 60 HP for Flying-type Pokémon.' },
            { key: 'psychicberry', name: 'Psychic Berry', quantity: 5, description: 'Heals 60 HP for Psychic-type Pokémon.' },
            { key: 'bugberry', name: 'Bug Berry', quantity: 5, description: 'Heals 60 HP for Bug-type Pokémon.' },
            { key: 'rockberry', name: 'Rock Berry', quantity: 5, description: 'Heals 60 HP for Rock-type Pokémon.' },
            { key: 'ghostberry', name: 'Ghost Berry', quantity: 5, description: 'Heals 60 HP for Ghost-type Pokémon.' },
            // { key: 'dragonberry', name: 'Dragonberry', quantity: 0, description: 'Heals 60 HP for Dragon-type Pokémon.' },
            { key: 'darkberry', name: 'Dark Berry', quantity: 5, description: 'Heals 60 HP for Dark-type Pokémon.' },
            // { key: 'steelberry', name: 'Steelberry', quantity: 0, description: 'Heals 60 HP for Steel-type Pokémon.' },
            // { key: 'fairyberry', name: 'Fairyberry', quantity: 0, description: 'Heals 60 HP for Fairy-type Pokémon.' },
            { key: 'rockberry', name: 'Rock Berry', quantity: 5, description: 'Heals 60 HP for Rock-type Pokémon.' },
            { key: 'darkberry', name: 'Dark Berry', quantity: 5, description: 'Heals 60 HP for Dark-type Pokémon.' },
            { key: 'ghostberry', name: 'Ghost Berry', quantity: 5, description: 'Heals 60 HP for Dark-type Pokémon.' },
            { key: 'darkberry', name: 'Dark Berry', quantity: 5, description: 'Heals 60 HP for Dark-type Pokémon.' },
        ];
        
        
        this._itemData = [
            { key: 'potion', name: 'Potion', quantity: 10, description: 'Heals 40 HP.', type: 'healing', effect: { healAmount: 40 } },
            { key: 'pokeball', name: 'Pokeball', quantity: 10, description: 'Catches wild Pokémon.', type: 'battle', effect: { catchRate: 1 } },
            { key: 'revive', name: 'Revive', quantity: 5, description: 'Revives a fainted Pokémon.', type: 'healing', effect: { reviveAmount: 0.5 } },
            { key: 'food', name: 'Food', quantity: 10, description: 'Heals 20 HP.', type: 'healing', effect: { healAmount: 20 } },
            { key: 'antidot', name: 'Antidot', quantity: 0, description: 'Cures poison.', type: 'status', effect: { cureStatus: 'Poison' } },
            { key: 'burnheal', name: 'Burnheal', quantity: 0, description: 'Cures burn.', type: 'status', effect: { cureStatus: 'Burn' } },
            { key: 'superpotion', name: 'Superpotion', quantity: 0, description: 'Heals 50 HP.', type: 'healing', effect: { healAmount: 50 } },
            { key: 'hyperpotion', name: 'Hyperpotion', quantity: 0, description: 'Heals 200 HP.', type: 'healing', effect: { healAmount: 200 } },
            { key: 'maxpp', name: 'Maxpp', quantity: 2, description: 'Restores all PP.', type: 'status', effect: { restorePP: 'all' } },
            { key: 'repel', name: 'Repel', quantity: 5, description: 'Repels wild Pokémon for 100 steps.', type: 'field', effect: { duration: 100 } },
            { key: 'escaperope', name: 'Escaperope', quantity: 5, description: 'Escapes from caves or dungeons.', type: 'field', effect: {} },
            { key: 'rarecandy', name: 'Rarecandy', quantity: 0, description: 'Increases a Pokémon\'s level by 1.', type: 'rarecandy', effect: { levelIncrease: 1 } },
            { key: 'greenorb', name: 'Greenorb', quantity: 0, description: 'A mysterious green orb.', type: 'key', effect: {} },
            { key: 'redorb', name: 'Redorb', quantity: 0, description: 'A mysterious red orb.', type: 'key', effect: {} },
            { key: 'purpleorb', name: 'Purpleorb', quantity: 0, description: 'A mysterious purple orb.', type: 'key', effect: {} },
            { key: 'orangeorb', name: 'Orangeorb', quantity: 0, description: 'A mysterious orange orb.', type: 'key', effect: {} },
            { key: 'whiteorb', name: 'Whiteorb', quantity: 0, description: 'A mysterious white orb.', type: 'key', effect: {} },
            { key: 'blackorb', name: 'Blackorb', quantity: 0, description: 'A mysterious black orb.', type: 'key', effect: {} },
            { key: 'bicycle', name: 'Running Shoes', quantity: 0, description: 'A fast mode of transportation.', type: 'key', effect: {} },
            { key: 'fishingrod', name: 'Fishingrod', quantity: 0, description: 'Used to catch water Pokémon.', type: 'key', effect: {} },
            { key: 'eye', name: 'Eye', quantity: 0, description: 'A mysterious eye.', type: 'key', effect: {} },
            { key: 'normalberry', name: 'Normal Berry', quantity: 5, description: 'Heals 40 HP.', type: 'healing', effect: { healAmount: 40, pokemonType: 'Normal' } },
            { key: 'fireberry', name: 'Fire Berry', quantity: 5, description: 'Heals 60 HP for Fire-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Fire' } },
            { key: 'waterberry', name: 'Water Berry', quantity: 5, description: 'Heals 60 HP for Water-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Water' } },
            { key: 'grassberry', name: 'Grass Berry', quantity: 5, description: 'Heals 60 HP for Grass-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Grass' } },
            { key: 'electricberry', name: 'Electric Berry', quantity: 5, description: 'Heals 60 HP for Electric-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Electric' } },
            { key: 'iceberry', name: 'Ice Berry', quantity: 5, description: 'Heals 60 HP for Ice-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Ice' } },
            { key: 'poisonberry', name: 'Poison Berry', quantity: 5, description: 'Heals 60 HP for Poison-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Poison' } },
            { key: 'psychicberry', name: 'Psychic Berry', quantity: 5, description: 'Heals 60 HP for Psychic-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Psychic' } },
            { key: 'bugberry', name: 'Bug Berry', quantity: 5, description: 'Heals 60 HP for Bug-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Bug' } },
            { key: 'rockberry', name: 'Rock Berry', quantity: 5, description: 'Heals 60 HP for Rock-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Rock' } },
            { key: 'ghostberry', name: 'Ghost Berry', quantity: 5, description: 'Heals 60 HP for Ghost-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Ghost' } },
            { key: 'darkberry', name: 'Dark Berry', quantity: 5, description: 'Heals 60 HP for Dark-type Pokémon.', type: 'healing', effect: { healAmount: 60, pokemonType: 'Dark' } }
        ];
        






        this._chests = [];


        let count = 2;
       

        this._moves = {
            Tackle: { type: 'Normal', damage: 10, level: 3, speed: 10, maxPP: 50, key: 'Tackle', name: 'Tackle' },
            Agility: { type: 'Normal', damage: 15, level: 5, speed: 30, maxPP: 40, key: 'Agility', name: 'Agility' },
            DoubleAttack: { type: 'Normal', damage: 10, level: 7, speed: 20, maxPP: 20, key: 'DoubleAttack', name: 'Double Attack' },
            Rain: { type: 'Water', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'Rain', name: 'Rain' },
            RainBeam: { type: 'Water', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'Rain', name: 'Rain Beam' },
            QuickAttack: { type: 'Normal', damage: 20, level: 5, speed: 30, maxPP: 40, key: 'QuickAttack', name: 'Quick Attack' },
            RazorLeaf: { type: 'Grass', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'RazorLeaf', name: 'Razor Leaf' },
            RazorLeafBeam: { type: 'Grass', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'RazorLeaf', name: 'Razor Leaf Beam' },
            CanonBall: { type: 'Normal', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'CanonBall', name: 'Canon Ball' },
            CanonBallBeam: { type: 'Normal', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'CanonBall', name: 'Canon Ball Beam' },
            Fireball: { type: 'Fire', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'Fireball', name: 'Fireball', status: 'Burn' },
            FireballBeam: { type: 'Fire', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'Fireball', name: 'Fireball Beam', status: 'Burn'  },
            EnergyBall: { type: 'Ghost', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'EnergyBall', name: 'Energy Ball' , status: 'Paralyze' },
            EnergyBallBeam: { type: 'Ghost', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'EnergyBall', name: 'Energy Ball Beam' , status: 'Paralyze' },
            Thunder: { type: 'Electric', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'Thunder', name: 'Thunder' , status: 'Paralyze' },
            ThunderBeam: { type: 'Electric', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'Thunder', name: 'Thunder Beam', status: 'Paralyze'  },
            Rock: { type: 'Rock', damage: 30, level: 10, speed: 20, maxPP: 20, key: 'Rock', name: 'Rock' },
            RockBeam: { type: 'Rock', damage: 20, level: 20, speed: 30, maxPP: 20, key: 'Rock', name: 'Rock Beam' },
            Mountain: { type: 'Rock', damage: 50, level: 15, speed: 10, maxPP: 5, key: 'Mountain', name: 'Mountain' },
            Poison: { type: 'Poison', damage: 20, level: 13, speed: 20, maxPP: 20, key: 'Poison', name: 'Poison' , status: 'Poison'},
            Storm: { type: 'Water', damage: 40, level: 15, speed: 20, maxPP: 15, key: 'Storm', name: 'Storm' },
            Plasma: { type: 'Ghost', damage: 50, level: 15, speed: 10, maxPP: 5, key: 'Plasma', name: 'Plasma' },
            Darkness: { type: 'Dark', damage: 50, level: 15, speed: 10, maxPP: 5, key: 'Darkness', name: 'Darkness' },
            Hydra: { type: 'Water', damage: 70, level: 40, speed: 10, maxPP: 5, key: 'Hydra', name: 'Hydra' },
            Tornado: { type: 'Normal', damage: 40, level: 15, speed: 40, maxPP: 10, key: 'Tornado', name: 'Tornado' },
            Fireblast: { type: 'Fire', damage: 50, level: 15, speed: 10, maxPP: 5, key: 'Fireblast', name: 'Fireblast', status: 'Burn'  },
            Cut: { type: 'Normal', damage: 50, level: 25, speed: 30, maxPP: 20, key: 'Cut', name: 'Cut' },
            Sludge: {type: 'Poison', damage: 20, level: 15, speed: 30, maxPP: 10, key: 'Sludge', name: 'Sludge', status: 'Poison'},
            Constrict: {type: 'Grass', damage: 20, level: 15, speed: 30, maxPP: 20, key: 'Constrict', name: 'Constrict'},
            Stampede: {type: 'Normal', damage: 70, level: 40, speed: 30, maxPP: 10, key: 'Stampede', name: 'Stampede'},
            Scorch: {type: 'Fire', damage: 70, level: 40, speed: 30, maxPP: 10, key: 'Scorch', name: 'Scorch', status: 'Burn' },
            Nightmare: {type: 'Dark', damage: 70, level: 40, speed: 30, maxPP: 10, key: 'Nightmare', name: 'Nightmare'},
            Haunt: {type: 'Ghost', damage: 70, level: 40, speed: 30, maxPP: 10, key: 'Haunt', name: 'Haunt'},
            Shock: {type: 'Electric', damage: 30, level: 15, speed: 30, maxPP: 30, key: 'Shock', name: 'Shock', status: 'Paralyze' },
            Electrify: {type: 'Electric', damage: 50, level: 40, speed: 50, maxPP: 30, key: 'Electrify', name: 'Electrify', status: 'Paralyze' },
            Earthquake: {type: 'Rock', damage: 70, level: 40, speed: 30, maxPP: 30, key: 'Earthquake', name: 'Earthquake'},
            LeafBlade: {type: 'Grass', damage: 70, level: 40, speed: 30, maxPP: 10, key: 'LeafBlade', name: 'Leaf Blade'},
            AcidBlast: {type: 'Poison', damage: 40, level: 40, speed: 30, maxPP: 10, key: 'AcidBlast', name: 'Acid Blast', status: 'Poison'},
            PoisonBeam: {type: 'Poison', damage: 20, level: 20, speed: 30, maxPP: 10, key: 'Poison', name: 'Poison Beam', status: 'Poison'},
            Harden: {type: 'Normal', damage: 0, level: 13, speed: 10, maxPP: 40, key: 'Harden', name: 'Harden', buff: {stat: 'defense', amount: 10}},
            Paralyze: {type: 'Electric', damage: 0, level: 13, speed: 10, maxPP: 40, key: 'Paralyze', name: 'Paralyze', status: 'Paralyze' },
            SpeedUp: {type: 'Normal', damage: 0, level: 2, speed: 10, maxPP: 40, key: 'SpeedUp', name: 'Speed Up', buff: {stat: 'speed', amount: 10}},
            Burn: {type: 'Fire', damage: 5, level: 13, speed: 30, maxPP: 20, key: 'Burn', name: 'Burn', status: 'Burn' },
            Sting: {type: 'Poison', damage: 5, level: 13, speed: 30, maxPP: 30, key: 'Sting', name: 'Sting'},
            StringShot: {type: 'Bug', damage: 0, level: 13, speed: 30, maxPP: 30, key: 'StringShot', name: 'String Shot', debuff: {stat: 'speed', amount: 20}},
            Confusion: {type: 'Dark', damage: 0, level: 13, speed: 30, maxPP: 10, key: 'Confusion', name: 'Confusion', status: 'Confusion'},
            Hypnosis: {type: 'Ghost', damage: 0, level: 16, speed: 30, maxPP: 10, key: 'Hypnosis', name: 'Hypnosis', status: 'Hypnosis'},
            SandAttack: {type: 'Normal', damage: 0, level: 2, speed: 30, maxPP: 10, key: 'SandAttack', name: 'Sand Attack', debuff: {stat: 'accuracy', amount: 10}},
            ShadowAttack: {type: 'Dark', damage: 100, level: 50, speed: 30, maxPP: 10, key: 'ShadowAttack', name: 'Shadow Attack'},
            MirrorImage: {type: 'Normal', damage: 0, level: 30, speed: 30, maxPP: 10, key: 'MirrorImage', name: 'Mirror Image'},
            StealthAttack: {type: 'Normal', damage: 70, level: 30, speed: 30, maxPP: 10, key: 'StealthAttack', name: 'Stealth Attack'},
            Slash: {type: 'Normal', damage: 40, level: 30, speed: 30, maxPP: 10, key: 'Slash', name: 'Slash'},
            Ray: {type: 'Normal', damage: 40, level: 30, speed: 30, maxPP: 10, key: 'Ray', name: 'Ray'},
            Siphon: {type: 'Poison', damage: 40, heal: 40, level: 30, speed: 30, maxPP: 10, key: 'Siphon', name: 'Siphon'},

            // Add more moves as needed
        };
        
        //Mountain (rock), poison (poison), water (water), plasma (ghost), darkness (dark), hydra (water), tornado (normal)
        

        const pokemonMovesets = {
            Axolot: ['Tackle', 'Agility', 'DoubleAttack', 'Cut', 'Rain', 'RainBeam', 'Storm', 'Hydra'], //water
            Bamboo: ['Tackle', 'Agility', 'DoubleAttack', 'Cut','RazorLeaf', 'RazorLeafBeam', 'LeafBlade', 'Constrict'], //grass
            Beast: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack', 'Cut','CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], //normal
            Butterfly: ['Tackle', 'Agility', 'DoubleAttack', 'StringShot', 'Cut','RazorLeaf', 'RazorLeafBeam', 'LeafBlade', 'Constrict'], //Bug
            Cyclope: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack', 'Cut','CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], //Normal
            Dragon: ['Tackle', 'Agility', 'DoubleAttack', 'Burn', 'Cut','Fireball', 'FireballBeam', 'Fireblast', 'Scorch'], //Fire
            Eye: ['Tackle', 'Agility', 'DoubleAttack', 'Confusion', 'Cut','EnergyBall', 'EnergyBallBeam', 'Darkness', 'Nightmare'], //Dark
            Spirit: ['Tackle', 'Agility', 'DoubleAttack', 'Hypnosis', 'Cut','EnergyBall', 'EnergyBallBeam', 'Plasma', 'Haunt'], //Ghost
            Fish: ['Tackle', 'Agility', 'DoubleAttack', 'Cut','Rain', 'RainBeam', 'Storm', 'Hydra'], //Water
            Flame: ['Tackle', 'Agility', 'DoubleAttack','Burn', 'Cut','Fireball', 'FireballBeam', 'Fireblast', 'Scorch'], //Fire
            Skull: ['Tackle', 'Agility', 'DoubleAttack', 'Hypnosis', 'Burn', 'Cut', 'Fireball', 'FireballBeam',  'Darkness', 'Haunt'], //Ghost
            Mouse: ['SpeedUp', 'Tackle', 'Agility', 'DoubleAttack', 'Paralyze', 'Cut','Shock', 'ThunderBeam', 'Electrify', 'Thunder'], //Electric
            Snake: ['Tackle', 'Agility', 'DoubleAttack', 'Sting', 'Cut','Poison', 'PoisonBeam', 'AcidBlast', 'Sludge'], //Poison
            Larva: ['Tackle', 'Agility', 'DoubleAttack', 'Cut','RazorLeaf', 'RazorLeafBeam', 'LeafBlade', 'Constrict'], //Grass
            Lizard: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack', 'Cut','CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], //Normal
            Mole: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack','Cut', 'CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], //Normal
            Mollusc: ['Tackle', 'Agility', 'DoubleAttack','Cut', 'Rain', 'RainBeam', 'Storm', 'Hydra'], //Water
            Mushroom: ['Tackle', 'Agility', 'DoubleAttack', 'Sting', 'Cut', 'Poison', 'PoisonBeam', 'AcidBlast', 'Sludge'], //Poison
            Owl: ['Tackle', 'Agility', 'DoubleAttack','Hypnosis', 'Cut', 'CanonBall', 'CanonBallBeam', 'Plasma', 'Haunt'], // Ghost
            Octopus: ['Tackle', 'Agility', 'DoubleAttack', 'Cut','Rain', 'RainBeam', 'Storm', 'Hydra'], //Water
            Racoon: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack','Cut', 'CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], //Normal
            Dino: ['Tackle', 'Agility', 'DoubleAttack', 'Harden' ,'Cut', 'Rock', 'RockBeam', 'Mountain', 'Earthquake'], //Rock
            Spider: ['Tackle', 'Agility', 'DoubleAttack', 'StringShot', 'Cut', 'RazorLeaf', 'RazorLeafBeam', 'LeafBlade', 'Constrict'], // Bug
            Kappa: ['Tackle', 'Agility', 'DoubleAttack', 'Cut', 'Rain', 'RainBeam', 'Storm', 'Hydra'], // Water
            Heart: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack', 'Cut', 'CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], // Normal
            Lantern: ['Tackle', 'Agility', 'DoubleAttack','Hypnosis',  'Cut', 'EnergyBall', 'EnergyBallBeam', 'Plasma', 'Haunt'], // Ghost
            TRex: ['Tackle', 'Agility', 'DoubleAttack', 'Harden', 'Cut', 'Rock', 'RockBeam', 'Mountain', 'Earthquake'], //Rock
            Bat: ['Tackle', 'Agility', 'DoubleAttack', 'Confusion', 'Cut', 'EnergyBall', 'EnergyBallBeam', 'Darkness', 'Nightmare'], //Dark
            Panda: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack', 'Cut', 'CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'], //Normal
            Bear: ['SandAttack', 'Tackle', 'Agility', 'DoubleAttack', 'Cut', 'CanonBall', 'CanonBallBeam', 'Stomp', 'Stampede'] //Normal
        
            
            
            // Add more Pokémon movesets as needed
        };
        

        // Function to generate moves for a Pokémon
        const generatePokemonMoves = (pokemonName) => {
            const moveset = pokemonMovesets[pokemonName];
            if (!moveset) return [];
            
            return moveset.map(moveName => {
             

                const moveData = this._moves[moveName];
                if (!moveData) return null;

                // Check if the move name contains "Beam" to determine if it's a special move
                const isSpecialMove = moveName.includes('Beam');

                // Create the move object
                const move = {
                    name: moveData.name,
                    key: moveData.key,
                    type: moveData.type,
                    damage: isSpecialMove ? moveData.damage : moveData.damage || 0, // Assuming default damage value if not available
                    level: moveData.level, 
                    speed: moveData.speed,
                    currentPP: moveData.maxPP,
                    maxPP: moveData.maxPP,
                    count: isSpecialMove ? count : undefined, // Add count only for special moves

                    // Include buffs and debuffs if they exist in moveData
                    heal: moveData.heal || null,
                    buff: moveData.buff || null,
                    debuff: moveData.debuff || null,
                    status: moveData.status || null,
                };

                return move;
            }).flat().filter(move => move !== null);
        };

        // Generate moves for each Pokémon
        this._pokemonMoves = {};
        Object.keys(pokemonMovesets).forEach(pokemonName => {
            this._pokemonMoves[pokemonName] = generatePokemonMoves(pokemonName);
        });

      


        this.createPokemonToRouteMap();

        this._backup = null;

        
    }

    createBackup()
    {
        this._backup = JSON.parse(JSON.stringify(this.toSerializableObject()));

    }
    get itemData()
    {
        return this._itemData;
    }
    set itemData(value)
    {
        this._itemData = value;
    }

    //DialogueBoxManager
    get backup()
    {
        return this._backup;
    }  


    //DialogueBoxManager
    get isNewGame()
    {
        return this._isNewGame;
    }  

    set isNewGame(value)
    {
        this._isNewGame = value;
    }

    
    //DialogueBoxManager
    get progress()
    {
        return this._progress;
    }  

    set progress(value)
    {
        this._progress = value;
    }



      //DialogueBoxManager
      get isRunning()
      {
          return this._isRunning;
      }  
  
      set isRunning(value)
      {
          this._isRunning = value;
      }
  
  

     //DialogueBoxManager
     get isRebooting()
     {
         return this._isRebooting;
     }  
 
     set isRebooting(value)
     {
         this._isRebooting = value;
     }


     get monsterManager()
     {
         return this._monsterManager;
     }  
 
     set monsterManager(value)
     {
         this._monsterManager = value;
     }

     
     get itemManager()
     {
         return this._itemManager;
     }  
 
     set itemManager(value)
     {
         this._itemManager = value;
     }


     get controlPanelOpen()
     {
         return this._controlPanelOpen;
     }  
 
     set controlPanelOpen(value)
     {
         this._controlPanelOpen = value;
     }

    //DialogueBoxManager
    get dialogueBoxManager()
    {
        return this._dialogueBoxManager;
    }  

    set dialogueBoxManager(value)
    {
        this._dialogueBoxManager = value;
    }
    // Getter for the events
    get events() {
        return this._events;
    }
    get inputManager()
    {
        return this._inputManager;
    }
    
    get gameInstance()
    {
        return this._gameInstance;
    }  
    get characterList()
    {
        return this._characterList;
    }  
    
    set gameInstance(value)
    {
        this._gameInstance = value;
    }
    get controlGameInstance()
    {
        return this._controlGameInstance;
    }  
    
    set controlGameInstance(value)
    {
        this._controlGameInstance = value;
    }

    get controlPanelGameInstance()
    {
        return this._controlPanelGameInstance;
    }  
    
    set controlPanelGameInstance(value)
    {
        this._controlPanelGameInstance = value;
    }
   
    // Set the game instances after they are initialized
    setGameInstances(game, controlGame, controlPanelGame) {
        this.gameInstance = game;
        this.controlGameInstance = controlGame;
        this.controlPanelGameInstance = controlPanelGame;
     
    }

 // Access a scene in the main game instance
    getScene(sceneName) {
        if (this.gameInstance) {
            return this.gameInstance.scene.get(sceneName);
        }
        return null;
    }

      // Access a scene in the control game instance
      getControlScene(sceneName) {
        if (this.controlGameInstance) {
            return this.controlGameInstance.scene.get(sceneName);
        }
        return null;
    }

    get gamepad()
    {
        return this._gamepad;
    }  
    
    set gamepad(value)
    {
        this._gamepad = value;
    }

  

    initGamepadSupport(game) {
        console.log('Initializing gamepad support');
        console.log('Phaser version:', Phaser.VERSION);
        console.log('Game object:', game);
        console.log('Game input:', game.input);
        console.log('Gamepad API supported by browser:', 'getGamepads' in navigator);
        
        if (game && game.input) {
            console.log('Input manager properties:', Object.keys(game.input));
            console.log('Gamepad property:', game.input.gamepad);
            
            if (game.input.gamepad) {
                console.log('Gamepad support available in Phaser');
                
                game.input.gamepad.on('connected', (pad) => {
                    console.log('Gamepad connected event fired');
                    console.log('Connected gamepad:', pad);
                    this.handleGamepadConnected(pad);
                });
                
                game.input.gamepad.on('disconnected', (pad) => {
                    console.log('Gamepad disconnected event fired');
                    console.log('Disconnected gamepad:', pad);
                    this.handleGamepadDisconnected(pad);
                });
    
                // Initial check for already connected gamepads
                console.log('Checking for already connected gamepads...');
                console.log('Total gamepads according to Phaser:', game.input.gamepad.total);
                
                const nativeGamepads = navigator.getGamepads();
                console.log('Gamepads detected by browser:', nativeGamepads);
    
                if (game.input.gamepad.total > 0) {
                    console.log('Gamepad already connected, total:', game.input.gamepad.total);
                    const firstPad = game.input.gamepad.getPad(0);
                    console.log('First gamepad details:', firstPad);
                    this.handleGamepadConnected(firstPad);
                } else {
                    console.log('No gamepads currently connected according to Phaser');
                }
    
                // Set up a recurring check for gamepads
                setInterval(() => {
                    const currentGamepads = navigator.getGamepads();
                    console.log('Current gamepads detected by browser:', currentGamepads);
                }, 5000);  // Check every 5 seconds
    
            } else {
                console.warn('Gamepad property not found on input manager');
                console.log('Game config:', game.config);
            }
        } else {
            console.warn('Game or input manager not available');
        }
    
        // Log the current state of connected gamepads
        console.log('Current state of gamepads:', navigator.getGamepads());
    }

    handleGamepadConnected(pad) {
        console.log('Gamepad connected:', pad.id);
        this.gamepad = pad;
        this.eventManager.emit('gamepadConnected', pad);
    }

    handleGamepadDisconnected(pad) {
        console.log('Gamepad disconnected:', pad.id);
        this.gamepad = null;
        this.eventManager.emit('gamepadDisconnected', pad);
    }



    get currentPokemonData()
    {
        return this._currentPokemonData;
    }  
    
    set currentPokemonData(value)
    {
        this._currentPokemonData = value;
    }

    get eventManager()
    {
        return this._eventManager;
    }  
    
    set eventManager(value)
    {
        this._eventManager = value;
    }

    get sceneManager() {
        return this._sceneManager;
    }

    set sceneManager(manager) {
        this._sceneManager = manager;
    }


    get buttonConfigs() {
        return this._buttonConfigs;
    }

    set buttonConfigs(value) {
        this._buttonConfigs = value;
    }



    // initSceneManager(game) {

    //     this.inputManager.init(game);

    //     this.sceneManager = new SceneManager(game, this.inputManager); // Pass the input manager
    //     // this.sceneManager.init(); // Initialize the SceneManager
    // }


    // In your initialization code
initSceneManager(game, controlGame, controlPanelGame) {
    this.inputManager.init(game);
    // this.inputManager.init(controlGame); // Initialize input manager for both games

    this.sceneManager = new SceneManager(game, controlGame, controlPanelGame, this.inputManager); // Pass both game instances
    // this.sceneManager.init(); // Initialize the SceneManager
}


    get routes()
    {
        return this._routes;
    }

    set routes(value)
    {
        this._routes = value;
    }
    
    /*


    createPokemonToRouteMap() {
        this._pokemonToRoute = {};
        for (const [routeName, pokemonList] of Object.entries(this._routes)) {
            pokemonList.forEach(pokemonName => {
                if (!this._pokemonToRoute[pokemonName]) {
                    this._pokemonToRoute[pokemonName] = [];
                }
                this._pokemonToRoute[pokemonName].push(routeName);
            });
        }
    }
    
    */
    
    
    createPokemonToRouteMap() {
    this._pokemonToRoute = {};
    
    for (const [routeName, routeData] of Object.entries(this._routes)) {
        const pokemonList = routeData.pokemon; // Access the pokemon array from the routeData object
        
        pokemonList.forEach(pokemonName => {
            if (!this._pokemonToRoute[pokemonName]) {
                this._pokemonToRoute[pokemonName] = [];
            }
            this._pokemonToRoute[pokemonName].push(routeName);
        });
    }
}

getPokemonRoute(pokemonName) {
    return this._pokemonToRoute[pokemonName] || [];
}

    getPokemonRoute(pokemonName) {
        return this._pokemonToRoute[pokemonName] || [];
    }


    get moves()
    {
        return this._moves;
    }

    get npcIdle()
    {
        return this._npcIdle;
    }

    set npcIdle(value)
    {
        this._npcIdle = value;
    }


    get fishing()
    {
        return this._fishing;
    }

    set fishing(value)
    {
        this._fishing = value;
    }



    get difficulty()
    {
        return this._difficulty;
    }

    set difficulty(value)
    {
        this._difficulty = value;
    }


    get chests()
    {
        return this._chests;
    }

    set chests(value)
    {
        this._chests = value;
    }
    get repel()
    {
        return this._repel;
    }

    set repel(value)
    {
        this._repel = value;
    }
    get typeEffectiveness()
    {
        return this._typeEffectiveness;
    }

    set typeEffectiveness(value)
    {
        this._typeEffectiveness = value;
    }

    get pokemonTypeColor()
    {
        return this._pokemonTypeColor;
    }

    set pokemonTypeColor(value)
    {
        this._pokemonTypeColor = value;
    }
    get pokemonTypes()
    {
        return this._pokemonTypes;
    }

    set pokemonTypes(value)
    {
        this._pokemonTypes = value;
    }

    get pokemonMoves()
    {
        return this._pokemonMoves;
    }

    set pokemonMoves(value)
    {
        this._pokemonMoves = value;
    }


    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
    }


    get starterPokemon() {
        return this._starterPokemon;
    }

    set starterPokemon(value) {
        this._starterPokemon = value;
    }



    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }

    get pc() {
        return this._pc;
    }

    set pc(value) {
        this._pc = value;
    }

    get npc() {
        return this._npc;
    }

    set npc(value) {
        this._npc = value;
    }

    get characterPosition() {
        return this._characterPosition;
    }

    set characterPosition(newPosition) {
        this._characterPosition = newPosition;
    }

    set selectedCharacter(value) {
        return this._selectedCharacter = value;
    }
    get selectedCharacter() {
        return this._selectedCharacter;
    }


    set characterName(value) {
        return this._characterName = value;
    }
    get characterName() {
        return this._characterName;
    }
    get pokemonData() {
        return this._pokemonData;
    }

    get originalPokemonData() {
        return this._originalPokemonData;
    }
    set partyPokemonData(newArray) {
        return this._partyPokemonData = newArray;
    }
    get partyPokemonData() {
        return this._partyPokemonData;
    }

    // Setter method to update Pokémon data
    setPokemonData(newPokemonData) {
        this._pokemonData = newPokemonData;
    }

    // Setter method to update any variable of a specific Pokémon
    setPokemonVariable(pokemonKey, variableName, newValue) {
        const pokemonIndex = this._pokemonData.findIndex(pokemon => pokemon.key === pokemonKey);
        if (pokemonIndex !== -1) {
            this._pokemonData[pokemonIndex][variableName] = newValue;
        } else {
            console.error('Pokemon not found!');
        }
    }


deepCopy(value) {
    if (Array.isArray(value)) {
        return value.map(item => this.deepCopy(item));
    } else if (value && typeof value === 'object') {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = this.deepCopy(value[key]);
            return acc;
        }, {});
    }
    return value;
}



toSerializableObject() {
    // Only include properties you want to save
    const serialized = {
        //npcIdle: this.npcIdle,
        fishing: this.fishing,
        difficulty: this.difficulty,
        chests: this.chests,
        repel: this.repel,
        player: this.player,
        // items: this.items,
        pc: this.pc,
        npc: this.npc,
        characterPosition: this.characterPosition,
        partyPokemonData: this.partyPokemonData,
        //routes: this.routes,
        buttonConfigs: this.buttonConfigs,
        isNewGame: this.isNewGame,
        selectedCharacter: this.selectedCharacter,
        characterName: this.characterName,
        progress: this.progress,
        isRunning: this.isRunning,
        // monsterManager: this.monsterManager.toSerializableObject()  // Save monster manager
        monsterManager: this.monsterManager ? this.monsterManager.toSerializableObject() : null,
        itemManager: this.itemManager ? this.itemManager.toSerializableObject() : null // Add this line

    };
    // console.log("Globals: Serialized object:", serialized);

    return serialized;
}


fromSerializableObject(data) {
    // Restore the properties from the serialized data
    this.fishing = data.fishing;
    this.difficulty = data.difficulty;
    this.chests = data.chests;
    this.repel = data.repel;
    this.player = data.player;
    // this.items = data.items;
    this.pc = data.pc;
    this.npc = data.npc;
    this.characterPosition = data.characterPosition;
    this.partyPokemonData = data.partyPokemonData;
    this.buttonConfigs = data.buttonConfigs;
    this.isNewGame = data.isNewGame;
    this.selectedCharacter = data.selectedCharacter;
    this.characterName = data.characterName;
    this.progress = data.progress;
    this.isRunning = data.isRunning;

    // Restore the MonsterManager
    if (data.monsterManager) {
        this.monsterManager = new MonsterManager().fromSerializableObject(data.monsterManager);
        console.log('loading monster manager');
    } else {
        this.monsterManager = new MonsterManager(); // Fallback in case there's no data
        console.log('created new  monster manager');
    }
    // Adjust ItemManager deserialization to match MonsterManager
    // if (data.itemManager) {
    //     this.itemManager = new ItemManager().fromSerializableObject(data.itemManager);
    //     console.log('loading item manager');
    // } else {
    //     this.itemManager = new ItemManager();
    //     console.log('created new item manager');
    // }
    if (data.itemManager) {
        this.itemManager = ItemManager.fromSerializableObject(data.itemManager);
        console.log('Loading item manager');
    } else {
        this.itemManager = new ItemManager();
        this.itemManager.initializeItems();
        console.log('Created new item manager');
    }
}


}
