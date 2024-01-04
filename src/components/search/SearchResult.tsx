import { getToursSearch } from '@api/tours';
import { ResultCategory } from './ResultCategory';
import { useInfiniteQuery } from '@tanstack/react-query';
import ToursCategoryItem from '@components/Tours/ToursCategoryItem';
import { useEffect, useState } from 'react';
import { Spinner } from '@components/common/spinner/Spinner';

interface SearchResultProps {
  selectedRegion: string | null;
  searchWord: string;
}

export const SearchResult = ({
  selectedRegion,
  searchWord,
}: SearchResultProps) => {
  const categories = ['전체', '숙소', '식당', '관광지'];
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  useEffect(() => {
    console.log(selectedCategory);
  }, [selectedCategory]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    console.log('searchWord: ' + searchWord);
  }, [searchWord]);
  console.log();

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['searchResults', selectedRegion, searchWord, selectedCategory],
      queryFn: ({ pageParam = 0 }) =>
        getToursSearch({
          region: selectedRegion || '',
          searchWord: searchWord,
          category: selectedCategory !== '전체' ? selectedCategory : undefined,
          page: pageParam,
          size: 10,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        // 'last' 필드가 false이면, 다음 페이지가 존재함
        if (!lastPage.data.last) {
          // 다음 페이지 번호 반환
          return allPages.length + 1;
        }
        // 그렇지 않으면, 더 이상 페이지가 없으므로 undefined 반환
        return undefined;
      },
      enabled: !!searchWord,
    });

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    console.log('error fetching search result ');
  }

  console.log('hasNextPage', hasNextPage);

  const searchResults = data?.pages.flatMap((page) => page.data.data.content);
  // const searchOptions = data?
  console.log('searchResults', searchResults);

  return (
    <>
      {selectedRegion && (
        <span className="title3 pt-3">{selectedRegion} 지역의 </span>
      )}
      {searchWord && <span className="title3 pt-3">{searchWord} 검색결과</span>}
      <div className="mt-2 flex">
        {categories.map((category) => (
          <ToursCategoryItem
            key={category}
            name={category}
            isSelected={category === selectedCategory}
            onSelect={handleSelectCategory}
          />
        ))}
      </div>
      {searchResults ? (
        <ResultCategory
          data={searchResults}
          category={selectedCategory}
          fetchNextPage={hasNextPage ? fetchNextPage : null}
          hasNextPage={hasNextPage}
        />
      ) : (
        <div>검색결과가 없습니다.</div>
      )}
    </>
  );
};
