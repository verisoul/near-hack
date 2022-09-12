import {NearBindgen, call, view, UnorderedMap} from 'near-sdk-js';
import {Project, VerifiedWallet} from "./model";
import {
    isAuthorized,
    assert,
    isEquals,
    PROJECT_NOT_FOUND_ERR,
    PROJECT_ALREADY_EXISTS_ERR,
    NOT_AUTHORIZED
} from "./utils";

@NearBindgen({})
class Verisoul {
    projects: UnorderedMap = new UnorderedMap('verisoul-projects');

    @call({})
    create_project({projectName}: { projectName: string }): boolean {
        if (!isAuthorized()) throw new Error(NOT_AUTHORIZED);

        const project = this.projects.get(projectName);
        if (project) throw new Error(PROJECT_ALREADY_EXISTS_ERR);

        const newProject = new Project({projectName});
        this.projects.set(projectName, newProject);

        return assert(isEquals(this.projects.get(projectName), newProject), "Error saving value");
    }

    @call({})
    delete_project({projectName}: { projectName: string }): boolean {
        if (!isAuthorized()) throw new Error(NOT_AUTHORIZED);

        const project = this.projects.get(projectName);
        if (!project) throw new Error(PROJECT_NOT_FOUND_ERR);

        this.projects.remove(projectName);

        return assert(this.projects.get(projectName) === null, "Error removing value");
    }

    @call({})
    add_verified_wallet({projectName, address}: { projectName: string, address: string }) {
        if (!isAuthorized()) throw new Error(NOT_AUTHORIZED);

        const verifWallet = new VerifiedWallet({address});

        const project = <Project> this.projects.get(projectName);
        if (!project) throw new Error(PROJECT_NOT_FOUND_ERR);

        const _wallets = UnorderedMap.deserialize(project.wallets);
        _wallets.set(address, verifWallet);

        // Worked with Pagoda to address potential bug where UnordereMap in a
        // nested collection was being updated but metadata (length) was not.
        // Fix requires code to "write back" new UnorderedMap state
        project.wallets = _wallets;
        this.projects.set(projectName, project);

        return assert(isEquals(_wallets.get(address), verifWallet), "Error saving value");
    }

    @call({})
    remove_verified_wallet({projectName, address}: { projectName: string, address: string }): boolean {
        if (!isAuthorized()) throw new Error(NOT_AUTHORIZED);

        const project = <Project> this.projects.get(projectName);
        if (!project) throw new Error(PROJECT_NOT_FOUND_ERR);

        const _wallets = UnorderedMap.deserialize(project.wallets);
        _wallets.remove(address);

        project.wallets = _wallets;
        this.projects.set(projectName, project);

        return assert(_wallets.get(address) == null, "Error removing value");
    }

    @view({})
    get_wallets({projectName}: { projectName: string }): Array<string> {
        const project = <Project> this.projects.get(projectName);
        if (!project) throw new Error(PROJECT_NOT_FOUND_ERR);

        let walletArray: Array<string> = [];
        const _wallets = UnorderedMap.deserialize(project.wallets);

        for (let i = 0; i < _wallets.length; i++ ) {
            const key = <string> _wallets.keys.get(i);
            walletArray.push(key);
        }

        return walletArray;
    }

    @view({})
    is_wallet_verified({projectName, address}: { projectName: string, address: string }): boolean {
        const project = <Project> this.projects.get(projectName);
        if (!project) throw new Error(PROJECT_NOT_FOUND_ERR);

        const _wallets = UnorderedMap.deserialize(project.wallets);

        if (_wallets.get(address) == null) {
            return false;
        }
        return true;
    }
}


