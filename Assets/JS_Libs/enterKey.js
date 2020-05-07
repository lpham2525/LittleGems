function enterKey(event) {
  event.preventDefault()
  fetch(`https://api.yelp.com/v3/businesses/${document.getElementById('searchInput').value}/`)
    //turns data into json format
    .then(r => r.json())
    .then(restaurant => {
      //console logs name of restaurant to test if fetch request is working
      console.log(restaurant)

      document.getElementById('imageOne').innerHTML = `
          <img 
            src="${business.image_url}" 
            alt="${business.name}">
            `
      document.getElementById('titleOne').innerHTML = `
            <h5 class="card-title">
              ${business.name}
            </h5>
            `
      document.getElementById('infoOne').innerHTML = `
            <p>${business.address}</p>
            <p>${business.rating}</p>
          <p>${business.categories.title}</p>
          `
      document.getElementById('linkOne').innerHTML = `
          <p>${business.url}</p>
          </div>
        `
      //function to clear the search bar after search is done
      document.getElementbyId('searchInput').value = ' '
    })
    //catches errors from the fetch request
    .catch(e => {
      console.log(e)
      alert("Error: criteria is not usable")
    })
}
