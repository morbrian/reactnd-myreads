# MyReads Project

MyReads is my implementation of the first project for the Udacity React Nanodegree.

## Application Files

### App.js

This is the primary application file and includes a description of the book shelves page.
It will load a list of shelves at '/' or the search page at '/search'.

The book array is reformed into a Map data structure to support fast look ups
of individual books by id if they have already been downloaded.

### SearchBooks.js

This file describes the search page at '/search'.

The local managed state is the query and search results.
When a book already exists in the user's collection, the
search results will use the user owned book with the correct shelf.

### BookList

This describes how to display a list of books from an array,
and is used by both the book shelves in `App.js` and by the search page in `SearchBooks.js`.