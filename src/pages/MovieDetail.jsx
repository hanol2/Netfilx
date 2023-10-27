import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import { SessionStorage } from 'react';
import axios from '../axios';

const MovieDetail = () => {
    // useParams 
    // Route 작성하는 부분에 /:id <- path 작성. 작성한 이 부분을 넣어주면 됨
    const { id } = useParams();

    // useSearchParams 
    // url을 작성하는 부분에 ?type= ~~
    const [params, setParams] = useSearchParams();
    const type = params.get('type');
    // console.log(`내가 가져온 영화의 id 는 ${id}이고, 타입은 ${type}`)

    // redux에 있는 데이터 가져옴 
    const { popularMovies, topRatedMovies, upComingMovies } = useSelector(state => state.movies);

    const [movie, setMovie] = useState();
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState([]);

    /** 내가 가져올 영화에 대한 데이터를 추출하는 함수 */
    const getMovieData = () => {
        if (type === 'popularMovies') {
            setMovie(popularMovies.results.find((item) => item.id == id))
        } else if (type === 'topRatedMovies') {
            setMovie(topRatedMovies.results.find((item) => item.id == id))
        } else if (type === 'upComingMovies') {
            setMovie(upComingMovies.results.find((item) => item.id == id))
        }
    }
    // 내가 선택한 영화에 대한 리뷰를 가져오는 함수
    const getReviewData = () => {
        axios
             .get(`/${id}/reviews`)
             .then(res => setReview(res.data.results))
    }


    useEffect(() => {
        // console.log('현재 movie', movie)
        if (movie) {
            // movie라는 state에 새로운 값이 들어가면, 그 값을 sessionStorage 안에 저장
            sessionStorage.setItem('movie', JSON.stringify(movie));
            // stfingify()=> undefine을 인지해야하기 때문에 movie가 배열형식이면 안됨!
            getReviewData();
        }
    }, [movie])

    // redux의 값이 가지고 와졌을 때,

    useEffect(() => {
        const sessionMovie = JSON.parse(sessionStorage.getItem('movie'))
        // console.log('session Movie', sessionMovie)
        // 세션 안에 값이 존재하면 (이미 클릭한 전적) => 세션안에 있는 값을 movie 세팅

        // 세션 안에 값이 없다면 (최초 클릭) => Redux로 가서 movie세팅
        if (sessionMovie) {
            setMovie(sessionMovie)
        } else {
            getMovieData();
        }
        setLoading(false);
    }, [
        popularMovies,
        topRatedMovies,
        upComingMovies,
        id,
        type
    ])

    if (loading) {
        return (
            <ClipLoader
                color='#f05f5f'
                loading={loading}
                size={50}
                margin={100}
                speedMultiplier={1}>
            </ClipLoader>
        )
    }
    return (
        <div className='movie-detail'>
            {movie &&
                <div className='movie-box'>
                    <div
                        className='detail-poster'
                        style={{
                            backgroundImage: `url(https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path})`,
                        }}>
                    </div>
                    <br></br>
                    <div className='detail-item'>
                        {movie.adult == false ?
                            <Badge bg="success">전체관람가</Badge> :
                            <Badge bg="danger">청소년관람불가</Badge>}
                        <h1>{movie.title}</h1>
                        <div>
                            <span>평점 : {movie.vote_average}점</span> {" "}
                            <span>개봉일 : {movie.release_date}</span>
                        </div>
                        <div className='detailText'>{movie.overview}</div>

                        <hr />
                        <h2>Review</h2>

                        {review.length === 0
                        ? <div>등록된 리뷰가 없습니다</div>
                        : (review.map(item =>
                            <div key={item.id}>
                                <hr />
                                <p>{item.content}</p>
                                <p>
                                    작성자 :{item.author} |
                                    작성일 : {item.created_at}
                                </p>
                            </div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default MovieDetail