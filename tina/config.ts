import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  client: { skip: true },
  build: {
    outputFolder: "admin",
    publicFolder: "/",
    basePath: "site"
  },
  media: {
    tina: {
      mediaRoot: "assets/data",
      publicFolder: "",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        format: "yml",
        label: "Contenu",
        name: "content",
        path: "_data",
        match: {
          include: "content",
        },
        fields: [
          {
            type: "string",
            name: "message",
            label: "Informations à afficher dans le bandeau",
            isBody: true,
          },
          {
            type: "rich-text",
            name: "trial",
            label: "Séance d'essai"
          },
        ],
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
      },
      {
        format: "yml",
        label: "REC",
        name: "rec",
        path: "_data",
        match: {
          include: "rec",
        },
        fields: [
          {
            type: "string",
            name: "email",
            label: "Adresse email du club",
          },
          {
            type: "string",
            name: "liste_attente",
            label: "URL vers la liste d'attente",
          },
          {
            type: "string",
            name: "calendar",
            label: "URL vers le calendrier",
          },
          {
            label: "Réseaux sociaux",
            name: "socials",
            type: "object",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "Réseau social"
              }),
            },
            fields: [
              {
                label: "Nom du réseau",
                name: "name",
                type: "string",
              },
              {
                label: "Lien du réseau",
                name: "url",
                type: "string",
              },
              {
                label: "Logo du réseau",
                name: "logo_svg",
                type: "string",
              },
            ],
          },
        ],
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
      },
      {
        format: "yml",
        label: "FFBad",
        name: "ffbad",
        path: "_data",
        match: {
          include: "ffbad",
        },
        fields: [
          {
            type: "string",
            name: "site",
            label: "Lien vers le site de la FFBad",
          },
          {
            type: "string",
            name: "licence",
            label: "Lien pour adhérer au REC",
          },
          {
            type: "string",
            name: "certificat",
            label: "Lien vers le certificat médical",
          },
        ],
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
      },
      {
        format: "yml",
        label: "Salles",
        name: "salles",
        path: "_data/salles",
        fields: [
          {
            label: "Nom de la salle",
            name: "titre",
            type: "string",
            isTitle: true,
            required: true
          },
          {
            label: "Localisation de la salle",
            name: "location",
            type: "string",
          },
        ],
      },
      {
        format: "yml",
        label: "Entraîneurs",
        name: "entraineurs",
        path: "_data/entraineurs",
        fields: [
          {
            label: "Nom de l'entraîneur",
            name: "titre",
            type: "string",
            isTitle: true,
            required: true
          },
        ],
      },
      {
        format: "yml",
        label: "Niveaux",
        name: "niveaux",
        path: "_data/niveaux",
        fields: [
          {
            label: "Titre",
            name: "titre",
            type: "string",
            isTitle: true,
            required: true
          },
          {
            label: "Description",
            name: "description",
            type: "string",
          },
          {
            label: "Tarif",
            name: "tarif",
            type: "number",
          },
          {
            label: "Ordre d'affichage",
            name: "ordre",
            type: "number",
          },
          {
            type: 'image',
            label: 'Logo',
            name: 'logo',
            required: true
          },
        ],
      },
      {
        format: "yml",
        label: "Créneaux",
        name: "creneaux",
        path: "_data",
        match: {
          include: "creneaux",
        },
        fields: [
          {
            label: "Créneaux",
            name: "creneaux",
            type: "object",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: `${item?.jour} / ${item?.start}-${item?.end} / ${item.salle}`
              }),
            },
            fields: [
              {
                type: "string",
                name: "jour",
                label: "Jour",
                options: [
                  { value: "Lundi", label: "Lundi" },
                  { value: "Mardi", label: "Mardi" },
                  { value: "Mercredi", label: "Mercredi" },
                  { value: "Jeudi", label: "Jeudi" },
                  { value: "Vendredi", label: "Vendredi" },
                  { value: "Samedi", label: "Samedi" },
                  { value: "Dimanche", label: "Dimanche" },
                ],
                ui: {
                  component: "select",
                },
                required: true,
              },
              {
                name: "start",
                label: "Heure de début",
                type: "string",
                ui: {
                  validate: (value: string) => {
                    return /^([01]\d|2[0-3])h([0-5]\d)$/.test(value)
                      ? undefined
                      : "Format attendu : HHhmm (ex : 09h30)";
                  }
                },
                required: true,
              },
              {
                name: "end",
                label: "Heure de fin",
                type: "string",
                ui: {
                  validate: (value: string) => {
                    return /^([01]\d|2[0-3])h([0-5]\d)$/.test(value)
                      ? undefined
                      : "Format attendu : HHhmm (ex : 09h30)";
                  }
                },
                required: true,
              },
              {
                type: "reference",
                name: "salle",
                label: "Salle",
                collections: ["salles"],
                required: true
              },
              {
                type: "object",
                name: "entraineurs",
                label: "Entraîneurs",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: `${item?.entraineurs}`
                  }),
                },
                fields: [
                  {
                    type: "reference",
                    name: "entraineurs",
                    label: "Entraîneurs",
                    collections: ["entraineurs"],
                    required: true
                  }
                ],
              },
              {
                type: "object",
                name: "niveaux",
                label: "Niveaux",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: `${item?.niveaux}`
                  }),
                },
                fields: [
                  {
                    type: "reference",
                    name: "niveaux",
                    label: "Niveaux",
                    collections: ["niveaux"],
                    required: true
                  }
                ],
              },
              {
                name: "description",
                label: "Description",
                type: "string",
              },
              {
                type: 'boolean',
                name: 'isFull',
                label: 'Créneau complet ?'
              },
              {
                type: 'boolean',
                name: 'isWaitingList',
                label: 'Inscription sur la liste d\'attente possible ?'
              },
              {
                type: 'boolean',
                name: 'membersOnly',
                label: 'Réservé aux licenciés ?'
              }
            ],
          },
        ],
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
      },
    ],
  },
});
