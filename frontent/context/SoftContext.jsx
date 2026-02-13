import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const SoftContext = createContext();

export const SoftProvider = ({ children }) => {

  const [token, setToken] = useState(Cookies.get('token') || '');
  
  const [role, setRole] = useState(Cookies.get('role') || '');


  useEffect(() => {
    if (token) {
      Cookies.set('token', token, { expires: 7 }); // expires in 7 days
    } else {
      Cookies.remove('token');
    }

    if (role) {
      Cookies.set('role', role, { expires: 7 });
    } else {
      Cookies.remove('role');
    }
  }, [token, role]);

  console.log("token is=",token)

  const softvalue = {
    token,
    setToken,
    role,
    setRole,
  };

  return (
    <SoftContext.Provider value={softvalue}>
      {children}
    </SoftContext.Provider>
  );
};
