import { render, screen } from '@testing-library/react';
const expect = require('chai').expect;
const chai = require('chai');

//components imported 
import App from '../Client/Components/App.jsx';
import Login from '../Client/Components/Login.jsx'
import { Provider } from 'react-redux';
import store from '../Client/store.js'
//tests
describe('testing frontend functionality', () => {

  describe('App components attaches to root', () => {
    it ('renders react app', () => {
      render(<App />);
      const linkEle = screen.getByText(/I rendered/i);
      expect(linkEle).to.exist;
    })
  });

  describe('Login form has necessary components', () => {
    it('Login form has an input for username, password, and submit button', async () => {
      render(<Login />);
      //check if theres input for username and password via id or label
      const usernameField = screen.getByTestId(/username/i) || screen.getAllByLabelText(/username/i);
      const passwordField = screen.getByTestId(/password/i) || screen.getAllByLabelText(/password/i);
      const loginButton = screen.getByText(/Login/i)

      expect(usernameField).toBeInTheDocument();
      expect(passwordField).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
    })
  })

})