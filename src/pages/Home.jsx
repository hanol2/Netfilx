import React,{ useEffect, useState } from 'react';
import Banner from '../components/Banner';
import axios from '../axios';
import { useDispatch, useSelector } from 'react-redux'
import MovieSlice, { getPopularMovies, getTopRatedMovies, getUpComingMovies } from '../redux/movieSlice';
// import  PacmanLoader  from 'react-spinners/PacmanLoader';
import { PacmanLoader } from 'react-spinners';
import MovieSlide from '../components/MovieSlide';

const Home = () => {

    // 기존에 있던 session Movie를 지워버릴거임!
    sessionStorage.removeItem('movie');
    
    const dispatch = useDispatch();
    const {popularMovies, topRatedMovies, upComingMovies} = useSelector(state => state.movies);
    const [loading, setLoading] = useState(true);

    // 화면이 렌더링 되자마자 API를 가져올 것.
    useEffect(()=>{
        const popularApi = axios.get('/popular?language=ko-KR&page=1');
        const topRatedApi = axios.get('/top_rated?language=ko-KR&page=1');
        const upComingApi = axios.get('/upcoming?language=ko-KR&page=1');

        // promise all을 사용하여 여러번의 api요청을 병렬로 처리
        Promise
        .all([popularApi, topRatedApi, upComingApi])
        .then(res => {
            // console.log(res)
            // API에서 담아온 데이터를 store에 저장하고 싶을 때 -> useDispatch
            dispatch(getPopularMovies(res[0].data))
            dispatch(getTopRatedMovies(res[1].data))
            dispatch(getUpComingMovies(res[2].data))
        }).then(()=>{
            setLoading(false);
        });
    }, [])
    
    // store에 값이 들어갔는지 확인해보는 용도
    useEffect(()=>{
        // console.log('store의 상태', popularMovies, topRatedMovies, upComingMovies)
    }, [popularMovies, topRatedMovies, upComingMovies])
    
    if(loading){
        return(
        <PacmanLoader
        color="#ffffff"
        loading={loading}
        size={50}
        speedMultiplier={1}>
        </PacmanLoader>
            )
    }
    return (
        <div>
            {/* {
                popularMovies.results ? <p><Banner movies={popularMovies.results[0]}/></p> : null
            } */}
            
            {/*  LifeCycle 생명주기 - 컴포넌트 
                - popularMovies 라는 애가 존재하면? > result
                - 존재하지 않는 다면 배너를 띄울 필요 엄슴
             */}

            {/* 로딩스피너를 만들면 데이터가 안왔을 때는 
            로딩만 리턴이 되기 때문에 별도로 조건부 처리를 해 줄 필요가 있다. */}
            
            {popularMovies.results && <Banner movies={popularMovies.results[2]}/>}
            
            {/* 카드 슬라이드 */}
            <section>

            <p>Popular Movies</p>
            <MovieSlide movies={popularMovies} type="popularMovies"></MovieSlide>
            
            {/* 카드 슬라이드 */}
            <p>TopRated Movies</p>
            <MovieSlide movies={topRatedMovies} type="topRatedMovies"></MovieSlide>
            
            {/* 카드 슬라이드 */}
            <p>UpComing Movies</p>
            <MovieSlide movies={upComingMovies} type="upComingMovies"></MovieSlide>
            </section>

        </div>
    )
}

export default Home