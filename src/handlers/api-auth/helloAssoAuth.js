const encodedParams = new URLSearchParams();


const getTokens = () => {
    const url = 'https://api.helloasso.com/oauth2/token';
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedParams
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
}
