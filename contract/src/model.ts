import {near, UnorderedMap} from 'near-sdk-js';

export class Project {
    name: string;
    created: string;
    wallets: UnorderedMap;

    constructor({ projectName }: { projectName: string }) {
        this.name = projectName;
        this.created = near.blockTimestamp().toString();
        this.wallets = new UnorderedMap(projectName);
    }
}


export class VerifiedWallet {
    address: string
    created: string;

    constructor({ address }: { address: string }) {
        this.address = address;
        this.created = near.blockTimestamp().toString();
    }
}