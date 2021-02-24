// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');
var $searchIcon = document.querySelector('.fa-search');

// Functions
function autoCompleteSuggest(event){
  removeSuggestionList();
  if(event.target.value.length >= 3) {
    sendRequestAlphaVantage('autocomplete', null, event.target.value);
  }
}

function loadSuggestion(event){
  $searchInput.value = event.target.textContent;
  removeSuggestionList();
}

function removeSuggestionList(){
  $suggestionBox.classList.remove('active');
  var currentItems = document.querySelectorAll('.auto-suggest-item');
    for(var i = 0; i < currentItems.length; i++){
      currentItems[i].remove();
    }
}

function submitSearch(event){
  sendRequestAlphaVantage('daily', $searchInput.value, null);
  sendRequestAlphaVantage('overview', $searchInput.value, null);
  $searchInput.value = '';
}

// Event Listeners + Function Calls
$searchInput.addEventListener('input', autoCompleteSuggest);
$suggestionBox.addEventListener('click', loadSuggestion);
$searchIcon.addEventListener('click', submitSearch);

// Request Functions
function sendRequestAlphaVantage(type, ticker, keyword){
  if(ticker !== null) ticker = ticker.toUpperCase();
  console.log('ticker (input value):',ticker);
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if(type === 'autocomplete'){
    xhr.open("GET", `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      for(var i = 0; i <xhr.response.bestMatches.length; i++){
        $suggestionBox.classList.add('active')
        var suggestionItem = document.createElement('li');
        suggestionItem.className = 'auto-suggest-item';
        suggestionItem.textContent = xhr.response.bestMatches[i]["1. symbol"];
        $suggestionBox.appendChild(suggestionItem);
      }
    });
  }else if( type === 'daily'){
    xhr.open("GET", `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      console.log('Testing input submission => send request. Expecting response object to be reuturned')
      console.log('status ', xhr.status);
      console.log('response', xhr.response);
    });
  }else {
    xhr.open("GET", `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      console.log('Testing get overview request')
      console.log('status (overview) ', xhr.status);
      console.log('response (overview', xhr.response);
    });
  }
  xhr.send();
}
