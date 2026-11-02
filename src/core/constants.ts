export class Constants {
  public static readonly COMPANY_NAME: string = 'Rec Badminton';
  public static readonly SITE_URL: string = 'https://recbadminton.fr';

  public static readonly COPYRIGHT_YEAR: number = new Date().getFullYear();

  public static readonly ROUTE_HOME: string = '/';
  public static readonly ROUTE_SCHEDULE: string = '/creneaux';
  public static readonly ROUTE_REGISTRATION: string = '/inscription';
  public static readonly ROUTE_COMPETITION: string = '/competition';
  public static readonly ROUTE_SHOP: string = '/boutique';
  public static readonly ROUTE_CONTACT: string = '/contact';
  public static readonly ROUTE_DATA_POLICY: string = '/politique-de-donnees';
  public static readonly ROUTE_ADMIN: string = '/admin';

  // "/creneaux" -> "https://recbadminton.fr/creneaux/": the build serves each page from <route>/index.html
  public static pageUrl(route: string): string {
    return `${Constants.SITE_URL}${route.endsWith('/') ? route : `${route}/`}`;
  }
}
