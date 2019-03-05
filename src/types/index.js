// @flow
export type MangaInfoFlagsType = {
  DISPLAY_MODE: "NAME" | "NUMBER",
  READ_FILTER: "READ" | "UNREAD" | "ALL",
  SORT_DIRECTION: "ASCENDING" | "DESCENDING",
  SORT_TYPE: "SOURCE" | "NUMBER",
  DOWNLOADED_FILTER: "DOWNLOADED" | "NOT_DOWNLOADED" | "ALL"
};

export type MangaType = {
  // NOTE: Many non-required fields may be missing because the server needs time to
  //       scrape the website, but returns a barebones object early anyway.

  // Must be included
  id: number,
  favorite: boolean,
  title: string,

  // I believe these will always be incliuded
  source: string,
  url: string,
  downloaded: boolean,
  flags: MangaInfoFlagsType,

  chapters: ?number,
  unread: ?number,
  author: ?string,
  description: ?string,
  thumbnail_url: ?string,
  genres: ?string,
  categories: ?Array<string>,
  status: ?string
};

export type ChapterType = {
  date: number,
  source_order: number,
  read: boolean,
  name: string,
  chapter_number: number,
  download_status: string,
  id: number,
  last_page_read: number
};

export type SourceType = {
  name: string,
  supports_latest: boolean,
  id: number,
  lang: {
    name: string,
    display_name: string
  }
};

// ALPHA = alphabetically
// TOTAL = total chapters
export type LibraryFlagsType = {
  filters: [
    {
      type: "DOWNLOADED",
      status: "ANY" | "INCLUDE" | "EXCLUDE"
    },
    {
      type: "UNREAD",
      status: "ANY" | "INCLUDE" | "EXCLUDE"
    },
    {
      type: "COMPLETED",
      status: "ANY" | "INCLUDE" | "EXCLUDE"
    }
  ],
  sort: {
    type:
      | "ALPHA"
      | "LAST_READ"
      | "LAST_UPDATED"
      | "UNREAD"
      | "TOTAL"
      | "SOURCE",
    direction: "ASCENDING" | "DESCENDING"
  },
  display: "GRID" | "LIST",
  show_download_badges: boolean
};
