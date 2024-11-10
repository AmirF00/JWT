const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jose = require('node-jose');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(bodyParser.json());

// Separate secret keys for each lab
const LAB_SECRETS = {
    lab1: 'secret',
    lab2: '1234' // Weak secret for Lab 2
};

// User database (in memory for demonstration)
const users = {
    user: {
        username: 'user',
        password: 'user',
        role: 'user',
        profile: {
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 User St',
            phone: '555-0123'
        }
    },
    admin: {
        username: 'admin',
        password: 'password',
        role: 'admin',
        profile: {
            name: 'Admin Smith',
            email: 'admin@example.com',
            address: '456 Admin Ave',
            phone: '555-9999',
            adminSecret: 'Super secret admin data!'
        }
    }
};

// Add key files for Lab 3
const keys = {
    '1': 'secret_key_1',
    '2': 'secret_key_2'
};

// Create a key store for Lab 4
const keyStore = jose.JWK.createKeyStore();
let lab4PublicKey;

// Generate a key pair for Lab 4
async function generateLab4Keys() {
    const key = await keyStore.generate('RSA', 2048, {
        use: 'sig',
        alg: 'RS256',
        kid: 'lab4-key'
    });
    lab4PublicKey = key.toJSON();
    return key;
}

// Initialize keys
let lab4Key;
(async () => {
    lab4Key = await generateLab4Keys();
})();

// Serve the JWK Set
app.get('/.well-known/jwks.json', (req, res) => {
    res.json({ keys: [lab4PublicKey] });
});

// Add Lab 4 login endpoint
app.post('/api/login/lab4', async (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username].password === password) {
        // Create JWT with jku header
        const token = jwt.sign({
            username: username,
            role: users[username].role,
            lab: 'lab4'
        }, lab4Key.toPEM(true), {
            algorithm: 'RS256',
            header: {
                jku: `http://localhost:${PORT}/.well-known/jwks.json`,
                kid: 'lab4-key'
            }
        });
        
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Add Lab 4 profile endpoint with vulnerable JKU handling
app.get('/api/profile/lab4', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Decode the token header without verification
        const [headerB64] = token.split('.');
        const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
        
        // VULNERABLE: Fetch JWK Set from any URL without validation
        if (header.jku) {
            try {
                // Fetch the JWK Set from the specified URL
                const response = await axios.get(header.jku);
                const jwks = response.data;
                
                // Find the key with matching kid
                const key = jwks.keys.find(k => k.kid === header.kid);
                if (!key) {
                    throw new Error('Key not found in JWK Set');
                }

                // Convert JWK to PEM
                const keyStore = await jose.JWK.asKeyStore(jwks);
                const publicKey = keyStore.get(header.kid);
                
                // Verify the token
                const decoded = jwt.verify(token, publicKey.toPEM(), { algorithms: ['RS256'] });
                const userData = users[decoded.username];
                
                if (!userData) {
                    return res.status(401).json({ error: 'User not found' });
                }
                
                res.json(userData.profile);
            } catch (err) {
                console.error('JWK fetch/verification error:', err);
                res.status(401).json({ error: 'Invalid token or JWK' });
            }
        } else {
            res.status(401).json({ error: 'JKU header required' });
        }
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve the login pages for different labs
app.get('/login/lab1', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login/lab2', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login/lab3', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login/lab4', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Login endpoints for different labs
app.post('/api/login/lab1', (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username].password === password) {
        const token = jwt.sign({
            username: username,
            role: users[username].role,
            lab: 'lab1'
        }, LAB_SECRETS.lab1);
        
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/login/lab2', (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username].password === password) {
        const token = jwt.sign({
            username: username,
            role: users[username].role,
            lab: 'lab2'
        }, LAB_SECRETS.lab2); // Using weak secret
        
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Protected profile endpoints
app.get('/api/profile/lab1', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Lab 1: Vulnerable to none algorithm
        const [headerB64, payloadB64] = token.split('.');
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        
        const userData = users[payload.username];
        if (!userData) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        res.json(userData.profile);
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.get('/api/profile/lab2', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Lab 2: Vulnerable to weak signature
        const decoded = jwt.verify(token, LAB_SECRETS.lab2);
        const userData = users[decoded.username];
        
        if (!userData) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        res.json(userData.profile);
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 