<template>
  <v-container>
    <v-row class="justify-center">
      <v-col class="mt-2" cols="10">
        <h1 class="mb-2 text-h2">
          Impressum
        </h1>

        <p class="subheading font-weight-regular">
          Die Briefkastenkarte zeigt Briefkästen, Postfilialen sowie
          Packstationen, die in der OpenStreetMap Datenbank eingetragen sind.<br />
          Weitere Informationen finden Sie im OpenStreetMap Wiki unter
          <a
            href="https://wiki.openstreetmap.org/wiki/DE:Briefkastenkarte"
            target="_blank"
            >https://wiki.openstreetmap.org/wiki/DE:Briefkastenkarte</a
          >.
        </p>

        <p class="subheading font-weight-regular">
          Kartengrundlage: Die Daten stammen von
          <a href="https://www.openstreetmap.org" target="_blank"
            >OpenStreetMap</a
          >
          und unterliegen den dort festgelegten rechtlichen Bedingungen. Eine
          Gewähr für Vollständigkeit oder Richtigkeit wird nicht übernommen.
          Informationen zum Thema Urheberrecht finden Sie unter
          <a href="https://www.openstreetmap.org/copyright" target="_blank"
            >https://www.openstreetmap.org/copyright</a
          >.
        </p>
      </v-col>

      <v-col class="mt-2" cols="10">
        <h2 class="headline mb-2">
          Kontakt
        </h2>

        <p class="subheading font-weight-regular">
          Danilo Bretschneider<br />
          <a v-bind:href="email.prefix + email.decoded">{{ email.decoded }}</a>
        </p>
      </v-col>

      <v-col class="mt-2" cols="10">
        <h2 class="headline mb-2">
          Datenschutz
        </h2>

        <p class="subheading font-weight-regular"></p>
      </v-col>

      <v-col class="d-none mb-5" cols="10">
        <h2 class="headline mb-3">
          Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Imprint',

  data: () => ({
    email: {
      prefix: atob('bWFpbHRvOg=='),
      decoded: atob('bWFpbEBicmllZmthc3RlbmthcnRlLmRl')
    },
    importantLinks: [
      {
        text: 'OpenStreetMap',
        href: 'https://www.openstreetmap.org/'
      },
      {
        text: 'OpenStreetMap auf Twitter',
        href: 'https://twitter.com/openstreetmap'
      }
    ]
  })
};
</script>
