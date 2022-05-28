import { useState, useRef, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";
function App() {
  const [query, setQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNo);

  const observer = useRef();
  const lastElementBook = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prevPageNo) => prevPageNo + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNo(1);
  };
  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastElementBook} key={book}>
              {book}
            </div>
          );
        }
        return <div key={book}>{book}</div>;
      })}
      <div> {loading && "Loading..."}</div>
      <div> {error && "Error!"}</div>
    </>
  );
}

export default App;
