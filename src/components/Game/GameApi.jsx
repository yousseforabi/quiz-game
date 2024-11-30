// src/components/Game/GameAPI.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GameAPI() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('https://api.chucknorris.io/jokes/random')
      .then((response) => setData(response.data.value))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Game Fun Fact:</h2>
      <p>{data}</p>
    </div>
  );
}

export default GameAPI;
