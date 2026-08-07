// Initialize Supabase Client using the credentials you provided earlier
const SUPABASE_URL = 'https://ebviccspibwhlvxttuoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidmljY3NwaWJ3aGx2eHR0dW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMjAyMzMsImV4cCI6MjEwMTY5NjIzM30.ttz-4wO1VkqL2TnDmrsYIYL3EKfs2kw5RyINNlidB8E';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

// Toggle between Login and Signup forms
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    setTimeout(() => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        setTimeout(() => signupForm.classList.add('active'), 50);
    }, 400); // Wait for transition
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('active');
    setTimeout(() => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        setTimeout(() => loginForm.classList.add('active'), 50);
    }, 400); // Wait for transition
});

// UI Helpers
const setLoading = (buttonId, isLoading) => {
    const btn = document.getElementById(buttonId);
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    if (isLoading) {
        btn.disabled = true;
        text.classList.add('hidden');
        loader.classList.remove('hidden');
    } else {
        btn.disabled = false;
        text.classList.remove('hidden');
        loader.classList.add('hidden');
    }
};

const showMessage = (formType, type, message) => {
    const errorEl = document.getElementById(`${formType}-error`);
    const successEl = document.getElementById(`${formType}-success`);
    
    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    if (type === 'error') {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    } else if (type === 'success') {
        successEl.textContent = message;
        successEl.style.display = 'block';
    }
};

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const email = `${username}@legalcopilot.local`;
    const password = document.getElementById('login-password').value;

    setLoading('login-btn', true);
    showMessage('login', 'clear');

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        showMessage('login', 'success', 'Login successful! Redirecting to dashboard...');
        
        // TODO: Redirect to your Python backend application or dashboard
        // window.location.href = '/dashboard';
        
    } catch (error) {
        showMessage('login', 'error', error.message || 'Failed to login');
    } finally {
        setLoading('login-btn', false);
    }
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value.trim();
    const email = `${username}@legalcopilot.local`;
    const password = document.getElementById('signup-password').value;

    setLoading('signup-btn', true);
    showMessage('signup', 'clear');

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) throw error;

        showMessage('signup', 'success', 'Account created successfully! Please log in.');
        
        // Clear form
        signupForm.reset();
        
    } catch (error) {
        showMessage('signup', 'error', error.message || 'Failed to create account');
    } finally {
        setLoading('signup-btn', false);
    }
});
