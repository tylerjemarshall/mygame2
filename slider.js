
class Slider {
    constructor(scene, container) {
        this.scene = scene;
        
        this.maxLogSize = 300;
        this.messageLog = new Array(this.maxLogSize);
        this.logIndex = 0;
        this.totalLogs = 0;
        this.originalSize = 0; // Track the initial size of the log



        this.container = container;
        this.maskHeight=this.container.height;

        this.background = this.container.background || null;
        //this.messageLog = []; // Array to store messages without timestamps

        // console.log('x and y of container: ' + container.x + ' ' + container.y);
        this.container.initialY = this.container.y;
        this.initialY = this.container.y;
        this.type = this.container.type;  
        // this.textItems = []; // Array to hold text items
      
        if (container.itemHeight)
        {
            this.itemHeight=container.itemHeight;
            
            
        }
        else
        {
            this.itemHeight=60;
        }
        this.sliderColor = container.sliderColor || 0xff0000; // Red color
        this.backgroundColor = container.backgroundColor || 0x000000; // Black color
        this.textColor = container.textColor || 0xff0000; // Red text

        this.totalContentHeight = null;

        // console.log('Initial Y Position:', this.initialY);
        // console.log('this.itemheight: ', this.itemHeight);

        if (this.type === 'battlelog') {
            console.log('creating battlelog');

            this.createBattleLog(this.container.x, container.y, container.width, container.height);
            // this.createMask(this.container.x, container.y, container.width, container.height)
            // this.createBattleLogBackground(container.x, container.y, container.width, container.height);
            // this.createBattleLogContent(this.container.x, this.container.y, this.container.width, this.container.height);
        } else 

        if (this.type === 'console')
        {
            this.createBackground(container.x, container.y, container.width, container.height);

            this.createConsole(this.container.x + this.container.width, this.container.y, this.container.height);
        }
        else
        {

              // console.log('initial y = ', this.container.initialY);
            this.createMask(container.x, container.y, container.width, container.height - 8);



            this.createSlider(container.x + container.width, container.y, container.height);

        }
        this.isPointerOverMask = false;
        this.performanceStatsEnabled = false;
        this.performanceStatsStarted=false;

        this.stressCount = 0;

    }

    preload()
    {

        
        this.load.image('v_slidder_grabber', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber.png');
        this.load.image('v_slidder_grabber_hover', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_hover.png');
        this.load.image('v_slidder_grabber_disabled', 'images/NinjaAdventure/Ui/Theme/Theme1/v_slidder_grabber_disabled.png');

        this.load.image('nine_path_bg', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg.png');
        this.load.image('nine_path_bg_stretched', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_stretched.png');
        this.load.image('nine_path_bg_2_stretched', 'images/NinjaAdventure/Ui/Theme/Theme1/nine_path_bg_2_stretched.png');



        


    }
    
    createBattleLog(x, y, width, height)
    {
        this.createMask(x, y, width, height);
        this.createConsole(x + width, y, height, 'battlelog');
       
    }
    
    
    // Add new message to the log
    addLog(type, text, fileName, sceneName, count = 1, timeStamp = null) {
    
          // Check for undefined values
    if (type === undefined || text === undefined) {
        // originalLog('Attempted to add log with undefined type or text. Log entry not added.');
        return; // Exit the function without adding the log
    }



    let time;
    if (timeStamp) time = timeStamp; else time = this.getCurrentTimeString();

    const logEntry = { type, text, fileName, sceneName, count, timeStamp: time};
    this.messageLog[this.logIndex] = logEntry;
    this.logIndex = (this.logIndex + 1) % this.maxLogSize;

    // Increment totalLogs count to track how many logs have been added overall
    this.totalLogs = Math.min(this.totalLogs + 1, this.maxLogSize);
    this.originalSize += 1; // Increment the original size until maxLogSize is reached

    }

    // Retrieve a set of logs (for scrolling or rendering)
    getLogs(startIndex, count) {
        const logs = [];

        // Adjust startIndex to account for circular nature
        //const effectiveStartIndex = startIndex % this.maxLogSize;
        //const effectiveStartIndex = (this.logIndex + startIndex) % this.maxLogSize;
        // Calculate effective start index considering circular nature
        const effectiveStartIndex = (this.logIndex + startIndex - this.totalLogs + this.maxLogSize) % this.maxLogSize;



        for (let i = 0; i < count; i++) {
            const index = (effectiveStartIndex + i) % this.maxLogSize;

            // Only push logs that have been added

            /*
            if (i < this.totalLogs) {
                logs.push(this.messageLog[index]);
            }
            */


            // To this line
            if (this.messageLog[index]) {
                logs.push(this.messageLog[index]);
            }
        }

        return logs;
    }

    // Get the current number of logs in the message log
    getCurrentLogLength() {
        return this.totalLogs;
    }





    // exportData() {
    //     const maxMessages = 500; // Adjust as needed
    //     return {
    //         messageLog: this.messageLog.slice(-maxMessages).map(msg => ({
    //             type: msg.type,
    //             text: msg.text,
    //             fileName: msg.fileName,
    //             sceneName: msg.sceneName,
    //             count: msg.count
    //         }))
    //     };
    // }
    

    exportData() {
        const maxMessages = this.maxLogSize; // Adjust as needed
        return {
            messageLog: this.messageLog
                .filter(msg => msg.type !== 'performance')
                .slice(-maxMessages)
                .map(msg => ({
                    type: msg.type,
                    text: msg.text,
                    fileName: msg.fileName,
                    sceneName: msg.sceneName,
                    count: msg.count, 
                    timeStamp: msg.timeStamp
                }))
        };
    }
    importData(data) {
        //this.messageLog = [];
        // this.messageLog = null;
        // this.messageLog = data.messageLog;

        this.messageLog = new Array(this.maxLogSize); // Reinitialize to maintain circular buffer size

        // originalLog(this.messageLog);
        // originalLog('length of messagelog before rebuild: ', this.messageLog.length);
        this.rebuildConsole(data);
    }

    rebuildConsole(data) {
        // Clear existing content
        this.container.removeAll(true, true);

        this.logIndex = 0;
        this.totalLogs = 0;
        this.originalSize = 0; // Track the initial size of the log


        // this.addTextItem('separator', '-----------------Rebuilding Console------------------------', '', '');

        // originalLog('messagelog length: ', this.messageLog.length)
        // Recreate text items from messageLog
        data.messageLog.forEach(msg => {
            if (msg) { // Ensure msg is valid
                this.addTextItem2(msg.type, msg.text, msg.fileName, msg.sceneName, msg.count, msg.timeStamp);
            }


            //this.addTextItem(msg.type, msg.text, msg.fileName, msg.sceneName);
        });

        this.addTextItem2('separator', '-------------------------Console Rebuilt------------------------', '', '');

        // originalLog('container length: ', this.container.list.length);

        this.updateSlider2();

        // originalLog('log length: ' + this.totalLogs);
    }

    clearConsole() {
        // Clear existing content without rebuilding the console
        this.container.removeAll(true, true);
    
        if (this.performanceTextItem)
        {
            this.performanceTextItem=null;
        }

        this.container.setPosition(this.container.x, this.initialY);


        // Optionally, you can log a message indicating the console has been cleared
        
        // If you want to keep track of the message log, you can reset or clear it as needed
        //this.messageLog = []; // Clear the message log if desired
        
        this.messageLog = new Array(this.maxLogSize); // Reinitialize to maintain circular buffer size
        
        
        this.logIndex = 0;
        this.totalLogs = 0;
        this.originalSize = 0; // Track the initial size of the log

        this.addTextItem2('separator', '-------------------------Console Cleared------------------------', '', '');

        // Remove the sliderData from local storage
        localStorage.removeItem('sliderData');

        // Call updateSlider if it affects the console display
        this.updateSlider2();
    }
    



toggleStressTest()
{
    if (this.stressTestInterval)
    {
        this.stopStressTest();
    }
    else
    {
        this.startStressTest();
    }
}

startStressTest() {
    if (this.stressTestInterval) return; // Don't start if already running

    this.stressTestInterval = setInterval(() => {
        const timestamp = new Date().toISOString(); // Get the current timestamp
        const message = this.stressCount + ` - Stress Test Item`; // Create the unique message
        this.addTextItem2('stress', message, 'fileName', 'sceneName');
        this.stressCount++;
        // this.addTextItem('stress', 'Stress Test Item', 'fileName', 'sceneName');
    }, 1);
}

 stopStressTest() {
    if (this.stressTestInterval) {
        clearInterval(this.stressTestInterval);
        this.stressTestInterval = null;
    }
}


/////////performance////////

startPeriodicUpdate() {
    this.updateInterval = setInterval(() => {
        this.periodicUpdate();
    }, 1000); // Run every 1 second
    
}

periodicUpdate() {
   
    if (this.performanceStatsEnabled)
    {
        this.updatePerformanceStats();

    }
}

enablePerformanceStats() {
    this.performanceStatsEnabled = true;
    // If there's an existing performance line, show it
    // if (this.performanceTextItem) {
    //     this.performanceTextItem.setVisible(true);
    // }
    if (!this.performanceStatsStarted)
    {
        this.startPeriodicUpdate();
        this.performanceStatsStarted = true;

    }
}

disablePerformanceStats() {
    this.performanceStatsEnabled = false;
    // If there's an existing performance line, hide it
    // if (this.performanceTextItem) {
    //     this.performanceTextItem.setVisible(false);
    // }
}

togglePerformanceStats() {
    if (this.performanceStatsEnabled) {
        this.disablePerformanceStats();
    } else {
        this.enablePerformanceStats();
    }
}

updatePerformanceStats() {
    const mainGameStats = this.getGamePerformanceStats(globals.gameInstance);
    const statsMessage = `FPS: ${mainGameStats.fps} | Objects: ${mainGameStats.activeObjects} | Memory: ${mainGameStats.memory} MB`;
   
    this.addTextItem2('performance', statsMessage, '', '');

}



getGamePerformanceStats(game) {
    const fps = Math.round(game.loop.actualFps);
    const activeObjects = game.scene.getScenes(true).reduce((sum, scene) => sum + scene.children.length, 0);
    const memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 'N/A';
    return { fps, activeObjects, memory };
}


    addTextItem(type, text, fileName, sceneName) {
        const maxLines = 1000; // Maximum number of lines to keep


        if (type === 'performance')
        {

            // // Remove existing performance item if it exists
            // const existingPerformanceIndex = this.messageLog.findIndex(item => item.type === 'performance');
            // if (existingPerformanceIndex !== -1) {
            //     this.messageLog.splice(existingPerformanceIndex, 1);
            //     this.container.removeAt(existingPerformanceIndex);
            // }



            this.messageLog.push({ type, text, fileName, sceneName, count: 1 });
            this.updatePerformanceLine(type, text, fileName, sceneName);

        }
        else
        {
            const lastItem = this.messageLog[this.messageLog.length - 1];
        
            if (lastItem && lastItem.text === text && lastItem.type === type && lastItem.fileName === fileName) {
                lastItem.count++;
                // console.log('count: ', lastItem.count);
                this.updateExistingTextItem(this.messageLog.length - 1);
            } else {
                // this.messageLog.push({ type, text, fileName, count: 1 });
                // this.addNewTextItem(type, text, fileName);
                this.messageLog.push({ type, text, fileName, sceneName, count: 1 });
                this.addNewTextItem(type, text, fileName, sceneName);
            }
        }


            
    
        this.updateSlider();
    }
    
    
    
    //   // Function to add a text item
    // addTextItem2(type, text, fileName, sceneName, count=1, timeStamp=null) {
    //     const maxLines = 1000; // Maximum number of lines to keep
    //     const timeString = this.getCurrentTimeString();

    //     if (type === 'performance') {
        
        
    //        const existingItemIndex = this.messageLog.findIndex(item => 
    //         item &&
    //         item.type === 'performance' &&
    //         item.fileName === fileName &&
    //         item.sceneName === sceneName
    //     );

    //     if (existingItemIndex !== -1) {
    //         // Update existing performance item text
    //         this.messageLog[existingItemIndex].text = text;}
    //         else {
    //         //this.messageLog.push({ type, text, fileName, sceneName, count: 1, time: timeString });
    //         this.addLog(type, text, fileName, sceneName);
    //         }
    //     } else {
        
    //         //const lastItem = this.messageLog[this.messageLog.length - 1];
    //          const lastItem = this.messageLog[(this.logIndex - 1 + this.maxLogSize) % this.maxLogSize];
             

    //         // Check if the current log item is the same as the last one
    //         if (lastItem && lastItem.text === text && lastItem.type === type && lastItem.fileName === fileName) {
    //             lastItem.count++; // Increment count for existing item
    //         } else {
    //             // Add new item to the log
    //             //this.messageLog.push({ type, text, fileName, sceneName, count: 1, time: timeString });
    //             this.addLog(type, text, fileName, sceneName, count, timeStamp);
    //         }
    //     }

    //     this.updateSlider2(); // This will call updateItemListPosition
    // }


    addTextItem2(type, text, fileName, sceneName, count=1, timeStamp=null) {
        const maxLines = 1000; // Maximum number of lines to keep
        const timeString = this.getCurrentTimeString();
    
        // Convert text to an array if it's not already one
        const textArray = Array.isArray(text) ? text : [text];
    



        if (this.type === 'battlelog') {
            this.addLog(type, textArray, fileName, sceneName, count, timeStamp);

        } else


        
        if (type === 'performance') {
            const existingItemIndex = this.messageLog.findIndex(item => 
                item &&
                item.type === 'performance' &&
                item.fileName === fileName &&
                item.sceneName === sceneName
            );
    
            if (existingItemIndex !== -1) {
                // Update existing performance item text
                this.messageLog[existingItemIndex].text = textArray;
            } else {
                this.addLog(type, textArray, fileName, sceneName);
            }
        } else {
            const lastItem = this.messageLog[(this.logIndex - 1 + this.maxLogSize) % this.maxLogSize];
    
            // Check if the current log item is the same as the last one
            if (lastItem && 
                JSON.stringify(lastItem.text) === JSON.stringify(textArray) && 
                lastItem.type === type && 
                lastItem.fileName === fileName) {
                lastItem.count++; // Increment count for existing item
            } else {
                // Add new item to the log
                this.addLog(type, textArray, fileName, sceneName, count, timeStamp);
            }
        }
    
        this.updateSlider2(); // This will call updateItemListPosition
    }

 
    showFileName(textItem, yPosition) { //, y
        if (this.fileNameText) {
            this.fileNameText.destroy();
        }
        if (this.fileNameBackground) {
            this.fileNameBackground.destroy();
        }
        
        // Calculate position relative to the container and text item
        const x = this.container.x + textItem.x;
        const y = this.container.y + textItem.y - 25; // 25 pixels above the text item
        
        // Create the filename text
        this.fileNameText = this.scene.add.text(0, 0, textItem.fileName, {
            font: '20px Arial',
            fill: '#ffffff'
        });
        this.fileNameText.setDepth(1001); // Ensure it's on top of the background
        
        // Create a background for the filename text
        const padding = 4;
        this.fileNameBackground = this.scene.add.graphics();
        this.fileNameBackground.fillStyle(0x000000, 0.7); // Semi-transparent black background
        this.fileNameBackground.fillRoundedRect(
            0, 
            0, 
            this.fileNameText.width + padding * 2, 
            this.fileNameText.height + padding * 2,
            5 // Corner radius
        );
        this.fileNameBackground.setDepth(1000); // Just below the text
        
        // Group the text and background together
        this.fileNameGroup = this.scene.add.container(30, this.container.y + yPosition - 25, [this.fileNameBackground, this.fileNameText]);
        this.fileNameGroup.setDepth(1000);
        

        this.isPointerOverMask = true;

        // Add the group to the main container so it scrolls with the content
        // this.container.add(this.fileNameGroup);
    }
    
    hideFileName() {
        if (this.fileNameText) {
            this.fileNameText.destroy();
            this.fileNameText=null;
        }
        if (this.fileNameBackground) {
            this.fileNameBackground.destroy();
            this.fileNameBackground=null;
        }
        this.isPointerOverMask = false;

    }

    updatePerformanceLine(type, text, fileName, sceneName) {
        if (!this.performanceTextItem) {
            // Create the performance text item if it doesn't exist
            this.performanceTextItem = this.scene.add.text(10, this.container.list.length * this.itemHeight, text, {
                font: '20px Arial',
                fill: this.getColorForType(type),
            });
            this.performanceTextItem.setOrigin(0, 0);
            // this.addNewTextItem(type, text, fileName, sceneName);

            this.container.add(this.performanceTextItem);
        } else {
            // Update the existing performance text item
            this.performanceTextItem.setText(text);
        }
    

         // Set visibility based on whether performance stats are enabled
        // this.performanceTextItem.setVisible(this.performanceStatsEnabled);

   
    }

    updateExistingTextItem(index) {
        const item = this.messageLog[index];
        const textItem = this.container.list[index];

        // console.log('updating item to textitem... ', item.text, textItem);
        const timeString = this.getCurrentTimeString();
        const color = this.getColorForType(item.type);

         // Check if item and textItem are defined
        if (!item || !textItem) {
            // console.warn(`Cannot update item at index ${index}: item or textItem is undefined.`);
            // originalLog('duplicate item adding to slider: '+ `[${timeString}] ${item.text} [${item.count}]`);
            // originalLog('container index: ', this.container.length);
            // originalLog('index: ', index);

            return; // Exit the function if there's an issue
        }


 
    
           // Ensure item.text is defined before updating
        if (item.text) {
            textItem.setText(`[${timeString}] ${item.text} [${item.count}]`);
        } else {
            console.warn(`Item text is undefined at index ${index}.`);
        }
        


        // textItem.setText(`[${timeString}] ${item.text} [${item.count}]`);
        textItem.setColor(color);
    }


   
    
 

    addNewTextItem(type, text, fileName, sceneName, time) {
        //const timeString = this.getCurrentTimeString();
        const color = this.getColorForType(type);
        const textItem = this.scene.add.text(10, (this.container.list.length * this.itemHeight), `[${time}] ${text}`, {
            font: '20px Arial',
            fill: color,
            // wordWrap: { width: this.container.width - 20 }
        });
        textItem.setOrigin(0, 0);
        
        // Store the fileName as a property of the text item
        textItem.fileName = fileName;
        textItem.sceneName = sceneName;
        textItem.type = type;
        textItem.timeStamp = time;

        
        // Add hover functionality to show filename
        textItem.setInteractive();
        textItem.on('pointerover', () => {
            this.showFileName(textItem);
        });
        textItem.on('pointerout', () => {
            this.hideFileName();
        });
       
        this.container.add(textItem);
    }
    
    //////adding another new text item//////
    
    addNewTextItem2(type, text, fileName, sceneName, time, index) { //, renderedIndex
    const color = this.getColorForType(type);

    // Calculate the y-position based on the index and current scroll position
    // const yPosition = (index) * this.itemHeight;
    const yPosition = index;
    // const yPosition = (renderedIndex) * this.itemHeight;


    const textItem = this.scene.add.text(10, yPosition, `[${time}] ${text}`, {
        font: '20px Arial',
        fill: color,
        // wordWrap: { width: this.container.width - 20 }
    });

    textItem.setOrigin(0, 0);
    
    // Store additional properties on the text item
    textItem.fileName = fileName;
    textItem.sceneName = sceneName;
    textItem.type = type;
    textItem.timeStamp = time;
    textItem.logIndex = index; // Store the original index

    // Add hover functionality to show the filename
    textItem.setInteractive();
    textItem.on('pointerover', () => {
        this.showFileName(textItem);
    });
    textItem.on('pointerout', () => {
        this.hideFileName();
    });

    // Add the text item to the container
    this.container.add(textItem);
    return textItem;
}


// Method to add new text item with styles
addNewTextItem3(type, text, fileName, sceneName, time, index) {
    const defaultColor = this.getColorForType(type);
    const yPosition = index;

    // Parse the styled text with CSS
    const styledParts = this.parseStyledTextWithCSSNew(text);
    let currentX = 0; // X position for placing the text

    // Create a container for the text
    const textContainer = this.scene.add.container(10, yPosition);






    styledParts.forEach((part, i) => {
        let textStyle = {
            font: '20px Arial',
            fill: defaultColor // Default color based on the type
        };
        if (i === 0) {
        part.text = `[${time}] ${part.text}`;
        }
        else
        {
            part.text = ' ' + part.text;
        }
        // Create text item based on the part type
        if (part.type === 'text') {
            textStyle = { ...textStyle }; // Apply default styles
        } else if (part.type === 'style') {
            const cssStyles = this.parseCSS(part.style);
            textStyle = { ...textStyle, ...cssStyles }; // Merge parsed CSS styles
        }

        // Create the text item
        const textItem = this.scene.add.text(currentX, 0, part.text, textStyle);
        textItem.setOrigin(0, 0);
       
       
            
        textItem.fileName = fileName;
        textItem.sceneName = sceneName;
        textItem.type = type;
        textItem.timeStamp = time;
        textItem.logIndex = index;



        textItem.setInteractive({});
        textItem.on('pointerover', () => {
            this.showFileName(textItem, yPosition);
        });
        textItem.on('pointerout', () => {
            this.hideFileName();
        });

      
        

        textContainer.add(textItem);
        currentX += textItem.width; // Move X position for the next part
    });

   

  

    // Add the text container to the main container
    this.container.add(textContainer);
    return textContainer;
}


parseStyledTextWithCSSNew(text) {

    // originalLog("Input received:", JSON.stringify(text));
    // originalLog("Input type:", typeof text);
    // if (Array.isArray(text)) {
    //     text.forEach((item, index) => {
    //         originalLog(`Item ${index}:`, item, "Type:", typeof item);
    //     });
    // }



    const styledParts = [];
    const styleRegex = /%c/g;

    // Ensure text is an array
    const textArray = Array.isArray(text) ? text : [text];

    

    // originalLog("Full textArray:", textArray); // Log the initial array
    
    // Extract styles from additional arguments
    const styles = textArray.slice(1); // Styles are from the second item onward

    // Process the main text string (first element of the array)
    const mainText = String(textArray[0]); // Ensure main text is a string
    const parts = mainText.split(styleRegex); // Split on %c

    parts.forEach((part, index) => {
        if (index === 0 && part.trim() !== '') {
            // The first part may be unstyled if there's no leading %c
            styledParts.push({ type: 'text', text: part.trim() });
        } else if (part.trim() !== '') {
            const style = styles[index - 1] || ''; // Get corresponding style if available
            const cleanText = part.trim();



            // Push styled part into the array
            styledParts.push({ type: 'style', text: cleanText, style: this.extractStyle(style) });
        }
    });

  // Check if styledParts has only one element
    if (styledParts.length === 1 && styledParts[0].type === 'text') {
        const finalTextParts = [];

        textArray.forEach(item => {
            if (typeof item === 'string' && (item.toLowerCase() === 'true' || item.toLowerCase() === 'false')) {
                finalTextParts.push({
                    type: 'style',
                    text: item,
                    style: this.extractStyle('font-weight: bold; color: purple;')
                });
            } else {
                finalTextParts.push({ type: 'text', text: String(item) });
            }
        });

        return finalTextParts; // Return the final processed array
    }

    return styledParts; // Return styled parts
}

/*

parseStyledTextWithCSSNew(text) {
    const styledParts = [];
    const styleRegex = /%c/g;

    // Ensure text is an array
    const textArray = Array.isArray(text) ? text : [text];
    const styles = textArray.slice(1); // Extract styles from additional arguments

    // Process the main text string (first element of the array)
    const mainText = textArray[0];
    const parts = mainText.split(styleRegex);

    parts.forEach((part, index) => {
        if (index === 0 && part.trim() !== '') {
            // The first part may be unstyled if there's no leading %c
            styledParts.push({ type: 'text', text: part.trim() });
        } else if (part.trim() !== '') {
            const style = styles[index - 1] || '';
            const cleanText = part.trim();

            // Push styled part into the array
            styledParts.push({ type: 'style', text: cleanText, style: this.extractStyle(style) });
        }
    });

    // If there's no styling at all, join all parts into a single text entry
    if (styledParts.every(part => part.type === 'text')) {
        return [{ type: 'text', text: styledParts.map(part => part.text).join(' ') }];
    }
    originalLog(styledParts);
    originalLog(styles);
    return styledParts;
}
*/




parseStyledTextWithCSS(text) {
    const styledParts = [];
    const styleRegex = /%c/g;

    // Trim everything before the first %c
    const firstStyleIndex = text.indexOf('%c');
    let trimmedText = text;
    if (firstStyleIndex !== -1) {
        trimmedText = text.substring(firstStyleIndex);
    }

    
    const styles = [];

let match;
const styleRegex2 = /(color|font-weight|font-style|text-decoration|background-color):\s*[^;]+;/gi;

const originalText = trimmedText;  // Store the original text without modification

while ((match = styleRegex2.exec(trimmedText)) !== null) {
    // Push matched style declaration into the array
    styles.push(match[0].trim());
    
    // Log the added style correctly
    // originalLog('Added style: ', match[0].trim());
}

// Now, after capturing all styles, we can modify trimmedText if necessary
const cleanText = trimmedText.replace(styleRegex2, '');

// Continue with further logic...

    // Adjust the styles array based on the remaining text after extraction
    const cleanStyles = trimmedText.match(/(?<=%c)[^%]+/g) || [];

    let styleCounter = 0; // Counter for styles
    const parts = trimmedText.split(styleRegex);
    // Process each part
    for (let i = 0; i < parts.length; i++) {
        if (i === 0 && parts[i].trim() !== '') {
            // The first part may still be unstyled if there's no leading %c
            styledParts.push({ type: 'text', text: parts[i].trim() });
        } else {
            // Only process styled parts
            if (parts[i].trim() !== '') {
                // originalLog('parts[' + i + ']=  ', parts[i]);

                // Get the corresponding style declaration
                // const style = cleanStyles[styleCounter] ? this.extractStyle(cleanStyles[styleCounter]) : '';
                const style = styles[i - 1] ? this.extractStyle(styles[i - 1]) : ''; // use the styles array

                const cleanText = parts[i].replace(/\b(color|font-weight|font-style|text-decoration|background-color):\s*[^;]+;?\s*/gi, '').trim();

                // Push styled part into the array
                styledParts.push({ type: 'style', text: cleanText, style: style });

                // Increment the styleCounter
                styleCounter++;
            }
        }
    }
    // originalLog(styledParts);
    // originalLog(styles);
    return styledParts;
}

extractStyle(styleText) {
    const cssProperties = ['color', 'font-weight', 'font-style', 'text-decoration', 'background-color'];
    let style = '';
    cssProperties.forEach(prop => {
        const regex = new RegExp(`${prop}:\\s*([^;]+)`, 'i');
        const match = styleText.match(regex);
        if (match) {
            style += `${prop}: ${match[1]}; `;
        }
    });
    return style.trim();
}


parseCSS(cssString) {
    const style = {};

    // Extract color
    const colorMatch = cssString.match(/color:\s*(#[0-9a-f]{3,6}|[a-zA-Z]+)/i);
    if (colorMatch) {
        style.fill = colorMatch[1]; // Phaser uses 'fill' for text color
    }

    // Initialize font style components
    let fontWeight = '';
    let fontStyle = '';

    // Bold text
    if (cssString.includes('font-weight: bold')) {
        fontWeight = 'bold ';
    }

    // Italic text
    if (cssString.includes('font-style: italic')) {
        fontStyle = 'italic ';
    }

    // Construct the full font string
    const fontSizeMatch = cssString.match(/font-size:\s*([\d\.]+)(px|em|rem|%)/i);
    const fontSize = fontSizeMatch ? `${fontSizeMatch[1]}${fontSizeMatch[2]} ` : '20px '; // Default size if not specified
    const fontFamilyMatch = cssString.match(/font-family:\s*([^;]+)/i);
    const fontFamily = fontFamilyMatch ? `${fontFamilyMatch[1]}` : 'Arial'; // Default family if not specified

    style.font = `${fontStyle}${fontWeight}${fontSize}${fontFamily}`.trim();

    // Underlined text (Phaser does not support this natively)
    if (cssString.includes('text-decoration: underline')) {
        style.textDecoration = 'underline'; // Custom handling needed
    }

    // Background color (Phaser does not support this natively)
    const bgColorMatch = cssString.match(/background-color:\s*(#[0-9a-f]{3,6}|[a-zA-Z]+)/i);
    if (bgColorMatch) {
        style.backgroundColor = bgColorMatch[1]; // Custom handling needed
    }

    return style;
}

// Function to parse individual CSS strings into text style objects
parseCSSold(cssString) {
    const style = {};

    // Extract color
    const colorMatch = cssString.match(/color:\s*(#[0-9a-f]{3,6}|[a-zA-Z]+)/i);
    if (colorMatch) {
        style.fill = colorMatch[1]; // Phaser uses 'fill' for text color
    }

    // Bold text
    if (cssString.includes('font-weight: bold')) {
        style.fontWeight = 'bold';
        // style.addFontWeight('bold', 6);
    }

    // Italic text
    if (cssString.includes('font-style: italic')) {
        style.fontStyle = 'italic';
    }

    // Underlined text
    if (cssString.includes('text-decoration: underline')) {
        style.textDecoration = 'underline'; // You might need custom handling for underline
    }

    // Background color
    const bgColorMatch = cssString.match(/background-color:\s*(#[0-9a-f]{3,6}|[a-zA-Z]+)/i);
    if (bgColorMatch) {
        style.backgroundColor = bgColorMatch[1]; // Add background color handling if needed
    }

    return style;
}



    getCurrentTimeString() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    getColorForType(type) {
        switch (type) {
            case 'warn':
                return '#FFA500'; // Orange for warnings
            case 'error':
                return '#FF0000'; // Red for errors
            case 'performance':
                return '#800080'
            case 'info': return '#ffffff';
            case 'attack': return '#ff0000';
            case 'effect': return '#00ff00';
            default:
                return '#FFFFFF'; // White for regular logs
        }
    }
    
    
    
    updateSlider2() {
    const startY = this.initialY;
    const totalLogCount =   this.totalLogs;
    this.totalContentHeight = totalLogCount * this.itemHeight; // Calculate total content height
    const scrollableRange = this.totalContentHeight - this.maskHeight; // Scrollable area (content - mask)
    const sliderMaxPosition = startY + this.maskHeight - this.slider.height; // Max slider position (track length)

    // Check if user is at the bottom and auto-scroll if necessary
    const atBottom = Math.abs(this.container.y - this.initialY) < 10 || this.autoScrollToBottom;

    // Automatically scroll to the bottom if new items are added
    if (atBottom) {
        this.slider.setY(sliderMaxPosition); // Move slider to the bottom
        this.autoScrollToBottom = true; // Flag to keep it scrolling to the bottom
        this.updateItemListPosition3(sliderMaxPosition, this.totalContentHeight); // Re-render visible logs
    } else {
        // Update the slider position based on the scroll range
        this.updateItemListPosition3(this.slider.y, this.totalContentHeight); // Update the visible logs
    }
}










    updateSlider() {
      
        const startY = this.initialY;
        const maskHeight = this.container.height;
        const maxY = startY + maskHeight - 20;











        let itemSpacing = this.itemHeight;
        this.totalContentHeight = (this.container.length) * itemSpacing + (itemSpacing/2)
      
        if (this.totalContentHeight <= this.container.height) {
            this.slider.setVisible(false);
         
        }
        else
        {
            this.slider.setVisible(true);
            // this.sliderBg.setVisible(true);
        }

        this.slider.y = maxY;

        this.updateItemListPosition(this.slider.y, startY, maxY, this.totalContentHeight, maskHeight, 1);


        ///move performance to the bottom///


        //   // Check if the second-to-last item is the performance item
        // const secondToLastIndex = this.container.list.length - 2;
        // if (secondToLastIndex >= 0 && this.container.list[secondToLastIndex].type === 'performance') {
        //     // Swap the performance item with the last item
        //     const performanceItem = this.container.list[secondToLastIndex];
        //     const lastItem = this.container.list[this.container.list.length - 1];
            
        //     // Swap positions in the container
        //     this.container.swapChildren(performanceItem, lastItem);
            
        //     // Swap positions in the messageLog
        //     const temp = this.messageLog[secondToLastIndex];
        //     this.messageLog[secondToLastIndex] = this.messageLog[this.messageLog.length - 1];
        //     this.messageLog[this.messageLog.length - 1] = temp;
            
        //     // Update y positions
        //     performanceItem.y = (this.container.list.length - 1) * this.itemHeight;
        //     lastItem.y = secondToLastIndex * this.itemHeight;
        // }
       
    }


    createBackground(x, y, width, height) {
        // Create a background rectangle



        const cameraX = this.scene.cameras.main.scrollX;
        const cameraY = this.scene.cameras.main.scrollY;
        this.backgroundShape = this.scene.add.graphics();
        this.backgroundShape.fillStyle(this.backgroundColor, 1);
        this.backgroundShape.fillRect(0, 0, width, height);
        this.backgroundShape.x=x;
        this.backgroundShape.y=y;
        this.backgroundShape.setDepth(-1);
        

        this.backgroundShape.setAlpha(1);


        // Enable pointer interaction
        this.backgroundShape.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

        // Pointer events
        this.backgroundShape.on('pointerover', () => {
            // Handle pointer over event
            // console.log('Pointer is over the background!');
            this.isPointerOverMask = true;
            // You can set isPointerOverMask or any other variable or state here
        });

        this.backgroundShape.on('pointerout', () => {
            // Handle pointer out event
            // console.log('Pointer is no longer over the background!');
            this.isPointerOverMask = false;
            // Reset isPointerOverMask or any other variable or state here
        });




        // Add text label on top
        // const text = this.scene.add.text(x + 10, y + 10, 'Slider', { fontSize: '16px', fill: `#${this.textColor.toString(16)}` });
        // text.setDepth(5);
        
        // this.container.setMask(new Phaser.Display.Masks.GeometryMask(this.scene, this.backgroundShape));
        this.createMask(x, y, width, height);
    }


    createMask(x, y, width, height) {
        this.maskShape = this.scene.add.graphics();
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.fillRect(x, y, width, height);
        this.maskShape.setDepth(-2);
        this.maskShape.setAlpha(0);  // Hide the mask shape but keep it functional

        this.mask = this.maskShape.createGeometryMask();

        this.maskBounds = new Phaser.Geom.Rectangle(x, y, width, height);
        this.maskShape.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        this.container.setMask(this.mask);
    }



    
    createConsole(x, y, height, type = 'console') {
        let scroll = 0.05;
        // const cameraX = this.scene.cameras.main.scrollX;
        // const cameraY = this.scene.cameras.main.scrollY;
        const cameraX = this.scene.cameras.main.scrollX;
        const cameraY = this.scene.cameras.main.scrollY;
        
        const startX = x;
        const startY = y;
        const scrollX = cameraX + startX;
        const scrollY = cameraY + startY;
        const maskHeight = height;
        const itemSpacing = this.itemHeight;

        this.totalContentHeight = 0;
        
     
// Original height calculation for a list
        if (this.container.type !== 'grid') {
            this.totalContentHeight = (this.container.length) * itemSpacing + (itemSpacing / 2);
        } else {
            // When grid is true
            const itemWidth = this.container.itemWidth;
            const itemsPerRow = Math.floor(this.container.width / (itemWidth + itemSpacing)); // Calculate number of items that fit in one row
            const totalRows = Math.ceil(this.container.length / itemsPerRow); // Calculate the total number of rows needed

            // Calculate the total content height for grid layout
            this.totalContentHeight = totalRows * (itemHeight + itemSpacing) - itemSpacing; // Subtract the last spacing
        }

        const sliderHeight = Math.max(50, (maskHeight / this.totalContentHeight) * maskHeight);



        if (this.type === 'console')
        {
            console.log('type is console');
            // Create a background for the slider
            this.sliderBg = this.scene.add.graphics();
            // this.sliderBg.fillStyle(0x222222, 1);
            this.sliderBg.fillStyle(0x0000FF, 1); // Blue color

            this.sliderBg.fillRect(0, 0, 30, maskHeight);
            this.sliderBg.x = startX;
            this.sliderBg.y = startY;
            this.sliderBg.setDepth(5);

            // Create the slider handle
            this.slider = this.scene.add.graphics();
            this.slider.fillStyle(this.sliderColor, 1);
            this.slider.fillRect(0, 0, 30, 20);
            this.slider.x = startX;
            this.slider.y = startY;
            this.slider.setDepth(10);
            this.slider.height=20;

            this.sliderBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, 30, maskHeight), Phaser.Geom.Rectangle.Contains);

       
            // Make the slider handle interactive and draggable
           this.slider.setInteractive(new Phaser.Geom.Rectangle(0, 0, 30, 20), Phaser.Geom.Rectangle.Contains);
        //    this.scene.input.setDraggable(this.slider); // Set draggable
   
        } else if (this.type === 'battlelog')
        {
            console.log('creating sliderbg and slider for battlelog');
            this.sliderBg = this.scene.add.image(x, y, 'nine_path_bg_stretched').setInteractive();;
            this.sliderBg.setOrigin(0, 0);
            this.sliderBg.setDisplaySize(40, height);
            this.sliderBg.x = startX;
            this.sliderBg.y = startY;

            // Create the slider handle using an image
            this.slider = this.scene.add.image(x, y, 'v_slidder_grabber').setInteractive();;
            this.slider.setOrigin(0, 0);
            this.slider.setDisplaySize(40, 40);  // Adjust size as needed
            this.slider.x = startX;
            this.slider.y = startY;
            this.slider.width=40;
            this.slider.height=40;
             // Set interactive for images
            // this.sliderBg.setInteractive();
            // this.slider.setInteractive();
            // this.sliderBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.sliderBg.width, this.sliderBg.height), Phaser.Geom.Rectangle.Contains);
            // this.slider.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.slider.width, this.slider.height), Phaser.Geom.Rectangle.Contains);



        }
        else
        {
            console.log('type not found');
        }

   


        this.sliderBg.on('pointerover', () => {
            this.isPointerOverMask = true;
        });
        this.sliderBg.on('pointerout', () => {
            this.isPointerOverMask = false;
        });


      




        this.slider.isSlider = true;

        this.slider.on('pointerover', () => {
            if (this.type === 'battlelog') this.slider.setTexture('v_slidder_grabber_hover');
            this.isPointerOverMask = true;
        });

        this.slider.on('pointerout', () => {
            if (this.type === 'battlelog') this.slider.setTexture('v_slidder_grabber');
            this.isPointerOverMask = false;
        });

        this.scene.input.setDraggable(this.slider); // Set draggable

        this. slider.on('pointerdown', () => {
            if (this.type === 'battlelog') this.slider.setTexture('v_slidder_grabber_hover');
        });

        this.slider.on('pointerup', () => {
            if (this.type === 'battlelog') this.slider.setTexture('v_slidder_grabber');
        });



        const maxY = startY + maskHeight - this.slider.height;
        
        // const newMaxY = this.initialY + maskHeight;

        this.slider.on('dragstart', () => {
            if (this.type === 'battlelog')  this.sliderBg.setTexture('nine_path_bg_2_stretched');
        });

        this.slider.on('drag', (pointer, dragX, dragY) => {


            this.slider.y = Phaser.Math.Clamp(dragY, startY, maxY);
           // this.updateItemListPosition(this.slider.y, startY, maxY, this.totalContentHeight, maskHeight, scroll);
            
             this.updateItemListPosition3(this.slider.y, this.totalContentHeight); // Update the visible logs
            // console.log('content height = ' +  this.totalContentHeight);
        });

        this.slider.on('dragend', () => {
            if (this.type === 'battlelog')  this.sliderBg.setTexture('nine_path_bg_stretched');
        });

        // if (totalContentHeight <= maskHeight) {
        //     this.slider.setVisible(false);
        //     this.sliderBg.setVisible(false);
        // }

        // const updateSliderPosition = (newY) => {
        //     this.slider.y = Phaser.Math.Clamp(newY, startY, maxY);
        //     this.updateItemListPosition(this.slider.y, startY, maxY, this.totalContentHeight, maskHeight, scroll);
        // };

        this.maskShape.on('pointerover', () => {
            this.isPointerOverMask = true;
            // console.log('pointerovermask true');
            
        });
        this.maskShape.on('pointerout', () => {
            this.isPointerOverMask = false;
            // console.log('pointerovermask false');
        });

       

        this.container.list.forEach(button => {
            if (button.type === 'Container') { // Assuming your buttons are containers
              // Find the image within the button container
              const image = button.list.find(child => child.type === 'Image');
     

              if (image) {
                  image.setInteractive();
                  image.on('pointerover', () => { this.isPointerOverMask = true; });
                  image.on('pointerout', () => { this.isPointerOverMask = false; });
              }
       
            }
        });

     
     



        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (this.isPointerOverMask) {
                const scrollSpeed = scroll;
                let newY = (scroll < 0) ? this.slider.y + deltaY * scrollSpeed * -1 : this.slider.y + deltaY * scrollSpeed;
                this.updateSliderPosition(newY, startY, maxY, maskHeight, scroll);
            }
        });

        // this.sliderBg.setInteractive();
        this.sliderBg.on('pointerdown', (pointer) => {
            const updatePosition = (pointer) => {
                
                const centerY = this.scene.scale.height / 2;
                const currentZoom = this.scene.cameras.main.zoom;
                let deltaY = centerY + (pointer.y - centerY) / currentZoom - this.slider.height / currentZoom;
                this.updateSliderPosition(deltaY, startY, maxY, maskHeight, scroll);
                //this.updateItemListPosition2(this.slider.y, this.totalContentHeight); // Update the visible logs
            };

            updatePosition(pointer);

            const onPointerMove = (pointer) => updatePosition(pointer);
            const onPointerUp = () => {
                this.scene.input.off('pointermove', onPointerMove);
                this.scene.input.off('pointerup', onPointerUp);
                // sliderBg.setTexture('nine_path_bg_stretched');
                // slider.setTexture('v_slidder_grabber');
            };

            this.scene.input.on('pointermove', onPointerMove);
            this.scene.input.on('pointerup', onPointerUp);
            // sliderBg.setTexture('nine_path_bg_2_stretched');
            // slider.setTexture('v_slidder_grabber_hover');
        });

        if (scroll < 0) {
            this.slider.y = maxY;
        }

        // this.slider = this.slider;
        // this.sliderBg = this.sliderBg;
    }



    updateSliderPosition  (newY, startY, maxY, maskHeight, scroll) {
     
        this.slider.y = Phaser.Math.Clamp(newY, startY, maxY);

        //this.updateItemListPosition(this.slider.y, startY, maxY, this.totalContentHeight, maskHeight, scroll);
        this.updateItemListPosition3(this.slider.y, this.totalContentHeight); // Update the visible logs
    };


    createSlider(x, y, height) {
        let scroll = 0.05;
        const cameraX = this.scene.cameras.main.scrollX;
        const cameraY = this.scene.cameras.main.scrollY;
        
        const startX = x;
        const startY = y;
        const scrollX = cameraX + startX;
        const scrollY = cameraY + startY;
        const maskHeight = height;
        const itemSpacing = this.itemHeight;

        let totalContentHeight = 0;
        
        // totalContentHeight = (this.container.length) * itemSpacing + (itemSpacing/2);
        
        if (this.container.type === 'grid')
        {
            
            // When grid is true
            const itemWidth = this.container.itemWidth;
            const itemsPerRow = Math.floor(this.container.width / (itemWidth + itemSpacing)); // Calculate number of items that fit in one row
            const totalRows = Math.ceil(this.container.length / itemsPerRow); // Calculate the total number of rows needed

            // Calculate the total content height for grid layout
          totalContentHeight = totalRows * itemSpacing + itemSpacing/4; // Subtract the last spacing
        
        }
        else
        {
            totalContentHeight = (this.container.length) * itemSpacing + (itemSpacing/2);

        }




        const sliderHeight = Math.max(50, (maskHeight / totalContentHeight) * maskHeight);

        const sliderBg = this.scene.add.image(scrollX, scrollY, 'nine_path_bg_stretched');
        sliderBg.setOrigin(0.5, 0);
        sliderBg.setDisplaySize(40, maskHeight - 10);
        sliderBg.setDepth(5);


        sliderBg.on('pointerover', () => {
            this.isPointerOverMask = true;
        });
        sliderBg.on('pointerout', () => {
            this.isPointerOverMask = false;
        });


        const slider = this.scene.add.image(startX, startY, 'v_slidder_grabber').setInteractive();
        slider.setOrigin(0.5, 0);
        slider.setDisplaySize(40, 40);
        slider.setScrollFactor(0);
        slider.setDepth(10);

        this.scene.input.setDraggable(slider);
        slider.isSlider = true;

        slider.on('pointerover', () => {
            slider.setTexture('v_slidder_grabber_hover');
            this.isPointerOverMask = true;
        });

        slider.on('pointerout', () => {
            slider.setTexture('v_slidder_grabber');
            this.isPointerOverMask = false;
        });

        slider.on('pointerdown', () => {
            slider.setTexture('v_slidder_grabber_hover');
        });

        slider.on('pointerup', () => {
            slider.setTexture('v_slidder_grabber');
        });

        let maxY = startY + maskHeight - 60;
        // maxY = maxY - maskHeight/2;

        slider.on('dragstart', () => {
            sliderBg.setTexture('nine_path_bg_2_stretched');
        });

        slider.on('drag', (pointer, dragX, dragY) => {
            slider.y = Phaser.Math.Clamp(dragY, startY, maxY);
            this.updateItemListPosition(slider.y, startY, maxY, totalContentHeight, maskHeight, scroll);
        });

        slider.on('dragend', () => {
            sliderBg.setTexture('nine_path_bg_stretched');
        });

        if (totalContentHeight <= maskHeight) {
            slider.setVisible(false);
            sliderBg.setVisible(false);
        }

        const updateSliderPosition = (newY) => {
            slider.y = Phaser.Math.Clamp(newY, startY, maxY);
            this.updateItemListPosition(slider.y, startY, maxY, totalContentHeight, maskHeight, scroll);
        };

        this.maskShape.on('pointerover', () => {
            this.isPointerOverMask = true;
            // console.log('pointerovermask true');
            
        });
        this.maskShape.on('pointerout', () => {
            this.isPointerOverMask = false;
            // console.log('pointerovermask false');
        });

       if (this.container.background)

        {
            this.container.background.setInteractive();
            this.container.background.on('pointerover', () => { this.isPointerOverMask = true; });
            this.container.background.on('pointerout', () => { this.isPointerOverMask = false; });

        }

        this.container.list.forEach(button => {
            if (button.type === 'Container') { // Assuming your buttons are containers
              // Find the image within the button container
              const image = button.list.find(child => child.type === 'Image');
     

              if (image) {
                  image.setInteractive();
                  image.on('pointerover', () => { this.isPointerOverMask = true; });
                  image.on('pointerout', () => { this.isPointerOverMask = false; });
              }
       
            }
            else if (button.type === 'Image')
            {
                
                button.setInteractive();
                button.on('pointerover', () => { this.isPointerOverMask = true; });
                button.on('pointerout', () => { this.isPointerOverMask = false; });
            }
        });

     
     



        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (this.isPointerOverMask) {
                const scrollSpeed = scroll;
                let newY = (scroll < 0) ? slider.y + deltaY * scrollSpeed * -1 : slider.y + deltaY * scrollSpeed;
                updateSliderPosition(newY);
            }
        });

        sliderBg.setInteractive();
        sliderBg.on('pointerdown', (pointer) => {
            const updatePosition = (pointer) => {
                const centerY = this.scene.scale.height / 2;
                const currentZoom = this.scene.cameras.main.zoom;
                let deltaY = centerY + (pointer.y - centerY) / currentZoom - slider.height / currentZoom;
                updateSliderPosition(deltaY);
            };

            updatePosition(pointer);

            const onPointerMove = (pointer) => updatePosition(pointer);
            const onPointerUp = () => {
                this.scene.input.off('pointermove', onPointerMove);
                this.scene.input.off('pointerup', onPointerUp);
                sliderBg.setTexture('nine_path_bg_stretched');
                slider.setTexture('v_slidder_grabber');
            };

            this.scene.input.on('pointermove', onPointerMove);
            this.scene.input.on('pointerup', onPointerUp);
            sliderBg.setTexture('nine_path_bg_2_stretched');
            slider.setTexture('v_slidder_grabber_hover');
        });

        if (scroll < 0) {
            slider.y = maxY;
        }

        this.slider = slider;
        this.sliderBg = sliderBg;
    }

    updateItemListPosition(sliderY, minY, maxY, totalContentHeight, maskHeight, scroll) {
    
        const startY = this.initialY;
       
        const scrollRange = maxY - minY;
        const scrollPercentage = (sliderY - minY) / scrollRange;
        // console.log('scrollpercentage: ', scrollPercentage);
        const maxScroll = totalContentHeight - maskHeight;
        const newY = (scroll < 0) ? startY + (maxScroll * (1 - scrollPercentage)) : startY - (maxScroll * scrollPercentage);

        // console.log('newY: ', newY);
        this.container.setPosition(this.container.x, newY);

        const maskTop = startY;
        const maskBottom = startY + maskHeight - 40;

        this.container.iterate((child) => {
            if (child instanceof Phaser.GameObjects.Image || child instanceof Phaser.GameObjects.Sprite || child instanceof Phaser.GameObjects.Text) {
                const childWorldY = this.container.y + child.y;
                if (childWorldY + child.height < maskTop || childWorldY > maskBottom) {
                    child.disableInteractive();
                } else {
                    child.setInteractive();
                }
            }
        });


    
    }



/*
    // Function to update the item list position based on scroll position
    updateItemListPosition2(scrollPosition) {
    // Adjust scrollPosition to account for initialY
    const adjustedScrollPosition = scrollPosition - this.initialY;

    // Calculate the total content height based on the message log
    const totalContentHeight = this.messageLog.length * this.itemHeight;
    
    // Calculate the scroll percentage based on the total content height
    const scrollPercentage = adjustedScrollPosition / (totalContentHeight-this.maskHeight);

    // Determine the start index of the first visible item
    const startIndex = Math.floor(adjustedScrollPosition / this.itemHeight);

    // Calculate the end index to determine which items to render
    const endIndex = Math.min(startIndex + Math.ceil(this.maskHeight / this.itemHeight) - 1, this.messageLog.length - 1);
    
    // Render the visible logs based on the updated message log
    this.renderVisibleLogs(startIndex, endIndex);
}
*/
updateItemListPosition2(sliderY) {
    const startY = this.initialY;
    //const totalContentHeight = this.messageLog.length * this.itemHeight;
    const totalContentHeight = this.totalLogs * this.itemHeight; // Use totalLogs instead of messageLog.length
    const scrollableRange = Math.max(0, totalContentHeight - this.maskHeight);

    // Calculate scroll position using slider position
    const sliderPosition = sliderY - startY;
    const scrollPercentage = sliderPosition / (this.maskHeight - this.slider.height);
    const scrollPosition = scrollPercentage * scrollableRange;

    // Ensure scroll position doesn't exceed the maximum
    const adjustedScrollPosition = Math.max(0, scrollPosition);
    const clampedScrollPosition = Math.min(adjustedScrollPosition, scrollableRange);

    // Calculate start and end indices
    const startIndex = Math.floor(clampedScrollPosition / this.itemHeight);
    //const endIndex = Math.min(
        //startIndex + Math.ceil(this.maskHeight / this.itemHeight),
        //this.messageLog.length - 1
    //);
    
const endIndex = Math.min(
        startIndex + Math.ceil(this.maskHeight / this.itemHeight),
        this.totalLogs - 1 // Use totalLogs instead of messageLog.length
    );
    // Render the visible logs
    this.renderVisibleLogs(startIndex, endIndex);

    // Debug logging
    //console.log('Scroll Position:', clampedScrollPosition);
    //console.log('Start Index:', startIndex);
    //console.log('End Index:', endIndex);
    //console.log('Total Items:', this.messageLog.length);

    return { startIndex, endIndex, clampedScrollPosition };
}

/*

   // Function to render the visible logs
    renderVisibleLogs(startIndex, endIndex) {
        // Clear the container of previously rendered items
        this.container.removeAll(true, true);

        // Add the new visible items using addNewTextItem
        for (let i = startIndex; i <= endIndex; i++) {
            const log = this.messageLog[i];
            this.addNewTextItem(log.type, log.text, log.fileName, log.sceneName, log.time);
        }
    }
*/


 // Render visible logs using getLogs
    renderVisibleLogs(startIndex, endIndex) {
        // Clear the container of previously rendered items
        this.container.removeAll(true, true);

        // Calculate the count of logs to retrieve
        const count = endIndex - startIndex + 1;

        // Retrieve logs using getLogs method
        const visibleLogs = this.getLogs(startIndex, count);

        // Add the new visible items using addNewTextItem
        visibleLogs.forEach(log => {
            if (log) { // Ensure log exists
                this.addNewTextItem(log.type, log.text, log.fileName, log.sceneName, log.timeStamp);
            }
        });
    }
///////////////attempt #3////////////
updateItemListPosition3(sliderY) {
    const startY = this.initialY;

    // Calculate the total content height based on totalLogs
    const totalContentHeight = this.totalLogs * this.itemHeight; // Based on totalLogs

    // Calculate scrollable range based on content height
    const scrollableRange = Math.max(0, totalContentHeight - this.maskHeight);

    // Calculate scroll position based on slider position
    const sliderPosition = sliderY - startY;
    const scrollPercentage = sliderPosition / (this.maskHeight - this.slider.height);
    const scrollPosition = scrollPercentage * scrollableRange;

    // Clamp the scroll position to ensure it stays within bounds
    const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, scrollableRange));

    // Calculate the Y position of the container based on originalSize
    const newY = this.initialY - (clampedScrollPosition + (this.originalSize - this.totalLogs) * this.itemHeight);
    this.container.setPosition(this.container.x, newY);

    // Calculate the start index for visible logs based on clamped scroll position
    const visibleItemCount = Math.ceil(this.maskHeight / this.itemHeight);
    let startIndex = Math.floor(clampedScrollPosition / this.itemHeight) % this.maxLogSize;

    // Calculate endIndex, wrapping around the circular array if necessary
    let endIndex = (startIndex + visibleItemCount - 1) % this.maxLogSize;

    // Update visible logs only if the visible range has changed
    // if (startIndex !== this.renderedStartIndex || endIndex !== this.renderedEndIndex) {
        this.updateVisibleLogs(startIndex, endIndex, clampedScrollPosition);
    // }

    // Update the current rendered range
    this.renderedStartIndex = startIndex;
    this.renderedEndIndex = endIndex;
}

updateVisibleLogs(startIndex, endIndex, clampedScrollPosition) {
    // Calculate the visible range based on the container's position
    const containerOffset = clampedScrollPosition + (this.originalSize - this.totalLogs) * this.itemHeight;
    const visibleStartY = containerOffset;
    const visibleEndY = visibleStartY + this.maskHeight;

    // Calculate the range of visual indices that should be visible
    const firstVisibleIndex = Math.floor(visibleStartY / this.itemHeight);
    const lastVisibleIndex = Math.ceil(visibleEndY / this.itemHeight) - 1;

    // Remove logs that are no longer visible
    for (let i = this.container.length - 1; i >= 0; i--) {
        const child = this.container.getAt(i);
        if (child.visualIndex < firstVisibleIndex || child.visualIndex > lastVisibleIndex) {
            child.destroy();
        }
    }

    // Add new logs that have come into view
    for (let visualIndex = firstVisibleIndex; visualIndex <= lastVisibleIndex; visualIndex++) {
        if (visualIndex >= 0 && visualIndex < this.originalSize) {
            const dataIndex = visualIndex % this.maxLogSize;
            
            if (!this.container.list.some(child => child.visualIndex === visualIndex)) {
                const log = this.messageLog[dataIndex];
                if (log) {
                    const yPos = visualIndex * this.itemHeight;
                    const textItem = this.addNewTextItem3(
                        log.type,
                        log.text,
                        log.fileName,
                        log.sceneName,
                        log.timeStamp,
                        yPos
                    );
                    textItem.visualIndex = visualIndex;
                    textItem.dataIndex = dataIndex;
                }
            }
        }
    }

    // Update positions of existing items
    this.container.list.forEach((child) => {
        child.y = child.visualIndex * this.itemHeight;
    });
}
// updateVisibleLogs(startIndex, endIndex, clampedScrollPosition) {
//     // Remove logs that are no longer visible
//     for (let i = 0; i < this.container.length; i++) {
//         const child = this.container[i];
//         if (child && child.logIndex)
//         {
//             if (child.logIndex < startIndex || child.logIndex > endIndex) {
//                 // Remove the log that is no longer visible
//                 child.destroy();  // Adjust according to your framework
//             }
//         }
        
//     }

//     // Add new logs that have come into view
//     for (let i = startIndex; i <= endIndex; i++) {
//         const logIndex = (this.logIndex + i) % this.maxLogSize; // Use nextLogIndex for circular reference

//         // If the log exists, add it to the container
//         if (this.messageLog[logIndex]) {
//             this.addNewTextItem2(
//                 this.messageLog[logIndex].type,
//                 this.messageLog[logIndex].text,
//                 this.messageLog[logIndex].fileName,
//                 this.messageLog[logIndex].sceneName,
//                 this.messageLog[logIndex].timeStamp,
//                 this.originalSize // Correctly using originalSize here for indexing
//             );
//         }
//     }

//     // Update positions of the visible items as needed
//     for (let i = 0; i < this.container.length; i++) {
//         const child = this.container[i];
//         if (child)
//         {
//             if (child.logIndex !== undefined) {
//                 // Calculate the display position based on originalSize
//                 child.y = child.logIndex * this.itemHeight; // Positioning based on log index
//             }
//         }
        
//     }
// }

////////////old123/////////
// updateItemListPosition3(sliderY) {
//     const startY = this.initialY;
//     const totalContentHeight = this.totalLogs * this.itemHeight;
//     const scrollableRange = Math.max(0, totalContentHeight - this.maskHeight);

//     // Calculate scroll position based on slider position
//     const sliderPosition = sliderY - startY;
//     const scrollPercentage = sliderPosition / (this.maskHeight - this.slider.height);
//     const scrollPosition = scrollPercentage * scrollableRange;

//     // Clamp the scroll position to ensure it stays within bounds
//     const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, scrollableRange));

//     // Adjust newY to account for initialY
//     const newY = this.initialY - clampedScrollPosition;
//     this.container.setPosition(this.container.x, newY);
//     //////////old//////////
//     // Calculate the start and end indices of the visible items
//     // const startIndex = Math.floor(clampedScrollPosition / this.itemHeight);
//     // const endIndex = Math.min(startIndex + Math.ceil(this.maskHeight / this.itemHeight), this.totalLogs - 1);



//     // // Calculate the start and end indices of the visible items, wrapping the indices in a circular manner
//     // const startIndex = Math.floor(clampedScrollPosition / this.itemHeight) % this.maxLogSize;
//     // const endIndex = (startIndex + Math.ceil(this.maskHeight / this.itemHeight)) % this.maxLogSize;

//     // Update only if the visible range has changed
//     // if (startIndex !== this.renderedStartIndex || endIndex !== this.renderedEndIndex) {
//         // this.updateVisibleLogs(startIndex, endIndex);
//     // }

//     //////new////////


//     // // Calculate the start index based on clamped scroll position
//     let startIndex = Math.floor(clampedScrollPosition / this.itemHeight) % this.maxLogSize;
//     const visibleItemCount = Math.ceil(this.maskHeight / this.itemHeight);

//     // // Calculate endIndex (circularly wrap around if needed)
//     let endIndex = (startIndex + visibleItemCount - 1) % this.maxLogSize;

//     // // Ensure the new items are visible by checking startIndex and endIndex correctly
//     // if (startIndex !== this.renderedStartIndex || endIndex !== this.renderedEndIndex) {
//         this.updateVisibleLogs(startIndex, endIndex);
//     // }

//     // Update the current rendered range
//     this.renderedStartIndex = startIndex;
//     this.renderedEndIndex = endIndex;
// }

/////////tryin something new////////

// updateItemListPosition3(sliderY) {
//     const startY = this.initialY;
//     const totalContentHeight = this.totalLogs * this.itemHeight;
//     const scrollableRange = Math.max(0, totalContentHeight - this.maskHeight);

//     // Calculate scroll position based on slider position
//     const sliderPosition = sliderY - startY;
//     const scrollPercentage = sliderPosition / (this.maskHeight - this.slider.height);
//     const scrollPosition = scrollPercentage * scrollableRange;

//     // Clamp the scroll position to ensure it stays within bounds
//     const clampedScrollPosition = Math.max(0, Math.min(scrollPosition, scrollableRange));

//     // Calculate the start index based on the actual scroll position
//     const startIndex = Math.floor(clampedScrollPosition / this.itemHeight);
//     const visibleItemCount = Math.ceil(this.maskHeight / this.itemHeight);
//     const endIndex = startIndex + visibleItemCount - 1;

//     // If visible range changes, update the displayed logs
//     if (startIndex !== this.renderedStartIndex || endIndex !== this.renderedEndIndex) {
//         this.updateVisibleLogs(startIndex, endIndex);
//     }

//     // Adjust the container's Y position based on the actual scroll position
//     const newY = this.initialY - clampedScrollPosition;
//     this.container.setPosition(this.container.x, newY);

//     // Update the current rendered range
//     this.renderedStartIndex = startIndex;
//     this.renderedEndIndex = endIndex;
// }
///////old 123////////
// updateVisibleLogs(startIndex, endIndex) {
//     // Remove logs that are no longer visible
//     this.container.each((child) => {
//         if (child.logIndex < startIndex || child.logIndex > endIndex) {
//             // Destroy or remove the logs that are no longer visible
//             // child.destroy();  // You can optimize this if needed
//         }
//     });

//     // Add new logs that have come into view
//     for (let i = startIndex; i <= endIndex; i++) {
//         // If the item with the current index isn't already displayed, add it
//         if (!this.container.list.some(child => child.logIndex === i)) {
//             const log = this.getLogs(i, 1)[0];
//             if (log) {
//                 this.addNewTextItem2(log.type, log.text, log.fileName, log.sceneName, log.timeStamp, i);
//             }
//         }
//     }

//     // You can update positions of the visible items as needed
//     this.container.each((child) => {
//         if (child.logIndex !== undefined) {
//             child.y = (child.logIndex - startIndex) * this.itemHeight;
//         }
//     });

//     // Update the rendered indices
//     this.renderedStartIndex = startIndex;
//     this.renderedEndIndex = endIndex;
// }


// updateVisibleLogs(startIndex, endIndex) {
//     // Remove logs that are no longer visible
//     this.container.each((child) => {
//         if (child.logIndex === undefined || child.logIndex < startIndex || child.logIndex > endIndex) {
//             //child.destroy();
//         }
//     });

//     // Add logs that have come into view
//     for (let i = startIndex; i <= endIndex; i++) {
//         if (!this.container.list.some(child => child.logIndex === i)) {
//             const log = this.getLogs(i, 1)[0];
//             if (log) {
//                 this.addNewTextItem2(log.type, log.text, log.fileName, log.sceneName, log.timeStamp, i);
//             }
//         }
//     }

//     // Update positions of existing items
//     //this.container.each((child) => {
//      //   if (child.logIndex !== undefined) {
//     //        child.y = (child.logIndex - startIndex) * this.itemHeight;
//       //  }
//     //});

//     // Update the rendered indices
//     this.renderedStartIndex = startIndex;
//     this.renderedEndIndex = endIndex;
// }
// updateVisibleLogs(startIndex, endIndex) {
//     // Remove logs that are no longer visible
//             const visibleItemCount = Math.ceil(this.maskHeight / this.itemHeight);

//     this.container.each((child) => {
//         if (child.logIndex === undefined || child.logIndex < startIndex || child.logIndex > endIndex) {
//             //child.destroy(); // You can uncomment this to actually remove the items if needed
//         }
//     });

//     // Add logs that have come into view
//     for (let i = 0; i <= visibleItemCount; i++) {
//         const circularIndex = (startIndex + i) % this.maxLogSize;
//         const renderedIndex = i; // This represents the position in the view
//         if (!this.container.list.some(child => child.logIndex === circularIndex)) {
//             const log = this.getLogs(circularIndex, 1)[0];
//             if (log) {
//                 this.addNewTextItem2(log.type, log.text, log.fileName, log.sceneName, log.timeStamp, circularIndex, renderedIndex);
//             }
//         }
//     }

//         // Update the rendered indices
//         this.renderedStartIndex = startIndex;
//         this.renderedEndIndex = endIndex;
//     }

    // updateVisibleLogs(startIndex, endIndex) {
    //     // Calculate how many items can be visible at once
    //     const visibleItemCount = Math.ceil(this.maskHeight / this.itemHeight);

    //     // Get the total number of logs available (in case the log array is partially filled)
    //     const totalLogsAvailable = this.totalLogs;

    //     // Adjust visibleItemCount if there are fewer logs than the container can display
    //     const actualItemCount = Math.min(visibleItemCount, totalLogsAvailable - startIndex);

    //     // Remove logs that are no longer visible
    //     this.container.each((child) => {
    //         if (child.logIndex === undefined || child.logIndex < startIndex || child.logIndex > endIndex) {
    //             // child.destroy(); // Optionally remove the items no longer in view
    //         }
    //     });

    //     // Add logs that have come into view
    //     for (let i = 0; i < actualItemCount; i++) {
    //         const circularIndex = (startIndex + i) % this.maxLogSize;
    //         const renderedIndex = i; // This represents the position in the view

    //         // Check if the log is already in the container
    //         if (!this.container.list.some(child => child.logIndex === circularIndex)) {
    //             const log = this.getLogs(circularIndex, 1)[0];
    //             if (log) {
    //                 this.addNewTextItem2(log.type, log.text, log.fileName, log.sceneName, log.timeStamp, circularIndex, renderedIndex);
    //             }
    //         }
    //     }

    //     // Update the rendered indices
    //     this.renderedStartIndex = startIndex;
    //     this.renderedEndIndex = endIndex;
    // }



    // cleanup() {
    //     // Destroy the mask
    //     if (this.mask) {
    //         this.mask.destroy();
    //         this.mask = null;
    //     }

    //     // Destroy the maskShape
    //     if (this.maskShape) {
    //         this.maskShape.destroy();
    //         this.maskShape = null;
    //     }
    //     // Destroy the slider
    //     if (this.slider) {
    //         this.slider.destroy();
    //         this.slider = null;
    //     }
    //     if (this.sliderBg) {
    //         this.sliderBg.destroy();
    //         this.sliderBg=null;
    //     }
    //     // Optionally, cleanup the container if it was created within the Slider
    //     if (this.container) {
    //         this.container.list.forEach(item => {
    //             if (item.removeAllListeners) {
    //                 item.removeAllListeners('pointerover');
    //                 item.removeAllListeners('pointerout');
    //             }
    //         });
    //         this.container.destroy();
    //         this.container.clearMask();
    //         this.container = null;
    //     }
    // }
    cleanup() {
        // Remove scene-level event listeners
        this.scene.input.off('wheel');
    
        // Clean up container and its children
        if (this.container) {
            this.container.list.forEach(item => {
                if (item.removeAllListeners) {
                    item.removeAllListeners('pointerover');
                    item.removeAllListeners('pointerout');
                }
                if (item.destroy) {
                    item.destroy();
                }
            });
            this.container.clearMask();
            this.container.destroy();
            this.container = null;
        }
    
        // Clean up mask and maskShape
        if (this.mask) {
            this.mask.destroy();
            this.mask = null;
        }
        if (this.maskShape) {
            this.maskShape.destroy();
            this.maskShape = null;
        }
    
        // Clean up slider and sliderBg
        if (this.slider) {
            this.slider.destroy();
            this.slider = null;
        }
        if (this.sliderBg) {
            this.sliderBg.destroy();
            this.sliderBg = null;
        }
    
        // Clean up any other properties
        this.isPointerOverMask = false;
        this.initialY = null;

        if (this.backgroundShape) {
            this.backgroundShape.destroy();
            this.backgroundShape = null;
        }

    }

    hide()
    {
        this.slider.setVisible(false);
        this.sliderBg.setVisible(false);
    }
    show()
    {
        this.slider.setVisible(true);
        this.sliderBg.setVisible(true);
    }
    update()

    {
        
    }
}
