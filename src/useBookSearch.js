import { useEffect, useState } from "react";
import axios from "axios";
const useBookSearch = (query, pageNo) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  let cancel;
  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNo },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((book) => book.title),
            ]),
          ];
        });

        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNo]);
  return { loading, error, books, hasMore };
};
export default useBookSearch;
