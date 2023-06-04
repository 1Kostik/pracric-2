import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isEmpty: false,
    isLoading: false  
    }

  componentDidUpdate(prevProps, prevState) {
    const {query, page}=this.state
    if (prevState.query !== query) {
      this.getPhotos(query, page)
   }
   console.log(this.state)
 }



  handleSubmitQuery = (name) => {
    this.setState({ query: name, images: [], isEmpty: false ,page:1});

  }

  getPhotos = async (query, page) => {
    this.setState({isLoading:true})
    try {
      const { photos } = await ImageService.getImages(query, page);
      if (photos.length === 0) {
        this.setState({ isEmpty: true });
        return;
      }
      this.setState(({ images }) => ({ images: [...images, ...photos] }));
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
    
    
  }

  render() {
    const { images, isEmpty,isLoading } = this.state;
    const isShowImages = images.length > 0;
    return (
      <>
        <SearchForm onSubmit={this.handleSubmitQuery} />
        {isShowImages && (
          <Grid>
            {images.map(({ src: { medium }, alt, id }) => {
              return (
                <GridItem key={id}>
                  <CardItem>
                    <img src={medium} alt={alt} />
                  </CardItem>
                </GridItem>
              );
            })}
          </Grid>
        )}
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {isLoading && (
          <Text textAlign="center">Loading ...</Text>
        )}
      </>
    );
  }
}
