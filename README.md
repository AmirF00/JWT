# JWT Security Vulnerability Labs 🔐

A comprehensive collection of JWT (JSON Web Token) security vulnerabilities for educational purposes. This project demonstrates various attack vectors and common implementation mistakes in JWT authentication.

## 🎯 Labs Available

### Lab 1: None Algorithm Vulnerability
Demonstrates how a misconfigured JWT implementation can be exploited using the 'none' algorithm attack.
- Vulnerability: Accepting 'none' as a valid algorithm
- Attack Vector: Algorithm header manipulation
- Impact: Authentication bypass

### Lab 2: Weak Signature Attack
Shows how weak secrets in JWT signatures can be exploited.
- Vulnerability: Using weak secret keys
- Attack Vector: Brute force attack on signature
- Impact: Token forgery

### Lab 3: KID Directory Traversal
Explores how the Key ID header parameter can be exploited for directory traversal.
- Vulnerability: Unsanitized file path in KID header
- Attack Vector: Directory traversal via KID parameter
- Impact: Arbitrary file read, token forgery

### Lab 4: JKU Header Injection
Demonstrates vulnerabilities in JWK Set URL handling.
- Vulnerability: Unvalidated JKU header
- Attack Vector: Malicious JWK Set hosting
- Impact: Token forgery using attacker-controlled keys

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install

# Start the server
node server.js
```

### Access
Visit `http://localhost:3001` in your browser

## 🔑 Test Credentials
- Regular User
  - Username: user
  - Password: user
- Admin
  - Username: admin
  - Password: password

## 💥 Exploitation Guides

### Lab 1: None Algorithm Attack
1. Login as regular user
2. Get the JWT token
3. Create a new token with:
   ```
   eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0.
   ```
4. Use the modified token to access admin data

### Lab 2: Weak Signature Attack
1. Login as regular user
2. Get the JWT token
3. Use hashcat to crack the signature:
   ```bash
   hashcat -a 0 -m 16500 "JWT_TOKEN_HERE" wordlist.txt
   ```
4. Create a new token with admin privileges using the cracked secret

### Lab 3: KID Directory Traversal Attack
1. Login as regular user
2. Get the JWT token
3. Create a new token with modified header pointing to public CSS file
4. Sign the token using the CSS file contents
5. Use the modified token to access admin data

### Lab 4: JKU Header Injection Attack
1. Login as regular user
2. Get the JWT token
3. Create a new token with modified JKU header pointing to malicious JWK Set
4. Sign the token using the malicious JWK Set keys
5. Use the modified token to access admin data

## 🔒 Security Notes
⚠️ **WARNING**: This application is deliberately vulnerable and for educational purposes only.

In a production environment, you should:
- Never accept the 'none' algorithm
- Use strong, randomly generated secrets
- Implement proper signature verification
- Validate and sanitize all header parameters
- Implement proper key management
- Use appropriate access controls

## 🤝 Contributing
Contributions are welcome! Please feel free to submit pull requests.

## 📝 License
This project is for educational purposes only. Use at your own risk.

## ⚠️ Disclaimer
This project contains intentionally vulnerable code. Do not use any of this code in production environments.

## 🙏 Acknowledgments
- JWT.io for JWT debugging tools
- Node-JOSE for JWT/JWK functionality
- Express.js team

---
Created with ❤️ for educational purposes


