function fetchPokemon() {
  const name = 'Pikachu';
  const delay = 1500;
  const pokemonQuery = `
    query PokemonInfo($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        image
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `;

  return window
    .fetch('https://graphql-pokemon2.vercel.app/', {
      // learn more about this API here: https://graphql-pokemon2.vercel.app/
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        delay: delay,
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: { name: name.toLowerCase() },
      }),
    })
    .then(async (response) => {
      const { data } = await response.json();
      if (response.ok) {
        const pokemon = data?.pokemon;
        if (pokemon) {
          return pokemon;
        } else {
          return Promise.reject(
            new Error(`No pokemon with the name "${name}"`)
          );
        }
      } else {
        const error = {
          messaage: data?.errors?.map((e) => e.message).join('\n'),
        };
        return Promise.reject(error);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function App() {
  console.log(fetchPokemon());
  return <div></div>;
}

export default App;
