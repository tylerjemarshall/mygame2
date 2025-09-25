
class DialogueBox {
    constructor(scene, message, endCallbacks = [], timer = false, short = false, confirmationActions = null, color = '#000000', faceset = null) {

        this.scene = scene;
        this.isClosed = false;
        this.endCallbacks = Array.isArray(endCallbacks) ? endCallbacks : [endCallbacks]; // Ensure it's an array
        this.handleEvent = this.handleEvent.bind(this);
        this.dialogueBox = null;
        this.dialogueBoxContainer = null; // This will hold the container
        this.timer=timer;
        this.confirmationActions = confirmationActions; //added
        this.facesetkey = faceset;
        this.selecting = false;
        this.createDialogueBox(message, timer, short, color);
    
        

    }


    appendMessage(newMessage) {
        this.appendToDialogueBox(newMessage);
        return;
    }
    
    createDialogueBox(message, timer = false, short=false, color) {


        if (this.dialogueBox)
        {

   
            this.appendToDialogueBox(message);
            return;
        }
        // this.setKeyboardEnabled(false);
        this.locked=true;
        
       
        if (this.scene.scene.key === 'MapScene' && timer === false);
        {
            globals.gameInstance.scene.getScene('MapScene').setKeyboardEnabled(false);

        }
        
       
        this.kbEnabled = false;
        setTimeout(() => {
            // Your command here
            this.kbEnabled = true;
        }, 20); // 500 milliseconds delay
        this.locked2=false;
        
        const camera = this.scene.cameras.main;
        const zoom = camera.zoom;
        

        
        const cameraX = camera.scrollX;
        const cameraY = camera.scrollY;

        const centerX = camera.scrollX + camera.width / 2;
        const centerY = camera.scrollY + camera.height / 2;
    
        // const absoluteX = cameraX + 300;
        // const absoluteY = cameraY + 470;

        // Adjust positions based on zoom
        let absoluteX = (cameraX + 300) ; // Scale X position
        let absoluteY = (cameraY + 500) ; // Scale Y position
           
        if (zoom === 3)
        {
            absoluteX = (cameraX + 300) ; // Scale X position
            absoluteY = (cameraY + 470 - 140) ; // Scale Y position
        }
     
        
        this.dialogueBox = this.scene.add.image(0, 0, 'dialogBox');
        this.dialogueBox.scaleX = 1.9;
        this.dialogueBox.scaleY = 2;
        this.dialogueBox.setOrigin(0.5, 1);
        this.dialogueBox.setDepth(1);

        if (zoom === 3)
        {
            this.dialogueBox.scaleX = 0.6;
            this.dialogueBox.scaleY = 0.9;
        }
        if (short)
        {
            this.dialogueBox.scaleY = 1.2;
        }
    
        // Create text for displaying the message
        const textStyle = { fontFamily: 'Arial', fontSize: '36px', fill: color, wordWrap: { width: this.dialogueBox.width*2} };
        if (zoom === 3)
        {
            textStyle.fontSize = '12px';
        }
        this.text = this.scene.add.text(5, 0-this.dialogueBox.height/4, '', textStyle); //this.dialogueBox.height + 45
        this.text.setOrigin(0.5, 1);
        this.text.setDepth(1);

        // Now create a container to group the dialogueBox and the text
        this.dialogueBoxContainer = this.scene.add.container(absoluteX, absoluteY, [this.dialogueBox, this.text]);
        this.dialogueBoxContainer.setDepth(1);
    
    
        //determine lines//
    
            this.lines = [];
            this.lineLength = 50;
            this.linesPerPage = 2; // Number of lines to display per page
            this.totalLength = message.length;
            this.completeIterations = Math.floor(this.totalLength / this.lineLength) + 1;
            this.remainder = this.totalLength % this.lineLength;
            this.currentPage = 0;
            this.endString = null;
    
        
        if (this.facesetkey)
        {
            
            this.lineLength = 35;
            this.completeIterations = Math.floor(this.totalLength / this.lineLength) + 1;
            this.remainder = this.totalLength % this.lineLength;
            this.text.x +=20;



            this.faceset = this.scene.add.image(0 - 68, 0 - 27, this.facesetkey)
            .setOrigin(0.5, 0.5) // Adjust origin to position correctly
            .setDisplaySize(40, 40)
            .setDepth(2); // Resize the image as needed
            this.dialogueBoxContainer.add(this.faceset);

            

        }


    
            for (let i = 0; i < this.completeIterations; i++) {
                const start = i * this.lineLength;
                let end = start + this.lineLength;
    
                if (i === this.completeIterations - 1) {
                    end = start + this.remainder;
                }
    
                let endStringIndexEnd = end;
    
                // Find the nearest space to the end position
                while (end < this.totalLength && message.charAt(end) !== ' ' && message.charAt(end) !== '\n') {
                    end--;
                }
    
                let endStringIndexStart = end;
    
                let newString = '';
    
          
                if (this.endString) {
                    newString = this.endString + message.substring(start, end);
                    this.endString = message.substring(endStringIndexStart, endStringIndexEnd);
                    //newString = end + previousEndString of messageif  its not first iteration
                } else {
                    // endString
                    this.endString = message.substring(endStringIndexStart, endStringIndexEnd);
                    newString = message.substring(start, end);
                }
    
                if (newString !== '')
                {
                    this.lines.push(newString);
    
                }
                else
                {
                    this.completeIterations -=1;
                }
                // this.lines.push(newString);
            }
    
    
            if (timer)
        {
      
            this.text.setText(this.lines[this.currentPage]);
    

            // Apply word wrap
            this.text.setWordWrapWidth(180); // Adjust the width as needed
            // this.text.setWordWrapCallback(null, null);


            if (this.scene.scene.key === 'MapScene');
            {
          
                this.scene.scene.get('MapScene').setKeyboardEnabled(true);
            }
            this.locked = false;

            this.scene.time.delayedCall(1000, () => {
                this.cleanupDialogue(); 
            });

            return;
    
        }
    
    
    
        // Show the initial text
        this.updateText();


        this.dialogueBox.setInteractive();
        this.dialogueBox.on('pointerdown', this.handleEvent);
            
            
    

        return;
    }


    // Add a method to get children of the container
    getChildren() {
        return this.dialogueBoxContainer ? this.dialogueBoxContainer.list : [];
    }

     // Method to update the position of the dialogueBoxContainer
     updatePosition(x, y) {
        if (this.dialogueBoxContainer) {
            this.dialogueBoxContainer.setPosition(x, y);
        }
    }
    handleEvent(yes = true) {
   
        if (!this.kbEnabled || this.locked2 || !this.dialogueBox) {
      
            if (!this.dialogueBox) {
                this.removeEventListeners();
            }
            return;
        }
        this.kbEnabled = false; // Disable keyboard input
        this.locked = true;
    
        this.currentPage++;
    
    
        if (this.currentPage >= this.completeIterations) {
            if (this.confirmationActions) {
                this.kbEnabled = true; // Disable keyboard input
                this.locked = false;
                if (!this.selecting )
                {
            
                    this.showConfirmation();
                }
                else
                {   
             
                    if (yes) {
                        this.handleConfirmation(this.confirmationActions.yes); // Yes action
                    } else {
                        this.handleConfirmation(this.confirmationActions.no); // No action
                    }
                }
            
            } else {
                this.cleanupDialogue();
                this.executeEndCallbacks();
                this.reenableKeyboard();
            }
        } else {
            this.locked = true;
            this.updateText();
            this.scene.time.delayedCall(50, () => {
                this.kbEnabled = true;
         
                this.locked2 = false; // Reset locked after delay
            });
        }
    }

    
 
    updateText() {
        if (this.currentPage <= this.completeIterations) {
            // Get the current line/message
            const currentLine = this.lines[this.currentPage];
    
            // Check if the message exceeds half of the max line length
            if (currentLine.length > (this.lineLength / 2)) {
                // Split the message into two lines if it's too long
                this.text.setText(this.splitMessageIntoTwoLines(currentLine));
            } else {
                // Otherwise, display the message as is
                this.text.setText(currentLine);
            }
        }
    }
    
    showConfirmation() {
        this.selecting = true;
        const { yes, no } = this.confirmationActions;
        const yesNameText = yes.text || 'Yes';
        const noNameText = no.text || 'No';
    
        // Calculate positions for the buttons
        const buttonY = this.dialogueBox.y - this.dialogueBox.displayHeight  -30;
        const yesX = this.dialogueBox.x + this.dialogueBox.displayWidth / 2 - 25;
        const noX = this.dialogueBox.x + this.dialogueBox.displayWidth / 2 - 25;
    
        // Create button backgrounds using the same image as the dialogue box
        const yesButton = this.scene.add.image(yesX, buttonY, 'dialogBox')
            // .setScale(0.2) // Adjust scale as needed
            .setInteractive()
            .setOrigin(0.5, 0.5);
    
        const noButton = this.scene.add.image(noX, buttonY + 20, 'dialogBox')
            // .setScale(0.2) // Adjust scale as needed
            .setInteractive()
            .setOrigin(0.5, 0.5);


        const scaleX = 0.15;
        const scaleY = 0.3;
        yesButton.scaleX = scaleX;
        yesButton.scaleY = scaleY;
        noButton.scaleX = scaleX;
        noButton.scaleY = scaleY;
    
        // Create text for the buttons
        const buttonTextStyle = {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#000000',
            align: 'center'
        };
    
        const yesText = this.scene.add.text(yesButton.x, yesButton.y, yesNameText, buttonTextStyle)
            .setOrigin(0.5)
            .setDepth(yesButton.depth + 1);
    
        const noText = this.scene.add.text(noButton.x, noButton.y, noNameText, buttonTextStyle)
            .setOrigin(0.5)
            .setDepth(noButton.depth + 1);
    
        // Set up event listeners
        yesButton.on('pointerdown', () => this.handleConfirmation(yes));
        noButton.on('pointerdown', () => this.handleConfirmation(no));
    
        // Store references to the buttons and texts
        this.confirmationButtons = [yesButton, noButton];
        this.confirmationTexts = [yesText, noText];
    
        // Set the buttons to be above the dialogue box
        yesButton.setDepth(this.dialogueBox.depth + 1);
        noButton.setDepth(this.dialogueBox.depth + 1);
        yesText.setDepth(this.dialogueBox.depth + 2);
        noText.setDepth(this.dialogueBox.depth + 2);



            // Add buttons and texts to the dialogueBoxContainer
        this.dialogueBoxContainer.add(yesButton);
        this.dialogueBoxContainer.add(noButton);
        this.dialogueBoxContainer.add(yesText);
        this.dialogueBoxContainer.add(noText);
    }
    
    handleConfirmation(action) {
        
        this.cleanupDialogue();
        if (action.callback) {
            action.callback();
        }
        this.reenableKeyboard();
    }
    
 
    cleanupDialogue() {
        if (this.dialogueBoxContainer) {
            // Destroy the dialogue box container
            this.dialogueBoxContainer.destroy();
            this.dialogueBoxContainer = null; // Set the reference to null
    
            // Destroy the dialogue box and its text
            if (this.dialogueBox) {
                this.dialogueBox.destroy();
                this.dialogueBox = null; // Set the reference to null
            }
    
            if (this.text) {
                this.text.destroy();
                this.text = null; // Set the reference to null
            }
    
            // Destroy confirmation buttons and texts if they exist
            if (this.confirmationButtons) {
                this.confirmationButtons.forEach(button => button.destroy());
            }
            this.confirmationButtons = null; // Clear the reference
    
            if (this.confirmationTexts) {
                this.confirmationTexts.forEach(text => text.destroy());
            }
            this.confirmationTexts = null; // Clear the reference
    
            this.removeEventListeners();
    
            // Check if the current scene is MapScene and destroy the quest image
            if (this.scene.scene.key === 'MapScene' && this.scene.quest) {
                this.scene.quest.destroy();
                this.scene.quest = null;
            }
    
          
            this.isClosed = true;
        }
    }
    




    removeEventListeners() {
        this.scene.input.keyboard.off('keydown-SPACE', this.handleEvent);
      
    }
    
    executeEndCallbacks() {
        if (this.endCallbacks.length > 0) {
            this.endCallbacks.forEach(callback => {
                if (typeof callback === 'function') {
                    callback();  // Call each function in the array
                }
            });
        }
    }
    
   

    reenableKeyboard() {
        this.scene.time.delayedCall(500, () => {
          
            if (this.scene.scene.key === 'MapScene') {
                this.scene.scene.get('MapScene').setKeyboardEnabled(true);
            }
            this.locked = false;
     
            this.locked2 = false; // Reset locked after delay
        });
    }




shutdown()
{
    // if (this.dialogueBox)
    //     {
    //         this.dialogueBox.destroy();
    //         this.dialogueBox=null;
    //         // this.text.destroy();
    //     }

    this.cleanupDialogue();
        
  
}

destroy()
{
    this.cleanupDialogue();
}

    // Function to append new lines to an existing dialogue box
appendToDialogueBox(newMessage) {
    this.totalLength += newMessage.length;
    this.completeIterations = Math.floor(this.totalLength / this.lineLength) + 1;
    this.remainder = this.totalLength % this.lineLength;

    for (let i = 0; i < this.completeIterations; i++) {
        const start = i * this.lineLength;
        let end = start + this.lineLength;

        if (i === this.completeIterations - 1) {
            end = start + this.remainder;
        }

        // Find the nearest space or newline for clean breaks
        while (end < newMessage.length && newMessage.charAt(end) !== ' ' && newMessage.charAt(end) !== '\n') {
            end--;
        }

        const newString = newMessage.substring(start, end);
        if (newString !== '') {
            this.lines.push(newString);
        }
        else
        {
            // this.completeIterations-=1;
        }
    }

   
}

splitMessageIntoTwoLines(message) {
    // Get the approximate middle point
    const middle = Math.floor(message.length / 2);

    // Find the nearest space around the middle point
    let splitPoint = middle;
    while (splitPoint > 0 && message.charAt(splitPoint) !== ' ') {
        splitPoint--;
    }

    // If no space found, just break it at the middle
    if (splitPoint === 0) {
        splitPoint = middle;
    }

    // Insert the newline character at the nearest space
    const firstHalf = message.substring(0, splitPoint).trim();
    const secondHalf = message.substring(splitPoint).trim();

    // Return the message with a line break
    return `${firstHalf}\n${secondHalf}`;
}


}