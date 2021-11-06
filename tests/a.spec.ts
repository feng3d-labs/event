import { ok } from 'assert';

describe('dom', () =>
{
    it('canvas', () =>
    {
        const canvas = document.createElement('canvas');
        const webgl = canvas.getContext('webgl');

        ok(!!webgl);
    });
});
