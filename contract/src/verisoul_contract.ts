import {NearBindgen, near, call, view, UnorderedMap, Bytes, Vector, LookupMap} from 'near-sdk-js';
import {Project, VerifiedWallet} from "./model";
import {isAuthorized, assert, PROJECT_NOT_FOUND_ERR, PROJECT_ALREADY_EXISTS_ERR, isEquals} from "./utils";

@NearBindgen({})
class Verisoul {
    projects: UnorderedMap = new UnorderedMap('verisoul-projects');

    @call({})
    test() {
        const project = <Project> this.projects.get('Test_Project2');

        const _wallets = UnorderedMap.deserialize(project.wallets);
        return this.projects.keys;
    }

    @call({})
    test2() {
        let retVal: Array<string> = [];
        for (let i = 0; i < this.projects.keys.length; i++ ) {
            const key = <string> this.projects.keys.get(i);
            retVal.push(key);
        }
        return retVal;
    }

    @call({})
    test3() {
        const project = <Project> this.projects.get('Test_Project2');

        const _wallets = UnorderedMap.deserialize(project.wallets);
        return _wallets.length;
    }

    @call({})
    test5() {
        const project = <Project> this.projects.get('Test_Project2');

        const _wallets = UnorderedMap.deserialize(project.wallets);
        return Vector.deserialize(_wallets.keys);
    }

    @call({})
    test6() {
        const project = <Project> this.projects.get('Test_Project2');

        const _wallets = UnorderedMap.deserialize(project.wallets);
        return LookupMap.deserialize(_wallets.values);
    }

    @call({})
    test4() {
        const project = <Project> this.projects.get('Test_Project2');

        const _wallets = UnorderedMap.deserialize(project.wallets);
        const it = _wallets[Symbol.iterator]();
        let vec = new Vector('unique-id-vector1');

        for (let i = 0; i < _wallets.length; i++) {
            vec.push(it.next());
        }

        return vec.serialize();
    }

    @call({})
    create_project({projectName}: { projectName: string }): boolean {
        if (!isAuthorized()) near.panicUtf8('not authorized');

        const project = this.projects.get(projectName);
        if (project) {
            near.panicUtf8(PROJECT_ALREADY_EXISTS_ERR);
            return
        }

        const newProject = new Project({projectName});
        this.projects.set(projectName, newProject);

        return assert(isEquals(this.projects.get(projectName), newProject), "Error saving value");
    }

    @call({})
    delete_project({projectName}: { projectName: string }): boolean {
        if (!isAuthorized()) near.panicUtf8('not authorized');

        const project = this.projects.get(projectName);
        if (!project) {
            near.panicUtf8(PROJECT_NOT_FOUND_ERR);
            return
        }

        this.projects.remove(projectName);

        return assert(this.projects.get(projectName) === null, "Error removing value");
    }

    @call({})
    add_verified_wallet({projectName, address}: { projectName: string, address: string }) {
        if (!isAuthorized()) near.panicUtf8('not authorized');

        const verifWallet = new VerifiedWallet({address});

        const project = <Project> this.projects.get(projectName);
        if (!project) {
            near.panicUtf8(PROJECT_NOT_FOUND_ERR);
            return;
        }

        const _wallets = UnorderedMap.deserialize(project.wallets);
        _wallets.set(address, verifWallet);
        return typeof _wallets.get(address);

        return assert(isEquals(_wallets.get(address), verifWallet), "Error saving value");
    }

    @call({})
    remove_verified_wallet({projectName, address}: { projectName: string, address: string }): boolean {
        if (!isAuthorized()) near.panicUtf8('not authorized');

        const project = <Project> this.projects.get(projectName);
        if (!project) {
            near.panicUtf8(PROJECT_NOT_FOUND_ERR);
            return;
        }

        const _wallets = UnorderedMap.deserialize(project.wallets);
        _wallets.remove(address);

        return assert(_wallets.get(address) == null, "Error removing value");
    }

    @view({})
    get_wallets({projectName}: { projectName: string }): [Bytes, unknown][] {
        const project = <Project> this.projects.get(projectName);
        if (!project) {
            near.panicUtf8(PROJECT_NOT_FOUND_ERR)
            return null
        }

        const _wallets = UnorderedMap.deserialize(project.wallets);

        return _wallets.toArray();
    }

    @view({})
    is_wallet_verified({projectName, address}: { projectName: string, address: string }): boolean {
        const project = <Project> this.projects.get(projectName);
        if (!project) {
            near.panicUtf8(PROJECT_NOT_FOUND_ERR)
            return;
        }

        const _wallets = UnorderedMap.deserialize(project.wallets);

        if (_wallets.get(address) == null) {
            return false;
        }
        return true;
    }
}


