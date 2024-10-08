import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PageExampleTest from '../Components/PageExampleTest';

describe('PageExampleTest', () => {
    it('renders a heading', () => {
        render(<PageExampleTest />);

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toBeInTheDocument();
    });
});
