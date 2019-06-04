// @flow
import React from "react";
import ContinueReadingButton from "components/MangaInfo/ContinueReadingButton";
import CenterHorizontally from "components/CenterHorizontally";
import MangaInfoChapterList from "components/MangaInfo/MangaInfoChapterList";
import type { MangaType, ChapterType } from "types";
import filterSortChapters from "components/MangaInfo/chapterUtils";

type Props = {
  chapters: Array<ChapterType>,
  mangaInfo: MangaType,
  toggleRead: Function
};

const MangaInfoChapters = ({ chapters, mangaInfo, toggleRead }: Props) => {
  const filteredSortedChapters = filterSortChapters(chapters, mangaInfo.flags);

  return (
    <React.Fragment>
      <CenterHorizontally>
        <ContinueReadingButton
          chapters={chapters}
          mangaId={mangaInfo.id}
          style={{ marginBottom: 24 }}
        />
      </CenterHorizontally>

      <MangaInfoChapterList
        mangaInfo={mangaInfo}
        chapters={filteredSortedChapters}
        toggleRead={toggleRead}
      />
    </React.Fragment>
  );
};

export default MangaInfoChapters;
