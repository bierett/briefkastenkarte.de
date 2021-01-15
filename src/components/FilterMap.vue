<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="success">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Filter</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">
            Speichern
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-list three-line subheader>
        <v-subheader>Standorte</v-subheader>

        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="postBox"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Briefkasten</v-list-item-title>
            <v-list-item-subtitle class="wrap-text"
              >Es werden alle Briefkasten (<a
                href="https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dpost_box"
                target="_blank"
                class="font-weight-light"
                >amenity=post_box</a
              >) im OpenStreetMap-Datenbestand
              dargestellt.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="postOffice"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Postfiliale</v-list-item-title>
            <v-list-item-subtitle class="wrap-text"
              >Es werden alle Filialen (<a
                href="https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dpost_office"
                target="_blank"
                class="font-weight-light"
                >amenity=post_office</a
              >) im OpenStreetMap-Datenbestand
              dargestellt.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="postStation"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Packstation</v-list-item-title>
            <v-list-item-subtitle class="wrap-text"
              >Es werden alle Packstationen (<a
                href="https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dvending_machine"
                target="_blank"
                class="font-weight-light"
                >amenity=vending_machine</a
              >
              /
              <a
                href="https://wiki.openstreetmap.org/wiki/DE:Tag:vending%3Dparcel_pickup;parcel_mail_in"
                target="_blank"
                class="font-weight-light"
                >vending=parcel_pickup;parcel_mail_in</a
              >) im OpenStreetMap-Datenbestand
              dargestellt.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list three-line subheader>
        <v-subheader>Weitere Filtermöglichkeiten</v-subheader>

        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="supplyAreas"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Versorgungsgebiete</v-list-item-title>
            <v-list-item-subtitle class="wrap-text"
              >Es werden die Versorgungsgebiete aller Briefkasten nach §2 Absatz
              2 der Post-Universaldienstleistungsverordnung (<a
                href="http://www.gesetze-im-internet.de/pudlv/BJNR241800999.html"
                target="_blank"
                >PUDLV</a
              >) dargestellt. Bei der Darstellung wird ein Radius von 1.000
              Metern angenommen.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FilterMap',

  data() {
    return {
      dialog: false,
      postBox: true,
      postOffice: false,
      postStation: false,
      supplyAreas: false
    };
  }
};
</script>
