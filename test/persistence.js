before(function(done) {
    require('../server').start();
    done();
});

describe('service: hello', function() {

    // Test #1
    describe('Check DB connection', function() {
        it('should get a 200 response', function(done) {
            client.get('/hello/nico', function(err, req, res, data) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (data.code != 200) {
                        throw new Error('invalid response from /hello/nico');
                    }
                    done();
                }
            });
        });
    });
    // Add more tests as needed...
});