import React from 'react';

export function fetchPokemon() {
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

export function PokemonForm({
  pokemonName: externalPokemonName,
  initialPokemonName = externalPokemonName || '',
  onSubmit,
}) {
  const [pokemonName, setPokemonName] = React.useState(initialPokemonName);

  // this is generally not a great idea. We're synchronizing state when it is
  // normally better to derive it https://kentcdodds.com/blog/dont-sync-state-derive-it
  // however, we're doing things this way to make it easier for the exercises
  // to not have to worry about the logic for this PokemonForm component.
  React.useEffect(() => {
    // note that because it's a string value, if the externalPokemonName
    // is the same as the one we're managing, this will not trigger a re-render
    if (typeof externalPokemonName === 'string') {
      setPokemonName(externalPokemonName);
    }
  }, [externalPokemonName]);

  function handleChange(e) {
    setPokemonName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(pokemonName);
  }

  function handleSelect(newPokemonName) {
    setPokemonName(newPokemonName);
    onSubmit(newPokemonName);
  }

  return (
    <form onSubmit={handleSubmit} className='pokemon-form'>
      <label htmlFor='pokemonName-input'>Pokemon Name</label>
      <small>
        Try{' '}
        <button
          className='invisible-button'
          type='button'
          onClick={() => handleSelect('pikachu')}
        >
          "pikachu"
        </button>
        {', '}
        <button
          className='invisible-button'
          type='button'
          onClick={() => handleSelect('charizard')}
        >
          "charizard"
        </button>
        {', or '}
        <button
          className='invisible-button'
          type='button'
          onClick={() => handleSelect('mew')}
        >
          "mew"
        </button>
      </small>
      <div>
        <input
          className='pokemonName-input'
          id='pokemonName-input'
          name='pokemonName'
          placeholder='Pokemon Name...'
          value={pokemonName}
          onChange={handleChange}
        />
        <button type='submit' disabled={!pokemonName.length}>
          Submit
        </button>
      </div>
    </form>
  );
}
