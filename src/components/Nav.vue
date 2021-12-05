<template>
  <nav>
    <img class="logo" alt="Data Studio Logo" title="Data Studio" src="../assets/logo.svg"/>

    <slot/>
  </nav>
</template>

<script>

</script>

<style lang="css" scoped>
nav {
  display: flex;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
}

.logo {
  width: 2rem;
  padding-left: 0.75rem;
}
</style>
