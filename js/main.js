// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');
var $searchIcon = document.querySelector('.fa-search');
var dailyFunction = 'TIME_SERIES_DAILY';
var overviewFunction = 'OVERVIEW';
var autoSuggestFunction = 'SYMBOL_SEARCH';
var trendingStoriesRequest = 'TRENDING';
var symbolStoriesRequest = 'SYMBOL';

// Functions
function autoCompleteSuggest(event) {
  removeSuggestionList();
  if (event.target.value.length >= 3) {
    sendRequestAlphaVantage(autoSuggestFunction, null, event.target.value);
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
  sendRequestAlphaVantage(dailyFunction, $searchInput.value, null);
  sendRequestAlphaVantage(overviewFunction, $searchInput.value, null);
  sendRequestCNBC(symbolStoriesRequest, $searchInput.value);
  $searchInput.value = '';
}

function createAutoSuggestItem(string) {
  var suggestionItem = document.createElement('li');
  suggestionItem.className = 'auto-suggest-item';
  suggestionItem.textContent = string;
  $suggestionBox.appendChild(suggestionItem);
}

// Request Functions
function sendRequestAlphaVantage(functionType, ticker, keyword) {
  if (ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if (functionType === autoSuggestFunction) {
    xhr.open('GET', `https://www.alphavantage.co/query?function=${functionType}&keywords=${keyword}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function () {
      for (var i = 0; i < xhr.response.bestMatches.length; i++) {
        createAutoSuggestItem(xhr.response.bestMatches[i]['1. symbol']);
      }
    });
  } else {
    xhr.open('GET', `https://www.alphavantage.co/query?function=${functionType}&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
    xhr.addEventListener('load', function () {
    });
  }
  xhr.send();
}

function sendRequestCNBC(requestType, ticker) {
  if (ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  var responseObject;
  xhr.readyState = 'json';
  if (requestType === trendingStoriesRequest) {
    xhr.open('GET', 'https://cnbc.p.rapidapi.com/news/list-trending');
    xhr.setRequestHeader('x-rapidapi-key', 'afbc32455amsh2b70f92ea852178p1d2d81jsn1c3b08275a2e');
    xhr.setRequestHeader('x-rapidapi-host', 'cnbc.p.rapidapi.com');
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.data.mostPopular;
    });
  } else {
    xhr.open('GET', `https://cnbc.p.rapidapi.com/news/list-by-symbol?tickersymbol=${ticker}&page=1&pagesize=10`);
    xhr.setRequestHeader('x-rapidapi-key', 'afbc32455amsh2b70f92ea852178p1d2d81jsn1c3b08275a2e');
    xhr.setRequestHeader('x-rapidapi-host', 'cnbc.p.rapidapi.com');
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.rss.channel;
    });
  }
  xhr.send();
}

// Event Listeners
$searchInput.addEventListener('input', autoCompleteSuggest);
$suggestionBox.addEventListener('click', loadSuggestion);
$searchIcon.addEventListener('click', submitSearch);
window.addEventListener('load', sendRequestCNBC(trendingStoriesRequest, null));
