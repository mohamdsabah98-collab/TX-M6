# TX-M6 Contributing Guide

## Code of Conduct

Be respectful, inclusive, and collaborative. Treat everyone with kindness.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/TX-M6.git`
3. Add upstream: `git remote add upstream https://github.com/mohamdsabah98-collab/TX-M6.git`
4. Create a branch: `git checkout -b feature/your-feature`

## Development Workflow

### Setup
```bash
npm install
docker-compose up -d
cd backend && npm run migrate
```

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow existing code style
   - Keep commits atomic and well-documented
   - Update tests if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Code style
   - `refactor:` - Code refactoring
   - `test:` - Tests
   - `chore:` - Maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference related issues
   - Include screenshots if applicable

## Code Standards

### TypeScript
- Use strict mode
- Define proper types
- Avoid `any` types
- Use interfaces over types

### React/Next.js
- Use functional components
- Use hooks
- Proper error boundaries
- Accessible HTML

### Express/Node.js
- Use async/await
- Proper error handling
- Input validation
- Clean separation of concerns

### Styling
- Use Tailwind CSS
- Mobile-first approach
- Consistent spacing
- Dark mode support

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(auth): add Google OAuth integration

Implemented Google OAuth 2.0 authentication flow
with automatic account creation and profile sync.

Closes #123
```

## Pull Request Process

1. Update README.md if needed
2. Ensure all tests pass
3. Request review from maintainers
4. Address review comments
5. Squash commits if requested
6. Wait for approval before merging

## Testing

- Write tests for new features
- Update existing tests
- Ensure 100% of new code is tested
- Run: `npm run test`

## Documentation

- Update relevant documentation
- Add comments for complex logic
- Include JSDoc for functions
- Update CHANGELOG.md

## Issues

- Check existing issues before creating new ones
- Provide clear title and description
- Include steps to reproduce
- Share error logs and screenshots
- Label appropriately

## Project Structure

Follow the existing structure:
- Backend: Controllers → Services → Repositories → Models
- Frontend: Pages → Components → Hooks → Utils

## Performance

- Minimize bundle size
- Optimize database queries
- Use caching appropriately
- Profile before optimizing

## Security

- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Follow security best practices
- Report vulnerabilities privately

## Questions?

- Check documentation
- Search existing issues
- Ask on Discord
- Email: support@tx-m6.com

Thank you for contributing! 🎉
