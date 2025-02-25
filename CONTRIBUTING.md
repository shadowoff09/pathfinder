# Contributing to Pathfinder

Thank you for your interest in contributing to Pathfinder! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which is to treat all contributors with respect and maintain a harassment-free experience for everyone.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/pathfinder.git
   cd pathfinder
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/shadowoff09/pathfinder.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Create a `.env.local` file in the root directory with your API tokens:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   OPENWEATHER_API_KEY=your_openweather_token_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Making Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them using conventional commit messages:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Common commit types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

3. Keep your branch updated with upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

## Submitting a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to GitHub and create a Pull Request from your fork to the main repository
3. Fill in the PR template with:
   - A clear title and description
   - Any relevant issue numbers
   - Screenshots if applicable
   - Steps to test the changes

## Style Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use proper TypeScript types and interfaces

### Component Guidelines

- Use functional components with hooks
- Keep components small and reusable
- Follow the existing component structure
- Use proper prop types and interfaces
- Add proper error handling
- Implement responsive design
- Follow accessibility best practices

### CSS/Styling

- Use Tailwind CSS classes
- Follow the existing color scheme and design system
- Ensure responsive design works on all screen sizes
- Use semantic class names
- Keep styles modular and reusable

### Testing

- Write tests for new features
- Update existing tests when modifying features
- Ensure all tests pass before submitting PR
- Follow the existing testing patterns

### Documentation

- Update documentation for new features
- Add JSDoc comments for functions and components
- Include code examples where helpful
- Keep documentation clear and concise

## Questions or Problems?

Feel free to open an issue on GitHub if you have any questions or problems. We're here to help!