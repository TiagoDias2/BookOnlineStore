import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import './Profile.css';



// Componente Profile

const Profile = () => {
  
  // Estado para armazenar o email do user
  const [userEmail, setUserEmail] = useState('');
  
  // Hook useEffect para realizar a requisição
  // para o endpoint de login e armazenar o email do user
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('https://api.sheety.co/8643bdf53fe6b6541a9183d0e5c59a22/login/login');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const responseData = await response.json();

        
        // Se o user tiver pelo menos um email
        if (responseData && responseData.login && responseData.login.length > 0) { 
          // Armazene o primeiro email
          const firstEmail = responseData.login[0].email;
          setUserEmail(firstEmail);
          // Se não, armazene uma mensagem de erro
        } else {
          setUserEmail('No emails found');
        }
        // Se não, armazene uma mensagem de erro
      } catch (error) {
        console.error('Error fetching user email:', error);
        setUserEmail('Error fetching email');
      }
    };
  // Chamada da função fetchUserEmail
    fetchUserEmail();
  }, []);

  
   // Retorna o componente Profile
  // Exibe o email do user e o ícone de círculo de pessoa
  return (
    <div className="profile-container">
      {userEmail ? (
        <div className="profile-content">
          <FaUserCircle className="user-icon" />
          <p>Email: {userEmail}</p>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Profile;
