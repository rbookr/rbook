import nedb from 'nedb';
declare class Data {
    parent: bookSystem;
    db: nedb;
    constructor(parent: bookSystem);
    /**
     * @description 更新,不存在就加入
     * */
    update(doc: document): Promise<unknown>;
    findOne_by_id(_id: string): Promise<unknown>;
    count(query: any): Promise<unknown>;
    /** pagenation */
    pagenation(query: any, page: number, pageSize: number): Promise<unknown>;
}
export default Data;