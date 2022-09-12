import {near} from "near-sdk-js";

export function isAuthorized(): boolean {
    return near.predecessorAccountId() == 'verisoul-bot.near' || near.predecessorAccountId() == 'nketkar.test.near';
}

export function assert(condition, message) {
    if (!condition) {
        near.panicUtf8(message);
        return false;
    }
    return true;
}

export function isEquals(object1, object2) {
    return JSON.stringify(object1) == JSON.stringify(object2);
}

export const PROJECT_NOT_FOUND_ERR = 'Project not found';
export const PROJECT_ALREADY_EXISTS_ERR = 'Project already exists';
export const NOT_AUTHORIZED = 'Not authorized to call function';