class Item {
    constructor(key, quantity = null) {
        // Assume globals.itemData is available and holds item information
        const itemData = globals.itemData; // Reference to the item data array
        const originalData = itemData.find(item => item.key === key);
        
        if (!originalData) {
            throw new Error(`Item with key "${key}" not found in item data.`);
        }

        // Assign properties from original data
        Object.assign(this, originalData);
        
        // Initialize quantity based on the provided argument
        // this.quantity = quantity;
        this.quantity = quantity !== null ? quantity : (originalData.quantity || 0);
    }

   
    toSerializableObject() {
        return {
            key: this.key,
            quantity: this.quantity
        };
    }
    // Deserialization from saved data
    static fromSerializableObject(data) {
        return new Item(data.key, data.quantity);
    }
    

    
}
