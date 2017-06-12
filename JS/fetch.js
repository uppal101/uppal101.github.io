
window.onload = function(){
  getAllMoviesFromSFOpenData()
    .then(function(jsonResult){
      return getMovieDataFromTheMovieDbApi(jsonResult)
    })
    .then(function(allTheMovieDbApiRequests){
      return convertResponsesToJSONObjects(allTheMovieDbApiRequests)
    })
    .then(function(theMovieDbApiMovieNestedArray){
      // console.log(theMovieDbApiMovieNestedArray);
      for (let j = 0; j < theMovieDbApiMovieNestedArray.length; j++) {
        let theMovieDbApiMovieNestedObject = theMovieDbApiMovieNestedArray[j];
        // console.log(theMovieDbApiMovieNestedObject);
        let theMovieDbApiMovieObject = theMovieDbApiMovieNestedObject.results[0];
        // console.log(theMovieDbApiMovieObject);
        if(theMovieDbApiMovieObject !== undefined) {
          createAndAppendMovieCards(theMovieDbApiMovieObject);
        }
      }
    })
}

  function getAllMoviesFromSFOpenData(){
    let url = "https://data.sfgov.org/resource/wwmu-gmzc.json?$limit=150";
    return fetch(url)
    .then(function(promiseResponse){
      return promiseResponse.json()
    })
    .then(function(jsonResult){
      let movieDatabase = {};
      for(let i = 0; i < jsonResult.length; i++) {
        let curMovie = jsonResult[i];
        if(movieDatabase[curMovie.title]){
          // push to movieDatabase[curMovie.title]'s location array
          movieDatabase[curMovie.title].locations.push(curMovie.locations)
        } else {
          // make Movie obj and add it as value to movieDatabase
          movieDatabase[curMovie.title] = new Movie(curMovie)
        }
      }
        // console.log(movieDatabase);
      return movieDatabase;
    })
  }

  function getMovieDataFromTheMovieDbApi(movieDatabase){
    let allTheMovieDbApiResult = [];
    for (movieKey in movieDatabase) {
      let curMoviePromiseFromTheMovieDbApi = searchTheMovieDbApi(movieDatabase[movieKey]);
      allTheMovieDbApiResult.push(curMoviePromiseFromTheMovieDbApi);
    }
    return allTheMovieDbApiResult;
  }

  function searchTheMovieDbApi(curMovie){
    return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${curMovie.title}&page=1&include_adult=false  &year=${curMovie.year}`);
  }

  function convertResponsesToJSONObjects(allTheMovieDbApiResult){
    return Promise.all(allTheMovieDbApiResult)
      .then(function(arrayOfMoviePromises){
        let arrayOfMovieJSONObjects = arrayOfMoviePromises.map(function(curMoviePromise){
          return curMoviePromise.json();
        });
        // console.log(arrayOfMoviePromises);
        return Promise.all(arrayOfMovieJSONObjects)
      })
  }

  function Movie(jsonMovieObj){
    this.title = jsonMovieObj.title;
    this.locations = [jsonMovieObj.locations];
    this.year = jsonMovieObj.release_year;
  }

  function createAndAppendMovieCards(currentMovieObj){
    let movieCard= createCard(currentMovieObj);
    // find .resultPoster
    let listings = document.getElementById('listings')
    appendToDom(listings, movieCard);
  }

  function appendToDom(listings, movieCard) {
    return listings.appendChild(movieCard);
  }

  function createCard(currentMovieObj) {
    let card= document.createElement('div');
    card.setAttribute('class', 'col m3');
    let shadow = document.createElement('div');
    shadow.setAttribute('class', 'card-hoverable');
    let posterAndTitle = document.createElement('div');
    posterAndTitle.setAttribute('class','card-content');


    let title = document.createElement('h5');
    title.setAttribute('class','card-title truncate center');
    title.setAttribute('data-position','top');
    title.innerText = currentMovieObj.title;


    let poster = document.createElement('img');
    poster.setAttribute('class', 'poster');
    poster.src = `https://image.tmdb.org/t/p/w300${currentMovieObj.poster_path}`
    poster.setAttribute('src', `https://image.tmdb.org/t/p/w300${currentMovieObj.poster_path}`);

    let cardAction = document.createElement('div');
    cardAction.setAttribute('class', 'card-action center');
    let button = document.createElement('a');
    button.setAttribute('class', 'wave-effect waves-light btn modal-trigger');
    button.setAttribute('href', `#${currentMovieObj.id}`);
    button.innerText = "Plot Details and Map Locations";

    let modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    modal.setAttribute('id',  `${currentMovieObj.id}`)

    let plotDetails = document.createElement('div');
    plotDetails.setAttribute('class', 'modal-content');
    let plotContent = document.createElement('p');
    plotContent.innerText = currentMovieObj.overview;


    card.appendChild(shadow);
    shadow.appendChild(posterAndTitle);
    posterAndTitle.appendChild(title);
    posterAndTitle.appendChild(poster);
    shadow.appendChild(cardAction);
    cardAction.appendChild(button);
    shadow.appendChild(modal);
    modal.appendChild(plotDetails);
    plotDetails.appendChild(plotContent);

    $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    });

    return card;
  }


  $('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      alert("Ready");
      console.log(modal, trigger);
    },
    complete: function() { alert('Closed'); } // Callback for Modal close
  });
