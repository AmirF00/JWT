# JWT Security Vulnerability Labs

This project demonstrates various JWT (JSON Web Token) authentication vulnerabilities for educational purposes. Currently, it includes two labs focusing on different attack vectors.

## Labs Available

### Lab 1: None Algorithm Vulnerability
Demonstrates how a misconfigured JWT implementation can be exploited using the 'none' algorithm attack. Users can:
- Login as a regular user
- Modify the JWT to bypass signature verification
- Access admin data without proper authorization

### Lab 2: Weak Signature Attack
Shows how weak secrets in JWT signatures can be exploited. Users can:
- Login as a regular user
- Crack the weak signature using tools like hashcat
- Forge new tokens with elevated privileges

### Lab 3: KID Directory Traversal
Demonstrates how the Key ID (KID) header parameter can be exploited for directory traversal attacks. Users can:
- Login as a regular user
- Modify the JWT header to use a public file as the key
- Sign tokens using known file contents
- Access admin data using the forged token

## Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install 
   ```
3. Run the server:
   ```
   npm start
   ```
4. Visit `http://localhost:3001`

## Test Users
- Regular User
  - Username: user
  - Password: user
- Admin
  - Username: admin
  - Password: password

## Exploitation Guides

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

## Warning
⚠️ This is a deliberately vulnerable application for educational purposes only. Do not use this code in production.

## Security Notes
In a real application, you should:
- Never accept the 'none' algorithm
- Use strong, random secrets for JWT signatures
- Implement proper signature verification
- Use appropriate role-based access control
- Consider using proper session management

## Contributing
Feel free to contribute additional labs or improvements via pull requests.

## License
This project is for educational purposes only. Use at your own risk.

