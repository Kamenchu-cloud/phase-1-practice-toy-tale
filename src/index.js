let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  // Function to fetch and render toys
  function fetchAndRenderToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => renderToys(toys));
  }

  // Function to render toys
  function renderToys(toys) {
    const toyCollection = document.getElementById("toy-collection");
    toyCollection.innerHTML = ""; 

    toys.forEach((toy) => {
      const toyCard = createToyCard(toy);
      toyCollection.appendChild(toyCard);
    });
  }

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.innerText = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.innerText = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.id = toy.id;
    likeBtn.innerText = "Like ❤️";

    likeBtn.addEventListener("click", () => {
      // Implement the logic for liking a toy 
      const newNumberOfLikes = toy.likes + 1;

      // Make a PATCH request to update the likes
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: newNumberOfLikes,
        }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          // Update the likes in the DOM
          const toyCard = createToyCard(updatedToy);
          const existingCard = document.getElementById(updatedToy.id);
          existingCard.replaceWith(toyCard);
        });
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(likeBtn);

    return card;
  }

  // Fetch and render toys on page load
  fetchAndRenderToys();

  // Add event listener for the form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0,
    };

    // Make a POST request to add the new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((addedToy) => {
        // Fetch and render toys again to update the list
        fetchAndRenderToys();
      });
  });

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
