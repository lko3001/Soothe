export interface Note {
  userId: number;
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string | undefined;
  email: string | undefined;
  image: string | undefined;
}

export interface UserNote {
  user: User;
  note: Note;
}

export interface Children {
  children: React.ReactNode;
}

export interface Theme {
  [key: string]: string;
  // LIGHT MODE
  white: string;
  black: string;
  lightGray: string;
  grayHover: string;
  gray: string;
  accentWarm: string;
  warmHover: string;
  accentCold: string;
  coldHover: string;
  // DARK MODE
  darkWhite: string;
  darkBlack: string;
  darkLightGray: string;
  darkGrayHover: string;
  darkGray: string;
  darkAccentWarm: string;
  darkWarmHover: string;
  darkAccentCold: string;
  darkColdHover: string;
}
