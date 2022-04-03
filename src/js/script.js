const cadastrarCliente = document.getElementById('btn-cadastro')
const cancelar = document.getElementById('cancelar')
const cadastrar = document.getElementById('cadastrar')
const btnAcao = document.querySelector('#tabela>tbody')
const fechar = document.getElementById('fechar')
const modal = document.querySelector('.modal')
const informacao = document.querySelector('.informacao')

const abrirModal = () => {
    modal.classList.add('ativo')
}

const fecharModal = () => {
    modal.classList.remove('ativo')
    limparForm()
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []

const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

const verificarCampos = () => {
    return document.getElementById('form').reportValidity()
}

const limparForm = () => {
    const dadosModal = document.querySelectorAll('.dados-modal')
    dadosModal.forEach(dadosModal => dadosModal.value = '')
}

const salvarCliente = () => {
    if (verificarCampos()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'novo') {
            createClient(client)
            atualizarTabela()
            fecharModal()
        } else {
            updateClient(index, client)
            atualizarTabela()
            fecharModal()
        }

    }
}

const criarTR = (client, index) => {
    const novaTR = document.createElement('tr')
    novaTR.innerHTML = `
        <td>${client.nome}</td>
        <td class="esconder">${client.email}</td>
        <td class="esconder">${client.telefone}</td>
        <td class="esconder">${client.cidade}</td>
        <td class="mobile-view">
            <div class="acao">
                <apan class="ver"><button type="button" class="fa-solid fa-eye" id="ver-${index}"></button></apan>
                <button type="button" class="fa-solid fa-pen" id="editar-${index}"></button>
                <button type="button" class="fa-solid fa-trash" id="apagar-${index}"></button>
            </div> 
        </td>
    `

    document.querySelector('#tabela>tbody').appendChild(novaTR)
}

const limparTabela = () => {
    const linhas = document.querySelectorAll('#tabela>tbody tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

const atualizarTabela = () => {
    const dbClient = readClient()
    limparTabela()
    dbClient.forEach(criarTR)
}

const preecherCampos = (client) => {
    document.getElementById('nome').dataset.index = client.index
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('telefone').value = client.telefone
    document.getElementById('cidade').value = client.cidade
}

const editarCliente = (index) => {
    const client = readClient()[index]
    client.index = index
    preecherCampos(client)
    abrirModal()
}

const acao = () => {
    if (event.target.tagName == 'BUTTON') {
        const [action, index] = event.target.id.split('-')
        if (action == 'ver') {
            const clientInfo = document.getElementById('client-info')
            const client = readClient()[index]
            clientInfo.innerHTML = `
                <p>Nome: ${client.nome}</p>
                <p>Email: ${client.email}</p>
                <p>Telefone: ${client.telefone}</p>
                <p>Cidade: ${client.cidade}</p>
            `
            informacao.classList.add('ativo')
        }
        else if (action == 'editar') {
            editarCliente(index)
        }
        else {
            const client = readClient()[index]
            const confirmacao = confirm(`Tem certeza que deseja excluir ${client.nome}?`)
            if (confirmacao) {
                deleteClient(index)
                atualizarTabela()
            }

        }
    }
}

const fecharInformacoes = () => {
    informacao.classList.remove('ativo')
}

atualizarTabela()

cadastrarCliente.addEventListener('click', abrirModal)

cancelar.addEventListener('click', fecharModal)

cadastrar.addEventListener('click', salvarCliente)

btnAcao.addEventListener('click', acao)

fechar.addEventListener('click', fecharInformacoes)

function pesquisar() {
    var pesquisa = document.getElementById("buscar");
    var filtro = pesquisa.value.toUpperCase();
    var tabela = document.getElementById("tabela");
    var tr = tabela.getElementsByTagName("tr");
  
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filtro) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }