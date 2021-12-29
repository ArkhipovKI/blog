const user = (state = null, action) => {
    switch(action.type){
        case "USERLOGIN": 
        return {
            state: {...action.payload.user}
        } ;
        case "USERLOGOUT": 
        return {
            state: null
        } ;
        default: return state;
    }
}

export default user;