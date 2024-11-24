const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

pokemonList.addEventListener('click', (event) => {
    const pokemonLi = event.target.closest('.pokemon');
    if (pokemonLi) {
        const pokemonId = pokemonLi.getAttribute('data-pokemon-id');
        showPokemonProfile(pokemonId);
    }
});

function showPokemonProfile(pokemonId) {
    const pokedexContent = document.getElementById('pokedexContent');
    const pokemonProfileContent = document.getElementById('pokemonProfileContent');

    pokedexContent.style.display = 'none';
    pokemonProfileContent.style.display = 'block';

    const selectedPokemon = pokemonList.querySelector(`[data-pokemon-id="${pokemonId}"]`);
    if (selectedPokemon) {
        const pokemonName = selectedPokemon.querySelector('.name').innerText;
        const pokemonNumber = selectedPokemon.querySelector('.number').innerText;
        const pokemonImage = selectedPokemon.querySelector('img').src;
        const pokemonTypes = selectedPokemon.querySelector('.types').innerHTML; // Obter os tipos
        const pokemonType = selectedPokemon.querySelector('.types li').classList[1]; // Pega a classe do tipo (ex: 'grass', 'fire', etc.)

        const profileHtml = `
            <div class="${pokemonType}" id="pokemonProfileBackground">
                <div class="poke-container" id="pokemon-profile">
                    <button id="backButton" class="btnBack">
                        <img class="btnImg" src="/assets/seta-esquerda.png" alt="seta-voltar">
                    </button>
                    <ol id="pokemonProfileList" class="pokemons">
                        <li class="pokemon-info">
                            <h2>${pokemonName}</h2>
                            <h3>${pokemonNumber}</h3>
                            <ul class="profileTypes">${pokemonTypes}</ul>
                            <img src="${pokemonImage}" alt="${pokemonName}">
                            <!-- Adicione mais detalhes como habilidades, estatísticas, etc -->
                        </li>
                    </ol>
                </div>
            </div>
        `;
        document.getElementById('pokemonProfileList').innerHTML = profileHtml;

        // Agora, adicionamos o event listener no botão de voltar
        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', () => {
            const pokedexContent = document.getElementById('pokedexContent');
            const pokemonProfileContent = document.getElementById('pokemonProfileContent');

            pokedexContent.style.display = 'block';
            pokemonProfileContent.style.display = 'none';
        });
    }
}
