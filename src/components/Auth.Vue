<script setup>
import { ref } from 'vue';

import { authAPI } from '../utils/auth';
import { Icon } from '@iconify/vue';

const loading = ref(false);
const email = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        loading.value = true;
        const result = await authAPI.login(email.value, password.value);
        if (result.error) {
            // Handle error
            alert(result.error.error_description || result.error.message);
        } else {
            // Handle success
            console.log('User logged in:', result.user);
            // Redirect to the dashboard after successful login
            window.location.href = '/app/dashboard';
        }
    } catch (error) {
        alert(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};

const handleSignup = async () => {
    try {
        loading.value = true;
        const { data, error } = await authAPI.signup(
            email.value,
            password.value
        );
        if (error) throw error;
        alert('Check your email for the confirmation link!');
    } catch (error) {
        alert(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};

const handlesignInWithGoogle = async () => {
    const { error } = await authAPI.signInWithGoogle();
    if (error) throw error;
    // Redirect to the dashboard after successful login
    window.location.href = '/app/dashboard';
};
</script>

<template>
    <div
        class="flex flex-col items-center justify-center h-screen bg-stone-50 dark:bg-stone-900"
    >
        <div
            class="flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900 p-8"
        >
            <h2 class="text-2xl font-bold mb-2">Welcome to blockspage</h2>
            <p class="text-lg mb-6">Sign in or create an account</p>

            <form @submit.prevent class="flex flex-col gap-4">
                <div
                    class="flex flex-col gap-1 items-start justify-start w-full"
                >
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        v-model="email"
                        class="w-full p-2 rounded-sm border border-stone-500"
                    />
                </div>
                <div
                    class="flex flex-col gap-1 items-start justify-start w-full"
                >
                    <label for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        v-model="password"
                        class="w-full p-2 rounded-sm border border-stone-500"
                    />
                </div>

                <button
                    class="bg-orange-500 text-white p-2 rounded-sm w-full"
                    @click="handleLogin"
                    :disabled="loading"
                >
                    {{ loading ? 'Loading...' : 'Login' }}
                </button>
                <button
                    class="bg-stone-50 border border-stone-300 text-stone-900 p-2 rounded-sm w-full hover:bg-stone-200 transition-colors duration-100 flex items-center justify-center gap-2"
                    @click="handleSignup"
                    :disabled="loading"
                >
                    {{ loading ? 'Loading...' : 'Sign Up' }}
                </button>

                <div>
                    <button
                        @click="handlesignInWithGoogle"
                        class="bg-stone-50 border border-stone-300 text-stone-900 p-2 rounded-sm w-full hover:bg-stone-200 transition-colors duration-100 flex items-center justify-center gap-2"
                    >
                        <Icon
                            icon="ph:google-logo-bold"
                            class="w-10 h-10 text-stone-400"
                        />
                        Login with Google
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* You can add component-specific styles here */
</style>
