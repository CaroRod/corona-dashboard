import express from "express";
import path from "path";
import fetch from 'node-fetch';
import api from './middleware/index.mjs';
import Chart from './utils/chart.mjs'
import paginate from 'express-paginate';

const app = express();
app.set("port", process.env.PORT || 3000);

// View engine
const __dirname = path.resolve();
app.set("view engine", 'ejs');
app.set("views",path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

const apifetched = api(fetch);
app.use(paginate.middleware(10, 20));

// Route
const router = express.Router();
router.get("/", (req,res) => {

    apifetched.worldometers(req)
    .then(response => {
        // Data for charts
        const generalData = response.generalData;
        
        const casesOptions = new Chart('New cases by day', [(generalData.today.cases - generalData.yesterday.cases),(generalData.yesterday.cases - generalData.anteayer.cases)]);
        const recoveredOptions = new Chart('Recovered cases by day', [(generalData.today.recovered - generalData.yesterday.recovered),(generalData.yesterday.recovered - generalData.anteayer.recovered)]);
        const deathsOptions = new Chart('Deceased cases by day', [(generalData.today.deaths - generalData.yesterday.deaths),(generalData.yesterday.deaths - generalData.anteayer.deaths)]);
        
        // Data for counties table
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const countriesData = response.countriesData.slice(startIndex, endIndex);
        const countries = response.countriesData;
        const itemCount = Object.keys(countries).length;
        const pageCount = Math.ceil(itemCount / limit);

        const paginator = paginate.getArrayPages(req)(5, pageCount, page);
        let paginatorObj = paginator.map((item, index) => {
            let active = (item.number == page)?'active':'';
            return '<a href="'+item.url+'" class="'+active+'">'+item.number+'</a>';
        });

        // Data for global data per day table 
        const generalTable = [
            {
                date: new Date(generalData.today.updated).toLocaleDateString("en-US"),
                cases: generalData.today.cases,
                recovered: generalData.today.recovered,
                deaths: generalData.today.deaths
            },
            {
                date: new Date(generalData.yesterday.updated).toLocaleDateString("en-US"),
                cases: generalData.yesterday.cases,
                recovered: generalData.yesterday.recovered,
                deaths: generalData.yesterday.deaths
            }
        ];

        let maxCases = generalTable.reduce((max, obj) => (max.cases > obj.cases) ? max.cases : obj.cases);
        let maxRecovered = generalTable.reduce((max, obj) => (max.recovered > obj.recovered) ? max.recovered : obj.recovered);
        let maxDeaths = generalTable.reduce((max, obj) => (max.deaths > obj.deaths) ? max.deaths : obj.deaths);

        res.render("index", {
            casesData: JSON.stringify(casesOptions.getChart()), 
            recoveredData: JSON.stringify(recoveredOptions.getChart()), 
            deathsData: JSON.stringify(deathsOptions.getChart()),
            
            countriesData: countriesData,
            page,
            limit,
            paginator: paginatorObj,

            generalTable: generalTable,
            maxCases: maxCases,
            maxRecovered: maxRecovered,
            maxDeaths: maxDeaths
        });
    });
});

app.use(router);

app.listen(app.get("port"), () => {
    console.log("Server running on port: " + app.get("port"));
});