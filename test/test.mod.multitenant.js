// ================================================================================
//  Frostybot Unit Tests: Multi-Tenant Module (mod.multitenant.js)
// ================================================================================

// Load all modules

const core_test = require('../core/core.test');
const test = new core_test();

// Load Unit Test Modules

var chai = require('chai');
var expect = chai.expect

// Unit Test Definitions


describe(test.title('Multi-Tenant Module (mod.multitenant.js)'), function() {

    // is_enabled()

    describe(test.function('is_enabled'), function() {
        it('should return true in multitenancy is enabled', async function() {
            var save = await test.settings.set('core', 'multitenant:enabled', false);
            await test.settings.set('core', 'multitenant:enabled', true);
            var val = await test.multitenant.is_enabled();
            await test.settings.set('core', 'multitenant:enabled', save);
            expect(val).to.equal(true);
        });
        it('should return false in multitenancy is disabled', async function() {
            var save = await test.settings.set('core', 'multitenant:enabled', false);
            await test.settings.set('core', 'multitenant:enabled', false);
            var val = await test.multitenant.is_enabled();
            await test.settings.set('core', 'multitenant:enabled', save);
            expect(val).to.equal(false);
        });
        
    });

    // enable()

    describe(test.function('enable'), function() {
        it('should return master user uuid in once multitenancy is enabled', async function() {
            var save = await test.settings.get('core', 'multitenant:enabled', false);
            var url = await test.settings.get('core', 'auth:url', '_');
            var clientid = await test.settings.get('core', 'auth:clientid', '_');
            var secret = await test.settings.get('core', 'auth:secret', '_');
            var uuid = await test.encryption.core_uuid();
            var result = await test.database.select('tenants', {uuid: uuid});
            var email = result.length == 1 ? result[0].email : '_';
            await test.settings.set('core', 'multitenant:enabled', false);
            var val = await test.multitenant.enable({email: email, url: url, clientid: clientid, secret: secret});
            await test.settings.set('core', 'multitenant:enabled', save);
            expect(val).to.be.a('string').that.has.length(36);
        });        
    });

    // disable()

    describe(test.function('disable'), function() {
        it('should return true in once multitenancy is disabled', async function() {
            var save = await test.settings.set('core', 'multitenant:enabled', false);
            await test.settings.set('core', 'multitenant:enabled', false);
            var val = await test.multitenant.disable();
            await test.settings.set('core', 'multitenant:enabled', save);
            expect(val).to.equal(true);
        });        
    });

    // add()

    describe(test.function('add'), function() {
        it('should return user uuid once the tenant is added', async function() {
            var val = await test.multitenant.add({email: 'unittest@frostybot.io'});
            expect(val).to.be.a('string').that.has.length(36);
        });        
    });

    // delete()

    describe(test.function('delete'), function() {
        it('should return true once the tenant is deleted', async function() {
            var uuid = await test.multitenant.add({email: 'unittest@frostybot.io'});
            var val = await test.multitenant.delete({uuid: uuid});
            expect(val).to.equal(true);
        });        
        it('should return false if tenant does not exist', async function() {
            var val = await test.multitenant.delete({uuid: 'noexistant'});
            expect(val).to.equal(false);
        });        
    });



});
