import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import Moment from 'react-moment';

class Lyrics extends Component {
    state = {
        track: {},
        lyrics: {}
    }

    componentDidMount() {
        axios.get(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`)
            .then(response => {
                // console.log(response);
                this.setState({ lyrics: response.data.message.body.lyrics });
                return axios.get(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.get?track_id=${this.props.match.params.id}&apikey=${process.env.REACT_APP_MM_KEY}`)
                    .then(response => {
                        this.setState({ track: response.data.message.body.track });
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }


    render() {

        const { track, lyrics } = this.state;
        if (track === undefined || lyrics === undefined || Object.keys(track).length === 0 || Object.keys(lyrics).length === 0) {
            return <Spinner />
        }
        else {
            return (
                <>
                    <Link to="/" className="btn btn-dark btn-sm mb-4">Go back</Link>
                    <div className="card">
                        <h5 className="card-header">
                            {track.track_name} by <span className="text-secondary">{track.artist_name}</span>
                        </h5>
                        <div className="card-body">
                            {lyrics.lyrics_body}
                        </div>
                    </div>
                    <ul className="list-group mt-3">
                        <li className="list-group-item">
                            <strong>Album ID: </strong> {track.album_id}
                        </li>
                        <li className="list-group-item">
                            <strong>Genre: </strong> {track.primary_genres.music_genre_list[0].music_genre.music_genre_name}
                            {/* {console.log(track.primary_genres.music_genre_list[0].music_genre)} */}
                        </li>
                        <li className="list-group-item">
                            <strong>Explicit words: </strong> {track.explicit === 0 ? 'No' : 'Yes'}
                        </li>
                        <li className="list-group-item">
                            <strong>Release Date: </strong> <Moment format="D MMM YYYY">{track.updated_time}</Moment>
                        </li>
                    </ul>
                </>
            );
        }
    }
}

export default Lyrics;