import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Translation key toasted when the mutation succeeds. */
      successKey?: string;
    };
  }
}
