export const useHttpRequest = () => {

    // const baseUrl = 'http://kata.academy:8022'
    const baseUrl = 'https://cirosantilli-realworld-next.herokuapp.com'
    const token = localStorage.getItem('token');

    async function requestArticles (page) {

        const url = new URL('api/articles', baseUrl)
        url.searchParams.append('limit', 6)
        url.searchParams.append('offset', page*6)

        try{
            let responce = null;

            !token 
                ?responce = await fetch(url)
                :responce = await fetch(url, {
                    headers: {
                        'Authorization': `Token ${token}`
                      }})
       

        if(!responce.ok){
            throw new Error('error list')
        }

        const articles = await responce.json()
        return articles;

        }catch (e) {
            return e
        }

    } 

    async function requestArticle (slug) {
    
        const url = new URL(`api/articles/${slug}`, baseUrl)

        try{
            const responce = await fetch(url);
    
            if(!responce.ok){
                throw new Error('error article')
            }
    
            const articles = await responce.json()
            return articles;
    
        }catch (e) {
            return e
        }
    }

    async function registerUser (data) {

        const url = new URL('/api/users', baseUrl)

        try{
            const responce = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({user: data})
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    const er = await responce.json()
                    throw new Error(er.errors)
                }else{
                    throw new Error('Something went wrong. Try later.')
                }
            }
    
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }
    }

    async function logInUser (data) {

        const url = new URL('/api/users/login', baseUrl)

        try{
            const responce = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({user: data})
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    throw new Error('email or password is invalid')
                }else{
                    throw new Error('Something went wrong. Try later.')
                }
            }
    
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }
    }

    async function getUser (){

        const url = new URL('/api/user', baseUrl);
        try{
            if(!token){
                throw new Error('You are not authorized')
            }

            const responce = await fetch(url, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${token}`
                  },
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    const er = await responce.json()
                    throw new Error(er.errors)
                }else{
                    throw new Error('Something went wrong. Try later.')
                }
            }
    
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }

    }

    async function editUser (data) {

        const url = new URL('/api/user', baseUrl);

        try{
            if(!token){
                throw new Error('You are not authorized')
            }

            const responce = await fetch(url, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                  },
                body: JSON.stringify({user: {
                    email: data.email,
                    token: token,
                    username: data.name,
                    bio: null,
                    image: data.avatar
                  }})
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    const er = await responce.json()
                    throw new Error(Object.values(er.errors)[0][0])
                }else{
                    throw new Error('Something went wrong. Try later.')
                }
            }
            
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }
    }

    async function createArticle ({title, descr, text}, tagList) {

        const url = new URL('/api/articles', baseUrl);

        try{
            if(!token){
                throw new Error('You are not authorized')
            }

            const responce = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({article: {
                    title: title,
                    description: descr,
                    body: text,
                    tagList: tagList
                  }})
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    const er = await responce.json()   
                    throw new Error(er.errors)
                }else{     
                    throw new Error('Something went wrong. Try later.')
                }
            }
    
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }
    }

    async function editArticle ({article}) {
        
        const url = new URL(`/api/articles/${article.slug}`, baseUrl);

        try{
            if(!token){
                throw new Error('You are not authorized')
            }

            const responce = await fetch(url, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(article)
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    const er = await responce.json()      
                    throw new Error(er.errors)
                }else{
                    throw new Error('Something went wrong. Try later.')
                }
            }
    
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }
    }

    async function delArticle (slug) {

        const url = new URL(`/api/article/${slug}`, baseUrl);

        try{
            if(!token){
                throw new Error('You are not authorized')
            }

            const responce = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
    
            if(!responce.ok){
                if(responce.status === 422){
                    const er = await responce.json()      
                    throw new Error(er.errors)
                }else{
                    throw new Error('Something went wrong. Try later.')
                }
            }
    
            const user = await responce.json()
            return (user);
    
        }catch (e) {
            return e
        }
    }

    async function likeOn (slug) {

        const url = new URL(`/api/articles/${slug}/favorite`, baseUrl);

        if(!token){
            throw new Error('You are not authorized')
        }

        const responce = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if(!responce.ok){
            return false
        }

        const article = responce.json()

        return article;
    }

    async function likeOff (slug) {

        const url = new URL(`/api/articles/${slug}/favorite`, baseUrl);

        if(!token){
            throw new Error('You are not authorized')
        }

        const responce = await fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if(!responce.ok){
            return false
        }
        const article = responce.json()
        return article;
    }

    return {requestArticles, 
        requestArticle, 
        registerUser, 
        logInUser, 
        getUser, 
        editUser,
        createArticle,
        editArticle,
        delArticle,
        likeOn,
        likeOff};
}