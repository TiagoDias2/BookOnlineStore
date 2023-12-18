import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";



// Componente Register

const Register = () => {
  // Hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false); 
  
  // Expressões para validar email e password
  const emailPattern = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com|outlook\.com)$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const navigate = useNavigate();

  

  // Efeito para fechar os alertas de sucesso e de erro
  // O efeito é executado sempre que o estado de showSuccess ou de showWarning é alterado
  useEffect(() => {
    let timer;
    // Se o alerta de sucesso ou de erro estiverem ativos, o timer é iniciado
    if (showSuccess || showWarning) {
      // Após 3 segundos, o alerta de sucesso ou de erro é fechado
      timer = setTimeout(() => {
        setShowSuccess(false);
        setShowWarning(false);
      }, 3000);
    }
    // Se o alerta de sucesso ou de erro não estiverem ativos, o timer é limpo
    return () => {
      clearTimeout(timer);
    };
  }, [showSuccess, showWarning]);// O useEffect é executado sempre que o estado de showSuccess ou de showWarning é alterado

  
  
  // Função para submeter o formulário

  const handleSubmit = (e) => {
    
    // Evita o comportamento padrão do formulário
    e.preventDefault();
    
    // Validação do email e da password
    const isEmailValid = email.match(emailPattern);
    const isPasswordValid = password.match(passwordPattern);
   
    // Se o email ou a password estiverem vazios, exibe o alerta de erro
    if (!email || !password) {
      setShowWarning(true);
      setShowSuccess(false);
      setEmailError(false);
      setPasswordError(false);
      return;
    }
    
    // Se o email ou a password não forem válidos, exibe o alerta de erro
    if (!isEmailValid || !isPasswordValid) {
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);
      setShowWarning(true);
      setShowSuccess(false);
      return;
    }
    
    // Se o email já estiver registrado, exibe o alerta de erro
    setShowWarning(false); 
    

    // Fetch para verificar se o email já está registrado
    fetch(`https://api.sheety.co/8643bdf53fe6b6541a9183d0e5c59a22/register/register`)
      .then((response) => response.json())
      .then((data) => {
        // Armazena o array de emails registrados
        const registerArray = data.register; 
        // Verifica se o email já está registrado
        const existingEmail = registerArray.find((item) => item.email === email);
        

        // Se o email já estiver registrado, exibe o alerta de erro
        if (existingEmail) {
          
          setEmailExistsError(true); 
          setShowWarning(true);
          setShowSuccess(false);

        }

        // Se o email não estiver registrado, prossegue com o registro
        else {
          fetch("https://api.sheety.co/8643bdf53fe6b6541a9183d0e5c59a22/register/register", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              register: {
                email: email,
                password: password,
              },
            }),
          })
          // Se o registro for bem sucedido, exibe o alerta de sucesso
            .then((response) => response.json())
            .then((data) => {

              setShowSuccess(true);
              setIsRegistered(true);
              // Após 3 segundos, o alerta de sucesso é fechado e o user é redirecionado para a página de login
              setTimeout(() => {
                setShowSuccess(false);
                navigate('/login');
              }, 3000);
            })
            // Se o registro não for bem sucedido, exibe o alerta de erro
            .catch((error) => {
              console.error('Error:', error);
              setShowSuccess(false);
            });
        }
      })
    
  };
  

  
  // Exibe o formulário de registro
  return (
    <div>
      <form className="container" onSubmit={handleSubmit}>
        <div className="card-register">
          <h1>User Registration</h1>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Email<span className="errmsg">*</span></label>
                  <input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                      setShowWarning(false);
                      setEmailExistsError(false); // Reset existing email error
                    }}
                    className="form-control"
                  ></input>
                  {showWarning && !email && (
                    <div className="warning-msg">
                      Fill in the missing field
                    </div>
                  )}
                  {showWarning && emailError && (
                    <div className="warning-msg">
                      Incorrect filled email
                    </div>
                  )}
                  <div className="warning-msg">
                    {showWarning && emailExistsError && (
                      <div>Email has already been registered</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Password<span className="errmsg">*</span></label>
                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                      setShowWarning(false);
                    }}
                    type="password"
                    className="form-control"
                  ></input>
                  {showWarning && !password && (
                    <div className="warning-msg">
                        Fill in the missing field
                    </div>
                  )}
                  {showWarning && passwordError && (
                    <div className="warning-msg">
                       Incorrect filled password
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showSuccess && (
            <div className="success-msg">Registration successfully completed!</div>
          )}
          <div className="card-footer">
            <button type="submit" className="btn btn-primary" disabled={isRegistered}>
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
