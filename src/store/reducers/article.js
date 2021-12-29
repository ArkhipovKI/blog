const article = (state = null, action) => {
    switch(action.type){
        case "EDITARTICLE": 
        return {
            state: {...action.payload}
        } ;
        case "CLEARARTICLE": 
        return {
            state: null} ;
        default: return state;
    }
}

export default article;