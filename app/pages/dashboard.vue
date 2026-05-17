<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { session } = useAuth()
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p>Protected route — signed in as {{ session?.user.email }}</p>
  </div>
</template>
