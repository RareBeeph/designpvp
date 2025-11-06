import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import mockedRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));
// This is needed for mocking 'next/link':

jest.mock('next/dist/client/router', () => require('next-router-mock'));

mockedRouter.push = jest.fn();

beforeEach(() => {
  window.mockedRouter = mockedRouter;

  mockedRouter.useRouter = () => window.mockedRouter;
});

jest.mock('next/dynamic', () => func => {
  let component = null;
  func().then(module => {
    component = module.default;
  });
  const DynamicComponent = (...args) => component(...args);
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});
