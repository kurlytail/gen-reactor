import { execSync } from 'child_process';

describe('# integration test', () => {
    beforeEach(() => {
        execSync('rm -rf testoutput');
    });

    it('## should print help options', () => {
        let output = execSync('npm run build').toString();
        output = execSync('sgen -g `pwd`/dist/pom.min.js -h').toString();
        expect(output).toMatchSnapshot();
    });
    
    it('## should generate design and run pom commands with reactor extensions', () => {
        let output = execSync(
            'sgen -g pom -g `pwd`/dist/reactor.min.js -d src/test/fixture/design.json -o testoutput'
        ).toString();
        output = output.replace(/info: Loaded generator .*reactor.min.js.*/, '');
        output = output
            .replace(/warn: Please cherrypick changes from master-sgen-generated from .*/, '')
            .replace(/info: git cherry-pick .*/, '');
        expect(output).toMatchSnapshot();
        execSync('npm install', { cwd: 'testoutput', stdio: 'inherit' });
        execSync('npm run lint', { cwd: 'testoutput', stdio: 'inherit' });
        execSync('mvn compile', { cwd: 'testoutput', stdio: 'inherit' });
    });
});
