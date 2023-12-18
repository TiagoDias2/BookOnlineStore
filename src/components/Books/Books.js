import React, { useState, useEffect } from 'react';
import './Books.css';
import { useCart } from '../Cart/Cart';


// Componente Books aceita duas props: isLoggedIn e searchQuery
const Books = ({ isLoggedIn,searchQuery }) => {
   
  
const { addToCart } = useCart();// O hook useCart retorna a função addToCart
  
const [posts, setPosts] = useState([]);//O estado posts é inicializado como array vazio e vai armazenar os dados dos livros retornados pela API
  
  // hook useEffect
  // O hook useEffect é executado sempre que o componente Books é renderizado
  // Busca os livros na API
  useEffect(() => {
    fetch("https://api.sheety.co/8643bdf53fe6b6541a9183d0e5c59a22/frontPage/productItems")
      .then(response => response.json())
      .then(result => setPosts(result.productItems))// Atualiza o estado posts com os livros retornados pela API
      .catch(error => console.error('Erro ao carregar os livros:', error));
  }, []);
  
  
  // Função para adicionar um livro ao carrinho
  //Quando o usuário clica no botão "Add To Cart", o livro é adicionado ao carrinho
  const handleAddToCart = (bookItem) => {
    // Verifica se o usuário está logado antes de adicionar o livro ao carrinho
    if (isLoggedIn) {
      addToCart({ ...bookItem, quantity: 1 });// Adiciona o livro ao carrinho
      //Se o usuário não estiver logado, exibe um alerta
    } else {
      alert('Please Log In to add to cart.');
    }
  };
  
  
  // Filtra os livros de acordo com o valor do estado searchQuery
  const filteredBooks = searchQuery
    ? posts.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts; // Se o estado searchQuery estiver vazio, retorna todos os livros

  

  //Renderiza uma representação visual dos livros
  // O "useEffect" carrega os dados, e este "return" exibe esses dados de forma visual na página.
  //O "useEffect" funciona como o processo de trazer os livros para a biblioteca e o "return" serve para dispor esses livros nas prateleiras 
  //para as pessoas verem e escolherem.
   return (
    <div className="books">
      {filteredBooks.map(bookItem => (
        <div className="card" key={bookItem.id}>
          <img className="book-image" src={bookItem.img} alt={bookItem.title} />
          <h3 className="book-name">{bookItem.title}</h3>
          <div className="book-name">Genre: {bookItem.genre}</div>
          <div className="book-price">Price: {bookItem.price} Eur</div>
          <div className="book-author">Author: {bookItem.author}</div>
          <button className="book-add-button" onClick={() => handleAddToCart(bookItem)}>
            Add To Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Books;
