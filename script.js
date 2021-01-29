// Functions below apply to geoLocation (google map API)
const userPosition = {
  lat: 0,
  lng: 0
}
const irvine = {
  lat: 33.6694649,
  lng: -117.8231107
}
const greenville = {
  lat: 34.852619, 
  lng: -82.394012
}

// image error handler, replaces missing images with default placeholder
function imgError (image) {
  console.log(image)
  image.onerror = ''
  image.src = './assets/images/logoreal.png'
  return true
}

function generateRestaurant(r, i) {
  const gemElem = document.createElement('div')
  gemElem.setAttribute('id', `card${i}`)
  gemElem.classList.add('col', 's12', 'm3')

  let photo_url = 'Assets/images/placeholder_1000px.png'
  // Checks if restaurant has photo or not, if it does sets img source to that, if it doesn't sets img source to placeholder
  if (r.photos !== undefined && r.photo_count !== 0) {
    photo_url = r.photos[0].photo.url
  }
  gemElem.innerHTML = `<div class="card z-depth-2" id="restauraunt${i}">
              <div class="card-image">
                <img id="img${i}" src="${photo_url}" alt="${r.name}" onerror="imgError(this)">
                <a id="favorite" class="btn-floating halfway-fab waves-effect waves-light red"><i onclick="saveRestaurant()" id="${r.id}" class="material-icons">add</i></a>
              </div>
              <div class="card-content">
                <span class="card-title" id="title${i}">${r.name}</span>
                <p id="cuisine${i}">${r.cuisines}</p>
                <p id="rating${i}">${r.user_rating.aggregate_rating} (${r.user_rating.votes})</p>
                <p id="address${i}">${r.location.address}</p>
                <a class="waves-effect waves-light btn" href="${r.url}" id="link${i}" target="_blank">Go To Restaurant</a>
              </div>
            </div>`
  return gemElem
}

// empty array to later store saved restaurants in local storage
let favoriteArray = []

// collect restaurant's unique ID, stores it in array, and then saves array to local storage
function saveRestaurant () {
  const restaurantID = event.target.id
  favoriteArray.push(restaurantID)
  console.log(restaurantID)
  localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray))
}

// Initialize and add the map
function initMap () {
  
  function success (position) {
    userPosition.lat = position.coords.latitude
    userPosition.lng = position.coords.longitude
    // The map, centered at user position
    const map = new google.maps.Map(
      document.getElementById('map'), { zoom: 13, center: userPosition })
    // The marker, positioned at user position
    const marker = new google.maps.Marker({ position: userPosition, map: map })
  }
  function error () {
    // Update user position
    userPosition.lat = greenville.lat
    userPosition.lng = greenville.lng
    // The map, centered at user position
    const map = new google.maps.Map(
      document.getElementById('map'), { zoom: 13, center: greenville })
    // The marker, positioned at user position
    const marker = new google.maps.Marker({ position: greenville, map: map })
  }

  // get users location and assigns it to empty object created earlier.
  navigator.geolocation.getCurrentPosition(success, error, position => { })
}

  // START OF ZOMATO API

function getGems () {
  // prevents page from refreshing when button is clicked
  event.preventDefault()
  // Clear restaurants when searching again
  document.getElementById('row1').innerHTML = ''
  document.getElementById('row2').innerHTML = ''

  // Gets value from the search input
  const searchInput = document.getElementById('searchInput').value

  // Calls the Zomato Search API and passes in the user's search
  $.ajax({
    type: 'GET', // it's a GET request API
    headers: {
      'X-Zomato-API-Key': '6cc636d36121906ab8ce98c1468d462a' // only allowed non-standard header
    },
    url: `https://developers.zomato.com/api/v2.1/search?q=${searchInput}&radius=40233&?count=50&lat=${userPosition.lat}&lon=${userPosition.lng}`, // what do you want
    dataType: 'json', // wanted response data type - let jQuery handle the rest...
    data: {
      // could be directly in URL, but this is more prettier, clearer, and easier to edit
    },
    processData: true, // data is an object => tells jQuery to construct URL params from it
    success: function (data) {
      console.log(data)
      
      // Grab references to our rows
      const row1 = (document.getElementById('row1'))
      const row2 = (document.getElementById('row2'))

      // Filter restaurants
      const rFiltered = data.restaurants
        .filter(r => r.restaurant.user_rating.aggregate_rating > 3 && r.restaurant.user_rating.votes < 40)
        .slice(0,8)
        .map((r, i) => {
          if(i < 4) {
            row1.appendChild(generateRestaurant(r.restaurant, i))
          } else {
            row2.appendChild(generateRestaurant(r.restaurant, i))
          }
        })


      // let cardsAdded = 0
      // // Continues to loop through Zomato API and create elements until we have 8 cards on our page
      // for (let i = 0; i < data.restaurants.length && (cardsAdded < 8); i++) {
      //   // Pick Restaurant out of the array
      //   const r = data.restaurants[i].restaurant
      //   // Checks if restaurants rating is above 3 stars but has fewer than 40 total ratings
      //   if (r.user_rating.aggregate_rating > 3 && r.user_rating.votes < 40) {
      //     // Checks that the div row1 has less than 4 cards, if it has 4 the next 4 cards are added to row 2 with the else statement
      //     if (cardsAdded < 4) {
      //       row1.appendChild(generateRestaurant(r, i))
      //     } else {
      //       row2.appendChild(generateRestaurant(r, i))
      //     }
      //     cardsAdded++
      //   }
      // }
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ': ' + xhr.statusText
      alert('Error - ' + errorMessage)
    }
  })
}

async function retrieveSaved () {
  const row1 = document.getElementById('row1')
  const row2 = document.getElementById('row2')
  row1.innerHTML = ''
  row2.innerHTML = ''

  // Retrieve array of favorites
  const favoriteArray = JSON.parse(localStorage.getItem('favoriteArray'))

  // Query restaurant data
  const headers = new Headers({
    'X-Zomato-API-Key': '6cc636d36121906ab8ce98c1468d462a'
  })

  const restaurants = await Promise.all(
    favoriteArray.map(resId => {
      fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${resId}`, {
        headers: headers
      }).then(res => res.json())
    }
  ))
  
  // Display on page
  restaurants.map((r, i) => {
    if(i < 4) {
      row1.appendChild(generateRestaurant(r, i))
    } else {
      row2.appendChild(generateRestaurant(r, i))
    }
  })
}

// Attach Event Handlers
document.getElementById('savedGem').addEventListener('click', retrieveSaved)

document.getElementById('button').addEventListener('click', function () {
  if (document.getElementById('searchInput').value !== '') {
    getGems()
  } else {
    console.log('Enter a search!')
  }
})

document.getElementById('searchInput').addEventListener('keypress', function () {
  const key = event.keyCode
  if (key === 13 && document.getElementById('searchInput').value !== '') {
    getGems()
  }
})
