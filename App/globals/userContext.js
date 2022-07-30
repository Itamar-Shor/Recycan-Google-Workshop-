import React from 'react';

export const defaultUser = {
    data: {
        firstname: '',
        surname: '',
        fullname: '',
        email: '',
        score: [0, 0, 0, 0, 0, 0, 0, 0],
        avatar: {
            avatarIdx: 0,
            avatarColor: "#000"
        },
    },
    loggedIn: false
}

export const UserContext = React.createContext({
    user: defaultUser
})