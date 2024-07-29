// consultar API externa
import { GithubUser} from './GithubUser.js'
// classe que vai conter a lógica dos dados
// como os dados serão estruturados
class Favorites { 
  constructor(root) {
    
    this.root = document.querySelector(root)       
    
    
    this.load()
    
  }
  
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
    
    // this.entries = [
    //   {
    //     login: "valtinhobranco" ,
    //     name: "Valtinho Branco" ,
    //     public_repos: "27",
    //     followers: '0'
    //   },
    //   {
    //     login: "maykbrito" ,
    //     name: "Mayk Brito" ,
    //     public_repos: "27",
    //     followers: '0'  
    //   },
    // ]
  }
  
  // salvando na memoria 
  save() {
    localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
    
  }
  
  // Adicionando novo usuário
  
  async add(username) {
    try {
      const userExist = this.entries.find(entry => entry.login === username)
      
      
      if (userExist) {
        throw new Error('Usuario ja existe')
      }
      
      const user = await  GithubUser.search(username)
      
      if (user.login === undefined) {
        throw new Error('Usuario não encontrado')
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      
    } catch (error) {
      alert(error.message)
    }
  }
  
  // deletar usuário
  delete(user) {
    const filteredEntries = this.entries.filter((entry) => entry.login !== user.login)
    
    this.entries = filteredEntries
    
    this.update()
    this.save()
  }
}



class FavoritesView extends Favorites { 
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('.table-wrapper-tbody table tbody')
    this.tableWrapperTbody = this.root.querySelector('.table-wrapper-tbody')
    this.DisableTableWrapper = this.root.querySelector('.disable-table-wrapper')
    this.update()
    this.onadd()
  }
  
  onadd() {
    const addButton = this.root.querySelector('.search-wrapper .input-button')
    
    addButton.addEventListener('click', () => {
      const input = this.root.querySelector('.search-wrapper input')
      const { value } = this.root.querySelector('.search-wrapper input')
      
      value
      this.add(value)
      input.value = ''
    })
    
    
  }
  
  update() {
    this.emptyState()
    
    this.removeAllTrs()

      this.entries.forEach(user => {
        
        const row = this.createRow()
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent =  user.name
        row.querySelector('.user span').textContent = `/${user.login}`
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers
        row.querySelector('.remove').addEventListener('click' , () => {
          const confirmMsg = confirm('Tem certeza que deseja excluir esse usuário?')
          if (confirmMsg) {
            this.delete(user)
          } 
        })
        this.tbody.append(row)
      })
    
    // buscar infos do load() e criar as tabelas 
  }
  
  createRow() {
    const createTr = document.createElement('tr')
    const createTd = `
    <td class="user">
    <img src="https://github.com/valtinhobranco.png" alt="Imagem de valtinhobranco">
    <a href="https://github.com/valtinhobranco" target="_blank">
    <p>Valtinho Branco</p>
    <span>/valtinhobranco</span>
    </a>
    </td>
    
    <td class="repositories">
    27
    </td>
    
    <td class="followers">
    0
    </td>
    
    <td>
    <button class="remove">
    Remover
    </button>
    </td>
    
    `
    createTr.innerHTML = createTd
    
    return createTr
  }
  
  removeAllTrs() {
    //? para remover todas as tabelas
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
  
  emptyState() {
    if (this.entries.length !== 0) {
      this.DisableTableWrapper.classList.add('hide')
    } else {
      this.DisableTableWrapper.classList.remove('hide')
    }
  }
}

export { FavoritesView }

