var app = new Vue({
   el: "#app",
   data: {
      // search input
      showSearchInput: false,
      inputBarStyle: '',
      inputStyle: '',
      query: '',

      showTvs: true,
      showMovies: true,

      selectedGenre: '',

      // api key
      api_key: 'c83d5b0ca913b3248c9aae55239316fc',

      // urls
      posterUrl: 'https://image.tmdb.org/t/p/w342',
      // movies
      selectedMovies: [],
      // tvShows
      selectedTv: [],

      genreNames: [],
      genreIds: [],

      isHome: true,
      isTv: false,
      isMovie: false

   },
   methods: {
      toggleInput() {
         this.showSearchInput = !this.showSearchInput;
         // change search bar style
         this.inputBarStyle = '';
         if (this.showSearchInput) {
            this.inputBarStyle = 'inputBarStyle';
            this.inputStyle = 'inputStyle';
         }
      },
      search() {
         //searchMovies
         this.getMovies('https://api.themoviedb.org/3/search/movie?', 1);
         // search tv shows
         this.getTvs('https://api.themoviedb.org/3/search/tv?', 1);
         this.selectedGenre = '';
      },
      getMovies( movieApi, page) {
         axios.get(movieApi, {
            params: {
               api_key: this.api_key,
               query: this.query,
               page: page
            }
         }).then(res => {
            var movies = [];
            res.data.results.forEach(movie => {

               var cast = [];
               axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?`, {
                  params: {
                     api_key: this.api_key
                  }
               }).then(res => {

                  res.data.cast.slice(0,6).forEach(person => {
                     cast.push(person.name);
                  });
                  movie.cast = cast.toString();
                  movies.push(movie);
                  this.selectedMovies = movies;
               })
            })
         });
      },
      getTvs(tvApi, page) {
         axios.get(tvApi, {
            params: {
               api_key: this.api_key,
               query: this.query,
               page: page
            }
         }).then(res => {
            var tvs = [];
            res.data.results.forEach(tv => {

               // create movie cast
               var cast = [];
               axios.get(`https://api.themoviedb.org/3/tv/${tv.id}/credits?`, {
                  params: {
                     api_key: this.api_key
                  }
               }).then(res => {
                  res.data.cast.slice(0,6).forEach(person => {
                     cast.push(person.name);
                  });

                  tv.cast = cast.toString();
                  tvs.push(tv);
                  this.selectedTv = tvs;
               })
            })
         });
      },
      getGenre(id) {
         return this.genreNames[this.genreIds.indexOf(id)];
      },
      checkGenre(listIds) {
         if (this.selectedGenre == '' || this.selectedGenre == "all") {
            return true;
         }
         return listIds.includes(this.selectedGenre);
      },
      showOnlyTvs() {
         this.showTvs = true;
         this.showMovies = false;
         this.isHome = false;
         this.isTv = true;
         this.isMovie = false;
      },
      showOnlyMovies() {
         this.showTvs = false;
         this.showMovies = true;
         this.isHome = false;
         this.isTv = false;
         this.isMovie = true;
      },
      showAll() {
         this.showTvs = true;
         this.showMovies = true;
         this.isHome = true;
         this.isTv = false;
         this.isMovie = false;
      }
   },
   mounted() {

      // set genres
      axios.all([
         // film
         axios.get('https://api.themoviedb.org/3/genre/movie/list?', {
            params: {
               api_key: this.api_key
            }
         }),
         // serie tv
         axios.get('https://api.themoviedb.org/3/genre/tv/list?', {
            params: {
               api_key: this.api_key
            }
         })
      ])
      .then(axios.spread((obj1, obj2) => {
         var all = obj1.data.genres.concat(obj2.data.genres);
         all.forEach(genre => {
            if (!this.genreNames.includes(genre.name)) {
               this.genreNames.push(genre.name);
               this.genreIds.push(genre.id);
            }
         });
      }));

      // top movies
      this.getMovies("https://api.themoviedb.org/3/movie/popular?", 1);
      this.getTvs("https://api.themoviedb.org/3/tv/popular?", 1);


   }

});
