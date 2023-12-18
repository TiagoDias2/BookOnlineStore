import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Books from './components/Books/Books';
import Cart from './components/Cart/Cart';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Logout from './components/Logout/Logout';



// Componente App
// O componente App é o componente principal da aplicação
// Responsável por renderizar todos os outros componentes


const App = () => {

  // Hooks
  // O estado isLoggedIn é inicializado como false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // O estado books é inicializado como um array vazio
  const [books, setBooks] = useState([]); 
  
  // O estado searchQuery é inicializado como uma string vazia
  const [searchQuery, setSearchQuery] = useState('');

  // hook useEffect
  // O hook useEffect é executado sempre que o componente App é renderizado
  useEffect(() => {
    // Verifica se o user está logado
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    // Se o user estiver logado, o estado isLoggedIn é atualizado para true
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  
    // Busca os livros na API
    fetch('https://api.sheety.co/8643bdf53fe6b6541a9183d0e5c59a22/frontPage/productItems')
      .then((response) => response.json())
      .then((result) => {
        // Atualiza o estado books com os livros retornados pela API
        setBooks(result.productItems);
      })
      .catch((error) => {
        console.error('Error loading books:', error);
      });
  }, []);



  // Função para atualizar o estado isLoggedIn
  const handleLoginSuccess = (email) => {
    // Atualiza o estado isLoggedIn para true
    setIsLoggedIn(true);
   
    localStorage.setItem('isLoggedIn', 'true');//armazena o estado isLoggedIn no localStorage

    localStorage.setItem('email', email); //armazena o email do user no localStorage
  };
  

  // Função para atualizar o estado isLoggedIn
  const handleLogout = () => {
    // Atualiza o estado isLoggedIn para false
    setIsLoggedIn(false);
    
    localStorage.setItem('isLoggedIn', 'false');//armazena o estado isLoggedIn no localStorage
  
    localStorage.removeItem('email'); //remove o email do user do localStorage
  };

  
  // Renderização do componente App
  return (
    <div>
    
      <Router> {/*Router é o componente que define as rotas da aplicação*/}
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLoginSuccess={handleLoginSuccess} onSearchChange={setSearchQuery} />
          <Routes>{/*Routes é um componente que renderiza o componente correspondente ao path que o user está acessando*/}
            <Route path="/"  element={<Books searchQuery={searchQuery} isLoggedIn={isLoggedIn} books={books} />} /> {/*element é o componente que será renderizado*/}
            <Route path="/login" element={<Login handleLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
          </Routes>
        </Router>
    </div>
  );
};

export default App;
