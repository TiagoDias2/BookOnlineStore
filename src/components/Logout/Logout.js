import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Cart/Cart';




// Função para realizar o logout
const Logout = ({ handleLogout }) => {
  
  const navigate = useNavigate();
   
  // O hook useCart retorna a função removeFromCart
  const { cartItems, removeFromCart } = useCart();
 
  
  // Hook useEffect para executar a função handleLogout
   useEffect(() => {
    // Função para realizar o logout e limpar os dados
    const logoutAndClearData = async () => {
      // Tenta realizar o logout e limpar os dados
      try {
        // Chama a função handleLogout
        await handleLogout(); 
        // Remove o estado isLoggedIn do localStorage
        localStorage.removeItem('isLoggedIn');
        // Remove os itens do carrinho de compras  
        // Percorre o array cartItems e remove cada item do carrinho
        cartItems.forEach(item => {
          removeFromCart(item);
        });
        
        //Manipular a URL exibida no browser 
        window.history.replaceState(null, '', '/'); 
        
        // Redireciona para a página inicial após o logout
        setTimeout(() => {
          navigate('/');
        }, 50); 


        // Envia uma requisição para o endpoint de login
        const response = await fetch('https://api.sheety.co/8643bdf53fe6b6541a9183d0e5c59a22/login/login/2', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          // Envia um objeto vazio
          body: JSON.stringify({
            login: {
              email: '', 
              password: '', 
            },
          }),
        });
        // Verifica se a resposta da requisição não foi ok
        if (!response.ok) {
          throw new Error('Erro ao limpar os dados de login');
        }
        // Redireciona para a página inicial após o logout 
        navigate('/');

      // Caso ocorra algum erro, exibe na console  
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      
      }
    };
    // Executa a função logoutAndClearData
    logoutAndClearData(); 
  }, [cartItems, handleLogout, navigate, removeFromCart]) // O useEffect é executado sempre que o array cartItems, a função handleLogout, 
  //a função navigate ou a função removeFromCart forem atualizados

  return null; // O Componente não renderiza nada, apenas executa uma ação
};

export default Logout;
