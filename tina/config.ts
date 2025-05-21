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
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  client: { skip: true },
  build: {
    outputFolder: "admin",
    publicFolder: "assets",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "assets",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        format: "yml",
        label: "Bandeau infos",
        name: "bandeau_info",
        path: "_data",
        match: {
          include: "bandeau_info",
        },
        fields: [
          {
            type: "string",
            name: "message",
            label: "Informations à afficher dans le bandeau",
            isBody: true,
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
    ],
  },
});
