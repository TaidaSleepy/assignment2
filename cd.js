const animalList = document.getElementById('list');
const detailsDiv = document.getElementById('Details');

//Gets the animal names from the json and gets the list
function getAnimals() {
  fetch('http://localhost:3000/characters')
    .then(response => response.json())
    .then(animals => {
     
      showAnimalList(animals);
    })
    
}

//Shows the list of the animals and adds them
function showAnimalList(animals) {
  animals.forEach(animal => {
    const listItem = document.createElement('li');
    listItem.textContent = animal.name;
    
    //Clicks then gets the details of the animals
    listItem.addEventListener('click', () => {
      showAnimalDetails(animal);
    });
    
    animalList.appendChild(listItem);
  });
}

//Shows the detail of the specific animal clicked
function showAnimalDetails(animal) {
  detailsDiv.innerHTML = `
    <h3>${animal.name}</h3>
    <img src="${animal.image}" alt="${animal.name}" width="200">
    <p>Votes: <span id="vote-count">${animal.votes}</span></p>
    <button onclick="voteForAnimal(${animal.id})">Vote</button>
    <button onclick="resetVotes(${animal.id})">Reset Votes</button>
  `;
}

//Adds vote count when vote is clicked and adds it to the server
function voteForAnimal(animalId) {
  fetch(`http://localhost:3000/characters/${animalId}`)
    .then(response => response.json())
    .then(animal => {
      animal.votes += 1;
      fetch(`http://localhost:3000/characters/${animalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          votes: animal.votes
        })
      })
      .then(response => response.json())
      .then(updatedAnimal => {
        // Update the vote count display
        document.getElementById('vote-count').textContent = updatedAnimal.votes;
      });
    });
}

//vote reset bonus that resets the votes to 0 and updates the server
function resetVotes(animalId) {
  fetch(`http://localhost:3000/characters/${animalId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ //.stringify sends data to the server
      votes: 0
    })
  })
  .then(response => response.json())
  .then(updatedAnimal => {
    document.getElementById('vote-count').textContent = 0;
  });
}

//Start
getAnimals();