const search = document.getElementById("search");
const pokemonName = document.getElementById("pokemonName");
const pokemonLocation = document.getElementById("pokemonLocation");
const evo = document.getElementById("evo");
const abilities = document.getElementById("abilities");
const moves=document.getElementById("moves");
const pokemonImg = document.getElementById("pokemonImg");
const random = document.getElementById("random");
const fav = document.getElementById("fav");
const favList = document.getElementById("favList");

async function getData(pokemon) {
    try {
        // call to pokemon-species for the evo path 
        const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`)
        const data2 = await response2.json();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`); 
      const data = await response.json();
      console.log(data);
      console.log(data2);
      pokemonLocation.innerText = data2[0].location_area.name;
      pokemonName.innerText = data.forms[0].name.toUpperCase();
        pokemonImg.src = data.sprites.front_default; 
    moves.innerText =`Moves: ${data.moves.map(m => m.move.name).join(", ")}`; 
       
        abilities.innerText =`Abilities: ${data.abilities.map(a => a.ability.name).join(", ")}`;
 
    } catch (error) {
      alert("Error", error);
      
    }
  }



search.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    let pokemon = search.value;
        await getData(pokemon);
  }
});

random.addEventListener('click', ()=>{
let pokemon = Math.floor(Math.random()* 650);
getData(pokemon)
});

fav.addEventListener('click', ()=>{
// local storage
});

favList.addEventListener('click', ()=>{
// local storage
});
