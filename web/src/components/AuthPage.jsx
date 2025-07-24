import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaEnvelope, FaGoogle, FaFacebookF } from 'react-icons/fa';
import LeftPanelImg from '../assets/left-panel.jpeg';
import { AuthContext } from '../contexts/AuthContext';

const BREAKPOINT = '768px';

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  background: #c39a6d;
  color: #faf9f6;

  @media (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;

const Hero = styled.div`
  flex: 1;
  background-image: url(${LeftPanelImg});
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: 'YOUR DIGITAL WARDROBE!';
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    color: rgba(250, 249, 246, 0.85);
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 1.1;
    white-space: pre-wrap;
  }

  @media (max-width: ${BREAKPOINT}) {
    height: 200px;

    &::after {
      bottom: 1rem;
      left: 1rem;
      font-size: 1.5rem;
    }
  }
`;

const FormWrapper = styled.div`
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${BREAKPOINT}) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #faf9f6;
  font-family: 'AmericanStd', sans-serif;
  font-weight: 400;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #faf9f6;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #777;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  color: #faf9f6;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(250, 249, 246, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 8px;
  background: #693a07;
  color: #faf9f6;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Divider = styled.div`
  text-align: center;
  color: #333;
  margin: 2rem 0;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    width: 30%;
    height: 1px;
    background: #333;
    vertical-align: middle;
    margin: 0 0.5rem;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SocialBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: #faf9f6;
  font-size: 0.9rem;
  cursor: pointer;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const ToggleLink = styled.a`
  margin-top: 1.5rem;
  color: #faf9f6;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
`;

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login } = useContext(AuthContext); // ← grab login()
  const navigate = useNavigate(); // ← grab navigate()
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace this stub with real auth logic
    // e.g. const token = await api.login({ email });
    login('dummy-token'); // flip the auth flag
    navigate('/'); // send them to the protected HomePage
  };
  return (
    <Page>
      <Hero />
      <FormWrapper as="form" onSubmit={handleSubmit}>
        <Title>{isLogin ? 'LOG IN' : 'SIGN UP'}</Title>
        <Label htmlFor="email">
          {isLogin ? 'Enter your email address' : 'Sign in with email address'}
        </Label>
        <InputGroup>
          <Icon>
            <FaEnvelope />
          </Icon>
          <Input id="email" type="email" placeholder="youremail@gmail.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit">{isLogin ? 'Log in' : 'Sign up'}</Button>
        <Divider>Or continue with</Divider>
        <SocialButtons>
          <SocialBtn>
            <FaGoogle /> Google
          </SocialBtn>
          <SocialBtn>
            <FaFacebookF /> Facebook
          </SocialBtn>
        </SocialButtons>
        <ToggleLink href={isLogin ? '/signup' : '/login'}>
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </ToggleLink>
        {!isLogin && (
          <small style={{ marginTop: '1rem', color: '#333' }}>
            By registering you agree to our{' '}
            <a href="/terms" style={{ color: '#7c3aed' }}>
              Terms &amp; Conditions
            </a>
            .
          </small>
        )}
      </FormWrapper>
    </Page>
  );
}
AuthPage.propTypes = {
  mode: PropTypes.oneOf(['login', 'signup']).isRequired,
};
