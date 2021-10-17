async function windowActions() {
  mapInit();
  const endpoint =
    "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";

  const request = await fetch(endpoint);

  const results = await request.json();

  function findMatches(wordToMatch, search) {
    return search.filter((place) => {
      const regex = new RegExp(wordToMatch, "gi");
      return place.zip.match(regex);
    });
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, results);
    const html = matchArray
      .map((place) => {
        const regex = new RegExp(event.target.value, "gi");
        const name = place.name.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        const category = place.category.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        const address_line_1 = place.address_line_1.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        const city = place.city.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        const zip = place.zip.replace(
          regex,
          `<span class="h1">${event.target.value}</span>`
        );
        return `
          <li>
            <span class="name">${name}</span><br/>
            <span class="category">${category}</span><br/>
            <span class="address_line_1">${address_line_1}</span><br/>
            <span class="city">${city}</span><br/>
            <span class="zip">${zip}</span><br/>
          </li>
        `;
      })
      .join("");
    suggestions.innerHTML = html;
    if (!event.target.value) {
      suggestions.innerHTML = "";
    }
  }

  const searchInput = document.querySelector(".search");
  const suggestions = document.querySelector(".suggestions");
  suggestions.innerHTML = "";

  searchInput.addEventListener("input", displayMatches);
  searchInput.addEventListener("keyup", (evt) => {
    displayMatches(evt);
  });

  function mapInit() {
    const mymap = L.map("mapid").setView([38.9897, -76.9378], 14);

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
  }
}

window.onload = windowActions;
