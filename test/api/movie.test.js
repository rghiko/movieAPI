const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token, movieId;

describe('/api/movies tests', () => {
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({username: 'hiko', password: '159753'})
            .end((err, res) => {
                token = res.body.token;
                done();
            })
    });

// GET movies
    describe('/GET movies', () => {
        it('it should be get all the movies', (done) => {
            chai.request(server)
            .get('/api/movies')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
  
// POST movie
describe('/POST movie', () => {
    it('it should be POST a movie', (done) => {
        const movie = {
            title           : 'Birleşik',
            director_id     : '5c59a70f39bb2b37a45dcabb',
            category        : 'Ruh',
            country         : 'Türkiye',
            year            : 1900,
            imdb_score      : 8
        };
        chai.request(server)
            .post('/api/movies')
            .send(movie)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('director_id');
                res.body.should.have.property('category');
                res.body.should.have.property('country');
                res.body.should.have.property('year');
                res.body.should.have.property('imdb_score');
                movieId = res.body._id;
                done();
            });
    });
});

// GET directör id movie
describe('/GET/:movie_id movies', () => {
    it('it should be get movie by director id', (done) => {
        chai.request(server)
        .get('/api/movies/'+ movieId)
        .set('x-access-token', token)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('director_id');
            res.body.should.have.property('category');
            res.body.should.have.property('country');
            res.body.should.have.property('year');
            res.body.should.have.property('_id').eql(movieId);
            done();
        });
    });
});

// PUT director id
describe('/PUT Director id', () => {
    it('it should UPDATE a movie given by id', (done) => {
        const movie = {
            title           : '93Creative',
            director_id     : '5c19a70f39bb2b37a45dcabb',
            category        : 'Suç',
            country         : 'Fransa',
            year            : 1970,
            imdb_score      : 9
        };
        chai.request(server)
            .put('/api/movies/'+ movieId)
            .send(movie)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title').eql(movie.title);
                res.body.should.have.property('director_id').eql(movie.director_id);
                res.body.should.have.property('category').eql(movie.category);
                res.body.should.have.property('country').eql(movie.country);
                res.body.should.have.property('year').eql(movie.year);
                res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                
                done();
            });
    });
});


// DELETE MOVIE
describe('/DELETE Movie', () => {
    it('it should delete movie', (done) => {
        chai.request(server)
            .delete('/api/movies/'+ movieId)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);
                done();
            });
    });
});

});