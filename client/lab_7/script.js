async function windowActions() {
  const endpoint =
    "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";

  const request = await fetch(endpoint);

  const results = await request.json();

  function findMatches(wordToMatch, search) {
    return search.filter((place) => {
      const regex = new RegExp(wordToMatch, "gi");
      return (
        place.zip.match(regex) &&
        place.address_line_1 != null &&
        place.category != null &&
        place.city != null &&
        place.zip != null &&
        place.geocoded_column_1 != null
      );
    });
  }

  const searchInput = document.querySelector(".search");
  const suggestions = document.querySelector(".suggestions");

  searchInput.addEventListener("input", (evt) => {
    displayMatches(evt);
  });

  function empty(input) {
    if (input === "") {
      suggestions.innerHTML = "";
    }
  }

  searchInput.addEventListener("input", empty(searchInput.value));

  const markers = [];

  function mapInit() {
    const mymap = L.map("mapid").setView([38.9897, -76.9378], 13);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiamNoaW4xMjUiLCJhIjoiY2t1dW4xNnJwNjB1czJ2bnp0YWkzc3AycSJ9.QDbfaUKfY2bKcF7XM9t6qg",
      }
    ).addTo(mymap);
    return mymap;
  }

  let mymap = mapInit();

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, results);
    const firstFive = matchArray.slice(0, 5);
    firstFive.forEach((place) => {
      if (place.geocoded_column_1 != null) {
        const point = place.geocoded_column_1;
        const lat = point.coordinates;
        const marker = lat.reverse();
        markers.push(L.marker(marker).addTo(mymap));
      }
    });
    const html = firstFive
      .map((place) => {
        const regex = new RegExp(event.target.value, "gi");
        const name = place.name.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        const address_line_1 = place.address_line_1.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        return `
          <li>
            <span class="name">${name}</span><br/>
            <span class="address_line_1">${address_line_1}</span><br/>
          </li>
        `;
      })
      .join("");
    suggestions.innerHTML = html;
    empty(searchInput.value);
    try {
      if (firstFive[0].geocoded_column_1.coordinates != null) {
        mymap.setView(firstFive[0].geocoded_column_1.coordinates.reverse(), 13);
      }
    } catch (error) {
      console.log("No results found");
    }
  }
}

window.onload = windowActions;
