import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import { Route } from 'react-router-dom'
import './App.css'


const Book = props => (
    <li key={props.book.id}>
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 188,
            backgroundImage: `url(${props.book && props.book.imageLinks && props.book.imageLinks.thumbnail})` }} />
          <div className="book-shelf-changer">
            <select value={(props.book.shelf) ? props.book.shelf : "none"} onChange={event => {props.handler.moveBookToShelf(props.book, event.target.value);}}>
              <option value="" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{props.book.title}</div>
        <AuthorList authors={props.book.authors}/>
      </div>
    </li>
);

const AuthorList = props => (
    <div className="book-authors">
      { props.authors && props.authors.map((author) => (
          <p key={author}>{author}</p>
        )
      )}
    </div>
);

const BookList = props => (
    <ol className="books-grid">
      {props.books && props.books.length > 0 && props.books.map((book) => (
          <Book key={book.id} book={book} handler={props.handler}/>
        ))}
    </ol>
);

class SearchBooks extends Component {
  state = {
    query: '',
    books: []
  };

  stateHandler = new StateHandler(this);

  updateQuery = (query) => {
    query = query.trim()
    if (query !== this.state.query) {
      if (query) {
        BooksAPI.search(query, 50).then((books) => {
          this.setState({query: query, books: books});
        });
      } else {
        this.setState({query: query, books: []})
      }
    }
  };

  render() {
    const { query } = this.state;

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
        <BookList books={this.state.books} handler={this.stateHandler}/>
      </div>
    </div>
    );
  }
}

const BookShelf = props => (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{props.shelfTitle}</h2>
      <div className="bookshelf-books">
        <BookList books={props.books} handler={props.handler}/>
      </div>
    </div>
);

class StateHandler {
  constructor(delegate) {
    this.delegate = delegate;
  }

  moveBookToShelf(book, shelf) {
    BooksAPI.update(book, shelf).then(() => {
      book.shelf = shelf;
      this.delegate.setState(state => ({
        books: state.books.filter((b) => b.id !== book.id).concat([ book ])
      }));
    })
  }

}

class BooksApp extends Component {
  state = {
    books: []
  };

  stateHandler = new StateHandler(this);

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      console.log("mounted");
      this.setState({ books })
    })
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <BookShelf
                      books={this.state.books.filter((book) => book.shelf === "currentlyReading")}
                      shelfTitle="Currently Reading" handler={this.stateHandler}
                  />
                  <BookShelf
                      books={this.state.books.filter((book) => book.shelf === "wantToRead")}
                      shelfTitle="Want To Read" handler={this.stateHandler}
                  />
                  <BookShelf
                      books={this.state.books.filter((book) => book.shelf === "read")}
                      shelfTitle="Read" handler={this.stateHandler}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link
                  to="/search"
                  className="search-books">
                  Add a book</Link>
              </div>
            </div>
        )}/>
        <Route path="/search" render={() => (
            <SearchBooks/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
