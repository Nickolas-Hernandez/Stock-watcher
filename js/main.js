// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');

// Functions
function autoCompleteSuggest(event){
  if(event.target.value.length >= 3) {
    sendRequestAlphaVantage('autocomplete', null, event.target.value);
  }else{
    $suggestionBox.classList.remove('active');
    var currentItems = document.querySelectorAll('.auto-suggest-item');
    for(var i = 0; i < currentItems.length; i++){
      currentItems[i].remove();
    }
  }
}

function loadSuggestion(event){
  console.log('event', event);
  console.log('event.target', event.target);
  console.log('event.target.tCont', event.target.textContent);
  $searchInput.value = event.target.textContent;
}

// Event Listeners + Function Calls
$searchInput.addEventListener('input', autoCompleteSuggest);
$suggestionBox.addEventListener('click', loadSuggestion);

// Request Functions
function sendRequestAlphaVantage(type, ticker, keyword){
  if(ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if(type === 'autocomplete'){
    xhr.open("GET", `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      console.log('status', xhr.status);
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
  }else {
    xhr.open("GET", `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  }
  xhr.send();
}
