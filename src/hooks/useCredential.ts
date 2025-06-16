import { useState, useEffect } from 'react';
import appLocalStorage from '../util/appLocalStorage';
import { localKeyItem } from '../util/localKeyItem';

export const useCredential = () => {
    const [credential, setCredential] = useState<string | undefined>(undefined);

    useEffect(() => {
        const storedCredential = appLocalStorage.getItem(localKeyItem.userCredential);
        if (storedCredential) {
            setCredential(storedCredential);
        } else {
            setCredential(undefined);
        }
    }, []);

    const updateCredential = (newCredential: string | undefined) => {
        if (newCredential) {
            appLocalStorage.setItem(localKeyItem.userCredential, newCredential);
        } else {
            appLocalStorage.removeItem(localKeyItem.userCredential);
        }
        setCredential(newCredential);
    };

    return {
        credential,
        updateCredential
    };
};
