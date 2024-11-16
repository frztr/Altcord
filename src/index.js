import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './components/Main/Main.tsx';
import LoginPage from './components/LoginPages/LoginPage.tsx';
import SignupPage from './components/LoginPages/SignupPage.tsx';
import socket from './socket/socket.ts';
import { PeersContext } from './PeerConnectionManager.ts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "signup",
    element: <SignupPage />
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // <PeersContext.Provider>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* <App /> */}
    </Provider>
  /* </PeersContext.Provider> */
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
