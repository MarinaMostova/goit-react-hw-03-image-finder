import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Button from './Button';
import fetchImages from 'servises/fetch-images';
import './App.css';

let page = 1;

class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    totalHits: 0,
    isLoading: false,
  };

  handleSubmit = inputData => {
    const searchQuery = inputData.toLowerCase().trim();

    if (searchQuery === '') {
      toast('What you are looking for?');
      return;
    } else {
      this.setState({ searchQuery, images: [], totalHits: 0, isLoading: true });
    }

    page = 1;

    fetchImages(searchQuery, page)
      .then(({ hits, totalHits }) => {
        if (totalHits === 0) {
          toast(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        this.setState({ totalHits, images: hits });
      })
      .catch(error => console.log(error))
      .finally(() =>
        this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
      );
  };

  onClickButton = () => {
    this.setState(({ isLoading }) => ({ isLoading: !isLoading }));

    fetchImages(this.state.searchQuery, (page += 1))
      .then(({ hits }) => {
        this.setState(({ images }) => ({
          images: [...images, ...hits],
        }));
      })
      .catch(error => console.log(error))
      .finally(() =>
        this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
      );
  };

  render() {
    const { images, totalHits, isLoading } = this.state;
    const allPages = totalHits / 12;
    return (
      <div className="app">
        <Searchbar onSubmit={this.handleSubmit} />

        {images && <ImageGallery images={images} />}

        {totalHits > 12 && allPages > page && !isLoading && (
          <Button onClick={this.onClickButton} />
        )}

        {isLoading && <Loader />}

        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}
//
export default App;
