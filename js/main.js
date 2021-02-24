// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');
var $searchIcon = document.querySelector('.fa-search');
var trendingStoriesRequest = 'TRENDING';
var companyNewsRequest = 'SYMBOL_NEWS';
var companyStatsRequest = "SYMBOL_STATS"
var autoCompleteRequest = 'AUTO'

// Functions
function autoCompleteSuggest(event) {
  removeSuggestionList();
  if (event.target.value.length >= 3) {
    sendRequestCNBC(autoCompleteRequest, null, event.target.value);
    $suggestionBox.classList.add('active');
  }
}

function removeSuggestionList() {
  $suggestionBox.classList.remove('active');
  var currentItems = document.querySelectorAll('.auto-suggest-item');
  for (var i = 0; i < currentItems.length; i++) {
    currentItems[i].remove();
  }
}

function loadSuggestion(event) {
  $searchInput.value = event.target.textContent;
  removeSuggestionList();
}

function submitSearch(event) {
  // sendRequestAlphaVantage(dailyFunction, $searchInput.value, null);
  // sendRequestAlphaVantage(overviewFunction, $searchInput.value, null);
  // sendRequestCNBC(companyStatsRequest, $searchInput.value, null);
  sendRequestCNBC(companyNewsRequest, $searchInput.value, null);
  $searchInput.value = '';
}

function createAutoSuggestItem(response) {
  for(var i = 1; i < response.length; i++){
    var suggestionItem = document.createElement('li');
    suggestionItem.className = 'auto-suggest-item';
    suggestionItem.textContent = response[i].symbolName;
    $suggestionBox.appendChild(suggestionItem);
  }
}

function getTrendingStories(event) {
  sendRequestCNBC(trendingStoriesRequest, null);
}

// Request Functions

function sendRequestCNBC(requestType, ticker, input) {
  if (ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  var responseObject;
  xhr.readyState = 'json';
  if(requestType === autoCompleteRequest) {
    xhr.open("GET", `https://cnbc.p.rapidapi.com/auto-complete?prefix=${input}`);
    xhr.addEventListener('load', function(){
      responseObject = JSON.parse(xhr.response);
      console.log("response obj", responseObject);
      createAutoSuggestItem(responseObject);
    });
  }else if (requestType === trendingStoriesRequest) {
    xhr.open('GET', 'https://cnbc.p.rapidapi.com/news/list-trending');
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.data.mostPopular;
      // console.log('CNBC trending', responseObject);
    });
  }else if(requestType === companyNewsRequest) {
    xhr.open('GET', `https://cnbc.p.rapidapi.com/news/list-by-symbol?tickersymbol=${ticker}&page=1&pagesize=10`);
    xhr.addEventListener('load', function(){
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.rss.channel.item;
      console.log('response companyNews', responseObject);
    });
  }
  xhr.setRequestHeader('x-rapidapi-key', 'afbc32455amsh2b70f92ea852178p1d2d81jsn1c3b08275a2e');
  xhr.setRequestHeader('x-rapidapi-host', 'cnbc.p.rapidapi.com');
  xhr.send();
}

// Event Listeners
$searchInput.addEventListener('input', autoCompleteSuggest);
$suggestionBox.addEventListener('click', loadSuggestion);
$searchIcon.addEventListener('click', submitSearch);
window.addEventListener('load', getTrendingStories);
