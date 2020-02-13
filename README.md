# SHORT MOVIE FESTIVAL APIs

## Prerequisites
Make sure you have these installed on your machine:
* Node.js
* **npm** This comes with Node.js, but make sure you check if you have it anyway
* MySQL DB

## Technology
* Node.js (Express)
* MySQL DB
* Sequelize
* Json Web Token
 

## Run the migration
First of all, what we have to do is create a database withe the name **short-movie-festival**. After that, adjust the database configuration in the `config/config.js` file with your local database configuration. Then, run the migration files.
Now to actually create that table in database you need to run **`sequelize db:migrate`**.


## Run the seeders
To manage all data migrations you can use seeders. Seed files are some change in data that can be used to populate database table with sample data or test data.
To do that we need to run a simple command **`sequelize db:seed:all`**.


## API to generate Access Token

You need to encode your username and password to base64 and make a GET request to GET **`http://localhost:3000/token`**. Here are the complete steps:
* Visit base64encode.org
* Insert your username and password with the following format: username:password
* Encode to a base64 string. The encoded string will be like this: dXNlcm5hbWU6cGFzc3dvcmQ
* Make a GET request to http://localhost:3000/token and use the encoded string as the Basic Authorization Token. Example request:

`curl -X GET \
    "http://localhost:3000/token" \
    -H "Authorization: Basic YW5kcmV3aGl0ZToxMjM0NTY3OA" \
    -H 'Content-Length: 0' \
    -H 'User-Agent: PostmanRuntime/7.17.1'`


* If successful, you will receive an access token response. When an access token expires, you should request a new token. Example response:

`{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImFuZHJld2hpdGUiLCJjbGllbnRTZWNyZXQiOiIkMmIkMTAkWk5nZzRPbUlsMU5ZZGJaLlY1YwM0dGaHpmcHBZWEhNVmV0VVFkdlciLCJleHAiOjE1ODE2MTMzNDksImlhdCI6MTU4MTU4ODEyN30.h298Fy-_gwCoROo6dRL40CJrAuzCK8FUAXyvRvHSIHA",
    "expires_in": "2020-02-13T17:02:29.593Z"
}`

* You can use the access_token to make HTTP request, for example:

`curl -X GET \ 
 "http://localhost:3000/movies" \
 -H "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR"`



## API to register

For searching, downloading, and voting movies  you love, you will need to first register by following request:

### Example Request

`curl -X POST \
    "localhost:3000/users" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=my_username&password=my_password&name=my_name"`


### Example Response

`{
    "status": "ok",
    "messages": "data successfully created",
    "data": {
        "username": "my_username",
        "access_token": "eyJhbGciOiJIUzI1NiI.yMTgwLCJpYXQiOjE1ODE1OTc4NjZ9.9NWwTEGbIVMSxGEYVY_5AP47k",
        "expires_in": "2020-02-16T19:43:00.732Z",
        "registered_date": "2020-02-13T12:44:26.265Z"
    }
}`



## API to login

### Example Request

`curl -X PATCH \
    "http://localhost:3000/users/act/login" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=my_username&password=my_password"`

### Example Response

`{
    "status": "ok",
    "message": "login successfully",
    "data": {
        "username": "yoanesber",
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6InlvYW5lc2JlciIsImNsaWVudFNlY3JldCI6IjEyMzQ1Njc4IiwiZXhwIjoxNTgxODgzNDM5LCJpYXQiOjE1ODE1OTkwNDF9.zC7L-5rFr81VptzeU0FG81DUX1V1Goi262IMQf6CZjE",
        "expires_in": "2020-02-16T20:03:59.365Z",
        "logindate": "2020-02-13T20:03:59.365Z"
    }
}`



## API to logout

### Example Request

`curl -X PATCH \
    "http://localhost:3000/users/act/logout" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "message": "logout successfully",
    "data": {
        "username": "yoanesber",
        "logoutdate": "2020-02-13T20:07:37.051Z"
    }
}`



## API to create and upload movies. Required information related with a movies are at least title, description, duration, artists, genres, watch URL (which points to the uploaded movie file)

### Example Request

`curl -X POST \
    "http://localhost:3000/movies" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "title=Black Widow&description=Black Widow adalah film pahlawan super Amerika Serikat tahun 2020 yang didasarkan dari karakter Marvel Comics bernama sama. Film ini diproduksi Marvel Studios dan disalurkan Walt Disney Studios Motion Pictures. Film ini adalah film ke-24 Marvel Cinematic Universe&artists=Scarlett Johansson, Florence Pugh, Robert Downey, Jr., David Harbour&genres=ACT&watchUrl=https://www.youtube.com/watch?v=RxAtuMu_ph4&createdBy=1"`

### Example Response

`{
    "status": "ok",
    "messages": "data successfully created",
    "data": {
        "id": 12,
        "title": "Black Widow",
        "description": "Black Widow adalah film pahlawan super Amerika Serikat tahun 2020 yang didasarkan dari karakter Marvel Comics bernama sama. Film ini diproduksi Marvel Studios dan disalurkan Walt Disney Studios Motion Pictures. Film ini adalah film ke-24 Marvel Cinematic Universe",
        "artists": "Scarlett Johansson, Florence Pugh, Robert Downey, Jr., David Harbour",
        "genres": "ACT",
        "watchUrl": "https://www.youtube.com/watch?v=RxAtuMu_ph4",
        "createdBy": "1",
        "updatedAt": "2020-02-13T13:27:45.857Z",
        "createdAt": "2020-02-13T13:27:45.857Z"
    }
}`



## API to update movie

### Example Request

`curl -X PATCH \
    "http://localhost:3000/movies/12" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "title=Black Widow&description=Black Widow adalah film pahlawan super Amerika Serikat tahun 2020 yang didasarkan dari karakter Marvel Comics bernama sama. Film ini diproduksi Marvel Studios dan disalurkan Walt Disney Studios Motion Pictures. Film ini adalah film ke-24 Marvel Cinematic Universe&artists=Scarlett Johansson, Florence Pugh, Robert Downey, Jr., David Harbour&genres=HOR&watchUrl=https://www.youtube.com/watch?v=RxAtuMu_ph4&updatedBy=1"`

### Example Response

`{
    "status": "ok",
    "messages": "data successfully updated",
    "data": {
        "movieid": "12",
        "updateddate": "2020-02-13T20:32:49.265Z"
    }
}`



## API to list all movies with pagination

### Example Request

`curl -X GET \
    "http://localhost:3000/movies?l=1&p1" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "message": "querying successfully",
    "data": [
        {
            "id": 1,
            "title": "Parasite",
            "description": "Keluarga Ki-taek beranggotakan empat orang pengangguran dengan masa depan suram menanti mereka. Suatu hari Ki-woo anak laki-laki tertua direkomendasikan oleh sahabatnya yang merupakan seorang mahasiswa dari universitas bergengsi agar Ki-woo menjadi guru les yang dibayar mahal dan membuka secercah harapan penghasilan tetap. Dengan penuh restu serta harapan besar dari keluarga, Ki-woo menuju ke rumah keluarga Park untuk wawancara. Setibanya di rumah Mr. Park pemilik perusahaan IT global, Ki-woo bertemu dengan Yeon-kyo, wanita muda yang cantik di rumah itu. Setelah pertemuan itu, serangkaian kejadian dimulai.",
            "artists": "Cho Yeo jeong,Park So dam,Choi Woo shik,Song Kang ho",
            "genres": "COM",
            "watchUrl": "https://www.youtube.com/watch?v=isOGD_7hNIY",
            "isActive": true,
            "createdBy": 1,
            "updatedBy": 1,
            "createdAt": "2020-02-09T18:51:38.000Z",
            "updatedAt": "2020-02-09T18:51:38.000Z"
        }
    ]
}`



## API to search movie by title/description/artists/genres

### Example Request

`curl -X GET \
    "http://localhost:3000/movies?title=black" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "message": "querying successfully",
    "data": [
        {
            "id": 12,
            "title": "Black Widow",
            "description": "Black Widow adalah film pahlawan super Amerika Serikat tahun 2020 yang didasarkan dari karakter Marvel Comics bernama sama. Film ini diproduksi Marvel Studios dan disalurkan Walt Disney Studios Motion Pictures. Film ini adalah film ke-24 Marvel Cinematic Universe",
            "artists": "Scarlett Johansson, Florence Pugh, Robert Downey, Jr., David Harbour",
            "genres": "HOR",
            "watchUrl": "https://www.youtube.com/watch?v=RxAtuMu_ph4",
            "isActive": true,
            "createdBy": 1,
            "updatedBy": null,
            "createdAt": "2020-02-13T13:27:45.000Z",
            "updatedAt": "2020-02-13T13:32:49.000Z"
        }
    ]
}`



## API to see most viewed genre, as an admin

### Example Request

`curl -X GET \
    "localhost:3000/movies/mostviewed/by/genre/COM" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "message": "querying successfully",
    "data": {
        "number_of_movies": 2,
        "records": [
            {
                "movie_title": "Joker",
                "movie_genre": "DRA",
                "number_of_viewers": 3,
                "viewers": [
                    {
                        "viewer_username": "andrewhite",
                        "view_date": "2020-02-11T02:00:22.000Z"
                    },
                    {
                        "viewer_username": "yoanesber",
                        "view_date": "2020-02-11T02:00:27.000Z"
                    },
                    {
                        "viewer_username": "jimtron",
                        "view_date": "2020-02-11T02:00:32.000Z"
                    }
                ]
            },
            {
                "movie_title": "Ford v Ferrari",
                "movie_genre": "DRA",
                "number_of_viewers": 2,
                "viewers": [
                    {
                        "viewer_username": "andrewhite",
                        "view_date": "2020-02-11T03:23:52.000Z"
                    },
                    {
                        "viewer_username": "yoanesber",
                        "view_date": "2020-02-11T03:23:57.000Z"
                    }
                ]
            }
        ]
    }
}`



## API to see most viewed movies, as an admin

### Example Request

`curl -X GET \
    "localhost:3000/movies/mostviewed/all" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response
`{
    "status": "ok",
    "message": "querying successfully",
    "data": {
        "number_of_movies": 2,
        "records": [
            {
                "movie_title": "Parasite",
                "movie_genre": "COM",
                "number_of_viewers": 4,
                "viewers": [
                    {
                        "viewer_username": "andrewhite",
                        "view_date": "2020-02-11T01:59:09.000Z"
                    },
                    {
                        "viewer_username": "yoanesber",
                        "view_date": "2020-02-11T01:59:58.000Z"
                    },
                    {
                        "viewer_username": "jimtron",
                        "view_date": "2020-02-11T02:00:07.000Z"
                    },
                    {
                        "viewer_username": "jordyman",
                        "view_date": "2020-02-11T02:00:13.000Z"
                    }
                ]
            },
            {
                "movie_title": "Joker",
                "movie_genre": "DRA",
                "number_of_viewers": 3,
                "viewers": [
                    {
                        "viewer_username": "andrewhite",
                        "view_date": "2020-02-11T02:00:22.000Z"
                    },
                    {
                        "viewer_username": "yoanesber",
                        "view_date": "2020-02-11T02:00:27.000Z"
                    },
                    {
                        "viewer_username": "jimtron",
                        "view_date": "2020-02-11T02:00:32.000Z"
                    }
                ]
            }
        ]
    }
}`



## API to vote a movie as an authenticated user

### Example Request

`curl -X POST \
    "localhost:3000/movies/act/vote/4?r=5" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "message": "movie successfully voted",
    "data": {
        "movietitle": "The Lighthouse",
        "moviegenre": "HOR",
        "rating": 5,
        "voterusername": "yoanesber",
        "votedate": "2020-02-13T14:21:27.615Z"
    }
}`



## API to unvote a movie as an authenticated user

### Example Request

`curl -X PATCH \
    "localhost:3000/movies/act/unvote/4" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "messages": "movie successfully unvoted",
    "data": {
        "movie_id": "6",
        "voter_username": "yoanesber",
        "unvotedate": "2020-02-13T21:19:30.829Z"
    }
}`



## API to list all of the user’s voted movie

### Example Request

`curl -X GET \
    "localhost:3000/movies/voted/all" \
    -H "Authorization: Token eyJhbGciOiJIUzI1NiIkpXVCJ9.eyJRJZCI6ImFuZHJld2hpdG.NdCtoW6apBSedR" \
    -H "Content-Type: application/x-www-form-urlencoded"`

### Example Response

`{
    "status": "ok",
    "message": "querying successfully",
    "data": {
        "number_of_movies": 3,
        "records": [
            {
                "movie_title": "Parasite",
                "movie_genre": "COM",
                "avg_rating": "4.50",
                "number_of_voters": 2,
                "voters": [
                    {
                        "voter_username": "yoanesber",
                        "rating": 5
                    },
                    {
                        "voter_username": "jimtron",
                        "rating": 4
                    }
                ]
            },
            {
                "movie_title": "Joker",
                "movie_genre": "DRA",
                "avg_rating": "3.67",
                "number_of_voters": 3,
                "voters": [
                    {
                        "voter_username": "andrewhite",
                        "rating": 3
                    },
                    {
                        "voter_username": "yoanesber",
                        "rating": 4
                    },
                    {
                        "voter_username": "jimtron",
                        "rating": 4
                    }
                ]
            },
            {
                "movie_title": "Avengers: Endgame",
                "movie_genre": "ACT",
                "avg_rating": "2.00",
                "number_of_voters": 3,
                "voters": [
                    {
                        "voter_username": "andrewhite",
                        "rating": 2
                    },
                    {
                        "voter_username": "yoanesber",
                        "rating": 2
                    },
                    {
                        "voter_username": "jimtron",
                        "rating": 2
                    }
                ]
            }
        ]
    }
}`
