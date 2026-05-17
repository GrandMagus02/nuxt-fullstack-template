<script setup lang="ts">
const { session, isPending, providers } = useAuth()
</script>

<template>
  <div>
    <h1>Nuxt Fullstack Template</h1>
    <p v-if="isPending">Loading session...</p>
    <p v-else-if="session">Signed in as {{ session.user.email }}</p>
    <p v-else>Not signed in</p>
    <pre>{{ JSON.stringify(providers, null, 2) }}</pre>
  </div>
</template>
