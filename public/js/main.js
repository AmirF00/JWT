// Get the current lab from the URL
function getCurrentLab() {
    const path = window.location.pathname;
    if (path.includes('lab1')) return 'lab1';
    if (path.includes('lab2')) return 'lab2';
    if (path.includes('lab3')) return 'lab3';
    return 'lab1'; // default
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const lab = getCurrentLab();

    try {
        const response = await fetch(`/api/login/${lab}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentLab', lab);
            fetchProfile();
        }
    } catch (err) {
        console.error('Login failed:', err);
    }
}

async function fetchProfile() {
    const token = localStorage.getItem('token');
    const lab = localStorage.getItem('currentLab');
    
    try {
        const response = await fetch(`/api/profile/${lab}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const profile = await response.json();
        document.getElementById('profile').style.display = 'block';
        document.getElementById('profile-data').textContent = JSON.stringify(profile, null, 2);
    } catch (err) {
        console.error('Failed to fetch profile:', err);
    }
} 
