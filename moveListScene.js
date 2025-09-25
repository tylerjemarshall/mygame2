class MoveListScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MoveListScene' });
    }


    preload()
    {
        this.load.image('menubackground', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu4.png');
        this.load.image('menubackground2', 'images/NinjaAdventure/Ui/Theme/Theme1/pause_menu3.png');

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

    create() {
        const moveMenuWidth = 300;
        const moveMenuHeight = 300;
        const moveMenuX = 50;
        const moveMenuY = this.cameras.main.centerY - moveMenuHeight / 2;

        // Background
        this.pokedexBackground = this.add.image(0, 0, 'menubackground2').setOrigin(0, 0);
        this.pokedexBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Move List Container
        this.movesContainer = this.add.container(moveMenuX, moveMenuY);
        this.movesContainer.setSize(moveMenuWidth, moveMenuHeight);
        // Assuming moves are stored globally and you want a list of all available moves
        const moves = Object.values(globals.moves);  // Assuming globals.moves contains all move data

        // Add each move to the list with interaction
        moves.forEach((move, index) => {
            const button = this.createButton(140, index * 60 + 30, moveMenuWidth - 20, 50, move.name, () => this.displayMoveDetails(move));
            this.movesContainer.add(button);
        });

        // Create and add slider for moves list
        this.moveSlider = new Slider(this, this.movesContainer);

        // Create move details box
        this.createMoveDetailsBox();



        const cancelX = this.cameras.main.centerX - 50;
        const cancelY = this.cameras.main.height - 50;  // Bottom of the screen

        this.cancelButton = this.createButton(cancelX, cancelY, 120, 40, 'Cancel', () => {
            globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(true);
            globals.sceneManager.start('MapScene');

        });

     
        this.title = this.add.text(190, 80, 'Select a move to learn', { fontFamily: 'Arial', fontSize: '18px', fill: '#ffffff' });


    }

       // Move Details Box Creation
       createMoveDetailsBox() {
        const moveDetailsX = this.cameras.main.centerX + 70;
        const moveDetailsY = this.cameras.main.centerY - 100;
        const moveDetailsWidth = 200;
        const moveDetailsHeight = 150

        this.moveDetailsBox = this.add.container(moveDetailsX, moveDetailsY);
        this.moveDetailsBox.setSize(moveDetailsWidth, moveDetailsHeight);

        // Background for details
        this.detailsBackground = this.add.rectangle(
            moveDetailsWidth/2,  // Center of the details box horizontally
            moveDetailsHeight/2,   // Center of the details box vertically
            moveDetailsWidth,
            moveDetailsHeight,
            0x000000,
            0.5
        );

        this.moveDetailsBox.add(this.detailsBackground);

        // Add text to display move details
        const details = 'Select a move to see details'  // Example usage:
        
        const wrappedText = this.wrapText(details, 20);
        
        console.log(wrappedText);
        this.moveDetailsText = this.add.text(10, 10, wrappedText, { fontFamily: 'Arial', fontSize: '18px', fill: '#ffffff' });
        
        this.moveDetailsBox.add(this.moveDetailsText);

        // Add Learn button
        this.learnButton = this.createButton(140, 130, 100, 30, 'Learn Move', () => this.learnMove());
        this.moveDetailsBox.add(this.learnButton);
        this.learnButton.setVisible(false);  // Hide the learn button initially
    }

    // Display move details in the box
    displayMoveDetails(move) {

        const details = [
            `Name: ${move.name}`,
            `Type: ${move.type}`,
            `Damage: ${move.damage}`,
            `Speed: ${move.speed}`,
            `Level Learned: ${move.level}`
        ];

        // this.moveDetailsText.setText(`Name: ${move.name}\nType: ${move.type}\nDamage: ${move.damage}`);
        this.moveDetailsText.setText(details);

        this.learnButton.setVisible(true);  // Show the learn button when a move is selected
        this.selectedMove = move;  // Store selected move for learning
    }

   // Logic to learn the selected move
    learnMove(move) {
        // Stop the current scene (MoveListScene)
        // this.scene.stop('MoveListScene');
        
        // this.scene.launch('PartyScene', {
        //     originScene: this,
        //     selectedMove: this.selectedMove,  // assuming you have this data
        //     action: 'Learn'  // or 'useItem', depending on what action the player is taking
        // });
        globals.sceneManager.launch('PartyScene', {
                originScene: 'MoveListScene',
                selectedMove: this.selectedMove,  // assuming you have this data
                action: 'Learn'  // or 'useItem', depending on what action the player is taking
            });
    }

    // Create button helper method
    createButton(x, y, width, height, text, callback) {
        const button = this.add.image(0, 0, 'button_normal');
        button.setDisplaySize(width, height);

        const buttonText = this.add.text(0, 0, text, { fontSize: '12px', fill: '#000' });
        buttonText.setOrigin(0.5);

        button.setInteractive()
            .on('pointerover', () => button.setTexture('button_hover'))
            .on('pointerout', () => button.setTexture('button_normal'))
            .on('pointerdown', () => {
                button.setTexture('button_selected');
                callback();
            })
            .on('pointerup', () => button.setTexture('button_hover'));

        const container = this.add.container(x, y, [button, buttonText]);
        container.setSize(width, height);
        return container;
    }


    wrapText(text, maxLength) {
        let wrappedText = "";
        let currentIndex = 0;
    
        while (currentIndex < text.length) {
            // Find the position of the last space within the maxLength limit
            let nextBreak = currentIndex + maxLength;
            if (nextBreak >= text.length) {
                wrappedText += text.slice(currentIndex); // Add the remaining text
                break;
            }
            
            // Check for the last space within the next segment
            let spaceIndex = text.lastIndexOf(' ', nextBreak);
    
            // If there is no space, just break at maxLength
            if (spaceIndex === -1 || spaceIndex <= currentIndex) {
                wrappedText += text.slice(currentIndex, nextBreak) + "\n";
                currentIndex = nextBreak;
            } else {
                wrappedText += text.slice(currentIndex, spaceIndex) + "\n";
                currentIndex = spaceIndex + 1;
            }
        }
    
        return wrappedText;
    }
    
   
    

}