/* exported data */
var data = {
  view: null,
  suggestionData: null,
  currentStock: [],
  watchlist: []
}
var previousDataJSON = localStorage.getItem('watchlistData');

if(previousDataJSON !== null){
  data = JSON.parse(previousDataJSON);
}else console.log('noDAta');

window.addEventListener('beforeunload', function(){
  data.view = null;
  data.suggestionData = null;
  data.currentStock = [];
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('watchlistData', dataJSON);
});
