let movieList = document.getElementsByClassName('list')

for(let i = 0; i < movieList.length; i++){
 var listItem = movieList[i];
 listItem.addEventListener('mouseover', function(event) {
   event.target.style.textDecoration="underline";
  setTimeout(function() {
    event.target.style.textDecoration = "none";
  }, 500)
 })
}
