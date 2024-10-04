export type SteamGameAppApiResponse =
  | SteamGameAppApiSuccessResponse
  | SteamGameAppApiErrorResponse;

export type SteamGameAppApiErrorResponse = {
  [key: string]: {
    success: false;
  };
} | null;

export type SteamGameAppApiSuccessResponse = {
  [key: string]: {
    success: true;
    data: GameAppData | DlcAppData;
  };
};

export type SteamAppId = number;
export type GameAppData = {
  type: "game";
  name: string;
  steam_appid: SteamAppId;
  required_age: number;
  is_free: boolean;
  dlc: SteamAppId[];
  /** HTML */
  detailed_description: string;
  /** HTML */
  about_the_game: string;
  short_description: string;
  /** HTML */
  supported_languages: string;
  /** HTML */
  reviews: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  /** Official Page */
  website: string;
  /** HTML */
  pc_requirements: Requirement;
  /** HTML */
  mac_requirements: Requirement;
  /** HTML */
  linux_requirements: Requirement;
  legal_notice: string;
  developers: string[];
  publishers: string[];
  price_overview: PriceOverview;
  packages: number[];
  package_groups: PackageGroup[];
  platforms: Platforms;
  metacritic: Metacritic;
  categories: Category[];
  genres: Genre[];
  screenshots: Screenshot[];
  movies: Movie[];
  recommendations: Recommendations;
  achievements: Achievements;
  release_date: ReleaseDate;
  support_info: SupportInfo;
  background: string;
  background_raw: string;
  content_descriptors: ContentDescriptors;
  ratings: Ratings;
};

export type DlcAppData = {
  type: "dlc";
  name: string;
  steam_appid: SteamAppId;
  required_age: number;
  is_free: boolean;
  dlc: SteamAppId[];
  /** HTML */
  detailed_description: string;
  /** HTML */
  about_the_game: string;
  short_description: string;
  /** HTML */
  supported_languages: string;
  /** HTML */
  reviews: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  /** Official Page */
  website: string;
  pc_requirements: Requirement | [];
  mac_requirements: Requirement | [];
  linux_requirements: Requirement | [];
  legal_notice: string;
  developers: string[];
  publishers: string[];
  price_overview: PriceOverview;
  packages: number[];
  package_groups: PackageGroup[];
  platforms: Platforms;
  metacritic: Metacritic | null | undefined;
  categories: Category[];
  genres: Genre[];
  screenshots: Screenshot[];
  movies: Movie[];
  recommendations: Recommendations;
  achievements: Achievements;
  release_date: ReleaseDate;
  support_info: SupportInfo;
  background: string;
  background_raw: string;
  content_descriptors: ContentDescriptors;
  ratings: Ratings;
};

export type Achievements = {
  total: number;
  highlighted: Highlighted[];
};

export type Highlighted = {
  name: string;
  path: string;
};

export type Category = {
  id: number;
  description: string;
};

export type ContentDescriptors = {
  ids: number[];
  notes: null;
};

export type Genre = {
  id: string;
  description: string;
};

export type Requirement = {
  minimum: string;
  recommended: string;
};

export type Metacritic = {
  score: number;
  url: string;
};

export type Movie = {
  id: number;
  name: string;
  thumbnail: string;
  webm: MimeVideoQuality;
  mp4: MimeVideoQuality;
  highlight: boolean;
};

export type MimeVideoQuality = {
  "480": string;
  max: string;
};

export type PackageGroup = {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: string;
  subs: Sub[];
};

export type Sub = {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: string;
  is_free_license: boolean;
  price_in_cents_with_discount: Cents;
};

export type Platforms = {
  windows: boolean;
  mac: boolean;
  linux: boolean;
};

type Cents = number;
export type PriceOverview = {
  currency: string;
  initial: Cents;
  final: Cents;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
};

export type Ratings = {
  dejus: Crl;
  pegi: Crl;
  usk: Usk;
  kgrb: Crl;
  csrr: Crl;
  crl: Crl;
  steam_germany: SteamGermany;
};

export type Crl = {
  rating: string;
  descriptors: string;
};

export type SteamGermany = {
  rating_generated: string;
  rating: string;
  required_age: string;
  banned: string;
  use_age_gate: string;
  descriptors: string;
};

export type Usk = {
  rating: string;
};

export type Recommendations = {
  total: number;
};

export type ReleaseDate = {
  coming_soon: boolean;
  /** Format: "D MMM YYYY" (day, abbreviated month, year).
   * Example: 1 SEP 2020
   */
  date: string;
};

export type Screenshot = {
  id: number;
  path_thumbnail: string;
  path_full: string;
};

export type SupportInfo = {
  url: string;
  email: string;
};
