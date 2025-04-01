// Import model
import * as notification_model from './notification.model.js';

// Create notification
export const create_notification = async (notification_data) => {
    const new_notification = new notification_model.notification(notification_data);
    return await new_notification.save();
}

// Fetch all
export const find_all_notifications = async (skip, limit) => {
    return await notification_model.notification.find().skip(skip).limit(limit).populate('sender receiver');
}

// Fetch with filters
export const filter_notifications = async (filter, skip, limit) => {
    return await notification_model.notification.find(filter).skip(skip).limit(limit).populate('sender receiver');
}

// Count notifications
export const count_notifications = async () => {
    return await notification_model.notification.countDocuments();
}

// Fetch by ID
export const find_notification_by_id = async (id) => {
    return await notification_model.notification.findById(id).populate('sender receiver') || null;
}

// Update notification
export const update_notification = async (id, updates) => {
    return await notification_model.notification.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete notification
export const delete_notification = async (id) => {
    return await notification_model.notification.findByIdAndDelete(id);
}