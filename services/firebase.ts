import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { UserProfile, Expense, Budget, Goal } from '../types';

// Firebase configuration
// IMPORTANTE: Substitua pelos seus valores do Firebase Console
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Provider
const googleProvider = new GoogleAuthProvider();

// ============ AUTH FUNCTIONS ============

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { user: null, error: message };
    }
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { error: message };
    }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// ============ FIRESTORE FUNCTIONS ============

// --- User Profile ---
export const saveUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
    try {
        await setDoc(doc(db, 'users', userId), {
            ...profile,
            updatedAt: Timestamp.now()
        }, { merge: true });
        return { error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { error: message };
    }
};

export const getUserProfile = async (userId: string) => {
    try {
        const docSnap = await getDoc(doc(db, 'users', userId));
        if (docSnap.exists()) {
            return { data: docSnap.data(), error: null };
        }
        return { data: null, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { data: null, error: message };
    }
};

// --- Expenses ---
export const saveExpense = async (userId: string, expense: Omit<Expense, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'users', userId, 'expenses'), {
            ...expense,
            createdAt: Timestamp.now()
        });
        return { id: docRef.id, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { id: null, error: message };
    }
};

export const getExpenses = async (userId: string) => {
    try {
        const q = query(collection(db, 'users', userId, 'expenses'));
        const snapshot = await getDocs(q);
        const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data: expenses, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { data: [], error: message };
    }
};

export const deleteExpense = async (userId: string, expenseId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'expenses', expenseId));
        return { error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { error: message };
    }
};

// --- Budgets ---
export const saveBudget = async (userId: string, budget: Omit<Budget, 'id'> & { id?: string}) => {
    try {
        const budgetId = `${budget.category}_${budget.month}`;
        await setDoc(doc(db, 'users', userId, 'budgets', budgetId), {
            ...budget,
            updatedAt: Timestamp.now()
        });
        return { id: budgetId, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { id: null, error: message };
    }
};

export const getBudgets = async (userId: string) => {
    try {
        const q = query(collection(db, 'users', userId, 'budgets'));
        const snapshot = await getDocs(q);
        const budgets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data: budgets, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { data: [], error: message };
    }
};

export const deleteBudget = async (userId: string, budgetId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'budgets', budgetId));
        return { error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { error: message };
    }
};

// --- Goals ---
export const saveGoal = async (userId: string, goal: Omit<Goal, 'id'> & { id?: string }) => {
    try {
        if (goal.id) {
            await setDoc(doc(db, 'users', userId, 'goals', goal.id), {
                ...goal,
                updatedAt: Timestamp.now()
            });
            return { id: goal.id, error: null };
        } else {
            const docRef = await addDoc(collection(db, 'users', userId, 'goals'), {
                ...goal,
                createdAt: Timestamp.now()
            });
            return { id: docRef.id, error: null };
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { id: null, error: message };
    }
};

export const getGoals = async (userId: string) => {
    try {
        const q = query(collection(db, 'users', userId, 'goals'));
        const snapshot = await getDocs(q);
        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data: goals, error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { data: [], error: message };
    }
};

export const deleteGoal = async (userId: string, goalId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'goals', goalId));
        return { error: null };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return { error: message };
    }
};

// --- Real-time listeners ---
export const subscribeToExpenses = (userId: string, callback: (expenses: any[]) => void) => {
    const q = query(collection(db, 'users', userId, 'expenses'));
    return onSnapshot(q, (snapshot) => {
        const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(expenses);
    });
};

export const subscribeToBudgets = (userId: string, callback: (budgets: any[]) => void) => {
    const q = query(collection(db, 'users', userId, 'budgets'));
    return onSnapshot(q, (snapshot) => {
        const budgets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(budgets);
    });
};

export const subscribeToGoals = (userId: string, callback: (goals: any[]) => void) => {
    const q = query(collection(db, 'users', userId, 'goals'));
    return onSnapshot(q, (snapshot) => {
        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(goals);
    });
};
