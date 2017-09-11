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
            <select value={(props.book.shelf) ? props.book.shelf : "none"} onChange={event => {props.onBookMoved(props.book, event.target.value);}}>
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
          <Book key={book.id} book={book} onBookMoved={props.onBookMoved}/>
        ))}
    </ol>
);

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

const BookShelf = props => (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{props.shelfTitle}</h2>
      <div className="bookshelf-books">
        <BookList books={props.books} onBookMoved={props.onBookMoved}/>
      </div>
    </div>
);

function extractShelf(books, shelf) {
  return books.filter((book) => book.shelf === shelf).map((book) => {return book.id;})
}

function organizeShelves(books) {
  return {
    currentlyReading: extractShelf(books, "currentlyReading"),
    wantToRead: extractShelf(books, "wantToRead"),
    read: extractShelf(books, "read")
  }
}

class BooksApp extends Component {
  state = {
    bookMap: new Map([]),
    shelves: {currentlyReading: [], wantToRead: [], read: []}
  };

  componentDidMount() {
    console.log("mounted booksapp");
    BooksAPI.getAll().then((bookArray) => {
      this.setState({
        bookMap: new Map(bookArray.map((book) => [book.id, book])),
        shelves: organizeShelves(bookArray)
      })
    })
  }

  moveBookToShelf(book, shelf) {
    BooksAPI.update(book, shelf).then(shelves => {
      book.shelf = shelf;
      this.setState(state => ({
        bookMap: this.state.bookMap,
        shelves: shelves
      }));
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
                      books={this.state.shelves.currentlyReading.map(id =>  {return this.state.bookMap.get(id)})}
                      shelfTitle="Currently Reading" onBookMoved={(book, shelf) => {this.moveBookToShelf(book, shelf);}}
                  />
                  <BookShelf
                      books={this.state.shelves.wantToRead.map(id => {return this.state.bookMap.get(id)})}
                      shelfTitle="Want To Read"
                      onBookMoved={(book, shelf) => {this.moveBookToShelf(book, shelf);}}
                  />
                  <BookShelf
                      books={this.state.shelves.read.map(id => {return this.state.bookMap.get(id)})}
                      shelfTitle="Read"
                      onBookMoved={(book, shelf) => {this.moveBookToShelf(book, shelf);}}
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
            <SearchBooks bookMap={this.state.bookMap}
                onBookMoved={(book, shelf) => {this.moveBookToShelf(book, shelf);}}/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
