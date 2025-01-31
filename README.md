Name: Tanush Kumar
Date: 1/31/25
Project Name: Pokemon Api Challenge
Description:  Create a single page pokemon application using the Pokemonapi
Peer review: Aaron Robinson
The page works as intended, I would call the getData function when the window loads so the empty space gets populated right away. Maybe with just an random pokemon. I would also capitalize and replace the - with empty spaces when the data is diaplyed passing this function through all my .innerText helped with that

let capitalize = (string) =>{
    return string
    .toLowerCase()
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

}

the search also doesnt account for pokemon that have multiple types, some have two types like Dragonite and Rhydon, Jacob asked me about that so I know theyre looking for it. Other than that everything runs great

