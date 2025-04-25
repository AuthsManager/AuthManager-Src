# AuthManager

![AuthManager Logo](./Front/public/logo.png)

A powerful authentication service for your applications with license management, access control, and user verification features.

## Overview

AuthManager is a robust authentication service that helps you manage user authentication across your applications. With our API, you can easily implement secure user authentication, manage applications, and handle user sessions.

## Features

- **Admin Dashboard**: Manage your applications and users
- **User Dashboard**: Manage your applications and users
- **User Authentication**: Secure login and registration system
- **License Management**: Create, verify, and manage licenses for your applications
- **Application Management**: Create and manage multiple applications
- **User Management**: Manage users and their access to your applications
- **Modern UI**: Beautiful and responsive user interface

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Setup

1. **Clone the Repository**

```bash
git clone https://github.com/AuthsManager/AuthManager-Src.git
cd AuthManager-Src
```

2. **Install Dependencies**

```bash
# Install Frontend Dependencies
cd Front
npm install

# Install Backend Dependencies
cd ../Back
npm install
```

3. **Configure Environment**

Create a `.env` file in the Back directory with your MongoDB connection URL:

```bash
# Back/.env
MONGO_URL=your_mongodb_connection_url
```

4. **Start the Services**

```bash
# Start Frontend (in Front directory)
npm run dev

# Start Backend (in Back directory)
node index.js
```

## API Usage

### Getting Your API Key

To get your API key:

1. Log in to your AuthManager dashboard
2. Navigate to the "Apps" section
3. Create a new application or select an existing one
4. Your API key will be displayed in the application details

### API Endpoints

#### Apps API

- **Create an App**
  ```javascript
  // POST /apps
  {
      "name": "My Application"
  }
  ```

- **List Apps**
  ```javascript
  // GET /apps
  // Response
  {
      "apps": [
          {
              "id": "app_123",
              "name": "My Application",
              "created_at": "2024-02-20T12:00:00Z"
          }
      ]
  }
  ```

#### Users API

- **Create User**
  ```javascript
  // POST /apps/{app_id}/users
  {
      "email": "user@example.com",
      "password": "secure_password"
  }
  ```

- **List Users**
  ```javascript
  // GET /apps/{app_id}/users
  // Response
  {
      "users": [
          {
              "id": "user_123",
              "email": "user@example.com",
              "created_at": "2024-02-20T12:00:00Z"
          }
      ]
  }
  ```

#### Licenses API

- **Create License**
  ```javascript
  // POST /apps/{app_id}/licenses
  {
      "duration": "30d",  // Duration format: Xd (days), Xw (weeks), Xm (months), Xy (years)
      "type": "premium",  // License type (e.g., basic, premium, enterprise)
      "maxUses": 1       // Maximum number of activations allowed
  }
  ```

- **Verify License**
  ```javascript
  // POST /apps/{app_id}/licenses/verify
  {
      "licenseKey": "LICENSE_KEY_HERE"
  }
  ```

- **List Licenses**
  ```javascript
  // GET /apps/{app_id}/licenses
  ```

- **Revoke License**
  ```javascript
  // DELETE /apps/{app_id}/licenses/{license_id}
  ```

## Best Practices

### Error Handling

Implement proper error handling to manage API responses:

```javascript
try {
    const response = await fetch('https://api.authmanager.xyz/v1/apps', {
        headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
} catch (error) {
    console.error('Error:', error.message);
    // Handle error appropriately
}
```

### Security Guidelines

- Use HTTPS for all API requests
- Store your API key securely in environment variables
- Rotate your API keys periodically for enhanced security
- Use different API keys for development and production environments
- Implement proper session management
- Validate user input
- Keep your dependencies updated

## Documentation

For more detailed documentation, visit the `/docs` route in the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.