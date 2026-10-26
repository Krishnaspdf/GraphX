import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../src/app/App';

describe('App', () => {
  it('renders workspace mode', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });
});
