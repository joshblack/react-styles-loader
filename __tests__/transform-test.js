jest.autoMockOff();

require('core-js');

import transform from '../src/transform';

describe('transform', function() {
    it('should be able to transform simple declarations', function () {
        const simpleStyles = `
          foo {
            background: #000000;
          }
        `;

        const simpleTransform = 'module.exports=' + JSON.stringify({
            'foo': {
                'background': '#000000'
            }
        });

        expect(transform(simpleStyles)).toEqual(simpleTransform);
    });

    it('should be able to transform nested declarations', function() {
        const nestedStyles = `
          foo {
            background: #000000;

            bar {
                background: #333333;
            }
          }
        `;

        const nestedTransform = 'module.exports=' + JSON.stringify({
            'foo': {
                'background': '#000000',
                'bar': {
                    'background': '#333333'
                }
            }
        });

        expect(transform(nestedStyles)).toEqual(nestedTransform);
    });

    it('should properly prefix flexbox', function () {
        const flexStyles = `
            foo {
                display: flex;
            }
        `;

        const flexTransform = 'module.exports=' + JSON.stringify({
            'foo': {
                'display': ['-webkit-box', '-webkit-flex', '-ms-flexbox', 'flex']
            }
        });

        expect(transform(flexStyles)).toEqual(flexTransform);
    });

    it('should properly prefix transition', function() {
        const transitionStyles = `
            foo {
                transition: 0.2s all;
            }
        `;

        const transitionTransform = 'module.exports=' + JSON.stringify({
            'foo': {
                'WebkitTransition': '0.2s all',
                'transition': '0.2s all'
            }
        });

        expect(transform(transitionStyles)).toEqual(transitionTransform);
    })
})