import React from 'react'
import './App.css'

const Book = props => (
    <li key={props.book.id}>
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 188,
            backgroundImage: `url(${props.book && props.book.imageLinks && props.book.imageLinks.thumbnail})` }} />
          <div className="book-shelf-changer">
            <select value={(props.book.shelf) ? props.book.shelf : "none"}
                    onChange={event => {props.onBookMoved(props.book, event.target.value);}}>
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
          <Book key={book.id} book={book}
                onBookMoved={props.onBookMoved}/>
      ))}
    </ol>
);

export default BookList