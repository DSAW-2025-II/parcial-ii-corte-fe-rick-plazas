const backendUrl = "http://localhost:3000"; //CAMBIAR

//Login automático con botón
document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(`${backendUrl}/api/v1/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@admin.com",
        password: "admin"
      })
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("sessionToken", data.token);
      document.getElementById("loginStatus").innerHTML =
        "<p style='color:green;'>Login exitoso ✅</p>";
    } else {
      document.getElementById("loginStatus").innerHTML =
        "<p style='color:red;'>Credenciales inválidas ❌</p>";
    }
  } catch (err) {
    console.error(err);
  }
});

//Buscar Pokemon (requiere token)
document.getElementById("pokemonForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pokemon = document.getElementById("pokemonInput").value;
  const token = localStorage.getItem("sessionToken");
  const resultadoDiv = document.getElementById("resultado");

  if (!token) {
    resultadoDiv.innerHTML = "<p style='color:red;'>Usuario no autenticado ❌</p>";
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/api/v1/pokemonDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ pokemonName: pokemon })
    });

    const data = await response.json();

    if (data.name === "") {
      resultadoDiv.innerHTML = "<p style='color:red;'>Ups! Pokémon no encontrado</p>";
    } else {
      resultadoDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>Especie: ${data.species}</p>
        <p>Peso: ${data.weight}</p>
        <img src="${data.img_url}" alt="${data.name}">
      `;
    }
  } catch (err) {
    resultadoDiv.innerHTML = "<p style='color:red;'>Error al consultar</p>";
  }
});
