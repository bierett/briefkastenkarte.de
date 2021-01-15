<template>
  <v-sheet>
    <v-app>
      <v-app-bar app color="success" dark>
        <v-app-bar-nav-icon to="/">
          <v-icon>mdi-postage-stamp</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title>Briefkastenkarte</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->

        <FilterMap />

        <v-divider vertical></v-divider>

        <v-btn
          icon
          href="https://github.com/dbretschneider/briefkastenkarte.de"
          target="_blank"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>

        <v-btn icon v-bind:href="email.prefix + email.decoded">
          <v-icon>mdi-email</v-icon>
        </v-btn>

        <v-btn icon to="/imprint" link>
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <Home />
      </v-main>
    </v-app>
  </v-sheet>
</template>

<style>
  @import './assets/styles/briefkastenkarte.css';
</style>

<script>
import Home from './components/Home';
import FilterMap from './components/FilterMap';

export default {
  name: 'App',

  components: {
    Home,
    FilterMap
  },

  data: () => ({
    group: null,
    email: {
      prefix: atob('bWFpbHRvOg=='),
      decoded: atob('bWFpbEBicmllZmthc3RlbmthcnRlLmRl')
    }
  })
};
</script>
