import { RegionSelect } from '@components/search/RegionSelect';
import SearchInput from '@components/search/SearchInput';
import { SearchResult } from '@components/search/SearchResult';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const Search = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const regionFromQuery = queryParams.get('region');
  const searchWordFromQuery = queryParams.get('searchWord');

  const [selectedRegion, setSelectedRegion] = useState(regionFromQuery);
  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    if (regionFromQuery) {
      setSelectedRegion(regionFromQuery);
    } else {
      setSelectedRegion('');
    }

    if (searchWordFromQuery) {
      setSearchWord(searchWordFromQuery);
    } else {
      setSearchWord('');
    }
  }, [location, regionFromQuery, searchWordFromQuery]);

  return (
    <div className="min-h-screen">
      <SearchInput />
      {searchWord ? (
        <SearchResult selectedRegion={selectedRegion} searchWord={searchWord} />
      ) : (
        <RegionSelect />
      )}
    </div>
  );
};
