class Country {
    constructor(
    cases,
    todayCases,
    recovered,
    todayRecovered,
    deaths,
    todayDeaths,
    tests,
    testsYesterday,
    updated,
    active,
    critical,
    countryName
    ){
        this.cases = cases;
        this.todayCases = todayCases;
        this.recovered = recovered;
        this.todayRecovered = todayRecovered;
        this.deaths = deaths;
        this.todayDeaths = todayDeaths;
        this.tests = tests;
        this.testsYesterday = testsYesterday;
        this.updated = updated;
        this.active = active;
        this.critical = critical;
        this.countryName = countryName;
    }

    getCountry(){
        var updated = new Date(this.updated).toLocaleDateString("en-US");
        const testsToday = (this.tests - this.testsYesterday);
        return {
            countryName: this.countryName,
            cases: this.cases,
            todayCases: this.todayCases,
            recovered: this.recovered,
            todayRecovered: this.todayRecovered,
            deaths: this.deaths,
            todayDeaths: this.todayDeaths,
            tests: this.tests,
            testsToday: testsToday,
            active: this.active,
            critical: this.critical,
            updated: updated
        }
    }
}

export default Country;