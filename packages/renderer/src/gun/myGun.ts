//https://github.com/rococtz/gun_examples/tree/master/index_by_gender
//https://codesandbox.io/s/react-playground-forked-631nt?file=/index.js:971-1248

import "gun/lib/load";
import "gun/lib/open";
import "gun/sea";

import * as types from "/@/store/models";
import { globalDict } from "/@/store/memory"
import { functions } from "/@/store/functions"
import { reactive } from "vue";

const gun = globalDict.gun

const dbName = "myBooks"
const tableName = "test"
const gunVariables = reactive({ isReceiving: false })

export const addOneRandomData = () => {
    const timeString = new Date().toISOString()
    const randomId = `the_fake_id_${timeString}`;
    const randomLink = `the_fake_link_${timeString}`;
    const nodeReference = gun
        .get(dbName)
        .get(tableName)
        .get(randomId)
        .put({ title: randomId, author: "yingshaoxo", link: randomId } as types.BookModel);
};

export const getAllData = (callbackFunction: (item: types.BookModel[]) => Promise<void>) => {
    gun.get(dbName).get(tableName).load((data) => {
        if (data) {
            const books = Object.values(data)
                // filter out deleted values which will appear as null
                .filter((item: types.BookModel | unknown) => !!item);

            functions.basic.runAsyncFunction(async () => {
                await callbackFunction(books as types.BookModel[]);
            })
        } else {
            functions.basic.runAsyncFunction(async () => {
                await callbackFunction([] as types.BookModel[]);
            })
        }
    });
}

function dec2hex(dec: number) {
    return dec.toString(16).padStart(2, "0")
}

export const getARandomID = (len: number = 16) => {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

export const addABook = (book: types.BookModel) => {
    const timeString = new Date().toISOString()
    const randomId = getARandomID();
    const nodeReference = gun
        .get(dbName)
        .get(tableName)
        .get(randomId)
        .put({ id: randomId, title: book.title, author: book.author, link: book.link } as types.BookModel);
};

export const clearTheTable = () => {
    gun.get(dbName).get(tableName).put(null);
}

export const listenToTheTable = (callbackFunction: (item: types.BookModel) => Promise<void>) => {
    if (gunVariables.isReceiving == false) {
        gun.get(dbName).get(tableName).map().on(function (data: types.BookModel) {
            // console.log("new data: ", data)
            if (data) {
                functions.basic.runAsyncFunction(async () => {
                    await callbackFunction(data);
                })
            }
        });
        gunVariables.isReceiving = true
    }
}

export const stopListening = () => {
    // coming on this stream after the component is unmounted
    gun.get(dbName).get(tableName).off();
    gunVariables.isReceiving = false;
}

export const searchBooks = (searchKey: string, callbackFunction: (item: types.BookModel[]) => Promise<void>) => {
    gun
        .get(dbName)
        .get(tableName)
        .get({ ".": { "*": searchKey } }) // match anykey that start with searchKey
        .load((data) => {
            if (data) {
                const filteredBooks = Object.values(data)
                    // filter out deleted values which will appear as null
                    .filter((item: types.BookModel) => !!item && !!item.title);

                functions.basic.runAsyncFunction(async () => {
                    await callbackFunction(filteredBooks)
                })
            }
        });
};