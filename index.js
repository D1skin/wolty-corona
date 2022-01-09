const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv
const axios = require('axios');
const orderBy = require('lodash.orderby');
const Table = require('cli-table');

const WOLT_EPS = {
        getLocationId: 'https://restaurant-api.wolt.com/v1/google/places/autocomplete/json?input=',
        getLocationGeo: 'https://restaurant-api.wolt.com/v1/google/geocode/json?place_id=',
        getRetail: 'https://restaurant-api.wolt.com/v1/pages/retail?',
        getMenu: 'https://restaurant-api.wolt.com/v4/venues/slug/'
}

//const itemTextToFind = "מגבוני נייר";  //for testing
const itemTextToFind = "בדיקת קורונה";

const COMPARATORS = {
        rating: 'rating.rating',
        price: 'price_range',
        deliveryTime: 'estimate',
        deliveryPrice: 'delivery_price'
}

const getRetailURLBuilder = (lat, lon) => `${WOLT_EPS.getRetail}lat=${lat}&lon=${lon}`;
const getMenuURLBuilder = (slug_id) => `${WOLT_EPS.getMenu}${slug_id}/menu?unit_prices=true`;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



async function run(){

        if(argv.help || argv.h){
                return `
Usage is 'wolty-corona "<location>"'
// If your location has space in it, use quotes.
// Also, please use precise location as there are no IO checks nor testing <3
// -h to show help
`
        }

        // Make sure we only get one arg
        if(argv._.length > 1) {
                return '❌ Immediate arg should be the location';
        }

        if(argv.sort){
                if(!COMPARATORS[argv.sort]) return `Invalid sort option, "${argv.sort}"; Use one of ${Object.keys(COMPARATORS).join(', ')}`
        }
        // 1. Get the location ID from wolt
        const woltLocations = await axios.get(`${WOLT_EPS.getLocationId}${encodeURIComponent(argv._[0])}`);
        const woltLocationId = woltLocations.data.predictions[0].place_id; // This is why we only use single arg with no verifications. Feel free to PR this <3

        // 2. Get coords from location
        const woltGeoResponse = await axios.get(`${WOLT_EPS.getLocationGeo}${woltLocationId}`);

        // Coords shape is {lat: number, lng: number}. Yes, no TS.
        const coords = woltGeoResponse.data.results[0].geometry.location;

        // results table
        const table = new Table({
                head: ['Name', 'Delivery est. (minutes)', 'Delivery price', 'Rating', 'Matching items']
        });

        // iterate until we get a result
        let first = true;
        console.log("entering loop:");
        do {
                console.log("*");
                // sleep if not first time
                if (first) {
                        first = false;
                } else {
                        await sleep(60000);
                };
                // find nearby retailers
                const nearbyRetail = (await axios.get(getRetailURLBuilder(coords.lat, coords.lng)))
                                                                                                .data
                                                                                                .sections[0] // not sure, wolt api ¯\_(ツ)_/¯
                                                                                                .items;

                // Filter for open & delivering
                let relevantVenues = nearbyRetail.filter(v=>v.venue.online && v.venue.delivers && v.venue.tags.includes("pharmacy"));


                // let's scan the "menu" for corona tests
                const arrReadyVenues = [].concat(relevantVenues);

                for (const venue of arrReadyVenues) {
                        let menuToSearch = (await axios.get(getMenuURLBuilder(venue.venue.slug)))
                                                                                                .data
                                                                                                .items;

                        let relevantItems = menuToSearch.filter(item=>item.name.includes(itemTextToFind));

                        if (relevantItems.length > 0) {
                                table.push( [ venue.venue.name,
                                              venue.venue.estimate,
                                              venue.venue.delivery_price,
                                              new Array(Number((venue.venue.rating|| {}).rating) || 0).fill('★').join(''),
                                              new Array(Number(relevantItems.length) || 0).fill('🤧').join(''),
                                            ] );
                        };
                };

        }
        while (table.length == 0);


        return table.toString();
}

run().then(console.log).catch(console.error);
