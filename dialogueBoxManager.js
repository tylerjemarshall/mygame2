class DialogueBoxManager {
    constructor() {
        // this.scene = scene
        this.dialogueBoxes = []; // Array to store all active dialogue boxes
    }

  
     createDialogueBox(
        scene, 
        message, 
        endCallbacks = [], 
        timer = false, 
        short = false, 
        confirmationActions = null, 
        color = '#000000', 
        faceset = null
    )
    
   
    {
        
        
        // Check if there's an active dialogue box
        if (this.dialogueBoxes.length > 0) {
      
            const lastDialogueBox = this.activeDialogueBox;
            if (lastDialogueBox === null) {
               
            }
            

            if (lastDialogueBox && !lastDialogueBox.isClosed) {
               
                lastDialogueBox.appendMessage(message); // Append the new message
                return; // Exit, no need to create a new box
            } else {
                
                this.cleanUp(); // Clean up closed dialogue boxes

            }
        } 

       

        // Create a new dialogue box with all parameters
        const newDialogueBox = new DialogueBox(
            scene, 
            message, 
            endCallbacks, 
            timer, 
            short, 
            confirmationActions, 
            color, 
            faceset
        );

      
        this.dialogueBoxes.push(newDialogueBox); // Add it to the list of dialogue boxes
    }


    // Check and remove closed dialogue boxes
    cleanUp() {
        
        // Remove all closed dialogue boxes from the array
        this.dialogueBoxes = this.dialogueBoxes.filter(dialogueBox => {
            const isClosed = dialogueBox.isClosed;
            return !isClosed;
        });
   
    }
    cleanUpAll() {
        
        this.dialogueBoxes.forEach(dialogueBox => {
            if (dialogueBox && typeof dialogueBox.cleanupDialogue === 'function') {
                dialogueBox.cleanupDialogue();
            }
        });
        this.dialogueBoxes = [];
    }
   

// Check if there are any active (open) dialogue boxes
hasActiveDialogue() {
    // Iterate through the dialogueBoxes array and check if any is open (not closed)
    const hasActive = this.dialogueBoxes.some(dialogueBox => !dialogueBox.isClosed);
    
    return hasActive;
}
shouldLockKeyboard() {
    for (let i = this.dialogueBoxes.length - 1; i >= 0; i--) {
        const dialogueBox = this.dialogueBoxes[i];
        if (!dialogueBox.isClosed) {
            // If there's an active dialogue box and its timer is not true, we should lock
            if (!dialogueBox.timer) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    return false;
}
    // Getter for the active dialogue box
get activeDialogueBox() {
    // Check the most recent dialogue box first
    const activeBox = this.dialogueBoxes[this.dialogueBoxes.length - 1] || null;

    if (activeBox && !activeBox.isClosed) {
    
        return activeBox; // Return the active, open dialogue box
    }

    // If the most recent one is closed or null, look through all other dialogue boxes
    for (let i = this.dialogueBoxes.length - 2; i >= 0; i--) {
        const box = this.dialogueBoxes[i];
        if (box && !box.isClosed) {
           
            return box; // Return the first open dialogue box found
        }
    }


    return null; // No open dialogue boxes found
}

    // Function to call handleEvent in the current active dialogue box
    handleEvent(yes = true) {
        const activeBox = this.activeDialogueBox;

        // Check if there is an active dialogue box
        if (activeBox) {
        
            
            // Ensure the active dialogue box has the handleEvent method
            if (typeof activeBox.handleEvent === 'function') {
                activeBox.handleEvent(yes); // Call the handleEvent method
            } else {
                console.error("The active dialogue box does not have a 'handleEvent' method.");
            }
        }
    }




}
