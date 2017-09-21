//https://developers.google.com/url-shortener/v1/getting_started

const MY_BASE_URL = "http://readmytextto.me/";
const MY_SHARE_URL = "https://readmytextto.me/share/"
const GOOGLE_BASE_URL = "https://goo.gl/";
const EXPAND_URL = "https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/";
const SHORTEN_URL = "https://www.googleapis.com/urlshortener/v1/url/";
const API_KEY = "key=AIzaSyC8MGlC_QWoOptrXb7jYmFrBRPaEIPpZLY";

module.exports = {
    urlToText:  function(key) {
        return new Promise((resolve, reject) => {
            let url = EXPAND_URL + key + "&" + API_KEY; 
            fetch(url).then((response) => {
                if(response.status !== 200){
                    reject("API call failed, status code: "
                        + response.status);
                }
                return response.json();
            })

            .then((data) => {
                let text = data.longUrl.substring(MY_BASE_URL.length);
                resolve(decodeURI(text));
            })

            .catch((err) => {
                reject("fetch error: ", err);
            });
        });
    },

    textToUrl: function(inText) {
        return new Promise((resolve, reject) => {
            let url = SHORTEN_URL + "?" + API_KEY;
            let header = new Headers();
            header.append("Content-Type", "application/json");
            let data = JSON.stringify({'longUrl': MY_BASE_URL + encodeURI(inText)});
            let myInit = {
                method: 'POST',
                headers: header,
                mode: 'cors',
                body: data};

            fetch(url, myInit).then((response) => {
                if(response.status !== 200){
                    reject("API call failed, status code: "
                        + response.status);
                }
                return response.json();
            })

            .then((data) => {
                let outUrl = MY_SHARE_URL + data.id.substring(GOOGLE_BASE_URL.length);
                resolve(outUrl);
            })

            .catch((err) => {
                reject("fetch error: ", err);
            });
        });
    
    }
};
