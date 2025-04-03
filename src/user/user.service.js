import {FailedToSendEmail, InvalidEmailValidation, InvalidPasswordReset, ObjectAlreadyExists, ObjectInvalidQueryFilters, ObjectMissingParameters, ObjectNotFound } from '../config/errors.js';
import * as user_repository from './user.repository.js';
import * as role_repository from '../role/role.repository.js';
import { app_config } from '../config/app.config.js';
import { generate_filter } from '../config/util.js';
import bcrypt from 'bcryptjs';

/**
 * Creates a new user with the provided information.
 * 
 * @param {string} username - The username of the new user.
 * @param {string} name - The first name of the user.
 * @param {string} last_name - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} biography - A short biography of the user.
 * @param {string} gender - The gender of the user.
 * @param {Date} birthdate - The birthdate of the user.
 * @param {string} user_img - The user's profile image URL.
 * @param {string} role - The role of the user (optional, defaults to 'Client user').
 * @param {string} password - The password for the user account.
 * 
 * @throws {ObjectAlreadyExists} If a user with the same username or email already exists.
 * @returns {Object} The newly created user object.
 */
export const create_new_user = async (username, name, last_name, email, biography, gender, birthdate, user_img, role, password) => {
    const user_exists = await user_repository.filter_users({['username']: new RegExp(username, 'i'), ['email']: new RegExp(email, 'i')}, 0, 10);
    if(user_exists.length != 0) {
        throw new ObjectAlreadyExists("user");
    }
    if(!role) {
        const find_role = await role_repository.filter_roles({name: 'Client user'});
        role = find_role[0]._id;
    }
    const new_user = await user_repository.create_user({username, name, last_name, email, biography, gender, birthdate, user_img, role, password});
    return new_user;
}
/**
 * Retrieves all users with pagination.
 * 
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of users to retrieve per page.
 * 
 * @throws {ObjectInvalidQueryFilters} If the provided page or limit is invalid.
 * @returns {Array} An array of user objects.
 */
export const get_all_users = async (page, limit) => {
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("user");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const users = await user_repository.find_all_users(skip, limit);
    const total_users = await user_repository.count_users();
    const total_pages = Math.ceil(total_users / limit);
    return {
        data: users,
        pagination: {
            totalItems: total_users,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Filters users based on the provided field and value with pagination.
 * 
 * @param {string} filter_field - The field to filter users by (e.g., 'username', 'email').
 * @param {string} filter_value - The value to search for in the filter field.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of users to retrieve per page.
 * 
 * @throws {ObjectInvalidQueryFilters} If the filter field is invalid or page/limit are not valid.
 * @returns {Array} An array of filtered user objects.
 */
export const filter_users = async (filter_field, filter_value, page, limit) => {
    const field_types = {
        username: 'String',
        name: 'String',
        last_name: 'String',
        email: 'String',
        biography: 'String',
        gender: 'ObjectId',
        birthdate: 'Date',
        user_img: 'String',
        role: 'ObjectId'
    };
    const allowed_fields = Object.keys(field_types);
    if(!allowed_fields.includes(filter_field)) {
        throw new ObjectInvalidQueryFilters("user");
    }
    if(isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new ObjectInvalidQueryFilters("user");
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = generate_filter(field_types, filter_field, filter_value);
    const skip = (page - 1) * limit;
    const users = await user_repository.filter_users(filter, skip, limit);
    const total_users = await user_repository.count_users();
    const total_pages = Math.ceil(total_users / limit);
    return {
        data: users,
        pagination: {
            totalItems: total_users,
            totalPages: total_pages,
            currentPage: page,
            pageSize: limit
        }
    };
}
/**
 * Retrieves a user by their ID.
 * 
 * @param {string} id - The ID of the user to retrieve.
 * 
 * @throws {ObjectNotFound} If no user is found with the provided ID.
 * @returns {Object} The user object.
 */
export const get_user_by_id = async (id) => {
    const user_exists = await user_repository.find_user_by_id(id);
    if(!user_exists) {
        throw new ObjectNotFound("user");
    }
    return user_exists;
}
/**
 * Updates the information of an existing user.
 * 
 * @param {string} id - The ID of the user to update.
 * @param {Object} updates - The fields to update and their new values.
 * 
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If no user is found with the provided ID.
 * @throws {ObjectAlreadyExists} If another user exists with the same username or email.
 * @returns {Object} The updated user object.
 */
export const update_user = async (id, updates) => { 
    if(!id) {
        throw new ObjectMissingParameters("user");
    }
    const user_exists_id = await user_repository.find_user_by_id(id);
    const user_exists = await user_repository.filter_users({['username']: new RegExp(updates.name, 'i'), ['email']: new RegExp(updates.email, 'i')}, 0, 10);

    if(!user_exists_id){
        throw new ObjectNotFound("user");
    }
    if( (user_exists.length != 0) && (user_exists[0]._id.toString() != id) ) {
        throw new ObjectAlreadyExists("user");
    }
    return await user_repository.update_user(id, updates);
}
/**
 * Updates a user's password, verifying the old password before setting a new one.
 *
 * @param {string} id - The ID of the user.
 * @param {string} old_password - The user's current password.
 * @param {string} new_password - The new password to set for the user.
 * @throws {ObjectMissingParameters} If any of the parameters are missing.
 * @throws {ObjectNotFound} If the user with the given ID is not found.
 * @throws {InvalidPasswordReset} If the old password does not match the stored password.
 * @returns {Promise<Object>} The updated user data after the password is updated.
 */
export const update_password = async (id, old_password, new_password) => {
    if(!id || !old_password || !new_password) {
        throw new ObjectMissingParameters("user");
    }
    const user_data = await user_repository.find_user_by_id(id);
    if(!user_data) {
        throw new ObjectNotFound("user");
    }
    const password_match = await bcrypt.compare(old_password, user_data.password);
    if(!password_match) {
        throw new InvalidPasswordReset();
    }
    user_data.password = new_password;
    return await user_repository.update_user(id, user_data);
}
/**
 * Deletes a user by their ID.
 * 
 * @param {string} id - The ID of the user to delete.
 * 
 * @throws {ObjectMissingParameters} If the ID is not provided.
 * @throws {ObjectNotFound} If no user is found with the provided ID.
 * @returns {void} 
 */
export const delete_user = async (id) => {
    if(!id) {
        throw new ObjectMissingParameters("user");
    }
    
    const user_exists = await user_repository.find_user_by_id(id);

    if(!user_exists){
        throw new ObjectNotFound("user");
    }
    return await user_repository.delete_user(id);
}