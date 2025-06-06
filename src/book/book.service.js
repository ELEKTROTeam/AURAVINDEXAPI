import {ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as book_repository from './book.repository.js';
import * as editorial_repository from '../editorial/editorial.repository.js';
import * as book_status_repository from '../book_status/book_status.repository.js';
import * as book_collection_repository from '../book_collection/book_collection.repository.js';
import { generate_filter } from '../config/util.js';
/**
 * Creates a new book in the database.
 * 
 * @param {string} title - The title of the book.
 * @param {string} isbn - The ISBN number of the book.
 * @param {string} classification - The classification of the book.
 * @param {string} summary - A brief summary of the book.
 * @param {string} editorial - The editorial ID that the book belongs to.
 * @param {string} language - The language of the book.
 * @param {string} edition - The edition of the book.
 * @param {string} sample - Sample availability of the book.
 * @param {string} location - Location where the book is stored.
 * @param {string} book_status - The status of the book.
 * @param {Array} genres - The genres of the book.
 * @param {string} book_collection - The collection ID the book belongs to.
 * @param {Array} authors - The authors of the book.
 * @param {string} book_img - The image URL for the book.
 * @returns {Object} The newly created book object.
 * @throws {ObjectNotFound} If editorial, book status, or book_collection does not exist.
 * @throws {ObjectAlreadyExists} If a book with the same classification already exists.
 */
export const create_new_book = async (title, isbn, classification, summary, editorial, language, edition, sample, location, book_status, genres, book_collection, authors, book_img) => {
    const book_exists_classification = await book_repository.filter_books({['classification']: new RegExp(classification, 'i')}, 0, 10);
    
    const editorial_exists = editorial_repository.find_editorial_by_id(editorial);
    const book_status_exists = book_status_repository.find_book_status_by_id(book_status);
    const book_collection_exists = book_collection_repository.find_book_collection_by_id(book_collection);
    if(!editorial_exists) {
        throw new ObjectNotFound("editorial");
    }
    if(!book_status_exists) {
        throw new ObjectNotFound("book_status");
    }
    if(!book_collection_exists) {
        throw new ObjectNotFound("book_collection");
    }

    if(book_exists_classification.length != 0) {
        throw new ObjectAlreadyExists("book");
    }
    const new_book = await book_repository.create_book({title, isbn, classification, summary, editorial, language, edition, sample, location, book_status, genres, book_collection, authors, book_img});
    return new_book;
}
/**
 * Fetches all books from the database with pagination.
 * 
 * @param {Boolean} show_duplicates - If duplicates should be displayed
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of books per page.
 * @returns {Array} A list of books.
 * @throws {ObjectInvalidQueryFilters} If page or limit are invalid.
 */
export const get_all_books = async (show_duplicates, show_lents, page, limit, sort, sort_by) => {
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book");
    }
    const sort_field = sort_by || 'createdAt';
    const sort_direction = sort === 'desc' ? -1 : 1;
    const books = await book_repository.find_all_books(null, null, sort_field, sort_direction);
    let filtered_books = books;
    if ((!show_lents) || (show_lents == "false")) {
        filtered_books = filtered_books.filter(book => {
            return !(book.book_status && book.book_status.book_status === "LENT");
        });
    }
    if ((!show_duplicates) || (show_duplicates == "false")) {
        const seen_classifications = new Set();
        filtered_books = books.filter(book => {
            const parts = book.classification.split('.');
            if (parts.length < 3) return true;

            const base_classification = `${parts[0]}.${parts[1]}`;
            if (seen_classifications.has(base_classification)) {
                return false;
            } else {
                seen_classifications.add(base_classification);
                return true;
            }
        });
    }
    const total_books = filtered_books.length
    if(limit == "none") limit = total_books
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_books / limit);
    const paginated_books = filtered_books.slice(skip, skip + limit);
    return {
        data: paginated_books,
        pagination: {
            totalItems: total_books,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters books based on a given field and value with pagination.
 * 
 * @param {Boolean} show_duplicates - If duplicates should be displayed
 * @param {string} filter_field - The field to filter by (e.g., title, isbn).
 * @param {string} filter_value - The value to filter by.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of books per page.
 * @returns {Array} A list of filtered books.
 * @throws {ObjectInvalidQueryFilters} If the filter field is invalid.
 */
export const filter_books = async (show_duplicates, show_lents, filter_field, filter_value, page, limit, sort, sort_by) => {
    const field_types = {
        title: 'String',
        isbn: 'String',
        classification: 'String',
        summary: 'String',
        editorial: 'ObjectId',
        language: 'String',
        edition: 'String',
        sample: 'Number',
        location: 'String',
        book_status: 'ObjectId',
        genres: 'String',
        book_collection: 'ObjectId',
        authors: 'ObjectId',
        book_img: 'String'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field) && filter_field != "any") {
        throw new ObjectInvalidQueryFilters("book");
    }
    if(isNaN(page) || (isNaN(limit) && (limit != "none")) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("book");
    }
    const sort_field = sort_by || 'createdAt';
    const sort_direction = sort === 'desc' ? -1 : 1;
    const filter = generate_filter(field_types, filter_field, filter_value);
    const books = await book_repository.filter_books(filter, null, null, sort_field, sort_direction)
    let filtered_books = books;
    if ((!show_lents) || (show_lents == "false")) {
        filtered_books = filtered_books.filter(book => {
            return !(book.book_status && book.book_status.book_status === "LENT");
        });
    }
    if ((!show_duplicates) || (show_duplicates == "false")) {
        const seen_classifications = new Set();
        filtered_books = books.filter(book => {
            const parts = book.classification.split('.');
            if (parts.length < 3) return true;

            const base_classification = `${parts[0]}.${parts[1]}`;
            if (seen_classifications.has(base_classification)) {
                return false;
            } else {
                seen_classifications.add(base_classification);
                return true;
            }
        });
    }
    const total_books = filtered_books.length
    if(limit == "none") limit = total_books
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const total_pages = Math.ceil(total_books / limit);
    const paginated_books = filtered_books.slice(skip, skip + limit);
    return {
        data: paginated_books,
        pagination: {
            totalItems: total_books,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Fetches the latest book releases.
 * 
 * @param {limit} limit - The number of books per page
 * @returns
 */
export const get_latest_releases = async (limit) => {
    if(isNaN(limit) || limit < 1) {
        throw new ObjectInvalidQueryFilters("book");
    }
    limit = parseInt(limit);
    const books = await book_repository.find_latest_releases(limit);
    /* Remove duplicates */
    let filtered_books = books;
    const seen_classifications = new Set();
    filtered_books = books.filter(book => {
        const parts = book.classification.split('.');
        if (parts.length < 3) return true;

        const base_classification = `${parts[0]}.${parts[1]}`;
        if (seen_classifications.has(base_classification)) {
            return false;
        } else {
            seen_classifications.add(base_classification);
            return true;
        }
    });
    const total_books = filtered_books.length;
    const total_pages = Math.ceil(total_books / limit);
    return {
        data: filtered_books,
        pagination: {
            totalItems: total_books,
            totalPages: total_pages,
            currentPage: 1,
            pageSize: limit
        }
    };
}

/**
 * Fetches a book by its ID.
 * 
 * @param {string} id - The ID of the book to fetch.
 * @returns {Object} The book object.
 * @throws {ObjectNotFound} If the book does not exist.
 */
export const get_book_by_id = async (id) => {
    const book_exists = await book_repository.find_book_by_id(id);
    if(!book_exists) {
        throw new ObjectNotFound("book");
    }
    return book_exists;
}
/**
 * Updates the information of an existing book.
 * 
 * @param {string} id - The ID of the book to update.
 * @param {Object} updates - The updated information of the book.
 * @returns {Object} The updated book object.
 * @throws {ObjectNotFound} If the book does not exist.
 * @throws {ObjectAlreadyExists} If a book with the same classification already exists.
 * @throws {ObjectMissingParameters} If required parameters are missing.
 */
export const update_book = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("book");
    }
    const book_exists_id = await book_repository.find_book_by_id(id);
    const book_exists_classification = await book_repository.filter_books({['classification']: new RegExp(updates.classification, 'i')}, 0, 10);
    if(!book_exists_id){
        throw new ObjectNotFound("book");
    }
    
    if( (book_exists_classification.length != 0) && (book_exists_classification[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("book");
    }
    return await book_repository.update_book(id, updates);
}
/**
 * Deletes a book from the database.
 * 
 * @param {string} id - The ID of the book to delete.
 * @returns {Object} The result of the deletion.
 * @throws {ObjectNotFound} If the book does not exist.
 * @throws {ObjectMissingParameters} If required parameters are missing.
 */
export const delete_book = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("book");
    }
    
    const book_exists = await book_repository.find_book_by_id(id);

    if(!book_exists){
        throw new ObjectNotFound("book");
    }
    return await book_repository.delete_book(id);
}