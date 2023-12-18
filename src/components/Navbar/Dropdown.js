import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css';


// Componente Dropdown
function Dropdown({ isLoggedIn, handleLogout }) {
  
  // Estado para controlar o clique na dropdown
  const [click, setClick] = useState(false);
   
  // Funções
  // Função para controlar o clique no dropdown
  const handleClick = () => setClick(!click);
  
  // Função para fechar o dropdown após logout
  const handleLogoutClick = () => {
    handleLogout(); 
    setClick(false); // Fecha o dropdown após logout
  };

 // Retorna o componente Dropdown
  return (
    <>
  
      {isLoggedIn ? ( // Se o user estiver logado, exibe o menu com as opções de perfil e logout
        <ul className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}>
          <li>
            <Link className='dropdown-link' to='/profile' onClick={handleClick}>
              Profile
            </Link>
          </li>
          <li>
            <Link className='dropdown-link' to='/logout' onClick={handleLogoutClick}>
              Logout
            </Link>
          </li>
        </ul>
        // Se o user não estiver logado, exibe o menu com as opções de login e registro
      ) : (
        <ul className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}>
          <li>
            <Link className='dropdown-link' to='/login' onClick={handleClick}>
              Login
            </Link>
          </li>
          <li>
            <Link className='dropdown-link' to='/register' onClick={handleClick}>
              Register
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}

export default Dropdown;