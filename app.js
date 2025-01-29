import { saveToLocalStorageByName, getLocalStorage, removeFromLocalStorage } from "./localStorage.js";


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

async function getData(pokemon) {
  try {
    // call to pokemon-species for the evo path
    
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}/`
    );
    const data = await response.json();
    const pokemonId = data.id
    
    const response2 = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`
    );
    const data2 = await response2.json();

    const response3 = await fetch(
      `https://pokeapi.co/api/v2/evolution-chain/${pokemonId}`
    );
    const data3 = await response3.json();

    console.log(data);
    console.log(data2);
    console.log(data3);

    pokemonName.innerText = data.forms[0].name.toUpperCase();
    pokemonImg.src = data.sprites.front_default;
    pokemonLocation.innerText = `Location: ${data2[0].location_area.name}`;
    moves.innerText = `Moves: ${data.moves.map((m) => m.move.name).join(", ")}`;
    abilities.innerText = `Abilities: ${data.abilities.map((a) => a.ability.name).join(", ")}`;


  } catch (error) {
    alert("Error");
  }
}

search.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    let pokemon = search.value;
    await getData(pokemon);
  }
});

random.addEventListener("click", () => {
  let pokemon = Math.floor(Math.random() * 650);
  getData(pokemon);
});

function getFavorites()
{
  let favoritesList= getLocalStorage();
  console.log(favoritesList);
  favoritesList.map(fav => {
    let option = document.createElement("div"); 
    option.className = "favorite-item"; 
    option.innerHTML = `<p>${fav}</p>`; 
    
    let deletebtn = document.createElement('button');
    deletebtn.type = 'button';
    deletebtn.className = "btn";
    let deleteIcon = document.createElement("img");
    deleteIcon.src = "./Assets/images/X.png";
    deleteIcon.alt = "Delete";

    deletebtn.appendChild(deleteIcon);
  
    deletebtn.addEventListener('click', function () {
        removeFromLocalStorage(fav); 
        option.remove(); 
    });
  
    option.addEventListener('click', function(){
      asycnGetData(fav);
      asycnGetForecast(fav);
    });
  
    option.appendChild(deletebtn); 
    info.appendChild(option); 
  });
}

fav.addEventListener("click", () => {
  let pokemon = search.value
  saveToLocalStorageByName(pokemon); 
});

favList.addEventListener("click", () => {
  getFavorites();
});
