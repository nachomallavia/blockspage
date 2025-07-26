<script setup>
import { ref } from 'vue';
import { supabase } from '../db/supabase.js';

const loading = ref(false);
const email = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
        // Redirect to the dashboard after successful login
        window.location.href = '/app/dashboard';
    } catch (error) {
        alert(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};

const handleSignup = async () => {
    try {
        loading.value = true;
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
    } catch (error) {
        alert(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};

const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
};
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div
            class="flex flex-col items-center justify-center bg-white p-8 rounded-sm shadow-sm"
        >
            <h2 class="text-2xl font-bold">Welcome to blockspage</h2>
            <p class="text-lg">Sign in or create an account</p>

            <form @submit.prevent>
                <div class="flex gap-2 items-center justify-center mb-4">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        v-model="email"
                    />
                </div>
                <div class="flex gap-2 items-center justify-center mb-4">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        v-model="password"
                    />
                </div>
                <div>
                    <button
                        class="bg-blue-500 text-white p-2 rounded-sm w-full mb-4"
                        @click="handleLogin"
                        :disabled="loading"
                    >
                        {{ loading ? 'Loading...' : 'Login' }}
                    </button>
                    <button
                        class="bg-blue-500 text-white p-2 rounded-sm"
                        @click="handleSignup"
                        :disabled="loading"
                    >
                        {{ loading ? 'Loading...' : 'Sign Up' }}
                    </button>
                </div>
                <hr />
                <div>
                    <button @click="signInWithGoogle">
                        Login! with Google
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* You can add component-specific styles here */
div {
    margin-bottom: 1rem;
}
</style>
