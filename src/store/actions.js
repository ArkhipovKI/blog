export const usIn = (payload) => ({ type: "USERLOGIN" , payload});

export const usOut = () => ({ type: "USERLOGOUT"});

export const editArt = (payload) => ({ type: "EDITARTICLE", payload});

export const clearArt = () => ({ type: "CLEARARTICLE"});