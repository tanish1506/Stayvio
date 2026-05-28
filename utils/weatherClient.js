//Geocode destination string(lat,lon)
module.exports.geocode = async(destination) => {
    try{
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`
        const response = await fetch(url);
        const data = await response.json();

        if(!data.results || data.results.length === 0) return null;

        const {latitude , longitude} = data.results[0];
        return {lat : latitude,lon : longitude};

    }catch (err){
        return null;
    }
}

module.exports.getForecast = async(lat,lon,startDate,endDate)=> {
    try{
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${startDate}&end_date=${endDate}&timezone=Asia%2FKolkata`;
        const response = await fetch(url);
        const data = await response.json();

        if(!data.daily) return null;

        return data.daily;
    }catch (err){
        return null;
    }
}