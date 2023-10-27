import React from 'react'

const Banner = ({movies}) => {
    let imgUrl = 'https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/' + movies.poster_path;
   // console.log(imgUrl)
    return (
        // 배너 이미지를 포스터로 띄우고, 그 위에 제목
        <div className='banner-img' style={{ backgroundImage: `url(${imgUrl})` }}>
            {/* <div className='shadowbox'> */}
                <div className='banner-item'>
                    <h1>{movies.title}</h1>
                    <p>{movies.overview}</p>
                </div>
            {/* </div> */}
        </div>
    )
}

export default Banner