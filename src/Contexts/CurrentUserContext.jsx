import React, { createContext, useState } from 'react';



export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('currentUser')) || null;
    }
    );

    const updateCurrentUser = (user) => {
        setCurrentUser(user);
    };



    return (
        <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
}