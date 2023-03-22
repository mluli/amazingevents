

function searchEventResponse(){
    let searchKey = document.getElementById("searchInput").value.toLowerCase();
    fillCardContainer(getHTMLSelectedEvents(data, pastEventIndexes, checkboxes, searchKey, "past"), "cardContainer");
}

let pastEventIndexes = getFilteredByDateEventsIndexes(data, "past");
let categories = getCategories(data, pastEventIndexes);

fillCardContainer(buildHTMLEventsOfInterestCardList(data, pastEventIndexes, "past"), "cardContainer");
fillCheckboxContainer(buildHTMLCategoryCheckboxList(categories), "checkboxContainer")


let checkboxes = document.querySelectorAll("input[type=checkbox]");
let input = document.getElementById("searchInput");
let cleanSearchBarButton = document.getElementById("cleanSearchBarButton");


//EVENTO: keyup (searchInput) ===========================================
input.addEventListener("keyup", (event) => {
    searchEventResponse();
})

//EVENTO: change (checkboxes) ==============================
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        searchEventResponse()
    })
})

//EVENTO: click (cleanSearchBarButton) ==============================
cleanSearchBarButton.addEventListener("click", () => {
    checkboxes.forEach(checkbox => checkbox.checked = false)
    input.value = "";function buildHTMLEventCard(eventData){
        return `<div class="card border-dark rounded-0 sombreado m-4" style="width: 15rem;">
            <img src="${eventData.image}" class="card-img-top border border-dark mt-3 sombreado" alt="food fair">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-center">${eventData.name}</h5>
                <p class="card-text text-center">${eventData.description}</p>
                <div class="mt-auto">
                    <div class="d-flex align-items-center justify-content-between mx-0">
                        <p>Price $${eventData.price}</p>
                        <a href="./details.html?id=${eventData._id}" class="btn bg-dark text-light rounded-0 sombreado mb-3">Ver
                            más</a>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    
    function buildHTMLCategoryCheckbox(category, idCheckbox){
        return `<div class="form-check form-check-inline">
        <input class="form-check-input rounded-0 border-dark" type="checkbox" id="${idCheckbox}"
            value="${category.toLowerCase()}">
        <label class="form-check-label" for="${idCheckbox}">${category}</label>
    </div>`;
    }
    
    
    function buildHTMLNoMatchesCard(){
        return `<div class="card border-dark rounded-0 sombreado m-4" style="width: 15rem;">
        <img src="./assets/images/noMatches.png" class="card-img-top mt-3 sombreado" alt="food fair">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title text-center">There are no matches for your search...</h5>
            <p class="card-text text-center">Maybe you want to try something else. We have many interesting events!</p>
        </div>
    </div>`
    }
    
    
    function fillCardContainer(htmlCardsData, idCardContainer){
        let cardContainer = document.getElementById(idCardContainer);
        cardContainer.innerHTML = htmlCardsData;
    }
    
    
    function fillCheckboxContainer(htmlCheckboxesData, idCheckboxContainer){
        let checkboxContainer = document.getElementById(idCheckboxContainer);
        checkboxContainer.innerHTML = htmlCheckboxesData;
    }
    
    
    function dateEventSelector(eventsData, eventIndex, dateSelector){
        let currentDate;
        let eventDate;
        switch (dateSelector) {
            case "upcoming":
                currentDate = new Date(eventsData.currentDate);
                eventDate = new Date(eventsData.events[eventIndex].date);
                return (eventDate > currentDate)? true : false;            
            case "past":
                currentDate = new Date(eventsData.currentDate);
                eventDate = new Date(eventsData.events[eventIndex].date);
                return (eventDate < currentDate)? true : false;            
            case "all":
                return true;
            default:
                console.error(`Not valid selector: Use "upcoming"/"past"/"all"`)
                break;
        }
    }
    
    
    function getFilteredByDateEventsIndexes(eventsData, dateSelector){
        let indexes = [];
        eventsData.events.forEach( event => {
            let index = eventsData.events.indexOf(event);
            if(dateEventSelector(eventsData, index, dateSelector)){
                indexes.push(eventsData.events.indexOf(event));
            }
        });
        return indexes;
    }
    
    
    function buildHTMLEventsOfInterestCardList(eventsData,eventsOfInterestIndexes,dateSelector){
        let htmlEventsList = "";
        eventsOfInterestIndexes.forEach( index => {
            if(dateEventSelector(eventsData, index, dateSelector)){
                htmlEventsList += buildHTMLEventCard(eventsData.events[index]);
            }
        });
        return htmlEventsList;
    }
    
    
    function getCategories(eventsData, eventsIndexes){
        let categories = [];
        eventsIndexes.forEach( index => {
            if(!categories.includes(eventsData.events[index].category)){
                categories.push(eventsData.events[index].category);
            }
        });
        return categories;
    }
    
    
    function buildHTMLCategoryCheckboxList(categories){
        let htmlCategoryCheckboxList = "";
        categories.forEach(category => {
            htmlCategoryCheckboxList += buildHTMLCategoryCheckbox(category, ("checkbox_" + categories.indexOf(category)));
        })
        return htmlCategoryCheckboxList;
    }
    
    
    //Función en desuso!
    function getCheckboxesStates(checkboxes){
        let states = [];
        for(let checkbox of checkboxes){states.push(checkbox.checked)};
        return states;
    }
    
    
    function getSelectedEventsByCategoryIndexes(eventsData, evenstIndexes, checkboxes){
        let selectedEventsIndexes = [];
        let checkboxesStates = getCheckboxesStates(checkboxes);
        if(!checkboxesStates.some(state => state == true)){
            selectedEventsIndexes = evenstIndexes;
        }
        else{
            checkboxes.forEach(checkbox => {
                if(checkbox.checked){
                    evenstIndexes.forEach(index =>{
                        if(eventsData.events[index].category.toLowerCase() == checkbox.value){
                            selectedEventsIndexes.push(eventsData.events.indexOf(eventsData.events[index]));
                        }
                    });
                }
            });
        }
        return selectedEventsIndexes;
    }
    
    
    function getSelectedEventsBySearchImputIndexes(eventsData, eventIndexes, searchKey){
        let selectedEventsIndexes = [];
        eventIndexes.forEach(index => {
            if(searchKey == ""){
                selectedEventsIndexes = eventIndexes;
            }
            else if(eventsData.events[index].name.toLowerCase().includes(searchKey) || 
                    data.events[index].description.toLowerCase().includes(searchKey)){
                    selectedEventsIndexes.push(index);
            }
        });
        return selectedEventsIndexes;
    }
    
    
    function eventsSelector(eventsData, eventsIndexes, checkboxes, searchKey){
        let selectedEventsByCheckboxesIndexes = getSelectedEventsByCategoryIndexes(eventsData, eventsIndexes, checkboxes);
        let selectedEventsIndexes = getSelectedEventsBySearchImputIndexes(eventsData, selectedEventsByCheckboxesIndexes, searchKey);
        return selectedEventsIndexes;
    }
    
    
    function getHTMLSelectedEvents(data, eventsIndexes, checkboxes, searchKey, dateSelector){
        let htmlSelectedCards = "";
        selectedEventsIndexes = eventsSelector(data, eventsIndexes, checkboxes, searchKey)
        if(selectedEventsIndexes.length == 0){
            htmlSelectedCards = buildHTMLNoMatchesCard();
        }
        else{
            selectedEventsIndexes.forEach(index => {
                htmlSelectedCards = buildHTMLEventsOfInterestCardList(data, selectedEventsIndexes, dateSelector);
            });
        }
        return htmlSelectedCards;
    }
    searchEventResponse()
})