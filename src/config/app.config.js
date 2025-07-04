import dotenv from 'dotenv';

if(process.env.NODE_ENV === 'test') {
    dotenv.config({path: '.env.test'});
} else {
    dotenv.config();
}

export const app_config = {
    port: process.env.SERVER_PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    app_main_domain: process.env.APP_MAIN_DOMAIN,
    app_admin_email: process.env.APP_ADMIN_EMAIL,
    app_admin_password: process.env.APP_ADMIN_PASSWORD,
    app_support_email: process.env.APP_SUPPORT_EMAIL,
    admin_gmail_email: process.env.ADMIN_GMAIL_EMAIL,
    admin_gmail_password: process.env.ADMIN_GMAIL_PASSWORD,
    allow_importing_default_data: process.env.ALLOW_IMPORTING_DEFAULT_DATA,
    sendgrid_api_key: process.env.SEND_GRID_TOKEN,
    fmc_server_key: process.env.FCM_SERVER_KEY,
    DEFAULT_BOOK_IMG_PATH: '/images/books/default.png',
    DEFAULT_ROOM_IMG_PATH: '/images/rooms/default.png',
    DEFAULT_USER_IMG_PATH: '/images/users/default.png',
    DEFAULT_PAGINATION_LIMIT: 10,
    ACTIVE_PLAN_MAX_SUSCRIPTION_DAYS: 30,
    AUTHOR_NAME_MAX_LENGTH: 50,
    AUTHOR_LAST_NAME_MAX_LENGTH: 50,
    BOOK_TITLE_MAX_LENGTH: 100,
    BOOK_ISBN_MAX_LENGTH: 30,
    BOOK_CLASSIFICATION_MAX_LENGTH: 25,
    BOOK_SUMMARY_MAX_LENGTH: 500,
    BOOK_LANGUAGE_MAX_LENGTH: 15,
    BOOK_EDITION_MAX_LENGTH: 10,
    BOOK_AGE_RESTRICTION_MAX_LENGTH: 10,
    BOOK_SAMPLE_MAX_LENGTH: 5,
    BOOK_LOCATION_MAX_LENGTH: 100,
    BOOK_COLLECTION_NAME_MAX_LENGTH: 20,
    BOOK_LIST_TITLE_MAX_LENGTH: 10,
    BOOK_LIST_DESCRIPTION_MAX_LENGTH: 300,
    BOOK_LIST_MAX_BOOKS: 50,
    EDITORIAL_NAME_MAX_LENGTH: 50,
    EDITORIAL_ADDRESS_MAX_LENGTH: 200,
    EDITORIAL_EMAIL_MAX_LENGTH: 50,
    FEE_TYPE_MESSAGE_MAX_LENGTH: 100,
    GENDER_NAME_MAX_LENGTH: 10,
    LOAN_MAX_RETURN_DAYS: 30,
    LOAN_MAX_RETURN_DAYS_AFTER_RENEWAL: 30,
    LOAN_MAX_ACTIVE_LOANS_PER_USER: 12,
    LOAN_MAX_RENEWALS_PER_LOAN: 5,
    NOTIFICATION_TITLE_MAX_LENGTH: 50,
    NOTIFICATION_MESSAGE_MAX_LENGTH: 500,
    NOTIFICATION_TYPE_MAX_LENGTH: 20,
    PLAN_NAME_MAX_LENGTH: 25,
    ROLE_NAME_MAX_LENGTH: 20,
    USER_ADDRESS_MAX_LENGTH: 500,
    USER_NAME_MAX_LENGTH: 30,
    USER_LAST_NAME_MAX_LENGTH: 30,
    USER_EMAIL_MAX_LENGTH: 50,
    USER_MIN_PASSWORD_LENGTH: 6,
    USER_BIOGRAPHY_MAX_LENGTH: 300,
    USER_MAX_RECENT_BOOKS_LOG: 10,
    USER_MAX_BOOK_LISTS: 10,
    WORKING_HOURS: {
        MONDAY_TO_FRIDAY: {
            start: "07:00",
            end: "20:00"
        },
        SATURDAY: {
            start: "08:00",
            end: "12:00"
        }
    },
    USER_MIN_AGE_REQUIRED: 16,
    USER_MAX_AGE_ALLOWED: 130,
    PERMISSIONS: {
        SIGNUP: 'SIGNUP',
        SIGNIN: 'SIGNIN',
        REQUEST_PASSWORD_RESET: 'REQUEST_PASSWORD_RESET',
        RESET_PASSWORD: 'RESET_PASSWORD',
        IMPORT_DEFAULT_DATA: 'IMPORT_DEFAULT_DATA',

        READ_ACTIVE_PLAN: 'READ_ACTIVE_PLAN',
        CREATE_ACTIVE_PLAN: 'CREATE_ACTIVE_PLAN',
        UPDATE_ACTIVE_PLAN: 'UPDATE_ACTIVE_PLAN',
        DELETE_ACTIVE_PLAN: 'DELETE_ACTIVE_PLAN',
        CANCEL_ACTIVE_PLAN: 'CANCEL_ACTIVE_PLAN',
        FINISH_ACTIVE_PLAN: 'FINISH_ACTIVE_PLAN',
        REQUEST_ACTIVE_PLAN_RENEWAL: 'REQUEST_ACTIVE_PLAN_RENEWAL',
        
        READ_AUDIT_LOG: 'READ_AUDIT_LOG',
        CREATE_AUDIT_LOG: 'CREATE_AUDIT_LOG',
        UPDATE_AUDIT_LOG: 'UPDATE_AUDIT_LOG',
        DELETE_AUDIT_LOG: 'DELETE_AUDIT_LOG',

        READ_AUTHOR: 'READ_AUTHOR',
        CREATE_AUTHOR: 'CREATE_AUTHOR',
        UPDATE_AUTHOR: 'UPDATE_AUTHOR',
        DELETE_AUTHOR: 'DELETE_AUTHOR',

        READ_BOOK: 'READ_BOOK',
        CREATE_BOOK: 'CREATE_BOOK',
        UPDATE_BOOK: 'UPDATE_BOOK',
        DELETE_BOOK: 'DELETE_BOOK',

        READ_BOOK_COLLECTION: 'READ_BOOK_COLLECTION',
        CREATE_BOOK_COLLECTION: 'CREATE_BOOK_COLLECTION',
        UPDATE_BOOK_COLLECTION: 'UPDATE_BOOK_COLLECTION',
        DELETE_BOOK_COLLECTION: 'DELETE_BOOK_COLLECTION',

        READ_BOOK_LIST: 'READ_BOOK_LIST',
        CREATE_BOOK_LIST: 'CREATE_BOOK_LIST',
        UPDATE_BOOK_LIST: 'UPDATE_BOOK_LIST',
        DELETE_BOOK_LIST: 'DELETE_BOOK_LIST',
        ADD_BOOK_TO_LIST: 'ADD_BOOK_TO_LIST',
        REMOVE_BOOK_FROM_LIST: 'REMOVE_BOOK_FROM_LIST',

        READ_BOOK_STATUS: 'READ_BOOK_STATUS',
        CREATE_BOOK_STATUS: 'CREATE_BOOK_STATUS',
        UPDATE_BOOK_STATUS: 'UPDATE_BOOK_STATUS',
        DELETE_BOOK_STATUS: 'DELETE_BOOK_STATUS',

        READ_EDITORIAL: 'READ_EDITORIAL',
        CREATE_EDITORIAL: 'CREATE_EDITORIAL',
        UPDATE_EDITORIAL: 'UPDATE_EDITORIAL',
        DELETE_EDITORIAL: 'DELETE_EDITORIAL',

        READ_FEE: 'READ_FEE',
        CREATE_FEE: 'CREATE_FEE',
        UPDATE_FEE: 'UPDATE_FEE',
        DELETE_FEE: 'DELETE_FEE',

        READ_FEE_STATUS: 'READ_FEE_STATUS',
        CREATE_FEE_STATUS: 'CREATE_FEE_STATUS',
        UPDATE_FEE_STATUS: 'UPDATE_FEE_STATUS',
        DELETE_FEE_STATUS: 'DELETE_FEE_STATUS',

        READ_FEE_TYPE: 'READ_FEE_TYPE',
        CREATE_FEE_TYPE: 'CREATE_FEE_TYPE',
        UPDATE_FEE_TYPE: 'UPDATE_FEE_TYPE',
        DELETE_FEE_TYPE: 'DELETE_FEE_TYPE',

        READ_GENDER: 'READ_GENDER',
        CREATE_GENDER: 'CREATE_GENDER',
        UPDATE_GENDER: 'UPDATE_GENDER',
        DELETE_GENDER: 'DELETE_GENDER',

        READ_LOAN: 'READ_LOAN',
        CREATE_LOAN: 'CREATE_LOAN',
        UPDATE_LOAN: 'UPDATE_LOAN',
        APPROVE_LOAN: 'APPROVE_LOAN',
        DELETE_LOAN: 'DELETE_LOAN',
        REQUEST_LOAN_RENEWAL: 'REQUEST_LOAN_RENEWAL',
        FINISH_LOAN: 'FINISH_LOAN',

        READ_LOAN_STATUS: 'READ_LOAN_STATUS',
        CREATE_LOAN_STATUS: 'CREATE_LOAN_STATUS',
        UPDATE_LOAN_STATUS: 'UPDATE_LOAN_STATUS',
        DELETE_LOAN_STATUS: 'DELETE_LOAN_STATUS',

        READ_LOG_ACTION: 'READ_LOG_ACTION',
        CREATE_LOG_ACTION: 'CREATE_LOG_ACTION',
        UPDATE_LOG_ACTION: 'UPDATE_LOG_ACTION',
        DELETE_LOG_ACTION: 'DELETE_LOG_ACTION',

        READ_NOTIFICATION: 'READ_NOTIFICATION',
        CREATE_NOTIFICATION: 'CREATE_NOTIFICATION',
        CREATE_NOTIFICATIONS_FOR_ALL_USERS: 'CREATE_NOTIFICATIONS_FOR_ALL_USERS',
        UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
        DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
        MARK_NOTIFICATION_AS_READ: 'MARK_NOTIFICATION_AS_READ',

        READ_PLAN: 'READ_PLAN',
        CREATE_PLAN: 'CREATE_PLAN',
        UPDATE_PLAN: 'UPDATE_PLAN',
        DELETE_PLAN: 'DELETE_PLAN',

        READ_PLAN_STATUS: 'READ_PLAN_STATUS',
        CREATE_PLAN_STATUS: 'CREATE_PLAN_STATUS',
        UPDATE_PLAN_STATUS: 'UPDATE_PLAN_STATUS',
        DELETE_PLAN_STATUS: 'DELETE_PLAN_STATUS',

        READ_RECENT_BOOK: 'READ_RECENT_BOOK',
        CREATE_RECENT_BOOK: 'CREATE_RECENT_BOOK',
        UPDATE_RECENT_BOOK: 'UPDATE_RECENT_BOOK',
        DELETE_RECENT_BOOK: 'DELETE_RECENT_BOOK',

        READ_ROLE: 'READ_ROLE',
        CREATE_ROLE: 'CREATE_ROLE',
        UPDATE_ROLE: 'UPDATE_ROLE',
        DELETE_ROLE: 'DELETE_ROLE',
        ADD_PERMISSION_TO_ROLE: 'ADD_PERMISSION_TO_ROLE',
        REMOVE_PERMISSION_FROM_ROLE: 'REMOVE_PERMISSION_FROM_ROLE',

        READ_USER: 'READ_USER',
        CREATE_USER: 'CREATE_USER',
        UPDATE_USER: 'UPDATE_USER',
        DELETE_USER: 'DELETE_USER',
    },
    BLACKLISTED_WORDS: [

    ]
}
