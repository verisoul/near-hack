import {Polly} from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';

const startUnitTests = () => {

    Polly.register(XHRAdapter);

    const polly = new Polly('Mock', {
        adapters: ['xhr'],
    });
    const {server} = polly;

}

export default startUnitTests;