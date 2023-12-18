import React, { useState,useEffect,useRef } from 'react';
import { CartFill, PersonCircle, Search } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from './Dropdown';


//O componente Navbar recebe as props handleLogout, handleLoginSuccess, isLoggedIn, onSearchChange
const Navbar = ({ handleLogout, handleLoginSuccess, isLoggedIn, onSearchChange }) => { 
  
  const [dropdown, setDropdown] = useState(false);
  // ref do React usado para detectar cliques fora do menu dropdown para fechá-lo automaticamente
  const dropdownRef = useRef(null);
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');// O estado localSearchQuery é inicializado como uma string vazia
  
  
  const closeDropdown = () => {// Função para fechar a dropdown
    setDropdown(false);
  };
 
  
  const handleDropdownClick = () => {// Função para abrir a dropdown
    setDropdown(!dropdown);// O estado dropdown é atualizado para o valor oposto
  };
 
  
  const handleClickOutside = (event) => {// Função para fechar a dropdown quando o user clica fora dela
    // Se o user clicar fora da dropdown, o estado dropdown é atualizado para false
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      
      setDropdown(false);
    }
  };
  
  // Esta função é chamada sempre que o valor do campo de entrada da pesquisa (um <input> no JSX) muda.
  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  // Esta função é chamada quando o formulário de pesquisa é enviado (quando o user pressiona a lupa)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };
 
  //Reset da barra de pesquisa e fecho do menu dropdown.
  const handleEBookStoreClick = () => {
    closeDropdown();
    setLocalSearchQuery('');
    onSearchChange('');
  };
  

  //Os users podem interagir com outros elementos da página sem se preocupar em fechar manualmente o menu dropdown. 
  //Por exemplo, se um user abrir o menu dropdown e depois decidir clicar em outra parte da página 
  //(como para selecionar um item ou apenas para navegar), o menu dropdown será automaticamente fechado. 
  //Isso melhora a experiência geral do user.
  useEffect(() => {
    
    document.addEventListener('mousedown', handleClickOutside);
    // Retorna uma função que remove o event listener quando o componente é desmontado
    return () => {
      // Remoção do listener de eventos mousedown do documento. 
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  
  
  // Renderiza o componente Navbar
  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='navbar-logo' onClick={handleEBookStoreClick}>
          EBookStore
          <i className='fab fa-firstdraft' />
        </Link>
        <ul className='nav-menu'>
          <li className='nav-item'>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Pesquisar"
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <Search />
              </button>
            </form>
          </li>
          <li className='nav-item'>
            <Link to="/carrinho" className="nav-links">
              <CartFill />
            </Link>
          </li>
          <li className='nav-item' ref={dropdownRef}>
            <div className='nav-links' onClick={handleDropdownClick}>
              <PersonCircle />
              {dropdown && (
                <Dropdown
                  isLoggedIn={isLoggedIn}
                  handleLogout={handleLogout}
                  handleLoginSuccess={handleLoginSuccess}
                />
              )}
            </div>
          </li>
        </ul>
      </nav>
      
     
    </>
  );
};

export default Navbar;
