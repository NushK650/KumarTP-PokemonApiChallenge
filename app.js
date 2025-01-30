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
const close = document.getElementById("close");
const info = document.getElementById("info");
const favoritesSection = document.getElementById("favoritesSection");

async function getData(pokemon) {
  try {
    
    
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}/`
    );
    const data = await response.json();
   
    
    const response2 = await fetch(data.location_area_encounters);
    const data2 = await response2.json();
   

    const speciesResponse = await fetch(data.species.url); // gets the data by drilling into the url 
const speciesData = await speciesResponse.json(); // just a response like the one above 
const evolutionUrl = speciesData.evolution_chain.url; //just the url

const evolutionResponse = await fetch(evolutionUrl); //goes into the url from above 
const evolutionData = await evolutionResponse.json(); // where the real data is 

   
    console.log(evolutionData.chain);

    let evoStage = evolutionData.chain; // stores the chain into a variable 
    let evoChain = [evoStage.species.name]; // drills into the chain 
    while (evoStage.evolves_to.length > 0) { // while loop to find all possible evolutions 
      evoChain.push(...evoStage.evolves_to.map(evo => evo.species.name)); // spread operater to put the names in its own arguements and then the .map to only get the names  
      evoStage = evoStage.evolves_to[0]; 
    }

    let moveNames = "";
for (let i = 0; i < data.moves.length; i++) {
  moveNames += data.moves[i].move.name;
  if (i < data.moves.length - 1) {
    moveNames += ", "; 
  }
}

let abilitiesNames = "";
for(let i = 0; i < data.abilities.length; i++){
  abilitiesNames += data.abilities[i].ability.name;
  if(i < data.abilities.length - 1){
    abilitiesNames += ", ";
  }
}

element.innerText = `Element: ${data.types[0].type.name}`;
    pokemonName.innerText = data.forms[0].name.toUpperCase();
    pokemonImg.src = data.sprites.front_default;
    pokemonLocation.innerText = `Location: ${data2[0].location_area.name.replace(/-/g," ")}`;
    moves.innerText = `Moves: ${moveNames}`;
    abilities.innerText = `Abilities: ${abilitiesNames}`; 
    evo.innerText = `Evolution Chain: ${evoChain.join(", ")}`; 


  } catch (error) {
    alert("Error");
  }
}

close.addEventListener("click", ()=>{
  favoritesSection.classList.add("hidden");
})

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
  info.innerHTML = "";
  console.log(favoritesList);
  favoritesList.map(fav => {
    let option = document.createElement("div"); 
    
    option.innerHTML = `<p>${fav}</p>`; 
    
    let deletebtn = document.createElement('button');
    deletebtn.type = 'button';
    deletebtn.className = "w-[10px] h-[10px] flex justify-center";
    let deleteIcon = document.createElement("img");
    deleteIcon.src = "./assets/cancel.png";
    deleteIcon.alt = "Delete";

    deletebtn.appendChild(deleteIcon);
  
    deletebtn.addEventListener('click', function () {
        removeFromLocalStorage(fav); 
        option.remove(); 
    });
  
    option.addEventListener('click', function(){
      getData(fav);
    });
    
    option.appendChild(deletebtn); 
    info.appendChild(option); 
  });
}

fav.addEventListener("click", () => {
  let pokemon = pokemonName.innerText;
  if (!pokemon) {
    alert("Please enter a Pokémon name.");
    return;
  }

  let favorites = getLocalStorage();
  if (favorites.includes(pokemon)) {
    removeFromLocalStorage(pokemon);
    fav.src = "./assets/pokeball.png"; 
  } else {
    saveToLocalStorageByName(pokemon);
    fav.src = "./assets/pokeball (1).png"; 
  }
});

favList.addEventListener("click", () => {
  favoritesSection.classList.remove("hidden");
  getFavorites();
});
