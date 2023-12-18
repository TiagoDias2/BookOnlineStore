import React,{useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './Cart.css';



export const useCart = () => {//O hook useCart retorna um objeto com 4 valores: cartItems, addToCart, removeFromCart e resetCart.
  
  //cartItems: Um array que contém todos os itens no carrinho.
  const [cartItems, setCartItems] = useState(() => { //O hook useState é usado para definir o estado inicial do carrinho.
    
    // Esta linha tenta recuperar o valor salvo com a chave 'cart' do localStorage. O localStorage é uma forma de armazenar dados 
    //localmente no browser do user,permitindo persistir dados entre sessões de navegação.
    const savedCart = localStorage.getItem('cart'); 

    //Verifica se savedCart é verdadeiro (neste caso, se algum valor foi encontrado no localStorage). Se for verdadeiro, 
    //é usado o JSON.parse(savedCart) para converter a string JSON salva de volta a um objeto/array JavaScript
    //(já que os dados são armazenados como strings no localStorage).
    //Se savedCart for falso (nada foi encontrado no localStorage para a chave 'cart'), é retornado um array vazio []. 
    //Este valor retornado é então usado como o estado inicial para cartItems.
    return savedCart ? JSON.parse(savedCart) : [];
  });
  

  //useEffect: O hook useEffect é usado para atualizar o localStorage sempre que o estado cartItems é alterado.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  


  //addToCart: Uma função que é usada para adicionar um item ao carrinho.
  const addToCart = (item) => {
    
    //Cria uma cópia do estado cartItems.
    //O operador spread (...) é usado para criar uma cópia do estado cartItems.
    //O cartItems é um array de itens no carrinho de compras e pretendo adicionar um novo item. Em vez de adicionar diretamente ao array cartItems 
    //vou criar uma cópia (updatedCartItems) e adicionar o novo item a essa cópia ,em seguida, uso setCartItems(updatedCartItems)
    // para atualizar o estado.
    const updatedCartItems = [...cartItems];

    //Verifica se o item já existe no carrinho.
    const existingItem = updatedCartItems.find((cartItem) => cartItem.title === item.title);
    
    //Se o item já existe, aumenta a sua quantidade.
    if (existingItem) {
      existingItem.quantity += 1;
      setCartItems(updatedCartItems);//atualiza o estado cartItems
      
    //Se o item não existe, adiciona-o ao carrinho com uma quantidade de 1.
    } else {
      setCartItems([...updatedCartItems, { ...item, quantity: 1 }]);
    }
  };


  //removeFromCart: Uma função que é usada para remover um item do carrinho.Se o item já existe, diminui a sua quantidade.
  const removeFromCart = (item) => {

    //Cria uma cópia do estado cartItems.
    //O operador spread (...) é usado para criar uma cópia do estado cartItems.
    const updatedCartItems = [...cartItems];
    const existingItem = updatedCartItems.find((cartItem) => cartItem.title === item.title);
     
    //Se o item já existe, diminui a sua quantidade.
    if (existingItem) {
      //Se a quantidade do item for maior que 0, diminui a sua quantidade.
      if (existingItem.quantity > 0) { 
        existingItem.quantity -= 1;
        setCartItems(updatedCartItems);
      }
    }
  };

 //resetCart: Uma função que é usada para limpar o carrinho.
  const resetCart = () => {
    setCartItems([]);
  };

  //O hook useCart retorna um objeto com três valores: cartItems, addToCart, e removeFromCart.
  return { cartItems, addToCart, removeFromCart, resetCart };
};






// Componente Cart
//Responsável pela visualização e interação com o carrinho de compras
const Cart = () => {
  
  // O componente Cart utiliza o hook useCart para aceder e manipular os itens do carrinho.
  const { cartItems, addToCart, removeFromCart,resetCart } = useCart();

  
  
  //A função handleAddBook é chamada quando o botão "+" é clicado.
  const handleAddBook = (item) => {
    addToCart(item);
  };


  //A função handleRemoveBook é chamada quando o botão "-" é clicado.
  const handleRemoveBook = (item) => {
    removeFromCart(item);
  };


  //A função handleResetQuantity é chamada quando o botão com ícone de lixo é clicado.
  const handleResetQuantity = (item) => {
    item.quantity = 1; // Define a quantidade do item como um
    removeFromCart(item); // Chama a função removeFromCart para atualizar o carrinho
  };
  
 //A função handleCheckout é chamada quando o botão "Pay" é clicado.
  const handleCheckout = () => {
    // Exibir o alerta
    window.alert("You will receive an email with the details of your order, as well as a section to make the payment for your order.");

    // Chamar a função para limpar o carrinho
    resetCart();
  };
  


  //A função totalPrice calcula o preço total dos itens no carrinho.
  const totalPrice = cartItems.reduce((total, item) => {
  const itemPrice = parseFloat(item.price) || 0;
  const itemQuantity = parseInt(item.quantity) || 0;
  return total + itemQuantity * itemPrice;
}, 0);



  //Maneira eficiente de criar uma versão filtrada do array cartItems, excluindo quaisquer itens que não devem mais estar presentes no carrinho 
  //de compras devido à sua quantidade ser zero ou negativa.
  const updatedCartItems = cartItems.filter(item => item.quantity > 0);


  //Renderiza uma representação visual do carrinho de compras
  return (
    <div className="cart-items">
      {updatedCartItems.length === 0 && (
        <div className="cart-items-empty">Empty Cart</div>
      )}

      {updatedCartItems.length > 0 && (
        <div>
          <div className="cart-items-navbar">Cart Items</div>
          {updatedCartItems.map((item, index) => (
            <div key={index} className="cart-items-list">
              <img className="cart-items-image" src={item.img} alt={item.title} />
              <div className="cart-items-name">{item.title}</div>
              <div className="cart-items-function">
                <button className="cart-items-remove" onClick={() => handleRemoveBook(item)}>
                  -
                </button>
                <button className="cart-items-add" onClick={() => handleAddBook(item)}>
                  +
                </button>
                <button className="cart-items-reset" onClick={() => handleResetQuantity(item)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="cart-items-price">
                {item.quantity} * {item.price} Eur
              </div>
            </div>
          ))}
          <div className="cart-items-total-price-name">
            Total Price:
            <div className="cart-items-total-price">{totalPrice} Eur</div>
          </div>

          <button className="checkout-button" onClick={handleCheckout}>
            Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
