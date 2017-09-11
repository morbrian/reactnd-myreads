import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types';
import * as BooksAPI from './BooksAPI'
import SearchBooks from './SearchBooks'
import BookList from './BookList'
import './App.css'

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

const BookShelf = props => (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{props.shelfTitle}</h2>
      <div className="bookshelf-books">
        <BookList books={props.books} onBookMoved={props.onBookMoved}/>
      </div>
    </div>
);

BookShelf.propTypes = {
  books: PropTypes.array.isRequired,
  onBookMoved: PropTypes.func.isRequired
};

class BooksApp extends Component {
  state = {
    bookMap: new Map([]),
    shelves: {currentlyReading: [], wantToRead: [], read: []}
  };

  componentDidMount() {
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
