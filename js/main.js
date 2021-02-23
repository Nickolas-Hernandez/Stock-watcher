// Global variables
var $watchListPage = document.querySelector('.watchlist-page');

// Functions

// Event Listeners + Function Calls
$watchListPage.addEventListener('input', autoCompletedSuggest);

// Request Functions
function sendRequestAlphaVantage(type, ticker, keyword){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `https://www.alphavantage.co/query?function=OVERVIEW&symbol=TSLA&apikey=CPOI5XYGUXDVNA28`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function(){
    console.log('status', xhr.status);
    console.log('response', xhr.response);
  });
  xhr.send()
}
