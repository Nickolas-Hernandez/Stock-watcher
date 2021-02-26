// Global variables
var $searchInput = document.querySelector('#search-input');
var $suggestionBox = document.querySelector('.auto-list');
var $searchIcon = document.querySelector('.fa-search');
var $topNewsList = document.querySelector('.top-news-list');
var $stockNewsList = document.querySelector('.stock-news-list');
var $watchlistList = document.querySelector('.watchlist')
var $watchlistPage = document.querySelector('.watchlist-page');
var $stockPage = document.querySelector('.stock-page');
var dailyStatsRequest = 'TIME_SERIES_DAILY';
var overviewStatsRequest = 'OVERVIEW';
var trendingStoriesRequest = 'TRENDING';
var companyNewsRequest = 'SYMBOL_NEWS';
var autoCompleteRequest = 'AUTO';
var issueIdRequest = 'ISSUE_ID';
var forWatchlist = true;

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
  data.currentStock = [];
  clearRelatedNews();
  sendRequestAlphaVantage(overviewStatsRequest, $searchInput.value, false);
  sendRequestAlphaVantage(dailyStatsRequest, $searchInput.value, false);
  // sendRequestCNBC(companyNewsRequest, $searchInput.value, null);
  $searchInput.value = '';
  removeSuggestionList();
  switchPage(event.target);
}

function createAutoSuggestItem(response) {
  for (var i = 1; i < response.length; i++) {
    var suggestionItem = document.createElement('li');
    suggestionItem.className = 'auto-suggest-item';
    suggestionItem.textContent = response[i].symbolName;
    $suggestionBox.appendChild(suggestionItem);
  }
}

function getTrendingStories(event) {
  sendRequestCNBC(trendingStoriesRequest, null, null);
}

function createNewsItems(dataArray) {
  for (var i = 0; i < 5; i++) {
    var listItem = document.createElement('li');
    var headlineContainer = document.createElement('div');
    var imageContainer = document.createElement('div');
    var headlineText = document.createElement('h3');
    var headlineImage = document.createElement('img');
    var headlineAnchor = document.createElement('a');
    if (dataArray[i]['metadata:id']) {
      headlineText.textContent = dataArray[i].title.slice(0, 50) + ' . . .';
      headlineImage.setAttribute('src', dataArray[i]['metadata:image']['metadata:imagepath']);
      headlineAnchor.setAttribute('href', dataArray[i].link);
    } else {
      headlineText.textContent = dataArray[i].headline.slice(0, 50) + ' . . .';
      headlineImage.setAttribute('src', dataArray[i].promoImage.url);
      headlineAnchor.setAttribute('href', dataArray[i].url);
    }
    headlineAnchor.setAttribute('target', '_blank');
    listItem.className = 'top-news-item row';
    headlineContainer.className = 'headline-container';
    imageContainer.className = 'news-image-container';
    headlineAnchor.appendChild(headlineText);
    headlineContainer.appendChild(headlineAnchor);
    imageContainer.appendChild(headlineImage);
    listItem.appendChild(headlineContainer);
    listItem.appendChild(imageContainer);
    if (dataArray[i]['metadata:id']) {
      $stockNewsList.appendChild(listItem);
    } else $topNewsList.appendChild(listItem);
  }
}

function loadStats(dataArray) {
  if (dataArray.length !== 2) return;
  var $ticker = document.querySelector('.stats-ticker');
  var $price = document.querySelector('.stats-price');
  var $companyName = document.querySelector('.company-name');
  var $date = document.querySelector('.stats-date');
  var $open = document.querySelector('.open-price');
  var $close = document.querySelector('.close-price');
  var $high = document.querySelector('.high-price');
  var $low = document.querySelector('.low-price');
  var $high52 = document.querySelector('.high-52wk');
  var $low52 = document.querySelector('.low-52wk');
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i]['Time Series (Daily)']) {
      $date.textContent = dataArray[i]['Meta Data']['3. Last Refreshed'].slice(0, 10);
      $price.textContent = '$' + cutPrice(dataArray[i]['Time Series (Daily)'][$date.textContent]['4. close']);
      $open.textContent = cutPrice(dataArray[i]['Time Series (Daily)'][$date.textContent]['1. open']);
      $close.textContent = cutPrice(dataArray[i]['Time Series (Daily)'][$date.textContent]['4. close']);
      $high.textContent = cutPrice(dataArray[i]['Time Series (Daily)'][$date.textContent]['2. high']);
      $low.textContent = cutPrice(dataArray[i]['Time Series (Daily)'][$date.textContent]['3. low']);
    } else {
      $ticker.textContent = dataArray[i].Symbol;
      $companyName.textContent = dataArray[i].Name;
      $high52.textContent = cutPrice(dataArray[i]['52WeekHigh']);
      $low52.textContent = cutPrice(dataArray[i]['52WeekLow']);
    }
  }
}

function cutPrice(string) {
  for (var i = 0; i < string.length; i++) {
    if (string[i] === '.') {
      string = string.slice(0, (i + 3));
      return string;
    }
  }
}

function switchPage(eventItem) {
  if (eventItem === $searchIcon) {
    $watchlistPage.classList.add('hidden');
    $stockPage.classList.remove('hidden');
  } else if (eventItem.className === 'fas fa-times' || eventItem.className === 'fas fa-plus') {
    $watchlistPage.classList.remove('hidden');
    $stockPage.classList.add('hidden');
  }
}

function clearRelatedNews() {
  var $newList = document.querySelectorAll('.stock-news-list > li');
  for (var i = 0; i < $newList.length; i++) {
    $newList[i].remove();
  }
}

function saveStockToLocalStorage(){
  var $ticker = document.querySelector('.stats-ticker');
  data.watchlist.push($ticker.textContent);
  sendRequestAlphaVantage(dailyStatsRequest, $ticker.textContent, forWatchlist);
}

function generateWatchlistItem(dataObject){
  var lastTradingDate = dataObject['Meta Data']['3. Last Refreshed'].slice(0, 10);
  var listItem = document.createElement('li');
  var ticker = document.createElement('p');
  var column = document.createElement('div');
  var price = document.createElement('p');
  listItem.className = 'watchlist-item-head row column-full';
  ticker.className = 'ticker';
  column.className = 'price-column';
  price.className = 'price';
  price.classList.add(getPosOrNegClass(dataObject));
  ticker.textContent = dataObject['Meta Data']['2. Symbol'];
  price.textContent = '$' + cutPrice(dataObject['Time Series (Daily)'][lastTradingDate]['4. close']);
  column.appendChild(price);
  listItem.appendChild(ticker);
  listItem.appendChild(column);
  $watchlistList.appendChild(listItem);
}

function getPosOrNegClass(dataObject){
  var date = dataObject['Meta Data']['3. Last Refreshed'].slice(0,10);
  var open = cutPrice(dataObject['Time Series (Daily)'][date]['1. open']);
  var close = cutPrice(dataObject['Time Series (Daily)'][date]['4. close']);
  open = parseInt(open);
  close = parseInt(close);
  if(close >= open){
    return 'profit-text';
  }else return 'loss-text'
}

// Request Functions
function sendRequestAlphaVantage(functionType, ticker, isWatchlist) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://www.alphavantage.co/query?function=${functionType}&symbol=${ticker}&apikey=CPOI5XYGUXDVNA28`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if(isWatchlist === true){
      console.log(xhr.response);
      generateWatchlistItem(xhr.response);
    }else {
      data.currentStock.push(xhr.response);
      loadStats(data.currentStock);
    }
  });
  xhr.send();
}

function sendRequestCNBC(requestType, ticker, input) {
  if (ticker !== null) ticker = ticker.toUpperCase();
  var xhr = new XMLHttpRequest();
  var responseObject;
  xhr.readyState = 'json';
  if (requestType === autoCompleteRequest) {
    xhr.open('GET', `https://cnbc.p.rapidapi.com/auto-complete?prefix=${input}`);
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      data.suggestionData = responseObject;
      createAutoSuggestItem(responseObject);
    });
  } else if (requestType === trendingStoriesRequest) {
    xhr.open('GET', 'https://cnbc.p.rapidapi.com/news/list-trending');
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.data.mostPopular.assets;
      createNewsItems(responseObject);
    });
  } else if (requestType === companyNewsRequest) {
    xhr.open('GET', `https://cnbc.p.rapidapi.com/news/list-by-symbol?tickersymbol=${ticker}&page=1&pagesize=10`);
    xhr.addEventListener('load', function () {
      responseObject = JSON.parse(xhr.response);
      responseObject = responseObject.rss.channel.item;
      createNewsItems(responseObject);
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
$stockPage.addEventListener('click', function () {
  if (event.target.className === 'fas fa-times') {
    switchPage(event.target);
  }else if(event.target.className === 'fas fa-plus'){
    switchPage(event.target);
    saveStockToLocalStorage();
  }
});
// window.addEventListener('load', getTrendingStories);
