import Country from '../utils/country.mjs';

const api = (fetch) => ({
    worldometers: (body) => {
        return new Promise( async (fulfill, reject) => {
            try {
                const generalToday = await fetch('https://disease.sh/v3/covid-19/all', 
                    { method: 'GET',headers: {'Content-Type': 'application/json'} }
                );
                const generalYesterday = await fetch('https://disease.sh/v3/covid-19/all?yesterday=1', 
                    { method: 'GET',headers: {'Content-Type': 'application/json'} }
                );
                const generalAnteayer = await fetch('https://disease.sh/v3/covid-19/all?twoDaysAgo=1', 
                    { method: 'GET',headers: {'Content-Type': 'application/json'} }
                );

                let generalData = {
                    today: await generalToday.json(),
                    yesterday: await generalYesterday.json(),
                    anteayer: await generalAnteayer.json(),
                };

                const countriesToday = await fetch('https://disease.sh/v3/covid-19/countries', 
                    { method: 'GET',headers: {'Content-Type': 'application/json'} }
                );
                const countriesYesterday = await fetch('https://disease.sh/v3/covid-19/countries?yesterday=1', 
                    { method: 'GET',headers: {'Content-Type': 'application/json'} }
                );

                const countriesTodayObj = await countriesToday.json();
                const countriesYesterdayObj = await countriesYesterday.json();

                let countriesData = countriesTodayObj.map((country, index) => {
                    const testsYesterday = countriesYesterdayObj[index].tests;
                    let countryObj = new Country(
                        country.cases,
                        country.todayCases,
                        country.recovered,
                        country.todayRecovered,
                        country.deaths,
                        country.todayDeaths,
                        country.tests,
                        testsYesterday,
                        country.updated,
                        country.active,
                        country.critical,
                        country.country
                    );
                    return countryObj.getCountry();
                });

                fulfill({generalData: generalData, countriesData: await countriesData})

            } catch (e) {
                reject(e)
            }
        })
    },
})

export default api;