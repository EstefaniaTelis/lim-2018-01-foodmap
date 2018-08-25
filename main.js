let map;
let infowindow;
let closeModal = document.getElementById("x");

const startGoogleMap = (searchValue) => {

	navigator.geolocation.getCurrentPosition(function (showPosition) {

		latitude = showPosition.coords.latitude;
		longitude = showPosition.coords.longitude;

		let myLatLong = new google.maps.LatLng(latitude, longitude);
		let mapOptions = {
			center: myLatLong,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.MAP
		};

		map = new google.maps.Map(document.getElementById('map'), mapOptions);


		infowindow = new google.maps.InfoWindow();

		let request = {
			location: myLatLong,
			radius: 4000,
			types: ["restaurant"]
		};

		let placeService = new google.maps.places.PlacesService(map);

		placeService.nearbySearch(request, function (results, status) {

			if (status === google.maps.places.PlacesServiceStatus.OK) {

				if (searchValue) {
					results = results.filter(place => place.name.toLowerCase().includes(searchValue.toLowerCase()))
				}
				refreshPlaces(results)

				results.forEach(result => {
					createMarker(result);

				})
			}
		});
	});
}

const createMarker = (place) => {
	let marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

const inputSearch = document.getElementById("search-restaurant");

inputSearch.addEventListener("keypress", () => {
	const searchValue = inputSearch.value;
	startGoogleMap(searchValue)

})

const showModal = (place) => {
	const cardModal = document.getElementById("cardModal")
	cardModal.innerHTML = "<br>";
	cardModal.innerHTML += "<b>" + place.name + "</b>";
	cardModal.innerHTML += "<br>";
	cardModal.innerHTML += "Ubicación: " + place.vicinity;
	cardModal.innerHTML += "<br>";
}

const closedModal = () => {
	document.getElementById("modal").style.display = 'none';
}
closeModal.addEventListener("click", closedModal);

const refreshPlaces = (places) => {

	const cardRestaurant = document.getElementById('card-restaurant');
	cardRestaurant.innerHTML = null;
	places.forEach(place => {
		const everyPlace = document.createElement('div');
		everyPlace.setAttribute('class', "w3-container w3-card w3-white w3-round w3-margin-top w3-margin-bottom");
		const borderUp = document.createElement('br');
		everyPlace.innerHTML = place.name

		const btnInfo = document.createElement("input");
		btnInfo.setAttribute('type', 'button')
		btnInfo.setAttribute('value', 'Ver más')
		btnInfo.setAttribute('class', 'buttonInfo')
		btnInfo.setAttribute('style', 'display:block')
		btnInfo.onclick = () => {
			document.getElementById('modal').style.display = 'block';
			showModal(place);
		}
		const borderDown = document.createElement('br');

		cardRestaurant.appendChild(everyPlace);
		everyPlace.appendChild(borderUp);
		everyPlace.appendChild(btnInfo);
		everyPlace.appendChild(borderDown);
	})
}