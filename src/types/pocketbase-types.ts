/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
    Lessons = "lessons",
    Modules = "modules",
    Posts = "posts",
    UserLessons = "user_lessons",
    UserModules = "user_modules",
    Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
    id: RecordIdString;
    created: IsoDateString;
    updated: IsoDateString;
    collectionId: string;
    collectionName: Collections;
    expand?: T;
};

export type AuthSystemFields<T = never> = {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export enum LessonsGradeOptions {
    "novice" = "novice",
    "beginner" = "beginner",
    "intermediate" = "intermediate",
    "advanced" = "advanced",
}
export type LessonsRecord = {
    cover_image?: string;
    description?: string;
    grade?: LessonsGradeOptions;
    modules?: RecordIdString[];
    name?: string;
    objective?: string;
};

export type ModulesRecord = {
    content?: HTMLString;
    duration?: number;
    lesson?: RecordIdString;
    title?: string;
    video_url?: string;
};

export type PostsRecord = {
    file?: string;
    owner?: RecordIdString;
    title?: string;
};

export type UserLessonsRecord = {
    lesson?: RecordIdString;
    user?: RecordIdString;
};

export type UserModulesRecord = {
    completed?: boolean;
    completed_at?: IsoDateString;
    module?: ModulesRecord;
    user?: RecordIdString;
};

export enum UsersRoleOptions {
    "user" = "user",
    "super-user" = "super-user",
    "admin" = "admin",
}
export type UsersRecord = {
    avatar?: string;
    name?: string;
    role?: UsersRoleOptions;
};

// Response types include system fields and match responses from the PocketBase API
export type LessonsResponse<Texpand = unknown> = Required<LessonsRecord> &
    BaseSystemFields<Texpand>;
export type ModulesResponse<Texpand = unknown> = Required<ModulesRecord> &
    BaseSystemFields<Texpand>;
export type PostsResponse<Texpand = unknown> = Required<PostsRecord> &
    BaseSystemFields<Texpand>;
export type UserLessonsResponse<Texpand = unknown> =
    Required<UserLessonsRecord> & BaseSystemFields<Texpand>;
export type UserModulesResponse<Texpand = unknown> =
    Required<UserModulesRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
    AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
    lessons: LessonsRecord;
    modules: ModulesRecord;
    posts: PostsRecord;
    user_lessons: UserLessonsRecord;
    user_modules: UserModulesRecord;
    users: UsersRecord;
};

export type CollectionResponses = {
    lessons: LessonsResponse;
    modules: ModulesResponse;
    posts: PostsResponse;
    user_lessons: UserLessonsResponse;
    user_modules: UserModulesResponse;
    users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
    collection(idOrName: "lessons"): RecordService<LessonsResponse>;
    collection(idOrName: "modules"): RecordService<ModulesResponse>;
    collection(idOrName: "posts"): RecordService<PostsResponse>;
    collection(idOrName: "user_lessons"): RecordService<UserLessonsResponse>;
    collection(idOrName: "user_modules"): RecordService<UserModulesResponse>;
    collection(idOrName: "users"): RecordService<UsersResponse>;
};
