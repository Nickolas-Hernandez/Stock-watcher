// Global variables
var $watchListPage = document.querySelector('.watchlist-page');
var $searchInput = document.querySelector('#search-input');

// Functions

// Event Listeners + Function Calls
$searchInput.addEventListener('input', sendRequestAlphaVantage('autocomplete', null, event));

// Request Functions
function sendRequestAlphaVantage(type, ticker, event){
  if(ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if(type === 'autocomplete'){
    xhr.open("GET", `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${event.target.value}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function(){
      console.log('status', xhr.status);
      console.log('response', xhr.response);
    });
  }else if( type === 'daily'){
  xhr.open("GET", `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  }else {
    xhr.open("GET", `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  }
  xhr.send();
}
