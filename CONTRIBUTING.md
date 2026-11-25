
# Contributing to ReyCodeBaileys

Thanks for your interest in contributing to ReyCodeBaileys!

ReyCodeBaileys is derived from [NxBaileys](https://github.com/NazCodexID/NxBaileys),
which builds upon [Baileys](https://github.com/WhiskeySockets/Baileys).
Contributions should follow the conventions and licensing requirements of this
repository and its upstream projects.

## Reporting issues

- Search existing issues before opening a new one.
- Include your Node.js version and the installed `reycode-baileys` version.
- Provide a minimal reproduction and relevant log output.
- Redact sensitive information, including phone numbers, authentication
  credentials, session data, and private messages.

## Submitting changes

1. Fork the repository and create a branch from `main`.
2. Keep changes focused — one fix or feature per pull request.
3. Follow the existing code style (ESLint configuration is included:
   `npm run lint`).
4. Add or update tests where relevant (`npm test`).
5. Write a clear commit message describing what changed and why.
6. Open a pull request describing the change and linking any related issue.

## Development setup

```bash
git clone https://github.com/reycode-lt/ReyCodeBaileys.git
cd ReyCodeBaileys
npm install
npm run build:tsc
npm test
```

## Code of conduct

Be respectful and constructive. Disagreements about implementation are fine;
personal attacks are not. Issues or pull requests that violate this principle
may be closed.

## License

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](LICENSE). Please preserve all applicable copyright and
license notices from the original projects and upstream contributors.
