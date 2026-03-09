# Complete Code Explanation - Part 3: React Frontend

## 5. context/AuthContext.js - Global Authentication State

### Purpose:
Manages authentication state across the entire application using React Context API.

### Why Context API?
- Avoid prop drilling (passing user data through many components)
- Centralized authentication logic
- Single source of truth for user state

---

### Line-by-Line Explanation:

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
```
- createContext: Creates context object
- useState: Component state management
- useContext: Hook to consume context
- useEffect: Side effects (runs after render)
- authService: API calls for authentication

```javascript
const AuthContext = createContext();
```
- Create context object
- Will hold authentication state and functions

```javascript
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```
**Custom Hook Explanation:**
- useAuth: Wrapper around useContext
- Provides better error handling
- If used outside AuthProvider, throws descriptive error
- Returns: { user, login, logout, isAuthenticated, loading }

**Usage in components:**
```javascript
const MyComponent = () => {
    const { user, login, logout } = useAuth();
    // Now you can use user, login, logout
};
```

---

### AuthProvider Component:

```javascript
export const AuthProvider = ({ children }) => {
```
- children: All child components wrapped by this provider
- Will have access to authentication context

```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```
- user: Current logged-in user object (null if not logged in)
- loading: True while checking localStorage on mount

```javascript
useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
        setUser(storedUser);
    }
    setLoading(false);
}, []);
```
**Explanation:**
- Runs once on component mount (empty dependency array [])
- Check localStorage for saved user
- If found, restore user state
- Set loading to false
- **Why?** Persist login across page refreshes

**Flow:**
1. User logs in → User saved to localStorage
2. User refreshes page → App remounts
3. useEffect runs → Checks localStorage
4. User state restored → User stays logged in

```javascript
const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
};
```
**Login Function:**
- Calls API via authService
- Updates user state
- Returns data for component to use
- authService handles token storage

```javascript
const logout = () => {
    authService.logout();
    setUser(null);
};
```
**Logout Function:**
- Clears localStorage (token + user)
- Sets user state to null
- User redirected to login (handled by PrivateRoute)

```javascript
const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
};
```
**Context Value:**
- user: User object or null
- login: Function to log in
- logout: Function to log out
- isAuthenticated: Boolean (true if user exists)
- loading: Boolean (true while checking localStorage)

**!!user explanation:**
- First !: Converts to boolean and negates
  - user = { name: "John" } → !user = false
  - user = null → !user = true
- Second !: Negates again
  - false → true
  - true → false
- Result: true if user exists, false if null

```javascript
return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);
```
- Wrap children with Provider
- Pass value object to all descendants
- Any component inside can use useAuth()

---

### Usage in App.js:

```javascript
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* All routes have access to auth context */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}
```

---

## 6. pages/Login.js - Login Page Component

### Purpose:
User interface for authentication with email and password.

---

### State Management:

```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```
**State Variables:**
- email: Controlled input for email field
- password: Controlled input for password field
- error: Error message to display
- loading: Show loading state during API call

```javascript
const { login } = useAuth();
const navigate = useNavigate();
```
- login: Function from AuthContext
- navigate: React Router hook for navigation

---

### useEffect - Clear Storage:

```javascript
useEffect(() => {
    localStorage.clear();
    console.log('Login page mounted - LocalStorage cleared');
}, []);
```
**Why clear localStorage?**
- User navigated to login page
- Might be due to expired token
- Clear stale data for fresh login
- Runs once on mount

---

### handleSubmit Function:

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
```
- e.preventDefault(): Prevent form default behavior (page reload)

```javascript
setError('');
setLoading(true);
```
- Clear previous error messages
- Show loading state (button shows "Signing in...")

```javascript
console.log('Attempting login with:', { email });
```
- Debug log (don't log password!)

```javascript
try {
    const data = await login(email, password);
    console.log('Login successful:', data);
```
- Call login function from AuthContext
- Waits for API response
- data contains: { success, token, user }

```javascript
const role = data.user?.role || data.role;
```
- Optional chaining (?.) - safe property access
- If data.user exists, get role from it
- Otherwise, get role directly from data
- Handles different response structures

```javascript
if (role === 'admin') navigate('/admin');
else if (role === 'faculty') navigate('/faculty');
else if (role === 'student') navigate('/student');
else navigate('/');
```
**Role-Based Redirect:**
- Admin → /admin dashboard
- Faculty → /faculty dashboard
- Student → /student dashboard
- Unknown role → home page

```javascript
} catch (err) {
    console.error('Login error full object:', err);
    setError(err.response?.data?.message || 'Login failed. Check console for details.');
}
```
**Error Handling:**
- Catch API errors
- err.response?.data?.message: Error from backend
- Fallback to generic message
- Display error to user

```javascript
} finally {
    setLoading(false);
}
```
- finally: Runs whether success or error
- Reset loading state
- Button returns to "Sign In"

---

### JSX Explanation:

```javascript
return (
    <div className="login-container">
        <div className="login-card">
```
- Container for centering
- Card for styling

```javascript
<div className="login-header">
    <h1>Exam Hall Allocation System</h1>
    <p>Sign in to your account</p>
</div>
```
- Header section with title

```javascript
{error && (
    <div className="alert alert-error">
        {error}
    </div>
)}
```
**Conditional Rendering:**
- {error && ...}: Only render if error exists
- Short-circuit evaluation
- If error is empty string, nothing renders

```javascript
<form onSubmit={handleSubmit}>
```
- onSubmit: Calls handleSubmit when form submitted
- Triggered by Enter key or button click

```javascript
<input
    type="email"
    className="form-input"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    placeholder="Enter your email"
/>
```
**Controlled Input:**
- value={email}: Input value controlled by state
- onChange: Updates state on every keystroke
- e.target.value: Current input value
- required: HTML5 validation
- type="email": Email format validation

**Flow:**
1. User types "a" → onChange fires
2. setEmail("a") → State updates
3. Component re-renders → Input shows "a"
4. User types "b" → onChange fires
5. setEmail("ab") → State updates
6. Component re-renders → Input shows "ab"

```javascript
<button
    type="submit"
    className="btn btn-primary btn-block"
    disabled={loading}
>
    {loading ? 'Signing in...' : 'Sign In'}
</button>
```
**Dynamic Button:**
- disabled={loading}: Prevent multiple submissions
- Conditional text: "Signing in..." during API call
- type="submit": Triggers form onSubmit

```javascript
<div className="login-footer">
    <p>Default credentials:</p>
    <p><strong>Admin:</strong> admin@college.edu / admin123</p>
    <p><strong>Faculty:</strong> faculty@college.edu / faculty123</p>
    <p><strong>Student:</strong> student@college.edu / student123</p>
</div>
```
- Display test credentials
- Helpful for demo/testing

---

## React Concepts Used

### 1. Controlled Components:
```javascript
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```
- React state is source of truth
- Input value always matches state
- Every change updates state

### 2. Conditional Rendering:
```javascript
{error && <div>{error}</div>}
{loading ? 'Loading...' : 'Submit'}
```
- && operator: Render if truthy
- Ternary operator: Choose between two options

### 3. Event Handling:
```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
};
```
- Prevent default behavior
- Custom logic

### 4. Async/Await:
```javascript
const data = await login(email, password);
```
- Wait for promise to resolve
- Cleaner than .then() chains

### 5. Try/Catch/Finally:
```javascript
try {
    // Attempt operation
} catch (err) {
    // Handle error
} finally {
    // Always runs
}
```

### 6. Context API:
```javascript
const { user, login } = useAuth();
```
- Access global state
- No prop drilling

### 7. React Router:
```javascript
const navigate = useNavigate();
navigate('/admin');
```
- Programmatic navigation
- Change URL without page reload

---

## Component Lifecycle

### Mount:
1. Component renders
2. useEffect runs → Check localStorage
3. If user found → Restore state

### User Interaction:
1. User types → onChange fires
2. State updates → Component re-renders
3. Input shows new value

### Form Submit:
1. User clicks button → onSubmit fires
2. handleSubmit runs → API call
3. Success → Navigate to dashboard
4. Error → Show error message

### Unmount:
1. User navigates away
2. Component removed from DOM
3. State cleared

---

## Interview Questions on React Code

**Q: Why use controlled components?**
A: React state is single source of truth. Easy to validate, manipulate, and sync with backend.

**Q: What's the difference between useState and useContext?**
A: useState is local to component. useContext shares state across multiple components.

**Q: Why use async/await instead of .then()?**
A: More readable, easier error handling with try/catch, looks like synchronous code.

**Q: What happens if you don't call e.preventDefault()?**
A: Form submits normally, page reloads, state is lost.

**Q: Why check localStorage on mount?**
A: Persist login across page refreshes. User doesn't have to log in again.

**Q: What's optional chaining (?.)?**
A: Safe property access. Returns undefined instead of throwing error if property doesn't exist.

**Q: Why use finally block?**
A: Code that must run regardless of success/failure. Reset loading state, close modals, etc.

