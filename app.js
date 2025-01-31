import {
  saveToLocalStorageByName,
  getLocalStorage,
  removeFromLocalStorage,
} from "./localStorage.js";

const shiny = document.getElementById("shiny");
const search = document.getElementById("search");
const pokemonName = document.getElementById("pokemonName");
const pokemonLocation = document.getElementById("pokemonLocation");
const evo = document.getElementById("evo");
const abilities = document.getElementById("abilities");
const moves = document.getElementById("moves");
const pokemonImg = document.getElementById("pokemonImg");
const random = document.getElementById("random");
const fav = document.getElementById("fav");
const favList = document.getElementById("favList");
const element = document.getElementById("element");
const close = document.getElementById("close");
const info = document.getElementById("info");
const favoritesSection = document.getElementById("favoritesSection");
let shinyImg = "";
let defaultImg = "";

async function getData(pokemon) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}/`
    );
    if (!response.ok) {
      pokemonName.innerText = "Try Again!";
      element.innerText = `Element: `;
      pokemonImg.src = "";
      pokemonLocation.innerText = `Location: `;
      moves.innerText = `Moves: `;
      abilities.innerText = `Abilities: `;
      evo.innerText = `Evolution Chain: `;
      shiny.classList.add("hidden");

      return null;
    }
    const data = await response.json();

    const response2 = await fetch(data.location_area_encounters);
    const data2 = await response2.json();

    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    const evolutionUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionUrl);
    const evolutionData = await evolutionResponse.json();
    let evoStage = evolutionData.chain;
    let evoChain = [evoStage.species.name];
    for (let i = 0; i < evoStage.evolves_to.length; i++) {
      evoChain.push(evoStage.evolves_to[i].species.name);
      for (let j = 0; j < evoStage.evolves_to[i].evolves_to.length; j++) {
        evoChain.push(evoStage.evolves_to[i].evolves_to[j].species.name);
      }
    }

    let moveNames = "";
    for (let i = 0; i < data.moves.length; i++) {
      moveNames += data.moves[i].move.name;
      if (i < data.moves.length - 1) {
        moveNames += ", ";
      }
    }

    let abilitiesNames = "";
    for (let i = 0; i < data.abilities.length; i++) {
      abilitiesNames += data.abilities[i].ability.name;
      if (i < data.abilities.length - 1) {
        abilitiesNames += ", ";
      }
    }

    let favorites = getLocalStorage();

    if (!favorites.includes(pokemon)) {
      fav.src = "./assets/pokeball.png";
    } else if (favorites.includes(pokemon)) {
      fav.src = "./assets/pokeball (1).png";
    }

    shinyImg = data.sprites.other["official-artwork"].front_shiny;
    defaultImg = data.sprites.other["official-artwork"].front_default;

    if (data.id < 650) {
      element.innerText = `Element: ${data.types[0].type.name}`;
      pokemonName.innerText = data.forms[0].name.toUpperCase();
      pokemonImg.src = data.sprites.other["official-artwork"].front_default;
      pokemonLocation.innerText =
        data2.length == 0
          ? "Location: N/A"
          : `Location: ${data2[0].location_area.name.replace(/-/g, " ")}`;
      moves.innerText = `Moves: ${moveNames}`;
      abilities.innerText = `Abilities: ${abilitiesNames}`;
      if (evoStage.evolves_to.length == 0) {
        evo.innerText = "Evolution Path: N/A";
      } else {
        evo.innerText = `Evolution Chain: ${evoChain.join(", ")}`;
      }
      shiny.classList.remove("hidden");
    } else {
      pokemonName.innerText = "Your Pokemon is not in our Pokedex!";
    }
  } catch (error) {
    console.log("Error", error.message);
  }
}

function getFavorites() {
  let favoritesList = getLocalStorage();
  info.innerHTML = "";

  favoritesList.map((fav) => {
    let div = document.createElement("div");
    div.className = "flex gap-2 items-center"


    
    let p = document.createElement("p");
    p.innerText = fav;
    
    let deleteIcon = document.createElement("img");
    deleteIcon.className = "w-[15px] h-[15px]";
    deleteIcon.src = "./assets/cancel.png";
    deleteIcon.alt = "Delete";

    deleteIcon.addEventListener("click", function () {
      removeFromLocalStorage(fav);
      div.remove();
    });

    p.addEventListener("click", function () {
      getData(fav);
    });

  
     div.appendChild(deleteIcon);
     div.appendChild(p);
    info.appendChild(div);
  });
}

shiny.addEventListener("click", () => {
  if (pokemonImg.src == shinyImg) {
    pokemonImg.src = defaultImg;
    shiny.src = "./assets/star (1).png";
  } else {
    pokemonImg.src = shinyImg;
    shiny.src = "./assets/star.png";
  }
});

close.addEventListener("click", () => {
  favoritesSection.classList.add("hidden");
});

search.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    let pokemon = search.value;
    await getData(pokemon);
    search.value = "";
    let favorites = getLocalStorage();
    if (!favorites.includes(pokemon)) {
      fav.src = "./assets/pokeball.png";
    } else if (favorites.includes(pokemon)) {
      fav.src = "./assets/pokeball (1).png";
    }
  }
});

random.addEventListener("click", () => {
  let pokemon = Math.floor(Math.random() * 650);
  getData(pokemon);
  let favorites = getLocalStorage();

  if (!favorites.includes(pokemon)) {
    fav.src = "./assets/pokeball.png";
  } else if (favorites.includes(pokemon)) {
    fav.src = "./assets/pokeball (1).png";
  }
});

fav.addEventListener("click", async () => {
  let pokemon = pokemonName.innerText;
  let favorites = getLocalStorage();
  if (favorites.includes(pokemon)) {
    removeFromLocalStorage(pokemon);
  } else {
    saveToLocalStorageByName(pokemon);
  }
  await getData(pokemon);
  getFavorites();
});

favList.addEventListener("click", () => {
  favoritesSection.classList.remove("hidden");
  getFavorites();
});
