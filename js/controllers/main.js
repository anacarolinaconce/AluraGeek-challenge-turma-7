import { conecta } from "../services/product-services.js";

const productsContainer = document.querySelector("[data-product]");
const lista = document.querySelector("[data-form]");

function createCard( name, price, image, id ) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
		<div class="img-container">
			<img src="${image}" alt="${name}">
		</div>
		<div class="card-container--info">
			<p>${name}</p>
			<div class="card-container--value">
				<p>$ ${price}</p>
				<button class="delete-button" data-id="${id}">
					<img src="./assets/trashIcon.svg" alt="Eliminar">
				</button>
			</div>
		</div>
	`;
  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", async () => {
    await deleteProduct(id);
    card.remove(); 
  });

  return card;


}

async function listaProdutos() {
  const listaApi = await conecta.listaProdutos();
  listaApi.forEach(elemento => productsContainer.appendChild(
    createCard(elemento.name, elemento.price, elemento.image, elemento.id)))
}

async function deleteProduct(id) {
  try {
    await conecta.deletaProduto(id); 
    console.log(`Produto com ID ${id} excluído com sucesso.`);
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
  }
}
listaProdutos();

// Evento de envío do formulário
lista.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("[data-name]").value;
  const price = document.querySelector("[data-price]").value;
  const image = document.querySelector("[data-image]").value;

  if (name === "" || price === "" || image === "") {
    alert("Por favor, preenche todos os campos");
  } else {
    try {
      const newProduct = await servicesProducts.createProduct(
        name,
        price,
        image
      );
      console.log("Produto criado:", newProduct);
      const newCard = createCard(newProduct);
      productsContainer.appendChild(newCard);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
    }

    lista.reset(); // Reinicia o formulário
  }
});


