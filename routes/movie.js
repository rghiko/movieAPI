const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');

// Tüm dataları listelemek
router.get('/', (req, res) => {
    const promise = Movie.aggregate([
      {
        $lookup: {
          from: 'directors',
          localField: 'director_id',
          foreignField: '_id',
          as: 'director'
        }
      },
      {
        $unwind: '$director'
      }
    
    ]);
    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
});

// top 10 listelemek
router.get('/top5', (req, res) => {
  const promise = Movie.find({ }).limit(5).sort({imdb_score: -1});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// ID ile data getirmek.
router.get('/:movie_id', (req, res, next) => {
    // res.send(req.params);
    const promise = Movie.findById(req.params.movie_id);
    promise.then((movie) => {
      if(!movie)
        next({message: 'Böyle bir film yok.', code: 99}); // Hata mesajı vermek.
      res.json(movie);
    }).catch((err) => {
      res.json(err);
    });
});

// ID içerik güncelleme
router.put('/:movie_id', (req, res, next) => {
  // res.send(req.params);
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
    {
      new: true
    }
);
  promise.then((movie) => {
    if(!movie)
      next({message: 'Böyle bir film yok.', code: 99}); // Hata mesajı vermek.
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


// ID ile silme işlemi
router.delete('/:movie_id', (req, res, next) => {
  // res.send(req.params);
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((movie) => {
    if(!movie)
      next({message: 'Böyle bir film yok.', code: 99}); // Hata mesajı vermek.
    res.json({status: 1});
  }).catch((err) => {
    res.json(err);
  });
});


// Between iki tarih arası
router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
   }
   );
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

/* GET Movie listing. */
router.post('/', (req, res, next) => {
  // const { title, imdb_score, category, country, year }  = req.body;
  
  const movie = new Movie(req.body);
    /* {
    title: title,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  } */

const promise = movie.save();

      promise.then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });





/*  movie.save((err, data) => {
    if (err)
      res.json(err);

  res.json(data); 
  });
*/

});

module.exports = router;
