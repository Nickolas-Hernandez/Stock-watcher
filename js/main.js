// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');
var $searchIcon = document.querySelector('.fa-search');
var dailyFunction = 'TIME_SERIES_DAILY';
var overviewFunction = 'OVERVIEW';
var autoSuggestFunction = 'SYMBOL_SEARCH';

// Functions
function autoCompleteSuggest(event){
  removeSuggestionList();
  if(event.target.value.length >= 3) {
    sendRequestAlphaVantage(autoSuggestFunction, null, event.target.value);
    $suggestionBox.classList.add('active');
  }
}

function removeSuggestionList(){
  $suggestionBox.classList.remove('active');
  var currentItems = document.querySelectorAll('.auto-suggest-item');
    for(var i = 0; i < currentItems.length; i++){
      currentItems[i].remove();
    }
}

function loadSuggestion(event){
  $searchInput.value = event.target.textContent;
  removeSuggestionList();
}

function submitSearch(event){
  sendRequestAlphaVantage(dailyFunction, $searchInput.value, null);
  sendRequestAlphaVantage(overviewFunction, $searchInput.value, null);
  $searchInput.value = '';
}

function createAutoSuggestItem(string){
  var suggestionItem = document.createElement('li');
  suggestionItem.className = 'auto-suggest-item';
  suggestionItem.textContent = string;
  $suggestionBox.appendChild(suggestionItem);
}

// Request Functions
function sendRequestAlphaVantage(functionType, ticker, keyword){
  if(ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if(functionType === autoSuggestFunction){
    xhr.open("GET", `https://www.alphavantage.co/query?function=${functionType}&keywords=${keyword}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      for(var i = 0; i <xhr.response.bestMatches.length; i++){
        createAutoSuggestItem(xhr.response.bestMatches[i]["1. symbol"]);
      }
    });
  }else {
    xhr.open("GET", `https://www.alphavantage.co/query?function=${functionType}&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      console.log('status ', xhr.status);
      console.log('response', xhr.response);
    });
  }
  xhr.send();
}

//Event Listeners
$searchInput.addEventListener('input', autoCompleteSuggest);
$suggestionBox.addEventListener('click', loadSuggestion);
$searchIcon.addEventListener('click', submitSearch);
