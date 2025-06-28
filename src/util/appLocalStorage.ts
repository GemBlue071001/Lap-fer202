const appLocalStorage = {
    getItem: (key: string): any | undefined => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : undefined;
        } catch (error) {
            console.error(`Error getting item from localStorage: ${error}`);
            return undefined;
        }
    },
    setItem: (key: string, value: any): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item in localStorage: ${error}`);
        }
    },
    removeItem: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error setting item in localStorage: ${error}`);
        }
    }
}

export default appLocalStorage;