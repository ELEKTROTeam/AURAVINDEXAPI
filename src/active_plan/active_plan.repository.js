// Import model
import * as active_plan_model from './active_plan.model.js';
import * as plan_status_repository from '../plan_status/plan_status.repository.js';

// Create active plan
export const create_active_plan = async (active_plan_data) => {
    const new_active_plan = new active_plan_model.active_plan(active_plan_data);
    return await new_active_plan.save();
}

// Fetch all
export const find_all_active_plans = async (skip, limit) => {
    return await active_plan_model.active_plan.find().skip(skip).limit(limit).populate('plan user plan_status');
}

// Fetch with filters
export const filter_active_plans = async (filter, skip, limit) => {
    return await active_plan_model.active_plan.find(filter).skip(skip).limit(limit).populate('plan user plan_status');
}

// Count active_plans
export const count_active_plans = async () => {
    return await active_plan_model.active_plan.countDocuments();
}

// Fetch by ID
export const find_active_plan_by_id = async (id) => {
    return await active_plan_model.active_plan.findById(id).populate('plan user plan_status') || null;
}

// Fetch by finish and start date
export const find_active_plan_by_date = async (user_id, start_date, finish_date) => {
    const plan_status_exists = await plan_status_repository.filter_plan_statuses({name: 'ACTIVE'});
    return await active_plan_model.active_plan.findOne({
        user: user_id,
        plan_status: plan_status_exists[0]._id,
        $or: [
            {createdAt: {$lte: start_date}, return_date: {$gte: finish_date}},
            {createdAt: {$lte: start_date}, returned_date: {$gte: finish_date}}
        ]
    }).populate('plan user plan_status') || null;
}

// Update active plan
export const update_active_plan = async (id, updates) => {
    return await active_plan_model.active_plan.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete active plan
export const delete_active_plan = async (id) => {
    return await active_plan_model.active_plan.findByIdAndDelete(id);
}