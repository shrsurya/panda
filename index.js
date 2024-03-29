const request = require('request-promise');
let CityAlert = require("./city-alerts");

//const ACCUWEATHER_API_KEY = "VXKNIrJxoGufQcmyeZm3lk3gm7FZAG5i";
const ACCUWEATHER_API_KEY = "6ac6lHqSLbmW7RePsn7KC456OWzQEM9R";
const ACCUWEATHER_BASE_URL = "http://dataservice.accuweather.com/";
const BIG_PANDA_APP_KEY = "c4dd158bafc95a4c2c3a22065a888eac";
const BIG_PANDA_AUTH_TOKEN = "504c92e6d59f9deda21869cb4ca1cd72";
const BIG_PANDA_BASE_URL = "https://api.bigpanda.io/data/v2/alerts";

function fetchData(url) {

    let requestUrl = url + "currentconditions/v1/topcities/50?" + `apikey=${ACCUWEATHER_API_KEY}`;
    request(requestUrl)
      .then(function(body) {
        let data = JSON.parse(body);
        // data = data.slice(0,10);
        let cities = data.map(city => {
          return new CityAlert(city);
        });
        return Promise.resolve(cities);
      })
      .catch(function(err) {
        console.log("request failed")
        return Promise.reject()
      })
      .then(function(cities) {
        let cityJSONS = cities.map(function(city) {
          return city.toJSON();
        });
        let pandasRequestBody = {
          "app_key": BIG_PANDA_APP_KEY,
          "alerts": cityJSONS
        };
        console.log(pandasRequestBody)
        return pandasRequest(pandasRequestBody);
      })
      .catch(function(err) {
        console.log("request failed")
        return Promise.reject()
      })
      .then(function(res) {
        console.log(res);
      });
}

function pandasRequest(pandasRequestBody) {
  let options = {
    method: 'POST',
    uri: BIG_PANDA_BASE_URL,
    headers: {
      "Authorization": `Bearer ${BIG_PANDA_AUTH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pandasRequestBody),
  }
  return request(options);
}

fetchData(ACCUWEATHER_BASE_URL);
