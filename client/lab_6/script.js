const { literal } = require("sequelize/types");

async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);

  const results = await request.json();

  function findMatches(wordToMatch, search) {
    return search.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return (
        place.zip.match(regex)
        || place.name.match(regex)
        || place.category.match(regex)
        || place.address_line_1.match(regex)
        || place.city.match(regex)
      );
    });
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, results);
    const html = matchArray
      .map((place) => {
        const regex = new RegExp(event.target.value, 'gi');
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
      .join('');
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => {
    displayMatches(evt);
    li[i].style.display = "block";
  });
}
window.onload = windowActions;
