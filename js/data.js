/* exported data */
var data = {
  suggestionData: null,
  currentStock: [],
  watchlist: [],
  plusIcon: 'show'
};
var previousDataJSON = localStorage.getItem('watchlistData');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function () {
  data.view = null;
  data.suggestionData = null;
  data.currentStock = [];
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('watchlistData', dataJSON);
});
