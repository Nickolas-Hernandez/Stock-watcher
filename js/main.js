// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');
var $searchIcon = document.querySelector('.fa-search');
var $topNewList = document.querySelector('.top-news-list');
var trendingStoriesRequest = 'TRENDING';
var companyNewsRequest = 'SYMBOL_NEWS';
var autoCompleteRequest = 'AUTO';

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
  for(var i = 0; i < data.suggestionData.length; i++){
    if(data.suggestionData[i].symbolName === event.target.textContent){
      data.inputID = data.suggestionData[i].issuerId + ',' + data.suggestionData[i].issueId;
    }
  }
  removeSuggestionList();
}

function submitSearch(event) {
  sendRequestAlphaVantage($searchInput.value);
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
  sendRequestCNBC(trendingStoriesRequest, null, null);
}

function displayTrending(data){
  console.log('data', data);
  for(var i = 0; i < 5; i++){
    var listItem = document.createElement('li');
    var headlineContainer = document.createElement('div');
    var imageContainer = document.createElement('div');
    var headlineText = document.createElement('h3');
    var headlineImage = document.createElement('img');
    var headlineAnchor = document.createElement('a');
    headlineText.textContent = data[i].headline.slice(0, 50) + " . . .";
    headlineImage.setAttribute('src', data[i].promoImage.url);
    headlineAnchor.setAttribute('href', data[i].url);
    headlineAnchor.setAttribute('target', '_blank');
    listItem.className = 'top-news-item row';
    headlineContainer.className = 'headline-container';
    imageContainer.className = 'news-image-container';
    headlineAnchor.appendChild(headlineText);
    headlineContainer.appendChild(headlineAnchor);
    imageContainer.appendChild(headlineImage);
    listItem.appendChild(headlineContainer);
    listItem.appendChild(imageContainer);
    $topNewList.appendChild(listItem);
  }
}

// Request Functions

function sendRequestAlphaVantage(ticker){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function(){
    console.log('status av', xhr.status);
    console.log('response av', xhr.response);
  });
  xhr.send()
}

function sendRequestCNBC(requestType, ticker, input) {
  if (ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  var responseObject;
  xhr.readyState = 'json';
  if(requestType === autoCompleteRequest) {
    xhr.open("GET", `https://cnbc.p.rapidapi.com/auto-complete?prefix=${input}`);
    xhr.addEventListener('load', function(){
      responseObject = JSON.parse(xhr.response);
      data.suggestionData = responseObject;
      createAutoSuggestItem(responseObject);
    });
  }else if (requestType === trendingStoriesRequest) {
    xhr.open('GET', 'https://cnbc.p.rapidapi.com/news/list-trending');
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.data.mostPopular.assets;
      console.log('CNBC trending', responseObject);
      displayTrending(responseObject);
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
