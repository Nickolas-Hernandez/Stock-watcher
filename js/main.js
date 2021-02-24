// Global variables
var $watchListPage = document.querySelector('.watchlist-page');
var $searchInput = document.querySelector('#search-input');

// Functions
function autoCompleteSuggest(event){
  console.log('event', event);
  console.log('event', event.target.value);
  sendRequestAlphaVantage('autocomplete', null, event.target.value);
}
// Event Listeners + Function Calls
$searchInput.addEventListener('input', autoCompleteSuggest);

// Request Functions
function sendRequestAlphaVantage(type, ticker, keyword){
  if(ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  if(type === 'autocomplete'){
    xhr.open("GET", `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=CPOI5XYGUXDVNA28`);
  }else if( type === 'daily'){
  xhr.open("GET", `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  }else {
    xhr.open("GET", `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  }
  xhr.responseType = 'json';
  xhr.addEventListener('load', function(){
    console.log('status', xhr.status);
    console.log('response', xhr.response);
  });
  xhr.send()
}
