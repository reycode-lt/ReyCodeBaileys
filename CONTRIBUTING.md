
# Contributing to ReyCodeBaileys

Thanks for your interest in contributing to ReyCodeBaileys!

ReyCodeBaileys is derived from [NxBaileys](https://github.com/NazCodexID/NxBaileys), which builds upon [Baileys](https://github.com/WhiskeySockets/Baileys).

Contributions should follow the conventions and licensing requirements of this repository and its upstream projects.

## Reporting Issues

- Search existing issues before opening a new one.
- Include your Node.js version and installed ReyCodeBaileys version.
- Provide a minimal reproduction and relevant log output.
- Redact sensitive information, including phone numbers, authentication credentials, session data, and private messages.

## Submitting Changes

1. Fork the repository and create a branch from `main`.
2. Keep changes focused — one fix or feature per pull request.
3. Follow the existing JavaScript code style.
4. Add or update tests where relevant.
5. Run the test suite using `yarn test`.
6. Ensure `git diff --check` reports no whitespace errors.
7. Write a clear commit message describing what changed and why.
8. Open a pull request describing the change and linking any related issue.

## Development Setup

Requirements:
- Node.js >=20
- Yarn 4.9.2

```bash
git clone https://github.com/reycode-lt/ReyCodeBaileys.git
cd ReyCodeBaileys
corepack enable
corepack prepare yarn@4.9.2 --activate
yarn install
yarn test
```

## Code of Conduct

Be respectful and constructive. Disagreements about implementation are fine; personal attacks are not.

## License

Please preserve all applicable copyright and license notices from the original projects and upstream contributors. Contributions must comply with the applicable project and dependency licenses.
