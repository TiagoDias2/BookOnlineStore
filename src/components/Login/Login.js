import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

// Componente Login 
const Login = ({ handleLoginSuccess}) => {//handleLoginSuccess é uma propriedade que é passada para o componente Login
  
  // Estados para controlar os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para controlar a mensagem de erro
  const [error, setError] = useState('');
  
  // Novo estado para controlar o sucesso do login
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Novo estado para controlar o estado do botão Login
  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  
  // Hook para navegar para a página inicial
  const userNavigate=useNavigate();

  
  // Função para comparar senhas 
  const comparePasswords = (storedPassword, enteredPassword) => {
    
    return storedPassword === enteredPassword; // Retorna true se as senhas forem iguais
  };


 // Função para enviar informações de login para o endpoint citado 
  const sendLoginInfo = async (email, password) => {
    try {
      const response = await fetch('https://api.sheety.co/70b5698a04c9427eaf582fc0a2e75a9b/login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: { 
            email: email,
            password: password,
          },
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${response.status} - ${errorMessage}`);
      } else {
        //...
      }
    } catch (error) {
      console.error('Error sending login info:', error);
      //....
    }
  };
  


  // Função chamada quando o formulário é submetido.
  const proceedLogin = async (e) => {
    e.preventDefault();
    

   
    // Verifica se os campos estão preenchidos
    if (validate()) {
      try {
        // Requisição GET para verificar se o user com o e-mail e senha especificados existe.
        const response = await fetch(`https://api.sheety.co/70b5698a04c9427eaf582fc0a2e75a9b/register/register?filter[email]=${email}&filter[password]=${password}`);
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Converte a resposta em JSON
        //responseData é um objeto que contém um array chamado register 
        const responseData = await response.json();//
          

        //Após a obtenção da resposta da requisição à API e a conversão dessa resposta num objeto JSON, 
        //ocorre a verificação da existência de um user no array register do objeto responseData
        //Esta linha verifica se o array register tem pelo menos um elemento. Se o comprimento do array for maior que zero, 
        //isso indica que existe pelo menos um user na resposta da API.
        if (responseData.register.length > 0) {
           
          // Armazena o primeiro user do array register na variável user
          const user = responseData.register[0];


          // Verifica se a senha está correta
          if (comparePasswords(user.password, password)) {
            handleLoginSuccess();
            setLoginSuccess(true);
            setButtonDisabled(true);
            setError('');
            
            // Armazena o estado isLoggedIn no localStorage
            localStorage.setItem('isLoggedIn', 'true'); 
            
            // Envia as informações de login para o endpoint citado
            await sendLoginInfo(user.email, user.password); 


          // Redireciona para a página inicial após 1 segundo
            setTimeout(() => {
              handleLoginSuccess();
              userNavigate('/');
    
            }, 1000);
            
            

          // Se a senha estiver incorreta acontece o seguinte
          } else {
            setError('Invalid credentials');
            setLoginSuccess(false);
            
  
          }
          // Se o user não existir acontece o seguinte
        } else {
          setError('User not found');
          setLoginSuccess(false);
          
          /// Limpa a mensagem após 5 segundos
          setTimeout(() => {
            setError('');
          }, 5000);
        }

        // Se houver algum erro acontece o seguinte
      } catch (error) {
        setError('Error fetching user data');
        setLoginSuccess(false);
      }
    }
  };
  

  // Função para validar os campos
  const validate = () => {
    // Verifica se os campos estão preenchidos
    if (email === '' && password === '') {
      setError('Please fill in both fields');
      setTimeout(() => {
        setError('');
      }, 5000); // Limpa a mensagem após 5 segundos
      return false;
     // Verifica se o campo email está preenchido 
    } else if (email === '' || email === null) {
      setError('Please fill in the email field');
      setTimeout(() => {
        setError('');
      }, 5000); // Limpa a mensagem após 5 segundos
      return false;
      // Verifica se o campo password está preenchido
    } else if (password === '' || password === null) {
      setError('Please fill in the password field');
      setTimeout(() => {
        setError('');
      }, 5000); // Limpa a mensagem após 5 segundos
      return false;
    } else {
      setError('');
      return true;
    }
  };
  


  // Formulário de login
  return (
    <div>
      <form className="container" onSubmit={proceedLogin}>
        <div className="card-register">
          <h1>User Login</h1>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Email<span className="errmsg">*</span></label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Password<span className="errmsg">*</span></label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                </div>
              </div>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {loginSuccess && <div className="success-message">Login successful!</div>}
          <div className="card-footer">
            <button type="submit" className="btn btn-primary"  disabled={buttonDisabled}>Login</button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Login;