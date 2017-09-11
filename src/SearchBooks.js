import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookList from './BookList'

class SearchBooks extends Component {
  state = {
    query: '',
    results: []
  };

  updateQuery = (query) => {
    if (query !== this.state.query) {
      if (query) {
        BooksAPI.search(query.trim(), 50).then((bookArray) => {
          this.setState({query: query,
            results: bookArray && bookArray.map ? bookArray.map((book) => {
              return this.props.bookMap.has(book.id)
                  ? this.props.bookMap.get(book.id)
                  : this.props.bookMap.set(book.id, book).get(book.id)
            }) : []
          });
        });
      } else {
        this.setState({query: query, results: []})
      }
    }
  };

  render() {
    const { query, results } = this.state;

    return (<div className="search-books">
          <div className="search-books-bar">
            <Link to="/" className="close-search">Close</Link>
            <div className="search-books-input-wrapper">
              {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
              <input
                  type="text"
                  placeholder="Search by title or author"
                  value={query}
                  onChange={(event) => this.updateQuery(event.target.value)}
              />

            </div>
          </div>
          <div className="search-books-results">
            <BookList books={results} onBookMoved={this.props.onBookMoved}/>
          </div>
        </div>
    );
  }
}

export default SearchBooks