import "gun/lib/load";
import "gun/lib/open";
import "gun/sea";

import * as types from "/@/store/models";
import { globalDict } from "/@/store/memory"


const gun = globalDict.gun

const tableName = "myBooks"

export const addOneRandomData = () => {
    const randomId = `the_fake_link_${Date.now()}`;
    const randomLink = `the_fake_link_${Date.now()}`;
    const nodeReference = gun
        .get(tableName)
        .get(randomId)
        .put({ name: randomId, author: "yingshaoxo", link: randomId } as types.BookModel);

    // const animalIndexNode = gun.get("myAnimalsTextIndex");

    // name.split(/\s{1,}/gi).forEach((part) => {
    //     animalIndexNode.get(part).get(randomId).put(nodeReference);
    // });
};

export const searchBooks = (searchKey: string, callbackFunction: (item: types.BookModel[]) => Promise<void>) => {
    gun
        .get(tableName)
        .get({ ".": { "*": searchKey } })
        .load((data) => {
            const filteredBooks = Object.values(data)
                // filter out deleted values which will appear as null
                .filter((item: types.BookModel) => !!item && !!item.name);
            (async () => {
                await callbackFunction(filteredBooks)
            })();
        });
    // gun
    //     .get(tableName)
    //     .get({ ".": { "*": searchKey } })
    //     .load((data) => {
    //         const filteredBooks = Object.values(data)
    //             // filter out deleted values which will appear as null
    //             .filter((item: types.BookModel) => !!item && !!item.name);
    //         (async () => {
    //             await callbackFunction(filteredBooks)
    //         })();
    //     });
};

export const stopSearch = () => {
    // coming on this stream after the component is unmounted
    gun.get(tableName).off();
}