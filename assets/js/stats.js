function eventPercentageAttendance(event){
    let percentOfAttendance = (Object.values(event)[9] / event.capacity)*100
    //return (Object.keys(event)[9] == "estimate")? percentOfAttendance + "% (estimated)": percentOfAttendance + "%";
    return percentOfAttendance.toFixed(2) + "%";
}

function eventRevenues(event){
    let revenues = Object.values(event)[9] * event.price;
    //return (Object.keys(event)[9] == "estimate")? "$" + revenues + " (estimated)": "$" + revenues;
    return revenues;
}


//Retornamos los eventos de mayor asistencia (máximo 10 eventos)
function getHighestPercentageAttendanceEventsIndexes(eventsData, eventsIndexes){
    let orderedEventsIndexes = eventsIndexes;
    orderedEventsIndexes.sort((a,b) => {
        //let percentageAttendanceA = Object.values(eventsData.events[a])[9]/Object.values(eventsData.events[a])[8];
        let percentageAttendanceA = eventPercentageAttendance(eventsData.events[a]);
        //let percentageAttendanceB = Object.values(eventsData.events[b])[9]/Object.values(eventsData.events[a])[8];
        let percentageAttendanceB = eventPercentageAttendance(eventsData.events[b]);
        if(percentageAttendanceA == percentageAttendanceB) return 0;
        if(percentageAttendanceA > percentageAttendanceB) return -1;
        return 1;
    })
    return (orderedEventsIndexes.length > 10)? 
                orderedEventsIndexes.slice(0,10) : 
                orderedEventsIndexes;
}

//Retornamos los eventos de menor asistencia (máximo 10 eventos)
function getLowestPercentageAttendanceEventsIndexes(eventsData, eventsIndexes){
    let orderedEventsIndexes = eventsIndexes;
    orderedEventsIndexes.sort((a,b) => {
        let percentageAttendanceA = eventPercentageAttendance(eventsData.events[a]);
        let percentageAttendanceB = eventPercentageAttendance(eventsData.events[b]);
        if(percentageAttendanceA == percentageAttendanceB) return 0;
        if(percentageAttendanceA < percentageAttendanceB) return -1;
        return 1;
    })
    return (orderedEventsIndexes.length > 10)? 
                orderedEventsIndexes.slice(0,10) : 
                orderedEventsIndexes;
}

//Retornamos los eventos de mayor capacidad (máximo 10 eventos)
function getLargerCapacityEventsIndexes(eventsData, eventsIndexes){
    let orderedEventsIndexes = eventsIndexes;
    orderedEventsIndexes.sort((a,b) => {
        let eventCapacityA = eventsData.events[a].capacity;
        let eventCapacityB = eventsData.events[b].capacity;
        if(eventCapacityA == eventCapacityB) return 0;
        if(eventCapacityA > eventCapacityB) return -1;
        return 1;
    })
    return (orderedEventsIndexes.length > 10)? 
                orderedEventsIndexes.slice(0,10) : 
                orderedEventsIndexes;
}

function getEventsCategoriesStats(eventsData, eventIndexes, categories){
    let categoriesStats = [];
    categories.forEach(category => {
        let categoryRevenues = 0;
        let categoryAttendance = 0;
        let categoryCapacity = 0;
        eventIndexes.forEach(index => {
            if(eventsData.events[index].category == category){
                categoryRevenues += eventsData.events[index].price * Object.values(eventsData.events[index])[9];
                categoryAttendance += Object.values(eventsData.events[index])[9];
                categoryCapacity += eventsData.events[index].capacity;
            }
        });
        categoriesStats.push({
            category : category,
            revenues : categoryRevenues,
            percentOfAttendance : (categoryAttendance/categoryCapacity)*100
        });
    })
    return categoriesStats;
}

function fillTop10EventsStatsTable(eventsData, eventsIndexes, tableId){
    const table = document.getElementById(tableId);
    let pastEventIndexes = getFilteredByDateEventsIndexes(eventsData, "past");
    let highestPercentageAttendanceEventsIndexes = getHighestPercentageAttendanceEventsIndexes(eventsData, pastEventIndexes);
    let lowestPercentageAttendanceEventsIndexes = getLowestPercentageAttendanceEventsIndexes(eventsData, pastEventIndexes)
    let largerCapacityEventsIndexes = getLargerCapacityEventsIndexes(eventsData, eventsIndexes);

    let numberOfRows = Math.max(highestPercentageAttendanceEventsIndexes.length, 
                                lowestPercentageAttendanceEventsIndexes.length,
                                largerCapacityEventsIndexes.length);

    for(let i=0; i<numberOfRows; i++){
        let row = table.insertRow();
        let highestPOfACell = row.insertCell(0);
        highestPOfACell.innerHTML = eventsData.events[highestPercentageAttendanceEventsIndexes[i]].name + 
                                    ":\xa0\xa0\xa0\xa0\xa0\xa0" + 
                                    eventPercentageAttendance(eventsData.events[highestPercentageAttendanceEventsIndexes[i]]);
        let lowestPOfACell = row.insertCell(1);
        lowestPOfACell.innerHTML = eventsData.events[lowestPercentageAttendanceEventsIndexes[i]].name + 
                                    ":\xa0\xa0\xa0\xa0\xa0\xa0" + 
                                    eventPercentageAttendance(eventsData.events[lowestPercentageAttendanceEventsIndexes[i]]);
        let largerCapacityCell = row.insertCell(2);
        largerCapacityCell.innerHTML = eventsData.events[largerCapacityEventsIndexes[i]].name + 
                                        ":\xa0\xa0\xa0\xa0" + 
                                        eventsData.events[largerCapacityEventsIndexes[i]].capacity.toLocaleString();
    };

}


function fillEventsCategoriesStatsTable(eventsCategoriesStats, tableId) {
    const table = document.getElementById(tableId);
    eventsCategoriesStats.forEach(categoryStats => {
        let row = table.insertRow();
        let categoryCell = row.insertCell(0);
        categoryCell.innerHTML = categoryStats.category;
        let revenuesCell = row.insertCell(1);
        revenuesCell.innerHTML = "U$S " + categoryStats.revenues.toLocaleString();
        let percentOfAttendanceCell = row.insertCell(2);
        percentOfAttendanceCell.innerHTML = categoryStats.percentOfAttendance.toFixed(2) + "%";
    });
}


async function stats(urlApi) {
    try {
        const response = await fetch(urlApi);
        let data = await response.json();

        let allEventsIndexes = getFilteredByDateEventsIndexes(data, "all");
        let upcomingEventIndexes = getFilteredByDateEventsIndexes(data, "upcoming");
        let pastEventIndexes = getFilteredByDateEventsIndexes(data, "past");
        let upcomingEventscategories = getCategories(data, upcomingEventIndexes);
        let pastEventscategories = getCategories(data, pastEventIndexes);
        
        let upcomingEventsCategoriesStats = getEventsCategoriesStats(data, upcomingEventIndexes, upcomingEventscategories);
        let pastEventsCategoriesStats = getEventsCategoriesStats(data, pastEventIndexes, pastEventscategories);
        
        fillTop10EventsStatsTable(data, allEventsIndexes, "generalEventsStatsTableBody")
        fillEventsCategoriesStatsTable(upcomingEventsCategoriesStats, "upcomingEventsStatsTableBody");
        fillEventsCategoriesStatsTable(pastEventsCategoriesStats, "pastEventsStatsTableBody");
    }
    catch(error) {
        console.log("ERROR: " + error)
    }
}

let urlApi = " https://mindhub-xj03.onrender.com/api/amazing";

stats(urlApi);