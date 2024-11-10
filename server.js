const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

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