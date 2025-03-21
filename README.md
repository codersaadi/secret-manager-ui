# Secret Manager UI

A modern web interface for the SecretKeeper password vault application. This UI provides a user-friendly way to interact with the SecretKeeper API, allowing you to securely manage your credentials with an intuitive interface.

![Secret Manager UI](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/secret-view.png)

## Features

- **Intuitive Dashboard**: Clean interface for managing all your credentials
- **Secure Authentication**: Interface to the SecretKeeper vault authentication
- **Credential Management**: Add, view, edit, and delete credentials with ease
- **Password Generation**: Generate strong passwords with customizable options
- **Vault Health Analysis**: Visual reports on password strength and security
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## ⚠️ Important Security Note

**The authentication implementation using local storage in this UI is for demonstration purposes only.**

In a production environment, you should implement proper authentication using:
- HTTP-only cookies
- Server-side sessions
- JWT with proper security measures
- Token refresh mechanisms

Local storage is vulnerable to XSS attacks and should not be used to store sensitive authentication tokens in real-world applications.

## Installation

```bash
# Clone the repository
git clone https://github.com/codersaadi/secret-manager-ui.git

# Change to the directory
cd secret-manager-ui

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

1. Start the SecretKeeper API server (see [SecretKeeper repository](https://github.com/codersaadi/secretkeeper))
2. Run the Secret Manager UI development server
3. Navigate to `http://localhost:3000` in your browser
4. Create a new vault or authenticate with an existing one

## Configuration

You can configure the UI by editing the `.env` file:

```
REACT_APP_API_URL=http://localhost:3200/api
REACT_APP_SESSION_TIMEOUT=15
```

## Screenshots

### Login Screen
![Login Screen](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/welcome-login.png)

### Secret View
![Secret View](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/secret-view.png)

### Add Secret
![Add Secret](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/addsecret.png)

### Edit Secret
![Edit Secret](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/editsecret.png)

### Backup
![Backup](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/backup.png)

### Settings
![Settings](https://github.com/codersaadi/secret-manager-ui/raw/main/public/screenshots/settings.png)

## Connecting to SecretKeeper API

This UI is designed to work with the [SecretKeeper](https://github.com/codersaadi/secretkeeper) backend. Make sure you have the SecretKeeper server running and properly configured.

You can adjust the API URL in the `.env` file if your SecretKeeper instance is running on a different host or port.

## Technologies Used

- React.js
- React Router
- Redux for state management
- Axios for API communication
- styled-components for styling
- Material UI components
- Chart.js for security visualizations

## Development

### Available Scripts

- `npm start`: Run the development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

### Folder Structure

```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Related Projects

- [SecretKeeper API](https://github.com/codersaadi/secretkeeper): The backend API service for this UI