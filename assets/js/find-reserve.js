//Preparando para exceptions
const failed = document.querySelector('#modal-error-container');
const closeFail = document.querySelector('#close-modal-error');
const ok = document.querySelector('#ok-button');
let errorMsg = document.querySelector('#modal-error-msg')

closeFail.addEventListener('click', () => {
    failed.classList.remove('active');
})

ok.addEventListener('click', () => {
    failed.classList.remove('active');
})

const table = document.querySelector('#table');
const tBody = document.querySelector('#tBody');
const findBy = document.querySelector('#findBy');
const find = document.querySelector('#find');
const buscaDinamica = document.querySelector('#dinamicFind');

export async function buscarEInserirNaTabela() {
    try {

        const response = await fetch('https://apirest-hotel.up.railway.app/reservas/lista');
        const data = await response.json();

        //limpa todo conteúdo antigo da tabela
        tBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.dataCheckIn}</td>
            <td>${item.dataCheckOut}</td>
            <td>R$${item.valorReserva},00</td>
            <td>${item.pagamento}</td>
            <td class="acao">
                <button><i class="fa-solid fa-pen-to-square" id="put" 
                data-reserva-id="${item.id}" 
                data-reserva-checkin="${item.dataCheckIn}" 
                data-reserva-checkout="${item.dataCheckOut}" 
                data-reserva-valor="${item.valorReserva}" 
                data-reserva-pagamento="${item.pagamento}"></i></button>
            </td>
            <td class="acao">
                <button><i class="fa-solid fa-trash" id="delete" 
                data-reserva-id="${item.id}" 
                data-reserva-valor="${item.valorReserva}"></i></button>
            </td>
            `;
            tBody.appendChild(row);
        });

        // Modificações no DOM concluídas
        //A página de put e delete necessitam disso ;-;
        const event = new Event('scriptsLoaded');
        document.dispatchEvent(event);

    } catch (error) {

        failed.classList.add('active');
        errorMsg.textContent = `${error}, server off`;

    }
}
buscarEInserirNaTabela();

//Buscar por um id específico
find.addEventListener('click', async () => {

    const query = findBy.value.trim();

    //Caso o input esteja nulo, então considere que busque todos os dados do db;
    if (!query) {
        buscarEInserirNaTabela();
        return;
    }

    try {
        const response = await fetch('https://apirest-hotel.up.railway.app/reservas/id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: query })
        });

        if (response.ok) {
            const data = await response.json();

            tBody.innerHTML = '';

            // Verifique se o objeto de dados está vazio ou nulo
            if (data) {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.dataCheckIn}</td>
                <td>${data.dataCheckOut}</td>
                <td>R$${data.valorReserva},00</td>
                <td>${data.pagamento}</td>
                <td class="acao">
                    <button><i class="fa-solid fa-pen-to-square" id="put" 
                    data-reserva-id="${data.id}" 
                    data-reserva-checkin="${data.dataCheckIn}" 
                    data-reserva-checkout="${data.dataCheckOut}" 
                    data-reserva-valor="${data.valorReserva}" 
                    data-reserva-pagamento="${data.pagamento}"></i></button>
                </td>
                <td class="acao">
                    <button><i class="fa-solid fa-trash" id="delete" 
                    data-reserva-id="${data.id}" 
                    data-reserva-valor="${data.valorReserva}"></i></button>
                </td>
                `;
                tBody.appendChild(row);

            } else {

                failed.classList.add('active');
                errorMsg.textContent = `${error}`;

            }
        } else {
            failed.classList.add('active');
            errorMsg.textContent = `Erro na resposta do servidor`;
        }

        // Modificações no DOM concluídas
        //A página de put e delete necessitam disso ;-;
        const event = new Event('scriptsLoaded');
        document.dispatchEvent(event);

    } catch (error) {

        failed.classList.add('active');
        errorMsg.textContent = `dado não encontrado`;

    }
})

//Realizando busca dinâmica
buscaDinamica.addEventListener('keyup', () => {
    let valor = buscaDinamica.value.toLowerCase();

    if (valor.length === 1) {
        return
    }

    let row = tBody.getElementsByTagName('tr');

    for (let posicao in row) {
        if (true === isNaN(posicao)) {
            continue;
        }

        let dadosDaRow = row[posicao].innerHTML.toLowerCase();

        if (true === dadosDaRow.includes(valor)) {
            row[posicao].style.display = '';
        } else {
            row[posicao].style.display = 'none';
        }
    }
})